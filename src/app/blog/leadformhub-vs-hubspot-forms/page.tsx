import type { Metadata } from "next";
import { ComparisonBlogPost } from "@/components/blog/ComparisonBlogPost";
import { leadformhubVsHubspotForms } from "@/lib/comparison-blog/leadformhub-vs-hubspot-forms";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: leadformhubVsHubspotForms.metaTitle,
  description: leadformhubVsHubspotForms.metaDescription,
  path: `/blog/${leadformhubVsHubspotForms.slug}`,
});

export default function LeadformhubVsHubspotFormsPage() {
  return <ComparisonBlogPost data={leadformhubVsHubspotForms} />;
}
