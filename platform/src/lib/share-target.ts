import { labelFor, lessonIdForSlug } from "./course";
import { courseBySlug } from "./courses";
import { SITE_NAME } from "./site";

/* ------------------------------------------------------------------ *
 * What "share" means on the page you are currently looking at.
 *
 * One control in the header rather than a button on every shareable surface
 * (owner, 2026-08-02): the dashboard shares the dashboard, a course page
 * shares that course, a step shares that step. The reader never has to find a
 * different button depending on where they are, and there is exactly one place
 * in the app where sharing can be got wrong.
 *
 * Everything here reads the nav tree, which client components already carry —
 * no new weight in the browser bundle. NOT lib/share.ts, which pulls the full
 * course prose and is build-time only.
 * ------------------------------------------------------------------ */

export type ShareTarget = {
  /** Route path to hand out. */
  path: string;
  /** The thing's own name, for the native share sheet's title field. */
  title: string;
  /** Spoken name for the button, since it says only "Share". */
  label: string;
};

const HOME: ShareTarget = { path: "/", title: SITE_NAME, label: `Share ${SITE_NAME}` };

export function shareTargetFor(pathname: string): ShareTarget {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return HOME;

  // A step: the deepest and most specific thing a reader can be looking at.
  const lessonId = lessonIdForSlug(segments);
  if (lessonId) {
    const title = labelFor(lessonId);
    return { path: pathname, title, label: `Share ${title}` };
  }

  // A course overview at /<slug>.
  const course = segments.length === 1 ? courseBySlug(segments[0]) : undefined;
  if (course) {
    return { path: `/${course.slug}`, title: course.title, label: `Share ${course.title}` };
  }

  /* Anywhere else — /settings, /workspace, a sign-in page. None of those is
   * worth sending anyone, and a share button that quietly did nothing would be
   * worse than one that hands over the app itself. */
  return HOME;
}
