import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

/** 10. Integrations — Email, CRM, Zapier (coming soon). Fits into existing stack. */
const integrations = [
  { name: "Email", status: "available", description: "Receive instant lead notifications." },
  { name: "CRM", status: "available", description: "Sync verified leads to your CRM." },
  { name: "Zapier", status: "coming", description: "Coming soon — connect to 5,000+ apps." },
];

export function Integrations() {
  return (
    <section id="integrations" className="section-padding bg-[var(--background)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-4xl">
            Fits Into Your Existing Stack
          </h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Fits seamlessly into your existing stack.
          </p>
        </div>
        <div className="mx-auto mt-16 flex flex-wrap justify-center gap-8">
          {integrations.map((i) => (
            <div
              key={i.name}
              className="flex w-full max-w-xs flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-8 transition-shadow duration-200 hover:shadow-[var(--shadow-sm)] sm:w-auto"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-lg font-semibold text-[var(--foreground-heading)]">
                  {i.name}
                </span>
                {i.status === "coming" && (
                  <Badge variant="default">Coming soon</Badge>
                )}
              </div>
              <p className="mt-2 text-base text-[var(--foreground-muted)]">
                {i.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
