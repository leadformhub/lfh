import * as jose from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "leadformhub-secret-change-in-production"
);

const COOKIE_NAME = "leadformhub_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  plan: string;
  planValidUntil?: string | null; // ISO date when paid plan expires; null for free or legacy
  authProvider?: string | null; // 'google' | 'email'; null/undefined for legacy
  iat?: number;
  exp?: number;
}

export async function createToken(payload: Omit<SessionPayload, "iat" | "exp">): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export function getSessionMaxAge() {
  return MAX_AGE;
}
