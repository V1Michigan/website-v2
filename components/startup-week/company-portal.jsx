"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useShortlistDraft } from "@/lib/startup-week/use-shortlist-draft";
import { useParams } from "next/navigation";
import axios from "axios";
import { Maximize2, Minimize2 } from "lucide-react";
import styles from "./company-portal.module.css";
import { motion, useReducedMotion } from "framer-motion";
import { CandidateBrowser, StudentProfile } from "./candidate-browser";
import { useAuth } from "@/lib/startup-week/use-auth";

const CompanyPortalHelp = dynamic(() => import("./company-portal-help"), {ssr: false});

// Company portal for Startup Week.
//   /startupweek/company/:slug
// Lets a startup browse student resumes and build a ranked pick list, then
// submit it to POST /api/startup-week/companies/:slug/preferences after Google sign-in.

export default function CompanyPortal() {
  const { slug } = useParams();
  const { user, token, loading: authLoading, signIn, signOut, authError, signingIn, signingOut } = useAuth();

  if (authLoading) return <TalentLoading />;
  if (!user || !token) return <LoginScreen onSignIn={signIn} error={authError} signingIn={signingIn} />;
  if (!slug) return <TalentLoading />;
  return <CompanyEditor key={`${slug}:${user.id}:${user.email}`} slug={slug} user={user} token={token} signOut={signOut} signOutError={authError} signingOut={signingOut} />;
}

