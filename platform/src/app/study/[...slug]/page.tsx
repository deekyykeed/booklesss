import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courseForNode } from "@/lib/courses";
import { allSessionSlugs, sessionIdForSlug } from "@/lib/session-nav";
import { agentPrompt, firstMessage, sessionBrief } from "@/lib/session";
import { openGraph } from "@/lib/site";
import { SessionCall } from "@/components/study/SessionCall";

/* A session, at /study/<the group's path>.
 *
 * Deliberately OUTSIDE the (reader) and (dashboard) route groups, so it
 * inherits nothing but the root layout: no sidebar, no header, no right panel.
 * A call is a full-bleed screen, and the chrome those groups provide is the
 * chrome this surface exists to be free of.
 *
 * Prerendered like the reader, and for the same reason: the brief is built
 * from course-data.json at build time, so the page ships as static HTML and
 * the only thing that happens at runtime is the token fetch.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return allSessionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const id = sessionIdForSlug((await params).slug ?? []);
  const brief = id ? sessionBrief(id) : null;
  if (!brief) return {};

  const description = `A ${brief.minutes}-minute guided session on ${brief.title.toLowerCase()} — listen, and the points worth keeping stay on screen.`;
  return {
    title: brief.title,
    description,
    alternates: { canonical: brief.path },
    openGraph: openGraph({
      title: `${brief.title} — ${brief.courseTitle}`,
      description,
      path: brief.path,
    }),
  };
}

export default async function StudyPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const id = sessionIdForSlug(slug ?? []);
  if (!id) notFound();

  const brief = sessionBrief(id);
  if (!brief || !brief.beats.length) notFound();

  const course = courseForNode(brief.stepIds[0] ?? id);

  return (
    <SessionCall
      sessionId={brief.id}
      title={brief.title}
      kicker={brief.kicker}
      minutes={brief.minutes}
      beats={brief.beats.length}
      /* Built here, on the server, and passed down. The client never reads
         course-data.json — see the guard at the top of lib/session.ts. */
      prompt={agentPrompt(brief)}
      firstMessage={firstMessage(brief)}
      steps={brief.steps}
      backHref={course ? `/${course.slug}` : "/dashboard"}
    />
  );
}
