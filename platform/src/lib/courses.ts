import { COURSE, checkpointsFor, lessonsUnder } from "./course";

/* ------------------------------------------------------------------ *
 * The student's course list.
 *
 * ONE course exists today. `gen-course.mjs` pulls a single slug
 * ("economics") out of Supabase and course-data.json is that one course's
 * tree — its top-level nodes are the course's units, not sibling courses.
 * So this registry is shaped for many and holds one, rather than pretending
 * to a library that isn't there.
 *
 * Adding a second course is a data change before it is a UI one: the
 * generator has to emit a course per slug and course-data.json has to gain a
 * level. Everything below reads from this list, so the home page won't need
 * touching when that happens.
 * ------------------------------------------------------------------ */

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

function build(slug: string, title: string, subtitle: string, unitIds: string[]): CourseMeta {
  const lessonIds = unitIds.flatMap((id) => lessonsUnder(id));
  return {
    slug,
    title,
    subtitle,
    unitIds,
    lessonIds,
    totalCheckpoints: lessonIds.reduce((n, id) => n + checkpointsFor(id).length, 0),
  };
}

export const COURSES: CourseMeta[] = [
  build(
    "economics",
    "Economics",
    "Micro, macro and behavioural — the whole introductory course.",
    COURSE.map((n) => n.id),
  ),
];

export function courseBySlug(slug: string): CourseMeta | undefined {
  return COURSES.find((c) => c.slug === slug);
}

/** Every lesson across every course, for whole-library totals. */
export const ALL_LESSON_IDS: string[] = COURSES.flatMap((c) => c.lessonIds);
export const ALL_CHECKPOINTS: number = COURSES.reduce((n, c) => n + c.totalCheckpoints, 0);
