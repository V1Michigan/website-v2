"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/startup-week/use-auth";

// V1 admin console for Startup Week: run the matching algorithm and send match
// emails. Admin-only — GET /api/startup-week/me checks startup_week_admins
// server-side, and every protected action rechecks membership.

export default function AdminConsole() {
  const { user, token, loading: authLoading, signIn, signOut, authError, signingIn } = useAuth();
  if (authLoading) return <CenterMessage>Loading…</CenterMessage>;
  if (!user || !token) return <LoginScreen onSignIn={signIn} error={authError} signingIn={signingIn} />;
  return <AuthenticatedAdmin key={`${user.id}:${user.email}`} user={user} token={token} signOut={signOut} />;
}

function AuthenticatedAdmin({ user, token, signOut }) {
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
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6 md:pt-16 lg:px-8">
      <header className="mb-10 border-b border-gray-200 pb-10 md:mb-12">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-gray-600">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            Administration
          </p>
          <p className="break-all text-xs text-gray-500">{user.email}</p>
        </div>
        <h1 className="font-instrument text-5xl font-normal leading-tight text-[#444444] sm:text-6xl md:text-7xl">
          Startup Week
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
          Connect the best startups with the best builders.
          Manage company profiles, recommend students, and make introductions.
        </p>
      </header>
      <div className="space-y-6 md:space-y-8">
        <CompanyProfilesCard token={token} />
        <RecommendationsCard token={token} />
        <div className="grid items-start gap-6 md:grid-cols-2 md:gap-8">
          <RunMatchingCard token={token} />
          <NotifyCard token={token} />
        </div>
      </div>
    </main>
  );
}

