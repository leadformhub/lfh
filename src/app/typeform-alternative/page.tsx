import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export { default } from "../blog/typeform-alternative/page";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Typeform Alternative for Verified Lead Capture Forms",
    description:
      "Looking for a Typeform alternative? Use LeadFormHub as your lead capture form builder with OTP verification, form analytics, and a sales-ready dashboard.",
    path: "/typeform-alternative",
  }),
  alternates: { canonical: "https://leadformhub.com/typeform-alternative" },
};
