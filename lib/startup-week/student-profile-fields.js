// Explicit public profile fields; never render a submission's raw payload.
export const profileFields = [
  {key: "email", label: "Email", headers: ["Email"]},
  {key: "tier", label: "Tier", headers: ["Tier"], filter: true},
  {key: "linkedin_url", label: "LinkedIn", headers: ["Linkedin"], link: true},
  {key: "resume_url", label: "Resume", headers: ["Resume"], link: true},
  {key: "website_url", label: "Website", headers: ["Website"], link: true},
  {key: "github_url", label: "GitHub", headers: ["Github"], link: true},
  {key: "roles", label: "Roles of interest", headers: ["Which role are you interested in?"], multi: true, filter: true},
  {key: "company_types", label: "Company preferences (ranked)", headers: ["Rank the types of companies you are most interested in working at"], multi: true, filter: true, ranked: true, filterFirstChoice: true, filterLabel: "Top company preference"},
  {key: "full_time_seasons", label: "Full-time · in-person", headers: ["Which seasons can you commit to working FULL-TIME, IN-PERSON?"], multi: true, filter: true},
  {key: "part_time_seasons", label: "Part-time availability", headers: ["Additionally, which seasons can you commit to working part-time? (Keep in mind that it is rare for startups to hire part-time)"], multi: true, filter: true},
  {key: "expertise", label: "Expertise", headers: ["What fields/areas do you have expertise in?", "What is your area of expertise?", "expertise_fields"], multi: true, filter: true},
  {key: "project_url", label: "Project link", headers: ["Project link", "Project link (if applicable)", "Project link (if applicable)<br>", "additional_project_url"], link: true},
  {key: "project_description", label: "A project they’re proud of", headers: ["Please write about a project – technical or nontechnical –you're proud of that applies to your field of interest. (optional but encouraged so we can give companies more context)"]},
];

export function profileValue(student, field) {
  const value = student[field.key] ?? field.headers?.map(header => student[header]).find(value => value != null);
  return typeof value === "string" || typeof value === "number" || Array.isArray(value) ? value : "";
}

// A multi-select cell can be an array or a comma-separated list, with CSV quotes.
export function selectionValues(value) {
  if (Array.isArray(value)) return unique(value.filter(v => typeof v === "string").map(v => v.trim()));
  if (typeof value !== "string") return [];
  const values = [];
  let current = "", quoted = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === '"') {
      if (quoted && value[i + 1] === '"') { current += '"'; i++; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) { values.push(current.trim()); current = ""; }
    else current += char;
  }
  values.push(current.trim());
  return unique(values);
}
function unique(values) {
  const seen = new Set();
  return values.filter(value => {
    const key = value.toLowerCase();
    if (!value || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
export function fieldSelections(student, field) {
  const value = profileValue(student, field);
  return field.multi || Array.isArray(value) ? selectionValues(value) : value ? [String(value).trim()] : [];
}
export function safeProfileUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const input = value.trim();
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`);
    return ["https:", "http:"].includes(url.protocol) && url.hostname.includes(".") ? url.href : null;
  } catch { return null; }
}

export function compareTier(a, b) {
  const ranks = {S: 0, A: 1, B: 2, C: 3};
  return (ranks[String(a).trim().toUpperCase()] ?? 4) - (ranks[String(b).trim().toUpperCase()] ?? 4) || String(a).localeCompare(String(b));
}

export function compareCandidates(a, b, key = "tier", direction = "asc") {
  const nameOrder = String(a.name || "").localeCompare(String(b.name || ""), undefined, {sensitivity: "base"});
  const multiplier = direction === "desc" ? -1 : 1;
  if (key === "name") return multiplier * nameOrder || String(a.id).localeCompare(String(b.id));
  const tierA = String(a.tier || "").trim().toUpperCase();
  const tierB = String(b.tier || "").trim().toUpperCase();
  const knownA = ["S", "A", "B", "C"].includes(tierA);
  const knownB = ["S", "A", "B", "C"].includes(tierB);
  if (knownA !== knownB) return knownA ? -1 : 1;
  return multiplier * compareTier(tierA, tierB) || nameOrder || String(a.id).localeCompare(String(b.id));
}
