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
    slug: "typeform-alternative",
    title: "Typeform Alternative for Verified Lead Capture Forms",
    description:
      "Looking for a Typeform alternative? Use LeadFormHub as your lead capture form builder with OTP verification, form analytics, and a sales-ready dashboard.",
    publishedAt: "2025-02-01",
  },
  {
    slug: "google-forms-alternative",
    title: "Google Forms Alternative – Online Form Builder for Lead Generation",
    description:
      "Upgrade from Google Forms to a professional online form builder and lead capture platform with branding, OTP verification, and form analytics.",
    publishedAt: "2025-02-01",
  },
  {
    slug: "google-forms-vs-business-form-builders",
    title: "Google Forms vs Business Form Builders | Comparison",
    description:
      "Compare Google Forms vs business form builders for lead capture, data quality, analytics, and scalability. See when Google Forms is enough and when to use a dedicated online form builder for business.",
    publishedAt: "2025-02-10",
  },
  {
    slug: "free-form-builder-for-coaching-institutes",
    title: "Free Form Builder for Coaching Institutes: Collect Leads Without the Fuss",
    description:
      "Why coaching centres need a free form builder that’s simple and reliable. How to choose one, what to use it for (enquiries, trial signups, batch registration), and what to avoid.",
    publishedAt: "2025-02-11",
  },
  {
    slug: "online-admission-form-creator-for-schools",
    title: "Online Admission Form Creator for Schools: Set Up Forms Parents Actually Complete",
    description:
      "Why schools need an online admission form creator that works on mobile and doesn't overwhelm parents. What to include, how to keep completion high, and what to avoid.",
    publishedAt: "2025-02-11",
  },
  {
    slug: "simple-lead-form-for-real-estate-agents",
    title: "Simple Lead Form for Real Estate Agents: Capture Buyers and Sellers Without the Fuss",
    description:
      "Why real estate agents need a simple lead form that works on mobile and gets responses fast. What to ask, where to put it, and how to follow up without losing leads.",
    publishedAt: "2025-02-11",
  },
  {
    slug: "contact-form-with-instant-email-notification",
    title: "Contact Form With Instant Email Notification: Never Miss a Lead Again",
    description:
      "Why your contact form needs instant email notification, how it works, and what to look for in a form builder. Stop missing enquiries and speed up response times.",
    publishedAt: "2025-02-11",
  },
  {
    slug: "form-builder-for-small-digital-marketing-agencies",
    title: "Form Builder for Small Digital Marketing Agencies: One Tool for All Client Lead Forms",
    description:
      "Why small agencies need a form builder that handles multiple clients, landing pages, and lead capture. What to look for and how to keep forms simple without losing quality.",
    publishedAt: "2025-02-11",
  },
  {
    slug: "free-enquiry-form-builder-without-coding",
    title: "Free Enquiry Form Builder Without Coding: Collect Leads in Minutes",
    description:
      "Build enquiry forms for your business without writing code. What to look for in a free enquiry form builder, what you can do with it, and how to get started today.",
    publishedAt: "2025-02-11",
  },
  {
    slug: "lead-capture-form-for-facebook-ads-landing-page",
    title: "Lead Capture Form for Facebook Ads Landing Page: Convert Clicks Into Contacts",
    description:
      "Why your Facebook ad needs a dedicated lead capture form on the landing page. What to include, how to keep drop-off low, and how to follow up before leads go cold.",
    publishedAt: "2025-02-11",
  },
  {
    slug: "form-builder-with-auto-email-response-for-clients",
    title: "Form Builder With Auto Email Response for Clients: Set Expectations and Look Professional",
    description:
      "Why your form builder should send an auto email response to people who submit. What to say, when to use it, and how it helps you and your clients.",
    publishedAt: "2025-02-11",
  },
  {
    slug: "create-client-intake-form-online-free",
    title: "Create Client Intake Form Online Free: Onboard New Clients Without Paper or PDFs",
    description:
      "How to create a client intake form online for free. What to include, how to keep it simple, and which form builder to use so you can start collecting intake details today.",
    publishedAt: "2025-02-11",
  },
  {
    slug: "online-registration-form-builder-for-workshops",
    title: "Online Registration Form Builder for Workshops: Collect Signups Without the Chaos",
    description:
      "Why workshops need an online registration form builder. What to include, how to keep signups smooth, and how to avoid no-shows and last-minute scrambles.",
    publishedAt: "2025-02-11",
  },
];

export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function formatBlogDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}
