import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createUserWithEmailOnly, getBaseUrlForEmail, sendEmailVerification } from "@/services/auth.service";
import { verifyRecaptcha, isRecaptchaConfigured } from "@/lib/recaptcha";

const INVITE_PENDING_COOKIE = "leadformhub_invite_pending";
const INVITE_PENDING_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (match invite expiry)

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  recaptchaToken: z.string().optional(),
  invite: z.string().optional(),
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
    const { email, password, recaptchaToken, invite } = parsed.data;

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
    const res = NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "Check your email to verify your account. You can sign in after verification.",
      user: {
        id: user.id,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt,
      },
    });
    if (invite?.trim()) {
      res.cookies.set(INVITE_PENDING_COOKIE, invite.trim(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: INVITE_PENDING_MAX_AGE,
        path: "/",
      });
    }
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Signup failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
