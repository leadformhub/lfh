import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raise Request | LeadFormHub",
  description: "Submit a support or feature request.",
};

export default function RaiseRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
