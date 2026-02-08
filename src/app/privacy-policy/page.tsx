import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | LeadFormHub",
  description:
    "LeadFormHub privacy policy. How we collect, use, and protect your data and lead information when you use our lead capture form builder.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-24">
          <Container size="narrow" className="px-4 sm:px-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <div className="prose prose-neutral mt-10 max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">1. Introduction</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                LeadFormHub (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our lead capture platform and related services.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">2. Information We Collect</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                We collect information you provide when you create an account (name, email, username, password), use our forms and dashboard, and submit or view leads. We also collect usage data such as form views and submissions to operate and improve our service.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">3. How We Use Your Information</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                We use your information to provide, maintain, and improve our services; to process payments; to send you service-related communications; and to comply with legal obligations. We do not sell your personal information or lead data to third parties.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">4. Data Storage and Security</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                We store data in secure, access-controlled environments. Data in transit and at rest is encrypted. We follow practices appropriate for business and personal data and design with Indian data and privacy expectations in mind.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">5. Your Rights</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                You may access, correct, or delete your account data. You can export your lead data from the dashboard. If you have questions or wish to exercise your rights, contact us at support@leadformhub.com.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">6. Cookies and Similar Technologies</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                We use cookies and similar technologies for authentication, session management, and to improve our service. You can control cookie preferences through your browser settings.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">7. Changes to This Policy</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                We may update this Privacy Policy from time to time. We will post the updated policy on this page and update the &quot;Last updated&quot; date. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">8. Contact</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                For privacy-related questions or requests, contact us at{" "}
                <a href="mailto:support@leadformhub.com" className="font-medium text-[var(--color-accent)] hover:underline">
                  support@leadformhub.com
                </a>
                .
              </p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
