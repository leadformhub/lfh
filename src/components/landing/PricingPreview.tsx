import Link from "next/link";
import { Container } from "@/components/ui/Container";

import { getPlanFeatureBullets } from "@/lib/plan-features";
import type { PlanKey } from "@/lib/plans";

/** 11. Pricing Teaser — 3 cards (Free, Pro, Business). Price + one-line value + CTA Start Free. */
const planMeta = [
  {
    key: "free" as PlanKey,
    name: "Free",
    price: "₹0",
    period: "(Forever)",
    description: "Ideal for testing and early use",
    cta: "Start Free",
    href: "/signup",
    highlighted: false,
  },
  {
    key: "pro" as PlanKey,
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For growing teams",
    cta: "Start Free, Upgrade Later",
    href: "/signup",
    highlighted: true,
  },
  {
    key: "business" as PlanKey,
    name: "Business",
    price: "₹1,999",
    period: "/month",
    description: "For agencies & scale",
    cta: "Start Free, Upgrade Later",
    href: "/signup",
    highlighted: false,
  },
];
const plans = planMeta.map((p) => ({ ...p, features: getPlanFeatureBullets(p.key) }));

export function PricingPreview() {
  return (
    <section id="pricing" className="section-padding border-t border-[var(--border-default)] bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Monthly Pricing in INR
          </h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Start Free. When you upgrade, pay monthly in INR via UPI, card, or net banking. Simple, predictable pricing for teams.
          </p>
        </div>
        <div className="mx-auto mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-xl border p-8 ${
                plan.highlighted
                  ? "border-[var(--color-accent)]/30 bg-[var(--background-alt)] shadow-[var(--shadow-md)]"
                  : "border-[var(--border-default)] bg-[var(--background-elevated)] shadow-[var(--shadow-sm)]"
              }`}
            >
              <h3 className="font-heading text-lg font-semibold text-[var(--foreground-heading)]">
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold tracking-tight text-[var(--foreground-heading)]">
                  {plan.price}
                </span>
                <span className="text-[var(--foreground-muted)]">{plan.period}</span>
              </div>
              <p className="mt-2 text-base text-[var(--foreground-muted)]">
                {plan.description}
              </p>
              <ul className="mt-8 flex-1 space-y-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-base text-[var(--foreground)]">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)] text-xs text-white">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`btn-base mt-8 flex h-12 min-h-[44px] items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-[var(--color-accent)] text-white shadow-[var(--shadow-cta)] hover:bg-[var(--color-accent-hover)] hover:shadow-[var(--shadow-md)]"
                    : "border border-[var(--border-strong)] bg-transparent text-[var(--foreground-heading)] hover:bg-[var(--neutral-100)]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
