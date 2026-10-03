import { createClient } from "@supabase/supabase-js";
import { ConfigurationError, getSupabase } from "./supabase";

import { readAll } from "./read-all";
import { isCompanyContact } from "./company-contacts";

let authClient;
export async function getUserFromReq(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  if (!authClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new ConfigurationError("Website Supabase authentication is not configured.");
    authClient = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  const { data, error } = await authClient.auth.getUser(token);
  if (error) {
    if (error.name === "AuthSessionMissingError" || [401, 403].includes(error.status) ||
        ["bad_jwt", "session_not_found", "user_not_found"].includes(error.code)) return null;
    throw new ConfigurationError("Unable to verify your sign-in with Supabase. Please try again shortly.");
  }
  return data.user;
}

export async function isAdmin(email) {
  if (typeof email !== "string" || !email.trim()) return false;
  // Check every request, so deleting a row revokes access without a redeploy.
  // Only the server service role can read or modify the allowlist.
  const { data, error } = await getSupabase().from("startup_week_admins")
    .select("email").eq("email", email.trim().toLowerCase()).maybeSingle();
  if (error) {
    if (["42P01", "PGRST205"].includes(error.code)) {
      throw new ConfigurationError("Startup Week admin access is not set up. Apply the Startup Week Supabase migrations and add your Google email to startup_week_admins.");
    }
    throw new ConfigurationError("Unable to verify Startup Week admin access. Check the server's Supabase key and database setup.");
  }
  return Boolean(data);
}

export async function companyForEmail(email, slug = null) {
  if (typeof email !== "string" || !email.trim()) return null;
  const { data, error } = await readAll(() => {
    const query = getSupabase().from("startup_week_companies")
      .select("id, name, slug, contact_email");
    return slug ? query.eq("slug", slug) : query;
  });
  if (error) throw new ConfigurationError("Unable to verify company access. Please try again shortly.");
  return data.find(company => isCompanyContact(company.contact_email, email)) || null;
}
