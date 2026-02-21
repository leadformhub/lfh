import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { BlogImageBlock } from "@/components/blog/BlogImageBlock";
import { BlogInternalLinks } from "@/components/blog/BlogInternalLinks";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Online Forms in Digital Marketing: Capture Leads at Every Touchpoint",
  description:
    "How online forms fit into digital marketing: landing pages, ads, content, and email. Best practices for lead capture forms that convert.",
  path: "/blog/online-forms-in-digital-marketing",
});

export default function OnlineFormsInDigitalMarketingPage() {
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
                Online Forms in Digital Marketing: Capture Leads at Every Touchpoint
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Online forms are the bridge between your digital marketing—ads, content, email—and your CRM. Here&apos;s how to use them effectively for lead capture, conversion, and follow-up.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Where online forms fit in digital marketing
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Every digital marketing channel needs a way to capture intent. Paid ads send traffic to landing pages with forms. Content marketing uses gated guides or signup forms. Email campaigns link to registration or demo request forms. Social media leads to contact or enquiry forms. The form is where anonymous visitors become known leads—so it has to be simple, trustworthy, and mobile-friendly.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Landing pages and ads
              </h2>
              <BlogImageBlock variant="content-leads" caption="Content plus a clear CTA turns visitors into leads." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                When you run Facebook, Google, or LinkedIn ads, the landing page form is your conversion point. Keep it short—name, email, phone, and maybe one qualifier. Match the form to the ad promise: if the ad says &quot;Get the guide,&quot; the form should say the same. For more, see our <Link href="/blog/lead-capture-form-for-facebook-ads-landing-page" className="font-medium text-[var(--color-accent)] hover:underline">lead capture form for Facebook ads landing page</Link>.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Content and gated resources
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                E-books, checklists, and webinars often use a form before granting access. Ask for email (and sometimes name) in exchange for the resource. Use a form builder that supports instant notifications so you can add new leads to your nurture sequence or CRM right away.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Email and events
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Email campaigns that promote webinars, workshops, or trials need registration forms. Event forms should be minimal—name, email, maybe company or role. Send submissions to one dashboard so your team can confirm and follow up. A <Link href="/blog/form-builder-with-auto-email-response-for-clients" className="font-medium text-[var(--color-accent)] hover:underline">form builder with auto email response</Link> can send a confirmation to the registrant and a notification to your team.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Best practices for online forms in digital marketing
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Keep fields minimal, use clear CTAs, make forms mobile-friendly, and connect them to a single lead dashboard. Use a <Link href="/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">form builder</Link> that gives you branded forms, instant notifications, and optional verification so you capture quality leads at every touchpoint. For more, see <Link href="/blog/how-to-increase-form-submissions" className="font-medium text-[var(--color-accent)] hover:underline">how to increase form submissions</Link>.
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
