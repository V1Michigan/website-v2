// Matching algorithm for Startup Week.
//
// v0: a simple greedy matcher over company preference lists. Companies submit
// ranked preferences for students; we walk each company's list in rank order
// and assign students, respecting a per-company capacity. A student may match
// with multiple companies (a student can talk to several startups), but each
// (company, student) pairing is unique.
//
// This is intentionally a stub with a clear interface so it can be swapped for
// a fairer algorithm (e.g. Gale-Shapley stable matching once we also collect
// student preferences) without touching the API routes that call it.

/**
 * @typedef {{ company_id: string, student_id: string, rank: number|null }} Preference
 */

/**
 * Compute matches from company preferences.
 *
 * @param {Preference[]} preferences  all preference rows
 * @param {{ capacityPerCompany?: number }} [opts]
 * @returns {{ company_id: string, student_id: string }[]} pairings to create
 */
export function computeMatches(preferences, opts = {}) {
  const capacity = opts.capacityPerCompany ?? Infinity;

  // Group preferences by company, sorted by rank (nulls last).
  const byCompany = new Map();
  for (const pref of preferences) {
    if (!byCompany.has(pref.company_id)) byCompany.set(pref.company_id, []);
    byCompany.get(pref.company_id).push(pref);
  }
  for (const list of byCompany.values()) {
    list.sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
  }

  const matches = [];
  for (const [companyId, list] of byCompany) {
    let assigned = 0;
    for (const pref of list) {
      if (assigned >= capacity) break;
      matches.push({ company_id: companyId, student_id: pref.student_id });
      assigned += 1;
    }
  }

  return matches;
}
