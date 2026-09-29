"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/lib/startup-week/use-auth";

// Company portal for Startup Week.
//   /startupweek/company/:slug
// Lets a startup browse student resumes and build a ranked pick list, then
// submit it to POST /api/startup-week/companies/:slug/preferences after Google sign-in.

export default function CompanyPortal() {
  const { slug } = useParams();
  const { user, token, loading: authLoading, signIn, signOut, authError, signingIn } = useAuth();

  if (authLoading) return <CenterMessage>Checking sign-in…</CenterMessage>;
  if (!user || !token) return <LoginScreen onSignIn={signIn} error={authError} signingIn={signingIn} />;
  if (!slug) return <CenterMessage>Loading portal…</CenterMessage>;
  return <CompanyEditor key={`${slug}:${user.id}:${user.email}`} slug={slug} user={user} token={token} signOut={signOut} />;
}

export function CompanyEditor({ slug, user, token, signOut }) {
  const [students, setStudents] = useState([]);
  const [recommended, setRecommended] = useState([]); // admin-curated fits
  const [tab, setTab] = useState("recommended"); // recommended | all
  const [picks, setPicks] = useState([]); // ordered array of { student_id, note }
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [dirty, setDirty] = useState(false); // unsaved edits to the pick list?

  // Load students + this company's existing picks once we have a slug + token.
  useEffect(() => {
    if (!slug || !token) return;
    let cancelled = false;
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    (async () => {
      setLoading(true);
      setError("");
      try {
        const [studentsRes, prefsRes, recRes] = await Promise.all([
          axios.get("/api/startup-week/students", authHeader),
          axios.get(`/api/startup-week/companies/${slug}/preferences`, authHeader),
          axios.get(`/api/startup-week/companies/${slug}/recommended`, authHeader),
        ]);
        if (cancelled) return;
        setStudents(studentsRes.data.students || []);
        setRecommended(recRes.data.students || []);
        setCompanyName(prefsRes.data.company || "");
        setCompanyDescription(prefsRes.data.description || "");
        // preferences come back rank-ordered; drop rank and keep order + note
        setPicks(
          (prefsRes.data.preferences || []).map((p) => ({
            student_id: p.student_id,
            note: p.note || "",
          }))
        );
        setDirty(false);
      } catch (err) {
        if (cancelled) return;
        const status = err.response?.status;
        if (status === 404) {
          setError("Company not found. Check your portal link.");
        } else if (status === 401 || status === 403) {
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

  const pickedIds = useMemo(
    () => new Set(picks.map((p) => p.student_id)),
    [picks]
  );

  const studentsById = useMemo(() => {
    const m = new Map();
    students.forEach((s) => m.set(s.id, s));
    return m;
  }, [students]);

  const visibleStudents = useMemo(() => {
    const source = tab === "recommended" ? recommended : students;
    const q = search.trim().toLowerCase();
    return source.filter((s) => {
      if (pickedIds.has(s.id)) return false;
      if (!q) return true;
      return [s.name, s.school, s.major, s.grad_year]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(q));
    });
  }, [tab, recommended, students, pickedIds, search]);

  // Warn before leaving the tab with unsaved picks.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Any edit to the pick list marks it dirty so the UI can prompt a save.
  const editPicks = (updater) => {
    if (saveState === "saving") return;
    setSaveState("idle");
    setPicks(updater);
    setDirty(true);
  };
  const addPick = (id) =>
    editPicks((prev) => [...prev, { student_id: id, note: "" }]);
  const removePick = (id) =>
    editPicks((prev) => prev.filter((p) => p.student_id !== id));
  const setNote = (id, note) =>
    editPicks((prev) =>
      prev.map((p) => (p.student_id === id ? { ...p, note } : p))
    );
  const move = (index, delta) =>
    editPicks((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const save = async () => {
    if (saveState === "saving") return;
    setSaveState("saving");
    try {
      const preferences = picks.map((p, i) => ({
        student_id: p.student_id,
        rank: i + 1,
        note: p.note || null,
      }));
      await axios.post(
        `/api/startup-week/companies/${slug}/preferences`,
        { preferences },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaveState("saved");
      setDirty(false);
    } catch (err) {
      setSaveState("error");
    }
  };

  if (loading) {
    return <CenterMessage>Loading resumes…</CenterMessage>;
  }
  if (error) {
    return (
      <CenterMessage>
        <span className="block mb-4">{error}</span>
        <button
          onClick={() => { if (!dirty || window.confirm("Discard unsaved picks and sign out?")) signOut(); }}
          className="text-sm font-bold text-black bg-accent py-2 px-4 rounded-md"
        >
          Sign in with a different account
        </button>
      </CenterMessage>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="bg-gray-800 border-b-4 border-yellow-400 px-4 py-6">
          <div className="max-w-6xl mx-auto flex justify-between items-start gap-4">
            <div>
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
                V1 Startup Week
              </p>
              <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight mt-1">
                {companyName || "Company"}{" "}
                <span className="text-gray-400 font-medium">Portal</span>
              </h1>
              <p className="text-gray-300 mt-1 text-sm">
                Browse student resumes and build your ranked pick list — rank 1 is
                your top choice.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-gray-400 text-xs">{user.email}</p>
              <button
                onClick={() => { if (!dirty || window.confirm("Discard unsaved picks and sign out?")) signOut(); }}
                className="text-gray-300 text-xs underline mt-1 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        {companyDescription && (
          <div className="max-w-6xl mx-auto px-4 pt-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Your company profile
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {companyDescription}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                This is what the V1 team has on file. Contact them to update it.
              </p>
            </div>
          </div>
        )}

        <main className="max-w-6xl mx-auto px-4 py-8">
          <fieldset disabled={saveState === "saving"} className="grid md:grid-cols-2 gap-8 min-w-0">
          {/* Resume browser */}
          <section>
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              <TabButton
                active={tab === "recommended"}
                onClick={() => setTab("recommended")}
              >
                Recommended for you ({recommended.length})
              </TabButton>
              <TabButton active={tab === "all"} onClick={() => setTab("all")}>
                All resumes ({students.length})
              </TabButton>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, school, major…"
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-yellow-400"
            />
            <ul className="space-y-3">
              {tab === "recommended" && recommended.length === 0 && (
                <li className="text-gray-500 text-sm">
                  No recommendations yet — check the <strong>All resumes</strong>{" "}
                  tab, or ask the V1 team to add recommendations.
                </li>
              )}
              {visibleStudents.map((s) => (
                <StudentCard key={s.id} student={s}>
                  <button
                    onClick={() => addPick(s.id)}
                    className="text-sm font-bold text-black bg-accent py-1 px-3 rounded-md hover:bg-yellow-500 transition-colors"
                  >
                    + Add
                  </button>
                </StudentCard>
              ))}
              {visibleStudents.length === 0 &&
                !(tab === "recommended" && recommended.length === 0) && (
                  <li className="text-gray-500 text-sm">No matching resumes.</li>
                )}
            </ul>
          </section>

          {/* Ranked pick list */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">
                Your picks ({picks.length})
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {!dirty && saveState === "saved" && (
                  <span className="text-green-600 text-sm">All changes saved ✓</span>
                )}
                {dirty && saveState !== "saving" && (
                  <span className="text-yellow-600 text-sm">Unsaved changes</span>
                )}
                {saveState === "error" && (
                  <span className="text-red-600 text-sm">Save failed</span>
                )}
                <button
                  onClick={save}
                  disabled={saveState === "saving" || !dirty}
                  className="text-sm font-bold text-white bg-gray-800 py-2 px-4 rounded-md disabled:opacity-50"
                >
                  {saveState === "saving" ? "Saving…" : "Save picks"}
                </button>
              </div>
            </div>
            <ol className="space-y-3">
              {picks.map((p, i) => {
                const s = studentsById.get(p.student_id);
                if (!s) return null;
                return (
                  <StudentCard key={p.student_id} student={s} rank={i + 1}>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex gap-1">
                        <MoveBtn onClick={() => move(i, -1)} disabled={i === 0}>
                          ↑
                        </MoveBtn>
                        <MoveBtn
                          onClick={() => move(i, 1)}
                          disabled={i === picks.length - 1}
                        >
                          ↓
                        </MoveBtn>
                        <button
                          onClick={() => removePick(p.student_id)}
                          className="text-sm text-red-600 px-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={p.note}
                      onChange={(e) => setNote(p.student_id, e.target.value)}
                      placeholder="Add a note (optional)"
                      className="mt-2 w-full px-2 py-1 border border-gray-200 rounded text-xs outline-none focus:border-yellow-400"
                    />
                  </StudentCard>
                );
              })}
              {picks.length === 0 && (
                <li className="text-gray-500 text-sm">
                  No picks yet — add resumes from the left.
                </li>
              )}
            </ol>
          </section>
          </fieldset>
        </main>
      </div>
    </>
  );
}

function initials(name) {
  return (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function StudentCard({ student, rank, children }) {
  return (
    <li className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-shadow">
      <div className="flex justify-between gap-3">
        <div className="flex gap-3 min-w-0">
          {rank ? (
            <span className="shrink-0 h-9 w-9 rounded-full bg-accent text-gray-900 text-sm font-bold flex items-center justify-center">
              {rank}
            </span>
          ) : (
            <span className="shrink-0 h-9 w-9 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
              {initials(student.name)}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate">{student.name}</p>
            <p className="text-sm text-gray-600 truncate">
              {[student.school, student.major, student.grad_year]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {student.resume_url && (
              <a
                href={student.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-sm font-medium text-blue-600 hover:underline"
              >
                View resume ↗
              </a>
            )}
          </div>
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </li>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 -mb-px text-sm font-semibold border-b-2 ${
        active
          ? "border-yellow-400 text-gray-900"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function MoveBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-sm px-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function CenterMessage({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-gray-600 text-center">{children}</div>
    </div>
  );
}

function LoginScreen({ onSignIn, error, signingIn }) {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-sm w-full text-center">
          <h1 className="text-xl font-bold text-gray-900">
            Startup Week <span className="text-yellow-700">Portal</span>
          </h1>
          <p className="text-gray-600 text-sm mt-2 mb-6">
            Sign in with the Google account your company registered with to
            review resumes and submit your picks.
          </p>
          <button
            onClick={onSignIn}
            disabled={signingIn}
            className="w-full text-base font-bold text-black bg-accent py-2 px-4 rounded-md"
          >
            {signingIn ? "Redirecting…" : "Sign in with Google"}
          </button>
          {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        </div>
      </div>
    </>
  );
}
