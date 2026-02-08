import { Container } from "@/components/ui/Container";

/** 3. Social Proof / Trust Bar — horizontal strip, grayscale placeholders, enterprise trust */
const industries = ["Agencies", "SaaS", "D2C", "Real Estate", "SMBs"] as const;

/* Testimonials focused on lead quality, reduced fake leads, and sales productivity. */
const testimonials = [
  {
    quote:
      "OTP verification removed fake and mistyped numbers completely. Our sales team now works only on real prospects — lead quality and conversions improved immediately.",
    author: "Priya Sharma",
    role: "Head of Growth, B2B SaaS",
  },
  {
    quote:
      "We stopped wasting time on junk leads. Every contact in our dashboard is verified. Sales productivity went up because we're calling real people.",
    author: "Rahul Mehta",
    role: "Founder, Digital Agency",
  },
  {
    quote:
      "One branded hub, verified leads, and monthly INR pricing. We replaced spreadsheets and three different tools. Setup was fast; we were live the same day.",
    author: "Anitha Krishnan",
    role: "Marketing Lead, D2C Brand",
  },
];

export function SocialProof() {
  return (
    <section className="border-y border-[var(--border-subtle)] bg-[var(--background-elevated)] py-12 sm:py-16">
      <Container>
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-[0.12em] text-[var(--foreground-subtle)]">
          Trusted by teams across India
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
