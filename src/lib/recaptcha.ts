/**
 * Server-side reCAPTCHA v3 (score-based) verification.
 * Verify the token with Google's siteverify API and check score threshold.
 */

const SITEVERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

const DEFAULT_V3_THRESHOLD = 0.3;

export type VerifyRecaptchaResult = { success: boolean; score?: number; hostname?: string };

export async function verifyRecaptcha(responseToken: string): Promise<VerifyRecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
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

export function getRecaptchaSiteKey(): string | null {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || null;
}

/** True when reCAPTCHA is fully configured (site + secret keys) so we can show the widget and verify tokens. */
export function isRecaptchaConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() &&
    process.env.RECAPTCHA_SECRET_KEY?.trim()
  );
}
