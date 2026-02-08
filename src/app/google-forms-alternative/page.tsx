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
 * Google Forms Alternative — SEO: google forms alternative, online form builder for lead generation.
 */

export const metadata: Metadata = buildPageMetadata({
  title: "Google Forms Alternative – Online Form Builder for Lead Generation",
  description:
    "Upgrade from Google Forms to a professional online form builder and lead capture platform with branding, OTP verification, and form analytics.",
  path: "/google-forms-alternative",
});

const googleCompetitorCells = {
  otp: "No",
  brandedHub: "No (forms.google.com URLs)",
  leadDashboard: "Sheets; manual setup",
  pricingModel: "Free / Workspace",
  indiaPayments: "N/A",
  setupSpeed: "Fast (but limited for B2B)",
};

const useCases = [
  {
    title: "Professional lead capture",
    description: "Replace generic Google Forms links with a branded hub. Visitors see your brand, not google.com.",
  },
  {
    title: "Verified contacts only",
    description: "OTP verification ensures every lead has a real, reachable mobile number. No fake or typo submissions.",
  },
  {
    title: "Sales-ready export",
    description: "One dashboard for all forms. Filter, search, and export verified leads for your CRM or sales team.",
  },
];

const faqItems = [
  {
    question: "Why switch from Google Forms to LeadFormHub for lead generation?",
    answer:
      "Google Forms is a capable data collection tool for internal use. For B2B lead capture, teams often need a professional brand presence, mobile verification (OTP), and a dedicated lead dashboard. LeadFormHub is built for that: branded hub, OTP verification, and India-first pricing in INR.",
  },
  {
    question: "Is LeadFormHub free to start?",
    answer:
      "Yes. You can Start Free with one form and 50 leads per month. Upgrade when you need OTP verification, more leads, or integrations. No credit card required.",
  },
  {
    question: "Can I embed LeadFormHub forms on my site?",
    answer:
      "Yes. You can share a direct link (e.g. leadformhub.com/yourbrand/your-form) or embed the form on your website. Forms are responsive and work on all devices.",
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
  description: "Verified lead capture platform with OTP verification. Google Forms alternative for professional lead generation. Branded hub, India-first pricing.",
  url: `${SITE_URL}/google-forms-alternative`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

const whyBullets = [
  { title: "Professional branding and trust", desc: "Google Forms links and styling say \"Google,\" not your brand. For B2B lead generation, a dedicated tool with your branding builds trust and improves completion rates." },
  { title: "Lead verification and quality", desc: "Google Forms doesn't verify mobile numbers. LeadFormHub's optional OTP ensures every lead has a real, reachable number. Fewer fakes, better data for sales." },
  { title: "Centralized lead management", desc: "With Google Forms you often end up in Sheets and manual setup. LeadFormHub gives you one lead dashboard: filter, search, export, and optional CRM sync. Built for action, not just collection." },
];

const brandBullets = [
  { title: "Branded URLs and custom domains", desc: "Your hub is at leadformhub.com/yourbrand. Every form link carries your name. No forms.google.com in front of your prospects." },
  { title: "Styling and form experience", desc: "Clean, professional forms that match your business. Customize fields and layout so the experience feels like part of your brand." },
  { title: "First impression for B2B leads", desc: "B2B leads judge credibility quickly. A branded, focused form sets the right first impression and supports higher-quality submissions." },
];

export default function GoogleFormsAlternativePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="google-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Google Forms Alternative
              </p>
              <h1
                id="google-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Professional lead generation,{" "}
                <span className="hero-highlight">verified and branded</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Google Forms works for internal surveys. For professional lead generation — branded forms, verified contacts, and one dashboard — LeadFormHub is built for that.
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

        {/* Why dedicated tool */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Why use a dedicated tool for lead generation instead of Google Forms
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

        {/* Professional branding */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Your brand, not Google&apos;s
            </h2>
            <ul className="mt-8 space-y-6">
              {brandBullets.map((b) => (
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
              LeadFormHub vs Google Forms for lead generation
            </h2>
            <p className="mt-4 text-center text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Branding, verification, dashboard, pricing. When lead generation is the goal, LeadFormHub is built for it.
            </p>
            <div className="mt-10">
              <ComparisonTable competitorLabel="Google Forms" competitorCells={googleCompetitorCells} />
            </div>
          </Container>
        </section>

        {/* India / INR strip */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 text-center sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Built for Indian teams: INR pricing and support
            </h2>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Pay in INR with UPI, cards, or net banking. No USD or conversion. Support and product are oriented to Indian B2B teams.
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
              Frequently asked questions
            </h2>
            <ComparisonFAQ items={faqItems} className="mt-10" />
          </Container>
        </section>

        {/* CTA strip */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Switch today</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Ready for branded forms, verified leads, and one dashboard?
            </h2>
            <p className="mt-2 text-[var(--foreground-muted)]">Start with the free plan. No credit card required.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">Branded hub</span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">OTP verification</span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">Pay in INR</span>
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
