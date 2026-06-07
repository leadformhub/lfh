import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar, ComparisonFAQ, CTA, Footer, LandingPageExploreLinks } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildWebPageBreadcrumbSchema } from "@/lib/company-page-seo";
import { buildPageMetadata, canonicalUrlFromPath } from "@/lib/seo";
import { FREE_PLAN_MARKETING } from "@/lib/plans";

const PAGE_PATH = "/free-online-form-builder-unlimited";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Free Online Form Builder — 3 Forms, 50 Leads/Mo",
    description:
      "Free online form builder: 3 forms, 50 leads/month, no credit card. Lead capture, OTP optional. Upgrade to Pro for unlimited forms & submissions from ₹299/mo.",
    path: PAGE_PATH,
  }),
  alternates: { canonical: "https://leadformhub.com/free-online-form-builder-unlimited" },
};

const breadcrumbSchema = buildWebPageBreadcrumbSchema(PAGE_PATH, "Free form builder");

const whyBullets = [
  {
    title: "Transparent free tier",
    desc: `Start with ${FREE_PLAN_MARKETING.summary}—no credit card. Limits are clear upfront so you know when to upgrade.`,
  },
  {
    title: "One dashboard for all forms",
    desc: "Contact, demo request, event signup—all submissions in one place. No juggling tools or spreadsheets.",
  },
  {
    title: "Unlimited on Pro",
    desc: "When campaigns outgrow 50 leads/month, Pro removes caps on forms and submissions. See pricing before you scale.",
  },
];

