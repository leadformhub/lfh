import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getSessionCookieName } from "@/lib/jwt";

/** Canonical origin for SEO — all non-canonical hosts 301 here. */
const CANONICAL_ORIGIN = "https://www.leadformhub.com";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
const API_PUBLIC = ["/api/auth/", "/api/otp/", "/api/leads/submit"];
const F_PREFIX = "/f/";

/** Query param names that are tracking/alternate — redirect to clean URL to avoid GSC "Alternate page with proper canonical tag". */
const TRACKING_PARAMS = new Set(["ref", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]);

/** First path segment that are not dashboard (no auth required for these). */
const NON_DASHBOARD_FIRST = new Set(["api", "login", "signup", "forgot-password", "reset-password", "knowledge-base", "blog", "features", "pricing", "zoho-forms-alternative", "accept-invite", "f"]);

/** Second segment values that indicate dashboard area (auth required). */
const DASHBOARD_SEGMENTS = new Set(["dashboard", "forms", "leads", "settings", "analytics", "integrations", "raise-request", "payment-success", "access-denied"]);

function shouldRedirectToCanonical(req: NextRequest): boolean {
  const hostHeader = req.headers.get("host") ?? "";
  const host = hostHeader.split(":")[0].toLowerCase();
  const proto = (req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "")).toLowerCase();

  const isProductionDomain = host === "leadformhub.com" || host === "www.leadformhub.com";
  const isCanonical = host === "www.leadformhub.com" && proto === "https";

  return isProductionDomain && !isCanonical;
}

/** If on blog subdomain, 301 to www so GSC doesn't report blog URLs as alternates. */
function redirectBlogSubdomainToWww(req: NextRequest): NextResponse | null {
  const hostHeader = req.headers.get("host") ?? "";
  const host = hostHeader.split(":")[0].toLowerCase();
  if (host !== "blog.leadformhub.com") return null;
  const path = req.nextUrl.pathname + req.nextUrl.search;
  const destination = path === "/" ? `${CANONICAL_ORIGIN}/blog` : `${CANONICAL_ORIGIN}${path}`;
  return NextResponse.redirect(destination, 301);
}

/** Strip tracking params and return clean search string; if no change, return null. */
function getCleanSearchRedirect(nextUrl: NextRequest["nextUrl"]): string | null {
  const search = nextUrl.search;
  if (!search || search === "?") return null;
  const params = nextUrl.searchParams;
  let hasTracking = false;
  const rest: string[] = [];
  params.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (TRACKING_PARAMS.has(lower) || lower.startsWith("utm_")) hasTracking = true;
    else rest.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });
  if (!hasTracking) return null;
  const cleanSearch = rest.length ? "?" + rest.join("&") : "";
  return cleanSearch;
}

function isDashboardPath(path: string): boolean {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) return false;
  if (NON_DASHBOARD_FIRST.has(segments[0])) return false;
  return DASHBOARD_SEGMENTS.has(segments[1]);
}

export async function middleware(req: NextRequest) {
  const blogRedirect = redirectBlogSubdomainToWww(req);
  if (blogRedirect) return blogRedirect;

  if (shouldRedirectToCanonical(req)) {
    const path = req.nextUrl.pathname + req.nextUrl.search;
    const destination = path === "/" ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${path}`;
    return NextResponse.redirect(destination, 301);
  }

  const cleanSearch = getCleanSearchRedirect(req.nextUrl);
  if (cleanSearch !== null) {
    const path = req.nextUrl.pathname;
    const base = path === "/" ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${path}`;
    return NextResponse.redirect(base + cleanSearch, 301);
  }

  const path = req.nextUrl.pathname;
  if (process.env.NODE_ENV === "development") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${path}`);
  }
  if (path.startsWith("/api/auth/verify-email")) return NextResponse.next();
  if (path.startsWith(F_PREFIX)) return NextResponse.next();
  if (PUBLIC_PATHS.some((p) => path === p)) return NextResponse.next();
  if (path.startsWith("/api/") && API_PUBLIC.some((p) => path.startsWith(p))) return NextResponse.next();

  if (isDashboardPath(path)) {
    const token = req.cookies.get(getSessionCookieName())?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
