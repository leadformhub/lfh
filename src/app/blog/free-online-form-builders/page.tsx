import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { BlogImageBlock } from "@/components/blog/BlogImageBlock";
import { BlogInternalLinks } from "@/components/blog/BlogInternalLinks";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Online Form Builders: How to Choose One for Lead Capture",
  description:
    "Compare free online form builders for lead capture. What to look for: ease of use, submission limits, instant notifications, and mobile-friendly forms. No coding required.",
  path: "/blog/free-online-form-builders",
});

export default function FreeOnlineFormBuildersPage() {
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
                Free Online Form Builders: How to Choose One for Lead Capture
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Free online form builders let you create contact, enquiry, and registration forms without coding. Here&apos;s what to look for when comparing options for lead capture—limits, notifications, and ease of use.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Why use a free online form builder?
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Small businesses, coaches, agencies, and solopreneurs need to capture leads without hiring a developer or paying for expensive tools. Free online form builders let you create contact forms, enquiry forms, event registration, and demo requests—usually with a drag-and-drop editor or simple field picker. You get a shareable link and embed code, and submissions land in a dashboard or your inbox. Start free, upgrade only when you need more.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                What to compare when choosing free form builders
              </h2>
              <BlogImageBlock variant="lead-capture" caption="A simple form builder gets you live in minutes." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                <strong>Form and submission limits.</strong> Some free tiers cap you at one or two forms and 50–100 submissions per month. Others allow unlimited submissions on the free plan. If you drive traffic from ads or content, check whether the cap fits your expected volume. <strong>Instant notifications.</strong> You need an email when someone submits—otherwise you&apos;ll miss leads. <strong>Mobile-friendly output.</strong> Forms should work well on phones. <strong>Embed and link.</strong> You need a shareable link and embed code. <strong>Lead capture extras.</strong> Optional OTP verification reduces fake numbers; a single dashboard helps you follow up quickly. See our <Link href="/blog/what-is-a-lead-capture-form" className="font-medium text-[var(--color-accent)] hover:underline">lead capture form definition</Link> for best practices.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Use cases: contact, enquiry, registration
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Free online form builders work for contact forms, enquiry forms, event and webinar registration, demo requests, and feedback. The key is to keep fields minimal and match the form to your campaign. For more on specific use cases, see our <Link href="/blog/free-enquiry-form-builder-without-coding" className="font-medium text-[var(--color-accent)] hover:underline">free enquiry form builder</Link>, <Link href="/blog/contact-form-with-instant-email-notification" className="font-medium text-[var(--color-accent)] hover:underline">contact form with instant email notification</Link>, and <Link href="/blog/online-forms-in-digital-marketing" className="font-medium text-[var(--color-accent)] hover:underline">online forms in digital marketing</Link>.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Getting started
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Pick a <Link href="/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">free online form builder with unlimited submissions</Link> so you don&apos;t hit caps as traffic grows. Create a simple contact form first, test it on mobile, and confirm you get instant notifications. Once that works, add more forms for different campaigns or landing pages.
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
