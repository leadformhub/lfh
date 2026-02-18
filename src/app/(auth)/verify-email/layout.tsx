import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Verify your email – LeadFormHub",
    description: "Verify your email to sign in to your LeadFormHub account.",
    path: "/verify-email",
    noIndex: true,
  }),
  title: { absolute: "Verify your email – LeadFormHub" },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
