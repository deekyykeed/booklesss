import type { Metadata } from "next";
import { kitFonts } from "@/components/kit/fonts";
import { ComponentsShowcase } from "@/components/kit/ComponentsShowcase";
import { openGraph, SITE_NAME } from "@/lib/site";

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
  return <ComponentsShowcase className={kitFonts} />;
}
