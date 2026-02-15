import { cache } from "react";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionCookieName, verifyToken, type SessionPayload } from "./jwt";
import { prisma } from "./db";

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;
  return verifyToken(token);
});

/**
 * JWT-only session for layout: no DB. Use for dashboard layout so first byte can stream immediately.
 * Only returns when token is valid; we only issue tokens after email verification, so no extra check.
 */
export const getMinimalSessionFromJwt = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return {
    ...payload,
    accountOwnerId: payload.accountOwnerId ?? payload.userId,
    role: (payload.role ?? "owner") as SessionPayload["role"],
  };
});

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export const CURRENT_ACCOUNT_COOKIE = "leadformhub_account";

/**
 * Cached verified session. Plan is read from DB only (no payment sync in hot path).
 * Plan is applied on payment-success (verifyAndFulfill); for webhooks, sync separately.
 */
export const getVerifiedSessionCached = cache(async (): Promise<SessionPayload | null> => {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { emailVerifiedAt: true, authProvider: true, plan: true },
  });
  if (!user || !user.emailVerifiedAt) throw new Error("EMAIL_NOT_VERIFIED");

  const cookieStore = await cookies();
  const currentAccountId = cookieStore.get(CURRENT_ACCOUNT_COOKIE)?.value?.trim() || null;

  if (!currentAccountId || currentAccountId === session.userId) {
    return {
      ...session,
      plan: user.plan,
      authProvider: user.authProvider ?? session.authProvider ?? undefined,
      accountOwnerId: session.userId,
      role: "owner",
    };
  }

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
    const owner = await prisma.user.findUnique({
      where: { id: membership.accountOwnerId },
      select: { username: true, plan: true },
    });
    if (!owner) return null;
    return {
      ...session,
      username: owner.username,
      plan: owner.plan,
      planValidUntil: undefined,
      authProvider: user.authProvider ?? session.authProvider ?? undefined,
      accountOwnerId: membership.accountOwnerId,
      role: membership.role as SessionPayload["role"],
    };
  }

  return {
    ...session,
    plan: user.plan,
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
