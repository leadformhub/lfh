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
    question: "Is it really unlimited?",
    answer:
      "Yes. On the free tier, there is no cap on the number of submissions. You can collect as many leads as your campaigns bring in. Some advanced features (such as OTP verification) may have usage limits on the free plan; submissions themselves are unlimited.",
  },
  {
    question: "Are there any hidden submission caps?",
    answer:
      "No. There are no hidden caps on form submissions. The free tier is designed so you don't hit a limit and lose leads mid-campaign. If limits apply to other features (e.g. OTP), they're clearly stated in the plan.",
  },
  {
    question: "Can I create multiple forms?",
    answer:
      "Yes. You can create multiple forms—contact, enquiry, event registration, demo request, and more. Each form gets its own link and embed code, and all submissions appear in one dashboard.",
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
              <p className="hero-content mt-4 text-base text-[var(--foreground-muted)]">
                <Link href="/blog/how-to-generate-leads-for-free" className="font-medium text-[var(--color-accent)] hover:underline">
                  Learn how to generate leads for free
                </Link>
                {" · "}
                <Link href="/blog/free-online-form-builders" className="font-medium text-[var(--color-accent)] hover:underline">
                  Compare free form builders
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

        {/* Why unlimited: the problem */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Why unlimited submissions matter
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Many form builders cap submissions at 50, 100, or 500 per month. That sounds fine until you run a campaign that works—and hit the cap. The form stops, you get an upgrade prompt, or submissions get dropped. Your campaign stops right when it matters most.
            </p>
          </Container>
        </section>

        {/* Why unlimited: real impact */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              How submission caps hurt businesses
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              A coaching centre opens batch registration and gets a flood of signups—only to find the form cut off after 50. An agency runs a Facebook ad; the ad performs, but the form hits its cap and leads are lost. Interest is there. The form becomes the bottleneck.
            </p>
          </Container>
        </section>

        {/* Why unlimited: the solution */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Unlimited removes the bottleneck
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Run ads, publish content, and open registrations without wondering when the cap will hit. When traffic spikes, your form keeps accepting submissions. No interruption, no surprise upgrades. Focus on marketing; the form keeps working.
            </p>
          </Container>
        </section>

        {/* Why unlimited: bullets */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Key benefits
            </h2>
            <ul className="mt-6 space-y-4">
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

        {/* Use cases intro + cards */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl text-center">
              Use cases
            </h2>
            <p className="mt-6 text-center text-[var(--foreground-muted)] max-w-2xl mx-auto">
              A free form builder with unlimited submissions fits many scenarios. Lead capture, event registration, or multiple forms—you don&apos;t want a cap to interrupt your workflow.
            </p>
            <ul className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
              {useCases.map((uc) => (
                <li
                  key={uc.title}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--background-alt)] p-6"
                >
                  <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{uc.title}</h3>
                  <p className="mt-2 text-base text-[var(--foreground-muted)]">{uc.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Lead capture use case */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Lead capture
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Contact, demo, and enquiry forms collect name, email, phone. When you run ads or organic traffic, every convert is a lead. A 50–100 submission cap means you might stop right when the campaign peaks. Unlimited lets you capture all of them.
            </p>
          </Container>
        </section>

        {/* Events & webinars use case */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Events & webinars
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Registration forms need to stay open until the event. Signups often spike in the final days. A limited tier forces you to close early, upgrade under pressure, or lose registrations. Unlimited lets you accept every signup.
            </p>
          </Container>
        </section>

        {/* Multiple forms use case */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Multiple forms, one tool
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Contact, enquiry, newsletter, demo request. If all share one response quota, one popular form can use up the limit and block others. Unlimited lets each form operate independently—no rationing.
            </p>
          </Container>
        </section>

        {/* Who it's for: solopreneurs & small biz */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Who it&apos;s for
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Built for solopreneurs, freelancers, coaches, consultants, and small business owners who need lead capture without caps or surprise costs. You need something you can set up yourself, share quickly, and rely on when traffic grows.
            </p>
          </Container>
        </section>

        {/* Who it's for: education & agencies */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Coaching, schools, and agencies
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Coaching centres use forms for batch registration and trial signups; signups surge when a batch opens. Schools need admission and feedback forms with seasonal spikes. Agencies need forms that scale with ad spend.
            </p>
          </Container>
        </section>

        {/* Who it's for: real estate & startups */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Real estate, freelancers, startups
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Contact and enquiry forms capture interest. A viral post or referral can bring a wave of enquiries. Startups testing content or ads need forms that won&apos;t block growth. Unlimited means you can experiment without the form becoming the constraint.
            </p>
          </Container>
        </section>

        {/* Form types: contact & enquiry */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Form types you can create
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Contact forms: name, email, phone, message. Demo and trial forms add qualifiers like company or role. Enquiry forms collect what the visitor wants and how to reach them. All benefit from unlimited submissions.
            </p>
          </Container>
        </section>

        {/* Form types: events & newsletter */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Events, newsletter, client intake
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Event registration asks for name, email, sometimes phone. Newsletter and waitlist forms are simpler—email and name. Client intake forms collect goals, background, timeline. With a visual editor, add fields, get a link and embed, and publish. No coding.
            </p>
          </Container>
        </section>

        {/* What you get intro */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              What you get
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Beyond unlimited submissions, you need features that make lead capture practical: mobile-friendly forms, instant notifications, and optional OTP verification. Here&apos;s what matters.
            </p>
          </Container>
        </section>

        {/* What you get: bullets */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <ul className="space-y-4">
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

        {/* Mobile & notifications */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Mobile-friendly and instant notifications
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Most people fill forms on phones. Buttons and fields must be easy to tap; layout should adapt. Instant email notification means you get an alert on each submission—no checking the dashboard by chance. Speed matters for conversion.
            </p>
          </Container>
        </section>

        {/* Choosing criteria 1 */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              What makes a good free form builder
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Check submission limits: per form or total? What happens when you hit the cap? Ease of use: can you create a form in under 10 minutes? Email notification and a single dashboard for all forms should be included on the free tier.
            </p>
          </Container>
        </section>

        {/* Choosing criteria 2 */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Link, embed, and mobile
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              You need a shareable link and embed code. Forms should render well on phones—test on a real device. Custom domains or removing &quot;Powered by&quot; may be paid options; the free tier should give you a working link and embed.
            </p>
          </Container>
        </section>

        {/* How to get started: signup */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              How to get started
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Sign up (no credit card), create a form, and add fields. Use the visual editor to add text, email, phone, or dropdown fields. Set labels and required fields. Give the form a title and optional description.
            </p>
          </Container>
        </section>

        {/* How to get started: share */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Share and notify
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Get the shareable link for email, social, or ads. Use the embed code for your website. Turn on email notification. Test the form yourself and confirm the submission lands in the dashboard.
            </p>
          </Container>
        </section>

        {/* How to get started: scale */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Create more forms
            </h2>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Create contact, enquiry, and event forms from one dashboard. With unlimited submissions, focus on driving traffic and following up. The form will keep working.
            </p>
          </Container>
        </section>

        {/* Related resources */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Related resources
            </h2>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Learn more about lead capture and form building from our blog:
            </p>
            <ul className="mt-6 space-y-3">
              <li>
                <Link href="/blog/what-is-a-lead-capture-form" className="font-medium text-[var(--color-accent)] hover:underline">
                  What is a lead capture form? Definition & best practices
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-increase-form-submissions" className="font-medium text-[var(--color-accent)] hover:underline">
                  How to increase form submissions
                </Link>
              </li>
              <li>
                <Link href="/blog/contact-form-with-instant-email-notification" className="font-medium text-[var(--color-accent)] hover:underline">
                  Contact form with instant email notification
                </Link>
              </li>
              <li>
                <Link href="/blog/drag-and-drop-form-builder" className="font-medium text-[var(--color-accent)] hover:underline">
                  Drag and drop form builder: create forms without coding
                </Link>
              </li>
            </ul>
          </Container>
        </section>

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
