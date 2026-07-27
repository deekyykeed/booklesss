import type { Metadata } from "next";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

export const metadata: Metadata = {
  title: "Economics · Booklesss",
  description: "Where you are in the course, and what to do next.",
};

/* A single course's overview: progress across it, the next step to open, and
 * the course unit by unit. Home ("/") sits above this and lists the courses;
 * the steps themselves live under their own paths. */
export default function DashboardPage() {
  return <StudentDashboard />;
}
