import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/services/auth.service";
import { sendWelcomeEmail } from "@/lib/email";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }
  const userId = await verifyEmailToken(token);
  if (!userId) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
  if (user) await sendWelcomeEmail(user.email, user.name ?? undefined);
  return NextResponse.redirect(new URL("/login?verified=1", req.url));
}
