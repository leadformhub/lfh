import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { createToken } from "@/lib/jwt";
import { getSessionCookieName, getSessionMaxAge } from "@/lib/jwt";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  newUsername: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-z0-9_-]+$/i, "Username: letters, numbers, _ and - only"),
});

export async function POST(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors.newUsername?.[0] ?? "Invalid username";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const newUsername = parsed.data.newUsername.toLowerCase().replace(/\s/g, "");

    if (newUsername === session.username.toLowerCase()) {
      return NextResponse.json({ error: "New username is the same as current" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { username: newUsername },
    });
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { username: newUsername },
    });

    const token = await createToken({
      userId: session.userId,
      username: newUsername,
      email: session.email,
      plan: session.plan,
    });

    const res = NextResponse.json({
      message: "Username updated.",
      username: newUsername,
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
    const msg = e instanceof Error ? e.message : "Failed to update username";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
