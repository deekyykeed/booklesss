import type { NextConfig } from "next";

// Step pages in public/steps/ are self-contained (inline style/script, base64
// data: fonts) and load source favicons from the Google and DuckDuckGo icon
// services — the only external requests the site makes. When a step ships
// with voice_agent_id set, the ElevenLabs widget loads from unpkg.com and
// streams to elevenlabs.io — extend script-src, connect-src (incl. wss:) and
// keep microphone=(self) below before deploying a voice-enabled step.
// Clerk loads its UI runtime (clerk-js) and talks to its Frontend API from
// Clerk's own hosts, and uses a Cloudflare Turnstile challenge for bot
// protection — all of which the CSP must allow or the sign-in/up widgets
// render blank. Hosts per Clerk's CSP guide (clerk.com/docs/.../csp-headers):
// the FAPI + clerk-js on *.clerk.accounts.dev / *.clerk.com, avatars on
// img.clerk.com, telemetry on clerk-telemetry.com, Turnstile on
// challenges.cloudflare.com, and worker-src blob: for Clerk's web workers.
// (On a production Clerk instance the FAPI moves to clerk.<your-domain> —
// add that host here when that happens.)
const clerkScript = "https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com";
const clerkConnect = "https://*.clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${clerkScript}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.google.com https://icons.duckduckgo.com https://img.clerk.com",
  "font-src 'self' data:",
  `connect-src 'self' ${clerkConnect}`,
  "worker-src 'self' blob:",
  "frame-src 'self' https://challenges.cloudflare.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

// CSP only on production deploys: preview deployments carry the Vercel
// toolbar (vercel.live + websockets), which a same-origin policy would break.
const isProdDeploy = process.env.VERCEL_ENV === "production";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Steps used to be static files at /steps/<slug>.html; every link ever
      // posted in Slack keeps working. Redirects run before /public, so this
      // wins even while the old files exist.
      {
        source: "/steps/:slug([a-z0-9-]+)\\.html",
        destination: "/steps/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...(isProdDeploy
            ? [{ key: "Content-Security-Policy", value: csp }]
            : []),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
