import { createClient } from "@supabase/supabase-js";

export class ConfigurationError extends Error {}
let client;

// Imported by server handlers only. Reuse the existing website project.
export function getSupabase() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new ConfigurationError("Startup Week needs SUPABASE_SERVICE_ROLE_KEY for the website's Supabase project. Configure it on the server and restart.");
  }
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
