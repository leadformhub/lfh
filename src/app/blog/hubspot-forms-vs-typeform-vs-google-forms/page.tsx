import type { Metadata } from "next";
import { ComparisonBlogPost } from "@/components/blog/ComparisonBlogPost";
import { hubspotTypeformGoogle } from "@/lib/comparison-blog/hubspot-forms-vs-typeform-vs-google-forms";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: hubspotTypeformGoogle.metaTitle,
  description: hubspotTypeformGoogle.metaDescription,
  path: `/blog/${hubspotTypeformGoogle.slug}`,
});

export default function HubspotFormsVsTypeformVsGoogleFormsPage() {
  return <ComparisonBlogPost data={hubspotTypeformGoogle} />;
}
