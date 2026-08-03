import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";
import { HomeViewWithUser } from "@/components/home/HomeViewWithUser";
import { clerkEnabled } from "@/lib/clerk";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

/* The tab says "Dashboard · Booklesss"; a shared link says "Booklesss". They
 * differ on purpose — a student with the app open knows whose dashboard it is,
 * and someone being handed the bare domain in a group does not. */
export const metadata: Metadata = {
  title: "Dashboard",
  /* States the app's purpose in the server-rendered HTML, because the landing
     intro is client-rendered and a crawler judging "does this page explain
     itself" may never run the JS — part of the Google OAuth branding fix. */
  description:
    "Booklesss is a course reader: university study notes rewritten as short steps you read on your phone, with checkpoints that track your studying.",
  alternates: { canonical: "/" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/" }),
};

/* "/" is the student's home: how the studying is going, then the courses.
 * A course's own overview lives at /[slug] (e.g. /economics), and the steps
 * under their own paths. */
export default function HomePage() {
  // The greeting uses the signed-in first name where Clerk is configured;
  // without it the page is identical minus the name.
  return clerkEnabled ? <HomeViewWithUser /> : <HomeView />;
}
