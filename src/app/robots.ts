import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Robots — allow indexing of marketing pages; noindex auth and dashboard.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login", "/signup", "/forgot-password", "/reset-password"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
