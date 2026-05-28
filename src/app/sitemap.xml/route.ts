import { BLOG_POSTS } from "@/lib/blog";
import { INDEX_PRIORITY_SLUGS } from "@/lib/blog-seo";
import { canonicalUrlFromPath } from "@/lib/seo";

type SitemapEntry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly";
};

const STATIC_PAGES: SitemapEntry[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/features", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
  { path: "/knowledge-base", priority: 0.8, changeFrequency: "monthly" },
  { path: "/api-docs", priority: 0.8, changeFrequency: "monthly" },
  { path: "/integrations", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/support", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.6, changeFrequency: "monthly" },
  { path: "/terms-and-conditions", priority: 0.6, changeFrequency: "monthly" },
  { path: "/disclaimer", priority: 0.6, changeFrequency: "monthly" },
  { path: "/zoho-forms-alternative", priority: 0.8, changeFrequency: "monthly" },
  { path: "/free-online-form-builder-unlimited", priority: 0.9, changeFrequency: "weekly" },
];

const prioritySet = new Set<string>(INDEX_PRIORITY_SLUGS);

const blogPages: SitemapEntry[] = BLOG_POSTS.map((post) => ({
  path: `/blog/${post.slug}`,
  priority: prioritySet.has(post.slug) ? 0.85 : 0.8,
  changeFrequency: "weekly" as const,
}));

const SITEMAP_PAGES: SitemapEntry[] = [...STATIC_PAGES, ...blogPages];

function toUrl(path: string): string {
  return canonicalUrlFromPath(path || "/");
}

function buildSitemapXml(): string {
  const urls = SITEMAP_PAGES.map(({ path, priority, changeFrequency }) => {
    const lastModified = new Date().toISOString();

    return [
      "  <url>",
      `    <loc>${toUrl(path)}</loc>`,
      `    <lastmod>${lastModified}</lastmod>`,
      `    <changefreq>${changeFrequency}</changefreq>`,
      `    <priority>${priority.toFixed(1)}</priority>`,
      "  </url>",
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
  ].join("\n");
}

export function GET() {
  return new Response(buildSitemapXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
