import Link from "next/link";
import { Container } from "@/components/ui/Container";

/** 8. How It Works — 3-step horizontal, step numbers, minimal icons, clear flow */
const steps = [
  { step: "1", title: "Sign up & claim hub", description: "Claim your branded hub — no credit card required." },
  { step: "2", title: "Create & publish form", description: "Add fields, enable OTP if needed, and publish instantly." },
  { step: "3", title: "Collect verified leads", description: "Leads flow into your dashboard, ready to export or integrate." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-[var(--background)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Trusted by Indian SMBs and B2B Marketers
          </h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Indian SMBs and B2B marketers use LeadFormHub for ads, landing pages, events, and webinars. Pay in INR, get verified leads, and keep control of your data and brand.
          </p>
        </div>
        <div className="mx-auto mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-8 text-center transition-shadow duration-200 hover:shadow-[var(--shadow-sm)]"
            >
              <div className="mx-auto flex size-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)] font-heading text-xl font-bold text-white">
                {s.step}
              </div>
              <h3 className="mt-6 font-heading text-lg font-semibold text-[var(--foreground-heading)]">
                {s.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-[var(--foreground-muted)]">
                {s.description}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center">
          <Link
            href="/signup"
            className="font-medium text-[var(--color-accent)] hover:underline"
          >
            Start Free →
          </Link>
        </p>
      </Container>
    </section>
  );
}
