import type { Metadata } from "next";
import { Inter, Familjen_Grotesk } from "next/font/google";
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
      className={`${inter.variable} ${familjen.variable} h-full`}
    >
      <body className="min-h-full bg-canvas text-ink">{children}</body>
    </html>
  );
}
