"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { CandidateBrowser, StudentProfile } from "./candidate-browser";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/startup-week/use-auth";

// V1 admin console for Startup Week: run the matching algorithm and send match
// emails. Admin-only — GET /api/startup-week/me checks startup_week_admins
// server-side, and every protected action rechecks membership.

export default function AdminConsole() {
  const { user, token, loading: authLoading, signIn, signOut, authError, signingIn, signingOut } = useAuth();
  if (authLoading) return <CenterMessage>Loading…</CenterMessage>;
  if (!user || !token) return <LoginScreen onSignIn={signIn} error={authError} signingIn={signingIn} />;
  return <AuthenticatedAdmin key={`${user.id}:${user.email}`} user={user} token={token} signOut={signOut} signOutError={authError} signingOut={signingOut} />;
}

function AuthenticatedAdmin({ user, token, signOut, signOutError, signingOut }) {
  const [view, setView] = useState("Overview");
  const [me, setMe] = useState(null);
  const [meLoading, setMeLoading] = useState(true);
  const [accessError, setAccessError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setMeLoading(true);
    axios
      .get("/api/startup-week/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => !cancelled && setMe(res.data))
      .catch((error) => { if (!cancelled) setAccessError(error.response?.data?.error || "Unable to check access. Please refresh and try again."); })
      .finally(() => !cancelled && setMeLoading(false));
    return () => {
      cancelled = true;
    };
  }, []); // Refreshed tokens update save requests without reloading drafts.

  if (meLoading) {
    return <CenterMessage>Loading…</CenterMessage>;
  }
  if (accessError) {
    return (
      <CenterMessage>
        <p role="alert" className="mb-4">{accessError}</p>
        {signOutError && <p role="alert" className="mb-4 text-red-700">{signOutError}</p>}
        <Button onClick={() => window.location.reload()} className="underline mr-4">Retry</Button>
        <Button onClick={signOut} className="underline">Sign out</Button>
      </CenterMessage>
    );
  }
  if (!me?.isAdmin) {
    return (
      <CenterMessage>
        <span className="block mb-4">
          {user.email} is not an admin. Ask a V1 lead to add you to
          the Startup Week admin list.
        </span>
        <Button
          onClick={signOut}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          Sign in with a different account
        </Button>
      </CenterMessage>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 md:px-6 lg:px-8">
      <header className="mb-5">
        {signOutError && <p role="alert" className="mb-2 text-sm text-red-700">{signOutError}</p>}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500"><p className="uppercase tracking-[0.16em]">Administration</p><div className="flex flex-wrap items-center gap-3"><p className="break-all">{user.email}</p><Button variant="outline" disabled={signingOut} onClick={signOut} className="h-8 border-gray-300 bg-transparent text-xs">{signingOut ? "Signing out…" : "Sign out"}</Button></div></div>
        <h1 className="mt-3 font-instrument text-5xl sm:text-6xl font-normal leading-tight">Startup Week</h1>
        <p className="mt-2 text-sm text-gray-600">Manage companies, review students, and coordinate introductions.</p>
      </header>
      <nav aria-label="Dashboard sections" className="mb-6 flex gap-6 overflow-x-auto border-b border-gray-200">
        {["Overview", "Companies", "Students", "Matching", "Email"].map(item => <button key={item} aria-pressed={view === item} onClick={() => setView(item)} className={`shrink-0 border-b-2 py-3 text-sm font-medium ${view === item ? "border-[#E5AC61] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-900"}`}>{item}</button>)}
      </nav>
      <DashboardMetrics token={token} view={view} />
      <div className="divide-y divide-gray-200">
        <div hidden={!["Overview", "Companies"].includes(view)}><CompanyProfilesCard token={token} /></div>
        <div hidden={!["Overview", "Students"].includes(view)}><RecommendationsCard token={token} /></div>
        <div hidden={!["Overview", "Matching"].includes(view)}><RunMatchingCard token={token} /></div>
        <div hidden={!["Overview", "Email"].includes(view)}><NotifyCard token={token} /></div>
      </div>
    </main>
  );
}

function DashboardMetrics({ token, view }) {
  const [totals, setTotals] = useState({});
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    const auth = {headers: {Authorization: `Bearer ${token}`}};
    (async () => {
      try {
        const [c, s] = await Promise.all([axios.get("/api/startup-week/companies", auth), axios.get("/api/startup-week/students", auth)]);
        const companies = c.data.companies || [];
        const students = s.data.students || [];
        if (cancelled) return;
        setTotals({companies: companies.length, students: students.length});
        const responses = await Promise.all(companies.map(company => axios.get(`/api/startup-week/companies/${company.slug}/preferences`, auth)));
        if (cancelled) return;
        const lists = responses.map(r => r.data.preferences || []);
        const currentStudents = new Set(students.map(student => student.id));
        setTotals({companies: companies.length, students: students.length, submitted: lists.filter(list => list.length > 0).length, ready: new Set(lists.flat().map(p => p.student_id).filter(id => currentStudents.has(id))).size});
      } catch { if (!cancelled) setError("Some totals could not be loaded."); }
    })();
    return () => {cancelled = true;};
  }, [token]);
  if (!["Overview", "Matching", "Email"].includes(view)) return null;
  const items = view === "Email" ? [["Introductions ready", null], ["Scheduled", null], ["Sent", null], ["Failed", null]] : view === "Matching" ? [["Students with picks", totals.ready], ["Companies", totals.companies], ["Existing matches", null], ["Unmatched students", null]] : [["Companies", totals.companies], ["Students", totals.students], ["Companies with picks", totals.submitted], ["Completed matches", null], ["Pending introductions", null]];
  return <div className="mb-5 border-b border-gray-200 pb-4">
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10">{items.map(([label, value]) => <div key={label}><dt className="text-xs text-gray-500">{label}</dt><dd className="mt-1 text-2xl font-semibold tabular-nums">{value ?? "—"}</dd></div>)}</dl>
    <p className="mt-3 text-xs text-gray-500">Match and email delivery totals are unavailable in this view. “—” does not mean zero.</p>
    {error && <p role="alert" className="mt-2 text-xs text-amber-800">{error}</p>}
  </div>;
}

