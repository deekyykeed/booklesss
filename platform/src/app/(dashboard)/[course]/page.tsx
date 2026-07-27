import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { COURSES, courseBySlug } from "@/lib/courses";

/* A single course's overview: progress across it, the next step to open, and
 * the course unit by unit. Home ("/") sits above this and lists the courses;
 * the steps themselves live under their own paths.
 *
 * One page per course, generated from the course index — so a new course
 * appears at /<slug> as soon as its content is seeded, with no route to add. */

type Props = { params: Promise<{ course: string }> };

export function generateStaticParams() {
  return COURSES.map((c) => ({ course: c.slug }));
}

/* Only the known course slugs render. Without this a URL like /anything would
 * fall through to this route and render an empty dashboard instead of a 404 —
 * and the reader's own catch-all sits in a different route group, so it cannot
 * pick these up. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = courseBySlug((await params).course);
  if (!course) return {};
  return {
    title: `${course.title} · Booklesss`,
    description: "Where you are in the course, and what to do next.",
  };
}

export default async function DashboardPage({ params }: Props) {
  const course = courseBySlug((await params).course);
  if (!course) notFound();
  return <StudentDashboard course={course} />;
}
