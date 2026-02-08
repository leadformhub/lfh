import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

/**
 * Blog — Long-tail SEO: what is a lead capture form, how to create high converting forms,
 * lead generation best practices.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Blog | What Is a Lead Capture Form & Lead Generation Best Practices | LeadFormHub",
  description:
    "Learn what a lead capture form is, how to create high-converting forms, and lead generation best practices. Tips for form builder users and marketing teams.",
  path: "/blog",
});

const blogFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a lead capture form?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A lead capture form is a web form designed to collect contact information from potential customers or leads. It typically captures name, email, and phone so businesses can follow up. Lead capture forms are used for demo requests, newsletters, event signups, and gated content.",
      },
    },
    {
      "@type": "Question",
      name: "How do you create high-converting lead generation forms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use a form builder with clear fields, minimal friction, optional verification (e.g. OTP), and mobile-friendly design. Keep the form short, use descriptive CTAs, and connect it to a lead management dashboard so you can act on submissions quickly.",
      },
    },
  ],
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogFaqSchema) }} />
      <Navbar />
      <main>
        <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 text-center sm:px-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              What is a lead capture form? Tips and best practices
            </h1>
            <p className="mt-4 text-lg text-[var(--foreground-muted)]">
              Learn how to create high-converting lead generation forms and apply lead generation best practices with our form builder.
            </p>
          </Container>
        </section>
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-elevated)] py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <p className="text-center text-[var(--foreground-muted)]">
              New articles on lead capture forms and how to create high-converting forms coming soon. Compare our lead capture form builder:{" "}
              <Link href="/typeform-alternative" className="font-medium text-[var(--color-accent)] hover:underline">Typeform alternative</Link>
              {" · "}<Link href="/google-forms-alternative" className="font-medium text-[var(--color-accent)] hover:underline">Google Forms alternative</Link>
              {" · "}<Link href="/zoho-forms-alternative" className="font-medium text-[var(--color-accent)] hover:underline">Zoho Forms alternative</Link>.
              {" "}Explore our{" "}
              <Link href="/features" className="font-medium text-[var(--color-accent)] hover:underline">form builder features</Link>
              {" "}and{" "}
              <Link href="/pricing" className="font-medium text-[var(--color-accent)] hover:underline">pricing</Link>.
            </p>
          </Container>
        </section>
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
