import Link from "next/link";
import { Navbar, ComparisonTable, CTA, Footer } from "@/components/landing";
import { BlogInternalLinks } from "@/components/blog/BlogInternalLinks";
import { BlogRelatedPosts } from "@/components/blog/BlogRelatedPosts";
import { BlogStructuredData } from "@/components/blog/BlogStructuredData";
import { BlogCompareTable } from "@/components/blog/BlogCompareTable";
import { BlogInlineCta } from "@/components/blog/BlogInlineCta";
import { BlogProsConsGrid } from "@/components/blog/BlogProsConsGrid";
import { Container } from "@/components/ui/Container";
import type { ComparisonPageData, CtaVariant } from "@/lib/comparison-blog/types";
import type { BlogFaqItem } from "@/lib/blog-seo";

type ComparisonBlogPostProps = {
  data: ComparisonPageData;
};

function RichParagraph({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <p className="mt-4 text-[var(--foreground-muted)] leading-relaxed">
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          return (
            <Link key={i} href={match[2]} className="font-medium text-[var(--color-accent)] hover:underline">
              {match[1]}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

export function ComparisonBlogPost({ data }: ComparisonBlogPostProps) {
  const {
    slug,
    published,
    schemaHeadline,
    schemaDescription,
    eyebrow,
    h1,
    h1Highlight,
    shortAnswer,
    intro,
    snippetBlocks,
    quickCompare,
    competitorLabel,
    competitorCells,
    comparisonTableHeading,
    featureSections,
    whyLeadFormHub,
    prosCons,
    pricingCompare,
    useCases,
    verdict,
    decisionGuide,
    scenarios,
    faqs,
  } = data;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <BlogStructuredData
        slug={slug}
        headline={schemaHeadline}
        description={schemaDescription}
        datePublished={published}
        faqs={faqs}
      />
      <Navbar />
      <main>
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="comparison-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />
          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                {eyebrow}
              </p>
              <h1
                id="comparison-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                {h1Highlight ? (
                  <>
                    {h1.replace(h1Highlight, "").trim()}{" "}
                    <span className="hero-highlight">{h1Highlight}</span>
                  </>
                ) : (
                  h1
                )}
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                <strong className="text-[var(--foreground-heading)]">Short answer:</strong> {shortAnswer}
              </p>
              <BlogInlineCta variant="start-free" className="hero-content mt-8 justify-center" />
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-14 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            {intro.map((para) => (
              <RichParagraph key={para.slice(0, 48)} text={para} />
            ))}

            {snippetBlocks?.map((block) => (
              <div key={block.heading} className="mt-12">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
                  {block.heading}
                </h2>
                <p className="mt-4 text-lg text-[var(--foreground-muted)]">{block.answer}</p>
              </div>
            ))}

            <h2 className="font-heading mt-12 text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
              Quick comparison at a glance
            </h2>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Use this matrix when you need a fast side-by-side view before diving into each category below.
            </p>
            <BlogCompareTable headers={quickCompare.headers} rows={quickCompare.rows} />
            <BlogInlineCta variant="try-free" />
          </Container>
        </section>

        {competitorCells && competitorLabel ? (
          <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
            <Container className="px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl text-center">
                {comparisonTableHeading ?? `LeadFormHub vs ${competitorLabel}: lead capture essentials`}
              </h2>
              <div className="mt-10">
                <ComparisonTable competitorLabel={competitorLabel} competitorCells={competitorCells} />
              </div>
            </Container>
          </section>
        ) : null}

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            {featureSections.map((section, idx) => (
              <article key={section.title} className={idx > 0 ? "mt-14 border-t border-[var(--border-subtle)] pt-14" : ""}>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
                  {section.title}
                </h2>
                {section.snippetAnswer ? (
                  <p className="mt-4 text-lg text-[var(--foreground-muted)]">
                    <strong className="text-[var(--foreground-heading)]">{section.snippetAnswer}</strong>
                  </p>
                ) : null}
                {section.paragraphs.map((para) => (
                  <RichParagraph key={para.slice(0, 56)} text={para} />
                ))}
                {section.table ? (
                  <BlogCompareTable
                    title={section.table.title}
                    headers={section.table.headers}
                    rows={section.table.rows}
                  />
                ) : null}
                {section.cta ? <BlogInlineCta variant={section.cta} /> : null}
              </article>
            ))}
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Why businesses choose LeadFormHub
            </h2>
            <ul className="mt-8 space-y-6">
              {whyLeadFormHub.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                    <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{item.title}</h3>
                    <p className="mt-1 text-[var(--foreground-muted)]">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <BlogInlineCta variant="create-form" />
          </Container>
        </section>

        {prosCons?.length ? (
          <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
            <Container size="narrow" className="px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
                Pros and cons summary
              </h2>
              <p className="mt-4 text-[var(--foreground-muted)]">
                No tool wins every scenario. These trade-offs reflect what teams report after running paid campaigns and daily follow-up—not feature checklists alone.
              </p>
              <BlogProsConsGrid entries={prosCons} />
            </Container>
          </section>
        ) : null}

        {pricingCompare ? (
          <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
            <Container size="narrow" className="px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
                Pricing comparison
              </h2>
              <p className="mt-4 text-[var(--foreground-muted)]">
                Published list prices change. Treat this table as a planning guide and confirm limits on each vendor&apos;s site before you commit ad spend.
              </p>
              <BlogCompareTable headers={pricingCompare.headers} rows={pricingCompare.rows} />
              <RichParagraph text="See [LeadFormHub pricing](/pricing) for current plans and monthly billing options." />
            </Container>
          </section>
        ) : null}

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl text-center">
              Best use cases in the real world
            </h2>
            <ul className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
              {useCases.map((uc) => (
                <li
                  key={uc.title}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--neutral-50)]/50 p-6"
                >
                  <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{uc.title}</h3>
                  <p className="mt-2 text-base text-[var(--foreground-muted)]">{uc.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {scenarios?.length ? (
          <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
            <Container size="narrow" className="px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
                Real-world scenarios
              </h2>
              <p className="mt-4 text-[var(--foreground-muted)]">
                How teams actually choose—drawn from common B2B, agency, and SMB lead-gen setups (not abstract feature lists).
              </p>
              <ul className="mt-8 space-y-8">
                {scenarios.map((s) => (
                  <li key={s.title} className="rounded-2xl border border-[var(--border-default)] bg-white p-6">
                    <h3 className="font-heading text-lg font-semibold text-[var(--foreground-heading)]">{s.title}</h3>
                    <p className="mt-3 text-[var(--foreground-muted)] leading-relaxed">{s.body}</p>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        {decisionGuide ? (
          <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
            <Container size="narrow" className="px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
                {decisionGuide.title}
              </h2>
              {decisionGuide.paragraphs.map((para) => (
                <RichParagraph key={para.slice(0, 48)} text={para} />
              ))}
              <ol className="mt-6 list-decimal space-y-4 pl-5 text-[var(--foreground-muted)]">
                {decisionGuide.checklist.map((item) => (
                  <li key={item.slice(0, 40)} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>
            </Container>
          </section>
        ) : null}

        {verdict?.length ? (
          <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-14 sm:py-16">
            <Container size="narrow" className="px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
                Verdict
              </h2>
              {verdict.map((p) => (
                <RichParagraph key={p.slice(0, 48)} text={p} />
              ))}
            </Container>
          </section>
        ) : null}

        <section id="faq" className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] text-center">
              Frequently asked questions
            </h2>
            <dl className="mt-10 space-y-8">
              {faqs.map((item: BlogFaqItem) => (
                <div key={item.question}>
                  <dt className="font-heading text-lg font-semibold text-[var(--foreground-heading)]">{item.question}</dt>
                  <dd className="mt-2 text-[var(--foreground-muted)]">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Ready to compare in practice?</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Publish a branded lead form in minutes
            </h2>
            <p className="mt-2 text-[var(--foreground-muted)]">Free plan available. No credit card required to start.</p>
            <BlogInlineCta variant="start-free" className="mt-8 justify-center" />
          </Container>
        </section>

        <BlogRelatedPosts slug={slug} heading="More comparison guides" />
        <BlogInternalLinks slug={slug} />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
