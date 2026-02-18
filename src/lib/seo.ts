import type { Metadata } from "next";

/**
 * SEO configuration — canonical URLs, Open Graph, and metadata.
 * Uses APP_URL or NEXTAUTH_URL from env so blog and all pages use the app domain (e.g. leadformhub.online or localhost).
 */
function getSiteUrl(): string {
  const app = process.env.APP_URL?.trim()?.replace(/\/$/, "");
  if (app) return app;
  const auth = process.env.NEXTAUTH_URL?.trim()?.replace(/\/$/, "");
  if (auth) return auth;
  return "https://www.leadformhub.com";
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
