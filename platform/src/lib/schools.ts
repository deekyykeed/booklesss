/* ------------------------------------------------------------------ *
 * The universities a student picks from at sign-up.
 *
 * It does one job: narrow the course list they are then asked to choose from.
 * Nobody needs to scroll past another university's courses to find theirs, and
 * the list only gets longer from here.
 *
 * THE LIST COMES OFF SUPABASE (owner, 2026-08-04: "these options better be
 * coming off of supabase"). The table is `universities` — read at BUILD by
 * scripts/gen-schools.mjs and committed as school-index.json, the same
 * arrangement course-data.json has and for the same reason: adding a campus is
 * a row in a table, while a student on a Zambian connection still gets the
 * picker instantly, offline, with no Supabase client in the browser bundle.
 *
 * `universities`, not `schools` — pipeline_schools is already taken, and holds
 * ZCAS's four FACULTIES. Two tables called school meaning different things is
 * how that mix-up becomes permanent.
 *
 * Which courses a university teaches is recorded on ITS row rather than on the
 * course, because the courses table has no school column — course-index.json is
 * generated straight from it (scripts/gen-course.mjs), so anything the database
 * doesn't hold on a course has to live beside it.
 *
 * Slugs only, and no import of lib/courses — this module is pulled in by the
 * identity store, which loads on every page including the reader. The join
 * between a university and its actual courses lives in lib/courses.
 * ------------------------------------------------------------------ */

import SCHOOL_INDEX from "./school-index.json";

/**
 * A university's stored id.
 *
 * `string`, where it used to be a literal union of the two we carried. The list
 * is data now, so a union here would be a hand-kept copy of a table — right
 * until somebody adds a row and forgets, at which point the types say a real
 * university doesn't exist. `isSchoolChoice` does the checking that the union
 * used to pretend to, and it does it against the actual list.
 */
export type SchoolId = string;

/** The answer for a university this list doesn't carry. Students at a campus
 *  Booklesss isn't on yet type their own, rather than being told to pick one of
 *  ours or go away — and what they type is the first thing that will say which
 *  campus to build for next. */
export const OTHER_SCHOOL = "other";

/** What gets stored: one of ours, or theirs. */
export type SchoolChoice = SchoolId | typeof OTHER_SCHOOL;

export type School = {
  id: SchoolId;
  /** What students call it — what the picker shows. */
  name: string;
  /** The full name, one line under it. */
  full: string;
  /** Anything else a student might type looking for it: the old name, the
   *  campus, a common misspelling. Searched, never shown. */
  aka?: string[];
  /** Course slugs this school teaches, as they appear in course-index.json. */
  courseSlugs: string[];
  /**
   * The tint behind its monogram in the picker.
   *
   * A MONOGRAM, NOT A CREST. The owner asked for "a logo … and the name after
   * it" (2026-08-03), and a university's real crest is the one mark that
   * would make Booklesss look endorsed by it — which it is not, and which the
   * standing no-affiliation rule exists to prevent. A letter on a tinted disc
   * gives the row the same scannable anchor a logo would, owes nobody
   * permission, and needs no asset to load on a Zambian connection.
   *
   * If real logos are ever licensed, this is where the field goes and the row
   * swaps an <img> in for the letter — nothing else moves.
   */
  tone: string;
};

/**
 * In the order the picker draws them — `position` on the table.
 *
 * A UNIVERSITY WITH NO COURSES IS NOW A REAL ROW, which it deliberately was not
 * before. The old rule here was that only universities the library actually
 * serves belonged in the list, because picking one with nothing to teach landed
 * the student on an empty course screen they couldn't get past — a dead end.
 * The owner asked for the top ten Zambian universities (2026-08-04) and eight of
 * them have no courses yet, so the dead end had to be closed rather than
 * avoided: `coursesForSchool` now offers the whole library to any university
 * whose syllabus we don't know, exactly as it already did for "another
 * university". Same honest answer, and the pick is still worth having — it is
 * the best evidence there is for which campus to build for next.
 */
export const SCHOOLS: School[] = SCHOOL_INDEX;

/**
 * Schools matching what someone typed, in list order.
 *
 * Plain case-insensitive substring over the name, the full name and the aka
 * list — "zam", "unza" and "great east" all find UNZA. Nothing fuzzier, and
 * deliberately no ranking: the list is short enough to read, and a student who
 * types their own university's initials should see it, not a cleverly scored
 * near-miss above it. An empty query is everything.
 */
export function searchSchools(query: string): School[] {
  const q = query.trim().toLowerCase();
  if (!q) return SCHOOLS;
  return SCHOOLS.filter((s) =>
    [s.name, s.full, ...(s.aka ?? [])].some((t) => t.toLowerCase().includes(q)),
  );
}

/** The school a stored id refers to, or undefined for one we dropped — and for
 *  OTHER_SCHOOL, which has no entry by definition. */
export function schoolById(id: SchoolChoice | string | null | undefined): School | undefined {
  return SCHOOLS.find((s) => s.id === id);
}

/** Narrows a stored string back to a choice — localStorage holds whatever it
 *  was last written with, including an id from a build that has since changed. */
export function isSchoolChoice(v: unknown): v is SchoolChoice {
  return typeof v === "string" && (v === OTHER_SCHOOL || SCHOOLS.some((s) => s.id === v));
}
