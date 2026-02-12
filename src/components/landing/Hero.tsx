"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * 2. Hero Section (Above the Fold)
 * Eye-catching, engaging, conversion-focused. Animated gradient, clickable elements.
 */
export function Hero() {
  return (
    <section
      className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
      aria-labelledby="hero-heading"
    >
      {/* Animated gradient background */}
      <div className="hero-bg absolute inset-0" />
      <div className="hero-orb hero-orb-1" aria-hidden />
      <div className="hero-orb hero-orb-2" aria-hidden />
      <div className="hero-orb hero-orb-3" aria-hidden />

      <Container size="default" className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left: headline + copy + CTAs */}
          <div className="hero-content">
            {/* Badge */}
            <Link
              href="/features"
              className="hero-badge group mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent-subtle)] px-4 py-2 text-sm font-medium text-[var(--color-accent)] transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white hover:shadow-[var(--shadow-cta)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              </span>
              New: OTP Verification & Lead Analytics
            </Link>

            <h1
              id="hero-heading"
              className="font-heading max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
            >
              Free Online Form Builder with <span className="text-[var(--color-accent)]">Unlimited Submissions</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-secondary)]">
              Build unlimited online forms in minutes with LeadFormHub. Collect leads, receive instant email notifications, and manage submissions from one simple dashboard.
            </p>
            <p className="mt-4 text-base text-[var(--foreground-subtle)]">
              No credit card required · Collect Verified Leads · Built for India
            </p>

            {/* Clickable feature pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/features"
                className="hero-pill rounded-lg border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-sm transition-all hover:border-[var(--color-accent)] hover:shadow-md hover:-translate-y-0.5"
              >
                OTP Verification
              </Link>
              <Link
                href="/features"
                className="hero-pill rounded-lg border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-sm transition-all hover:border-[var(--color-accent)] hover:shadow-md hover:-translate-y-0.5"
              >
                Analytics
              </Link>
              <Link
                href="/pricing"
                className="hero-pill rounded-lg border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-sm transition-all hover:border-[var(--color-accent)] hover:shadow-md hover:-translate-y-0.5"
              >
                Collect Verified Leads
              </Link>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="hero-cta-primary btn-base group inline-flex h-12 min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.35)] active:scale-[0.98]"
              >
                Get Started Free
                <svg className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="hero-cta-secondary btn-base inline-flex h-12 min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border-2 border-[var(--border-strong)] bg-transparent px-6 text-base font-medium text-[var(--foreground-heading)] transition-all hover:scale-[1.02] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)] active:scale-[0.98]"
              >
                Get In Touch
              </Link>
            </div>
            <p className="mt-4 text-base text-black">
              Secure sign-up · Your data is protected with SSL encryption.
            </p>
          </div>

          {/* Right: product preview — form + dashboard mock (clickable) */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Floating accent card */}
            <div className="hero-card hero-floating-stats absolute -left-4 top-1/4 z-20 hidden w-36 -translate-y-1/2 rounded-xl border border-[var(--border-default)] bg-white p-3 shadow-lg lg:flex" aria-hidden>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-success)]/15">
                  <svg className="size-4 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--foreground-muted)]">Verified today</p>
                  <p className="font-heading text-lg font-bold text-[var(--foreground-heading)]">12</p>
                </div>
              </div>
            </div>

            <Link
              href="/signup"
              className="hero-card group relative block w-full max-w-[420px] overflow-hidden rounded-2xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-lg)] transition-all hover:border-[var(--color-accent)]/40 hover:shadow-[0_32px_64px_-12px_rgba(37,99,235,0.2)] hover:-translate-y-1"
            >
              {/* Subtle gradient header */}
              <div className="relative h-2 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)]/80 to-[var(--color-accent)]/40" aria-hidden />

              <div className="relative p-6 sm:p-8">
                {/* Mini form preview */}
                <div className="mb-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--neutral-50)]/80 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">Demo form</p>
                  <div className="space-y-2.5">
                    <div className="rounded-lg border border-[var(--border-default)] bg-white px-3 py-2">
                      <span className="text-xs text-[var(--foreground-muted)]">Name</span>
                    </div>
                    <div className="rounded-lg border border-[var(--border-default)] bg-white px-3 py-2">
                      <span className="text-xs text-[var(--foreground-muted)]">Email</span>
                    </div>
                    <div className="rounded-lg border border-[var(--color-accent)]/40 bg-white px-3 py-2 ring-1 ring-[var(--color-accent)]/20">
                      <span className="text-xs text-[var(--color-accent)]">Phone · OTP verified</span>
                    </div>
                    <div className="rounded-lg bg-[var(--color-accent)] py-2.5 text-center text-sm font-semibold text-white">
                      Submit
                    </div>
                  </div>
                </div>

                {/* Leads list */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--foreground-heading)]">Recent leads</span>
                    <span className="rounded-full bg-[var(--color-accent-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]">3 new</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Priya S.", time: "2m ago", verified: true },
                      { name: "Rahul M.", time: "12m ago", verified: true },
                      { name: "Anitha K.", time: "1h ago", verified: true },
                    ].map((lead) => (
                      <div
                        key={lead.name}
                        className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-white p-3 transition-colors group-hover:border-[var(--color-accent)]/20"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 font-heading text-sm font-semibold text-[var(--color-accent)]">
                          {lead.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[var(--foreground-heading)]">{lead.name}</p>
                          <p className="text-xs text-[var(--foreground-muted)]">{lead.time}</p>
                        </div>
                        {lead.verified && (
                          <div className="shrink-0" title="Verified">
                            <svg className="size-4 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA hint on hover */}
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[var(--color-accent)]/5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
                  <span className="rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-xl">
                    Start free →
                  </span>
                </div>
              </div>
            </Link>

            {/* Floating badge — bottom right (desktop only) */}
            <div className="hero-floating-badge absolute -bottom-2 -right-2 z-20 hidden rounded-xl border border-[var(--border-default)] bg-white px-3 py-2 shadow-md lg:-bottom-4 lg:-right-4 lg:block" aria-hidden>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)]">
                  <svg className="size-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-[var(--foreground-heading)]">Collect Verified Leads</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
