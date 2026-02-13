import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createLead } from "@/services/leads.service";
import { createLeadActivity } from "@/services/lead-activity.service";
import { isPhoneVerifiedForSubmission, isEmailVerifiedForSubmission } from "@/services/otp.service";
import { recordEvent } from "@/services/analytics.service";
import { sendNewLeadNotification } from "@/lib/email";
import { verifyRecaptcha, isRecaptchaConfigured } from "@/lib/recaptcha";
import { prisma } from "@/lib/db";
import { parseFormSchema } from "@/lib/form-schema";
import { validateName, validateEmail, validatePhone, isNameField } from "@/lib/validators";

type SchemaField = { id: string; type: string; name?: string; label: string; required: boolean };

/** Infer semantic storage key from field type when name is not set. */
function inferSemanticKey(field: SchemaField): string {
  if (field.name != null && String(field.name).trim() !== "") return String(field.name).trim();
  switch (field.type) {
    case "phone":
      return "phone_number";
    case "email":
      return "email";
    default:
      return field.id;
  }
}

/**
 * Map submission data from request keys (field.id) to semantic storage keys (field.name).
 * Field order is ignored; mapping is by schema only.
 */
function buildStructuredData(
  formData: Record<string, unknown>,
  schema: { fields: SchemaField[] }
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of schema.fields) {
    if (field.type === "hidden" || field.type === "recaptcha") continue;
    const value = formData[field.id];
    if (value === undefined) continue;
    const key = inferSemanticKey(field);
    out[key] = value;
  }
  return out;
}

function getByKeys(data: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = data[k];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "—";
}

/** Validate submission against form schema (required + format for name/email/phone). Returns error message or null. */
function validateSubmission(
  data: Record<string, unknown>,
  schema: { fields: SchemaField[] }
): string | null {
  for (const field of schema.fields) {
    if (field.type === "hidden" || field.type === "recaptcha") continue;
    const raw = data[field.id];
    const value = raw != null ? String(raw).trim() : "";
    const empty = value === "";

    if (field.required && empty) {
      return `"${field.label}" is required.`;
    }
    if (empty) continue; // skip format validation for empty optional fields

    if (field.type === "email") {
      const err = validateEmail(value);
      if (err) return `${field.label}: ${err}`;
    }
    if (field.type === "phone") {
      const err = validatePhone(value);
      if (err) return `${field.label}: ${err}`;
    }
    if (field.type === "text" && isNameField(field)) {
      const err = validateName(value);
      if (err) return `${field.label}: ${err}`;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      formId,
      data: rawData,
      recaptchaToken,
    } = body;
    if (!formId || typeof formId !== "string") {
      return NextResponse.json({ error: "Invalid request: formId required" }, { status: 400 });
    }
    const formData = rawData != null && typeof rawData === "object" && !Array.isArray(rawData)
      ? rawData
      : {};

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: { user: { select: { username: true, email: true, plan: true } } },
    });
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }
    if (form.lockedAt) {
      return NextResponse.json(
        { error: "This form is not accepting submissions. Upgrade to unlock." },
        { status: 403 }
      );
    }

    const schema = parseFormSchema(form.schemaJson);
    const status = schema.settings?.status ?? "PUBLIC";
    if (status !== "PUBLIC") {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.user?.plan === "free") {
      const startOfMonth = new Date();
      startOfMonth.setUTCDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);
      const leadsThisMonth = await prisma.lead.count({
        where: { userId: form.userId, createdAt: { gte: startOfMonth } },
      });
      if (leadsThisMonth >= 50) {
        return NextResponse.json(
          { error: "Monthly lead limit (50) reached for the free plan. Upgrade to accept more." },
          { status: 403 }
        );
      }
    }

    const err = validateSubmission(formData, schema);
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const recaptchaConfigured = isRecaptchaConfigured();
    const formRecaptchaEnabled = schema.settings?.recaptchaEnabled !== false;
    if (recaptchaConfigured && formRecaptchaEnabled) {
      const token = typeof recaptchaToken === "string" ? recaptchaToken.trim() : "";
      const devBypass = process.env.NODE_ENV === "development" && token === "dev-bypass";
      if (!token) {
        return NextResponse.json({ error: "reCAPTCHA token missing. Please try again." }, { status: 400 });
      }
      if (!devBypass) {
        const { success } = await verifyRecaptcha(token);
        if (!success) {
          return NextResponse.json({ error: "reCAPTCHA verification failed (low score or invalid). Please try again." }, { status: 400 });
        }
      }
    }

    const mobileOtpEnabled = schema.settings?.mobileOtpEnabled ?? false;
    if (mobileOtpEnabled) {
      const phoneField = schema.fields.find((f) => f.type === "phone");
      const phone = phoneField ? (formData[phoneField.id] as string) : null;
      if (!phone) {
        return NextResponse.json({ error: "Phone number required" }, { status: 400 });
      }
      const verified = await isPhoneVerifiedForSubmission(formId, phone);
      if (!verified) {
        return NextResponse.json({ error: "Please verify your phone with OTP first" }, { status: 400 });
      }
    }

    const emailOtpEnabled = schema.settings?.emailOtpEnabled ?? false;
    if (emailOtpEnabled) {
      const emailField = schema.fields.find((f) => f.type === "email");
      const email = emailField ? (formData[emailField.id] as string) : null;
      if (!email?.trim()) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
      }
      const verified = await isEmailVerifiedForSubmission(formId, email.trim());
      if (!verified) {
        return NextResponse.json({ error: "Please verify your email with OTP first" }, { status: 400 });
      }
    }

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? null;
    const userAgent = req.headers.get("user-agent") ?? null;

    const structuredData = buildStructuredData(formData, schema);
    const lead = await createLead(formId, form.userId, structuredData, { ipAddress, userAgent });
    await createLeadActivity(lead.id, "created").catch((err) =>
      console.error("[leads/submit] Failed to log lead activity:", err)
    );
    await recordEvent(formId, "submission");

    const emailAlertEnabled = schema.settings?.emailAlertEnabled ?? true;
    if (emailAlertEnabled && form.user?.email && form.user.plan !== "free") {
      const name = getByKeys(structuredData, ["name", "Name", "full_name", "fullName"]);
      const email = getByKeys(structuredData, ["email", "Email"]);
      sendNewLeadNotification(form.user.email, {
        name,
        email,
        source: "Direct",
        formName: form.name,
        username: form.user.username ?? undefined,
      }).catch((err) => console.error("[leads/submit] Lead notification email failed:", err));
    }

    if (form.user?.username) {
      revalidatePath(`/${form.user.username}`);
      revalidatePath(`/${form.user.username}/leads`);
    }
    return NextResponse.json({ id: lead.id });
  } catch (e) {
    console.error("[leads/submit]", e);
    const message = e instanceof Error ? e.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
