import type { Metadata } from "next";

/**
 * Canonical host for production — must match middleware CANONICAL_ORIGIN so
 * every page's canonical tag is self-referencing when served on www (avoids
 * "Alternate page with proper canonical tag" and ensures the page is indexed).
 */
const PRODUCTION_SITE_URL = "https://www.leadformhub.com";

/**
 * SEO configuration — canonical URLs, Open Graph, and metadata.
 * Uses APP_URL or NEXTAUTH_URL from env so blog and all pages use the app domain (e.g. leadformhub.online or localhost).
 * In production (leadformhub.com), always returns PRODUCTION_SITE_URL so canonicals match the canonical host.
 */
function getSiteUrl(): string {
  const app = process.env.APP_URL?.trim()?.replace(/\/$/, "");
  const auth = process.env.NEXTAUTH_URL?.trim()?.replace(/\/$/, "");
  const envUrl = app || auth;
  try {
    if (envUrl) {
      const host = new URL(envUrl).hostname.toLowerCase();
      if (host === "leadformhub.com" || host === "www.leadformhub.com") return PRODUCTION_SITE_URL;
    }
  } catch {
    // invalid URL, fall through to env value or default
  }
  if (envUrl) return envUrl;
  return PRODUCTION_SITE_URL;
}

export const SITE_URL = getSiteUrl();

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  image?: string;
};

/**
 * Build full page metadata: title, description, canonical, OpenGraph, Twitter, robots.
 * Use for consistent on-page SEO across public and auth pages.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  image,
}: BuildPageMetadataOptions): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "LeadFormHub",
      type: "website",
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : "index, follow",
  };
}
