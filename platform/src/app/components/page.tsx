import type { Metadata } from "next";
import { DM_Mono, Rubik } from "next/font/google";
import { ComponentsShowcase } from "@/components/kit/ComponentsShowcase";
import { openGraph, SITE_NAME } from "@/lib/site";

/* RUBIK IS THE KIT'S MAIN FACE (owner, 2026-10-18: "make that main font
 * Rubik") — every widget, the sidebar and the page's own headings. Loaded here
 * as the full variable family because the kit sets 400 to 700; the root
 * layout's Rubik instance carries only 400 and 500 for the landing page. DM
 * Mono stays for the wordmark and the small uppercase hints. next/font emits
 * a @font-face per family and the browser fetches a face only when something
 * on the page asks for it, so neither costs another route anything. */
const rubik = Rubik({ subsets: ["latin"], variable: "--font-kit-main", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-dm-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Components",
  alternates: { canonical: "/components" },
  robots: { index: false, follow: false },
  openGraph: openGraph({
    title: `Components · ${SITE_NAME}`,
    description: "The pieces the app is built from, working.",
    path: "/components",
  }),
};

/* Public on purpose: it renders no student data, only the component kit
 * (owner, 2026-10-18: "show me on /components on the live website"). */
export default function ComponentsPage() {
  return <ComponentsShowcase className={`${rubik.variable} ${dmMono.variable}`} />;
}
