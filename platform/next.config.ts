import type { NextConfig } from "next";

/* ------------------------------------------------------------------ *
 * SECURITY HEADERS — and why the session cookie needs them.
 *
 * ⚠️ THIS APP HAD A CSP AND LOST IT. Security headers shipped on every route in
 * PR #34 (2026-07-12) and went out with the platform rewrite on 2026-07-24 that
 * replaced `app/(app)/` with the reader. Nothing noticed, because a missing
 * header breaks nothing — it just stops protecting. Restored 2026-08-09.
 *
 * WHAT THIS IS ACTUALLY DEFENDING. The Supabase session lives in a cookie
 * (lib/supabase/browser), not localStorage — but that cookie CANNOT be
 * HttpOnly, because the browser client has to read it to refresh the token.
 * That is a constraint of @supabase/ssr, not an oversight, and it means script
 * running on our origin can read the session. So the defence is not "hide the
 * cookie", it is:
 *   1. don't let injected script load        → script-src 'self'
 *   2. don't let anything phone home with it → connect-src, the important one
 * Even a successful injection has nowhere to POST a stolen token: connect-src
 * allows this origin and the Supabase project, and nothing else.
 *
 * ⚠️ WHY script-src CARRIES 'unsafe-inline', WHICH IS A REAL WEAKNESS AND A
 * DELIBERATE TRADE. Next's App Router inlines the RSC flight payload as
 * `self.__next_f.push(...)` on every page, and layout.tsx inlines the
 * motion-preference script that has to run before first paint. Both are
 * inline scripts, so a strict policy needs a per-request NONCE — and a nonce
 * has to come from middleware and makes every response unique, which would
 * make every step page dynamic. Those pages are static, work signed-out, and
 * are the ones a student on a Zambian connection opens twenty times a day
 * (see the matcher note in proxy.ts, which refuses a wide matcher for the same
 * reason). Static delivery of the reader is worth more here than closing the
 * inline-script hole, GIVEN how small the injection surface is: React escapes
 * by default and the only `dangerouslySetInnerHTML` in the app takes
 * build-time constants (generated icon bodies, that one script).
 *
 * REVISIT THIS THE DAY ANY USER-SUPPLIED STRING IS RENDERED AS HTML. A comment
 * body, a student's own note played back, anything from `/api/curriculum`
 * rendered unescaped — at that point the trade flips and the nonce is worth
 * the dynamic rendering.
 * ------------------------------------------------------------------ */

/* The Supabase project's origin, so connect-src can name it. Derived from the
 * same env var the clients use rather than hardcoded — a wrong value here
 * breaks sign-in with a console error nobody reads, so it must not be possible
 * for the two to disagree. Empty on an unconfigured build, which is correct:
 * that build has no auth to talk to. */
const SUPABASE_ORIGIN = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
      : "";
  } catch {
    return "";
  }
})();

const CSP = [
  "default-src 'self'",
  /* See the long note above: inline is required by RSC, external script is not.
   *
   * ⚠️ 'unsafe-eval' IS REQUIRED BY THE LORDICON MARKS, and removing it blanks
   * them SILENTLY. lottie-web compiles the expressions inside a Lottie file
   * with `new Function`; blocked, it builds an <svg> with zero layers — no
   * console violation you'd connect to it, every fetch a 200, and a
   * `destroy is not a function` crash on unmount. Shipped broken for a few
   * hours on 2026-08-09: the headers landed after the icons and every mark on
   * the checkpoint row went invisible in production. Proven by A/B against a
   * CSP-bypassed browser (1 shadow path vs 14). If the Lordicons ever leave
   * the app, take 'unsafe-eval' back out — connect-src stays the real
   * exfiltration guard either way. */
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Tailwind and every `style={{…}}` in the tree are inline styles.
  "style-src 'self' 'unsafe-inline'",
  // Self-hosted via next/font; no CDN is allowed to serve us a face.
  "font-src 'self' data:",
  // data: for inlined SVG and the OG card; blob: for canvas captures.
  "img-src 'self' data: blob:",
  // THE ONE THAT MATTERS: where script may send data. Us, and Supabase.
  `connect-src 'self' ${SUPABASE_ORIGIN} ${SUPABASE_ORIGIN.replace("https://", "wss://")}`.trim(),
  // No Flash, no <object>, no <embed>.
  "object-src 'none'",
  // Stops injected markup rewriting every relative URL on the page.
  "base-uri 'self'",
  // A form on our page may only post to us.
  "form-action 'self'",
  // Nobody may frame us — the modern X-Frame-Options, and it beats it.
  "frame-ancestors 'none'",
  // Upgrade any stray http:// subresource rather than blocking it outright.
  "upgrade-insecure-requests",
].join("; ");

/** Applied to every route. None of these can break a page that was already
 *  correct — they only remove permissions nothing here uses. */
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  /* A year, with subdomains, preload-eligible. Vercel serves HTTPS only, so
     this costs nothing and closes the first-visit downgrade window. */
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  /* Stops a browser guessing that an uploaded .txt is really a script. */
  { key: "X-Content-Type-Options", value: "nosniff" },
  /* frame-ancestors above supersedes this; kept for browsers that predate it. */
  { key: "X-Frame-Options", value: "DENY" },
  /* Send the full URL within our own site, only the origin off it — so a step
     path never leaks into a third party's logs. */
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /* The app asks for none of these. Denying them means an injected iframe or
     script cannot ask on our behalf. */
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

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
        /* Every route. Listed BEFORE the /sw.js rule below because Next applies
         * matching header rules in order and the later, narrower one wins where
         * they collide — which is what lets the worker keep its own stricter
         * CSP. */
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        /* The service worker must never itself be served from cache. A stale
         * copy held by the browser or the CDN keeps readers running an old
         * caching policy — and since the worker is what decides what gets
         * cached, a bad one can pin itself in place. */
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          /* Stricter than the site-wide policy on purpose: the worker runs no
           * inline script, so it does not need the exemption the pages do. */
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
