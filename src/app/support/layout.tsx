import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Support | LeadFormHub Lead Capture Software",
  description:
    "Submit a support request for LeadFormHub. Get help with your account, form builder, lead capture, billing, or technical issues.",
  path: "/support",
});

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
