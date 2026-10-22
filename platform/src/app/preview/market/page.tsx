import type { Metadata } from "next";
import { Archivo, Inter, Inter_Tight, Instrument_Sans, Manrope, Poppins, Urbanist } from "next/font/google";
import { Market } from "./_market";

/* THE MARKETPLACE, DARK (owner, 2026-10-22).
 *
 * "This will be the marketplace page, most likely where students come in."
 * Every profile card the owner pinned is turned into a course card, and the
 * page shows them as sets so they can be compared with real filtering. The
 * segmented control and the filter button are the dark neumorphic pin; the
 * save icon on every card really saves (localStorage), and "Saved only" in
 * the filters reads it back.
 *
 * Designed in Paper first: "Booklesss Platform" > "Course UI · from
 * references". Each set lives in ./sets/<id>.tsx and builds to _types.ts.
 *
 * ⚠️ Placeholder data: creators, ratings and counts are invented. Not indexed,
 * not linked from anywhere. */

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--mk-inter" });
const interTight = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--mk-inter-tight" });
const urbanist = Urbanist({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--mk-urbanist" });
const instrument = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--mk-instrument" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--mk-manrope" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--mk-poppins" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--mk-archivo" });

export const metadata: Metadata = { title: "Marketplace preview", robots: { index: false, follow: false } };

export default function MarketPreview() {
  const fonts = [inter, interTight, urbanist, instrument, manrope, poppins, archivo].map((f) => f.variable).join(" ");
  return <Market className={fonts} />;
}
