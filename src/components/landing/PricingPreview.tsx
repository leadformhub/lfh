import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getPublicPlanPricingPayload } from "@/lib/super-admin-plan-pricing";

/** 11. Pricing Teaser — 3 cards (Free, Pro, Business). Price + one-line value + CTA Start Free. */
export async function PricingPreview() {
  const { marketingCards } = await getPublicPlanPricingPayload();
  const planMeta = (["free", "pro", "business"] as const).map((key) => {
    const card = marketingCards[key];
    return {
      key,
      name: card.name,
      price: card.priceLabel,
      actualPrice: card.strikethroughLabel,
      period: card.period,
      description: card.description,
      cta: card.cta,
      href: "/signup" as const,
      highlighted: card.highlighted,
      features: card.bullets,
    };
  });

  return (
    <section id="pricing" className="section-padding border-t border-[var(--border-default)] bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Monthly Pricing (No Auto Renewal)
          </h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Start Free. When you upgrade, monthly pricing. Simple, predictable pricing for teams.
          </p>
        </div>
        <div className="mx-auto mt-16 grid gap-8 lg:grid-cols-3">
          {planMeta.map((plan) => (
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
              <div className="mt-4 flex flex-wrap items-baseline gap-2">
                {plan.actualPrice && (
                  <span className="font-heading text-xl font-medium text-[var(--foreground-muted)] line-through">
                    {plan.actualPrice}
                  </span>
                )}
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
