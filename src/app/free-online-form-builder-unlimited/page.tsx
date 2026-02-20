import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, ComparisonFAQ, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Online Form Builder With Unlimited Submissions | LeadFormHub",
  description:
    "Create forms with unlimited submissions—no caps, no paywalls. Free online form builder for lead capture, events, and landing pages. Start free, scale without limits.",
  path: "/free-online-form-builder-unlimited",
});

const whyBullets = [
  {
    title: "No response caps",
    desc: "Collect every lead. When traffic spikes or a campaign converts, you don't hit a limit or lose submissions.",
  },
  {
    title: "One dashboard for all forms",
    desc: "Contact, demo request, event signup—all submissions in one place. No juggling tools or quotas.",
  },
  {
    title: "Scale without surprise paywalls",
    desc: "Start free. Grow traffic and submissions without upgrading the day you hit 50 or 100 responses.",
  },
];

const useCases = [
  {
    title: "Lead capture",
    description: "Landing pages, contact forms, demo requests. Capture name, email, phone—no cap on how many people submit.",
  },
  {
    title: "Events & webinars",
    description: "Registration and signup forms that accept every submission. No closing the form early when signups surge.",
  },
  {
    title: "Multiple forms, one tool",
    description: "Run contact, enquiry, and newsletter forms without each one eating into a shared response quota.",
  },
];

const benefitsBullets = [
  {
    title: "Mobile-friendly forms",
    desc: "Most people fill forms on their phone. Ours work on every device—no tiny buttons or broken layouts.",
  },
  {
    title: "Instant email notification",
    desc: "Get notified the moment someone submits so you can follow up quickly. No checking the dashboard by chance.",
  },
  {
    title: "Optional OTP verification",
    desc: "Cut fake and wrong numbers. Enable OTP per form so you only get real, reachable contacts when it matters.",
  },
];

const faqItems = [
  {
    question: "Is there really a free form builder with unlimited submissions?",
    answer:
      "Yes. LeadFormHub's free tier has no cap on the number of submissions. You can create forms and collect as many leads as you need. There may be limits on advanced features (e.g. OTP usage on paid plans); submissions themselves are unlimited.",
  },
  {
    question: "What can I use it for?",
    answer:
      "Lead capture (landing pages, contact forms, demo requests), event and webinar registration, and enquiry forms. Any use case where you want to accept submissions without worrying about monthly caps.",
  },
  {
    question: "Do I need a credit card to start?",
    answer:
      "No. Sign up free, create your forms, and share your link. Upgrade only when you need more OTP verification or advanced features.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LeadFormHub",
  applicationCategory: "BusinessApplication",
  description: "Free online form builder with unlimited submissions. Lead capture, events, contact forms. No caps, no paywalls.",
  url: `${SITE_URL}/free-online-form-builder-unlimited`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

export default function FreeOnlineFormBuilderUnlimitedPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="landing-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Free form builder
              </p>
              <h1
                id="landing-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Free online form builder with{" "}
                <span className="hero-highlight">unlimited submissions</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                No caps. No surprise paywalls. Create forms for lead capture, events, and landing pages—and collect every submission in one place. Start free, scale when you're ready.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="hero-content inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
                >
                  Start Free
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/features"
                  className="hero-content inline-flex h-12 items-center justify-center rounded-xl border-2 border-[var(--border-strong)] bg-white px-6 text-base font-medium text-[var(--foreground-heading)] transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
                >
                  See features
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Why unlimited */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Why unlimited submissions matter
            </h2>
            <ul className="mt-8 space-y-6">
              {whyBullets.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                    <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{b.title}</h3>
                    <p className="mt-1 text-[var(--foreground-muted)]">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Use cases */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl text-center">
              Use cases
            </h2>
            <ul className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
              {useCases.map((uc) => (
                <li
                  key={uc.title}
                  className="rounded-2xl border border-[var(--border-default)] bg-white p-6 transition-shadow hover:shadow-[var(--shadow-md)]"
                >
                  <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{uc.title}</h3>
                  <p className="mt-2 text-base text-[var(--foreground-muted)]">{uc.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* What you get */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              What you get
            </h2>
            <ul className="mt-8 space-y-6">
              {benefitsBullets.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                    <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{b.title}</h3>
                    <p className="mt-1 text-[var(--foreground-muted)]">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8">
              <Link href="/features" className="font-medium text-[var(--color-accent)] hover:underline">
                View all form builder features →
              </Link>
            </p>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] text-center">
              Frequently asked questions
            </h2>
            <ComparisonFAQ items={faqItems} className="mt-10" />
          </Container>
        </section>

        {/* CTA strip */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Get started</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              No submission caps. No credit card required.
            </h2>
            <p className="mt-2 text-[var(--foreground-muted)]">Create your account and your first form in minutes.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">Unlimited submissions</span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">Mobile-friendly</span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">Instant notifications</span>
            </div>
            <Link
              href="/signup"
              className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
            >
              Start Free
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </Container>
        </section>

        <CTA />
        <Footer />
      </main>
    </div>
  );
}
