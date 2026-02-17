import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, PricingPreview, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Lead Capture Software Pricing – Start Free | LeadFormHub",
  description:
    "Lead capture software pricing made simple: transparent monthly plans. Start free, no hidden fees—upgrade for OTP verification, lead limits, and analytics.",
  path: "/pricing",
});

/** Price validity for schema (offers.priceValidUntil). Use end of next year so Google sees a valid date. */
const PRICE_VALID_UNTIL = "2026-12-31";

/** Product image for Merchant/Product schema (absolute URL). Ensure public/og.png exists (e.g. 1200x630). */
const PRODUCT_IMAGE_URL = `${SITE_URL}/og.png`;

/** Return policy for SaaS: cancel within 30 days, free refund (digital product). */
const merchantReturnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "IN",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 30,
  returnFees: "https://schema.org/FreeReturn",
};

/** Digital delivery: no physical shipping, instant access. */
const shippingDetails = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: 0,
    currency: "INR",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 0,
      unitCode: "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 0,
      unitCode: "DAY",
    },
  },
};

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "LeadFormHub",
  description: "Lead capture software with OTP verification. Flexible pricing.",
  image: PRODUCT_IMAGE_URL,
  brand: { "@type": "Brand", name: "LeadFormHub" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "3",
    bestRating: "5",
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Priya Sharma" },
      reviewBody: "OTP verification removed fake and mistyped numbers completely. Our sales team now works only on real prospects, and conversions improved immediately.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Rahul Mehta" },
      reviewBody: "Managing multiple client campaigns from one branded hub changed our workflow. Clean URLs, verified leads, and simple payments made this an easy choice.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Anitha Krishnan" },
      reviewBody: "We replaced spreadsheets and scattered tools with one dashboard. Setup was fast, and we had a professional form live the same day.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
  ],
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      priceValidUntil: PRICE_VALID_UNTIL,
      hasMerchantReturnPolicy,
      shippingDetails,
      description: "3 forms, 50 leads/month, branded subdomain",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "299",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      priceValidUntil: PRICE_VALID_UNTIL,
      hasMerchantReturnPolicy,
      shippingDetails,
      description: "Unlimited forms, 100 OTP/month, OTP verification",
    },
    {
      "@type": "Offer",
      name: "Business",
      price: "999",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      priceValidUntil: PRICE_VALID_UNTIL,
      hasMerchantReturnPolicy,
      shippingDetails,
      description: "1,000 OTP/month, CRM integrations, API",
    },
  ],
};

const trustBullets = [
  {
    title: "Transparent monthly billing",
    desc: "You pay monthly. Clear pricing with no hidden fees. Budget with confidence and scale when you need to.",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Flexible pricing",
    desc: "Multiple payment options supported. Transparent pricing that fits how teams budget.",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Start free, upgrade when ready",
    desc: "No credit card required to begin. Your data and hub stay the same when you upgrade.",
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="pricing-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Pricing
              </p>
              <h1
                id="pricing-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Lead Capture Software Pricing —{" "}
                <span className="hero-highlight">Transparent, no hidden fees.</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Our lead capture software pricing is transparent and simple for business: start free, pay monthly when you upgrade. No hidden fees, no lock-in.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="#pricing"
                  className="btn-base inline-flex h-12 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.35)] active:scale-[0.98]"
                >
                  See plans
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </Link>
                <Link
                  href="/signup"
                  className="btn-base inline-flex h-12 min-h-[44px] items-center justify-center rounded-xl border-2 border-[var(--border-strong)] bg-white px-6 text-base font-medium text-[var(--foreground-heading)] transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
                >
                  Start Free
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Trust strip */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="default" className="px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
                Simple pricing — no subscriptions, no lock-in
              </h2>
              <p className="mt-3 text-[var(--foreground-muted)]">
                You see the plan, the price, and what&apos;s included. Monthly pricing.
              </p>
            </div>
            <ul className="mx-auto mt-10 grid gap-6 sm:grid-cols-3 max-w-4xl">
              {trustBullets.map((item) => (
                <li
                  key={item.title}
                  className="animate-in flex flex-col items-center rounded-xl border border-[var(--border-default)] bg-[var(--neutral-50)]/50 p-6 text-center transition-shadow hover:shadow-[var(--shadow-md)]"
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                    {item.icon}
                  </span>
                  <h3 className="mt-4 font-heading font-semibold text-[var(--foreground-heading)]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">{item.desc}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Pricing plans — PricingPreview */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-12 sm:py-16">
          <Container size="default" className="px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
                Compare Free vs Pro vs Business
              </h2>
              <p className="mt-4 text-[var(--foreground-muted)]">
                Full feature list and limits. Choose the plan that matches your volume and needs.
              </p>
            </div>
          </Container>
        </section>

        <PricingPreview />

        {/* Final CTA strip */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Get started</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Start on the free plan. Upgrade when you&apos;re ready.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {["No credit card required", "Flexible pricing", "Cancel anytime", "All plans include support"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[var(--border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]"
                >
                  {label}
                </span>
              ))}
            </div>
            <Link
              href="/signup"
              className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
            >
              Get Started Free
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <p className="mt-6 text-[var(--foreground-muted)]">
              Questions? See our <Link href="/faq" className="font-medium text-[var(--color-accent)] hover:underline">FAQ</Link>.
            </p>
          </Container>
        </section>

        <CTA />
        <Footer />
      </main>
    </div>
  );
}
