import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer | LeadFormHub",
  description:
    "LeadFormHub disclaimer. General information, no professional advice, and limitations regarding the lead capture form builder and platform use.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-24">
          <Container size="narrow" className="px-4 sm:px-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Disclaimer
            </h1>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <div className="prose prose-neutral mt-10 max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">1. General Information</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                The information provided on the LeadFormHub website and within our lead capture platform is for general informational purposes only. While we strive to keep the content accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website, platform, or related materials.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">2. No Professional Advice</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Nothing on LeadFormHub constitutes legal, tax, compliance, or other professional advice. You should seek appropriate professional advice for your specific situation. Use of our form builder, OTP verification, analytics, and lead management features does not replace your responsibility to comply with applicable laws (including data protection and marketing regulations) in your jurisdiction.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">3. Service &quot;As Is&quot;</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                LeadFormHub is provided &quot;as is&quot; and &quot;as available.&quot; We do not guarantee uninterrupted, error-free, or secure operation. We are not liable for any loss or damage arising from your use of the service, including but not limited to lead data, form submissions, integrations, or third-party services.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">4. Your Use of Forms and Leads</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                You are responsible for how you design, publish, and use forms and for the collection, storage, and use of lead data. You must ensure your forms and practices comply with applicable law and that you have necessary consents and permissions. LeadFormHub is a tool; we do not control or endorse the content of your forms or the manner in which you use lead information.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">5. Trust Badges and Standards</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                References to standards such as GDPR, SOC 2, or ISO 27001 on our website indicate that we follow practices aligned with such frameworks where applicable. Such references are not certifications or attestations unless explicitly stated. We design with Indian data and privacy expectations in mind, but you remain responsible for your own compliance obligations.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">6. Third-Party Links and Integrations</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Our website and platform may contain links to third-party sites or integrate with external services. We do not control and are not responsible for the content, privacy practices, or availability of those third parties. Your use of them is at your own risk.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">7. Changes</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                We may update this Disclaimer from time to time. The &quot;Last updated&quot; date above will be revised accordingly. Continued use of LeadFormHub after changes constitutes acceptance of the updated disclaimer.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">8. Contact</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                For questions about this Disclaimer, contact us via the{" "}
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
