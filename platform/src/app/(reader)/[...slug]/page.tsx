import { notFound } from "next/navigation";
import { allLessonSlugs, courseIndex, lessonIdForSlug } from "@/lib/course";
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
  const lesson = courseIndex().lessons.get(id)!;
  return <LessonReader lesson={lesson} lessonId={id} />;
}
