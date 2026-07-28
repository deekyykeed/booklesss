/* Series and card hues, shared by the home cards and the study chart so the
 * same course is always the same colour wherever it appears. */

/** The Time studied line — brand green. The card's mark wears it too. */
export const CHART_TONE = "#17754d";

/** One hue per course, carried by the card's gradient, mark and sparkline —
 *  and by that course's line on the study chart. Keyed by slug like
 *  CourseGlyph; a new course gets the fallback the day it's seeded, and
 *  picking its colour is a one-line change here.
 *
 *  None may equal CHART_TONE: the total line owns the green, and a course
 *  line in the same hue would read as the total. (Corporate Finance wore
 *  the green before the chart drew per-course lines; it now wears the
 *  brand's warm amber.) */
const COURSE_TONE: Record<string, string> = {
  economics: "#2a78d6",
  "corporate-finance": "#c17e3a",
};
const COURSE_TONE_FALLBACK = "#4a3aa7";

export const courseTone = (slug: string) => COURSE_TONE[slug] ?? COURSE_TONE_FALLBACK;

/** Momentum — a derived series, so it wears a text tone, never a course hue. */
export const MOMENTUM_TONE = "#8b8b93";
