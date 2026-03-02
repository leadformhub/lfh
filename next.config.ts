import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
