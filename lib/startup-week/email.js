import axios from "axios";

// Thin wrapper over the Resend REST API (https://resend.com/docs).
// We call the REST endpoint directly with axios (already a dependency).
//
// The rest of the app should only depend on `sendEmail` — swapping providers
// (e.g. SendGrid) later means changing this file only.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Send a single email.
 * @param {{ to: string|string[], subject: string, html: string, from?: string }} opts
 * @returns {Promise<{ id: string }>} the provider's message id
 */
export async function sendEmail({ to, subject, html, from, idempotencyKey }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const sender = from || process.env.EMAIL_FROM;
  if (!sender) {
    throw new Error("No sender configured (pass `from` or set EMAIL_FROM)");
  }

  const { data } = await axios.post(
    RESEND_ENDPOINT,
    { from: sender, to, subject, html },
    {
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
    }
  );

  return { id: data.id };
}

/**
 * Build the match-notification email body for a student.
 * Kept here so templates live next to the transport.
 */
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char]));
}

export function matchEmailTemplate({ studentName, companyName }) {
  const subject = `You've been matched with ${companyName} for V1 Startup Week!`;
  const html = `
    <p>Hi ${escapeHtml(studentName)},</p>
    <p>Great news — <strong>${escapeHtml(companyName)}</strong> reviewed your resume through
    V1 Startup Week and would like to connect with you.</p>
    <p>Keep an eye on your inbox for next steps on scheduling a conversation.</p>
    <p>— The V1 Startup Week Team</p>
  `;
  return { subject, html };
}
