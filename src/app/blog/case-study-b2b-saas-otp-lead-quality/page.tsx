import type { Metadata } from "next";
import { CaseStudyPost } from "@/components/blog/CaseStudyPost";
import { buildPageMetadata } from "@/lib/seo";

const SLUG = "case-study-b2b-saas-otp-lead-quality";

export const metadata: Metadata = buildPageMetadata({
  title: "Case Study: B2B SaaS Cut Bad Phone Leads ~40% with OTP Verification",
  description:
    "How a B2B SaaS sales ops team used OTP verification on lead forms to cut wrong and fake phone numbers from ~40% to near zero—and get SDRs dialing again.",
  path: `/blog/${SLUG}`,
});

export default function CaseStudyB2bSaasOtpPage() {
  return (
    <CaseStudyPost
      slug={SLUG}
      headline="B2B SaaS cut bad phone leads ~40% with OTP on lead forms"
      description="A sales ops team at a mid-market SaaS vendor replaced unverified Typeform callbacks with LeadFormHub OTP forms. Wrong numbers dropped sharply and connect rates rose within two weeks."
      published="2026-06-07"
      updated="2026-06-07"
      company="TechFlow (B2B SaaS)"
      industry="B2B SaaS"
      metrics={[
        { label: "Invalid / fake phone rate", before: "~40% of mobile leads", after: "Near zero with OTP enabled" },
        { label: "SDR dial-to-connect sentiment", before: "Low (avoided phone queue)", after: "Reps actively working leads" },
        { label: "Time to first outbound", before: "Manual sheet review", after: "Instant notification + dashboard" },
        { label: "Forms migrated", before: "3 unverified forms", after: "3 OTP-enabled hub forms" },
      ]}
      sections={[
        {
          heading: "The problem: paid traffic, unusable phone numbers",
          paragraphs: [
            "TechFlow's growth team ran LinkedIn and Google campaigns to a demo-request form. Roughly two in five mobile submissions were wrong numbers, duplicates, or obvious fakes. SDRs stopped trusting the queue and response times slipped.",
            "Spreadsheet exports from their previous form stack had no verification step—reps burned an hour daily on dead dials.",
          ],
        },
        {
          heading: "The fix: OTP on high-intent forms only",
          paragraphs: [
            "They moved demo and callback forms to LeadFormHub, enabling OTP on phone fields while keeping a shorter newsletter form without OTP.",
            "Branded hub links replaced generic form URLs on ads. Instant email alerts routed leads to the on-call SDR rotation.",
          ],
        },
        {
          heading: "Results after 14 days",
          paragraphs: [
            "Invalid phone submissions fell to a handful per week—mostly edge cases where SMS delivery failed. Managers reported higher rep morale on outbound blocks because connects felt predictable again.",
            "The team kept Pro for OTP allowances and unlimited lead volume as Q3 campaigns scaled.",
          ],
        },
      ]}
      faqs={[
        {
          question: "Did OTP reduce total form submissions?",
          answer:
            "Submission volume dipped slightly on the demo form (~8%) but qualified connects rose—net pipeline improved because reps spent time on real prospects.",
        },
        {
          question: "How long did migration take?",
          answer: "Three forms were rebuilt and ad URLs swapped in one working day; parallel running lasted a week for attribution comparison.",
        },
      ]}
    />
  );
}
