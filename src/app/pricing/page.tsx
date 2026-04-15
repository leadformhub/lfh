import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Navbar } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { getPublicPlanPricingPayload } from "@/lib/super-admin-plan-pricing";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing | LeadFormHub",
  description:
    "Choose a LeadFormHub plan to capture more leads, follow up faster, and convert more visitors into paying customers.",
  path: "/pricing",
});

const PRICE_VALID_UNTIL = "2026-12-31";
const PRODUCT_IMAGE_URL = `${SITE_URL}/og.png`;

const merchantReturnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "IN",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 30,
  returnFees: "https://schema.org/FreeReturn",
};

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

const useCases = [
  {
    title: "Real Estate Agents",
    benefit: "Capture more buyer and seller enquiries from ads, property pages, and WhatsApp in one place.",
  },
  {
    title: "Small Businesses",
    benefit: "Turn website visitors into real leads and follow up faster before they choose a competitor.",
  },
  {
    title: "Digital Marketers",
    benefit: "Launch lead forms for clients in minutes and prove campaign ROI with higher conversion rates.",
  },
  {
    title: "Freelancers",
    benefit: "Collect better project briefs and close more clients without chasing incomplete enquiries.",
  },
];

const benefits = [
  "No coding required to launch your first lead form.",
  "Works smoothly with ads, Instagram, and landing pages.",
  "Set up in minutes and start collecting leads today.",
  "Mobile-optimized forms that convert on every device.",
  "Built for lead capture, not generic surveys like Google Forms.",
  "Instant lead alerts help you follow up while intent is hot.",
];

const faqs = [
  {
    q: "Is there a free plan?",
    a: "Yes. You can start with our Free plan and begin capturing leads right away, with no credit card required.",
  },
  {
    q: "Can I upgrade anytime?",
    a: "Yes. Upgrade from Free to Growth or Pro anytime as your lead volume and team needs increase.",
  },
  {
    q: "Do I need coding skills?",
    a: "No. LeadFormHub is built for non-technical users, so you can create and publish forms without code.",
  },
  {
    q: "How do I receive leads?",
    a: "Leads are collected in your dashboard instantly, and you can receive real-time notifications so you can respond quickly.",
  },
  {
    q: "Is this better than Google Forms?",
    a: "For lead generation, yes. LeadFormHub focuses on conversion-ready forms, faster follow-up, and business growth outcomes.",
  },
];

