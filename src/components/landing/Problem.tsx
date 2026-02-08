import { Container } from "@/components/ui/Container";

/** Icon: branded domain / link (globe + link) */
function IconBrandedHub({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

/** Icon: mobile OTP / verification (shield with check) */
function IconOtpVerification({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

/** Icon: centralized dashboard (layout grid / chart) */
function IconDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

/** 4. Problem Statement — 3 columns, pain-focused, enterprise language, matching icons */
const pains = [
  {
    title: "Branded Lead Capture Hub at Your Domain",
    description: "Your forms live at leadformhub.com/yourbrand. Every link reflects your business and builds trust when you share links in ads, emails, or on your site.",
    icon: IconBrandedHub,
  },
  {
    title: "Optional Mobile OTP Verification for Real Leads",
    description: "Turn on OTP per form. Submitters confirm their mobile number; only verified contacts reach your dashboard so sales spends time on real prospects.",
    icon: IconOtpVerification,
  },
  {
    title: "Centralized Lead Dashboard for Teams",
    description: "All forms feed into one dashboard. View, filter, search, and export leads from every campaign in one place.",
    icon: IconDashboard,
  },
];

export function Problem() {
  return (
    <section className="section-padding bg-[var(--background)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Why Indian B2B Teams Choose LeadFormHub
          </h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            A verified lead capture platform built for Indian B2B teams — branded hub, OTP verification, and one dashboard.
          </p>
        </div>
        <ul className="mx-auto mt-16 grid max-w-3xl gap-8 sm:grid-cols-3">
          {pains.map((p) => {
            const Icon = p.icon;
            return (
              <li
                key={p.title}
                className="card-padding rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] text-center"
              >
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">
                  {p.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-[var(--foreground-muted)]">
                  {p.description}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
