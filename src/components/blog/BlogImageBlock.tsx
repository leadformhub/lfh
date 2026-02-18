import { cn } from "@/lib/utils";
import { BlogIllustration } from "./BlogIllustration";
import type { BlogIllustrationVariant } from "./BlogIllustration";

type BlogImageBlockProps = {
  variant: BlogIllustrationVariant;
  size?: "sm" | "md" | "lg";
  caption?: string;
  className?: string;
  /** "featured" = hero-style full-width card; "section" = inline with content */
  layout?: "featured" | "section";
};

export function BlogImageBlock({
  variant,
  size = "lg",
  caption,
  className,
  layout = "section",
}: BlogImageBlockProps) {
  if (layout === "featured") {
    return (
      <figure className={cn("my-10 sm:my-12", className)}>
        <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--background-alt)] p-6 sm:p-10 shadow-[var(--shadow-sm)]">
          <BlogIllustration variant={variant} size={size} className="mx-auto" />
        </div>
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-[var(--foreground-muted)]">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={cn("my-8", className)}>
      <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--background-alt)] p-6 shadow-[var(--shadow-xs)]">
        <BlogIllustration variant={variant} size={size} className="mx-auto" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-[var(--foreground-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
