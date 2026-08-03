import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* /home became /dashboard on 2026-08-03 (owner: "rename it to dashboard,
   * not home"). This redirect is not tidiness — it is the installed app:
   * the PWA manifest's start_url was /home, and a phone that already added
   * Booklesss to its home screen keeps the old start_url until the manifest
   * is re-fetched. Without this, tapping the installed icon opens a 404.
   * Permanent, so browsers and the CDN stop asking. */
  async redirects() {
    return [{ source: "/home", destination: "/dashboard", permanent: true }];
  },
  async headers() {
    return [
      {
        /* The service worker must never itself be served from cache. A stale
         * copy held by the browser or the CDN keeps readers running an old
         * caching policy — and since the worker is what decides what gets
         * cached, a bad one can pin itself in place. */
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
