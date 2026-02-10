import type { Metadata } from "next";
import Link from "next/link";
import {
  Navbar,
  ComparisonTable,
  ComparisonFAQ,
  CTA,
  Footer,
} from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";

/**
 * Zoho Forms Alternative — SEO: zoho forms alternative, form builder SaaS.
 */

export const metadata: Metadata = buildPageMetadata({
  title: "Zoho Forms Alternative – Form Builder SaaS for Lead Capture",
  description:
    "A simpler Zoho Forms alternative: standalone form builder SaaS focused on verified leads, form analytics, and speed.",
  path: "/zoho-forms-alternative",
});

const zohoCompetitorCells = {
  otp: "Limited / add-on",
  brandedHub: "Within Zoho ecosystem",
  leadDashboard: "Zoho CRM / Creator",
  pricingModel: "Subscription (suite)",
  indiaPayments: "Yes (subscription)",
  setupSpeed: "Heavier setup",
};

const useCases = [
  {
    title: "Standalone lead capture",
    description: "You don't need the full Zoho stack. Get a dedicated lead hub and dashboard without CRM or suite dependency.",
  },
  {
    title: "Monthly pricing",
    description: "Pay once in INR. No recurring subscription. Ideal for agencies and teams that prefer predictable, upfront cost.",
  },
  {
    title: "Fast deployment",
    description: "Create forms, enable OTP, and share your branded link in minutes. No complex configuration.",
  },
];

const faqItems = [
  {
    question: "Why choose LeadFormHub over Zoho Forms?",
    answer:
      "Zoho Forms is part of a larger ecosystem and suits teams already using Zoho CRM or Creator. LeadFormHub is focused only on verified lead capture: OTP verification, branded hub, and a single dashboard. If you want simplicity, monthly INR pricing, and no ecosystem lock-in, LeadFormHub is a strong fit.",
  },
  {
    question: "Do I need Zoho CRM to use LeadFormHub?",
    answer:
      "No. LeadFormHub is standalone. You can export leads to CSV or connect to any CRM later. No dependency on Zoho or any other vendor.",
  },
  {
    question: "How fast can I go live?",
    answer:
      "Sign up, create a form, and share your link. OTP verification can be enabled in one click. Most teams are live within minutes.",
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
  description: "Lightweight verified lead capture. Zoho Forms alternative with OTP verification, branded hub, monthly INR pricing. No ecosystem lock-in.",
  url: `${SITE_URL}/zoho-forms-alternative`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

const whyBullets = [
  { title: "Focus on lead capture, not full ecosystem", desc: "Zoho Forms is part of a larger suite. LeadFormHub does one thing: verified lead capture. If you don't need CRM or Creator, a focused tool can be faster and simpler." },
  { title: "Simpler setup and fewer dependencies", desc: "No Zoho account or suite setup. Sign up, create forms, enable OTP, and go live. Fewer steps and fewer products to learn." },
  { title: "Monthly pricing vs subscription stack", desc: "LeadFormHub offers monthly plans in INR. Zoho typically works on subscriptions and suite pricing. If you prefer pay-once and INR, LeadFormHub aligns with that." },
];

const standaloneBullets = [
  { title: "Branded lead capture hub", desc: "Your presence at leadformhub.com/yourbrand. Professional, consistent, and independent of any single vendor's ecosystem." },
  { title: "OTP verification out of the box", desc: "OTP verification is a core feature, not an add-on or integration. Enable it per form and get verified leads from day one." },
  { title: "Your data, your integrations", desc: "Export to CSV or connect to the CRM and tools you choose. No lock-in to one vendor. Your data stays portable." },
];

export default function ZohoFormsAlternativePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="zoho-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Zoho Forms Alternative
              </p>
              <h1
                id="zoho-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Simple, standalone lead capture{" "}
                <span className="hero-highlight">no suite required</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Zoho Forms fits teams already in the Zoho ecosystem. If you want a simple, standalone tool with OTP verification, a branded hub, and monthly INR pricing, LeadFormHub is built for that.
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

        {/* When to choose standalone */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              When to choose a standalone lead capture tool over Zoho Forms
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

        {/* Standalone benefits */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Standalone benefits: hub, verification, and control
            </h2>
            <ul className="mt-8 space-y-6">
              {standaloneBullets.map((b) => (
                <li key={b.title} className="flex gap-4">
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
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl text-center">
              LeadFormHub vs Zoho Forms: comparison for India
            </h2>
            <p className="mt-4 text-center text-[var(--foreground-muted)] max-w-2xl mx-auto">
              For teams that want simplicity, monthly INR pricing, and verified lead capture without the Zoho stack, LeadFormHub is a strong fit.
            </p>
            <div className="mt-10">
              <ComparisonTable competitorLabel="Zoho Forms" competitorCells={zohoCompetitorCells} />
            </div>
          </Container>
        </section>

        {/* Ideal for */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 text-center sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Ideal for agencies, startups, and sales teams
            </h2>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Agencies running multiple campaigns, startups moving fast, and sales teams that need one source of truth. Lightweight, focused, India-ready.
            </p>
          </Container>
        </section>

        {/* Use cases */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl text-center">
              Use cases where LeadFormHub fits
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

        {/* FAQ */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] text-center">
              Frequently Asked Questions
            </h2>
            <ComparisonFAQ items={faqItems} className="mt-10" />
          </Container>
        </section>

        {/* CTA strip */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Get started</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              No Zoho subscription or setup required.
            </h2>
            <p className="mt-2 text-[var(--foreground-muted)]">Create your account and your first form in minutes.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">Standalone</span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">Flexible pricing</span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">OTP included</span>
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

        <CTA />
        <Footer />
      </main>
    </div>
  );
}
