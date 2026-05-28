import type { ComparisonPageData } from "./types";

/** Reusable “why LeadFormHub” bullets — pages can extend or override. */
export const coreWhyLeadFormHub = [
  {
    title: "Simpler, campaign-friendly pricing",
    description:
      "Monthly plans without forcing a full CRM suite. Teams running landing pages and ads can budget forms separately from enterprise sales software.",
  },
  {
    title: "Faster path from form live to first lead",
    description:
      "Branded hub URL, instant notifications, and a single dashboard mean less spreadsheet triage before sales calls back.",
  },
  {
    title: "Built for lead generation—not generic surveys",
    description:
      "Optional OTP on phone fields, lead-first layout defaults, and exports shaped for follow-up rather than research-only response views.",
  },
  {
    title: "Easy embedding on landing pages and sites",
    description:
      "Share a branded link or embed on WordPress, Webflow, or custom pages. Mobile-responsive by default for ad traffic.",
  },
  {
    title: "Small business friendly",
    description:
      "Free tier to validate campaigns, transparent upgrades, and support oriented to teams without dedicated RevOps staff.",
  },
  {
    title: "Affordable alternative to US-priced incumbents",
    description:
      "Competitive monthly pricing for Indian and global SMBs that still need professional branding and verification on client-facing forms.",
  },
];

export function mergePage(base: ComparisonPageData, overrides: Partial<ComparisonPageData>): ComparisonPageData {
  return { ...base, ...overrides };
}