export function CompanyProfilesCard({ token }) {
  const [companies, setCompanies] = useState([]);
  const [editing, setEditing] = useState(null);
  const [descriptions, setDescriptions] = useState({}); // slug -> description
  const [dirty, setDirty] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    setLoading(true);
    axios
      .get("/api/startup-week/companies", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (cancelled) return;
        const list = res.data.companies || [];
        setCompanies(list);
        const map = {};
        for (const c of list) map[c.slug] = c.description || "";
        setDescriptions(map);
      })
      .catch(() => !cancelled && setLoadError("Failed to load companies."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []); // Refreshed tokens update save requests without reloading drafts.

  const edit = (slug, value) => {
    setDescriptions((prev) => ({ ...prev, [slug]: value }));
    setDirty((prev) => new Set(prev).add(slug));
    setSaveState("idle");
  };

  const save = async () => {
    setSaveState("saving");
    try {
      await Promise.all(
        [...dirty].map((slug) =>
          axios.post(
            `/api/startup-week/companies/${slug}`,
            { description: descriptions[slug] },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      setDirty(new Set());
      setSaveState("saved");
    } catch (err) {
      setSaveState("error");
    }
  };

  return (
    <fieldset disabled={saveState === "saving"} className="min-w-0 py-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-base font-semibold">Company profiles</h2><p className="mt-1 text-xs text-gray-500">Descriptions guide student recommendations.</p></div>
        <div className="flex items-center gap-3 text-xs">
          {dirty.size > 0 && <span className="text-amber-800">{dirty.size} unsaved</span>}
          {saveState === "saved" && !dirty.size && <span className="text-green-700">Saved</span>}
          {saveState === "error" && <span role="alert" className="text-red-700">Save failed</span>}
          <Button onClick={save} disabled={!dirty.size || saveState === "saving"} className="h-9 bg-gray-900 text-white hover:bg-gray-800">{saveState === "saving" ? "Saving…" : "Save descriptions"}</Button>
        </div>
      </div>
      {loading && <p className="py-3 text-sm text-gray-500">Loading companies…</p>}
      {loadError && <p role="alert" className="text-sm text-red-700">{loadError}</p>}
      {!loading && !loadError && <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm">
        <thead className="border-y border-gray-200 text-xs text-gray-500"><tr><th className="py-2 pr-4 font-medium">Company</th><th className="py-2 pr-4 font-medium">Description</th><th className="py-2 pr-4 font-medium">Profile status</th><th className="py-2 font-medium">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-200">{companies.map(c => <tr key={c.id}>
          <td className="w-1/5 py-3 pr-4 align-top font-medium">{c.name}</td>
          <td className="w-1/2 py-3 pr-4 text-gray-600">{editing === c.id ? <textarea aria-label={`Description for ${c.name}`} value={descriptions[c.slug] ?? ""} onChange={e => edit(c.slug, e.target.value)} rows={3} className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm" /> : <p className="line-clamp-2">{descriptions[c.slug] || "No description yet"}</p>}</td>
          <td className="py-3 pr-4 align-top"><StatusBadge>{dirty.has(c.slug) ? "Unsaved" : descriptions[c.slug]?.trim() ? "Description added" : "Needs description"}</StatusBadge></td>
          <td className="py-3 align-top"><button aria-expanded={editing === c.id} onClick={() => setEditing(editing === c.id ? null : c.id)} className="text-xs underline underline-offset-4">{editing === c.id ? "Close editor" : "Edit"}</button><a href={`/startupweek/company/${c.slug}`} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs text-gray-500 underline underline-offset-4">Portal ↗</a></td>
        </tr>)}</tbody>
      </table>{!companies.length && <p className="py-4 text-sm text-gray-500">No companies yet. Add participating companies in Supabase to get started.</p>}</div>}
    </fieldset>
  );
}

function StatusBadge({children}) {
  return <span className="inline-block whitespace-nowrap rounded border border-gray-200 bg-white/60 px-2 py-0.5 text-[11px] font-medium text-gray-600">{children}</span>;
}

export function RecommendationsCard({ token }) {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [candidateOrder, setCandidateOrder] = useState([]);
  const openCandidate = (student, order) => {
    setCandidateOrder(order || []);
    setSelectedStudent(student);
  };
  const [profileSchemaReady, setProfileSchemaReady] = useState(true);
  const [studentDetailsReady, setStudentDetailsReady] = useState(true);
  const [recs, setRecs] = useState({}); // studentId -> Set(companyId)
  const [dirty, setDirty] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [autoState, setAutoState] = useState("idle"); // idle | running | error

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    const auth = { headers: { Authorization: `Bearer ${token}` } };
    setLoading(true);
    Promise.all([
      axios.get("/api/startup-week/students", auth),
      axios.get("/api/startup-week/companies", auth),
      axios.get("/api/startup-week/recommendations", auth),
    ])
      .then(([s, c, r]) => {
        if (cancelled) return;
        setStudents(s.data.students || []);
        setProfileSchemaReady(s.data.profile_schema_ready !== false);
        setStudentDetailsReady(s.data.student_details_ready !== false);
        setCompanies(c.data.companies || []);
        const map = {};
        for (const row of r.data.recommendations || []) {
          (map[row.student_id] ||= new Set()).add(row.company_id);
        }
        setRecs(map);
      })
      .catch(() => !cancelled && setLoadError("Failed to load."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []); // Refreshed tokens update save requests without reloading drafts.

  const toggle = (studentId, companyId) => {
    setRecs((prev) => {
      const set = new Set(prev[studentId] || []);
      if (set.has(companyId)) set.delete(companyId);
      else set.add(companyId);
      return { ...prev, [studentId]: set };
    });
    setDirty((prev) => new Set(prev).add(studentId));
    setSaveState("idle");
  };

  const save = async () => {
    setSaveState("saving");
    try {
      await Promise.all(
        [...dirty].map((studentId) =>
          axios.post(
            "/api/startup-week/recommendations",
            { student_id: studentId, company_ids: [...(recs[studentId] || [])] },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      setDirty(new Set());
      setSaveState("saved");
    } catch (err) {
      setSaveState("error");
    }
  };

  // AI first pass: fills the grid with suggestions (unsaved) for review.
  const autoPair = async () => {
    if (
      Object.keys(recs).length > 0 &&
      !window.confirm(
        "Replace the current grid with AI suggestions? Nothing is saved until you click Save recommendations."
      )
    ) {
      return;
    }
    setAutoState("running");
    try {
      const next = {};
      const touched = new Set();
      for (let offset = 0; offset < students.length; offset += 40) {
        const { data } = await axios.post(
          "/api/startup-week/recommendations/auto",
          { student_ids: students.slice(offset, offset + 40).map((s) => s.id) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        for (const [studentId, companyIds] of Object.entries(data.pairings || {})) {
          next[studentId] = new Set(companyIds);
          touched.add(studentId);
        }
      }
      setRecs(next);
      setDirty(touched);
      setSaveState("idle");
      setAutoState("idle");
    } catch (err) {
      setAutoState("error");
    }
  };

  return (
    <fieldset disabled={saveState === "saving" || autoState === "running"} className="min-w-0 py-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Student recommendations</h2>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {autoState === "error" && <span role="alert" className="text-red-700">AI pairing failed</span>}
          {saveState === "error" && <span role="alert" className="text-red-700">Save failed</span>}
          {dirty.size > 0 && <span className="text-amber-800">{dirty.size} unsaved</span>}
          {saveState === "saved" && !dirty.size && <span className="text-green-700">Saved</span>}
          <Button onClick={autoPair} disabled={loading || !!loadError || !students.length || !companies.length || autoState === "running"} variant="outline" className="h-9 border-gray-300 bg-transparent">{autoState === "running" ? "Pairing…" : "Auto-pair with AI"}</Button>
          <Button onClick={save} disabled={!dirty.size || saveState === "saving"} className="h-9 bg-gray-900 text-white hover:bg-gray-800">{saveState === "saving" ? "Saving…" : "Save recommendations"}</Button>
        </div>
      </div>
      {loading && <p className="py-3 text-sm text-gray-500">Loading students…</p>}
      {loadError && <p role="alert" className="text-sm text-red-700">{loadError}</p>}
      {!loading && !loadError && <>
        <p className="mb-3 text-xs text-gray-500">Use the star to recommend candidates to companies. Company rankings are managed in each company portal.</p>
        <CandidateBrowser studentDetailsReady={studentDetailsReady} students={students} profileSchemaReady={profileSchemaReady} onOpen={openCandidate} renderShortlist={student => <Popover>
          <PopoverTrigger asChild><button type="button" aria-label={`Review company recommendations for ${student.name}${dirty.has(student.id) ? "; unsaved changes" : ""}`} title={`Recommend to companies${recs[student.id]?.size ? ` (${recs[student.id].size} selected)` : ""}`} className="relative flex h-8 w-8 items-center justify-center rounded-md text-[#B57D30] hover:bg-[#E5AC61]/15"><Star aria-hidden="true" size={18} fill={recs[student.id]?.size ? "currentColor" : "none"} />{dirty.has(student.id) && <span aria-hidden="true" className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-amber-700" />}</button></PopoverTrigger>
          <PopoverContent align="start" className="max-h-80 overflow-y-auto bg-[#FAF7F2] text-[#444444]">
            <fieldset disabled={saveState === "saving" || autoState === "running"}><legend className="mb-2 text-sm font-semibold">Recommend {student.name}</legend>
              {companies.map(company => <label key={company.id} className="flex items-start gap-2 py-1.5 text-sm"><input type="checkbox" checked={!!recs[student.id]?.has(company.id)} onChange={() => toggle(student.id, company.id)} className="mt-1 accent-[#444444]" />{company.name}</label>)}
              {!companies.length && <p className="text-xs text-gray-500">Add a company first.</p>}
              <p className="mt-3 text-xs text-gray-500">Use Save recommendations above to apply your changes.</p>
            </fieldset>
          </PopoverContent>
        </Popover>} />
        <StudentProfile candidateOrder={candidateOrder} onNavigate={setSelectedStudent} student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      </>}
    </fieldset>
  );
}

function RunMatchingCard({ token }) {
  const [capacity, setCapacity] = useState("");
  const { state, result, run } = useAction(() => {
    const body = capacity ? { capacityPerCompany: Number(capacity) } : {};
    return axios.post("/api/startup-week/matches/run", body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  return (
    <ActionCard
      title="Matching"
      description="Match from company picks. Existing matches are preserved; this does not send emails."
      state={state}
      onRun={run}
      runLabel="Run matching"
      result={state === "error" ? result?.error : result && `Selected ${result.matches} pairing(s), including existing matches.`}
    >
      <label className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
        Capacity per company (optional)
        <input
          type="number"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="No limit"
          className="w-28 px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none focus-visible:border-gray-500 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        />
      </label>
    </ActionCard>
  );
}

function NotifyCard({ token }) {
  const { state, result, run } = useAction(() =>
    axios.post(
      "/api/startup-week/matches/notify",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  );

  return (
    <ActionCard
      title="Email delivery"
      warning={Boolean(result?.failed || result?.reviewRequired)}
      description="Send up to 10 due introductions. Failed or interrupted deliveries are held for review."
      state={state}
      onRun={run}
      runLabel="Send due emails"
      result={state === "error" ? result?.error : result && `Sent ${result.sent || 0}, failed ${result.failed || 0}, held for review ${result.reviewRequired || 0}.`}
    />
  );
}

// Shared action state machine for the admin buttons.
function useAction(fn) {
  const [state, setState] = useState("idle"); // idle | running | done | error
  const [result, setResult] = useState(null);

  const run = async () => {
    setState("running");
    setResult(null);
    try {
      const res = await fn();
      setResult(res.data);
      setState("done");
    } catch (err) {
      setResult(err.response?.data || null);
      setState("error");
    }
  };

  return { state, result, run };
}

function ActionCard({
  title,
  description,
  children,
  state,
  onRun,
  runLabel,
  result,
  warning = false,
}) {
  return (
    <section className="py-5">
      <h2 className="mb-3 text-base font-semibold">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">
        <fieldset disabled={state === "running"} className="flex flex-wrap items-center gap-3">
          {children}
          <Button onClick={onRun} disabled={state === "running"} className="h-9 bg-gray-900 text-white hover:bg-gray-800">{state === "running" ? "Working…" : runLabel}</Button>
        </fieldset>
        {state === "done" && <span role={warning ? "alert" : "status"} className={`text-sm ${warning ? "text-amber-800" : "text-gray-600"}`}>{result}</span>}
        {state === "error" && <span role="alert" className="text-sm text-red-700">{result || "Failed. Try again."}</span>}
      </div>
      <p className="mt-2 text-xs text-gray-500">{description}</p>
    </section>
  );
}

function CenterMessage({ children }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="max-w-xl text-center text-sm leading-relaxed text-gray-600">{children}</div>
    </main>
  );
}

function LoginScreen({ onSignIn, error, signingIn }) {
  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg text-center">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-gray-500">V1 Michigan · Administration</p>
        <h1 className="font-instrument text-5xl font-normal leading-tight text-[#444444] sm:text-6xl">Startup Week</h1>
        <p className="mx-auto mb-8 mt-5 max-w-sm text-base leading-relaxed text-gray-600">
          A place to connect startups and student builders.
          Sign in with your V1 Google account to get started.
        </p>
        <Button onClick={onSignIn} disabled={signingIn} className="h-11 bg-yellow-400 px-8 text-[#191919] hover:bg-yellow-300">
          {signingIn ? "Redirecting…" : "Sign in with Google"}
        </Button>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      </div>
    </main>
  );
}
