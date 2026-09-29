import { readAll } from "@/lib/startup-week/read-all";
import { getSupabase } from "@/lib/startup-week/supabase";
import { getUserFromReq, isAdmin } from "@/lib/startup-week/auth";

// Company preference submission.
//   GET  /api/startup-week/companies/:slug/preferences  -> that company's current picks
//   POST /api/startup-week/companies/:slug/preferences  -> replace picks
//        body: { preferences: [{ student_id, rank?, note? }] }
//
// Only the authenticated company contact or an admin can read or replace picks.

async function getCompany(slug) {
  const { data, error } = await getSupabase()
    .from("startup_week_companies")
    .select("id, name, contact_email, description")
    .eq("slug", slug)
    .single();
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
  const owns =
    company.contact_email &&
    company.contact_email.toLowerCase() === (user.email || "").toLowerCase();
  if (!owns && !(await isAdmin(user.email))) {
    return res.status(403).json({ error: "Not authorized for this company" });
  }

  if (req.method === "GET") {
    const { data, error } = await readAll(() => getSupabase()
      .from("startup_week_preferences")
      .select("student_id, rank, note")
      .eq("company_id", company.id)
      .order("rank", { ascending: true, nullsFirst: false }));

    if (error) {
      console.error("[preferences] load failed", error);
      return res.status(500).json({ error: "Failed to load preferences" });
    }
    return res.status(200).json({
      company: company.name,
      description: company.description || null,
      preferences: data,
    });
  }

  if (req.method === "POST") {
    const list = req.body?.preferences;
    if (!Array.isArray(list)) {
      return res.status(400).json({ error: "Expected { preferences: [...] }" });
    }

    const { error } = await getSupabase().rpc("startup_week_replace_preferences", {
      target_company: company.id,
      picks: list,
    });
    if (error) {
      console.error("[preferences] replace failed", error);
      return res.status(500).json({ error: "Failed to save preferences" });
    }

    return res.status(200).json({ saved: list.length });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
