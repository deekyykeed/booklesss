import type { Metadata } from "next";
import { Bebas_Neue, Oswald, Urbanist } from "next/font/google";
import { Books } from "./_books";

/* COURSES AS BOOKS (owner, 2026-10-22).
 *
 * The categories page with every course drawn as a book, off the owner's
 * Headway screenshots, mixed with the split covers from the Paper board. No
 * title under the cover: the course is read from the cover itself, and only
 * "6h 20m · updated 2d ago" sits below it. Each book is its own design, like
 * a real shelf, built from eight layouts so no two books in a row share one.
 * The left edge carries a thin hinge groove so it reads as a printed cover
 * rather than a tile.
 *
 * ⚠️ Placeholder data throughout: most of these courses are not built, and
 * every count is invented. Not indexed, not linked from anywhere. */

const urbanist = Urbanist({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], variable: "--bk-urbanist" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--bk-bebas" });
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500"], variable: "--bk-oswald" });

export const metadata: Metadata = { title: "Courses as books preview", robots: { index: false, follow: false } };

export default function BooksPreview() {
  return <Books className={`${urbanist.variable} ${bebas.variable} ${oswald.variable}`} />;
}
