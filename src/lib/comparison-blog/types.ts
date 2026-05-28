import type { ComparisonCompetitorCells } from "@/components/landing/ComparisonTable";
import type { BlogFaqItem } from "@/lib/blog-seo";
import type { ProsConsEntry } from "@/components/blog/BlogProsConsGrid";
export type CtaVariant = "start-free" | "create-form" | "try-free";

export type SnippetBlock = { heading: string; answer: string };

export type FeatureSection = {
  title: string;
  snippetAnswer?: string;
  paragraphs: string[];
  table?: { title?: string; headers: string[]; rows: { feature: string; values: string[] }[] };
  cta?: CtaVariant;
};

export type ComparisonPageData = {
  slug: string;
  published: string;
  metaTitle: string;
  metaDescription: string;
  schemaHeadline: string;
  schemaDescription: string;
  eyebrow: string;
  h1: string;
  h1Highlight?: string;
  shortAnswer: string;
  intro: string[];
  snippetBlocks?: SnippetBlock[];
  quickCompare: { headers: string[]; rows: { feature: string; values: string[] }[] };
  competitorLabel?: string;
  competitorCells?: ComparisonCompetitorCells;
  comparisonTableHeading?: string;
  featureSections: FeatureSection[];
  whyLeadFormHub: { title: string; description: string }[];
  prosCons?: ProsConsEntry[];
  pricingCompare?: { headers: string[]; rows: { feature: string; values: string[] }[] };
  useCases: { title: string; description: string }[];
  verdict?: string[];
  /** Optional deep-dive block to reach long-form depth without repeating feature sections. */
  decisionGuide?: {
    title: string;
    paragraphs: string[];
    checklist: string[];
  };
  /** Real-world scenarios for long-form depth and snippet variety. */
  scenarios?: { title: string; body: string }[];
  faqs: BlogFaqItem[];
};
