import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Categories } from "./_categories";

/* COURSES BY CATEGORY (owner, 2026-10-22).
 *
 * Built from the Paper file "Booklesss Platform", page "Courses by category",
 * boards "Courses by category · 1440" and "· 390". One cover per course, like
 * the books in the "Keep the story going" library pin, with the course on the
 * cover itself; the page scrolls down through subjects and each subject's row
 * swipes sideways. The header is the lummi.ai layout the owner sent.
 *
 * ⚠️ Placeholder data throughout: twelve of the eighteen courses are not
 * built, and every count is invented. Not indexed, not linked from anywhere. */

const urbanist = Urbanist({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--cat-urbanist" });

export const metadata: Metadata = { title: "Courses by category preview", robots: { index: false, follow: false } };

export default function CategoriesPreview() {
  return <Categories className={urbanist.variable} />;
}
