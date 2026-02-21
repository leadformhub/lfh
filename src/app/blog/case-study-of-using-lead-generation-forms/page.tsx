import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { BlogImageBlock } from "@/components/blog/BlogImageBlock";
import { BlogInternalLinks } from "@/components/blog/BlogInternalLinks";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Case Study: Using Lead Generation Forms to Grow a Small Business",
  description:
    "A real-world case study on how a small business used lead generation forms to capture enquiries, qualify leads, and grow sales without a big marketing budget.",
  path: "/blog/case-study-of-using-lead-generation-forms",
});

export default function CaseStudyLeadGenerationFormsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="article-heading"
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
                id="article-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Case Study: Using Lead Generation Forms to Grow a Small Business
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                How one small business went from scattered enquiries to a structured pipeline by centralising lead capture with simple forms. Real lessons on form design, follow-up, and conversion.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                The challenge: enquiries everywhere, leads nowhere
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Many small businesses start with enquiries coming in via email, phone, social DMs, and walk-ins. Without a single place to capture and track leads, it&apos;s easy to miss follow-ups, lose context, and let hot leads go cold. This case study follows a coaching institute that faced exactly that problem—and how they fixed it with lead generation forms.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                The approach: one enquiry form, one dashboard
              </h2>
              <BlogImageBlock variant="lead-capture" caption="A simple form, one dashboard—no lost leads." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                The team set up a single enquiry form on their website with fields for name, phone, email, and message. They chose a <Link href="/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">form builder with unlimited submissions</Link> so they could drive traffic without hitting caps. Every submission landed in one dashboard, and they turned on instant email notifications so the admissions team could respond within minutes.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                What they learned about form design
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Initially the form had eight fields. Completion was low. They cut it down to four: name, phone, email, and a short &quot;What are you looking for?&quot; field. Submissions went up. They also added optional OTP verification for phone numbers so they could cut down on typos and fake leads—a feature that helped them prioritise callbacks.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Results: faster follow-up, more conversions
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Within a few weeks, the team was responding to most leads within 15 minutes. Having one dashboard meant they could see who had submitted before, avoid duplicate follow-ups, and hand off to the right person. Enrolment from form submissions grew, and they avoided the cost of paid ads by focusing on organic traffic and referral forms.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Takeaways for your business
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                If you&apos;re drowning in scattered enquiries, start with one lead generation form and a single place to see all submissions. Keep fields minimal, add instant notifications, and respond quickly. For more on form best practices, see our <Link href="/blog/what-is-a-lead-capture-form" className="font-medium text-[var(--color-accent)] hover:underline">lead capture form definition</Link> and <Link href="/blog/how-to-follow-up-on-leads-quickly" className="font-medium text-[var(--color-accent)] hover:underline">how to follow up on leads quickly</Link>. To get started, try a <Link href="/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">free online form builder</Link> that fits your needs.
              </p>
            </div>
          </Container>
        </section>
        <BlogInternalLinks />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
