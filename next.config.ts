import type { NextConfig } from "next";
import { buildBlogSubdomainNextRedirects } from "./src/lib/blog-subdomain-redirects";

const nextConfig: NextConfig = {
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
      { source: "/typeform-alternative", destination: "/blog/typeform-alternative", permanent: true },
      { source: "/google-forms-alternative", destination: "/blog/google-forms-alternative", permanent: true },
      // Legacy subscribe URLs → canonical pricing (fixes GSC "Page with redirect")
      { source: "/subscribe/free", destination: "/pricing", permanent: true },
      { source: "/subscribe/basic", destination: "/pricing", permanent: true },
      { source: "/subscribe/pro", destination: "/pricing", permanent: true },
      { source: "/support_tickets/create", destination: "/support", permanent: true },
    ];
  },
};

export default nextConfig;
