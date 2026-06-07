import { formatBlogDate, getBlogPostBySlug } from "@/lib/blog";

type BlogArticleDatesProps = {
  slug: string;
  authorName?: string;
  showPublished?: boolean;
  className?: string;
};

export function BlogArticleDates({
  slug,
  authorName,
  showPublished = true,
  className = "hero-content mt-4 text-sm text-[var(--foreground-muted)]",
}: BlogArticleDatesProps) {
  const post = getBlogPostBySlug(slug);
  if (!post) return null;

  const published = formatBlogDate(post.publishedAt);
  const updated = formatBlogDate(post.updatedAt);

  return (
    <p className={className}>
      {authorName && (
        <>
          By <span className="font-medium text-[var(--foreground)]">{authorName}</span>
          {" · "}
        </>
      )}
      {showPublished && <>Published {published} · </>}
      <span className="font-medium text-[var(--foreground)]">Last updated:</span> {updated}
    </p>
  );
}
