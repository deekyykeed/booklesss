import type { Metadata } from "next";
import { Marketplace } from "@/components/marketplace/Marketplace";
import { RequireAccount } from "@/components/auth/RequireAccount";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Marketplace",
  alternates: { canonical: "/marketplace" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/marketplace" }),
};

/* The learner's way in, since the video pivot (owner, 2026-10-18: "getting in
 * to the app the app should have a sort of marketplace"). Built 1:1 from the
 * Paper boards "Learner — Marketplace (desktop)" and "(mobile)" in the file
 * "Booklesss Platform", which are themselves made of the owner's widget set
 * ("BUILD — Widgets" on the Learner page).
 *
 * ⚠️ THE COURSES ARE PLACEHOLDERS (lib/marketplace.ts) — no video course
 * exists yet, so every card is a design sample, not a catalogue. Gated to an
 * account because the owner asked to "login and see". */
export default function MarketplacePage() {
  return (
    <>
      <RequireAccount to="/sign-in?next=/marketplace" />
      <Marketplace />
    </>
  );
}
