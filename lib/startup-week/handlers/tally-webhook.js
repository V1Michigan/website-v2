import { createHmac, timingSafeEqual } from "crypto";
import { getSupabase } from "@/lib/startup-week/supabase";

// Tally webhook receiver: ingests student resume submissions.
//
// Configure this URL as a webhook in the Tally form settings. Tally posts a
// JSON payload shaped like { eventId, data: { responseId, fields: [...] } }.
// Each field has { key, label, type, value }. We map the labels we care about
// into the `students` table and keep the full payload in `raw`.
//
// Configure the same signing secret here and in Tally. Reject unsigned requests.

/** Pull a field value out of the Tally payload by matching its label. */
function field(fields, ...labelMatches) {
  const match = fields.find((f) =>
    labelMatches.some((m) =>
      (typeof f?.label === "string" ? f.label : "").toLowerCase().includes(m.toLowerCase())
    )
  );
  if (!match) return null;
  // File-upload fields come back as an array of { url, name }.
  if (Array.isArray(match.value) && match.value[0]?.url) {
    return match.value[0].url;
  }
  return match.value ?? null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.TALLY_SIGNING_SECRET;
  if (!secret) return res.status(503).json({ error: "Webhook signing is not configured" });
  const signature = req.headers["tally-signature"];
  const expected = createHmac("sha256", secret)
    .update(req.rawBody)
    .digest("base64");
  if (typeof signature !== "string" ||
      Buffer.byteLength(signature) !== Buffer.byteLength(expected) ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const payload = req.body;
  const data = payload?.data;
  const fields = data?.fields;
  if (!Array.isArray(fields)) {
    return res.status(400).json({ error: "Missing data.fields in payload" });
  }

  if (typeof data.responseId !== "string" || !data.responseId.trim()) {
    return res.status(400).json({ error: "Missing responseId" });
  }

  const student = {
    tally_response_id: data.responseId ?? null,
    name: field(fields, "name", "full name"),
    email: field(fields, "email"),
    school: field(fields, "school", "university"),
    grad_year: field(fields, "grad", "graduation"),
    major: field(fields, "major", "study"),
    resume_url: field(fields, "resume", "cv"),
    raw: payload,
  };

  if (typeof student.name !== "string" || !student.name.trim() ||
      typeof student.email !== "string" || !student.email.includes("@")) {
    return res
      .status(400)
      .json({ error: "Could not extract name/email from submission" });
  }

  // Upsert on tally_response_id so re-sent webhooks don't create duplicates.
  const { data: row, error } = await getSupabase()
    .from("startup_week_students")
    .upsert(student, { onConflict: "tally_response_id" })
    .select()
    .single();

  if (error) {
    console.error("[tally/webhook] upsert failed", error);
    return res.status(500).json({ error: "Failed to save student" });
  }

  return res.status(200).json({ id: row.id });
}
