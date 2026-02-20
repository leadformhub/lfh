import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Internal linking: each blog links back to homepage and unlimited page
 * so authority flows both ways for SEO.
 */
export function BlogInternalLinks() {
  return (
    <section className="border-t border-[var(--border-subtle)] bg-white py-8">
      <Container size="narrow" className="px-4 sm:px-6">
        <p className="text-sm text-[var(--foreground-muted)]">
          LeadFormHub:{" "}
          <Link href="/" className="font-medium text-[var(--color-accent)] hover:underline">
            Homepage
          </Link>
          {" · "}
          <Link href="/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">
            Free online form builder with unlimited submissions
          </Link>
        </p>
      </Container>
    </section>
  );
}
