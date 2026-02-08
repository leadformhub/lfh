import { NextRequest, NextResponse } from "next/server";
import { verifyEmailChangeToken } from "@/services/auth.service";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }
  const result = await verifyEmailChangeToken(token);
  if (!result) {
    return NextResponse.redirect(new URL("/login?error=invalid_or_expired_token", req.url));
  }
  const message = encodeURIComponent("Email updated. Please sign in with your new email.");
  return NextResponse.redirect(new URL(`/login?email_changed=1&message=${message}`, req.url));
}
