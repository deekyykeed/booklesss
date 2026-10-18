import type { Metadata } from "next";
import { AppShell } from "@/components/kit/AppShell";
import { kitFonts } from "@/components/kit/fonts";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dashboard",
  alternates: { canonical: "/dashboard" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/dashboard" }),
};

/* /dashboard IS THE APP BUILT FROM THE KIT, as of 2026-10-18 evening: the
 * Ron sidebar as the real navigation (a pulled drawer on a phone) and the
 * marketplace's first page behind it (owner: "build out the first page of the
 * marketplace — I want to see what I'm dealing with on desktop and mobile").
 * Studio and My courses inside it are the video framework from earlier the
 * same day. The claude.ai reference it replaced is ClaudeUI.tsx, kept because
 * the studio components still live in its folder.
 *
 * ⚠️ STILL UNGATED, for the reason the reference was: nothing here reads a
 * student's data yet (the courses are placeholders). The gates go back the
 * moment it renders anything real.
 */
export default function DashboardPage() {
  return <AppShell className={kitFonts} />;
}
