import { SITE_URL } from "@/lib/seo";

/** High-value posts for homepage/blog hub internal links and sitemap priority. */
export const INDEX_PRIORITY_SLUGS = [
  "best-form-builder-tools-for-lead-generation-forms",
  "google-forms-alternative",
  "typeform-alternative",
  "typeform-vs-leadformhub",
  "google-forms-vs-business-form-builders",
  "how-to-reduce-fake-leads-from-forms",
  "how-to-increase-form-submissions",
  "how-to-follow-up-on-leads-quickly",
  "how-to-generate-leads-for-free",
  "best-lead-form-fields-for-high-conversion",
  "set-up-lead-generation-form-without-coding",
  "unlimited-form-submissions-why-it-matters",
] as const;

export function getBlogSitemapPriority(slug: string): number {
  if ((INDEX_PRIORITY_SLUGS as readonly string[]).includes(slug)) return 0.8;
  if (slug.includes("alternative") || slug.includes("-vs-")) return 0.75;
  return 0.65;
}

export type BlogFaqItem = { question: string; answer: string };

export type RelatedPost = { slug: string; title: string };

const RELATED_BY_SLUG: Record<string, RelatedPost[]> = {
  "best-form-builder-tools-for-lead-generation-forms": [
    { slug: "set-up-lead-generation-form-without-coding", title: "Set up a lead gen form without coding" },
    { slug: "best-lead-form-fields-for-high-conversion", title: "Best lead form fields for conversion" },
    { slug: "how-to-reduce-fake-leads-from-forms", title: "Reduce fake leads from forms" },
    { slug: "unlimited-form-submissions-why-it-matters", title: "Why unlimited submissions matter" },
  ],
  "best-lead-form-fields-for-high-conversion": [
    { slug: "lead-form-landing-page-checklist-2026", title: "Lead form landing page checklist" },
    { slug: "how-to-increase-form-submissions", title: "How to increase form submissions" },
    { slug: "set-up-lead-generation-form-without-coding", title: "Set up a lead gen form quickly" },
    { slug: "how-to-reduce-fake-leads-from-forms", title: "Reduce fake leads from forms" },
  ],
  "how-to-reduce-fake-leads-from-forms": [
    { slug: "best-lead-form-fields-for-high-conversion", title: "Best lead form fields" },
    { slug: "best-form-builder-tools-for-lead-generation-forms", title: "Best form builders for lead gen" },
    { slug: "what-is-a-lead-capture-form", title: "What is a lead capture form?" },
    { slug: "lead-form-landing-page-checklist-2026", title: "Landing page checklist 2026" },
  ],
  "lead-form-landing-page-checklist-2026": [
    { slug: "best-lead-form-fields-for-high-conversion", title: "Best lead form fields" },
    { slug: "how-to-increase-form-submissions", title: "Increase form submissions" },
    { slug: "set-up-lead-generation-form-without-coding", title: "Set up a lead gen form" },
    { slug: "how-to-reduce-fake-leads-from-forms", title: "Reduce fake leads" },
  ],
  "set-up-lead-generation-form-without-coding": [
    { slug: "best-form-builder-tools-for-lead-generation-forms", title: "Best form builder tools" },
    { slug: "drag-and-drop-form-builder", title: "Drag and drop form builder" },
    { slug: "google-forms-vs-business-form-builders", title: "Google Forms vs business builders" },
    { slug: "how-to-follow-up-on-leads-quickly", title: "Follow up on leads quickly" },
  ],
  "google-forms-vs-business-form-builders": [
    { slug: "google-forms-alternative", title: "Google Forms alternative" },
    { slug: "best-form-builder-tools-for-lead-generation-forms", title: "Best form builders for lead gen" },
    { slug: "hubspot-forms-vs-typeform-vs-google-forms", title: "HubSpot vs Typeform vs Google" },
    { slug: "set-up-lead-generation-form-without-coding", title: "Set up a lead form (no code)" },
  ],
  "google-forms-alternative": [
    { slug: "google-forms-vs-business-form-builders", title: "Google Forms vs business form builders" },
    { slug: "hubspot-forms-vs-typeform-vs-google-forms", title: "HubSpot vs Typeform vs Google Forms" },
    { slug: "typeform-alternative", title: "Typeform alternative" },
    { slug: "leadformhub-vs-jotform", title: "LeadFormHub vs Jotform" },
  ],
  "leadformhub-vs-jotform": [
    { slug: "leadformhub-vs-hubspot-forms", title: "LeadFormHub vs HubSpot Forms" },
    { slug: "jotform-vs-hubspot-vs-wufoo-vs-formstack-for-lead-capture", title: "Jotform vs HubSpot vs Wufoo vs Formstack" },
    { slug: "best-form-builder-tools-for-lead-generation-forms", title: "Best form builders for lead gen" },
    { slug: "google-forms-alternative", title: "Google Forms alternative" },
  ],
  "leadformhub-vs-hubspot-forms": [
    { slug: "hubspot-forms-vs-typeform-vs-google-forms", title: "HubSpot vs Typeform vs Google Forms" },
    { slug: "leadformhub-vs-jotform", title: "LeadFormHub vs Jotform" },
    { slug: "best-zoho-forms-alternative", title: "Best Zoho Forms alternative" },
    { slug: "typeform-vs-leadformhub", title: "Typeform vs LeadFormHub" },
  ],
  "best-zoho-forms-alternative": [
    { slug: "leadformhub-vs-hubspot-forms", title: "LeadFormHub vs HubSpot Forms" },
    { slug: "leadformhub-vs-jotform", title: "LeadFormHub vs Jotform" },
    { slug: "google-forms-alternative", title: "Google Forms alternative" },
    { slug: "best-form-builder-tools-for-lead-generation-forms", title: "Best form builders for lead gen" },
  ],
  "leadformhub-vs-wufoo": [
    { slug: "jotform-vs-hubspot-vs-wufoo-vs-formstack-for-lead-capture", title: "Four-way lead capture comparison" },
    { slug: "leadformhub-vs-jotform", title: "LeadFormHub vs Jotform" },
    { slug: "free-online-form-builders", title: "Free online form builders" },
    { slug: "leadformhub-vs-hubspot-forms", title: "LeadFormHub vs HubSpot Forms" },
  ],
  "hubspot-forms-vs-typeform-vs-google-forms": [
    { slug: "leadformhub-vs-hubspot-forms", title: "LeadFormHub vs HubSpot Forms" },
    { slug: "typeform-vs-leadformhub", title: "Typeform vs LeadFormHub" },
    { slug: "google-forms-vs-business-form-builders", title: "Google Forms vs business builders" },
    { slug: "google-forms-alternative", title: "Google Forms alternative" },
  ],
  "jotform-vs-hubspot-vs-wufoo-vs-formstack-for-lead-capture": [
    { slug: "leadformhub-vs-jotform", title: "LeadFormHub vs Jotform" },
    { slug: "leadformhub-vs-hubspot-forms", title: "LeadFormHub vs HubSpot Forms" },
    { slug: "leadformhub-vs-wufoo", title: "LeadFormHub vs Wufoo" },
    { slug: "best-form-builder-tools-for-lead-generation-forms", title: "Best form builders ranked" },
  ],
  "form-builder-with-auto-email-response-for-clients": [
    { slug: "contact-form-with-instant-email-notification", title: "Instant email notification for contact forms" },
    { slug: "create-client-intake-form-online-free", title: "Create client intake form online free" },
    { slug: "how-to-follow-up-on-leads-quickly", title: "Follow up on leads quickly" },
    { slug: "set-up-lead-generation-form-without-coding", title: "Set up a lead gen form (no code)" },
  ],
  "unlimited-form-submissions-why-it-matters": [
    { slug: "best-form-builder-tools-for-lead-generation-forms", title: "Compare form builders" },
    { slug: "free-online-form-builders", title: "Free online form builders" },
    { slug: "how-to-generate-leads-for-free", title: "Generate leads for free" },
    { slug: "lead-capture-form-for-facebook-ads-landing-page", title: "Facebook ads lead capture form" },
  ],
};

