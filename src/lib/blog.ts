/**
 * Published blog posts — single source for listing and metadata.
 * Add new posts here and create the corresponding page under app/blog/[slug].
 */
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "what-is-a-lead-capture-form",
    title: "What Is a Lead Capture Form? Definition & Best Practices",
    description:
      "Learn what a lead capture form is, why it matters for businesses, and best practices for high-converting lead generation forms. Examples and common mistakes.",
    publishedAt: "2025-01-15",
  },
  {
    slug: "typeform-vs-leadformhub",
    title: "Typeform vs LeadFormHub: Compare Form Builders & Lead Capture",
    description:
      "Compare Typeform and LeadFormHub for lead capture: ease of use, form builder pricing, OTP verification, and best use cases. See who should choose which tool.",
    publishedAt: "2025-02-01",
  },
  {
    slug: "google-forms-vs-business-form-builders",
    title: "Google Forms vs Business Form Builders",
    description:
      "Compare Google Forms vs business form builders for lead capture, data quality, analytics, and scalability. When to use a dedicated online form builder for business.",
    publishedAt: "2025-02-10",
  },
];

export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function formatBlogDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}
