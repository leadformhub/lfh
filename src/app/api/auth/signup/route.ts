import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createUserWithEmailOnly, getBaseUrlForEmail, sendEmailVerification } from "@/services/auth.service";
import { verifyRecaptcha, isRecaptchaConfigured } from "@/lib/recaptcha";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  recaptchaToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { email, password, recaptchaToken } = parsed.data;

    if (isRecaptchaConfigured()) {
      const token = typeof recaptchaToken === "string" ? recaptchaToken.trim() : "";
      if (!token) {
        return NextResponse.json(
          { error: "reCAPTCHA verification is required. Please refresh and try again." },
          { status: 400 }
        );
      }
      const { success } = await verifyRecaptcha(token);
      if (!success) {
        return NextResponse.json(
          { error: "reCAPTCHA verification failed. Please try again." },
          { status: 400 }
        );
      }
    }
    const user = await createUserWithEmailOnly(email, password);
    await sendEmailVerification(user.id, getBaseUrlForEmail());

    // Do not set session: user must verify email before they can log in or perform any action.
    // Welcome email is sent only after they verify (see verify-email route).
    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "Check your email to verify your account. You can sign in after verification.",
      user: {
        id: user.id,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Signup failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
