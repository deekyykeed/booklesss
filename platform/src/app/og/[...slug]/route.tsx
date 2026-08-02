import { allLessonSlugs, lessonIdForSlug } from "@/lib/course";
import { COURSES, courseBySlug } from "@/lib/courses";
import { shareCard } from "@/lib/og";
import { stepShare } from "@/lib/share";
import { OG_HOME_SLUG, SITE_DESCRIPTION, SITE_NAME, shareText } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * Every link preview image the site serves: /og/<something>.png
 *
 *   /og/home.png                            the brand card
 *   /og/treasury-management.png             a course
 *   /og/treasury-management/…/forecasting.png   a step
 *
 * WHY A ROUTE HANDLER AND NOT `opengraph-image.tsx`. The file convention is
 * the nicer API and it is what the course cards used first, but the reader
 * lives at `(reader)/[...slug]` and Next will not accept a file *after* a
 * catch-all: "Catch-all must be the last part of the URL in route
 * /[...slug]/opengraph-image". Since the steps are the bulk of the cards and
 * they had to come here anyway, the courses and the brand card came with them
 * — one mechanism, one renderer, and one place a card can go wrong. The cost
 * is that each page names its image itself, via ogImage() in lib/site.ts.
 *
 * Still fully static: dynamicParams = false plus generateStaticParams means
 * every card is a PNG written at build time, so a crawler that arrives four
 * months from now hits a file rather than a cold function. That matters more
 * than it looks — WhatsApp caches a preview against its URL and may never ask
 * twice, so the first fetch is usually the only fetch.
 *
 * The `.png` suffix isn't required (Content-Type decides), but crawlers and
 * link-preview services in the wild do sniff extensions, and it costs one
 * slice() to honour.
 * ------------------------------------------------------------------ */

export const dynamic = "force-static";
export const dynamicParams = false;

const EXT = ".png";

export function generateStaticParams() {
  const paths: string[][] = [
    [OG_HOME_SLUG],
    ...COURSES.map((c) => [c.slug]),
    ...allLessonSlugs(),
  ];
  // The extension lives on the last segment, so it has to be added here as
  // well as stripped in GET — these two are the same convention seen twice.
  return paths.map((slug) => ({
    slug: [...slug.slice(0, -1), `${slug[slug.length - 1]}${EXT}`],
  }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const raw = (await params).slug ?? [];
  const slug = [...raw.slice(0, -1), (raw[raw.length - 1] ?? "").replace(/\.png$/, "")];

  if (slug.length === 1 && slug[0] === OG_HOME_SLUG) {
    return shareCard({
      title: SITE_NAME,
      subtitle: SITE_DESCRIPTION,
      meta: `${COURSES.length} courses`,
    });
  }

  /* A step is tried before a course because it is the more specific match: a
   * course slug is one segment and every lesson path is more than one, so they
   * cannot collide, but ordering it this way means they still can't if a
   * one-segment lesson is ever authored. */
  const lessonId = lessonIdForSlug(slug);
  const step = lessonId ? stepShare(lessonId) : null;
  if (step) {
    return shareCard({ eyebrow: step.eyebrow, title: step.title, subtitle: step.blurb });
  }

  const course = slug.length === 1 ? courseBySlug(slug[0]) : undefined;
  if (course) {
    const steps = course.lessonIds.length;
    return shareCard({
      title: course.title,
      subtitle: shareText(course.subtitle, 96),
      meta: `${steps} step${steps === 1 ? "" : "s"}`,
    });
  }

  // Unreachable with dynamicParams = false; here so the handler has one exit
  // for a path that isn't a card rather than throwing inside the renderer.
  return new Response("Not found", { status: 404 });
}
