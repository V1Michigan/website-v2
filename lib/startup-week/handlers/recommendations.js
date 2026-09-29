import { readAll } from "@/lib/startup-week/read-all";
import { getSupabase } from "@/lib/startup-week/supabase";
import { getUserFromReq, isAdmin } from "@/lib/startup-week/auth";

// Admin-curated student <-> company recommendations.
//   GET  /api/startup-week/recommendations  -> all links: [{ student_id, company_id }]
//   POST /api/startup-week/recommendations  -> replace the set for one student
//        body: { student_id, company_ids: [...] }
//
// Admin-only. The company portal reads its own recommendations via
// /api/startup-week/companies/:slug/recommended.

export default async function handler(req, res) {
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  if (!(await isAdmin(user.email))) return res.status(403).json({ error: "Admin only" });

  if (req.method === "GET") {
    const { data, error } = await readAll(() => getSupabase()
      .from("startup_week_recommendations")
      .select("student_id, company_id"));
    if (error) {
      console.error("[recommendations] load failed", error);
      return res.status(500).json({ error: "Failed to load recommendations" });
    }
    return res.status(200).json({ recommendations: data });
  }

  if (req.method === "POST") {
    const { student_id: studentId, company_ids: companyIds } = req.body || {};
    if (!studentId || !Array.isArray(companyIds)) {
      return res
        .status(400)
        .json({ error: "Expected { student_id, company_ids: [...] }" });
    }

    const { error } = await getSupabase().rpc("startup_week_replace_recommendations", {
      target_student: studentId,
      company_ids: companyIds,
    });
    if (error) {
      console.error("[recommendations] replace failed", error);
      return res.status(500).json({ error: "Failed to save recommendations" });
    }

    return res.status(200).json({ saved: companyIds.length });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
