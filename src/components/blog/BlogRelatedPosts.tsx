import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getBlogPath, getRelatedPosts } from "@/lib/blog-seo";

type BlogRelatedPostsProps = {
  slug: string;
  heading?: string;
};

export function BlogRelatedPosts({
  slug,
  heading = "Related guides",
}: BlogRelatedPostsProps) {
  const related = getRelatedPosts(slug);

  return (
    <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-10" aria-labelledby="related-posts-heading">
      <Container size="narrow" className="px-4 sm:px-6">
        <h2
          id="related-posts-heading"
          className="font-heading text-lg font-semibold text-[var(--foreground-heading)]"
        >
          {heading}
        </h2>
        <ul className="mt-4 space-y-2">
          {related.map((post) => (
            <li key={post.slug}>
              <Link
                href={getBlogPath(post.slug)}
                className="text-base font-medium text-[var(--color-accent)] hover:underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
