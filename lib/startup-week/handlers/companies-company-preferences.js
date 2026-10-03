import { isCompanyContact } from "@/lib/startup-week/company-contacts";
import { normalizePreferences } from "@/lib/startup-week/preferences";
import { getSupabase } from "@/lib/startup-week/supabase";
import { getUserFromReq, isAdmin } from "@/lib/startup-week/auth";

// Company preference submission.
//   GET  /api/startup-week/companies/:slug/preferences  -> that company's current picks
//   POST /api/startup-week/companies/:slug/preferences  -> replace picks
//        body: { version, preferences: [{ student_id, rank?, note? }] }
//
// Only the authenticated company contact or an admin can read or replace picks.

async function getCompany(slug) {
  const readCompany = columns => getSupabase()
    .from("startup_week_companies")
    .select(columns)
    .eq("slug", slug)
    .single();
  let {data, error} = await readCompany("id, name, contact_email, description, company_question");
  // Keep existing portals available until the optional question column is added.
  if (error?.code === "42703") ({data, error} = await readCompany("id, name, contact_email, description"));
  if (error) return null;
  return data;
}

export default async function handler(req, res) {
  const { slug } = req.query;

  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });

  const company = await getCompany(slug);
  if (!company) {
    return res.status(404).json({ error: "Company not found" });
  }

  // Only this company's contact (or an admin) may view/edit its picks.
  const owns = isCompanyContact(company.contact_email, user.email);
  if (!owns && !(await isAdmin(user.email))) {
    return res.status(403).json({ error: "Not authorized for this company" });
  }

  if (req.method === "GET") {
    const { data, error } = await getSupabase().rpc("startup_week_read_shortlist", {target_company: company.id});

    if (error) {
      if (["PGRST202", "42883", "42703"].includes(error.code)) return res.status(503).json({error: "Shortlist versioning is not set up yet. Apply the 20261003000100 Startup Week migration."});
      console.error("[preferences] load failed", error);
      return res.status(500).json({ error: "Failed to load preferences" });
    }
    return res.status(200).json({
      company: company.name,
      description: company.description || null,
      company_question: company.company_question || null,
      preferences: data?.preferences || [],
      version: data?.version,
    });
  }

  if (req.method === "POST") {
    const version = req.body?.version;
    if (typeof version !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(version)) {
      return res.status(400).json({error: "Refresh the portal before saving. A shortlist version is required."});
    }
    let list;
    try { list = normalizePreferences(req.body?.preferences); }
    catch (error) { return res.status(400).json({error: error.message}); }

    const { data: nextVersion, error } = await getSupabase().rpc("startup_week_save_shortlist", {
      expected_version: version,
      target_company: company.id,
      picks: list,
    });
    if (error) {
      if (error.code === "P0001") return res.status(409).json({error: "Someone else saved this shortlist. Your edits are still here. Load the latest shortlist before saving again."});
      console.error("[preferences] replace failed", error);
      if (error.code === "23503") return res.status(400).json({error: "A shortlisted candidate is no longer available. Refresh the portal before retrying."});
      return res.status(500).json({ error: "Could not save your shortlist. Please retry." });
    }

    return res.status(200).json({ saved: list.length, preferences: list, version: nextVersion });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
