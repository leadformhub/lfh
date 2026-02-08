import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Form Builder Integrations & API | LeadFormHub",
  description:
    "Connect LeadFormHub with CRM, email tools, Zapier, and APIs to sync verified leads from your lead capture forms.",
  path: "/integrations",
});

const integrationCards = [
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    title: "CRM Integrations for Sales and Pipeline",
    bullets: [
      { title: "Supported CRMs and Sync Options", desc: "Sync verified leads to your CRM so sales has one place to work. We support popular CRMs; more options are on the roadmap. Business plan includes CRM integration access." },
      { title: "Lead Fields and Mapping", desc: "Map form fields to your CRM so names, emails, phones, and custom fields land in the right place. Reduce manual entry and keep data consistent." },
    ],
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Email and Marketing Automation",
    bullets: [
      { title: "Email Service Connections", desc: "Get instant lead notifications by email. Optionally connect to your email or marketing tools so new leads trigger the right follow-up." },
      { title: "Automate Follow-Up and Nurture", desc: "Use lead data to trigger sequences or campaigns in your existing tools. Integrations are designed to fit how you already nurture leads." },
    ],
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Zapier: Connect to Thousands of Apps",
    bullets: [
      { title: "Pre-Built Zaps for LeadFormHub", desc: "Zapier support is coming soon. When available, you'll be able to use pre-built Zaps to send leads to thousands of apps without code." },
      { title: "Custom Workflows Without Code", desc: "Build custom workflows between LeadFormHub and your stack. Ideal for teams that want flexibility without development." },
    ],
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "API Access for Custom Integrations",
    bullets: [
      { title: "API Overview and Authentication", desc: "Business plan includes API access. Integrate leads into internal tools, custom dashboards, or proprietary systems with a clear, documented API." },
      { title: "Use Cases for Developers", desc: "Developers can build one-way or two-way sync, custom reporting, or bespoke workflows. API access is for teams that need full control." },
    ],
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Secure and Reliable Data Flow",
    desc: "Integrations are built with security and reliability in mind. Data flows over secure channels so you can trust how leads move between systems.",
  },
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="integrations-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Integrations
              </p>
              <h1
                id="integrations-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Connect your CRM, email, and{" "}
                <span className="hero-highlight">tools you already use</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Lead capture integrations help you act on leads where you already work. Verified leads flow into your existing stack.
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

        {/* Integration cards */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="default" className="px-4 sm:px-6">
            <div className="mx-auto space-y-12 max-w-4xl">
              {integrationCards.map((card, idx) => (
                <article
                  key={card.title}
                  className={`animate-in rounded-2xl border border-[var(--border-default)] bg-[var(--neutral-50)]/50 p-8 transition-shadow hover:shadow-[var(--shadow-md)] ${idx % 2 === 0 ? "" : "sm:ml-8"}`}
                >
                  <div className="flex items-start gap-6">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                      {card.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
                        {card.title}
                      </h2>
                      {"bullets" in card ? (
                        <ul className="mt-6 space-y-6">
                          {(card.bullets as { title: string; desc: string }[]).map((b) => (
                            <li key={b.title}>
                              <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{b.title}</h3>
                              <p className="mt-1 text-[var(--foreground-muted)]">{b.desc}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-4 text-[var(--foreground-muted)]">{(card as { desc: string }).desc}</p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* Help + CTA strip */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Get help with your integration setup
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground-muted)]">
              Need help connecting LeadFormHub to your CRM or tools? Our support and documentation are there to get you set up.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">CRM</span>
              <span className="rounded-full border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">Email</span>
              <span className="rounded-full border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">API</span>
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
