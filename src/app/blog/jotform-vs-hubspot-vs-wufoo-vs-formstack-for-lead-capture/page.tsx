import type { Metadata } from "next";
import { ComparisonBlogPost } from "@/components/blog/ComparisonBlogPost";
import { jotformHubspotWufooFormstack } from "@/lib/comparison-blog/jotform-vs-hubspot-vs-wufoo-vs-formstack";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: jotformHubspotWufooFormstack.metaTitle,
  description: jotformHubspotWufooFormstack.metaDescription,
  path: `/blog/${jotformHubspotWufooFormstack.slug}`,
});

export default function JotformVsHubspotVsWufooVsFormstackPage() {
  return <ComparisonBlogPost data={jotformHubspotWufooFormstack} />;
}
