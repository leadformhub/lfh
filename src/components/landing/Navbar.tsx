"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-shadow duration-200",
        scrolled && "shadow-[var(--header-shadow-scrolled)]"
      )}
      style={{
        borderBottomColor: "var(--header-border)",
        backdropFilter: "blur(6px)",
        background: "var(--header-bg)",
      }}
      aria-label="Main navigation"
    >
      <Container>
        <nav className="flex h-14 items-center justify-between md:h-16 lg:h-[4.5rem]">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-90"
            aria-label="LeadFormHub home"
          >
            <Image src="/logo-b1.png" alt="LeadFormHub" width={240} height={60} priority className="h-12 w-auto sm:h-[3.375rem]" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/features" className="text-base text-[var(--header-nav)] transition-colors hover:text-[var(--header-logo)] hover:underline underline-offset-4">Features</Link>
            <Link href="/pricing" className="text-base text-[var(--header-nav)] transition-colors hover:text-[var(--header-logo)] hover:underline underline-offset-4">Pricing</Link>
            <Link href="/integrations" className="text-base text-[var(--header-nav)] transition-colors hover:text-[var(--header-logo)] hover:underline underline-offset-4">Integrations</Link>
            <Link href="/faq" className="text-base text-[var(--header-nav)] transition-colors hover:text-[var(--header-logo)] hover:underline underline-offset-4">FAQ</Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="inline-flex h-10 min-h-[44px] items-center justify-center rounded-lg px-4 text-base font-medium text-[var(--header-nav)] transition-colors hover:bg-[var(--neutral-100)]">Log In</Link>
            <Link href="/signup" className="btn-base inline-flex h-10 min-h-[44px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-[var(--color-accent-hover)] hover:shadow-[var(--shadow-sm)]">Get Started Free</Link>
          </div>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-[var(--radius-md)] text-[var(--header-logo)] hover:bg-[var(--neutral-100)] md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>
      </Container>
    </header>

    {/* Mobile: professional slide-in panel */}
    <div
      className={cn(
        "fixed top-14 right-0 z-[60] w-[min(100vw,340px)] transform rounded-bl-2xl border-b border-l border-[var(--border-default)] bg-[var(--header-bg-solid)] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out md:hidden",
        "backdrop-blur-xl",
        mobileOpen ? "translate-x-0" : "translate-x-full"
      )}
      aria-hidden={!mobileOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <nav className="flex flex-col py-6 px-4" aria-label="Mobile navigation">
        {/* Nav links */}
        <div className="flex flex-col gap-1">
          <Link
            href="/features"
            className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[var(--header-nav)] transition-colors hover:bg-[var(--neutral-100)] hover:text-[var(--header-logo)] active:bg-[var(--neutral-200)]"
            onClick={() => setMobileOpen(false)}
          >
            <svg className="size-5 shrink-0 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Features
          </Link>
          <Link
            href="/pricing"
            className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[var(--header-nav)] transition-colors hover:bg-[var(--neutral-100)] hover:text-[var(--header-logo)] active:bg-[var(--neutral-200)]"
            onClick={() => setMobileOpen(false)}
          >
            <svg className="size-5 shrink-0 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pricing
          </Link>
          <Link
            href="/integrations"
            className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[var(--header-nav)] transition-colors hover:bg-[var(--neutral-100)] hover:text-[var(--header-logo)] active:bg-[var(--neutral-200)]"
            onClick={() => setMobileOpen(false)}
          >
            <svg className="size-5 shrink-0 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
            Integrations
          </Link>
          <Link
            href="/faq"
            className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[var(--header-nav)] transition-colors hover:bg-[var(--neutral-100)] hover:text-[var(--header-logo)] active:bg-[var(--neutral-200)]"
            onClick={() => setMobileOpen(false)}
          >
            <svg className="size-5 shrink-0 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            FAQ
          </Link>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-[var(--border-default)]" />

        {/* Auth section */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="flex min-h-[48px] items-center justify-center rounded-xl border border-[var(--border-default)] px-4 py-3 text-[15px] font-semibold text-[var(--header-nav)] transition-colors hover:bg-[var(--neutral-50)] hover:border-[var(--border-strong)] active:bg-[var(--neutral-100)]"
            onClick={() => setMobileOpen(false)}
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="btn-base flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-3 text-[15px] font-semibold text-white shadow-[var(--shadow-cta)] transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] active:scale-[0.98]"
            onClick={() => setMobileOpen(false)}
          >
            Get Started Free
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </nav>
    </div>
    {mobileOpen && (
      <button
        type="button"
        className="fixed inset-0 z-[55] bg-black/20 md:hidden"
        aria-label="Close menu"
        onClick={() => setMobileOpen(false)}
      />
    )}
    </>
  );
}
