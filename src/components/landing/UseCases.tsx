import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

/** 9. Use Cases / Who It's For — grid, short benefit-driven line per segment, business tone */
const useCases = [
  {
    title: "Agencies",
    description:
      "Run multiple clients from one platform. White-label forms and verified leads.",
    icon: "A",
  },
  {
    title: "Startups",
    description:
      "Launch landing pages, waitlists, and contact forms with clean data.",
    icon: "S",
  },
  {
    title: "Marketers",
    description:
      "Campaign-ready forms that verify leads before they hit your funnel.",
    icon: "M",
  },
  {
    title: "Sales Teams",
    description:
      "Spend time only on qualified, reachable prospects.",
    icon: "T",
  },
];

export function UseCases() {
  return (
    <section className="section-padding border-t border-[var(--border-subtle)] bg-[var(--background-elevated)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-4xl">
            Built For How Teams Actually Work
          </h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Trusted by agencies, startups, marketing teams, and sales organizations to capture and verify leads.
          </p>
        </div>
        <div className="mx-auto mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((uc) => (
            <Card key={uc.title} className="flex flex-col">
              <CardHeader>
                <div className="flex size-12 items-center justify-center rounded-xl bg-[var(--neutral-100)] font-heading text-xl font-bold text-[var(--foreground-muted)]">
                  {uc.icon}
                </div>
                <CardTitle className="mt-4">{uc.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pt-0">
                <p className="text-base leading-relaxed text-[var(--foreground-muted)]">
                  {uc.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
