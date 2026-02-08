import Link from "next/link";
import { Container } from "@/components/ui/Container";

/** 12. Final Conversion CTA — strong headline, subtext, Get Started Free + Book a demo */
export function CTA() {
  return (
    <section className="section-padding bg-[var(--color-primary)]">
      <Container size="narrow">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--footer-heading)] sm:text-4xl">
            Get Started with LeadFormHub Today
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-[var(--footer-text)]">
            Create your account, claim your hub, and publish your first form in minutes. No credit card required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="btn-base inline-flex h-14 min-h-[44px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-8 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Get Started Free
            </Link>
            <Link
              href="/signup"
              className="btn-base inline-flex h-14 min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-on-primary-border)] px-8 text-base font-medium text-[var(--footer-heading)] transition-colors hover:bg-[var(--color-on-primary-hover)]"
            >
              Book a Demo
            </Link>
          </div>
          <p className="mt-5 text-base text-white">
            Secure sign-up · Your data is protected with SSL encryption.
          </p>
        </div>
      </Container>
    </section>
  );
}
