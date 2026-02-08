/**
 * Form schema is stored in forms.schema_json. No DB column mapping.
 * Field types: text | email | number | textarea | select | checkbox | radio
 * (Plus optional: phone, file, hidden, recaptcha for builder compatibility.)
 */

export type FormFieldSchema = {
  id: string;
  type: string;
  /** Semantic key for storage (e.g. name, email, phone_number). Submission is mapped by this, not by field order. */
  name?: string;
  label: string;
  required: boolean;
  options?: string[]; // for select, checkbox, radio (stored as array in JSON)
};

export type FormSchema = {
  fields: FormFieldSchema[];
  settings?: {
    status?: "PUBLIC" | "PRIVATE";
    description?: string;
    redirectUrl?: string;
    showFormName?: boolean;
    /** When true (default), public form uses reCAPTCHA if keys are set in env. */
    recaptchaEnabled?: boolean;
    emailAlertEnabled?: boolean;
    emailOtpEnabled?: boolean;
    mobileOtpEnabled?: boolean;
    autoReplyEnabled?: boolean;
    autoReplySubject?: string;
    autoReplyBody?: string;
  };
};

export const DEFAULT_FORM_SCHEMA: FormSchema = {
  fields: [],
  settings: {
    status: "PUBLIC",
    showFormName: true,
    recaptchaEnabled: true,
    emailAlertEnabled: true,
    mobileOtpEnabled: false,
    autoReplyEnabled: false,
  },
};

export function parseFormSchema(json: string | object | null | undefined): FormSchema {
  if (json == null) return { ...DEFAULT_FORM_SCHEMA };
  if (json === "") return { ...DEFAULT_FORM_SCHEMA };
  try {
    let parsed: unknown =
      typeof json === "string" ? JSON.parse(json) : json;
    // Handle double-encoded JSON (e.g. string stored in DB)
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed) as unknown;
      } catch {
        return { ...DEFAULT_FORM_SCHEMA };
      }
    }
    if (parsed != null && typeof parsed === "object") {
      const s = parsed as Record<string, unknown>;
      const rawFields = s.fields;
      const fields = Array.isArray(rawFields) ? rawFields : [];
      return {
        fields,
        settings: (s.settings as FormSchema["settings"]) ?? DEFAULT_FORM_SCHEMA.settings,
      };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_FORM_SCHEMA };
}

export function stringifyFormSchema(schema: FormSchema): string {
  return JSON.stringify(schema);
}