export function CompanyProfilesCard({ token }) {
  const [companies, setCompanies] = useState([]);
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
    <fieldset disabled={saveState === "saving"} className="min-w-0 rounded-lg border border-gray-200 bg-white/60 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
        <h2 className="font-instrument text-3xl font-normal leading-tight text-[#444444]">Company profiles</h2>
        <div className="flex flex-wrap items-center gap-3">
          {saveState === "saved" && dirty.size === 0 && (
            <span className="text-green-600 text-sm">Saved ✓</span>
          )}
          {dirty.size > 0 && (
            <span className="text-amber-800 text-sm">{dirty.size} unsaved</span>
          )}
          {saveState === "error" && (
            <span className="text-red-600 text-sm">Save failed</span>
          )}
          <Button
            onClick={save}
            disabled={saveState === "saving" || dirty.size === 0}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            {saveState === "saving" ? "Saving…" : "Save descriptions"}
          </Button>
        </div>
      </div>
      <p className="max-w-2xl text-sm leading-relaxed text-gray-600 mb-5">
        What each company does and who they want to meet. This is what{" "}
        <strong>Auto-pair with AI</strong> matches students against — the more
        specific, the better the suggestions.
      </p>

      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {loadError && <p className="text-red-600 text-sm">{loadError}</p>}

      {!loading && !loadError && companies.length === 0 && (
        <div className="rounded-md border border-dashed border-gray-300 px-5 py-8 text-center"><p className="text-sm font-medium text-[#444444]">No companies yet</p><p className="mt-1 text-sm text-gray-500">Company profiles will appear here once participating startups are added.</p></div>
      )}

      <div className="space-y-4">
        {companies.map((c) => (
          <div key={c.id}>
            <label htmlFor={`company-${c.id}`} className="block text-sm font-medium text-gray-900 mb-1">
              {c.name}
            </label>
            <textarea
              id={`company-${c.id}`}
              value={descriptions[c.slug] ?? ""}
              onChange={(e) => edit(c.slug, e.target.value)}
              rows={2}
              placeholder="e.g. Seed-stage fintech building payments infra; hiring backend and ML engineers."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus-visible:border-gray-500 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export function RecommendationsCard({ token }) {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [recs, setRecs] = useState({}); // studentId -> Set(companyId)
  const [dirty, setDirty] = useState(() => new Set());
  const [search, setSearch] = useState("");
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

  const visible = students.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [s.name, s.school, s.major].filter(Boolean).some((f) =>
      f.toLowerCase().includes(q)
    );
  });

  return (
    <fieldset disabled={saveState === "saving" || autoState === "running"} className="min-w-0 rounded-lg border border-gray-200 bg-white/60 p-5 sm:p-7">
      <h2 className="font-instrument text-3xl font-normal leading-tight text-[#444444]">Student recommendations</h2>
      <p className="max-w-2xl text-sm leading-relaxed text-gray-600 mt-3 mb-5">
        Check the companies each student is a good fit for. Use{" "}
        <strong>Auto-pair with AI</strong> for a first pass, then adjust and save.
        These show up in each company&apos;s{" "}
        <strong>Recommended for you</strong> tab.
      </p>

      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {loadError && <p className="text-red-600 text-sm">{loadError}</p>}

      {!loading && !loadError && (
        <>
          {companies.length === 0 || students.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-300 px-5 py-8 text-center"><p className="text-sm font-medium text-[#444444]">Ready for your first recommendations</p><p className="mt-1 text-sm text-gray-500">Add at least one company and one student to start pairing them.</p></div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students…"
                  aria-label="Search students"
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus-visible:border-gray-500 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 w-full sm:w-56"
                />
                <div className="flex flex-wrap items-center gap-3">
                  {autoState === "error" && (
                    <span className="text-red-600 text-sm">AI failed</span>
                  )}
                  <Button
                    onClick={autoPair}
                    disabled={autoState === "running"}
                    className="bg-yellow-400 text-[#191919] hover:bg-yellow-300"
                  >
                    {autoState === "running" ? "Pairing…" : "Auto-pair with AI"}
                  </Button>
                  {saveState === "saved" && dirty.size === 0 && (
                    <span className="text-green-600 text-sm">Saved ✓</span>
                  )}
                  {dirty.size > 0 && (
                    <span className="text-amber-800 text-sm">
                      {dirty.size} unsaved
                    </span>
                  )}
                  {saveState === "error" && (
                    <span className="text-red-600 text-sm">Save failed</span>
                  )}
                  <Button
                    onClick={save}
                    disabled={saveState === "saving" || dirty.size === 0}
                    className="bg-gray-900 text-white hover:bg-gray-800"
                  >
                    {saveState === "saving" ? "Saving…" : "Save recommendations"}
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left font-semibold text-gray-700 p-2 sticky left-0 bg-white">
                        Student
                      </th>
                      {companies.map((c) => (
                        <th
                          key={c.id}
                          className="font-semibold text-gray-700 p-2 whitespace-nowrap"
                        >
                          {c.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((s) => (
                      <tr key={s.id} className="border-t border-gray-100">
                        <td className="p-2 sticky left-0 bg-white whitespace-nowrap">
                          <span className="font-medium text-gray-900">
                            {s.name}
                          </span>
                          {s.major && (
                            <span className="text-gray-500"> · {s.major}</span>
                          )}
                        </td>
                        {companies.map((c) => (
                          <td key={c.id} className="p-2 text-center">
                            <input
                              type="checkbox"
                              aria-label={`Recommend ${s.name} to ${c.name}`}
                              checked={!!recs[s.id]?.has(c.id)}
                              onChange={() => toggle(s.id, c.id)}
                              className="h-4 w-4 accent-yellow-500 cursor-pointer"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
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
      title="Run matching"
      description="Match students to companies from submitted preferences. Existing matches are preserved; re-running adds missing pairings and does not remove old ones."
      state={state}
      onRun={run}
      runLabel="Run matching"
      result={state === "error" ? result?.error : result && `Selected ${result.matches} pairing(s), including existing matches.`}
    >
      <label className="block text-sm text-gray-700">
        Capacity per company (optional)
        <input
          type="number"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="No limit"
          className="mt-1 block w-40 px-2 py-1 border border-gray-300 rounded text-sm bg-white outline-none focus-visible:border-gray-500 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
      title="Send match emails"
      description="Send outreach emails for matches that are due (pending/scheduled with a send time now or in the past). Processes up to 10 emails per run. Failed or interrupted deliveries are held for review before retrying."
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
}) {
  return (
    <section className="min-w-0 rounded-lg border border-gray-200 bg-white/60 p-5 sm:p-7">
      <h2 className="font-instrument text-3xl font-normal leading-tight text-[#444444]">{title}</h2>
      <p className="max-w-2xl text-sm leading-relaxed text-gray-600 mt-3 mb-5">{description}</p>
      {children && <div className="mb-4">{children}</div>}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={onRun}
          disabled={state === "running"}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          {state === "running" ? "Working…" : runLabel}
        </Button>
        {state === "done" && (
          <span className="text-green-600 text-sm">{result}</span>
        )}
        {state === "error" && (
          <span className="text-red-600 text-sm">{result || "Failed. Try again."}</span>
        )}
      </div>
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
