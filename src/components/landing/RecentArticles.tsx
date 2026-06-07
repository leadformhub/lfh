import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getBlogPath, INDEX_PRIORITY_SLUGS } from "@/lib/blog-seo";
import { BLOG_POSTS, formatBlogDate } from "@/lib/blog";

export function RecentArticles() {
  const posts = INDEX_PRIORITY_SLUGS.map((slug) => BLOG_POSTS.find((p) => p.slug === slug)).filter(
    (p): p is (typeof BLOG_POSTS)[number] => Boolean(p)
  );

  return (
    <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20" aria-labelledby="recent-articles-heading">
      <Container size="default" className="px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">From the blog</p>
          <h2
            id="recent-articles-heading"
            className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl"
          >
            Recent articles on lead capture
          </h2>
          <p className="mt-3 text-base text-[var(--foreground-muted)]">
            Practical guides on form builders, fake leads, landing pages, and scaling submissions.
          </p>
        </div>
        <ul className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={getBlogPath(post.slug)}
                className="group flex h-full flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] p-5 transition-all hover:border-[var(--color-accent)]/40 hover:shadow-md"
              >
                <time dateTime={post.updatedAt} className="text-sm font-medium text-[var(--color-accent)]">
                  Updated {formatBlogDate(post.updatedAt)}
                </time>
                <h3 className="mt-2 font-heading text-base font-semibold leading-snug text-[var(--foreground-heading)] group-hover:text-[var(--color-accent)]">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-[var(--foreground-muted)] line-clamp-2">{post.description}</p>
                <span className="mt-3 text-sm font-medium text-[var(--color-accent)]">Read guide →</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center">
          <Link href="/blog" className="text-base font-medium text-[var(--color-accent)] hover:underline">
            Browse all blog posts
          </Link>
        </p>
      </Container>
    </section>
  );
}
