import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us | LeadFormHub Form Builder",
  description:
    "Get in touch with LeadFormHub. Questions about lead capture forms, online form builder, OTP verification, or pricing? We're here to help.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-24">
          <Container size="narrow" className="px-4 sm:px-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-[var(--foreground-muted)]">
              Have a question about lead capture, OTP verification, or pricing? We&apos;re here to help.
            </p>
            <div className="mt-10 space-y-8">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">Support/Queries</h2>
                <p className="mt-1 text-[var(--foreground-muted)]">
                  Need help with your account or a technical issue?{" "}
                  <Link href="/support" className="font-medium text-[var(--color-accent)] hover:underline">
                    Raise a support request
                  </Link>
                  .
                </p>
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">FAQ</h2>
                <p className="mt-1 text-[var(--foreground-muted)]">
                  Check our{" "}
                  <Link href="/faq" className="font-medium text-[var(--color-accent)] hover:underline">
                    FAQ
                  </Link>
                  {" "}for quick answers on pricing, features, and integrations.
                </p>
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">Follow us</h2>
                <p className="mt-1 text-[var(--foreground-muted)]">
                  Connect with us on social media:{" "}
                  <a href="https://www.instagram.com/leadformhub/" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-accent)] hover:underline">Instagram</a>
                  {", "}
                  <a href="https://x.com/leadformhub" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-accent)] hover:underline">X (Twitter)</a>
                  {", "}
                  <a href="https://www.facebook.com/leadformhub" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-accent)] hover:underline">Facebook</a>.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
