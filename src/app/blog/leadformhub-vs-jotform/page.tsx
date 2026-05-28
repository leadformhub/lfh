import type { Metadata } from "next";
import { ComparisonBlogPost } from "@/components/blog/ComparisonBlogPost";
import { leadformhubVsJotform } from "@/lib/comparison-blog/leadformhub-vs-jotform";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: leadformhubVsJotform.metaTitle,
  description: leadformhubVsJotform.metaDescription,
  path: `/blog/${leadformhubVsJotform.slug}`,
});

export default function LeadformhubVsJotformPage() {
  return <ComparisonBlogPost data={leadformhubVsJotform} />;
}
