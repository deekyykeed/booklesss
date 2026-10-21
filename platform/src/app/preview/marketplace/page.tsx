import type { Metadata } from "next";
import { Montserrat, Rubik } from "next/font/google";
import { Marketplace } from "./_market";

/* THE LIBRARY MARKETPLACE (owner, 2026-10-22).
 *
 * Built from the Paper file "Booklesss Platform", page "Library + course
 * card": the four boards "Marketplace · 1440 / 1024 / 768 / 390". The chrome is
 * the "Keep the story going" library pin with its sidebar removed (owner: "remove
 * the side bar so i can keep 3 columns"), and every card is the stacked-preview
 * course card from the owner's sketch.
 *
 * ⚠️ Placeholder data throughout. The video counts, hours and student counts are
 * invented, and two of the six courses (Business Administration, Financial
 * Accounting) are not built. Not indexed, not linked from anywhere. */

const rubik = Rubik({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--mk-rubik" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500"], variable: "--mk-montserrat" });

export const metadata: Metadata = { title: "Marketplace preview", robots: { index: false, follow: false } };

export default function MarketplacePreview() {
  return <Marketplace className={`${rubik.variable} ${montserrat.variable}`} />;
}
