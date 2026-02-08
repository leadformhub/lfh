import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getSessionCookieName } from "@/lib/jwt";
import { deleteAccount } from "@/services/auth.service";

const bodySchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;

  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { password } = parsed.data;

    await deleteAccount(session.userId, password);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete account";
    return NextResponse.json({ error: message }, { status: 400 });
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
}
