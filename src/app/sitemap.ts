import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Sitemap — includes only indexable marketing pages.
 * Excludes: /login, /signup, /forgot-password, /reset-password (noindex).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/features", priority: 0.9, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
    { path: "/knowledge-base", priority: 0.8, changeFrequency: "monthly" },
    { path: "/integrations", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
    { path: "/blog/what-is-a-lead-capture-form", priority: 0.8, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/support", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.6, changeFrequency: "monthly" },
    { path: "/terms-and-conditions", priority: 0.6, changeFrequency: "monthly" },
    { path: "/disclaimer", priority: 0.6, changeFrequency: "monthly" },
    { path: "/typeform-alternative", priority: 0.8, changeFrequency: "monthly" },
    { path: "/google-forms-alternative", priority: 0.8, changeFrequency: "monthly" },
    { path: "/zoho-forms-alternative", priority: 0.8, changeFrequency: "monthly" },
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: path ? `${SITE_URL}${path}` : SITE_URL,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
