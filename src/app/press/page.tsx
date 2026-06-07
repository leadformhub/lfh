import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import {
  DIRECTORY_LISTINGS,
  PRESS_BOILERPLATE,
  PRESS_SHORT_TAGLINE,
} from "@/lib/directory-listings";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Press & Directory Listings | LeadFormHub",
  description:
    "LeadFormHub press kit, product description, and links for SaaS directories—SaaSHub, Product Hunt, G2, Capterra, and review sites.",
  path: "/press",
});

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        <section className="border-b border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-[var(--foreground-heading)]">
              Press &amp; directory listings
            </h1>
            <p className="mt-4 text-lg text-[var(--foreground-muted)]">{PRESS_SHORT_TAGLINE}</p>
            <p className="mt-6 text-[var(--foreground-muted)] leading-relaxed">{PRESS_BOILERPLATE}</p>
            <ul className="mt-8 space-y-2 text-sm text-[var(--foreground-muted)]">
              <li>
                <strong className="text-[var(--foreground-heading)]">Website:</strong>{" "}
                <Link href="/" className="text-[var(--color-accent)] hover:underline">
                  {SITE_URL}
                </Link>
              </li>
              <li>
                <strong className="text-[var(--foreground-heading)]">Contact:</strong>{" "}
                <Link href="/contact" className="text-[var(--color-accent)] hover:underline">
                  leadformhub.com/contact
                </Link>
              </li>
              <li>
                <strong className="text-[var(--foreground-heading)]">Logo:</strong>{" "}
                <Link href="/logo-b1.png" className="text-[var(--color-accent)] hover:underline">
                  logo-b1.png
                </Link>
                {" · "}
                <Link href="/og.png" className="text-[var(--color-accent)] hover:underline">
                  og.png (1200×630)
                </Link>
              </li>
            </ul>
          </Container>
        </section>

        <section className="py-14 sm:py-16">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold text-[var(--foreground-heading)]">
              Directory &amp; review site submissions
            </h2>
            <p className="mt-3 text-[var(--foreground-muted)]">
              Use the boilerplate above when submitting. Run{" "}
              <code className="rounded bg-[var(--neutral-100)] px-1.5 py-0.5 text-sm">npm run seo:directories</code>{" "}
              for a printable checklist in the terminal.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="py-3 pr-4 font-semibold">Directory</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {DIRECTORY_LISTINGS.map((d) => (
                    <tr key={d.name} className="border-b border-[var(--border-subtle)]">
                      <td className="py-3 pr-4 font-medium text-[var(--foreground-heading)]">{d.name}</td>
                      <td className="py-3 pr-4 capitalize text-[var(--foreground-muted)]">{d.status}</td>
                      <td className="py-3">
                        {d.profileUrl ? (
                          <a
                            href={d.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[var(--color-accent)] hover:underline"
                          >
                            View profile
                          </a>
                        ) : (
                          <a
                            href={d.submitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[var(--color-accent)] hover:underline"
                          >
                            Submit listing
                          </a>
                        )}
                        {d.notes ? (
                          <p className="mt-1 text-xs text-[var(--foreground-muted)]">{d.notes}</p>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
