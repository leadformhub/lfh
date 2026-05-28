import type { Metadata } from "next";
import { ComparisonBlogPost } from "@/components/blog/ComparisonBlogPost";
import { leadformhubVsWufoo } from "@/lib/comparison-blog/leadformhub-vs-wufoo";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: leadformhubVsWufoo.metaTitle,
  description: leadformhubVsWufoo.metaDescription,
  path: `/blog/${leadformhubVsWufoo.slug}`,
});

export default function LeadformhubVsWufooPage() {
  return <ComparisonBlogPost data={leadformhubVsWufoo} />;
}
