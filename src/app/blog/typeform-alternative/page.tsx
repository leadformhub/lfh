import type { Metadata } from "next";
import Link from "next/link";
import {
  Navbar,
  ComparisonTable,
  ComparisonFAQ,
  CTA,
  Footer,
} from "@/components/landing";
import { BlogInternalLinks } from "@/components/blog/BlogInternalLinks";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";

/**
 * Typeform Alternative — SEO: typeform alternative, lead capture form builder.
 */

export const metadata: Metadata = buildPageMetadata({
  title: "Typeform Alternative for Verified Lead Capture Forms",
  description:
    "Looking for a Typeform alternative? Use LeadFormHub as your lead capture form builder with OTP verification, form analytics, and a sales-ready dashboard.",
  path: "/blog/typeform-alternative",
});

const typeformCompetitorCells = {
  otp: "No",
  brandedHub: "Custom domain (paid add-on)",
  leadDashboard: "Basic; focus on form UX",
  pricingModel: "Subscription (USD)",
  paymentOptions: "No",
  setupSpeed: "Medium",
};

const useCases = [
  {
    title: "B2B lead capture with verification",
    description: "Capture leads from ads or landing pages and verify mobile numbers with OTP so your sales team only follows real prospects.",
  },
  {
    title: "Agency client campaigns",
    description: "Run multiple branded campaigns from one hub. Each client gets verified leads and a clean dashboard without managing separate form tools.",
  },
  {
    title: "Events and webinars",
    description: "Collect registrations with optional OTP. Export a clean list of verified contacts for follow-up.",
  },
];

const faqItems = [
  {
    question: "Why use LeadFormHub instead of Typeform for lead capture?",
    answer:
      "Typeform is a design-first form builder focused on survey and form experience. LeadFormHub is built for lead quality: OTP verification, a dedicated branded hub, and a sales-ready dashboard. If your goal is verified, actionable leads with transparent monthly pricing, LeadFormHub is the better fit.",
  },
  {
    question: "Does LeadFormHub support monthly payment?",
    answer:
      "Yes. LeadFormHub offers monthly plans. Multiple payment options; no recurring subscription unless you prefer it.",
  },
  {
    question: "Can I have a branded form URL like Typeform?",
    answer:
      "Yes. You get a dedicated hub at leadformhub.com/yourbrand. All your forms live under that URL for a professional, consistent presence.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LeadFormHub",
  applicationCategory: "BusinessApplication",
  description: "Verified lead capture platform with OTP verification. Typeform alternative for B2B teams. Branded hub, monthly pricing.",
  url: `${SITE_URL}/blog/typeform-alternative`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

const whyBullets = [
  { title: "Lead Verification and Quality Beyond Forms", desc: "Typeform focuses on form UX. LeadFormHub adds OTP verification and a lead-quality focus. You get real, reachable contacts, not just pretty forms." },
  { title: "Branded Hub and Domain Control", desc: "With LeadFormHub you get a dedicated hub at leadformhub.com/yourbrand. Typeform offers custom domains as a paid add-on. If owning the full lead-capture experience matters, LeadFormHub is built around that." },
  { title: "Monthly pricing", desc: "LeadFormHub offers monthly payment options. Transparent pricing with no hidden fees." },
];

export default function TypeformAlternativePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="typeform-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Typeform Alternative
              </p>
              <h1
                id="typeform-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Lead capture built for{" "}
                <span className="hero-highlight">verified B2B leads</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Typeform is strong on form design. If you need verified leads, a branded hub, and sales-ready contacts with transparent monthly pricing, LeadFormHub is built for that.
              </p>
              <Link
                href="/signup"
                className="hero-content mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
              >
                Start Free
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </Container>
        </section>

        {/* Why Typeform Alternative */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Why teams look for a Typeform alternative
            </h2>
            <ul className="mt-8 space-y-6">
              {whyBullets.map((b) => (
                <li key={b.title} className="animate-in flex gap-4">
                  <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                    <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{b.title}</h3>
                    <p className="mt-1 text-[var(--foreground-muted)]">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Comparison table */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl text-center">
              LeadFormHub vs Typeform: side-by-side
            </h2>
            <p className="mt-4 text-center text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Both offer form building. LeadFormHub adds optional OTP verification and a centralized lead dashboard. We emphasize lead quality and sales readiness.
            </p>
            <div className="mt-10">
              <ComparisonTable competitorLabel="Typeform" competitorCells={typeformCompetitorCells} />
            </div>
          </Container>
        </section>

        {/* Use cases */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl text-center">
              Best use cases for LeadFormHub as a Typeform alternative
            </h2>
            <ul className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
              {useCases.map((uc) => (
                <li
                  key={uc.title}
                  className="animate-in rounded-2xl border border-[var(--border-default)] bg-[var(--neutral-50)]/50 p-6 transition-shadow hover:shadow-[var(--shadow-md)]"
                >
                  <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{uc.title}</h3>
                  <p className="mt-2 text-base text-[var(--foreground-muted)]">{uc.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Migration */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Migration and switching: what you need to know
            </h2>
            <ul className="mt-8 space-y-6">
              <li className="flex gap-4">
                <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                  <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </span>
                <div>
                  <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">Moving existing forms and data</h3>
                  <p className="mt-1 text-[var(--foreground-muted)]">Recreate forms in LeadFormHub; we don&apos;t auto-import Typeform forms. Export your leads from Typeform and import or start fresh. Setup is quick.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                  <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </span>
                <div>
                  <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">Timeline and support</h3>
                  <p className="mt-1 text-[var(--foreground-muted)]">Most teams are live in under an hour. Support and docs help with setup and best practices. No long migration project required.</p>
                </div>
              </li>
            </ul>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] text-center">
              Frequently Asked Questions
            </h2>
            <ComparisonFAQ items={faqItems} className="mt-10" />
          </Container>
        </section>

        {/* CTA strip */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Get started</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Create your hub, build your first form, enable OTP where it matters.
            </h2>
            <p className="mt-2 text-[var(--foreground-muted)]">No credit card required.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">OTP verification</span>
              <span className="rounded-full border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">Branded hub</span>
              <span className="rounded-full border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">Flexible pricing</span>
            </div>
            <Link
              href="/signup"
              className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
            >
              Start Free
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </Container>
        </section>
        <BlogInternalLinks />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
