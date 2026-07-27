import type { Metadata } from "next";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

export const metadata: Metadata = {
  title: "Your course · Booklesss",
  description: "Where you are in the course, and what to do next.",
};

/* "/" is the student's index: overall progress, the next step to open, and the
 * course unit by unit. The lessons themselves live at their own paths — the
 * default lesson used to sit here. */
export default function DashboardPage() {
  return <StudentDashboard />;
}
