import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken, getSessionCookieName, type SessionPayload } from "./jwt";
import { prisma } from "./db";
import { syncPlanFromCapturedPayment } from "@/services/payment.service";

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

/** Use for dashboard and protected APIs. Ensures user has verified their email; throws if not. Plan is synced from captured payments so paid users always see the right plan. */
export async function requireVerifiedSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { emailVerifiedAt: true },
  });
  if (!user || !user.emailVerifiedAt) throw new Error("EMAIL_NOT_VERIFIED");
  const plan = await syncPlanFromCapturedPayment(session.userId);
  return { ...session, plan };
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
