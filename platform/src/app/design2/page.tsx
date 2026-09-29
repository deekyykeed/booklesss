import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/design2/Navbar";
import { ScrollVideo } from "@/components/design2/ScrollVideo";
import { SectionOne } from "@/components/design2/SectionOne";
import { SectionTwo } from "@/components/design2/SectionTwo";

/* ------------------------------------------------------------------ *
 * /design2 — the NovaAI landing page, rebuilt to the owner's "exact
 * recreation" spec (2026-09-29) as a design reference living beside the
 * front door rather than as its own Vercel project (owner: "I don't want a
 * new project, a sub link").
 *
 * It is NOT Booklesss — another brand's copy and a stranger's portrait — so it
 * is noindexed and nothing in the app links to it.
 *
 * Inter is the app's own self-hosted --font-sans. The spec's `font-mono`
 * labels render Inter too, so they simply don't set a mono face. The
 * background is scroll-scrubbed, never autoplayed: see ScrollVideo.
 * ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: { absolute: "NOVA_AI — Today AI Aligns With Bold Dreams" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default function Design2() {
  return (
    <div className="relative min-h-dvh bg-[#0a0a0a] font-sans text-white antialiased selection:bg-white/20">
      <ScrollVideo />
      <div className="relative z-10">
        <Navbar />
        <main>
          <SectionOne />
          <div aria-hidden="true" className="h-[80vh]" />
          <SectionTwo />
        </main>
      </div>
    </div>
  );
}