export default async function PricingPage() {
  const { schemaOfferPricesInr } = await getPublicPlanPricingPayload();
  const growthPrice = `₹${schemaOfferPricesInr.pro}`;
  const proPrice = `₹${schemaOfferPricesInr.business}`;

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      popular: false,
      reason: "",
      cta: "Start Free",
      bullets: [
        "Capture your first leads without upfront cost.",
        "Publish forms fast and start getting enquiries today.",
        "Convert website visitors into real opportunities.",
        "Keep all your incoming leads organized in one place.",
      ],
    },
    {
      name: "Growth",
      price: growthPrice,
      period: "/month",
      popular: true,
      reason: "Best for businesses ready to scale lead flow and close more deals.",
      cta: "Get Leads Now",
      bullets: [
        "Capture more leads from high-intent traffic sources.",
        "Convert more visitors into paying customers with optimized forms.",
        "Get instant lead notifications for faster follow-up.",
        "Reduce missed opportunities and respond while interest is high.",
        "Built for predictable business growth month after month.",
      ],
    },
    {
      name: "Pro",
      price: proPrice,
      period: "/month",
      popular: false,
      reason: "",
      cta: "Create Your First Form",
      bullets: [
        "Scale lead capture across multiple campaigns and services.",
        "Improve sales speed with a streamlined lead pipeline.",
        "Support bigger lead volumes without slowing your team.",
        "Turn more ad clicks into revenue-ready conversations.",
        "Ideal for serious growth teams and performance marketers.",
      ],
    },
  ] as const;

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "LeadFormHub",
    description: "Lead generation software for capturing and converting more business leads.",
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
        reviewBody:
          "We started getting better quality leads in week one. Faster follow-up directly improved our close rate.",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Rahul Mehta" },
        reviewBody:
          "LeadFormHub helped us turn more landing page traffic into real customer conversations.",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Anitha Krishnan" },
        reviewBody:
          "The setup was fast, and our team could immediately focus on closing leads instead of managing tools.",
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
        hasMerchantReturnPolicy: merchantReturnPolicy,
        shippingDetails,
        description: "Start capturing leads for free.",
      },
      {
        "@type": "Offer",
        name: "Growth",
        price: String(schemaOfferPricesInr.pro),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        priceValidUntil: PRICE_VALID_UNTIL,
        hasMerchantReturnPolicy: merchantReturnPolicy,
        shippingDetails,
        description: "Most popular plan for growing businesses.",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: String(schemaOfferPricesInr.business),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        priceValidUntil: PRICE_VALID_UNTIL,
        hasMerchantReturnPolicy: merchantReturnPolicy,
        shippingDetails,
        description: "Scale plan for high-volume lead generation.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }} />
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-gradient-to-b from-indigo-50 via-white to-white pt-16 pb-20 sm:pt-20">
          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Pricing</p>
              <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-[var(--foreground-heading)] sm:text-5xl">
                Turn more visitors into leads, and more leads into paying customers.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--foreground-muted)]">
                Choose the plan that matches your growth stage. Start free, launch quickly, and scale lead capture as your business grows.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--color-accent)] px-6 text-base font-semibold text-white shadow-[var(--shadow-cta)] transition hover:bg-[var(--color-accent-hover)]"
                >
                  Start Free
                </Link>
                <Link
                  href="#plans"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--border-default)] bg-white px-6 text-base font-semibold text-[var(--foreground-heading)] transition hover:bg-[var(--neutral-50)]"
                >
                  See Plans
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section id="plans" className="py-14 sm:py-20">
          <Container size="default">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-bold text-[var(--foreground-heading)] sm:text-4xl">
                Pick the plan that helps you grow faster
              </h2>
              <p className="mt-4 text-[var(--foreground-muted)]">
                Every plan is built to help you capture more leads and improve conversion from day one.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border p-6 shadow-sm ${
                    plan.popular
                      ? "border-indigo-300 bg-gradient-to-b from-indigo-50 to-white shadow-lg ring-1 ring-indigo-200"
                      : "border-[var(--border-default)] bg-white"
                  }`}
                >
                  {plan.popular ? (
                    <span className="absolute -top-3 left-5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  ) : null}
                  <h3 className="font-heading text-2xl font-bold text-[var(--foreground-heading)]">{plan.name}</h3>
                  <p className="mt-2 flex items-end gap-2">
                    <span className="font-heading text-4xl font-extrabold text-[var(--foreground-heading)]">{plan.price}</span>
                    <span className="pb-1 text-sm text-[var(--foreground-muted)]">{plan.period}</span>
                  </p>
                  {plan.popular ? <p className="mt-2 text-sm font-medium text-indigo-700">{plan.reason}</p> : null}

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.bullets.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                        <span className="mt-0.5 text-green-600">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/signup"
                    className={`mt-6 inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                      plan.popular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "border border-[var(--border-default)] bg-white text-[var(--foreground-heading)] hover:bg-[var(--neutral-50)]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-14 sm:py-16">
          <Container size="default">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold text-[var(--foreground-heading)]">Who is LeadFormHub for?</h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {useCases.map((item) => (
                <div key={item.title} className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-5">
                  <h3 className="font-heading text-lg font-semibold text-[var(--foreground-heading)]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">{item.benefit}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] py-14 sm:py-16">
          <Container size="default">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold text-[var(--foreground-heading)]">
                Why businesses choose LeadFormHub
              </h2>
            </div>
            <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
              {benefits.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-[var(--border-default)] bg-white px-4 py-3 text-sm font-medium text-[var(--foreground)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-elevated)] py-14 sm:py-16">
          <Container size="default">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Trusted by growing businesses
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-[var(--foreground-heading)]">
                Thousands of leads captured every month
              </h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
              <blockquote className="rounded-xl border border-[var(--border-default)] bg-white p-5 text-sm text-[var(--foreground-muted)]">
                "We doubled our inbound lead quality after switching from basic forms."
                <p className="mt-3 font-semibold text-[var(--foreground-heading)]">Amit, Real Estate Consultant</p>
              </blockquote>
              <blockquote className="rounded-xl border border-[var(--border-default)] bg-white p-5 text-sm text-[var(--foreground-muted)]">
                "Our campaigns now convert better because follow-up is instant."
                <p className="mt-3 font-semibold text-[var(--foreground-heading)]">Neha, Performance Marketer</p>
              </blockquote>
              <blockquote className="rounded-xl border border-[var(--border-default)] bg-white p-5 text-sm text-[var(--foreground-muted)]">
                "I set up in one evening and started getting client enquiries the next day."
                <p className="mt-3 font-semibold text-[var(--foreground-heading)]">Karan, Freelancer</p>
              </blockquote>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] py-14 sm:py-16">
          <Container size="default">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold text-[var(--foreground-heading)]">See LeadFormHub in action</h2>
              <p className="mt-3 text-[var(--foreground-muted)]">
                Place a short demo video directly under the pricing cards to reduce hesitation before checkout.
              </p>
            </div>
            <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/40 p-6">
              <p className="text-sm font-semibold text-indigo-700">Recommended demo content</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--foreground)]">
                <li>Show how quickly a lead form is created and published.</li>
                <li>Show a live lead arriving and instant notification workflow.</li>
                <li>Show how this helps teams respond faster and close more deals.</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Get Leads Now
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border-default)] bg-white px-5 text-sm font-semibold text-[var(--foreground-heading)] hover:bg-[var(--neutral-50)]"
                >
                  Create Your First Form
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-14 sm:py-16">
          <Container size="default">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold text-[var(--foreground-heading)]">Frequently asked questions</h2>
            </div>
            <div className="mx-auto mt-8 max-w-4xl space-y-3">
              {faqs.map((item) => (
                <details key={item.q} className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-4">
                  <summary className="cursor-pointer list-none font-semibold text-[var(--foreground-heading)]">{item.q}</summary>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">{item.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-gradient-to-r from-indigo-50 to-white py-14 sm:py-16">
          <Container size="default" className="text-center">
            <h2 className="font-heading text-3xl font-bold text-[var(--foreground-heading)]">
              Ready to turn traffic into qualified leads?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[var(--foreground-muted)]">
              Start free in minutes and upgrade when you are ready for faster growth.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Start Free
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--border-default)] bg-white px-6 text-sm font-semibold text-[var(--foreground-heading)] hover:bg-[var(--neutral-50)]"
              >
                Create Your First Form
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-default)] bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <Container size="default" className="flex items-center justify-between gap-3">
          <p className="hidden text-sm font-medium text-[var(--foreground-heading)] sm:block">
            Start collecting leads today.
          </p>
          <div className="ml-auto flex gap-2">
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--border-default)] bg-white px-4 text-sm font-semibold text-[var(--foreground-heading)] hover:bg-[var(--neutral-50)]"
            >
              Start Free
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Get Leads Now
            </Link>
          </div>
        </Container>
      </div>

      <div className="h-20" aria-hidden />
      <Footer />
    </div>
  );
}
