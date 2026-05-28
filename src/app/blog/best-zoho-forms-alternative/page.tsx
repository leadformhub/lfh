import type { Metadata } from "next";
import { ComparisonBlogPost } from "@/components/blog/ComparisonBlogPost";
import { bestZohoFormsAlternative } from "@/lib/comparison-blog/best-zoho-forms-alternative";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: bestZohoFormsAlternative.metaTitle,
  description: bestZohoFormsAlternative.metaDescription,
  path: `/blog/${bestZohoFormsAlternative.slug}`,
});

export default function BestZohoFormsAlternativePage() {
  return <ComparisonBlogPost data={bestZohoFormsAlternative} />;
}
