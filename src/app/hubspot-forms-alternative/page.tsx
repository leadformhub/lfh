import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export { default } from "../blog/leadformhub-vs-hubspot-forms/page";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "HubSpot Forms Alternative for Lead Capture (2026)",
    description:
      "HubSpot Forms alternative without CRM bundle lock-in. OTP verification, branded hub, and lead dashboard—compare LeadFormHub vs HubSpot for SMB lead gen.",
    path: "/hubspot-forms-alternative",
  }),
  alternates: { canonical: "https://leadformhub.com/hubspot-forms-alternative" },
};
