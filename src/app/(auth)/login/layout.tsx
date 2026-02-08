import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Secure Login – LeadFormHub Form Builder",
    description:
      "Access your LeadFormHub account to manage secure lead capture forms and analytics.",
    path: "/login",
    noIndex: true,
  }),
  title: { absolute: "Secure Login – LeadFormHub Form Builder" },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
