import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Redirects run before the locale proxy, so each language is written out.
  async redirects() {
    return ["", "/en", "/es"].map((prefix) => ({ source: `${prefix}/docs/editor-and-git`, destination: `${prefix}/docs/editor`, permanent: true }));
  },
};

export default createNextIntlPlugin()(nextConfig);