export function CompanyEditor({ slug, user, token, signOut, signOutError, signingOut }) {
  const tabIndicatorId = useId();
  const reduceMotion = useReducedMotion();
  const [students, setStudents] = useState([]);
  const [profileSchemaReady, setProfileSchemaReady] = useState(true);
  const [studentDetailsReady, setStudentDetailsReady] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState("interested");
  const {picks, dirty, status: saveState, error: saveError, initialize, edit: editPicks, save} = useShortlistDraft(slug, token);
  const [leaving, setLeaving] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyQuestion, setCompanyQuestion] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [candidateOrder, setCandidateOrder] = useState([]);
  const openCandidate = (student, order) => {
    setCandidateOrder(order || []);
    setSelectedStudent(student);
  };
  const [touring, setTouring] = useState(false);
  const closeProfile = useCallback(() => setSelectedStudent(null), []);
  const openFirstProfile = useCallback(() => setSelectedStudent(students[0] || null), [students]);
  const [loading, setLoading] = useState(true);
  const [minimumLoadingElapsed, setMinimumLoadingElapsed] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumLoadingElapsed(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);
  const [error, setError] = useState("");

  // Load students + this company's existing picks once we have a slug + token.
  useEffect(() => {
    if (!slug || !token) return;
    let cancelled = false;
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    (async () => {
      setLoading(true);
      setError("");
      try {
        const [studentsRes, prefsRes] = await Promise.all([
          axios.get("/api/startup-week/students", {...authHeader, params: {company_slug: slug}}),
          axios.get(`/api/startup-week/companies/${slug}/preferences`, authHeader),
        ]);
        if (cancelled) return;
        setStudents(studentsRes.data.students || []);
        setProfileSchemaReady(studentsRes.data.profile_schema_ready !== false);
        setStudentDetailsReady(studentsRes.data.student_details_ready !== false);
        setCompanyName(prefsRes.data.company || "");
        setCompanyDescription(prefsRes.data.description || "");
        setCompanyQuestion(prefsRes.data.company_question || "");
        // preferences come back rank-ordered; drop rank and keep order + note
        initialize(
          (prefsRes.data.preferences || []).map((p) => ({
            student_id: p.student_id,
            note: p.note || "",
          })), prefsRes.data.version
        );
      } catch (err) {
        if (cancelled) return;
        const status = err.response?.status;
        if (status === 404) {
          setError("Company not found. Check your portal link.");
        } else if (status === 401) {
          setError("Your sign-in session is no longer valid. Please sign out and sign in again.");
        } else if (status === 403) {
          setError(
            `${user?.email || "This account"} isn't authorized for this portal. ` +
              "Sign in with the email your company registered with."
          );
        } else {
          setError(err.response?.data?.error || "Failed to load. Try refreshing.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []); // Identity changes remount this editor; token refresh must preserve drafts.

  useEffect(() => {
    if (!expanded) return undefined;
    const collapse = event => {
      if (event.key === "Escape" && !event.defaultPrevented && !document.querySelector('[role="dialog"]')) setExpanded(false);
    };
    window.addEventListener("keydown", collapse);
    return () => window.removeEventListener("keydown", collapse);
  }, [expanded]);

  const pickedIds = useMemo(
    () => new Set(picks.map((p) => p.student_id)),
    [picks]
  );

  const addPick = (id) =>
    editPicks((prev) => prev.some(p => p.student_id === id) ? prev : [...prev, { student_id: id, note: "" }]);
  const removePick = (id) =>
    editPicks((prev) => prev.filter((p) => p.student_id !== id));
  const setNote = (id, note) =>
    editPicks((prev) =>
      prev.map((p) => (p.student_id === id ? { ...p, note } : p))
    );
  const reorderPicks = (activeId, overId) =>
    editPicks(prev => {
      const from = prev.findIndex(pick => pick.student_id === activeId);
      const to = prev.findIndex(pick => pick.student_id === overId);
      if (from < 0 || to < 0 || from === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  const handleSignOut = async () => {
    if (leaving || saveState === "saving") return;
    setLeaving(true);
    try {
      if (dirty && !window.confirm("You have unsaved shortlist changes. Sign out and discard them?")) return;
      await signOut();
    } finally { setLeaving(false); }
  };

  const loadLatest = async () => {
    if (saveState === "saving" || leaving) return;
    if (dirty && !window.confirm("Discard your unsaved edits and load the latest saved shortlist?")) return;
    setLeaving(true);
    try {
      const {data} = await axios.get(`/api/startup-week/companies/${slug}/preferences`, {headers: {Authorization: `Bearer ${token}`}});
      initialize((data.preferences || []).map(p => ({student_id: p.student_id, note: p.note || ""})), data.version);
    } catch { window.alert("Could not load the latest shortlist. Your edits are still here. Please try again."); }
    finally { setLeaving(false); }
  };

  if (loading || !minimumLoadingElapsed) {
    return <TalentLoading />;
  }
  if (error) {
    return (
      <CenterMessage>
        <span className="block mb-4">{error}</span>
        {signOutError && <p role="alert" className="mb-4 text-sm text-red-700">{signOutError}</p>}
        <button
          disabled={signingOut || leaving}
          onClick={handleSignOut}
          className="text-sm font-bold text-black bg-accent py-2 px-4 rounded-md"
        >
          {signingOut ? "Signing out…" : "Sign out and sign in again"}
        </button>
      </CenterMessage>
    );
  }

  return (
    <main data-expanded={expanded} className={`mx-auto flex min-h-0 w-full flex-1 flex-col overflow-hidden px-4 py-4 md:px-6 ${expanded ? styles.expanded : "max-w-7xl lg:px-8"}`}>
      <header hidden={expanded} className="mb-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <p className="uppercase tracking-[0.16em]">Startup Week · Company portal</p>
          <div className="flex flex-wrap items-center gap-3"><span>{user.email}</span><button disabled={signingOut || leaving} onClick={handleSignOut} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-[#444444] hover:bg-white disabled:opacity-50">{signingOut || leaving ? "Signing out…" : "Sign out"}</button></div>
        </div>
        <h1 className="mt-3 font-instrument text-5xl sm:text-6xl font-normal leading-tight">{companyName || "Company"}</h1>
        {signOutError && <p role="alert" className="mt-2 text-sm text-red-700">{signOutError}</p>}
      </header>
      <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200">
        {expanded && <h1 className="py-3 text-sm font-semibold">{{interested: "Interested", all: "All Candidates", shortlist: "Shortlist", profile: "Company Profile"}[view]}</h1>}
        <nav aria-label="Company portal sections" className={expanded ? "hidden" : "flex max-w-full gap-5 overflow-x-auto"}>
          {[["interested", "Interested", students.filter(student => student.is_interested).length], ["all", "All Candidates", students.length], ["shortlist", "Shortlist", picks.length], ["profile", "Company Profile", null]].map(([key, label, count]) => <button type="button" key={key} data-tour={`portal-tab-${key}`} onClick={() => setView(key)} aria-pressed={view === key} className={`relative shrink-0 border-b-2 border-transparent py-3 text-sm font-medium ${view === key ? "text-[#444444]" : "text-gray-500 hover:text-gray-900"}`}>{label}{count !== null && <span className="ml-1.5 text-xs text-gray-500">{count}</span>}{view === key && <motion.span aria-hidden="true" layoutId={tabIndicatorId} initial={false} transition={{duration: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1]}} className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#E5AC61]" />}</button>)}
        </nav>
        <div className="mb-2 flex items-center gap-3">
      <div data-tour="shortlist-save" className="flex items-center gap-2">
        <span role="status" aria-live="polite" className="text-xs text-gray-500">{saveState === "saving" ? "Saving…" : dirty ? "Unsaved changes" : saveState === "saved" ? "All changes saved" : "No unsaved changes"}</span>
        <button type="button" disabled={!dirty || leaving || saveState === "saving" || saveState === "conflict"} onClick={() => void save()} className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40">Save shortlist</button>
      </div>
          {!expanded && <CompanyPortalHelp companyName={companyName} view={view} setView={setView} closeProfile={closeProfile} openFirstProfile={openFirstProfile} hasCandidates={students.length > 0} onRunChange={setTouring} />}
          <button data-tour="expand-view" type="button" aria-pressed={expanded} aria-label={expanded ? "Exit expanded view" : "Expand current tab"} onClick={() => setExpanded(value => !value)} className="inline-flex shrink-0 items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-white">{expanded ? <Minimize2 size={16} aria-hidden="true" /> : <Maximize2 size={16} aria-hidden="true" />}{expanded ? "Collapse" : "Expand"}</button>
        </div>
      </div>

      {saveError && <div role="alert" className="mb-3 shrink-0 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">{saveError} {saveState === "conflict" && <button type="button" disabled={leaving} onClick={() => void loadLatest()} className="ml-2 font-semibold underline underline-offset-4">Load latest (discard draft)</button>}</div>}
      <fieldset disabled={leaving} className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className={view === "profile" ? "hidden" : "flex min-h-0 flex-1 flex-col"}>
          <CandidateBrowser onReorder={reorderPicks} expanded={expanded} fillHeight hideHeading view={view} onBrowseAll={() => setView("all")} profileSchemaReady={profileSchemaReady} students={students} studentDetailsReady={studentDetailsReady} pickedIds={pickedIds} shortlistOrder={picks.map(pick => pick.student_id)} onAdd={addPick} onRemove={removePick} onOpen={openCandidate} />
        </div>
        <section aria-label="Company profile" className={view !== "profile" ? "hidden" : "min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"}>
          <h2 className="mb-5 text-base font-semibold">Company Profile</h2>
          <dl className="space-y-6"><div><dt className="mb-2 text-xs font-medium text-gray-500">Company name</dt><dd className="text-lg font-medium">{companyName || "Company"}</dd></div><div><dt className="mb-2 text-xs font-medium text-gray-500">Description</dt><dd className="whitespace-pre-wrap text-sm leading-relaxed">{companyDescription || "No company description on file."}</dd></div><div><dt className="mb-2 text-xs font-medium text-gray-500">Company question</dt><dd className="whitespace-pre-wrap break-words text-sm leading-relaxed">{companyQuestion.trim() || "No company question provided."}</dd></div></dl>
        </section>
      </fieldset>
      <StudentProfile candidateOrder={candidateOrder} onNavigate={setSelectedStudent} companyQuestion={companyQuestion} touring={touring} student={selectedStudent} onClose={() => setSelectedStudent(null)} onAdd={addPick} onRemove={removePick} picked={!!selectedStudent && pickedIds.has(selectedStudent.id)} saving={leaving}>
        <section aria-label="Notes" className="border-t border-gray-200 pt-4">
          <h3 className="mb-2 text-sm font-semibold">Notes</h3>
          {selectedStudent && pickedIds.has(selectedStudent.id) ? <>
            <textarea aria-label={`Notes for ${selectedStudent.name}`} disabled={leaving} maxLength={10000} value={picks.find(pick => pick.student_id === selectedStudent.id)?.note || ""} onChange={event => setNote(selectedStudent.id, event.target.value)} placeholder="Add a note (optional)" className="block min-h-24 w-full rounded-md border border-gray-300 bg-white/60 p-3 text-sm font-normal text-[#444444]" />
            <p className="mt-1 text-xs text-gray-500">Notes are included when you click Save shortlist.</p>
          </> : <p className="text-sm text-gray-500">Add to shortlist to add a note</p>}
        </section>
      </StudentProfile>
    </main>
  );
}

function TalentLoading() {
  return <div role="status" aria-live="polite" className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-4 py-6">
    <Image src="/brand/v1-login-logo.png" width={128} height={124} alt="V1" priority className="h-auto w-32 rounded-xl" />
    <p className="text-center text-lg font-medium text-[#444444] sm:text-xl">
      <span className="sr-only">Loading top Michigan talent…</span>
      <span aria-hidden="true">Loading top Michigan talent<span className="ml-0.5 inline-flex">{[0, 1, 2].map(index => <span key={index} className={styles.loadingDot} style={{animationDelay: `${index * 150}ms`}}>.</span>)}</span></span>
    </p>
  </div>;
}

function CenterMessage({ children }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-6">
      <div className="text-gray-600 text-center">{children}</div>
    </div>
  );
}

function LoginScreen({ onSignIn, error, signingIn }) {
  return (
    <>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-6">
        <div className="max-w-lg w-full text-center">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-gray-500">V1 Michigan · Company portal</p>
          <h1 className="font-instrument text-5xl sm:text-6xl font-normal leading-tight text-[#444444]">
            Startup Week
          </h1>
          <p className="mx-auto max-w-sm text-gray-600 text-base leading-relaxed mt-5 mb-8">
            Sign in with the Google account your company registered with to
            review resumes and submit your picks.
          </p>
          <button
            onClick={onSignIn}
            disabled={signingIn}
            className="text-sm font-medium text-[#191919] bg-yellow-400 hover:bg-yellow-300 py-3 px-8 rounded-md disabled:opacity-50"
          >
            {signingIn ? "Redirecting…" : "Sign in with Google"}
          </button>
          {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        </div>
      </div>
    </>
  );
}
