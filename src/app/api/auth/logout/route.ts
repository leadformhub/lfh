import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName } from "@/lib/jwt";

function clearSessionCookie(origin: string, redirectTo?: string) {
  const url = redirectTo && redirectTo.startsWith("/") ? `${origin}${redirectTo}` : `${origin}/login`;
  const res = NextResponse.redirect(url);
  res.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect");
  return clearSessionCookie(url.origin, redirectTo || undefined);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  return clearSessionCookie(url.origin);
}
