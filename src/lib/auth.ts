import { cache } from "react";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken, getSessionCookieName, type SessionPayload } from "./jwt";
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

/** Cached verified session for the request. Returns null when no session; throws EMAIL_NOT_VERIFIED when session exists but not verified. */
export const getVerifiedSessionCached = cache(async (): Promise<SessionPayload | null> => {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { emailVerifiedAt: true, authProvider: true },
  });
  if (!user || !user.emailVerifiedAt) throw new Error("EMAIL_NOT_VERIFIED");
  const plan = await syncPlanFromCapturedPayment(session.userId);
  return { ...session, plan, authProvider: user.authProvider ?? session.authProvider ?? undefined };
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
