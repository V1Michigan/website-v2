import { selectionValues } from "./student-profile-fields";

// Explicit column allowlist: never interpolate a requested slug into a select.
export const COMPANY_RESPONSE_COLUMNS = {
  "advanced-spade-company": "advanced_spade_company_response",
  agentmail: "agentmail_response",
  asi: "asi_response",
  "authentic-insurance": "authentic_insurance_response",
  dryft: "dryft_response",
  embedder: "embedder_response",
  "khosla-ventures": "khosla_ventures_response",
  "latent-variables": "latent_variables_response",
  lumaril: "lumaril_response",
  miter: "miter_response",
  monaco: "monaco_response",
  phoebe: "phoebe_response",
  rational: "rational_response",
  "scope-health": "scope_health_response",
  spacexai: "spacexai_response",
  tavus: "tavus_response",
};

export const normalizeStudentEmail = email => typeof email === "string" ? email.trim().toLowerCase() : "";
export const responseColumnFor = slug => Object.hasOwn(COMPANY_RESPONSE_COLUMNS, slug) ? COMPANY_RESPONSE_COLUMNS[slug] : null;

// Iterate the original roster, preserving its IDs/order and students without a form.
// Only the current company's response is ever included in the result.
export function mergeStudentDetails(students, details, companySlug = null) {
  const byEmail = new Map(details.map(detail => [normalizeStudentEmail(detail.email), detail]));
  const responseColumn = responseColumnFor(companySlug);
  return students.map(student => {
    const detail = byEmail.get(normalizeStudentEmail(student.email));
    return {
      ...student,
      year: detail?.year || null,
      work_authorization: detail?.work_authorization || null,
      ...(companySlug ? {
        is_interested: selectionValues(detail?.interested).some(slug => slug.toLowerCase() === companySlug.toLowerCase()),
        question_response: responseColumn ? detail?.[responseColumn] || null : null,
      } : {}),
    };
  });
}
