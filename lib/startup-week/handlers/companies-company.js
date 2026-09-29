import { getSupabase } from "@/lib/startup-week/supabase";
import { getUserFromReq, isAdmin } from "@/lib/startup-week/auth";

// POST /api/startup-week/companies/:slug — update a company's profile (description).
// Admin-only. The description feeds the AI pairing on /admin.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  if (!(await isAdmin(user.email))) return res.status(403).json({ error: "Admin only" });

  const { slug } = req.query;
  const { description } = req.body || {};
  if (typeof description !== "string") {
    return res.status(400).json({ error: "Expected { description }" });
  }

  const { error } = await getSupabase()
    .from("startup_week_companies")
    .update({ description })
    .eq("slug", slug);

  if (error) {
    console.error("[companies] update failed", error);
    return res.status(500).json({ error: "Failed to save description" });
  }

  return res.status(200).json({ ok: true });
}
