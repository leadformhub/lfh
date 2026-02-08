import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "API & Webhooks | LeadFormHub",
  description:
    "LeadFormHub API and webhooks documentation. Integrate forms, submit leads, and receive support ticket replies via HTTP APIs and webhooks.",
  path: "/api-docs",
});

const BASE_URL = "https://leadformhub.com";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-24">
          <Container size="narrow" className="px-4 sm:px-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              API & Webhooks
            </h1>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Integrate with LeadFormHub using our HTTP API and webhooks. Base URL:{" "}
              <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5 text-sm">{BASE_URL}</code>
            </p>

            <nav className="mt-8 flex flex-wrap gap-4 border-b border-[var(--border-subtle)] pb-6">
              <a href="#api" className="text-sm font-medium text-[var(--color-accent)] hover:underline">
                API
              </a>
              <a href="#webhooks" className="text-sm font-medium text-[var(--color-accent)] hover:underline">
                Webhooks
              </a>
            </nav>

            {/* API section */}
            <section id="api" className="scroll-mt-24 pt-8">
              <h2 className="font-heading text-2xl font-semibold text-[var(--foreground)]">API</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Dashboard endpoints (forms, leads, export) require a logged-in session (cookies). The lead submission
                endpoint is public and needs no authentication.
              </p>
              <ul className="mt-4 list-inside list-disc space-y-2 text-[var(--foreground-muted)]">
                <li>
                  <strong className="text-[var(--foreground)]">Submit lead (public):</strong>{" "}
                  <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5 text-sm">
                    POST {BASE_URL}/api/leads/submit
                  </code>{" "}
                  — send <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5 text-sm">formId</code> and{" "}
                  <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5 text-sm">data</code> (field values).
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Forms:</strong> List, create, get, update, update schema,
                  delete — under <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5 text-sm">
                    /api/forms
                  </code>
                  .
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Leads:</strong> List, get one, delete, export (CSV/Excel)
                  — under <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5 text-sm">/api/leads</code>.
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Support:</strong> Create and list support requests, get
                  thread, post replies — under{" "}
                  <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5 text-sm">/api/support-requests</code>.
                  Staff can post replies with <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5 text-sm">
                    Authorization: Bearer &lt;SUPPORT_API_KEY&gt;
                  </code>
                  .
                </li>
              </ul>
              <p className="mt-6 text-base text-[var(--foreground-muted)]">
                Full request/response shapes, authentication details, and error codes are in the API & Webhooks
                documentation (<code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5">docs/API-AND-WEBHOOKS.md</code> in the repository).
              </p>
            </section>

            {/* Webhooks section */}
            <section id="webhooks" className="scroll-mt-24 pt-12">
              <h2 className="font-heading text-2xl font-semibold text-[var(--foreground)]">Webhooks</h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Send inbound email replies to record them in support ticket threads.
              </p>
              <div className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4">
                <p className="font-mono text-sm text-[var(--foreground)]">
                  POST {BASE_URL}/api/support-requests/inbound
                </p>
                <p className="mt-2 text-base text-[var(--foreground-muted)]">
                  Auth: header <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5">x-inbound-secret</code> or{" "}
                  <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5">Authorization: Bearer &lt;secret&gt;</code>.
                  Body: <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5">from</code>,{" "}
                  <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5">subject</code> (must contain e.g.{" "}
                  <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5">#LFH-000006</code>),{" "}
                  <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5">text</code> (or <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5">html</code>).
                </p>
              </div>
              <p className="mt-6 text-base text-[var(--foreground-muted)]">
                Configure your email provider (SendGrid, Mailgun) or automation (Zapier, Make) to POST to this URL. See{" "}
                <Link href="/support" className="font-medium text-[var(--color-accent)] hover:underline">
                  Raise Support Request
                </Link>{" "}
                and the repo doc{" "}
                <code className="rounded bg-[var(--border-subtle)] px-1.5 py-0.5">docs/support-inbound-email.md</code> for
                setup steps.
              </p>
            </section>

            <p className="mt-12 text-base text-[var(--foreground-muted)]">
              Need help? <Link href="/contact" className="font-medium text-[var(--color-accent)] hover:underline">Contact us</Link> or{" "}
              <Link href="/support" className="font-medium text-[var(--color-accent)] hover:underline">raise a support request</Link>.
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