const useCases = [
  {
    title: "Lead capture",
    description: "Landing pages, contact forms, demo requests. Capture name, email, and phone on up to 3 forms on the free plan.",
  },
  {
    title: "Events & webinars",
    description: "Registration and signup forms for workshops and webinars. Upgrade to Pro when volume exceeds 50 leads/month.",
  },
  {
    title: "Multiple forms, one tool",
    description: "Run contact, enquiry, and newsletter forms (up to 3 on Free). All submissions appear in one dashboard.",
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
    question: "What does the free plan include?",
    answer:
      "The free plan includes 3 forms and 50 leads per month, plus CSV export, dashboard access, form embed, and instant email notifications. No credit card required to start.",
  },
  {
    question: "When do I need unlimited submissions?",
    answer:
      "If your campaigns regularly exceed 50 leads per month, upgrade to Pro for unlimited forms and unlimited leads. Pro also adds OTP verification, analytics, and team seats.",
  },
  {
    question: "Is LeadFormHub free?",
    answer:
      "Yes. LeadFormHub offers a free tier with 3 forms and 50 leads per month. You can create forms, collect leads, and use the dashboard without paying. Upgrade when you need higher volume or OTP verification.",
  },
  {
    question: "Can I create multiple forms?",
    answer:
      "Yes. The free plan supports up to 3 forms—contact, enquiry, event registration, demo request, and more. Each form gets its own link and embed code; all submissions appear in one dashboard. Pro adds unlimited forms.",
  },
  {
    question: "Is this suitable for small businesses?",
    answer:
      "Yes. The free tier is built for small businesses, solopreneurs, and teams who need lead capture without upfront cost or surprise paywalls. Start free, scale when you're ready. No credit card required to begin.",
  },
  {
    question: "Do I need coding skills?",
    answer:
      "No. You add fields using a visual editor, get a shareable link and embed code, and publish. No HTML, JavaScript, or technical setup. If you can fill in a form, you can build one.",
  },
  {
    question: "What can I use the free form builder for?",
    answer:
      "Lead capture (contact, demo, enquiry forms), event and webinar registration, newsletter signups, and client intake forms. Any use case where you collect contact details. All submissions appear in one dashboard with instant email notification.",
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
  description: `Free online form builder (${FREE_PLAN_MARKETING.summary}). Lead capture with optional OTP. Pro plan adds unlimited forms and submissions.`,
  url: canonicalUrlFromPath(PAGE_PATH),
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

export default function FreeOnlineFormBuilderUnlimitedPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
                Free online form builder —{" "}
                <span className="hero-highlight">{FREE_PLAN_MARKETING.summary}</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Start free with {FREE_PLAN_MARKETING.summary}—no credit card. Most free form tools hide caps until mid-campaign; we state limits upfront. Need more volume? Pro adds unlimited forms and leads from ₹299/month. Compare{" "}
                <Link href="/blog/unlimited-form-submissions-why-it-matters" className="font-medium text-[var(--color-accent)] hover:underline">
                  when unlimited matters
                </Link>{" "}
                and our{" "}
                <Link href="/pricing" className="font-medium text-[var(--color-accent)] hover:underline">
                  transparent pricing
                </Link>
                .
              </p>
              <p className="hero-content mt-4 text-base text-[var(--foreground-muted)]">
                <Link href="/blog/how-to-generate-leads-for-free" className="font-medium text-[var(--color-accent)] hover:underline">
                  Generate leads for free
                </Link>
                {" · "}
                <Link href="/blog/free-online-form-builders" className="font-medium text-[var(--color-accent)] hover:underline">
                  Compare free builders
                </Link>
                {" · "}
                <Link href="/blog/google-forms-alternative" className="font-medium text-[var(--color-accent)] hover:underline">
                  Google Forms alternative
                </Link>
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

        <section className="border-t border-[var(--border-subtle)] bg-white py-14 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Free tier vs Pro: know your limits before you launch
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Submission caps look harmless until a Facebook ad or webinar week sends real volume. LeadFormHub&apos;s free plan gives you {FREE_PLAN_MARKETING.summary}—enough to test and launch. When campaigns scale, Pro removes caps. Read{" "}
              <Link href="/blog/unlimited-form-submissions-why-it-matters" className="font-medium text-[var(--color-accent)] hover:underline">
                why unlimited submissions matter
              </Link>{" "}
              for the full comparison.
            </p>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Coaching centres, agencies, and real-estate teams often start on Free, then move to Pro when lead volume grows. You focus on follow-up speed—not surprise paywalls.
            </p>
            <ul className="mt-8 space-y-4">
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

        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-14 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
              Free plan vs Pro: submission limits compared
            </h2>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Before you publish a campaign, compare what happens when traffic exceeds a free-plan limit. Our{" "}
              <Link href="/blog/best-form-builder-tools-for-lead-generation-forms" className="font-medium text-[var(--color-accent)] hover:underline">
                form builder comparison guide
              </Link>{" "}
              goes deeper on tools; this table focuses on the cap question alone.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="py-3 pr-4 font-semibold text-[var(--foreground-heading)]">Scenario</th>
                    <th className="py-3 pr-4 font-semibold text-[var(--foreground-heading)]">Typical capped builder</th>
                    <th className="py-3 font-semibold text-[var(--foreground-heading)]">LeadFormHub Pro (unlimited)</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--foreground-muted)]">
                  <tr className="border-b border-[var(--border-subtle)]">
                    <td className="py-3 pr-4">Paid ad converts well</td>
                    <td className="py-3 pr-4">Form may lock; leads lost after cap</td>
                    <td className="py-3">Keeps collecting through the spike</td>
                  </tr>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <td className="py-3 pr-4">Three forms, one account</td>
                    <td className="py-3 pr-4">Shared quota; one form eats the limit</td>
                    <td className="py-3 pr-4">Each form independent on volume</td>
                  </tr>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <td className="py-3 pr-4">Webinar registration final week</td>
                    <td className="py-3 pr-4">Risk closing early or upgrading under pressure</td>
                    <td className="py-3 pr-4">Registration stays open</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Need verified phone leads</td>
                    <td className="py-3 pr-4">Often paid add-on</td>
                    <td className="py-3 pr-4">Optional OTP on eligible plans—see <Link href="/features" className="font-medium text-[var(--color-accent)] hover:underline">features</Link></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <figure className="mt-8 overflow-hidden rounded-xl border border-[var(--border-subtle)]">
              <Image
                src="/og.png"
                alt="LeadFormHub dashboard for lead capture forms"
                width={1200}
                height={630}
                className="h-auto w-full"
              />
              <figcaption className="bg-white px-4 py-2 text-center text-sm text-[var(--foreground-muted)]">
                One dashboard for every form—contact, demo, event, and enquiry flows.
              </figcaption>
            </figure>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-14 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl text-center">
              Use cases for the free form builder
            </h2>
            <p className="mt-6 text-center text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Pick the scenario closest to you—then follow the linked guide to launch faster.
            </p>
            <ul className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
              {useCases.map((uc) => (
                <li key={uc.title} className="rounded-2xl border border-[var(--border-default)] bg-[var(--background-alt)] p-6">
                  <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{uc.title}</h3>
                  <p className="mt-2 text-base text-[var(--foreground-muted)]">{uc.description}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 space-y-6 text-[var(--foreground-muted)]">
              <p>
                <strong className="text-[var(--foreground-heading)]">Lead capture & landing pages.</strong> Contact, demo, and enquiry forms on{" "}
                <Link href="/blog/lead-capture-form-for-facebook-ads-landing-page" className="font-medium text-[var(--color-accent)] hover:underline">
                  Facebook ad landing pages
                </Link>{" "}
                or organic traffic need every convert saved. Pair with{" "}
                <Link href="/blog/best-lead-form-fields-for-high-conversion" className="font-medium text-[var(--color-accent)] hover:underline">
                  high-converting field choices
                </Link>{" "}
                and our{" "}
                <Link href="/blog/lead-form-landing-page-checklist-2026" className="font-medium text-[var(--color-accent)] hover:underline">
                  landing page checklist
                </Link>
                .
              </p>
              <p>
                <strong className="text-[var(--foreground-heading)]">Events, webinars, and batches.</strong> Registration spikes in the last 48 hours are normal. See{" "}
                <Link href="/blog/online-registration-form-builder-for-workshops" className="font-medium text-[var(--color-accent)] hover:underline">
                  workshop registration forms
                </Link>{" "}
                and{" "}
                <Link href="/blog/free-form-builder-for-coaching-institutes" className="font-medium text-[var(--color-accent)] hover:underline">
                  coaching institute forms
                </Link>
                .
              </p>
              <p>
                <strong className="text-[var(--foreground-heading)]">Agencies & multi-form setups.</strong> Run separate client forms without one quota blocking another. Wire exports through{" "}
                <Link href="/integrations" className="font-medium text-[var(--color-accent)] hover:underline">
                  integrations
                </Link>{" "}
                when you scale.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-14 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
              What you get on Free and Pro
            </h2>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Submission count is only half the story. You still need mobile layouts, instant alerts, and—when quality matters—verification. Read{" "}
              <Link href="/blog/contact-form-with-instant-email-notification" className="font-medium text-[var(--color-accent)] hover:underline">
                why instant email notification matters
              </Link>{" "}
              and{" "}
              <Link href="/blog/how-to-reduce-fake-leads-from-forms" className="font-medium text-[var(--color-accent)] hover:underline">
                how to cut fake leads
              </Link>
              .
            </p>
            <ul className="mt-8 space-y-4">
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
                View all form builder features
              </Link>
              {" · "}
              <Link href="/blog/drag-and-drop-form-builder" className="font-medium text-[var(--color-accent)] hover:underline">
                Drag-and-drop builder guide
              </Link>
            </p>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-14 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
              Launch in under 15 minutes (no code)
            </h2>
            <ol className="mt-6 list-decimal space-y-4 pl-5 text-[var(--foreground-muted)]">
              <li>
                <Link href="/signup" className="font-medium text-[var(--color-accent)] hover:underline">
                  Sign up free
                </Link>{" "}
                — no credit card. Follow the{" "}
                <Link href="/blog/set-up-lead-generation-form-without-coding" className="font-medium text-[var(--color-accent)] hover:underline">
                  no-code setup guide
                </Link>
                .
              </li>
              <li>Add name, email, phone, and one intent field. Keep it short; see <Link href="/blog/what-is-a-lead-capture-form" className="font-medium text-[var(--color-accent)] hover:underline">lead capture form basics</Link>.</li>
              <li>Share the link on ads or embed on your site. Test once on your phone.</li>
              <li>Turn on email notifications and respond within minutes—<Link href="/blog/how-to-follow-up-on-leads-quickly" className="font-medium text-[var(--color-accent)] hover:underline">speed wins deals</Link>.</li>
              <li>Clone the form for new campaigns; upgrade to Pro when you need unlimited volume.</li>
            </ol>
            <p className="mt-8 text-[var(--foreground-muted)]">
              Stuck? Use the <Link href="/knowledge-base" className="font-medium text-[var(--color-accent)] hover:underline">knowledge base</Link> or{" "}
              <Link href="/support" className="font-medium text-[var(--color-accent)] hover:underline">raise a support request</Link>.
            </p>
          </Container>
        </section>

        <LandingPageExploreLinks />

        {/* FAQ */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
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
              Start free — {FREE_PLAN_MARKETING.summary}
            </h2>
            <p className="mt-2 text-[var(--foreground-muted)]">
              Create your account and your first form in minutes. Upgrade on{" "}
              <Link href="/pricing" className="font-medium text-[var(--color-accent)] hover:underline">pricing</Link> for unlimited forms, unlimited leads, and OTP.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">{FREE_PLAN_MARKETING.summary}</span>
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
