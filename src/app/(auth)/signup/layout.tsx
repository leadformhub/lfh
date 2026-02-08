import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Sign Up – Secure Business Lead Capture Platform | LeadFormHub",
    description:
      "Create your LeadFormHub account. Build secure lead capture forms, manage leads, and track form analytics on our business lead capture platform.",
    path: "/signup",
    noIndex: true,
  }),
  title: { absolute: "Sign Up – Secure Business Lead Capture Platform | LeadFormHub" },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
