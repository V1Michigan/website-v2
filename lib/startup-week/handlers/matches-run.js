import { readAll } from "@/lib/startup-week/read-all";
import { getSupabase } from "@/lib/startup-week/supabase";
import { computeMatches } from "@/lib/startup-week/matching";
import { getUserFromReq, isAdmin } from "@/lib/startup-week/auth";

// POST /api/startup-week/matches/run — run the matching algorithm over all preferences and
// persist the resulting pairings as `pending` matches (idempotent upsert).
//
// body (optional): { capacityPerCompany?: number }
//
// This is the V1-team-facing "match now" action at the heart of the platform.
// It does not send any email; that's a separate, explicit step (see notify).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  if (!(await isAdmin(user.email))) return res.status(403).json({ error: "Admin only" });

  const capacityPerCompany = req.body?.capacityPerCompany;
  if (capacityPerCompany !== undefined &&
      (!Number.isSafeInteger(capacityPerCompany) || capacityPerCompany < 1)) {
    return res.status(400).json({ error: "capacityPerCompany must be a positive integer" });
  }

  const { data: preferences, error } = await readAll(() => getSupabase()
    .from("startup_week_preferences")
    .select("company_id, student_id, rank"));

  if (error) {
    console.error("[matches/run] load preferences failed", error);
    return res.status(500).json({ error: "Failed to load preferences" });
  }

  const pairings = computeMatches(preferences, { capacityPerCompany });

  if (pairings.length === 0) {
    return res.status(200).json({ matches: 0 });
  }

  // Upsert keeps existing match state (e.g. already 'sent') from being clobbered
  // by ignoring conflicts on the unique (company_id, student_id) pair.
  const rows = pairings.map((p) => ({ ...p, status: "pending" }));
  const { error: upsertErr } = await getSupabase()
    .from("startup_week_matches")
    .upsert(rows, { onConflict: "company_id,student_id", ignoreDuplicates: true });

  if (upsertErr) {
    console.error("[matches/run] upsert failed", upsertErr);
    return res.status(500).json({ error: "Failed to save matches" });
  }

  return res.status(200).json({ matches: pairings.length });
}
