import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { findUserByEmail } from "@/services/auth.service";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { getSessionCookieName, getSessionMaxAge } from "@/lib/jwt";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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
    const { email, password } = parsed.data;
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
        { error: "Please verify your email before signing in. Check your inbox for the verification link." },
        { status: 403 }
      );
    }
    const token = await createToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      plan: user.plan,
      authProvider: user.authProvider ?? undefined,
    });
    const res = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        plan: user.plan,
        emailVerifiedAt: user.emailVerifiedAt,
      },
    });
    res.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: getSessionMaxAge(),
      path: "/",
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
