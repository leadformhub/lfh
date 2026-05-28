import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  type BlogFaqItem,
} from "@/lib/blog-seo";

type BlogStructuredDataProps = {
  slug: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  faqs?: BlogFaqItem[];
  extraSchemas?: Record<string, unknown>[];
};

export function BlogStructuredData({
  slug,
  headline,
  description,
  datePublished,
  dateModified,
  faqs,
  extraSchemas = [],
}: BlogStructuredDataProps) {
  const schemas: Record<string, unknown>[] = [
    buildBlogPostingSchema({ slug, headline, description, datePublished, dateModified }),
    buildBreadcrumbSchema(slug, headline),
    ...(faqs?.length ? [buildFaqPageSchema(faqs)] : []),
    ...extraSchemas,
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
