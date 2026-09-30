import { profileFields, selectionValues } from "./student-profile-fields";

// Keep raw form submissions and unrelated internal fields out of company responses.
export const LEGACY_STUDENT_COLUMNS = "id, name, email, resume_url";

export const STUDENT_PROFILE_COLUMNS = [
  "id", "name",
  ...profileFields.map(field => field.key),
].join(", ");

export function serializeStudentProfile(student) {
  const profile = {id: student.id, name: student.name};
  for (const field of profileFields) {
    if (!(field.key in student)) continue;
    profile[field.key] = field.multi ? selectionValues(student[field.key]) : student[field.key] ?? null;
  }
  return profile;
}
