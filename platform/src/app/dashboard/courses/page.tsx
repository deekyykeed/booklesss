import type { Metadata } from "next";
import { CoursesTab } from "@/components/home/CoursesTab";
import { RequireAccount } from "@/components/auth/RequireAccount";
import { RequireOnboarding } from "@/components/auth/RequireOnboarding";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your courses",
  description: "Everything on your timetable, and how far in you are.",
  alternates: { canonical: "/dashboard/courses" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/dashboard/courses" }),
};

/* The courses grid, moved off the home screen on 2026-08-27 and given the
 * second seat in the home dock. Gated exactly like /dashboard: it is the
 * student's own timetable, not a public page. */
export default function CoursesPage() {
  return (
    <>
      <RequireAccount />
      <RequireOnboarding>
        <CoursesTab />
      </RequireOnboarding>
    </>
  );
}
