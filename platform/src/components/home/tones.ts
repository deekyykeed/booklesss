/* Card hues, keyed by course, so the same course is always the same colour
 * wherever it appears on the home page. */

/** One hue per course, carried by the card's gradient, mark and sparkline.
 *  Keyed by slug, like the card glyphs; a new course gets the fallback the day
 *  it's seeded, and picking its colour is a one-line change here.
 *
 *  None may be the brand green: green means completion everywhere in this app,
 *  so a course wearing it would read as a finished one. (Corporate Finance was
 *  green once, for that reason it now wears the brand's warm amber.) */
const COURSE_TONE: Record<string, string> = {
  economics: "#2a78d6",
  "corporate-finance": "#c17e3a",
};
const COURSE_TONE_FALLBACK = "#4a3aa7";

export const courseTone = (slug: string) => COURSE_TONE[slug] ?? COURSE_TONE_FALLBACK;
