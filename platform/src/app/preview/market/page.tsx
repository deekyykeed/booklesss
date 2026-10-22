import type { Metadata } from "next";
import { Rubik, Urbanist } from "next/font/google";
import localFont from "next/font/local";
import { Market } from "./_market";

/* THE MARKETPLACE, DARK (owner, 2026-10-22).
 *
 * "This will be the marketplace page, most likely where students come in."
 * The Free UI Cards pin as a course card, at the pin's own size, set in Rubik
 * (owner: "only use Free UI Cards and keep them sized small"; "use Rubik"). The
 * segmented control and the filter button are the dark neumorphic pin; the
 * save icon on every card really saves (localStorage), and "Saved only" in
 * the filters reads it back.
 *
 * Designed in Paper first: "Booklesss Platform" > "Course UI · from
 * references". Each set lives in ./sets/<id>.tsx and builds to _types.ts.
 *
 * ⚠️ Placeholder data: creators, ratings and counts are invented. Not indexed,
 * not linked from anywhere. */

const rubik = Rubik({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--mk-rubik" });
const urbanist = Urbanist({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--mk-urbanist" });
/* Aveton (FlawlessAndCo), the owner's file, 2026-10-22: the display face for
   the wordmark, headings and course titles. It carries letters, space and the
   full stop ONLY (56 glyphs, no digits or punctuation), so anything with a
   number stays in Rubik, and the fallback catches a stray character. The
   download looks like a free-for-personal-use release; check the licence
   before it ships beyond this preview. */
const aveton = localFont({ src: "./Aveton-Regular.ttf", weight: "400", variable: "--mk-aveton", fallback: ["system-ui", "sans-serif"] });

export const metadata: Metadata = { title: "Marketplace preview", robots: { index: false, follow: false } };

export default function MarketPreview() {
  const fonts = [rubik, urbanist, aveton].map((f) => f.variable).join(" ");
  return <Market className={fonts} />;
}
