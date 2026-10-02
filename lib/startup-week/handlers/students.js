import { LEGACY_STUDENT_COLUMNS, STUDENT_PROFILE_COLUMNS, serializeStudentProfile } from "@/lib/startup-week/student-profile";
import { mergeStudentDetails, responseColumnFor } from "@/lib/startup-week/student-details";
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
  const admin = await isAdmin(user.email);
  const ownCompany = admin ? null : await companyForEmail(user.email);
  if (!admin && !ownCompany) return res.status(403).json({ error: "Not authorized" });
  const requestedSlug = req.query?.company_slug;
  if (requestedSlug != null && (typeof requestedSlug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(requestedSlug))) {
    return res.status(400).json({error: "Invalid company slug"});
  }
  // Company users cannot request another company's answers, even with a forged query.
  if (!admin && requestedSlug && requestedSlug !== ownCompany.slug) return res.status(403).json({error: "Not authorized for this company"});
  const companySlug = requestedSlug || ownCompany?.slug || null;

  const readStudents = columns => readAll(() => getSupabase()
    .from("startup_week_students")
    .select(columns)
    .order("name", { ascending: true }).order("id", { ascending: true }));

  let {data, error} = await readStudents(STUDENT_PROFILE_COLUMNS);
  const profileSchemaReady = error?.code !== "42703";
  if (!profileSchemaReady) ({data, error} = await readStudents(LEGACY_STUDENT_COLUMNS));

  if (error) {
    console.error("[students] list failed", error);
    return res.status(500).json({ error: "Failed to load students" });
  }

  const responseColumn = responseColumnFor(companySlug);
  const detailColumns = ["id", "email", "year", "work_authorization", ...(companySlug ? ["interested"] : []), ...(responseColumn ? [responseColumn] : [])];
  const details = await readAll(() => getSupabase().from("startup_week_student_details").select(detailColumns.join(", ")));
  const detailsReady = !["42P01", "PGRST205"].includes(details.error?.code);
  if (details.error && detailsReady) {
    console.error("[students] supplemental data failed", details.error);
    return res.status(500).json({error: "Failed to load student details"});
  }
  return res.status(200).json({
    students: mergeStudentDetails((data || []).map(serializeStudentProfile), details.data || [], companySlug),
    profile_schema_ready: profileSchemaReady,
    student_details_ready: detailsReady,
  });
}