const DEFAULT_RELATED: RelatedPost[] = [
  { slug: "what-is-a-lead-capture-form", title: "What is a lead capture form?" },
  { slug: "how-to-increase-form-submissions", title: "How to increase form submissions" },
  { slug: "how-to-follow-up-on-leads-quickly", title: "Follow up on leads quickly" },
];

export function getBlogPath(slug: string): string {
  return `/blog/${slug}`;
}

export function getBlogCanonicalUrl(slug: string): string {
  return `${SITE_URL}${getBlogPath(slug)}`;
}

export function getRelatedPosts(slug: string): RelatedPost[] {
  return RELATED_BY_SLUG[slug] ?? DEFAULT_RELATED;
}

const BLOG_POSTING_IMAGE_URL = `${SITE_URL}/og.png`;
const PUBLISHER_LOGO_URL = `${SITE_URL}/logo-b1.png`;

export function buildBlogPostingSchema(options: {
  slug: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}) {
  const url = getBlogCanonicalUrl(options.slug);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.headline,
    description: options.description,
    url,
    image: options.image ?? BLOG_POSTING_IMAGE_URL,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      name: options.authorName ?? "LeadFormHub Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "LeadFormHub",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: PUBLISHER_LOGO_URL,
      },
    },
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
  };
}

export function buildBreadcrumbSchema(slug: string, headline: string) {
  const postUrl = getBlogCanonicalUrl(slug);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: headline, item: postUrl },
    ],
  };
}

export function buildFaqPageSchema(faqs: BlogFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
