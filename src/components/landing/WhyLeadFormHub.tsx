import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Why LeadFormHub — comparison-style section for homepage.
 * Positions LeadFormHub as a verified lead capture platform, not a form builder.
 * Bullets: OTP-verified leads, Branded hub ownership, India-first pricing, Sales-ready dashboard, Lightweight & fast.
 */
const reasons = [
  {
    title: "OTP-verified leads",
    description: "Only real contacts reach your dashboard. Stop chasing fake or mistyped numbers.",
  },
  {
    title: "Branded hub ownership",
    description: "Your presence at leadformhub.com/yourbrand. Professional, credible, and yours.",
  },
  {
    title: "India-first pricing",
    description: "Flexible payment options: UPI, cards, or net banking. Monthly plans, transparent pricing.",
  },
  {
    title: "Sales-ready dashboard",
    description: "Centralized leads, filters, and export. Built for teams who need to act fast.",
  },
  {
    title: "Lightweight & fast",
    description: "No heavy ecosystem. Set up in minutes and focus on closing, not configuration.",
  },
];

export function WhyLeadFormHub() {
  return (
    <section className="section-padding border-t border-[var(--border-subtle)] bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Built for Agencies, Startups, and Sales Teams
          </h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Agencies run multiple client campaigns from one account. Startups need fast setup and real leads. Sales teams want one source of truth. LeadFormHub fits all three.
          </p>
        </div>
        <ul className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.slice(0, 5).map((r) => (
            <li
              key={r.title}
              className="flex gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-6"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--neutral-100)] text-[var(--foreground)]" aria-hidden>
                ✓
              </span>
              <div>
                <h3 className="font-heading font-semibold text-[var(--foreground)]">{r.title}</h3>
                <p className="mt-1 text-base leading-relaxed text-[var(--foreground-muted)]">{r.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-xl text-center text-base text-[var(--foreground-muted)]">
          Comparing options? See how we stack up:{" "}
          <Link href="/typeform-alternative" className="font-medium text-[var(--color-accent)] hover:underline">Typeform alternative</Link>
          {" · "}
          <Link href="/google-forms-alternative" className="font-medium text-[var(--color-accent)] hover:underline">Google Forms alternative</Link>
          {" · "}
          <Link href="/zoho-forms-alternative" className="font-medium text-[var(--color-accent)] hover:underline">Zoho Forms alternative</Link>
        </p>
      </Container>
    </section>
  );
}
