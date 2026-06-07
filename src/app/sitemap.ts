import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { getBlogSitemapPriority } from "@/lib/blog-seo";

const BASE_URL = "https://leadformhub.com";

type StaticSitemapEntry = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
};

/** Marketing and product pages — blog posts are generated from BLOG_POSTS. */
const STATIC_PAGES: StaticSitemapEntry[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/typeform-alternative", priority: 0.9, changeFrequency: "monthly" },
  { path: "/jotform-alternative", priority: 0.9, changeFrequency: "monthly" },
  { path: "/hubspot-forms-alternative", priority: 0.9, changeFrequency: "monthly" },
  { path: "/lead-generation-form-builder", priority: 0.9, changeFrequency: "monthly" },
  { path: "/zoho-forms-alternative", priority: 0.8, changeFrequency: "monthly" },
  { path: "/free-online-form-builder-unlimited", priority: 0.8, changeFrequency: "monthly" },
  { path: "/features", priority: 0.8, changeFrequency: "monthly" },
  { path: "/integrations", priority: 0.7, changeFrequency: "monthly" },
  { path: "/knowledge-base", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/support", priority: 0.5, changeFrequency: "monthly" },
  { path: "/api-docs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" },
  { path: "/press", priority: 0.5, changeFrequency: "monthly" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
];
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: page.path === "/" ? BASE_URL : `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = getPublishedPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: getBlogSitemapPriority(post.slug),
  }));

  return [...staticEntries, ...blogEntries];
}
