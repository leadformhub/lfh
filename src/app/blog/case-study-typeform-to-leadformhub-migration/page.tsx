import type { Metadata } from "next";
import { CaseStudyPost } from "@/components/blog/CaseStudyPost";
import { buildPageMetadata } from "@/lib/seo";

const SLUG = "case-study-typeform-to-leadformhub-migration";

export const metadata: Metadata = buildPageMetadata({
  title: "Case Study: D2C Brand Migrated from Typeform in One Afternoon",
  description:
    "How a D2C growth team switched from Typeform to LeadFormHub in one afternoon—verified leads, one hub, and no per-form subscription surprises.",
  path: `/blog/${SLUG}`,
});

export default function CaseStudyTypeformMigrationPage() {
  return (
    <CaseStudyPost
      slug={SLUG}
      headline="D2C brand migrated from Typeform to LeadFormHub in one afternoon"
      description="A growth team replaced Typeform plus manual phone checks with a single LeadFormHub hub. Migration took one afternoon; verified leads hit one dashboard the same day."
      published="2026-06-07"
      updated="2026-06-07"
      company="DTC growth team (e‑commerce)"
      industry="D2C / e‑commerce"
      metrics={[
        { label: "Migration time", before: "N/A (status quo Typeform)", after: "~4 hours end-to-end" },
        { label: "Tools for lead capture", before: "Typeform + Google Sheet QA", after: "Single LeadFormHub hub" },
        { label: "Phone verification", before: "Manual spot checks", after: "OTP on checkout-support form" },
        { label: "Active campaign forms", before: "6 Typeform URLs", after: "6 hub forms (same fields)" },
      ]}
      sections={[
        {
          heading: "Why they left Typeform",
          paragraphs: [
            "The team liked Typeform's UX for surveys but not for high-intent lead capture. Phone numbers still needed manual validation before WhatsApp follow-ups.",
            "Per-seat and response pricing climbed as influencer campaigns drove spikes—they wanted predictable monthly cost and a branded URL for creator links.",
          ],
        },
        {
          heading: "Afternoon migration playbook",
          paragraphs: [
            "Morning: exported field lists from six live Typeform assets. Afternoon: recreated forms in LeadFormHub, enabled OTP on the two phone-heavy flows, and updated bio links plus landing page embeds.",
            "They ran both tools for 48 hours on low-traffic forms only; high-traffic forms flipped at end of day once notifications were confirmed.",
          ],
        },
        {
          heading: "What changed post-migration",
          paragraphs: [
            "Growth reported fewer 'wrong number' WhatsApp threads within the first week. Finance appreciated INR billing aligned with their Razorpay stack.",
            "They kept Typeform for internal NPS only—customer-facing capture consolidated on LeadFormHub.",
          ],
        },
      ]}
      faqs={[
        {
          question: "Can I keep Typeform for surveys after migrating leads?",
          answer:
            "Yes. Many teams use LeadFormHub for revenue forms and keep survey tools for research—this team did exactly that.",
        },
        {
          question: "Did embed codes break on Shopify pages?",
          answer:
            "Embed snippets swapped in the theme section; no developer ticket required beyond paste-and-test on staging.",
        },
      ]}
    />
  );
}
