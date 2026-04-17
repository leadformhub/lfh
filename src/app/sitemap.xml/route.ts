import { SITE_URL } from "@/lib/seo";

type SitemapEntry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly";
};

const SITEMAP_PAGES: SitemapEntry[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/features", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
  { path: "/knowledge-base", priority: 0.8, changeFrequency: "monthly" },
  { path: "/api-docs", priority: 0.8, changeFrequency: "monthly" },
  { path: "/integrations", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/what-is-a-lead-capture-form", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/typeform-vs-leadformhub", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/google-forms-vs-business-form-builders", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/free-form-builder-for-coaching-institutes", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/online-admission-form-creator-for-schools", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/simple-lead-form-for-real-estate-agents", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/contact-form-with-instant-email-notification", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/form-builder-for-small-digital-marketing-agencies", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/free-enquiry-form-builder-without-coding", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/lead-capture-form-for-facebook-ads-landing-page", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/form-builder-with-auto-email-response-for-clients", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/create-client-intake-form-online-free", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/online-registration-form-builder-for-workshops", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/how-to-generate-leads-manually", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/how-to-generate-leads-for-free", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/how-to-follow-up-on-leads-quickly", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/how-to-increase-form-submissions", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/case-study-of-using-lead-generation-forms", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/kaizen-vs-kanban", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/drag-and-drop-form-builder", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/online-forms-in-digital-marketing", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/free-online-form-builders", priority: 0.8, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/support", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.6, changeFrequency: "monthly" },
  { path: "/terms-and-conditions", priority: 0.6, changeFrequency: "monthly" },
  { path: "/disclaimer", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/typeform-alternative", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog/google-forms-alternative", priority: 0.8, changeFrequency: "monthly" },
  { path: "/zoho-forms-alternative", priority: 0.8, changeFrequency: "monthly" },
  { path: "/free-online-form-builder-unlimited", priority: 0.9, changeFrequency: "weekly" },
];

function toUrl(path: string): string {
  return path ? `${SITE_URL}${path}` : SITE_URL;
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
