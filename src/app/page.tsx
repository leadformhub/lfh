/**
 * HOME PAGE — SEO: lead capture form builder, online form builder, lead generation forms.
 */
import type { Metadata } from "next";
import {
  Navbar,
  Hero,
  SocialProof,
  Problem,
  Solution,
  MidPageCTA,
  WhyLeadFormHub,
  Features,
  ProductScreenshots,
  HowItWorks,
  UseCases,
  Integrations,
  PricingPreview,
  CTA,
  FAQ,
  Footer,
} from "@/components/landing";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Online Form Builder with Unlimited Submissions",
  description:
    "Build unlimited online forms in minutes. Collect leads, receive instant email notifications, and manage submissions from one simple dashboard.",
  path: "/",
});

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "LeadFormHub",
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
      reviewBody: "Managing multiple client campaigns from one branded hub changed our workflow. Clean URLs, verified leads, and INR payments made this an easy choice.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Anitha Krishnan" },
      reviewBody: "We replaced spreadsheets and scattered tools with one dashboard. Setup was fast, and we had a professional form live the same day.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Solution />
        <MidPageCTA />
        <WhyLeadFormHub />
        <Features />
        <ProductScreenshots />
        <HowItWorks />
        <UseCases />
        <Integrations />
        <PricingPreview />
        <CTA />
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}
