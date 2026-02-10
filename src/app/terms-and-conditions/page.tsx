import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms and Conditions | LeadFormHub",
  description:
    "LeadFormHub terms and conditions of use. Acceptable use, account terms, and legal terms for the lead capture platform and form builder.",
  path: "/terms-and-conditions",
});

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-24">
          <Container size="narrow" className="px-4 sm:px-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Terms and Conditions
            </h1>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <div className="prose prose-neutral mt-10 max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">1. Acceptance of Terms</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                By accessing or using LeadFormHub (&quot;Service&quot;), you agree to be bound by these Terms and Conditions. If you do not agree, do not use the Service.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">2. Description of Service</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                LeadFormHub provides a lead capture platform including branded forms, optional OTP verification, lead dashboard, and related features. We reserve the right to modify, suspend, or discontinue any part of the Service with reasonable notice where practicable.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">3. Account and Registration</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                You must provide accurate and complete registration information. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must notify us promptly of any unauthorized use.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">4. Acceptable Use</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                You agree not to use the Service for any unlawful purpose, to send spam or unsolicited messages, to collect data in a way that violates applicable law or third-party rights, or to attempt to gain unauthorized access to our systems or other accounts. We may suspend or terminate accounts that violate these terms.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">5. Payment Terms</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Paid plans are billed as described on our pricing page. Fees are in INR. You are responsible for any taxes applicable to your use. Refund policy is as stated at the time of purchase or on our website.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">6. Intellectual Property</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                LeadFormHub and its content, features, and functionality are owned by us and are protected by copyright, trademark, and other laws. You retain ownership of your lead data and content; you grant us a license to use it as necessary to provide the Service.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">7. Disclaimer of Warranties</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error-free, or secure.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">8. Limitation of Liability</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                To the maximum extent permitted by law, LeadFormHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the Service.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">9. Governing Law</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">10. Contact</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                For questions about these Terms, contact us via the{" "}
                <Link href="/contact" className="font-medium text-[var(--color-accent)] hover:underline">contact</Link>
                {" "}or{" "}
                <Link href="/support" className="font-medium text-[var(--color-accent)] hover:underline">support</Link>
                {" "}form on our website.
              </p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
