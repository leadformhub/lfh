import Link from "next/link";
import { Container } from "@/components/ui/Container";

const PRODUCT_LINKS = [
  { href: "/features", label: "Form builder features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/integrations", label: "Integrations" },
  { href: "/knowledge-base", label: "Knowledge base" },
  { href: "/support", label: "Support" },
] as const;

const GUIDE_LINKS = [
  { href: "/blog/unlimited-form-submissions-why-it-matters", label: "Why unlimited submissions matter" },
  { href: "/blog/free-online-form-builders", label: "Compare free form builders" },
  { href: "/blog/best-form-builder-tools-for-lead-generation-forms", label: "Best form builders for lead gen" },
  { href: "/blog/set-up-lead-generation-form-without-coding", label: "Set up a form without coding" },
  { href: "/blog/how-to-reduce-fake-leads-from-forms", label: "Reduce fake leads from forms" },
  { href: "/blog/lead-capture-form-for-facebook-ads-landing-page", label: "Facebook ads lead capture form" },
] as const;

export function LandingPageExploreLinks() {
  return (
    <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-14 sm:py-16" aria-labelledby="explore-links-heading">
      <Container size="narrow" className="px-4 sm:px-6">
        <h2 id="explore-links-heading" className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)]">
          Explore LeadFormHub
        </h2>
        <p className="mt-3 text-[var(--foreground-muted)]">
          Product pages and guides that pair well with a free online form builder—same URL format, no trailing slashes.
        </p>
        <h3 className="mt-8 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Product</h3>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {PRODUCT_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-medium text-[var(--color-accent)] hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="mt-8 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Guides</h3>
        <ul className="mt-3 space-y-2">
          {GUIDE_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-medium text-[var(--color-accent)] hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-[var(--foreground-muted)]">
          <Link href="/" className="font-medium text-[var(--color-accent)] hover:underline">
            Homepage
          </Link>
          {" · "}
          <Link href="/blog" className="font-medium text-[var(--color-accent)] hover:underline">
            Blog
          </Link>
          {" · "}
          <Link href="/about" className="font-medium text-[var(--color-accent)] hover:underline">
            About
          </Link>
        </p>
      </Container>
    </section>
  );
}
