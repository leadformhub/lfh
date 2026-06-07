/** SaaS directories and review sites — use on /press and Organization sameAs. */
export type DirectoryListing = {
  name: string;
  submitUrl: string;
  profileUrl?: string;
  status: "verified" | "pending" | "todo";
  notes?: string;
};

export const DIRECTORY_LISTINGS: DirectoryListing[] = [
  {
    name: "SaaSHub",
    submitUrl: "https://www.saashub.com/submit",
    profileUrl: "https://www.saashub.com/leadformhub",
    status: "verified",
    notes: "Site verified via meta tag (saashub-verification in layout).",
  },
  {
    name: "Product Hunt",
    submitUrl: "https://www.producthunt.com/posts/new",
    status: "todo",
    notes: "Launch or re-launch with tagline: OTP-verified lead capture for B2B teams.",
  },
  {
    name: "G2",
    submitUrl: "https://www.g2.com/products/new",
    status: "todo",
    notes: "Category: Form Builder, Lead Capture, Online Form Builder.",
  },
  {
    name: "Capterra",
    submitUrl: "https://www.capterra.com/vendors/sign-up",
    status: "todo",
    notes: "Same categories as G2; use INR pricing on profile.",
  },
  {
    name: "AlternativeTo",
    submitUrl: "https://alternativeto.net/manage/add/",
    status: "todo",
    notes: "List as alternative to Typeform, Google Forms, Jotform.",
  },
  {
    name: "Slashdot",
    submitUrl: "https://slashdot.org/submission",
    status: "todo",
  },
  {
    name: "BetaList",
    submitUrl: "https://betalist.com/submit",
    status: "todo",
  },
  {
    name: "Indie Hackers",
    submitUrl: "https://www.indiehackers.com/products",
    status: "todo",
    notes: "Share build story + OTP verification angle.",
  },
  {
    name: "Crunchbase",
    submitUrl: "https://www.crunchbase.com/add-company",
    status: "todo",
  },
  {
    name: "LinkedIn Company Page",
    submitUrl: "https://www.linkedin.com/company/leadformhub",
    profileUrl: "https://www.linkedin.com/company/leadformhub",
    status: "verified",
  },
];

/** sameAs URLs for schema.org Organization */
export const ORGANIZATION_SAME_AS = [
  "https://www.linkedin.com/company/leadformhub",
  "https://www.instagram.com/leadformhub/",
  "https://x.com/leadformhub",
  "https://www.facebook.com/leadformhub",
  "https://www.saashub.com/leadformhub",
] as const;

export const PRESS_BOILERPLATE =
  "LeadFormHub is a lead capture form builder for B2B teams. Create branded forms, optional OTP phone verification, instant notifications, and manage every lead from one dashboard. Free plan: 3 forms, 50 leads/month. Pro from ₹299/month.";

export const PRESS_SHORT_TAGLINE = "Verified lead capture forms for B2B teams — OTP optional, one dashboard.";
