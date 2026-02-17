import { Container } from "@/components/ui/Container";

/** 3. Social Proof / Trust Bar — horizontal strip, grayscale placeholders, enterprise trust */
const industries = ["Agencies", "SaaS", "D2C", "Real Estate", "SMBs"] as const;

/* Realistic testimonials — specific details, natural language, varied tone. */
const testimonials = [
  {
    quote:
      "We were getting maybe 40% of leads with wrong or fake numbers. After turning on OTP verification, that dropped to almost nothing. Our SDRs actually want to pick up the phone now because they're not wasting an hour on dead leads.",
    author: "Marcus Chen",
    role: "Sales Ops, TechFlow",
  },
  {
    quote:
      "I was skeptical — we'd tried other lead forms. But having one link for all our campaigns and knowing every number is verified? Game changer. Cut our cost per qualified lead by about a third in the first two months.",
    author: "Sarah Okonkwo",
    role: "Performance Lead, Finch Media",
  },
  {
    quote:
      "We used to run forms on Typeform, then manually check numbers in a sheet. Total mess. Now it's one hub, leads come in verified, and we're not paying per form. Took us an afternoon to switch over.",
    author: "James Rivera",
    role: "Growth, DTC (e‑comm)",
  },
];

export function SocialProof() {
  return (
    <section className="border-y border-[var(--border-subtle)] bg-[var(--background-elevated)] py-12 sm:py-16">
      <Container>
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
          Trusted by teams worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {industries.map((name) => (
            <span
              key={name}
              className="font-heading text-base font-semibold text-[var(--foreground-muted)] transition-opacity hover:opacity-100 sm:text-lg"
            >
              {name}
            </span>
          ))}
        </div>

        <div className="mt-24 grid gap-8 sm:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.author}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] p-8"
            >
              <p className="text-lg leading-relaxed text-[var(--foreground-heading)]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-6">
                <cite className="not-italic">
                  <span className="block font-semibold text-[var(--foreground-heading)]">
                    {t.author}
                  </span>
                  <span className="text-sm text-[var(--foreground-muted)]">
                    {t.role}
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
