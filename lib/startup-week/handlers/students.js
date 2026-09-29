import { readAll } from "@/lib/startup-week/read-all";
import { getSupabase } from "@/lib/startup-week/supabase";
import { getUserFromReq, isAdmin, companyForEmail } from "@/lib/startup-week/auth";

// GET /api/startup-week/students — list ingested students/resumes for companies to browse.
//
// Returns only the fields a company needs to evaluate a candidate. This is the
// read side that powers the company-facing resume browser. Requires a logged-in
// admin or a recognized company user.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  const allowed = (await isAdmin(user.email)) || (await companyForEmail(user.email));
  if (!allowed) return res.status(403).json({ error: "Not authorized" });

  const { data, error } = await readAll(() => getSupabase()
    .from("startup_week_students")
    .select("id, name, school, grad_year, major, resume_url, created_at")
    .order("created_at", { ascending: false }));

  if (error) {
    console.error("[students] list failed", error);
    return res.status(500).json({ error: "Failed to load students" });
  }

  return res.status(200).json({ students: data });
}
