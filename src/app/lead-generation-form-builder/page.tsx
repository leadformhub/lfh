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
import { buildWebPageBreadcrumbSchema } from "@/lib/company-page-seo";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { FREE_PLAN_MARKETING } from "@/lib/plans";

const PAGE_PATH = "/lead-generation-form-builder";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Lead Generation Form Builder — High-Converting Forms | LeadFormHub",
    description:
      "Lead generation form builder with OTP verification, branded hub & sales dashboard. Free plan: 3 forms, 50 leads/mo. Build landing page forms in minutes—no code.",
    path: PAGE_PATH,
  }),
  alternates: { canonical: "https://leadformhub.com/lead-generation-form-builder" },
};

const breadcrumbSchema = buildWebPageBreadcrumbSchema(PAGE_PATH, "Lead generation form builder");

const genericFormToolCells = {
  otp: "No native OTP",
  brandedHub: "forms.google.com or vendor URLs",
  leadDashboard: "Spreadsheets / manual export",
  pricingModel: "Free with submission caps",
  paymentOptions: "USD tiers on paid plans",
  setupSpeed: "Fast for simple forms",
};

const whyBullets = [
  {
    title: "Built for lead gen, not surveys",
    desc: "Purpose-built for contact, demo, and enquiry forms—not generic questionnaires. Every submission lands in a sales-ready dashboard.",
  },
  {
    title: "Optional OTP verification",
    desc: "Cut fake and mistyped phone numbers. Enable OTP per form so reps call real prospects, not dead leads.",
  },
  {
    title: "Branded hub at your URL",
    desc: "Share leadformhub.com/yourbrand links on ads, email, and landing pages. Professional presence without forms.google.com or vendor branding.",
  },
];

const steps = [
  {
    title: "Sign up and claim your hub",
    desc: "Create your account in minutes. No credit card required on the free plan.",
  },
  {
    title: "Build your lead generation form",
    desc: "Add name, email, phone, and intent fields. Enable OTP where phone quality matters.",
  },
  {
    title: "Publish and capture leads",
    desc: "Share a link or embed on your site. Get instant notifications and follow up while intent is hot.",
  },
];

const faqItems = [
  {
    question: "What is a lead generation form builder?",
    answer:
      "A lead generation form builder lets you create contact, demo, and enquiry forms without code, collect submissions in one place, and route leads to sales. LeadFormHub adds optional OTP phone verification and a branded hub for B2B campaigns.",
  },
  {
    question: "How is LeadFormHub different from Google Forms for lead gen?",
    answer:
      "Google Forms works for simple surveys but lacks branded URLs, OTP verification, and a sales-focused dashboard. LeadFormHub is built for B2B lead capture with instant notifications, CSV export, and optional CRM sync on Pro.",
  },
  {
    question: "Does LeadFormHub have a free plan?",
    answer: `Yes. The free plan includes ${FREE_PLAN_MARKETING.summary}, CSV export, dashboard access, and form embed. Upgrade to Pro for unlimited forms, unlimited leads, and OTP verification.`,
  },
  {
    question: "Can I embed lead generation forms on my website?",
    answer:
      "Yes. Every form gets a shareable link and embed code. Forms are mobile-responsive and work on landing pages, ads, and email campaigns.",
  },
  {
    question: "Do I need coding skills?",
    answer:
      "No. Use the visual editor to add fields, publish, and start collecting leads. If you can fill in a form, you can build one.",
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
  description: "Lead generation form builder with OTP verification, branded hub, and unified lead dashboard.",
  url: `${SITE_URL}${PAGE_PATH}`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

export default function LeadGenerationFormBuilderPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Navbar />
      <main>
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="lgfb-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Lead generation form builder
              </p>
              <h1
                id="lgfb-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Lead generation form builder for{" "}
                <span className="hero-highlight">B2B teams</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Create high-converting lead capture forms in minutes. Optional OTP verification, a branded hub, instant notifications, and one dashboard—without spreadsheet workflows or survey-style UX.
              </p>
              <p className="hero-content mt-4 text-base text-[var(--foreground-muted)]">
                Free plan: {FREE_PLAN_MARKETING.summary}.{" "}
                <Link href="/blog/set-up-lead-generation-form-without-coding" className="font-medium text-[var(--color-accent)] hover:underline">
                  Set up without coding
                </Link>
                {" · "}
                <Link href="/pricing" className="font-medium text-[var(--color-accent)] hover:underline">
                  See pricing
                </Link>
              </p>
              <Link
                href="/signup"
                className="hero-content mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
              >
                Start Free
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Why teams choose a dedicated lead generation form builder
            </h2>
            <ul className="mt-8 space-y-6">
              {whyBullets.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                    <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
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

        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              How to launch a lead generation form in 3 steps
            </h2>
            <ol className="mt-8 space-y-6">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{step.title}</h3>
                    <p className="mt-1 text-[var(--foreground-muted)]">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl text-center">
              LeadFormHub vs generic form tools
            </h2>
            <p className="mt-4 text-center text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Compare a lead-focused builder with typical free form tools used for lead generation.
            </p>
            <div className="mt-10">
              <ComparisonTable competitorLabel="Generic form tools" competitorCells={genericFormToolCells} />
            </div>
            <p className="mt-8 text-center text-sm text-[var(--foreground-muted)]">
              Comparing vendors? See{" "}
              <Link href="/blog/best-form-builder-tools-for-lead-generation-forms" className="font-medium text-[var(--color-accent)] hover:underline">
                best form builders for lead generation
              </Link>
              ,{" "}
              <Link href="/jotform-alternative" className="font-medium text-[var(--color-accent)] hover:underline">
                Jotform alternative
              </Link>
              , and{" "}
              <Link href="/hubspot-forms-alternative" className="font-medium text-[var(--color-accent)] hover:underline">
                HubSpot Forms alternative
              </Link>
              .
            </p>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] text-center">
              Frequently asked questions
            </h2>
            <ComparisonFAQ items={faqItems} className="mt-10" />
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Get started</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Build your first lead generation form today
            </h2>
            <p className="mt-2 text-[var(--foreground-muted)]">
              Free plan: {FREE_PLAN_MARKETING.summary}. No credit card required.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
            >
              Start Free
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </Container>
        </section>

        <CTA />
        <Footer />
      </main>
    </div>
  );
}
