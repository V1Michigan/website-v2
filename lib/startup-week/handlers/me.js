import { getUserFromReq, isAdmin } from "../auth";
import { getSupabase, ConfigurationError } from "../supabase";

export default async function handler(req, res) {
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  if (!(await isAdmin(user.email))) return res.status(200).json({ email: user.email, isAdmin: false });
  const { error } = await getSupabase().from("startup_week_companies").select("id").limit(1);
  if (error) {
    if (["42P01", "PGRST205"].includes(error.code)) {
      throw new ConfigurationError("The Startup Week tables are missing. Apply supabase/migrations/20260929000100_startup_week.sql to the website's Supabase project.");
    }
    return res.status(503).json({ error: "Unable to access Startup Week data. Check the server's Supabase key and database setup." });
  }
  return res.status(200).json({ email: user.email, isAdmin: true });
}
