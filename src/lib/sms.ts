/**
 * Fast2SMS Quick SMS only (no DLT). Mobile OTP via route "q".
 * Docs: https://docs.fast2sms.com/reference (Quick SMS API)
 * Project doc: docs/FAST2SMS-INTEGRATION.md
 *
 * Env: FAST2SMS_QUICK_API_KEY (required for mobile OTP).
 * If Fast2SMS returns a verification error, complete website verification in their Quick SMS section.
 */

const FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2";

const DEBUG = process.env.FAST2SMS_DEBUG === "true" || process.env.FAST2SMS_DEBUG === "1";

function debugLog(label: string, data: unknown) {
  if (DEBUG) {
    console.log(`[Fast2SMS DEBUG] ${label}`, JSON.stringify(data, null, 2));
  }
}

export interface SendOtpResult {
  success: boolean;
  message?: string;
  requestId?: string;
}

function getNormalizedPhone(phone: string): string | null {
  const normalized = phone.replace(/\D/g, "");
  return normalized.length === 10 ? normalized : null;
}

/**
 * Send OTP via Fast2SMS Quick SMS (route "q"). No DLT; custom message.
 */
export async function sendOtpViaFast2SMS(phone: string, otp: string): Promise<SendOtpResult> {
  const apiKey = process.env.FAST2SMS_QUICK_API_KEY?.trim();
  if (!apiKey) {
    console.error("[Fast2SMS] FAST2SMS_QUICK_API_KEY not configured");
    return { success: false, message: "SMS not configured" };
  }

  const normalizedPhone = getNormalizedPhone(phone);
  if (!normalizedPhone) {
    return { success: false, message: "Invalid phone number" };
  }

  const message = `Your OTP is ${otp}. Valid for 5 minutes. - LeadFormHub`;
  const body = { route: "q", message, numbers: normalizedPhone, flash: "0" };
  console.error("[Fast2SMS] CALLING API – POST", FAST2SMS_URL, "| route: q | numbers:", normalizedPhone);
  debugLog("request body", { route: body.route, numbers: body.numbers });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(FAST2SMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const rawText = await res.text();
    console.error("[Fast2SMS] API RESPONSE – status:", res.status, "| body:", rawText.slice(0, 200));
    let data: { return?: boolean; request_id?: string; message?: string | string[] };
    try {
      data = JSON.parse(rawText) as typeof data;
    } catch {
      return { success: false, message: `Quick SMS failed: ${res.status} ${rawText.slice(0, 200)}` };
    }

    const ok = res.ok && data.return === true;
    const msg = Array.isArray(data.message) ? data.message[0] : data.message;
    let messageStr = typeof msg === "string" ? msg : "";
    if (!ok && messageStr && /website verification|OTP Message|complete verification/i.test(messageStr)) {
      messageStr = "Complete website verification in Fast2SMS dashboard (Quick SMS section), then try again.";
    }
    return {
      success: ok,
      message: messageStr || undefined,
      requestId: data.request_id,
    };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[Fast2SMS] Quick SMS error:", errMsg, err);
    return { success: false, message: `Quick SMS failed: ${errMsg}` };
  }
}
