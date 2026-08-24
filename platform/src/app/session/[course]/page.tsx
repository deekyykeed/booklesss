import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSES, courseBySlug } from "@/lib/courses";
import { openGraph } from "@/lib/site";
import { CourseVoice } from "@/components/session/CourseVoice";

/* A course's voice space, at /session/<course>.
 *
 * Owner, 2026-08-23: tapping a course card should grow it into a full-screen
 * page, "and that's where the voice chat experience is going to live … the
 * user will be [greeted] with a screen where they can either continue with
 * whatever they were doing before."
 *
 * ⚠️ THE COURSE, NOT A LESSON GROUP — and that is what makes it a new route
 * rather than a redress of /study. `/study/<group>` is one session: a scripted
 * walk through the steps in one folder, and it knows exactly what it is about
 * before the student arrives. This page cannot know that, because the offer it
 * has to make ("carry on from where we stopped, or start somewhere else")
 * requires more than one session to choose between. A page holding a single
 * session has nothing to offer and no choice to present.
 *
 * ⚠️ IT COULD NOT HAVE BEEN /study/<course-slug>. That path is already taken:
 * a course whose root holds steps directly is itself a session, so
 * /study/corporate-finance resolves today and would have collided silently —
 * `sessionIdForSlug` would have answered first and this page would never have
 * rendered for exactly the courses that need it.
 *
 * Deliberately OUTSIDE the (reader) and (dashboard) route groups, for the same
 * reason /study is: this is a full-bleed screen, and the header and sidebar
 * those groups bring are the chrome it exists to be free of.
 *
 * Everything on it that depends on a student — what they were last doing, how
 * far they got — is client-side, because progress lives in localStorage and on
 * their account, never in the build. The server's whole job here is to name
 * the course and prerender the shell.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return COURSES.map((c) => ({ course: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const course = courseBySlug((await params).course);
  if (!course) return {};

  const description = `Talk through ${course.title} — ask anything, or carry on from where you stopped.`;
  return {
    title: course.title,
    description,
    alternates: { canonical: `/session/${course.slug}` },
    openGraph: openGraph({
      title: course.title,
      description,
      path: `/session/${course.slug}`,
    }),
  };
}

export default async function CourseSessionPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: slug } = await params;
  const course = courseBySlug(slug);
  if (!course) notFound();

  return <CourseVoice slug={course.slug} title={course.title} lessonIds={course.lessonIds} />;
}
