import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allLessonSlugs, lessonIdForSlug } from "@/lib/course";
import { lessonContent } from "@/lib/lesson-content";
import { stepShare } from "@/lib/share";
import { openGraph } from "@/lib/site";
import { LessonReader } from "@/components/reader/LessonReader";

// Only real lesson paths are valid; everything else 404s.
export const dynamicParams = false;

// Prerender every lesson at build time (keeps the site fully static).
export function generateStaticParams() {
  return allLessonSlugs().map((slug) => ({ slug }));
}

/* Until this existed every one of the 44 steps shared as "Booklesss", with the
 * same line under it — 44 links that looked like the same link. Now the step
 * names itself and opens with its own first sentence. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const id = lessonIdForSlug((await params).slug ?? []);
  const share = id ? stepShare(id) : null;
  if (!share) return {};
  return {
    title: share.title,
    description: share.description,
    alternates: { canonical: share.path },
    openGraph: openGraph({
      /* The course name rides in the og:title rather than being left to the
       * card alone, because a preview that fails to fetch the image still has
       * to say which course this step is from. */
      title: share.eyebrow ? `${share.title} — ${share.eyebrow}` : share.title,
      description: share.description,
      path: share.path,
    }),
  };
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
