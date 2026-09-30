// Normalize the whole snapshot before the atomic database replacement.
export function normalizePreferences(input) {
  if (!Array.isArray(input) || input.length > 5000) throw new Error("Expected a shortlist of up to 5,000 candidates.");
  const seen = new Set();
  return input.map((pick, index) => {
    if (!pick || typeof pick.student_id !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(pick.student_id)) throw new Error("Every shortlist entry needs a valid student ID.");
    const id = pick.student_id.toLowerCase();
    if (seen.has(id)) throw new Error("A candidate can appear only once in a shortlist.");
    seen.add(id);
    if (pick.note != null && (typeof pick.note !== "string" || pick.note.length > 10000)) throw new Error("Notes must be text of at most 10,000 characters.");
    return {student_id: id, rank: index + 1, note: pick.note || null};
  });
}
