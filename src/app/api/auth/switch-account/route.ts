import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse, CURRENT_ACCOUNT_COOKIE } from "@/lib/auth";
import { getSessionMaxAge } from "@/lib/jwt";
import { prisma } from "@/lib/db";

/** Sets the current-account cookie to the given team (by owner username) and redirects to that team's dashboard. Use when the user is on their own dashboard and wants to switch to a team they're a member of. */
export async function GET(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;

  const username = req.nextUrl.searchParams.get("username")?.trim();
  if (!username) {
    return NextResponse.redirect(new URL(session.username ? `/${session.username}/dashboard` : "/login", req.nextUrl.origin));
  }

  const owner = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!owner) {
    return NextResponse.redirect(new URL(session.username ? `/${session.username}/dashboard` : "/login", req.nextUrl.origin));
  }

  const membership = await prisma.teamMember.findFirst({
    where: {
      memberUserId: session.userId,
      accountOwnerId: owner.id,
      status: "active",
    },
    select: { accountOwnerId: true },
  });
  if (!membership) {
    return NextResponse.redirect(new URL(session.username ? `/${session.username}/dashboard` : "/login", req.nextUrl.origin));
  }

  const res = NextResponse.redirect(new URL(`/${username}/dashboard`, req.nextUrl.origin), 302);
  res.cookies.set(CURRENT_ACCOUNT_COOKIE, membership.accountOwnerId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: getSessionMaxAge(),
    path: "/",
  });
  return res;
}
