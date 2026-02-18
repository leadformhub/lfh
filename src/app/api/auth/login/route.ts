import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { findUserByEmail } from "@/services/auth.service";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { getSessionCookieName, getSessionMaxAge } from "@/lib/jwt";
import { verifyRecaptcha, isRecaptchaConfigured } from "@/lib/recaptcha";

const INVITE_PENDING_COOKIE = "leadformhub_invite_pending";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        {
          error: "Please verify your email before signing in. Check your inbox for the verification link.",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 }
      );
    }
    const token = await createToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      plan: user.plan,
      planValidUntil: user.planValidUntil?.toISOString() ?? null,
      authProvider: user.authProvider ?? undefined,
    });
    let redirectInvite = invite?.trim() || null;
    if (!redirectInvite) {
      const cookieStore = await cookies();
      const pendingInvite = cookieStore.get(INVITE_PENDING_COOKIE)?.value?.trim();
      if (pendingInvite) redirectInvite = pendingInvite;
    }
    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        plan: user.plan,
        emailVerifiedAt: user.emailVerifiedAt,
      },
      redirectTo: redirectInvite ? `/accept-invite?token=${encodeURIComponent(redirectInvite)}` : undefined,
    });
    res.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: getSessionMaxAge(),
      path: "/",
    });
    if (redirectInvite) {
      res.cookies.set(INVITE_PENDING_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
    }
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
