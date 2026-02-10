import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, ComparisonFAQ, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Lead Capture Forms & Form Builder FAQ | LeadFormHub",
  description:
    "Find answers to common questions about lead capture forms, OTP verification, form builder features, pricing, and integrations.",
  path: "/faq",
});

const otpItems = [
  {
    question: "What Is OTP Verification for Leads?",
    answer:
      "OTP verification means the lead confirms their mobile number with a one-time code sent to that number. Only submissions that complete this step are stored as leads. You get reachable, real contacts.",
  },
  {
    question: "Is OTP Verification Mandatory?",
    answer:
      "No. You choose per form. Enable it where lead quality matters most — for example, demo requests or high-value downloads. Leave it off for simple newsletters or low-friction forms.",
  },
  {
    question: "Which Countries and Carriers Are Supported?",
    answer:
      "OTP delivery works for Indian mobile numbers and is expanding. We use reliable providers so most submissions can verify. Check our docs or support for the latest coverage.",
  },
];

const pricingItems = [
  {
    question: "How Does Monthly Pricing Work?",
    answer:
      "You pay monthly in INR for the plan you choose. Clear billing with no hidden fees. Your plan stays active; upgrade or change when your needs change.",
  },
  {
    question: "What Payment Methods Do You Accept?",
    answer:
      "UPI, cards, and net banking via Razorpay. All in INR. No international payment or currency conversion needed for Indian teams.",
  },
  {
    question: "Can I Upgrade or Change Plans Later?",
    answer:
      "Yes. Upgrade when you need more leads, OTP, or integrations. Your hub and data carry over. Downgrade or change options as your needs change.",
  },
];

const securityItems = [
  {
    question: "Where Is Lead Data Stored?",
    answer:
      "Lead data is stored in secure, access-controlled environments. We use infrastructure and practices appropriate for business data.",
  },
  {
    question: "How Is Data Encrypted and Protected?",
    answer:
      "Data in transit and at rest is encrypted. Access is limited and logged. We treat your leads as sensitive business data.",
  },
  {
    question: "Compliance with Indian Data Laws",
    answer:
      "We design and operate with Indian data and privacy expectations in mind. You retain control of your data and can export or delete it when needed.",
  },
];

const setupItems = [
  {
    question: "How Long Does Setup Take?",
    answer:
      "Most teams are live in minutes. Sign up, create a form, and share the link or embed. OTP and extra settings take only a few more steps.",
  },
  {
    question: "Do You Offer Migration or Import Help?",
    answer:
      "We don't run a full migration service today, but export and CSV make it straightforward to move leads into LeadFormHub or out to another tool. Support can guide you.",
  },
  {
    question: "Where Can I Get Support?",
    answer:
      "Support is available via the app and email. Paid plans include priority support. Documentation and FAQ cover most setup and usage questions.",
  },
];

const allFaqItems = [...otpItems, ...pricingItems, ...securityItems, ...setupItems];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const sectionMeta = [
  { title: "OTP Verification", items: otpItems, icon: "otp" },
  { title: "Pricing and Billing", items: pricingItems, icon: "pricing" },
  { title: "Data Security and Privacy", items: securityItems, icon: "security" },
  { title: "Setup and Onboarding", items: setupItems, icon: "setup" },
];

const icons = {
  otp: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  pricing: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  security: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  setup: (
    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="faq-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                FAQ
              </p>
              <h1
                id="faq-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Answers for{" "}
                <span className="hero-highlight">teams and decision-makers</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Common questions about lead capture, OTP verification, pricing, and setup. Clear answers so you can evaluate and adopt with confidence.
              </p>
              <Link
                href="/signup"
                className="hero-content mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
              >
                Get Started Free
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </Container>
        </section>

        {/* FAQ sections with icons */}
        {sectionMeta.map((section, idx) => (
          <section
            key={section.title}
            className={`border-t border-[var(--border-subtle)] ${idx % 2 === 0 ? "bg-white" : "bg-[var(--background-alt)]"} py-16 sm:py-20`}
          >
            <Container size="narrow" className="px-4 sm:px-6">
              <div className="animate-in flex items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                  {icons[section.icon as keyof typeof icons]}
                </span>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
                  {section.title}
                </h2>
              </div>
              <ComparisonFAQ items={section.items} className="mt-8" />
            </Container>
          </section>
        ))}

        {/* CTA strip */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Ready to start?</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Get started in minutes. No credit card required.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">
                OTP verification
              </span>
              <span className="rounded-full border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">
                Flexible pricing
              </span>
              <span className="rounded-full border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]">
                One dashboard
              </span>
            </div>
            <Link
              href="/signup"
              className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
            >
              Get Started Free
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <p className="mt-6 text-[var(--foreground-muted)]">
              <Link href="/pricing" className="font-medium text-[var(--color-accent)] hover:underline">
                See Pricing
              </Link>
            </p>
          </Container>
        </section>

        <CTA />
        <Footer />
      </main>
    </div>
  );
}
