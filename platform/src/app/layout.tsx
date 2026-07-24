import type { Metadata } from "next";
import { Inter, Familjen_Grotesk } from "next/font/google";
import localFont from "next/font/local";
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${familjen.variable} ${aptos.variable} h-full`}
    >
      <body className="min-h-full bg-canvas text-ink">{children}</body>
    </html>
  );
}
