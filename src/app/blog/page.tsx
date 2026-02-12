import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";
import { getPublishedPosts, formatBlogDate } from "@/lib/blog";

/**
 * Blog — Long-tail SEO: lead capture blog, lead generation forms tips, form builder best practices.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Lead Capture Form & Lead Generation Blog | Tips & Best Practices",
  description:
    "Your lead capture blog for lead generation forms tips and form builder best practices. Guides, comparisons, and how-tos to build better forms and capture more leads.",
  path: "/blog",
});

const blogFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a lead capture form?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A lead capture form is a web form designed to collect contact information from potential customers or leads. It typically captures name, email, and phone so businesses can follow up. Lead capture forms are used for demo requests, newsletters, event signups, and gated content.",
      },
    },
    {
      "@type": "Question",
      name: "How do you create high-converting lead generation forms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use a form builder with clear fields, minimal friction, optional verification (e.g. OTP), and mobile-friendly design. Keep the form short, use descriptive CTAs, and connect it to a lead management dashboard so you can act on submissions quickly.",
      },
    },
  ],
};

export default function BlogPage() {
  const posts = getPublishedPosts();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogFaqSchema) }} />
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="blog-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Blog
              </p>
              <h1
                id="blog-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Lead Capture Blog:{" "}
                <span className="hero-highlight">Lead Generation Forms & Best Practices</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Your resource hub for the lead capture form and lead generation forms—definitions, form builder best practices, and comparisons. Explore guides and compare our form builder:{" "}
                <Link href="/blog/typeform-alternative" className="font-medium text-[var(--color-accent)] hover:underline">Typeform alternative</Link>
                {", "}
                <Link href="/blog/google-forms-alternative" className="font-medium text-[var(--color-accent)] hover:underline">Google Forms alternative</Link>
                {", "}
                <Link href="/zoho-forms-alternative" className="font-medium text-[var(--color-accent)] hover:underline">Zoho Forms alternative</Link>.
              </p>
            </div>
          </Container>
        </section>

        {/* Blog listing */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="default" className="px-4 sm:px-6">
            <h2 className="font-heading mb-10 text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Latest articles
            </h2>
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] p-6 transition-all hover:border-[var(--color-accent)]/40 hover:shadow-md"
                  >
                    <time
                      dateTime={post.publishedAt}
                      className="text-sm font-medium text-[var(--color-accent)]"
                    >
                      {formatBlogDate(post.publishedAt)}
                    </time>
                    <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-[var(--foreground-heading)] group-hover:text-[var(--color-accent)]">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm text-[var(--foreground-muted)] line-clamp-3">
                      {post.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] group-hover:gap-2">
                      Read article
                      <svg className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-12 text-center text-[var(--foreground-muted)]">
              More articles on lead capture forms and high-converting forms coming soon.{" "}
              <Link href="/features" className="font-medium text-[var(--color-accent)] hover:underline">Form builder features</Link>
              {" · "}
              <Link href="/pricing" className="font-medium text-[var(--color-accent)] hover:underline">Pricing</Link>
            </p>
          </Container>
        </section>

        <CTA />
        <Footer />
      </main>
    </div>
  );
}
