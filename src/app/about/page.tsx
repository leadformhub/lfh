import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildCompanyFaqSchema, buildWebPageBreadcrumbSchema, type CompanyFaqItem } from "@/lib/company-page-seo";
import { buildPageMetadata } from "@/lib/seo";

const ABOUT_FAQS: CompanyFaqItem[] = [
  {
    question: "Who founded LeadFormHub and why?",
    answer:
      "The product grew out of real ad spend wasted on invalid phone numbers. The team built affordable OTP-verified capture so small businesses could trust every lead they paid to acquire.",
  },
  {
    question: "Is LeadFormHub only for Indian businesses?",
    answer:
      "We optimize for Indian B2B workflows—OTP on mobile, INR pricing, and local support—but teams anywhere can use branded hubs and verified capture.",
  },
  {
    question: "How is LeadFormHub different from Google Forms?",
    answer:
      "Google Forms is general-purpose data collection. LeadFormHub focuses on branded B2B lead capture, optional OTP verification, and a sales-ready dashboard.",
  },
];

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "About LeadFormHub | Verified Lead Capture",
    description:
      "Meet LeadFormHub: mission, team, and product philosophy behind OTP-verified lead capture for agencies, startups, and sales teams in India.",
    path: "/about",
  }),
  alternates: { canonical: "https://leadformhub.com/about" },
};

const breadcrumbSchema = buildWebPageBreadcrumbSchema("/about", "About");
const faqSchema = buildCompanyFaqSchema(ABOUT_FAQS);

const missionBullets = [
  { title: "Why we built LeadFormHub", desc: "We saw teams struggling with generic forms, fake leads, and scattered data. We built LeadFormHub to give B2B teams one place to capture, verify, and act on leads — with branding and pricing that fit how teams work." },
  { title: "Who we serve", desc: "Agencies, B2B startups, sales teams, marketers, and SMBs. Anyone who needs verified, sales-ready leads and prefers a focused tool over a large suite." },
];

const philosophyBullets = [
  { title: "Verification and real leads first", desc: "We prioritize lead quality. OTP verification and a dashboard built for action mean you spend time on real prospects. Fewer leads, better outcomes." },
  { title: "Simplicity and transparency", desc: "Simple setup, clear pricing, no hidden complexity. You should understand what you get and what you pay. We avoid lock-in and surprise bills." },
  { title: "No lock-in, no surprise bills", desc: "Monthly pricing. Export your data anytime. We don't trap you in subscriptions or make it hard to leave. Trust is earned by being straightforward." },
];

const pricingBullets = [
  { title: "Transparent monthly pricing", desc: "Clear plans and pricing. Monthly billing so you can budget with confidence. No hidden fees or surprise charges." },
  { title: "Flexible payment options", desc: "Multiple payment methods supported. Upgrade when you need more; your hub and data stay the same." },
  { title: "Support and roadmap", desc: "Support and product direction reflect what teams need: verification, branding, integrations, and simplicity. We listen and build accordingly." },
];

