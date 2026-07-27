import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";
import { HomeViewWithUser } from "@/components/home/HomeViewWithUser";
import { clerkEnabled } from "@/lib/clerk";

export const metadata: Metadata = {
  title: "Home · Booklesss",
  description: "Your studying, and your courses.",
};

/* "/" is the student's home: how the studying is going, then the courses.
 * A course's own overview lives at /[slug] (e.g. /economics), and the steps
 * under their own paths. */
export default function HomePage() {
  // The greeting uses the signed-in first name where Clerk is configured;
  // without it the page is identical minus the name.
  return clerkEnabled ? <HomeViewWithUser /> : <HomeView />;
}
