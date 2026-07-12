import type { NextConfig } from "next";

// Step pages in public/steps/ are self-contained (inline style/script, base64
// data: fonts) and load source favicons from the Google and DuckDuckGo icon
// services — the only external requests the site makes. When a step ships
// with voice_agent_id set, the ElevenLabs widget loads from unpkg.com and
// streams to elevenlabs.io — extend script-src, connect-src (incl. wss:) and
// keep microphone=(self) below before deploying a voice-enabled step.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.google.com https://icons.duckduckgo.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

// CSP only on production deploys: preview deployments carry the Vercel
// toolbar (vercel.live + websockets), which a same-origin policy would break.
const isProdDeploy = process.env.VERCEL_ENV === "production";

const nextConfig: NextConfig = {
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
