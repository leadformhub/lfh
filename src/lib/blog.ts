/**
 * Published blog posts — single source for listing and metadata.
 * Add new posts here and create the corresponding page under app/blog/[slug].
 */
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  updatedAt: string; // ISO date — shown as "Last updated" for freshness signals
};

/** Site-wide freshness pass — update per post when content changes materially. */
export const BLOG_FRESHNESS_DATE = "2026-06-07";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "leadformhub-vs-jotform",
    title: "LeadFormHub vs Jotform: Which Form Builder Is Better in 2026?",
    description:
      "LeadFormHub vs Jotform for lead capture: pricing, OTP verification, CRM workflows, and branding. See which form builder fits B2B campaigns in 2026.",
    publishedAt: "2026-05-28",
    updatedAt: "2026-06-07",
  },
  {
    slug: "leadformhub-vs-hubspot-forms",
    title: "LeadFormHub vs HubSpot Forms: Lead Capture Compared (2026)",
    description:
      "LeadFormHub vs HubSpot Forms: pricing, CRM lock-in, OTP verification, and branding. See which tool fits SMB lead gen without a full HubSpot stack.",
    publishedAt: "2026-05-28",
    updatedAt: "2026-06-07",
  },
  {
    slug: "best-zoho-forms-alternative",
    title: "Best Zoho Forms Alternative for Lead Generation (2026)",
    description:
      "Best Zoho Forms alternative for lead gen: branding, OTP verification, and a lead dashboard without Zoho CRM bundle complexity. Compare top picks.",
    publishedAt: "2026-05-28",
    updatedAt: "2026-06-07",
  },
  {
    slug: "leadformhub-vs-wufoo",
    title: "LeadFormHub vs Wufoo: Form Builder Comparison for Leads (2026)",
    description:
      "LeadFormHub vs Wufoo compared for lead capture, pricing, branding, and CRM. See which form builder fits growing SMB campaigns in 2026.",
    publishedAt: "2026-05-28",
    updatedAt: "2026-06-07",
  },
  {
    slug: "hubspot-forms-vs-typeform-vs-google-forms",
    title: "HubSpot Forms vs Typeform vs Google Forms Compared (2026)",
    description:
      "HubSpot Forms vs Typeform vs Google Forms for lead capture: pricing, branding, CRM, and UX. Plus when LeadFormHub fits B2B campaigns.",
    publishedAt: "2026-05-28",
    updatedAt: "2026-06-07",
  },
  {
    slug: "jotform-vs-hubspot-vs-wufoo-vs-formstack-for-lead-capture",
    title: "Jotform vs HubSpot vs Wufoo vs Formstack for Lead Capture (2026)",
    description:
      "Compare Jotform, HubSpot Forms, Wufoo, and Formstack for lead capture—pricing, CRM, branding, OTP. See when LeadFormHub fits B2B teams.",
    publishedAt: "2026-05-28",
    updatedAt: "2026-06-07",
  },
  {
    slug: "how-to-reduce-fake-leads-from-forms",
    title: "How to Reduce Fake Leads from Forms (7 Proven Ways)",
    description:
      "Stop spam and bot submissions on lead forms: honeypots, OTP verification, rate limits, and tiered setups that protect quality without killing conversions.",
    publishedAt: "2026-04-30",
    updatedAt: "2026-06-07",
  },
  {
    slug: "best-form-builder-tools-for-lead-generation-forms",
    title: "10 Best Form Builder Tools for Lead Generation (2026)",
    description:
      "Compare 10 form builders for lead generation—Typeform, HubSpot, Jotform, Fillout & more. Free plan limits, OTP verification, pricing, and pros/cons ranked for campaigns.",
    publishedAt: "2026-04-15",
    updatedAt: "2026-06-07",
  },
  {
    slug: "best-lead-form-fields-for-high-conversion",
    title: "Best Lead Form Fields for High Conversion (What to Ask and What to Skip)",
    description:
      "Which fields belong on a lead form—and which to drop. Field-by-field advice, examples, and FAQs to lift conversions without junk leads.",
    publishedAt: "2026-03-19",
    updatedAt: "2026-06-07",
  },
  {
    slug: "lead-form-landing-page-checklist-2026",
    title: "Lead Form Landing Page Checklist for 2026",
    description:
      "2026 checklist for lead form landing pages: headline tests, CTA copy, mobile UX, trust signals, and field layout—fix drop-off without a full redesign.",
    publishedAt: "2026-03-19",
    updatedAt: "2026-06-07",
  },
  {
    slug: "set-up-lead-generation-form-without-coding",
    title: "How to Set Up a Lead Generation Form Quickly (Without Coding)",
    description:
      "Launch a no-code lead generation form in under 15 minutes: pick fields, publish, wire notifications, and avoid setup mistakes that kill conversions.",
    publishedAt: "2026-03-19",
    updatedAt: "2026-06-07",
  },
  {
    slug: "what-is-a-lead-capture-form",
    title: "What Is a Lead Capture Form? Definition & Best Practices",
    description:
      "Learn what a lead capture form is, why it matters for businesses, and best practices for high-converting lead generation forms. Examples and common mistakes.",
    publishedAt: "2025-01-15",
    updatedAt: "2026-06-07",
  },
  {
    slug: "typeform-vs-leadformhub",
    title: "Typeform vs LeadFormHub: Compare Form Builders & Lead Capture",
    description:
      "Compare Typeform and LeadFormHub for lead capture: ease of use, form builder pricing, OTP verification, and best use cases. See who should choose which tool.",
    publishedAt: "2025-02-01",
    updatedAt: "2026-06-07",
  },
  {
    slug: "typeform-alternative",
    title: "Typeform Alternative for Verified Lead Capture Forms",
    description:
      "Looking for a Typeform alternative? Use LeadFormHub as your lead capture form builder with OTP verification, form analytics, and a sales-ready dashboard.",
    publishedAt: "2025-02-01",
    updatedAt: "2026-06-07",
  },
  {
    slug: "google-forms-alternative",
    title: "Best Google Forms Alternative for Lead Generation",
    description:
      "The best Google Forms alternative for lead capture adds branding, OTP verification, and a lead dashboard—not just a spreadsheet. Compare options and when to switch.",
    publishedAt: "2025-02-01",
    updatedAt: "2026-06-07",
  },
  {
    slug: "google-forms-vs-business-form-builders",
    title: "Google Forms vs Business Builders | Lead Form Alternatives",
    description:
      "Alternatives to basic lead generation forms compared—Google Forms, Jotform, Typeform, HubSpot, Zoho, Wufoo & LeadFormHub. CRM, automation, branding & lead capture.",
    publishedAt: "2025-02-10",
    updatedAt: "2026-06-07",
  },
  {
    slug: "free-form-builder-for-coaching-institutes",
    title: "Free Form Builder for Coaching Institutes: Collect Leads Without the Fuss",
    description:
      "Why coaching centres need a free form builder that’s simple and reliable. How to choose one, what to use it for (enquiries, trial signups, batch registration), and what to avoid.",
    publishedAt: "2025-02-11",
    updatedAt: "2026-06-07",
  },
  {
    slug: "online-admission-form-creator-for-schools",
    title: "Online Admission Form Creator for Schools: Set Up Forms Parents Actually Complete",
    description:
      "Why schools need an online admission form creator that works on mobile and doesn't overwhelm parents. What to include, how to keep completion high, and what to avoid.",
    publishedAt: "2025-02-11",
    updatedAt: "2026-06-07",
  },
  {
    slug: "simple-lead-form-for-real-estate-agents",
    title: "Simple Lead Form for Real Estate Agents: Capture Buyers and Sellers Without the Fuss",
    description:
      "Why real estate agents need a simple lead form that works on mobile and gets responses fast. What to ask, where to put it, and how to follow up without losing leads.",
    publishedAt: "2025-02-11",
    updatedAt: "2026-06-07",
  },
  {
    slug: "contact-form-with-instant-email-notification",
    title: "Contact Form With Instant Email Notification: Never Miss a Lead Again",
    description:
      "Why your contact form needs instant email notification, how it works, and what to look for in a form builder. Stop missing enquiries and speed up response times.",
    publishedAt: "2025-02-11",
    updatedAt: "2026-06-07",
  },
  {
    slug: "form-builder-for-small-digital-marketing-agencies",
    title: "Form Builder for Small Digital Marketing Agencies: One Tool for All Client Lead Forms",
    description:
      "Why small agencies need a form builder that handles multiple clients, landing pages, and lead capture. What to look for and how to keep forms simple without losing quality.",
    publishedAt: "2025-02-11",
    updatedAt: "2026-06-07",
  },
  {
    slug: "free-enquiry-form-builder-without-coding",
    title: "Free Enquiry Form Builder Without Coding: Collect Leads in Minutes",
    description:
      "Build enquiry forms for your business without writing code. What to look for in a free enquiry form builder, what you can do with it, and how to get started today.",
    publishedAt: "2025-02-11",
    updatedAt: "2026-06-07",
  },
  {
    slug: "lead-capture-form-for-facebook-ads-landing-page",
    title: "Lead Capture Form for Facebook Ads Landing Page: Convert Clicks Into Contacts",
    description:
      "Why your Facebook ad needs a dedicated lead capture form on the landing page. What to include, how to keep drop-off low, and how to follow up before leads go cold.",
    publishedAt: "2025-02-11",
    updatedAt: "2026-06-07",
  },
  {
    slug: "form-builder-with-auto-email-response-for-clients",
    title: "Form Builder With Auto Email Response for Clients: Set Expectations and Look Professional",
    description:
      "Why your form builder should send an auto email response to people who submit. What to say, when to use it, and how it helps you and your clients.",
    publishedAt: "2025-02-11",
    updatedAt: "2026-06-07",
  },
  {
    slug: "create-client-intake-form-online-free",
    title: "Create Client Intake Form Online Free: Onboard New Clients Without Paper or PDFs",
    description:
      "How to create a client intake form online for free. What to include, how to keep it simple, and which form builder to use so you can start collecting intake details today.",
    publishedAt: "2025-02-11",
    updatedAt: "2026-06-07",
  },
  {
    slug: "online-registration-form-builder-for-workshops",
    title: "Online Registration Form Builder for Workshops: Collect Signups Without the Chaos",
    description:
      "Why workshops need an online registration form builder. What to include, how to keep signups smooth, and how to avoid no-shows and last-minute scrambles.",
    publishedAt: "2025-02-11",
    updatedAt: "2026-06-07",
  },
  {
    slug: "how-to-generate-leads-for-free",
    title: "How to Generate Leads for Free: Practical Tips for Small Business",
    description:
      "Learn how to generate leads for free using content, social proof, and simple tools. No big budget required—ideal for startups and small businesses.",
    publishedAt: "2025-02-18",
    updatedAt: "2026-06-07",
  },
  {
    slug: "how-to-generate-leads-manually",
    title: "How to Generate Leads Manually: Tactics That Still Work Today",
    description:
      "Manual lead generation tactics that work: networking, referrals, outreach, and events. Step-by-step guide for small teams and solopreneurs.",
    publishedAt: "2025-02-18",
    updatedAt: "2026-06-07",
  },
  {
    slug: "how-to-follow-up-on-leads-quickly",
    title: "How to Follow Up on Leads Quickly: Why Speed Matters",
    description:
      "Why fast follow-up on leads wins more deals. Practical tips to respond within minutes, use notifications, and never let a hot lead go cold. For small teams and solopreneurs.",
    publishedAt: "2025-02-20",
    updatedAt: "2026-06-07",
  },
  {
    slug: "how-to-increase-form-submissions",
    title: "How to Increase Form Submissions: 12 Proven Tactics",
    description:
      "Getting fewer form submissions than expected? 12 proven tactics to increase form conversion rate by cutting fields, improving CTA copy, adding trust signals, and fixing mobile UX.",
    publishedAt: "2025-02-20",
    updatedAt: "2026-06-07",
  },
  {
    slug: "case-study-of-using-lead-generation-forms",
    title: "Case Study: Using Lead Generation Forms to Grow a Small Business",
    description:
      "A real-world case study on how a small business used lead generation forms to capture enquiries, qualify leads, and grow sales without a big marketing budget.",
    publishedAt: "2025-02-21",
    updatedAt: "2026-06-07",
  },
  {
    slug: "drag-and-drop-form-builder",
    title: "Drag and Drop Form Builder: Create Lead Capture Forms Without Coding",
    description:
      "What to look for in a drag and drop form builder for lead capture. Build contact, enquiry, and registration forms in minutes—no coding required.",
    publishedAt: "2025-02-21",
    updatedAt: "2026-06-07",
  },
  {
    slug: "online-forms-in-digital-marketing",
    title: "Online Forms in Digital Marketing: Capture Leads at Every Touchpoint",
    description:
      "How online forms fit into digital marketing: landing pages, ads, content, and email. Best practices for lead capture forms that convert.",
    publishedAt: "2025-02-21",
    updatedAt: "2026-06-07",
  },
  {
    slug: "free-online-form-builders",
    title: "Free Online Form Builders: How to Choose One for Lead Capture",
    description:
      "Compare free online form builders for lead capture. What to look for: ease of use, submission limits, instant notifications, and mobile-friendly forms. No coding required.",
    publishedAt: "2025-02-21",
    updatedAt: "2026-06-07",
  },
  {
    slug: "unlimited-form-submissions-why-it-matters",
    title: "Why Unlimited Form Submissions Matter for Growing Businesses",
    description:
      "Form caps can stop campaigns mid-flight. Compare limited vs unlimited form builders, real use cases, and how to pick a plan that scales with your traffic.",
    publishedAt: "2025-02-21",
    updatedAt: "2026-06-07",
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getPublishedPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function formatBlogDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}
