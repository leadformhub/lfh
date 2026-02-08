/**
 * Professional form validation for name, email, and phone.
 * Rejects garbage/invalid values.
 */

/** Name: letters, spaces, hyphens, apostrophes. 2–100 chars. No numbers or symbols. */
export function validateName(value: string): string | null {
  const s = (value ?? "").trim();
  if (s.length === 0) return null; // empty handled by required check
  if (s.length < 2) return "Name must be at least 2 characters.";
  if (s.length > 100) return "Name must be 100 characters or less.";
  // Allow: letters (any language), spaces, hyphens, apostrophes, periods (e.g. "Jr.")
  const validName = /^[\p{L}\p{M}\s\-'.]+$/u;
  if (!validName.test(s)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes.";
  }
  // Reject if it looks like garbage (e.g. all same char, or too many repeated chars)
  if (/^(.)\1{4,}$/.test(s)) {
    return "Please enter a valid name.";
  }
  return null;
}

/** Standard email format. Max 254 chars. */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export function validateEmail(value: string): string | null {
  const s = (value ?? "").trim();
  if (s.length === 0) return null;
  if (s.length > 254) return "Email address is too long.";
  if (!EMAIL_REGEX.test(s)) {
    return "Please enter a valid email address.";
  }
  return null;
}

/** Phone: digits only, 7–15 digits. Accepts +, spaces, dashes, parens; normalizes before check. */
export function validatePhone(value: string): string | null {
  const s = (value ?? "").trim();
  if (s.length === 0) return null;
  const digits = s.replace(/\D/g, "");
  if (digits.length < 7) {
    return "Please enter a valid phone number (at least 7 digits).";
  }
  if (digits.length > 15) {
    return "Phone number is too long.";
  }
  return null;
}

const NAME_KEYS = new Set(["name", "full_name", "fullname", "full name"]);

/** Whether a field (by type, name, id, label) should be validated as a name field. */
export function isNameField(field: { type?: string; name?: string; id?: string; label?: string }): boolean {
  if (field.type !== "text") return false;
  const key = (field.name ?? field.id ?? "").toLowerCase().replace(/\s/g, "_");
  const label = (field.label ?? "").toLowerCase().trim();
  return NAME_KEYS.has(key) || label === "name" || label === "full name";
}
