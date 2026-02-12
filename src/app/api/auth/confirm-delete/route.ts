import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { consumeDeleteAccountToken } from "@/services/auth.service";
import { getSessionCookieName } from "@/lib/jwt";

const bodySchema = z.object({
  token: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid or missing token" }, { status: 400 });
    }

    const userId = await consumeDeleteAccountToken(parsed.data.token);
    if (!userId) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
    }

    const url = new URL(req.url);
    const loginUrl = `${url.origin}/login`;

    const res = NextResponse.json({ success: true, redirect: loginUrl });
    res.cookies.set(getSessionCookieName(), "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
