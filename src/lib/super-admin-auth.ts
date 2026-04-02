import * as jose from "jose";
import { cookies } from "next/headers";

const SUPER_ADMIN_COOKIE = "leadformhub_super_admin_session";
const SUPER_ADMIN_MAX_AGE = 60 * 60 * 8; // 8 hours
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "leadformhub-secret-change-in-production"
);

interface SuperAdminTokenPayload {
  role: "super_admin";
  email: string;
  iat?: number;
  exp?: number;
}

export function getSuperAdminCredentials() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() || "";
  const password = process.env.SUPER_ADMIN_PASSWORD?.trim() || "";
  if (!email || !password) return null;
  return { email, password };
}

export async function createSuperAdminToken(email: string) {
  return new jose.SignJWT({ role: "super_admin", email } satisfies SuperAdminTokenPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SUPER_ADMIN_MAX_AGE}s`)
    .sign(SECRET);
}

export async function verifySuperAdminToken(token: string): Promise<SuperAdminTokenPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    if (payload.role !== "super_admin") return null;
    if (typeof payload.email !== "string" || !payload.email) return null;
    return payload as unknown as SuperAdminTokenPayload;
  } catch {
    return null;
  }
}

export async function getSuperAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SUPER_ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySuperAdminToken(token);
}

export function getSuperAdminCookieName() {
  return SUPER_ADMIN_COOKIE;
}

export function getSuperAdminSessionMaxAge() {
  return SUPER_ADMIN_MAX_AGE;
}
