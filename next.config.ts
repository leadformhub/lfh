import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/typeform-alternative", destination: "/blog/typeform-alternative", permanent: true },
      { source: "/google-forms-alternative", destination: "/blog/google-forms-alternative", permanent: true },
    ];
  },
};

export default nextConfig;
