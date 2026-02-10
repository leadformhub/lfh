import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Lead Capture Features",
  description:
    "Explore LeadFormHub features: drag and drop form builder, branded forms, OTP verification, form analytics, and a unified lead management dashboard.",
  path: "/features",
});

const featureIcons = {
  otp: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  brand: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  dashboard: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  analytics: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  security: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  integrations: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  form: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

const otpBullets = [
  { title: "How Mobile OTP Verification Works", desc: "They enter the code to confirm. No code, no lead. You get fewer junk submissions and higher confidence in every contact you follow up on." },
  { title: "Reduce Fake and Spam Leads", desc: "Fake emails and wrong numbers waste sales time. OTP verification cuts both. Your team spends time on real prospects instead of cleaning data." },
  { title: "Configurable Verification per Form", desc: "Enable or disable OTP per form. Use it on high-intent forms like demos or downloads; leave it off for simple signups. You control where verification matters." },
];

const brandBullets = [
  { title: "Your Brand, Your Domain", desc: "Your hub lives at leadformhub.com/yourbrand. All forms share that URL. No generic form provider branding. Visitors see your name and trust the experience." },
  { title: "Customizable Forms and Fields", desc: "Add the fields you need: name, email, phone, company, custom questions. Set required fields and simple validation. Forms are responsive and work on all devices." },
  { title: "Professional First Impression", desc: "Clean layout and your branding make forms feel part of your business. That improves completion rates and sets the right tone for B2B leads." },
];

const dashboardBullets = [
  { title: "All Leads in One Place", desc: "Every form's leads appear in one dashboard. No switching between tools or spreadsheets. See the full picture and act faster." },
  { title: "Team Access and Permissions", desc: "Invite team members and control who sees which forms and leads. Keep data access clear and secure for agencies and growing teams." },
  { title: "Export and Filter Options", desc: "Filter by form, date range, or verification status. Export to CSV for CRM import or reporting. Get data out when you need it." },
];

const analyticsBullets = [
  { title: "Conversion and Source Tracking", desc: "See how many people viewed and submitted each form. Track trends over time so you know what's working." },
  { title: "Lead Quality Metrics", desc: "Understand verified vs unverified leads and where they come from. Use this to tune campaigns and form design." },
  { title: "Reports for Decision-Making", desc: "Simple, clear reports support decisions without overwhelming you. Built for teams that need answers, not dashboards for their own sake." },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="features-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Features
              </p>
              <h1
                id="features-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Lead Capture Features Built for{" "}
                <span className="hero-highlight">Verified, High-Quality Leads</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Our lead capture features include OTP verification, branded forms, one dashboard, and analytics. Everything you need to stop chasing fake numbers and focus on real prospects.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="btn-base inline-flex h-12 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.35)] active:scale-[0.98]"
                >
                  Start Free
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/pricing"
                  className="btn-base inline-flex h-12 min-h-[44px] items-center justify-center rounded-xl border-2 border-[var(--border-strong)] bg-white px-6 text-base font-medium text-[var(--foreground-heading)] transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
                >
                  See pricing
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* OTP Verification */}
        <section id="secure-validation" className="scroll-mt-24 border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="default" className="px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div className="animate-in">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                  {featureIcons.otp}
                </div>
                <h2 className="mt-6 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
                  OTP Verification for Lead Quality
                </h2>
                <p className="mt-4 text-[var(--foreground-muted)]">
                  When a visitor submits a form with a phone number, you can require a one-time code sent to that number. Only then is the submission saved as a lead — so every lead has a reachable number.
                </p>
                <ul className="mt-8 space-y-6">
                  {otpBullets.map((b) => (
                    <li key={b.title} className="flex gap-4">
                      <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                        <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <div>
                        <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{b.title}</h3>
                        <p className="mt-1 text-sm text-[var(--foreground-muted)]">{b.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="animate-in flex justify-center lg:justify-end">
                <div className="w-full max-w-sm rounded-2xl border border-[var(--border-default)] bg-[var(--neutral-50)] p-6 shadow-[var(--shadow-md)]">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Example flow</p>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-[var(--border-default)] bg-white px-4 py-3 text-sm">Visitor enters phone</div>
                    <div className="flex justify-center">
                      <svg className="size-5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>
                    <div className="rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent-subtle)] px-4 py-3 text-sm font-medium text-[var(--color-accent)]">OTP sent → Code entered</div>
                    <div className="flex justify-center">
                      <svg className="size-5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-4 py-3 text-sm">
                      <svg className="size-5 shrink-0 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="font-medium text-[var(--foreground-heading)]">Lead saved · Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Branded Forms */}
        <section id="lead-capture" className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="default" className="px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div className="order-2 lg:order-1 animate-in">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                  {featureIcons.brand}
                </div>
                <h2 className="mt-6 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
                  Branded Forms and Lead Capture Hub
                </h2>
                <ul className="mt-8 space-y-6">
                  {brandBullets.map((b) => (
                    <li key={b.title} className="flex gap-4">
                      <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                        <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </span>
                      <div>
                        <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{b.title}</h3>
                        <p className="mt-1 text-sm text-[var(--foreground-muted)]">{b.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2 animate-in flex justify-center lg:justify-start">
                <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-lg)]">
                  <div className="h-1.5 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)]/80 to-[var(--color-accent)]/40" />
                  <div className="p-5">
                    <p className="text-xs font-medium text-[var(--foreground-muted)]">leadformhub.com/yourbrand</p>
                    <div className="mt-4 space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--neutral-50)] p-3">
                      <div className="h-2 w-3/4 rounded bg-[var(--border-default)]" />
                      <div className="h-2 w-1/2 rounded bg-[var(--border-default)]" />
                      <div className="mt-3 h-9 rounded-lg bg-[var(--color-accent)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Centralized Dashboard */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="default" className="px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div className="animate-in">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                  {featureIcons.dashboard}
                </div>
                <h2 className="mt-6 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
                  Centralized Lead Dashboard
                </h2>
                <ul className="mt-8 space-y-6">
                  {dashboardBullets.map((b) => (
                    <li key={b.title} className="flex gap-4">
                      <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                        <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </span>
                      <div>
                        <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{b.title}</h3>
                        <p className="mt-1 text-sm text-[var(--foreground-muted)]">{b.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="animate-in flex justify-center lg:justify-end">
                <div className="w-full max-w-sm rounded-2xl border border-[var(--border-default)] bg-[var(--neutral-50)] p-4 shadow-[var(--shadow-md)]">
                  <p className="mb-3 text-xs font-semibold text-[var(--foreground-muted)]">All leads · One view</p>
                  {["Form A — 12 leads", "Form B — 8 leads", "Form C — 24 leads"].map((row, i) => (
                    <div key={row} className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-[var(--shadow-xs)]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 font-heading text-sm font-semibold text-[var(--color-accent)]">{i + 1}</div>
                      <span className="text-sm font-medium text-[var(--foreground-heading)]">{row}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Analytics */}
        <section id="analytics" className="scroll-mt-24 border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="default" className="px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto flex size-14 w-fit items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                {featureIcons.analytics}
              </div>
              <h2 className="mt-6 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
                Analytics and Lead Insights
              </h2>
              <p className="mt-4 text-[var(--foreground-muted)]">
                Know what’s working. Track views, submissions, and lead quality in one place.
              </p>
            </div>
            <ul className="mx-auto mt-12 grid gap-6 sm:grid-cols-3 max-w-4xl">
              {analyticsBullets.map((b) => (
                <li
                  key={b.title}
                  className="animate-in rounded-xl border border-[var(--border-default)] bg-white p-6 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
                >
                  <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{b.title}</h3>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">{b.desc}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Security + Integrations — two cards side by side */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="default" className="px-4 sm:px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div
                id="form-automation"
                className="animate-in rounded-2xl border border-[var(--border-default)] bg-[var(--neutral-50)]/50 p-8 transition-shadow hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                  {featureIcons.security}
                </div>
                <h2 className="mt-6 font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
                  Security and Compliance
                </h2>
                <p className="mt-4 text-[var(--foreground-muted)]">
                  Lead data is stored securely. Access is controlled and encrypted. We follow practices that support enterprise and SMB use so you can trust the platform with real customer data.
                </p>
              </div>
              <div className="animate-in rounded-2xl border border-[var(--border-default)] bg-[var(--neutral-50)]/50 p-8 transition-shadow hover:shadow-[var(--shadow-md)]">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                  {featureIcons.integrations}
                </div>
                <h2 className="mt-6 font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
                  Integrations That Fit Your Stack
                </h2>
                <p className="mt-4 text-[var(--foreground-muted)]">
                  Export to CSV. Connect email notifications and CRM where available. Zapier and more integrations are on the roadmap. LeadFormHub fits into the tools you already use.
                </p>
                <Link
                  href="/integrations"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border-default)] bg-white px-5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-50)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  See integrations
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Feature pills + CTA strip */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Everything you need</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              One platform. Verified leads. Less chaos.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {["OTP Verification", "Branded Forms", "Unified Dashboard", "Analytics", "CSV Export", "Team Access"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]"
                >
                  {label}
                </span>
              ))}
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
