import type { Metadata } from "next";
import { ComparisonBlogPost } from "@/components/blog/ComparisonBlogPost";
import { leadCaptureFormToolsComparison } from "@/lib/comparison-blog/lead-capture-form-tools-comparison-2026";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: leadCaptureFormToolsComparison.metaTitle,
  description: leadCaptureFormToolsComparison.metaDescription,
  path: `/blog/${leadCaptureFormToolsComparison.slug}`,
});

export default function LeadCaptureFormToolsComparisonPage() {
  return <ComparisonBlogPost data={leadCaptureFormToolsComparison} />;
}
