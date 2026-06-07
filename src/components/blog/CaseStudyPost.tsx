import Link from "next/link";
import { BlogArticleDates } from "@/components/blog/BlogArticleDates";
import { BlogInternalLinks } from "@/components/blog/BlogInternalLinks";
import { BlogRelatedPosts } from "@/components/blog/BlogRelatedPosts";
import { BlogStructuredData } from "@/components/blog/BlogStructuredData";
import { Navbar, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import type { BlogFaqItem } from "@/lib/blog-seo";
import { SITE_URL } from "@/lib/seo";

export type CaseStudyMetric = {
  label: string;
  before: string;
  after: string;
};

export type CaseStudySection = {
  heading: string;
  paragraphs: string[];
};

export type CaseStudyPostProps = {
  slug: string;
  headline: string;
  description: string;
  published: string;
  updated: string;
  company: string;
  industry: string;
  metrics: CaseStudyMetric[];
  sections: CaseStudySection[];
  faqs?: BlogFaqItem[];
  relatedSlug?: string;
};

export function CaseStudyPost({
  slug,
  headline,
  description,
  published,
  updated,
  company,
  industry,
  metrics,
  sections,
  faqs,
}: CaseStudyPostProps) {
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/blog/${slug}#article`,
    headline,
    description,
    articleSection: "Case Study",
    about: {
      "@type": "Organization",
      name: company,
      description: `${industry} team using LeadFormHub for lead capture`,
    },
    author: { "@type": "Organization", name: "LeadFormHub Editorial Team" },
    publisher: { "@type": "Organization", name: "LeadFormHub", url: SITE_URL },
    datePublished: published,
    dateModified: updated,
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <BlogStructuredData
        slug={slug}
        headline={headline}
        description={description}
        datePublished={published}
        dateModified={updated}
        faqs={faqs}
        extraSchemas={[caseStudySchema]}
      />
      <Navbar />
      <main>
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="case-study-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Case study · {industry}
              </p>
              <h1
                id="case-study-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl"
              >
                {headline}
              </h1>
              <BlogArticleDates slug={slug} />
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">{description}</p>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-14 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold text-[var(--foreground-heading)]">Results at a glance</h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="py-3 pr-4 font-semibold text-[var(--foreground-heading)]">Metric</th>
                    <th className="py-3 pr-4 font-semibold text-[var(--foreground-muted)]">Before</th>
                    <th className="py-3 font-semibold text-[var(--color-accent)]">After</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m) => (
                    <tr key={m.label} className="border-b border-[var(--border-subtle)]">
                      <td className="py-3 pr-4 font-medium text-[var(--foreground-heading)]">{m.label}</td>
                      <td className="py-3 pr-4 text-[var(--foreground-muted)]">{m.before}</td>
                      <td className="py-3 font-semibold text-[var(--foreground-heading)]">{m.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-14 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            {sections.map((section) => (
              <div key={section.heading} className="mb-10 last:mb-0">
                <h2 className="font-heading text-xl font-semibold text-[var(--foreground-heading)] sm:text-2xl">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-4 text-[var(--foreground-muted)] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}
            <p className="mt-8 text-[var(--foreground-muted)]">
              Ready to replicate these results?{" "}
              <Link href="/signup" className="font-medium text-[var(--color-accent)] hover:underline">
                Start free on LeadFormHub
              </Link>{" "}
              or see{" "}
              <Link href="/pricing" className="font-medium text-[var(--color-accent)] hover:underline">
                pricing
              </Link>
              .
            </p>
          </Container>
        </section>

        {faqs?.length ? (
          <section className="border-t border-[var(--border-subtle)] bg-white py-14 sm:py-16">
            <Container size="narrow" className="px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-bold text-[var(--foreground-heading)] text-center">FAQ</h2>
              <dl className="mt-8 space-y-6">
                {faqs.map((item) => (
                  <div key={item.question}>
                    <dt className="font-heading font-semibold text-[var(--foreground-heading)]">{item.question}</dt>
                    <dd className="mt-2 text-[var(--foreground-muted)]">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </Container>
          </section>
        ) : null}

        <BlogRelatedPosts slug={slug} heading="More case studies & guides" />
        <BlogInternalLinks slug={slug} />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
