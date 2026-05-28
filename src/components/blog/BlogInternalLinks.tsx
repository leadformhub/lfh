import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getBlogPath, getRelatedPosts } from "@/lib/blog-seo";

type BlogInternalLinksProps = {
  /** Current article slug — used to show contextual related links. */
  slug?: string;
};

/**
 * Sitewide + contextual internal links for blog SEO (homepage, hub, related posts).
 */
export function BlogInternalLinks({ slug }: BlogInternalLinksProps = {}) {
  const related = (slug ? getRelatedPosts(slug) : getRelatedPosts("what-is-a-lead-capture-form")).slice(0, 4);

  return (
    <section className="border-t border-[var(--border-subtle)] bg-white py-8">
      <Container size="narrow" className="px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Explore</p>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          <Link href="/" className="font-medium text-[var(--color-accent)] hover:underline">
            Homepage
          </Link>
          {" · "}
          <Link href="/blog" className="font-medium text-[var(--color-accent)] hover:underline">
            Lead capture blog
          </Link>
          {" · "}
          <Link href="/features" className="font-medium text-[var(--color-accent)] hover:underline">
            Features
          </Link>
          {" · "}
          <Link href="/pricing" className="font-medium text-[var(--color-accent)] hover:underline">
            Pricing
          </Link>
          {" · "}
          <Link href="/about" className="font-medium text-[var(--color-accent)] hover:underline">
            About
          </Link>
          {" · "}
          <Link href="/integrations" className="font-medium text-[var(--color-accent)] hover:underline">
            Integrations
          </Link>
          {" · "}
          <Link href="/knowledge-base" className="font-medium text-[var(--color-accent)] hover:underline">
            Knowledge base
          </Link>
          {" · "}
          <Link href="/support" className="font-medium text-[var(--color-accent)] hover:underline">
            Support
          </Link>
          {" · "}
          <Link
            href="/free-online-form-builder-unlimited"
            className="font-medium text-[var(--color-accent)] hover:underline"
          >
            Unlimited form submissions
          </Link>
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {related.map((post) => (
            <li key={post.slug}>
              <Link href={getBlogPath(post.slug)} className="font-medium text-[var(--color-accent)] hover:underline">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
