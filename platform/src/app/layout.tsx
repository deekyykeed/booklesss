import type { Metadata, Viewport } from "next";
import { Inter, Familjen_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/clerk";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { RegisterSW } from "@/components/RegisterSW";
import { IdentityGate } from "@/components/identity/IdentityGate";
import "./globals.css";

// The logo is an icon again, so Burbank is no longer loaded. Both it and
// Ernon are still in src/fonts/ if either is ever wanted back.

// Titles use Familjen Grotesk (via --font-display). The Ernon face is still
// in src/fonts/ if it's ever wanted back — re-register it with next/font/local
// and put --font-ernon at the front of --font-display.

// Self-hosted at build time by next/font — no Google round-trip, no CLS.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
  display: "swap",
});

// Content text is Aptos — self-hosted so every device gets it, not just
// Windows machines that ship it with Office. Source TTFs live in _dev/fonts/.
const aptos = localFont({
  src: [
    { path: "../fonts/aptos.woff2", weight: "400", style: "normal" },
    { path: "../fonts/aptos-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/aptos-bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/aptos-bold-italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-aptos",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Booklesss",
  description: "Learn without the textbook — courses, lessons, and steps.",
  // iOS ignores the web manifest's icons and reads this instead.
  appleWebApp: { capable: true, title: "Booklesss", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

/* Paints the phone's browser chrome to match the app rather than leaving a
 * white bar above a canvas-grey page. Same value as the manifest's. */
export const viewport: Viewport = { themeColor: "#f5f5f5" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const document = (
    <html
      lang="en"
      className={`${inter.variable} ${familjen.variable} ${aptos.variable} h-full`}
    >
      <body className="min-h-full bg-canvas text-ink">
        {children}
        {/* Asks a first-time reader for a name and a face. Mounted here rather
            than per-layout so a route added later can't quietly opt out of it;
            it skips the sign-in, offline and /workspace paths itself. */}
        <IdentityGate />
        <RegisterSW />
      </body>
    </html>
  );

  // No keys configured -> no provider, and the app renders exactly as it did
  // before Clerk. See src/lib/clerk.ts.
  if (!clerkEnabled) return document;

  return (
    // One appearance for every Clerk surface — see lib/clerk-appearance.ts.
    <ClerkProvider appearance={clerkAppearance}>{document}</ClerkProvider>
  );
}
