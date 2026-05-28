import Link from "next/link";
import Image from "next/image";
import { Navbar, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildCompanyFaqSchema, buildWebPageBreadcrumbSchema, type CompanyFaqItem } from "@/lib/company-page-seo";
import { SupportForm } from "./SupportForm";

const SUPPORT_FAQS: CompanyFaqItem[] = [
  {
    question: "How fast does LeadFormHub support respond?",
    answer:
      "We aim to reply to support requests within one business day. Billing and outage reports are prioritized. Include your account email and form name so we can trace the issue faster.",
  },
  {
    question: "What should I include in a support request?",
    answer:
      "Share what you expected, what happened instead, and any screenshots or form links. For integration issues, mention the CRM or tool you are connecting and whether the problem is on submit or sync.",
  },
  {
    question: "Where can I find answers before opening a ticket?",
    answer:
      "Start with the knowledge base for step-by-step guides, the FAQ for plan and product questions, or API docs if you are building a custom integration.",
  },
  {
    question: "Can you help with OTP or lead verification setup?",
    answer:
      "Yes. Choose Technical Support and describe which form needs OTP. We can confirm plan eligibility and walk through enabling verification without breaking your conversion flow.",
  },
];

const breadcrumbSchema = buildWebPageBreadcrumbSchema("/support", "Support");
const faqSchema = buildCompanyFaqSchema(SUPPORT_FAQS);

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main>
        <section className="section-padding border-b border-[var(--border-subtle)] bg-white">
          <Container size="narrow" className="px-4 sm:px-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              LeadFormHub Support
            </h1>
            <p className="mt-4 text-lg text-[var(--foreground-muted)]">
              Get help with billing, form setup, OTP verification, integrations, or bugs. Our team reads every request—include enough detail and we can usually unblock you in one reply.
            </p>
          </Container>
        </section>

        <section className="border-b border-[var(--border-subtle)] bg-[var(--background-alt)] py-12">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-semibold text-[var(--foreground-heading)]">When to use support vs self-serve help</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-white p-5">
                <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">Self-serve first</h3>
                <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                  Account setup, creating forms, sharing links, and dashboard basics are covered in our{" "}
                  <Link href="/knowledge-base" className="font-medium text-[var(--color-accent)] hover:underline">
                    knowledge base
                  </Link>
                  . Pricing and plan limits are in the{" "}
                  <Link href="/faq" className="font-medium text-[var(--color-accent)] hover:underline">
                    FAQ
                  </Link>
                  .
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-white p-5">
                <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">Open a ticket when</h3>
                <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                  Submissions fail silently, OTP stops delivering, exports look wrong, or a CRM sync breaks. Developers wiring APIs should also check{" "}
                  <Link href="/api-docs" className="font-medium text-[var(--color-accent)] hover:underline">
                    API docs
                  </Link>{" "}
                  and{" "}
                  <Link href="/integrations" className="font-medium text-[var(--color-accent)] hover:underline">
                    integrations
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-[var(--border-subtle)] bg-white py-12">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-semibold text-[var(--foreground-heading)]">Support use cases we handle often</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--foreground-muted)]">
              <li>Forms not sending email notifications after publish</li>
              <li>OTP SMS or email codes not arriving for Indian numbers</li>
              <li>Embedding a form on WordPress, Webflow, or a custom landing page</li>
              <li>Upgrading plans, invoices, or refund questions</li>
              <li>Exporting leads to CSV or piping data through webhooks (Business plan)</li>
              <li>Agency accounts managing multiple client form hubs</li>
            </ul>
            <figure className="mt-8 overflow-hidden rounded-xl border border-[var(--border-subtle)]">
              <Image
                src="/og.png"
                alt="LeadFormHub dashboard and lead capture overview"
                width={1200}
                height={630}
                className="h-auto w-full"
                priority={false}
              />
              <figcaption className="bg-[var(--background-alt)] px-4 py-2 text-center text-sm text-[var(--foreground-muted)]">
                LeadFormHub centralizes verified leads from every form you publish.
              </figcaption>
            </figure>
          </Container>
        </section>

        <section className="section-padding bg-white">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-xl font-semibold text-[var(--foreground-heading)]">Submit a support request</h2>
            <p className="mt-2 text-[var(--foreground-muted)]">Describe your issue or question. Our team will get back to you as soon as possible.</p>
            <SupportForm />
            <p className="mt-8 text-base text-[var(--foreground-muted)]">
              Learn more about us on the <Link href="/about" className="font-medium text-[var(--color-accent)] hover:underline">about page</Link>.
            </p>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 id="support-faq" className="font-heading text-xl font-semibold text-[var(--foreground-heading)]">
              Support FAQ
            </h2>
            <dl className="mt-6 space-y-6">
              {SUPPORT_FAQS.map((item) => (
                <div key={item.question}>
                  <dt className="font-heading font-semibold text-[var(--foreground)]">{item.question}</dt>
                  <dd className="mt-2 text-[var(--foreground-muted)]">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
