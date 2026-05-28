import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getBlogPath, INDEX_PRIORITY_SLUGS } from "@/lib/blog-seo";
import { BLOG_POSTS } from "@/lib/blog";

const GUIDE_LABELS: Record<string, string> = {
  "how-to-reduce-fake-leads-from-forms": "Stop fake leads from forms",
  "best-form-builder-tools-for-lead-generation-forms": "Best form builders for lead gen",
  "set-up-lead-generation-form-without-coding": "Set up a lead form (no code)",
  "best-lead-form-fields-for-high-conversion": "High-converting form fields",
  "lead-form-landing-page-checklist-2026": "Landing page checklist 2026",
  "unlimited-form-submissions-why-it-matters": "Unlimited form submissions",
};

function getGuideTitle(slug: string): string {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  return GUIDE_LABELS[slug] ?? post?.title ?? slug;
}

type BlogGuidesStripProps = {
  /** Short context line for the parent page (features, pricing, faq). */
  context: string;
};

export function BlogGuidesStrip({ context }: BlogGuidesStripProps) {
  return (
    <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-12 sm:py-14" aria-labelledby="blog-guides-heading">
      <Container size="default" className="px-4 sm:px-6">
        <h2
          id="blog-guides-heading"
          className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl"
        >
          Lead capture guides
        </h2>
        <p className="mt-2 max-w-2xl text-base text-[var(--foreground-muted)]">{context}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INDEX_PRIORITY_SLUGS.map((slug) => (
            <li key={slug}>
              <Link
                href={getBlogPath(slug)}
                className="flex min-h-[44px] items-center rounded-lg border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-accent)] shadow-sm transition-colors hover:border-[var(--color-accent)]/40 hover:bg-[var(--background)]"
              >
                {getGuideTitle(slug)}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--foreground-muted)]">
          <Link href="/blog" className="font-medium text-[var(--color-accent)] hover:underline">
            View all blog articles
          </Link>
        </p>
      </Container>
    </section>
  );
}
