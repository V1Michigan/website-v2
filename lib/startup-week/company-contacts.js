export function isCompanyContact(contactEmails, email) {
  if (typeof contactEmails !== "string" || typeof email !== "string") return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return contactEmails.split(",").some(contact => contact.trim().toLowerCase() === normalized);
}
