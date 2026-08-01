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

export type School = {
  id: SchoolId;
  /** What students call it — what the picker shows. */
  name: string;
  /** The full name, one line under it. */
  full: string;
  /** Course slugs this school teaches, as they appear in course-index.json. */
  courseSlugs: string[];
};

/** In the order the picker draws them. */
export const SCHOOLS: School[] = [
  {
    id: "zcas",
    name: "ZCAS",
    full: "Zambia Centre for Accountancy Studies",
    courseSlugs: ["strategic-management", "treasury-management", "corporate-finance"],
  },
  {
    id: "unza",
    name: "UNZA",
    full: "University of Zambia",
    courseSlugs: ["economics"],
  },
];

/** The school a stored id refers to, or undefined if it names one we dropped. */
export function schoolById(id: SchoolId | string | null | undefined): School | undefined {
  return SCHOOLS.find((s) => s.id === id);
}

/** Narrows a stored string back to a SchoolId — localStorage holds whatever it
 *  was last written with, including an id from a build that has since changed. */
export function isSchoolId(v: unknown): v is SchoolId {
  return typeof v === "string" && SCHOOLS.some((s) => s.id === v);
}
