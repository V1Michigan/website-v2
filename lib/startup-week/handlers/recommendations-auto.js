import { readAll } from "@/lib/startup-week/read-all";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabase } from "@/lib/startup-week/supabase";
import { getUserFromReq, isAdmin } from "@/lib/startup-week/auth";

// POST /api/startup-week/recommendations/auto — AI-generated first pass at student<->company
// recommendations. Admin-only. Returns { pairings: { [studentId]: [companyId] } }
// WITHOUT persisting — the admin reviews/edits the suggestions in the grid, then
// saves via POST /api/startup-week/recommendations. This is the "auto-solve, then manually
// update" default.

// Structured-output schema: an array so it maps cleanly to JSON Schema (dynamic
// student-keyed objects can't be expressed with additionalProperties: false).
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["recommendations"],
  properties: {
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["student_id", "company_ids"],
        properties: {
          student_id: { type: "string" },
          company_ids: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Not signed in" });
  if (!(await isAdmin(user.email))) return res.status(403).json({ error: "Admin only" });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set" });
  }

  const studentIds = req.body?.student_ids;
  if (!Array.isArray(studentIds) || studentIds.length === 0 || studentIds.length > 40 ||
      studentIds.some((id) => typeof id !== "string")) {
    return res.status(400).json({ error: "Expected 1–40 student_ids" });
  }

  const [studentsRes, companiesRes] = await Promise.all([
    readAll(() => getSupabase().from("startup_week_students").select("id, name, school, grad_year, major").in("id", studentIds)),
    readAll(() => getSupabase().from("startup_week_companies").select("id, name, description")),
  ]);
  if (studentsRes.error || companiesRes.error) {
    console.error("[auto] load failed", studentsRes.error || companiesRes.error);
    return res.status(500).json({ error: "Failed to load data" });
  }
  const students = studentsRes.data || [];
  const companies = companiesRes.data || [];
  if (students.length === 0 || companies.length === 0) {
    return res.status(200).json({ pairings: {} });
  }

  const companyLines = companies
    .map(
      (c) =>
        `- id=${c.id} | ${c.name}${c.description ? ` — ${c.description}` : ""}`
    )
    .join("\n");
  const studentLines = students
    .map(
      (s) =>
        `- id=${s.id} | ${s.name} | ${[s.major, s.school, s.grad_year]
          .filter(Boolean)
          .join(", ")}`
    )
    .join("\n");

  const system =
    "You help the University of Michigan V1 team match students to startups for " +
    "Startup Week. For each student, pick the companies where they are a genuinely " +
    "strong fit based on major, background, and each company's focus. Recommend only " +
    "real fits (roughly 1-5 companies per student; fewer is fine, none if truly no " +
    "fit). Use only the exact id values provided; never invent ids.";

  const prompt =
    `Companies:\n${companyLines}\n\nStudents:\n${studentLines}\n\n` +
    "Return recommendations for every student (company_ids may be empty).";

  try {
    const client = new Anthropic({ timeout: 45000, maxRetries: 0 });
    const stream = client.messages.stream({
      model: "claude-opus-4-8",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      system,
      messages: [{ role: "user", content: prompt }],
    });
    const final = await stream.finalMessage();

    if (final.stop_reason !== "end_turn") {
      return res.status(502).json({ error: "AI output was incomplete. No recommendations were changed." });
    }
    const text = final.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");
    const parsed = JSON.parse(text);

    // Keep only ids we recognize, so a stray/hallucinated id can't corrupt state.
    const validStudents = new Set(students.map((s) => s.id));
    const validCompanies = new Set(companies.map((c) => c.id));
    const pairings = Object.fromEntries(students.map((s) => [s.id, []]));
    for (const rec of parsed.recommendations || []) {
      if (!validStudents.has(rec.student_id)) continue;
      pairings[rec.student_id] = [...new Set((rec.company_ids || []).filter((id) => validCompanies.has(id)))];
    }

    return res.status(200).json({ pairings });
  } catch (err) {
    console.error("[auto] pairing failed", err.status || "provider error");
    return res.status(502).json({ error: "AI pairing failed. Try again." });
  }
}
