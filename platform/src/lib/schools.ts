/* ------------------------------------------------------------------ *
 * The schools whose courses the library carries.
 *
 * A student picks one at sign-up, and it does one job: narrow the course list
 * they are then asked to choose from. Nobody at ZCAS needs to scroll past a
 * UNZA course to find theirs, and the list only gets longer from here.
 *
 * Which courses a school teaches is recorded here as slugs rather than on the
 * course itself, because the courses table in Supabase has no school column —
 * course-index.json is generated straight from it (see scripts/gen-course.mjs),
 * so anything the database doesn't hold has to live beside it. If a school
 * column is ever added, this table moves into the generator and the shape here
 * stays the same.
 *
 * Slugs only, and no import of lib/courses — this module is pulled in by the
 * identity store, which loads on every page including the reader. The join
 * between a school and its actual courses lives in lib/courses.
 * ------------------------------------------------------------------ */

export type SchoolId = "zcas" | "unza";

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
};

/** In the order the picker draws them.
 *
 *  Only schools whose courses the library actually carries belong here. A
 *  school listed with nothing to teach is a dead end: the student picks it,
 *  the next screen has nothing to offer, and the form can't be finished. When
 *  a campus is worth capturing before its courses exist, that wants its own
 *  answer ("we're not there yet — tell us where you are"), not a row here. */
export const SCHOOLS: School[] = [
  {
    id: "zcas",
    name: "ZCAS",
    full: "Zambia Centre for Accountancy Studies",
    aka: ["ZCAS University", "Zcasu", "Accountancy"],
    courseSlugs: ["strategic-management", "treasury-management", "corporate-finance"],
  },
  {
    id: "unza",
    name: "UNZA",
    full: "University of Zambia",
    aka: ["Great East Road", "Ridgeway"],
    courseSlugs: ["economics"],
  },
];

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
