import { BLOG_POSTS } from "./blog";
import { OFF_TOPIC_BLOG_REDIRECTS } from "./off-topic-blog-redirects";

export const BLOG_SUBDOMAIN_HOST = "blog.leadformhub.com";
export const CANONICAL_ORIGIN = "https://leadformhub.com";

/** Apex pages that lived at blog.leadformhub.com/:page — not under /blog on the canonical host. */
const APEX_SITE_PATHS = [
  "features",
  "knowledge-base",
  "terms-and-conditions",
  "pricing",
  "about",
  "contact",
  "faq",
  "support",
  "integrations",
  "privacy-policy",
  "disclaimer",
  "api-docs",
  "typeform-alternative",
  "zoho-forms-alternative",
  "free-online-form-builder-unlimited",
  "signup",
] as const;

const APEX_SITE_REDIRECTS: Readonly<Record<string, string>> = Object.fromEntries(
  APEX_SITE_PATHS.map((segment) => [`/${segment}`, `/${segment}`])
);

/** Retired WordPress slugs on the blog subdomain that are not in BLOG_POSTS. */
const BLOG_SUBDOMAIN_WORDPRESS_LEGACY: Readonly<Record<string, string>> = {
  "/leadformhub-com-best-free-online-form-builder": "/free-online-form-builder-unlimited",
};

/**
 * Wrong /blog/:slug on leadformhub.com when :slug is an apex page (from old subdomain catch-all).
 * Fixes GSC 404s on URLs like /blog/features and /blog/knowledge-base.
 */
export const APEX_BLOG_PREFIX_MISTAKE_REDIRECTS: Readonly<Record<string, string>> = {
  ...Object.fromEntries(APEX_SITE_PATHS.map((segment) => [`/blog/${segment}`, `/${segment}`])),
  ...Object.fromEntries(
    Object.entries(BLOG_SUBDOMAIN_WORDPRESS_LEGACY).map(([source, dest]) => [`/blog${source}`, dest])
  ),
};

/**
 * Legacy paths on blog.leadformhub.com that do not follow the default /blog/:slug pattern.
 * Keys are normalized paths (no trailing slash). Values are full paths on leadformhub.com.
 */
const BLOG_SUBDOMAIN_LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  "/": "/blog",
  "/blog": "/blog",
  "/home": "/blog",
  "/category/blog": "/blog",
  "/login": "/login",
  "/how-to-generate-leads-using-free-tools": "/blog/how-to-generate-leads-for-free",
  "/best-free-lead-generation-form": "/free-online-form-builder-unlimited",
  "/best-free-online-form-builder": "/free-online-form-builder-unlimited",
  "/free-online-form-builder": "/free-online-form-builder-unlimited",
  "/free-online-form-builder-unlimited": "/free-online-form-builder-unlimited",
  ...APEX_SITE_REDIRECTS,
  ...BLOG_SUBDOMAIN_WORDPRESS_LEGACY,
  ...Object.fromEntries(
    Object.entries(OFF_TOPIC_BLOG_REDIRECTS).filter(([source]) => !source.startsWith("/blog/"))
  ),
};

/** All blog post slugs at subdomain root → /blog/:slug on apex. */
const BLOG_SUBDOMAIN_POST_REDIRECTS: Readonly<Record<string, string>> = Object.fromEntries(
  BLOG_POSTS.map(({ slug }) => [`/${slug}`, `/blog/${slug}`])
);

export const BLOG_SUBDOMAIN_EXACT_REDIRECTS: Readonly<Record<string, string>> = {
  ...BLOG_SUBDOMAIN_POST_REDIRECTS,
  ...BLOG_SUBDOMAIN_LEGACY_REDIRECTS,
};

export function normalizeBlogSubdomainPath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

/** Resolve blog.leadformhub.com pathname → canonical leadformhub.com path (no origin). */
export function resolveBlogSubdomainDestination(pathname: string): string {
  const path = normalizeBlogSubdomainPath(pathname);
  const exact = BLOG_SUBDOMAIN_EXACT_REDIRECTS[path];
  if (exact) return exact;
  if (path.startsWith("/blog/")) return path;
  return `/blog${path}`;
}

type HostRedirect = {
  source: string;
  has: Array<{ type: "host"; value: string }>;
  destination: string;
  permanent: boolean;
};

/** Next.js / Vercel host-based 301 rules for blog.leadformhub.com. */
export function buildBlogSubdomainNextRedirects(): HostRedirect[] {
  const host = BLOG_SUBDOMAIN_HOST;
  const redirects: HostRedirect[] = [];

  for (const [source, dest] of Object.entries(BLOG_SUBDOMAIN_EXACT_REDIRECTS)) {
    redirects.push({
      source,
      has: [{ type: "host", value: host }],
      destination: `${CANONICAL_ORIGIN}${dest}`,
      permanent: true,
    });
    if (source !== "/") {
      redirects.push({
        source: `${source}/`,
        has: [{ type: "host", value: host }],
        destination: `${CANONICAL_ORIGIN}${dest}`,
        permanent: true,
      });
    }
  }

  redirects.push(
    {
      source: "/blog/:path*",
      has: [{ type: "host", value: host }],
      destination: `${CANONICAL_ORIGIN}/blog/:path*`,
      permanent: true,
    },
    {
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: `${CANONICAL_ORIGIN}/blog/:path*`,
      permanent: true,
    }
  );

  return redirects;
}
