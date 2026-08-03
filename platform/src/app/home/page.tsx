import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";
import { HomeViewWithUser } from "@/components/home/HomeViewWithUser";
import { clerkEnabled } from "@/lib/clerk";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your studying, and your courses.",
  alternates: { canonical: "/home" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/home" }),
};

/* /home is the student's home: how the studying is going, then the courses.
 * It lived at "/" until 2026-08-03, when "/" became the landing page —
 * Google's OAuth review requires the home URL to be a static page that
 * explains the app without sign-in, and the owner wanted a real front door
 * anyway. A course's own overview lives at /[slug] (e.g. /economics), and
 * the steps under their own paths. */
export default function HomePage() {
  // The greeting uses the signed-in first name where Clerk is configured;
  // without it the page is identical minus the name.
  return clerkEnabled ? <HomeViewWithUser /> : <HomeView />;
}
