import Link from "next/link";
import { Container } from "@/components/ui/Container";

const COMPANY_PAGES = [
  { href: "/free-online-form-builder-unlimited", label: "Free unlimited form builder" },
  { href: "/about", label: "About LeadFormHub" },
  { href: "/integrations", label: "Integrations & API" },
  { href: "/knowledge-base", label: "Knowledge base" },
  { href: "/support", label: "Support" },
] as const;

type CompanyPagesStripProps = {
  heading?: string;
  intro?: string;
};

export function CompanyPagesStrip({
  heading = "Product & support",
  intro = "Company pages with setup guides, integration options, and direct support.",
}: CompanyPagesStripProps) {
  return (
    <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-14" aria-labelledby="company-pages-heading">
      <Container size="default" className="px-4 sm:px-6">
        <h2 id="company-pages-heading" className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
          {heading}
        </h2>
        <p className="mt-2 max-w-2xl text-base text-[var(--foreground-muted)]">{intro}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COMPANY_PAGES.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="flex min-h-[44px] items-center rounded-lg border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-accent)] shadow-sm transition-colors hover:border-[var(--color-accent)]/40"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
