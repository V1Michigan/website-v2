import { createClient } from "@supabase/supabase-js";
import { ConfigurationError, getSupabase } from "./supabase";

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
  return error ? null : data.user;
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

export async function companyForEmail(email) {
  if (!email) return null;
  const { data } = await getSupabase().from("startup_week_companies")
    .select("id, name, slug, contact_email").ilike("contact_email", email).maybeSingle();
  return data?.contact_email?.toLowerCase() === email.toLowerCase() ? data : null;
}
