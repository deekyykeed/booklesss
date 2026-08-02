import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { COURSES, courseBySlug } from "@/lib/courses";
import { openGraph, shareText } from "@/lib/site";

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

/* This is the link that gets pasted into a course's WhatsApp group, so it is
 * the one that has to preview properly: the course's own name in the card's
 * bold line, and its subtitle — already written short enough to survive
 * WhatsApp's ~80-character cut — as the description underneath.
 *
 * `canonical` matters more here than anywhere else in the app. A link that has
 * been through a group gets query strings stapled to it, and without a
 * canonical every variant is a separate page to a crawler and a separate
 * preview to cache. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = courseBySlug((await params).course);
  if (!course) return {};
  const path = `/${course.slug}`;
  const description = shareText(course.subtitle);
  return {
    title: course.title,
    description,
    alternates: { canonical: path },
    openGraph: openGraph({ title: course.title, description, path }),
  };
}

export default async function DashboardPage({ params }: Props) {
  const course = courseBySlug((await params).course);
  if (!course) notFound();
  return <StudentDashboard course={course} />;
}
