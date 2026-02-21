import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { BlogImageBlock } from "@/components/blog/BlogImageBlock";
import { BlogInternalLinks } from "@/components/blog/BlogInternalLinks";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Drag and Drop Form Builder: Create Lead Capture Forms Without Coding",
  description:
    "What to look for in a drag and drop form builder for lead capture. Build contact, enquiry, and registration forms in minutes—no coding required.",
  path: "/blog/drag-and-drop-form-builder",
});

export default function DragAndDropFormBuilderPage() {
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
                Drag and Drop Form Builder: Create Lead Capture Forms Without Coding
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                A drag and drop form builder lets you add fields, reorder them, and customise forms visually—no developer needed. Here&apos;s what to look for when choosing one for lead capture.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Why use a drag and drop form builder?
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Building forms with code is slow and requires a developer. A drag and drop form builder gives you a visual editor where you add text fields, dropdowns, checkboxes, and more by dragging them onto the canvas. You can reorder fields, adjust labels, and publish in minutes. That&apos;s ideal for small teams, marketers, and business owners who need to create contact forms, enquiry forms, or registration forms without waiting for dev resources.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                What to look for in a drag and drop form builder
              </h2>
              <BlogImageBlock variant="lead-capture" caption="Visual form editor—no code required." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                <strong>Ease of use.</strong> The editor should feel intuitive. If you can&apos;t add a field or change the order in under a minute, it&apos;s not truly drag and drop. <strong>Lead capture features.</strong> For lead gen, you need more than just fields—instant email notifications, optional phone verification (OTP), and a single dashboard for all submissions. <strong>Mobile-friendly output.</strong> Forms built in the editor should render well on phones. <strong>Shareable links and embed code.</strong> You need a link to share and code to embed on your site.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Common use cases
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Contact forms, demo request forms, event registration, enquiry forms, and feedback forms—all can be built with a drag and drop form builder. The key is to keep fields minimal for lead capture: name, email, phone, and a short message or dropdown for interest. For more on best practices, see our <Link href="/blog/what-is-a-lead-capture-form" className="font-medium text-[var(--color-accent)] hover:underline">lead capture form definition</Link> and <Link href="/blog/free-enquiry-form-builder-without-coding" className="font-medium text-[var(--color-accent)] hover:underline">free enquiry form builder without coding</Link>.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Getting started
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Choose a <Link href="/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">free online form builder with drag and drop</Link> so you can test it without committing. Create a simple contact form first, share the link, and check that submissions land in one place and that you get instant notifications. Once that works, add more forms for different campaigns or landing pages.
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
