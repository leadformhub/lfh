import { Container } from "@/components/ui/Container";

/** 5. Solution Overview — 3 feature blocks: icon, short headline, one-line explanation */
const steps = [
  {
    title: "Create Your Branded Hub",
    description:
      "Sign up and claim your hub. No credit card required. Your subdomain is ready in minutes.",
  },
  {
    title: "Capture and Verify Leads",
    description:
      "Create forms, add fields, and enable OTP where it matters. Publish a link or embed; verified leads land in your dashboard.",
  },
  {
    title: "Manage Everything in One Place",
    description:
      "Use the dashboard to see all leads, filter by form or date, and export to CSV or send to your CRM.",
  },
];

export function Solution() {
  return (
    <section className="section-padding border-t border-[var(--border-subtle)] bg-[var(--background-elevated)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            How LeadFormHub Works
          </h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            From signup to verified leads in three steps. No credit card required.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl gap-12 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-lg font-semibold text-white">
                {i + 1}
              </div>
              <h3 className="mt-6 font-heading font-semibold text-[var(--foreground-heading)]">
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-[var(--foreground-muted)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
