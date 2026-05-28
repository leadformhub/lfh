import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Support | LeadFormHub Help & Tickets",
  description:
    "LeadFormHub support for billing, forms, OTP verification, and integrations. Submit a ticket or use the knowledge base and FAQ first.",
  path: "/support",
});

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
