import type { Metadata } from "next";
import { CaseStudyPost } from "@/components/blog/CaseStudyPost";
import { buildPageMetadata } from "@/lib/seo";

const SLUG = "case-study-agency-cost-per-qualified-lead";

export const metadata: Metadata = buildPageMetadata({
  title: "Case Study: Agency Cut Cost per Qualified Lead ~33% with Verified Forms",
  description:
    "How a performance marketing agency unified client lead forms, added OTP verification, and cut cost per qualified lead by about one-third in two months.",
  path: `/blog/${SLUG}`,
});

export default function CaseStudyAgencyCplPage() {
  return (
    <CaseStudyPost
      slug={SLUG}
      headline="Agency cut cost per qualified lead ~33% with one verified form hub"
      description="Finch Media replaced per-client spreadsheet workflows with branded LeadFormHub hubs and OTP on paid-social landing pages—qualified lead volume rose while CPL fell."
      published="2026-06-07"
      updated="2026-06-07"
      company="Finch Media (performance agency)"
      industry="Digital marketing agency"
      metrics={[
        { label: "Cost per qualified lead (avg client)", before: "Baseline CPL index 100", after: "~67 (≈33% lower)" },
        { label: "Client form tools in use", before: "4 different builders", after: "1 hub per client" },
        { label: "Lead notification delay", before: "Hours (manual checks)", after: "Minutes (instant alerts)" },
        { label: "OTP on paid social forms", before: "None", after: "Enabled on top 5 clients" },
      ]}
      sections={[
        {
          heading: "Challenge: pretty forms, messy qualification",
          paragraphs: [
            "Finch Media managed lead gen for D2C and B2B clients. Each client used a different form tool—some Google Forms, some legacy US builders—so the agency couldn't standardize QA or reporting.",
            "Media buyers optimized for cheap form fills, but account managers complained about lead quality on phone-heavy offers.",
          ],
        },
        {
          heading: "Approach: one hub per client, OTP where CPL mattered",
          paragraphs: [
            "They rolled out LeadFormHub hubs (leadformhub.com/clientname) with 3–5 fields max on landing pages tied to Meta and Google spend.",
            "OTP went live on financial services and high-ticket B2B clients first; lower-ticket clients stayed on email-only capture.",
          ],
        },
        {
          heading: "Outcome: better CPL and faster client reporting",
          paragraphs: [
            "Across the first eight weeks, blended cost per qualified lead—defined as OTP-verified or email-confirmed CRM entries—dropped about one-third versus the prior quarter baseline.",
            "Weekly client reports pulled from one dashboard instead of five spreadsheets, saving account managers ~3 hours per client per month.",
          ],
        },
      ]}
      faqs={[
        {
          question: "How did they define a qualified lead?",
          answer:
            "For phone CTAs: OTP-verified mobile. For email-only campaigns: valid email plus intent field completed—same definitions as before, with verification added.",
        },
        {
          question: "Did clients notice the form change?",
          answer:
            "Branded hub URLs tested better in client review than generic form links; completion rates held steady or improved on shortened fields.",
        },
      ]}
    />
  );
}
