import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isEmailConfigured, sendPublicSupportFormNotification } from "@/lib/email";
import { verifyRecaptcha, isRecaptchaConfigured } from "@/lib/recaptcha";

const bodySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(10000),
  recaptchaToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.message },
        { status: 400 }
      );
    }

    if (isRecaptchaConfigured()) {
      const token = typeof parsed.data.recaptchaToken === "string" ? parsed.data.recaptchaToken.trim() : "";
      if (!token) {
        return NextResponse.json(
          { error: "reCAPTCHA token missing. Please try again." },
          { status: 400 }
        );
      }
      const { success } = await verifyRecaptcha(token);
      if (!success) {
        return NextResponse.json(
          { error: "reCAPTCHA verification failed (low score or invalid). Please try again." },
          { status: 400 }
        );
      }
    }

    const supportEmail = process.env.SUPPORT_EMAIL?.trim();
    if (!supportEmail) {
      return NextResponse.json(
        { error: "Support is not configured. Please try again later." },
        { status: 503 }
      );
    }

    if (!isEmailConfigured()) {
      console.error("[api/support/public] SUPPORT_EMAIL is set but SMTP is not configured (MAIL_MAILER, MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD).");
      return NextResponse.json(
        { error: "Support email delivery is not configured. Please try again later." },
        { status: 503 }
      );
    }

    const { recaptchaToken: _token, ...data } = parsed.data;
    const sent = await sendPublicSupportFormNotification(supportEmail, data);
    if (!sent) {
      console.error("[api/support/public] sendPublicSupportFormNotification returned false. Check server logs for 'Email send error'.");
      return NextResponse.json(
        { error: "Failed to send your request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/support/public]", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
