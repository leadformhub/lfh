import type { Metadata } from "next";
import { ComparisonBlogPost } from "@/components/blog/ComparisonBlogPost";
import { leadCaptureSoftwarePricingCompared } from "@/lib/comparison-blog/lead-capture-software-pricing-compared";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: leadCaptureSoftwarePricingCompared.metaTitle,
  description: leadCaptureSoftwarePricingCompared.metaDescription,
  path: `/blog/${leadCaptureSoftwarePricingCompared.slug}`,
});

export default function LeadCaptureSoftwarePricingComparedPage() {
  return <ComparisonBlogPost data={leadCaptureSoftwarePricingCompared} />;
}
