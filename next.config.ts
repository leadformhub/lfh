import type { NextConfig } from "next";
import {
  APEX_BLOG_PREFIX_MISTAKE_REDIRECTS,
  buildBlogSubdomainNextRedirects,
} from "./src/lib/blog-subdomain-redirects";
import { OFF_TOPIC_BLOG_REDIRECTS } from "./src/lib/off-topic-blog-redirects";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      // Canonical host: non-www apex (301). Also enforced in middleware + vercel.json.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.leadformhub.com" }],
        destination: "https://leadformhub.com/:path*",
        permanent: true,
      },
      // blog.leadformhub.com → leadformhub.com/blog (all posts + legacy slug renames).
      ...buildBlogSubdomainNextRedirects(),
      { source: "/google-forms-alternative", destination: "/blog/google-forms-alternative", permanent: true },
      ...Object.entries(APEX_BLOG_PREFIX_MISTAKE_REDIRECTS).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      // Legacy subscribe URLs → canonical pricing (fixes GSC "Page with redirect")
      { source: "/subscribe/free", destination: "/pricing", permanent: true },
      { source: "/subscribe/basic", destination: "/pricing", permanent: true },
      { source: "/subscribe/pro", destination: "/pricing", permanent: true },
      { source: "/support_tickets/create", destination: "/support", permanent: true },
      ...Object.entries(OFF_TOPIC_BLOG_REDIRECTS)
        .filter(([source]) => source.startsWith("/blog/"))
        .map(([source, destination]) => ({
          source,
          destination,
          permanent: true,
        })),
    ];
  },
};

export default nextConfig;
