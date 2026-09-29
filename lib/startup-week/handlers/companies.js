import { readAll } from "@/lib/startup-week/read-all";
import { getSupabase } from "@/lib/startup-week/supabase";
import { getUserFromReq, isAdmin } from "@/lib/startup-week/auth";

// GET /api/startup-week/companies — list companies. Admin-only; powers the recommendation
// UI on the admin page.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  if (!(await isAdmin(user.email))) return res.status(403).json({ error: "Admin only" });

  const { data, error } = await readAll(() => getSupabase()
    .from("startup_week_companies")
    .select("id, name, slug, description")
    .order("name", { ascending: true }));

  if (error) {
    console.error("[companies] list failed", error);
    return res.status(500).json({ error: "Failed to load companies" });
  }

  return res.status(200).json({ companies: data });
}
