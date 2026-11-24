import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Security reminders in `next dev` and `next build`, and the default policy of `next upgrade --agent`.
  experimental: {
    agentUpgrade: "security",
  },
  // Redirects run before the locale proxy, so each language is written out.
  async redirects() {
    return ["", "/en", "/es"].map((prefix) => ({ source: `${prefix}/docs/editor-and-git`, destination: `${prefix}/docs/editor`, permanent: true }));
  },
};

export default createNextIntlPlugin()(nextConfig);
