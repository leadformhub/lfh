import type { Metadata } from "next";
import { ComparisonBlogPost } from "@/components/blog/ComparisonBlogPost";
import { bestFormBuildingToolsLeadGenerationCampaigns } from "@/lib/comparison-blog/best-form-building-tools-lead-generation-campaigns-2026";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: bestFormBuildingToolsLeadGenerationCampaigns.metaTitle,
  description: bestFormBuildingToolsLeadGenerationCampaigns.metaDescription,
  path: `/blog/${bestFormBuildingToolsLeadGenerationCampaigns.slug}`,
});

export default function BestFormBuildingToolsLeadGenerationCampaignsPage() {
  return <ComparisonBlogPost data={bestFormBuildingToolsLeadGenerationCampaigns} />;
}
