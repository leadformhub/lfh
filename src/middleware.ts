import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
const API_PUBLIC = ["/api/auth/", "/api/otp/", "/api/leads/submit"];
const F_PREFIX = "/f/";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (process.env.NODE_ENV === "development") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${path}`);
  }
  if (path.startsWith("/api/auth/verify-email")) return NextResponse.next();
  if (path.startsWith(F_PREFIX)) return NextResponse.next();
  if (PUBLIC_PATHS.some((p) => path === p)) return NextResponse.next();
  if (path.startsWith("/api/") && API_PUBLIC.some((p) => path.startsWith(p))) return NextResponse.next();
  return NextResponse.next();
}
