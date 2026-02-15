import { cache } from "react";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionCookieName, verifyToken, type SessionPayload } from "./jwt";
import { prisma } from "./db";
import { syncPlanFromCapturedPayment } from "@/services/payment.service";

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;
  return verifyToken(token);
});

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export const CURRENT_ACCOUNT_COOKIE = "leadformhub_account";

/** Cached verified session for the request. Returns null when no session; throws EMAIL_NOT_VERIFIED when session exists but not verified. Resolves account context: prefers own account unless CURRENT_ACCOUNT_COOKIE is set to another account the user is a member of (so users who are both owner and team member see their own dashboard by default). */
export const getVerifiedSessionCached = cache(async (): Promise<SessionPayload | null> => {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { emailVerifiedAt: true, authProvider: true },
  });
  if (!user || !user.emailVerifiedAt) throw new Error("EMAIL_NOT_VERIFIED");

  const cookieStore = await cookies();
  const currentAccountId = cookieStore.get(CURRENT_ACCOUNT_COOKIE)?.value?.trim() || null;

  // Prefer own account when cookie unset or set to self
  if (!currentAccountId || currentAccountId === session.userId) {
    const plan = await syncPlanFromCapturedPayment(session.userId);
    return {
      ...session,
      plan,
      authProvider: user.authProvider ?? session.authProvider ?? undefined,
      accountOwnerId: session.userId,
      role: "owner",
    };
  }

  // Cookie points to another account: use it only if user has active membership there
  let membership: { accountOwnerId: string; role: string } | null = null;
  try {
    membership = await prisma.teamMember.findFirst({
      where: {
        memberUserId: session.userId,
        accountOwnerId: currentAccountId,
        status: "active",
      },
      select: { accountOwnerId: true, role: true },
    });
  } catch {
    // TeamMember table may not exist yet (migration not run)
  }

  if (membership) {
    const ownerPlan = await syncPlanFromCapturedPayment(membership.accountOwnerId);
    const owner = await prisma.user.findUnique({
      where: { id: membership.accountOwnerId },
      select: { username: true },
    });
    if (!owner) return null;
    return {
      ...session,
      username: owner.username,
      plan: ownerPlan,
      planValidUntil: undefined,
      authProvider: user.authProvider ?? session.authProvider ?? undefined,
      accountOwnerId: membership.accountOwnerId,
      role: membership.role as SessionPayload["role"],
    };
  }

  // Invalid or no access to requested account: use own account
  const plan = await syncPlanFromCapturedPayment(session.userId);
  return {
    ...session,
    plan,
    authProvider: user.authProvider ?? session.authProvider ?? undefined,
    accountOwnerId: session.userId,
    role: "owner",
  };
});

/** Use for dashboard and protected APIs. Ensures user has verified their email; throws if not. Plan is synced from captured payments so paid users always see the right plan. */
export async function requireVerifiedSession(): Promise<SessionPayload> {
  try {
    const session = await getVerifiedSessionCached();
    if (session) return session;
  } catch (e) {
    if (e instanceof Error && e.message === "EMAIL_NOT_VERIFIED") throw e;
  }
  throw new Error("UNAUTHORIZED");
}

/** For API routes: returns session or a NextResponse to return (401 or 403). */
export async function getVerifiedSessionOrResponse(): Promise<
  { session: SessionPayload } | { response: NextResponse }
> {
  try {
    const session = await requireVerifiedSession();
    return { session };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "EMAIL_NOT_VERIFIED") {
      return {
        response: NextResponse.json(
          { error: "Please verify your email to access this." },
          { status: 403 }
        ),
      };
    }
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}
