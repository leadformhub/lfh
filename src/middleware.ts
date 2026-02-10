import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Canonical origin for SEO — all non-canonical hosts 301 here. */
const CANONICAL_ORIGIN = "https://www.leadformhub.com";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
const API_PUBLIC = ["/api/auth/", "/api/otp/", "/api/leads/submit"];
const F_PREFIX = "/f/";

function shouldRedirectToCanonical(req: NextRequest): boolean {
  const hostHeader = req.headers.get("host") ?? "";
  const host = hostHeader.split(":")[0].toLowerCase();
  const proto = (req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "")).toLowerCase();

  const isProductionDomain = host === "leadformhub.com" || host === "www.leadformhub.com";
  const isCanonical = host === "www.leadformhub.com" && proto === "https";

  return isProductionDomain && !isCanonical;
}

export function middleware(req: NextRequest) {
  if (shouldRedirectToCanonical(req)) {
    const path = req.nextUrl.pathname + req.nextUrl.search;
    const destination = path === "/" ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${path}`;
    return NextResponse.redirect(destination, 301);
  }

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
