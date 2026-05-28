import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getSessionCookieName } from "@/lib/jwt";
import {
  BLOG_SUBDOMAIN_HOST,
  CANONICAL_ORIGIN,
  resolveBlogSubdomainDestination,
} from "@/lib/blog-subdomain-redirects";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
const API_PUBLIC = ["/api/auth/", "/api/otp/", "/api/leads/submit"];
const F_PREFIX = "/f/";

/** Query param names that are tracking/alternate — redirect to clean URL to avoid GSC "Alternate page with proper canonical tag". */
const TRACKING_PARAMS = new Set(["ref", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]);

/** First path segment that are not dashboard (no auth required for these). */
const NON_DASHBOARD_FIRST = new Set(["api", "login", "signup", "forgot-password", "reset-password", "knowledge-base", "blog", "features", "pricing", "zoho-forms-alternative", "accept-invite", "f"]);

/** Second segment values that indicate dashboard area (auth required). */
const DASHBOARD_SEGMENTS = new Set(["dashboard", "forms", "leads", "settings", "analytics", "integrations", "raise-request", "payment-success", "access-denied"]);

/** 301 www → non-www apex (canonical host). */
function redirectWwwToApex(req: NextRequest): NextResponse | null {
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (host !== "www.leadformhub.com") return null;
  const path = req.nextUrl.pathname + req.nextUrl.search;
  const destination = path === "/" ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${path}`;
  return NextResponse.redirect(destination, 301);
}

function shouldRedirectHttpToHttps(req: NextRequest): boolean {
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const proto = (req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "")).toLowerCase();
  return host === "leadformhub.com" && proto !== "https";
}

/** 301 blog.leadformhub.com → leadformhub.com/blog (exact slug map + /blog/:slug fallback). */
function redirectBlogSubdomainToCanonical(req: NextRequest): NextResponse | null {
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (host !== BLOG_SUBDOMAIN_HOST) return null;
  const canonicalPath = resolveBlogSubdomainDestination(req.nextUrl.pathname);
  const destination = `${CANONICAL_ORIGIN}${canonicalPath}${req.nextUrl.search}`;
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

function nextWithPathname(req: NextRequest): NextResponse {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export async function middleware(req: NextRequest) {
  const wwwRedirect = redirectWwwToApex(req);
  if (wwwRedirect) return wwwRedirect;

  const blogRedirect = redirectBlogSubdomainToCanonical(req);
  if (blogRedirect) return blogRedirect;

  if (shouldRedirectHttpToHttps(req)) {
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
  if (path.startsWith("/api/auth/verify-email")) return nextWithPathname(req);
  if (path.startsWith(F_PREFIX)) return nextWithPathname(req);
  if (PUBLIC_PATHS.some((p) => path === p)) return nextWithPathname(req);
  if (path.startsWith("/api/") && API_PUBLIC.some((p) => path.startsWith(p))) return nextWithPathname(req);
  if (path.startsWith("/api/public/")) return nextWithPathname(req);

  if (isDashboardPath(path)) {
    const token = req.cookies.get(getSessionCookieName())?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.redirect(new URL("/login", req.url));
  }

  return nextWithPathname(req);
}
