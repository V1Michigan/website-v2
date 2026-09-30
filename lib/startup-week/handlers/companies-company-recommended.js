import { LEGACY_STUDENT_COLUMNS, STUDENT_PROFILE_COLUMNS, serializeStudentProfile } from "@/lib/startup-week/student-profile";
import { readAll } from "@/lib/startup-week/read-all";
import { getSupabase } from "@/lib/startup-week/supabase";
import { getUserFromReq, isAdmin } from "@/lib/startup-week/auth";

// GET /api/startup-week/companies/:slug/recommended — students an admin has flagged as a
// good fit for this company. Same shape as /api/startup-week/students so the portal can
// render them with the same card. Authorized to the company's contact (or admin).

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;

  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });

  const { data: company, error: companyErr } = await getSupabase()
    .from("startup_week_companies")
    .select("id, contact_email")
    .eq("slug", slug)
    .single();
  if (companyErr || !company) {
    return res.status(404).json({ error: "Company not found" });
  }

  const owns =
    company.contact_email &&
    company.contact_email.toLowerCase() === (user.email || "").toLowerCase();
  if (!owns && !(await isAdmin(user.email))) {
    return res.status(403).json({ error: "Not authorized for this company" });
  }

  const readRecommended = columns => readAll(() => getSupabase()
    .from("startup_week_recommendations")
    .select(
      `students:startup_week_students ( ${columns} )`
    )
    .eq("company_id", company.id));

  let {data, error} = await readRecommended(STUDENT_PROFILE_COLUMNS);
  if (error?.code === "42703") ({data, error} = await readRecommended(LEGACY_STUDENT_COLUMNS));

  if (error) {
    console.error("[recommended] load failed", error);
    return res.status(500).json({ error: "Failed to load recommendations" });
  }

  const students = (data || []).map((r) => r.students).filter(Boolean).map(serializeStudentProfile);
  return res.status(200).json({ students });
}
