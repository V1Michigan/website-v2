import { getSupabase } from "@/lib/startup-week/supabase";
import { sendEmail, matchEmailTemplate } from "@/lib/startup-week/email";
import { getUserFromReq, isAdmin } from "@/lib/startup-week/auth";

// POST /api/startup-week/matches/notify — send outreach emails for matches that are due.
//
// Due matches are claimed atomically before delivery. Claims persist after
// errors or crashes, so ambiguous deliveries require operator review.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Allow either a logged-in admin (manual "send now") or a cron caller
  // presenting the shared CRON_SECRET (scheduled delivery).
  const cronSecret = process.env.CRON_SECRET;
  const isCron =
    cronSecret && req.headers["x-cron-secret"] === cronSecret;
  if (!isCron) {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: "Not signed in" });
    if (!(await isAdmin(user.email)))
      return res.status(403).json({ error: "Admin only" });
  }

  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return res.status(503).json({ error: "Email delivery is not configured" });
  }

  // Claim one record at a time so concurrent calls and late retries cannot send
  // the same match twice. A crash or ambiguous failure leaves the claim held.
  const results = { sent: 0, failed: 0, reviewRequired: 0 };
  const started = Date.now();
  for (let i = 0; i < 10 && Date.now() - started < 20000; i += 1) {
    const { data: claimed, error } = await getSupabase().rpc("startup_week_claim_match_email");
    if (error) return res.status(500).json({ error: "Failed to claim email", ...results });
    if (!claimed?.length) break;
    const match = claimed[0];
    try {
      const { data: details, error: detailError } = await getSupabase()
        .from("startup_week_matches")
        .select("students:startup_week_students ( name, email ), companies:startup_week_companies ( name )")
        .eq("id", match.id)
        .single();
      if (detailError || !details?.students?.email) throw new Error("Recipient lookup failed");
      const { subject, html } = matchEmailTemplate({
        studentName: details.students.name,
        companyName: details.companies?.name || "a startup",
      });
      const { id } = await sendEmail({ to: details.students.email, subject, html, idempotencyKey: `match/${match.id}` });
      const { error: updateError } = await getSupabase().from("startup_week_matches")
        .update({ status: "sent", email_sent_at: new Date().toISOString(), email_provider_id: id })
        .eq("id", match.id);
      if (updateError) throw new Error("Delivery may have succeeded; status update failed");
      results.sent += 1;
    } catch (err) {
      // Do not log provider error objects: they may contain API credentials.
      console.error(`[matches/notify] review required for match ${match.id}`);
      await getSupabase().from("startup_week_matches").update({ email_error: "Delivery requires review in Resend before retrying" }).eq("id", match.id);
      results.failed += 1;
    }
  }
  const { count, error: reviewError } = await getSupabase().from("startup_week_matches")
    .select("id", { count: "exact", head: true })
    .in("status", ["pending", "scheduled"])
    .not("email_claimed_at", "is", null);
  if (reviewError) return res.status(500).json({ error: "Failed to check delivery claims", ...results });
  results.reviewRequired = count || 0;
  return res.status(results.failed ? 502 : 200).json(results);
}