const icons = {
  mission: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  philosophy: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  india: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  team: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  founder: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="about-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                About
              </p>
              <h1
                id="about-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Verified lead capture{" "}
                <span className="hero-highlight">built for modern teams</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                LeadFormHub exists because invalid phone numbers were burning ad budgets. Today we help agencies, startups, and sales teams capture verified leads through one branded hub—explore <Link href="/features" className="font-medium text-[var(--color-accent)] hover:underline">product features</Link>, <Link href="/integrations" className="font-medium text-[var(--color-accent)] hover:underline">integrations</Link>, or <Link href="/support" className="font-medium text-[var(--color-accent)] hover:underline">reach support</Link> anytime.
              </p>
              <Link
                href="/signup"
                className="hero-content mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
              >
                Get Started Free
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </Container>
        </section>

        {/* Founder Story */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="animate-in flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                {icons.founder}
              </span>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
                Why we started LeadFormHub
              </h2>
            </div>
            <div className="mt-8 space-y-4 text-[var(--foreground-muted)]">
              <p>
                The founder was running ads with lead forms and spending heavily on campaigns. After each campaign ended, when calling leads to follow up, too many contact numbers turned out to be invalid—wrong digits, fake entries, or numbers that never answered. That waste of time and ad spend was the trigger.
              </p>
              <p>
                We built LeadFormHub so small business owners could afford verified lead capture: optional OTP verification to cut down invalid contacts, transparent pricing that fits real budgets, and one place to capture and act on leads. We want every business to get real, callable leads without burning money on bad data.
              </p>
            </div>
          </Container>
        </section>

        {/* Mission */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="animate-in flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                {icons.mission}
              </span>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
                Our mission: better lead capture for B2B teams
              </h2>
            </div>
            <ul className="mt-8 space-y-6">
              {missionBullets.map((b) => (
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

        {/* Philosophy */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="animate-in flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                {icons.philosophy}
              </span>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
                Product philosophy: quality over quantity
              </h2>
            </div>
            <ul className="mt-8 space-y-6">
              {philosophyBullets.map((b) => (
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

        {/* Pricing and flexibility */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="animate-in flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                {icons.india}
              </span>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
                Transparent pricing and flexibility
              </h2>
            </div>
            <ul className="mt-8 space-y-6">
              {pricingBullets.map((b) => (
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

        {/* Team */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="animate-in flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                {icons.team}
              </span>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
                The Team Behind LeadFormHub
              </h2>
            </div>
            <p className="mt-6 text-[var(--foreground-muted)]">
              We&apos;re a small team focused on one product: verified lead capture for B2B. We care about quality, clarity, and long-term trust over growth at any cost.
            </p>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
              Who uses LeadFormHub today
            </h2>
            <ul className="mt-6 space-y-4 text-[var(--foreground-muted)]">
              <li>
                <strong className="text-[var(--foreground-heading)]">Digital marketing agencies</strong> — white-label style hubs per client with OTP on high-intent forms.
              </li>
              <li>
                <strong className="text-[var(--foreground-heading)]">Coaching & education brands</strong> — admission and trial-class forms that must work on mobile.
              </li>
              <li>
                <strong className="text-[var(--foreground-heading)]">B2B SaaS & services</strong> — demo request flows synced toward CRM via{" "}
                <Link href="/integrations" className="font-medium text-[var(--color-accent)] hover:underline">integrations</Link>.
              </li>
            </ul>
            <figure className="mt-8 overflow-hidden rounded-xl border border-[var(--border-subtle)]">
              <Image src="/og.png" alt="LeadFormHub product overview" width={1200} height={630} className="h-auto w-full" />
            </figure>
            <h2 id="about-faq" className="mt-12 font-heading text-xl font-semibold text-[var(--foreground-heading)]">
              About LeadFormHub — FAQ
            </h2>
            <dl className="mt-6 space-y-6">
              {ABOUT_FAQS.map((item) => (
                <div key={item.question}>
                  <dt className="font-heading font-semibold text-[var(--foreground)]">{item.question}</dt>
                  <dd className="mt-2 text-[var(--foreground-muted)]">{item.answer}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-[var(--foreground-muted)]">
              New user? Start with the <Link href="/knowledge-base" className="font-medium text-[var(--color-accent)] hover:underline">knowledge base</Link>.
            </p>
          </Container>
        </section>

        {/* CTA strip */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Join us</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Whether you&apos;re evaluating or ready to switch, we&apos;re here.
            </h2>
            <p className="mt-2 text-[var(--foreground-muted)] max-w-xl mx-auto">
              Start Free, try the product, and reach out if you have questions.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">Verified leads</span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">Simple pricing</span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">No lock-in</span>
            </div>
            <Link
              href="/signup"
              className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
            >
              Get Started Free
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
