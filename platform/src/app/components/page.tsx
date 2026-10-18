import type { Metadata } from "next";
import { DM_Mono, Urbanist } from "next/font/google";
import { ComponentsShowcase } from "@/components/kit/ComponentsShowcase";
import { openGraph, SITE_NAME } from "@/lib/site";

/* The sidebar reference is set in Urbanist with a DM Mono wordmark. Both load
 * here and nowhere else: next/font emits a @font-face per family, and the
 * browser fetches a face only when something on the page asks for it. */
const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist", display: "swap" });
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
  return <ComponentsShowcase className={`${urbanist.variable} ${dmMono.variable}`} />;
}
