import { NextRequest, NextResponse } from "next/server";
import { getSession, CURRENT_ACCOUNT_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Clears the current-account cookie and redirects to the user's own dashboard. Use when the user is viewing a team's account and wants to switch back to their own. */
export async function GET(req: NextRequest) {
  const session = await getSession();
  const baseUrl = req.nextUrl.origin;
  if (!session) {
    return NextResponse.redirect(new URL("/login", baseUrl));
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { username: true },
  });
  if (!user) {
    return NextResponse.redirect(new URL("/login", baseUrl));
  }
  const res = NextResponse.redirect(new URL(`/${user.username}/dashboard`, baseUrl), 302);
  res.cookies.set(CURRENT_ACCOUNT_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
