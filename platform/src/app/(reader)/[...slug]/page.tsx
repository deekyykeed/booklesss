import { notFound } from "next/navigation";
import { allLessonSlugs, lessonIdForSlug } from "@/lib/course";
import { lessonContent } from "@/lib/lesson-content";
import { LessonReader } from "@/components/reader/LessonReader";

// Only real lesson paths are valid; everything else 404s.
export const dynamicParams = false;

// Prerender every lesson at build time (keeps the site fully static).
export function generateStaticParams() {
  return allLessonSlugs().map((slug) => ({ slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const id = lessonIdForSlug(slug ?? []);
  if (!id) notFound();
  /* Read from the full content here, not from the nav tree — the nav has no
     prose. This is the only place the whole course is loaded, and it happens
     at build time, once per page. */
  const lesson = lessonContent(id);
  if (!lesson) notFound();
  return <LessonReader lesson={lesson} lessonId={id} />;
}
