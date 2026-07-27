import { ancestorsOf, checkpointsFor, lessonsUnder } from "./course";
import courseIndexData from "./course-index.json";

/* ------------------------------------------------------------------ *
 * The student's course list.
 *
 * course-data.json is one flat nav tree so the reader's routing and sidebar
 * never need to know about courses — a course is simply the top-level nodes it
 * owns. That does mean the tree alone can't say where one course ends and the
 * next begins, which is what course-index.json is for: gen-course.mjs writes
 * both, and the index records each course's slug, title, subtitle and root
 * node ids straight from Supabase.
 *
 * So adding a course is a content change only. Author it, seed it, regenerate,
 * and it appears here, on the home page and at /<slug> with nothing in the UI
 * to touch.
 * ------------------------------------------------------------------ */

type CourseIndexEntry = {
  slug: string;
  title: string;
  subtitle: string;
  /** Top-level nav node ids belonging to this course. */
  rootIds: string[];
};

export type CourseMeta = {
  /** Route segment: /economics */
  slug: string;
  title: string;
  /** One line under the title on the home page. */
  subtitle: string;
  /** Nav node ids forming this course's units. */
  unitIds: string[];
  lessonIds: string[];
  totalCheckpoints: number;
};

function build({ slug, title, subtitle, rootIds }: CourseIndexEntry): CourseMeta {
  const lessonIds = rootIds.flatMap((id) => lessonsUnder(id));
  return {
    slug,
    title,
    subtitle,
    unitIds: rootIds,
    lessonIds,
    totalCheckpoints: lessonIds.reduce((n, id) => n + checkpointsFor(id).length, 0),
  };
}

export const COURSES: CourseMeta[] = (courseIndexData as CourseIndexEntry[]).map(build);

export function courseBySlug(slug: string): CourseMeta | undefined {
  return COURSES.find((c) => c.slug === slug);
}

/**
 * The course a nav node belongs to, found via its top-level ancestor.
 *
 * The tree is flat across courses, so this is what lets the reader show one
 * course at a time: a student in Economics has no use for Corporate Finance's
 * units sitting under their step list. Returns undefined for a node no course
 * claims — callers fall back to the whole tree rather than an empty rail.
 */
export function courseForNode(nodeId: string): CourseMeta | undefined {
  // ancestorsOf is nearest-first, so the last entry is the top-level node.
  const root = ancestorsOf(nodeId).at(-1) ?? nodeId;
  return COURSES.find((c) => c.unitIds.includes(root));
}

/** Every lesson across every course, for whole-library totals. */
export const ALL_LESSON_IDS: string[] = COURSES.flatMap((c) => c.lessonIds);
export const ALL_CHECKPOINTS: number = COURSES.reduce((n, c) => n + c.totalCheckpoints, 0);
