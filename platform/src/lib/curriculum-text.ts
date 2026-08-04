/* ------------------------------------------------------------------ *
 * Turning what a student TYPES into something that can be counted.
 *
 * Seven of the ten universities in the picker publish no curriculum, so for
 * most students the course list is whatever they write in the box. Two of them
 * writing the same course must produce the same row, or the reported curriculum
 * is a list of near-duplicates that never agrees with itself and never reaches
 * the threshold to be worth trusting.
 *
 * This runs on BOTH sides — the browser dedupes as they type, the API dedupes
 * before it writes — so it lives here rather than in either.
 *
 * It is deliberately the same shape as the scrapers' `norm()` in
 * tools/scrape_*.py, because the point of normalising at all is that a typed
 * "Financial Accounting" can meet the scraped one. It is not identical and does
 * not need to be: the scrapers' spelling-fix table is theirs, and a student's
 * typo is not a source's typo.
 * ------------------------------------------------------------------ */

/**
 * The stored `programme` for a degree we don't carry — the twin of
 * OTHER_SCHOOL, and the flag that says `programmeName` is where the real
 * answer is.
 *
 * HERE AND NOT IN lib/programmes, which is the obvious home, because that
 * module imports programme-index.json — 129KB of curriculum — and lib/identity
 * needs this constant while deliberately importing no curriculum at all: it
 * loads on every page including the reader. A constant with no data behind it
 * belongs in the module with no data in it.
 */
export const OTHER_PROGRAMME = "other";

/** A course title reduced to what two people would have to agree on. */
export function normTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[’']/g, "")
    .replace(/\bintro\b/g, "introduction")
    // A trailing level number is part of the course — "Accounting II" is not
    // "Accounting" — but a LEADING one is the line number they typed with it.
    .replace(/^\s*\d{1,2}[.)]\s*/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** What a student is allowed to have typed. Long enough to be a course, short
 *  enough not to be a paragraph pasted in by accident. */
export function isCourseTitle(title: string): boolean {
  const t = title.trim();
  return t.length >= 3 && t.length <= 90 && normTitle(t).length >= 3;
}

/**
 * Tidy a typed title for display without pretending to know better than they
 * do. Whitespace only — no capitalisation rules, because "ICT" and "eCommerce"
 * are both right and a title-caser would break one of them.
 */
export function cleanTitle(title: string): string {
  return title.replace(/\s+/g, " ").trim().slice(0, 90);
}

/** The most a student may list. A real timetable is eight or nine courses; this
 *  is a bound on a text field, not a judgement about anyone's workload. */
export const MAX_TYPED_COURSES = 20;
