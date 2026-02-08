import { Container } from "@/components/ui/Container";

/** 6. Feature Grid — enterprise core features. Clean cards, soft shadows, consistent spacing. */
const features = [
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Custom Form Builder",
    description: "Create forms with your own fields, questions, and layout.",
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "OTP Verification (Optional)",
    description: "Enable mobile OTP to block fake and mistyped numbers instantly.",
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    title: "Unified Dashboard",
    description: "All forms and leads in one calm, focused interface.",
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Analytics & Insights",
    description: "Track submissions, conversions, and form performance over time.",
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: "Brand Control",
    description: "Your subdomain, your forms. Share links or embed anywhere.",
  },
  {
    icon: (
      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "Export & Integrations",
    description: "CSV export today. CRM, email, and Zapier integrations coming soon.",
  },
];

export function Features() {
  return (
    <section id="features" className="section-padding bg-[var(--background-alt)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-4xl">
            Built for lead quality, not just forms
          </h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Verified leads, sales-ready contacts, and one dashboard. Purpose-built for Indian B2B teams who need to stop chasing fake numbers.
          </p>
        </div>
        <ul className="mx-auto mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li
              key={f.title}
              className="card-padding group rounded-xl border border-[var(--border-default)] bg-white transition-shadow duration-200 hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--neutral-100)] text-[var(--foreground)] transition-colors group-hover:bg-[var(--neutral-200)] group-hover:text-[var(--foreground-heading)]">
                {f.icon}
              </div>
              <h3 className="mt-6 font-heading font-semibold text-[var(--foreground-heading)]">
                {f.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-[var(--foreground-muted)]">
                {f.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
