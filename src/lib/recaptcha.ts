import { getSuperAdminRecaptchaSettings } from "@/lib/super-admin-recaptcha-store";

/**
 * Server-side reCAPTCHA v3 (score-based) verification.
 * Verify the token with Google's siteverify API and check score threshold.
 */

const SITEVERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

const DEFAULT_V3_THRESHOLD = 0.3;

export type VerifyRecaptchaResult = { success: boolean; score?: number; hostname?: string };

export async function verifyRecaptcha(responseToken: string): Promise<VerifyRecaptchaResult> {
  const settings = await getSuperAdminRecaptchaSettings();
  if (!settings?.enabled) return { success: true };
  const secret = settings.secretKey?.trim();
  if (!secret?.trim()) {
    return { success: false };
  }
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: responseToken }).toString(),
    });
    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      hostname?: string;
    };
    if (!data.success) {
      return { success: false, score: data.score, hostname: data.hostname };
    }
    const score = typeof data.score === "number" ? data.score : undefined;
    if (score === undefined) {
      return { success: true, hostname: data.hostname };
    }
    const threshold =
      typeof process.env.RECAPTCHA_V3_THRESHOLD !== "undefined"
        ? Number(process.env.RECAPTCHA_V3_THRESHOLD)
        : DEFAULT_V3_THRESHOLD;
    const passed = score >= threshold;
    return { success: passed, score, hostname: data.hostname };
  } catch {
    return { success: false };
  }
}

export async function getRecaptchaSiteKey(): Promise<string | null> {
  const settings = await getSuperAdminRecaptchaSettings();
  if (!settings?.enabled) return null;
  return settings.siteKey?.trim() || null;
}

/** True when reCAPTCHA is fully configured in Super Admin settings. */
export async function isRecaptchaConfigured(): Promise<boolean> {
  const settings = await getSuperAdminRecaptchaSettings();
  return Boolean(settings?.enabled && settings.siteKey?.trim() && settings.secretKey?.trim());
}
