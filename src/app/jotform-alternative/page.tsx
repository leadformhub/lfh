import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export { default } from "../blog/leadformhub-vs-jotform/page";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Jotform Alternative for Verified Lead Capture (2026)",
    description:
      "Looking for a Jotform alternative? LeadFormHub offers OTP-verified lead capture, a branded hub, and a sales dashboard—compare pricing and features side by side.",
    path: "/jotform-alternative",
  }),
  alternates: { canonical: "https://leadformhub.com/jotform-alternative" },
};
