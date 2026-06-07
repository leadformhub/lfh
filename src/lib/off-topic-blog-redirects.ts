/**
 * Retired blog slugs that attracted off-topic search traffic.
 * 301 to on-topic lead capture / form builder content.
 */
export const OFF_TOPIC_BLOG_REDIRECTS: Readonly<Record<string, string>> = {
  "/blog/kaizen-vs-kanban": "/blog/how-to-follow-up-on-leads-quickly",
  "/kaizen-vs-kanban": "/blog/how-to-follow-up-on-leads-quickly",
  "/blog/online-admission-form-creator-for-schools": "/lead-generation-form-builder",
  "/online-admission-form-creator-for-schools": "/lead-generation-form-builder",
  "/blog/online-forms-in-digital-marketing": "/lead-generation-form-builder",
  "/online-forms-in-digital-marketing": "/lead-generation-form-builder",
  "/blog/form-builder-for-small-digital-marketing-agencies": "/lead-generation-form-builder",
  "/form-builder-for-small-digital-marketing-agencies": "/lead-generation-form-builder",
};

/** Blog slugs excluded from listings and sitemap (see OFF_TOPIC_BLOG_REDIRECTS). */
export const OFF_TOPIC_BLOG_SLUGS = new Set(
  Object.keys(OFF_TOPIC_BLOG_REDIRECTS)
    .filter((path) => path.startsWith("/blog/"))
    .map((path) => path.slice("/blog/".length))
);
