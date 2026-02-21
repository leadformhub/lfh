import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { BlogImageBlock } from "@/components/blog/BlogImageBlock";
import { BlogInternalLinks } from "@/components/blog/BlogInternalLinks";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Kaizen vs Kanban: Improving Your Lead Capture and Form Workflow",
  description:
    "Kaizen (continuous improvement) vs Kanban (visual workflow): how each approach can improve your lead capture forms, follow-up process, and conversion rates.",
  path: "/blog/kaizen-vs-kanban",
});

export default function KaizenVsKanbanPage() {
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
                Kaizen vs Kanban: Improving Your Lead Capture and Form Workflow
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Two lean methodologies—Kaizen (continuous improvement) and Kanban (visual workflow)—can help you optimise lead capture forms and follow-up. Here&apos;s how they differ and when to use each.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                What is Kaizen?
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Kaizen is the Japanese concept of continuous, incremental improvement. Instead of big overhauls, you make small changes often—test, learn, adjust. For lead capture, that means tweaking form fields, headlines, or CTAs based on what you see in your data. Did fewer people complete the form after you added a field? Remove it. Did a clearer CTA increase submissions? Keep it.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                What is Kanban?
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Kanban is a visual workflow system: work flows through columns (e.g. New → Contacted → Qualified → Won). For lead capture, that means a dashboard where you can see leads by stage—who just submitted, who you&apos;ve called, who&apos;s qualified. It reduces bottlenecks and makes it obvious when leads are stuck.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Kaizen vs Kanban: how they work together
              </h2>
              <BlogImageBlock variant="pipeline" caption="Visual workflow helps you see where leads get stuck." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                You don&apos;t have to choose. Use Kanban to visualise your lead pipeline and spot where follow-up slows down. Use Kaizen to improve the forms and processes that feed that pipeline—fewer fields, better notifications, faster response. A <Link href="/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">form builder with a single dashboard</Link> gives you the Kanban-like view; your willingness to test and refine is the Kaizen part.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Applying this to your lead capture
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Start with Kanban: put all form submissions in one place and track them by status. Then apply Kaizen: each month, make one small change—shorter form, different CTA, or faster notification—and measure the impact. For more on optimising forms, see our <Link href="/blog/how-to-increase-form-submissions" className="font-medium text-[var(--color-accent)] hover:underline">how to increase form submissions</Link> and <Link href="/blog/how-to-follow-up-on-leads-quickly" className="font-medium text-[var(--color-accent)] hover:underline">how to follow up on leads quickly</Link>.
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
