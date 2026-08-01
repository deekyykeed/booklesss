import { ancestorsOf, checkpointsFor, childIdsOf, labelFor, lessonsUnder } from "./course";
import courseIndexData from "./course-index.json";
import { SCHOOLS, type SchoolId } from "./schools";

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
  /** Nav node ids forming this course's units, as authored. Routing and
   *  ownership questions use these — they are the real top of the tree. */
  unitIds: string[];
  /** The units to LIST in the UI. Same as unitIds unless the course was
   *  authored under a wrapper named after itself, in which case it is that
   *  wrapper's children. See the note below. */
  displayUnitIds: string[];
  /** Tree levels hidden by that unwrapping: 0 normally, 1 when wrapped. Any
   *  UI that indents by `depthOf()` must subtract this or it indents by a
   *  level it isn't drawing. */
  unitDepthOffset: number;
  lessonIds: string[];
  totalCheckpoints: number;
};

/* A course authored as ONE root node named after the course — the shape every
 * ZCAS course uses — makes the reader repeat itself: you click Treasury
 * Management, and the first row of its step list is "Treasury Management",
 * with all five units folded inside a folder you can collapse to nothing.
 * Nobody reading a course needs to be told which course they opened.
 *
 * So a wrapper is unwrapped for display: its children become the units. It
 * stays in the tree — it namespaces the URLs (/treasury-management/…) and it
 * is what courseForNode() matches on — it simply isn't drawn.
 *
 * A course with several genuine roots (Economics) has no wrapper and is
 * untouched: the test is one root, labelled exactly as the course. */
function unwrap(rootIds: string[], title: string): { ids: string[]; offset: number } {
  if (rootIds.length !== 1) return { ids: rootIds, offset: 0 };
  const children = childIdsOf(rootIds[0]);
  if (!children.length || labelFor(rootIds[0]) !== title) return { ids: rootIds, offset: 0 };
  return { ids: children, offset: 1 };
}

function build({ slug, title, subtitle, rootIds }: CourseIndexEntry): CourseMeta {
  const lessonIds = rootIds.flatMap((id) => lessonsUnder(id));
  const { ids: displayUnitIds, offset } = unwrap(rootIds, title);
  return {
    slug,
    title,
    subtitle,
    unitIds: rootIds,
    displayUnitIds,
    unitDepthOffset: offset,
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

/* ---- what a particular student sees --------------------------------- *
 *
 * The library is one list; a student is at one school taking a handful of its
 * courses. These two joins are what turn the first into the second, and they
 * are the only place course slugs from a school table or from localStorage are
 * matched against courses that actually exist.
 * -------------------------------------------------------------------- */

/** Every course slug some school claims. */
const CLAIMED = new Set(SCHOOLS.flatMap((s) => s.courseSlugs));

/**
 * The courses a school teaches — what the sign-up form offers once a school is
 * picked.
 *
 * A course no school has claimed is offered to everyone. That is the safe way
 * round: seeding a course is a content change (see the note at the top), and a
 * new course that nobody could enrol in until someone edited lib/schools would
 * look like a broken deploy rather than a missing line.
 */
export function coursesForSchool(id: SchoolId | null | undefined): CourseMeta[] {
  const school = SCHOOLS.find((s) => s.id === id);
  return COURSES.filter((c) => school?.courseSlugs.includes(c.slug) || !CLAIMED.has(c.slug));
}

/**
 * The courses a student is taking, in library order.
 *
 * An empty or unrecognisable list falls back to the whole library rather than
 * an empty dashboard: it means the question hasn't been answered yet, or the
 * answer was written by a build whose slugs have since changed, and neither is
 * a reason to hide every course from someone who came here to study.
 */
export function enrolledCourses(slugs: string[] | undefined): CourseMeta[] {
  if (!slugs?.length) return COURSES;
  const want = new Set(slugs);
  const mine = COURSES.filter((c) => want.has(c.slug));
  return mine.length ? mine : COURSES;
}

/** Every lesson across every course, for whole-library totals. */
export const ALL_LESSON_IDS: string[] = COURSES.flatMap((c) => c.lessonIds);
export const ALL_CHECKPOINTS: number = COURSES.reduce((n, c) => n + c.totalCheckpoints, 0);
