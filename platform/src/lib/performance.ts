import { STUDY_DAY_MIN_SECS, studyHistory, type StudyDay } from "./progress";

/* ------------------------------------------------------------------ *
 * The performance score — one number for "how am I doing", weighted to reward
 * effort over how much is finished.
 *
 *   score = 35 × progress  +  65 × effort
 *
 *   progress  coverage — sections cleared ÷ all sections. Cumulative and
 *             permanent: finishing a course banks its 35 points for good.
 *   effort    ½ consistency + ½ intensity, both over the last 7 days:
 *               consistency  study days ÷ 5   (5 of 7 is full marks — showing
 *                            up most days, not every day)
 *               intensity    minutes read ÷ 120  (about two hours a week)
 *
 * Effort is the larger share, so a reader who turns up and puts in the time
 * scores well long before the course is finished. And effort is measured only
 * from days and minutes — never from work-remaining — so completing a course
 * can never starve the score the way a "checkpoints this week" term did: you
 * can always spend a day and an hour reviewing, but you can't clear sections
 * that no longer exist.
 *
 * Every input is measured and each part is a 0..1 the reader could recompute:
 * coverage from the checkpoint store, consistency from the study days, and
 * intensity from StudyClock's seconds (the same figure the Time tile shows).
 * ------------------------------------------------------------------ */

/** Minutes of reading in a week that earn full intensity — roughly two solid
 *  sessions. Reading time is what StudyClock banks, and it undercounts on
 *  purpose, so this is a floor a real week clears, not a stretch. */
const WEEKLY_MINUTES_TARGET = 120;

/** Study days in a week that earn full consistency. Five of seven, so a day
 *  off doesn't read as falling behind. */
const WEEKLY_DAYS_TARGET = 5;

export type Performance = {
  /** 0..100, rounded. */
  score: number;
  /** The same score as it stood a week ago — every window shifted back seven
   *  days. Exposed rather than left to be derived as `score - delta`, because
   *  the tile reports growth as a percentage OF this number and a caller
   *  reconstructing it would be reimplementing the rounding. */
  prev: number;
  /** Points moved since a week ago. Positive is climbing. */
  delta: number;
  /** Each part 0..1, so the number can be explained. */
  parts: { coverage: number; consistency: number; intensity: number; effort: number };
  /** Qualifying study days in the last 7. */
  weekDays: number;
  /** Minutes read in the last 7. */
  weekMins: number;
};

/** The shared blend — progress a third, effort two thirds. */
function blend(coverage: number, weekDays: number, weekMins: number) {
  const consistency = Math.min(1, weekDays / WEEKLY_DAYS_TARGET);
  const intensity = Math.min(1, weekMins / WEEKLY_MINUTES_TARGET);
  const effort = (consistency + intensity) / 2;
  return { consistency, intensity, effort, score: 35 * coverage + 65 * effort };
}

/**
 * One course's score. Days and minutes are the ones attributed to this course
 * (StudyClock records seconds per course); coverage is its own checkpoints.
 */
export function coursePerformance(
  days: Record<string, StudyDay>,
  slug: string,
  done: number,
  totalCheckpoints: number,
): Performance {
  const coverage = totalCheckpoints > 0 ? Math.min(1, done / totalCheckpoints) : 0;

  /* The fortnight the card's curve draws: newest 7 are this week, the older 7
   * rebuild last week's score for the delta. */
  const fortnight = studyHistory(days, 14);
  const week = fortnight.slice(7);
  const prev = fortnight.slice(0, 7);

  // Per course: a day counts if it carries this course's reading time or a
  // section cleared in it; minutes are this course's seconds.
  const daysOf = (w: (StudyDay & { date: string })[]) =>
    w.filter((d) => (d.courses?.[slug] ?? 0) >= STUDY_DAY_MIN_SECS || (d.courseChecks?.[slug] ?? 0) > 0).length;
  const minsOf = (w: (StudyDay & { date: string })[]) => w.reduce((n, d) => n + (d.courses?.[slug] ?? 0), 0) / 60;

  const weekDays = daysOf(week);
  const weekMins = minsOf(week);
  const cur = blend(coverage, weekDays, weekMins);

  // Coverage as it stood a week ago: today's, less what was cleared this week.
  const clearedThisWeek = week.reduce((n, d) => n + (d.courseChecks?.[slug] ?? 0), 0);
  const coveragePrev = totalCheckpoints > 0 ? Math.min(1, Math.max(0, done - clearedThisWeek) / totalCheckpoints) : 0;
  const prv = blend(coveragePrev, daysOf(prev), minsOf(prev));

  return {
    score: Math.round(cur.score),
    prev: Math.round(prv.score),
    delta: Math.round(cur.score) - Math.round(prv.score),
    parts: { coverage, consistency: cur.consistency, intensity: cur.intensity, effort: cur.effort },
    weekDays,
    weekMins: Math.round(weekMins),
  };
}

/**
 * The same score for the whole library — reads the day totals rather than the
 * per-course maps, which have been recorded since the store's first version,
 * so it has no attribution gap.
 */
export function overallPerformance(
  days: Record<string, StudyDay>,
  done: number,
  totalCheckpoints: number,
): Performance {
  const coverage = totalCheckpoints > 0 ? Math.min(1, done / totalCheckpoints) : 0;

  const fortnight = studyHistory(days, 14);
  const week = fortnight.slice(7);
  const prev = fortnight.slice(0, 7);

  const daysOf = (w: (StudyDay & { date: string })[]) =>
    w.filter((d) => d.secs >= STUDY_DAY_MIN_SECS || d.checks > 0).length;
  const minsOf = (w: (StudyDay & { date: string })[]) => w.reduce((n, d) => n + d.secs, 0) / 60;

  const weekDays = daysOf(week);
  const weekMins = minsOf(week);
  const cur = blend(coverage, weekDays, weekMins);

  const clearedThisWeek = week.reduce((n, d) => n + d.checks, 0);
  const coveragePrev = totalCheckpoints > 0 ? Math.min(1, Math.max(0, done - clearedThisWeek) / totalCheckpoints) : 0;
  const prv = blend(coveragePrev, daysOf(prev), minsOf(prev));

  return {
    score: Math.round(cur.score),
    prev: Math.round(prv.score),
    delta: Math.round(cur.score) - Math.round(prv.score),
    parts: { coverage, consistency: cur.consistency, intensity: cur.intensity, effort: cur.effort },
    weekDays,
    weekMins: Math.round(weekMins),
  };
}

/**
 * The overall score recomputed for each of the last `span` days — the
 * Performance tile's sparkline. Every point uses the same blend, evaluated as
 * the score stood that day: coverage is the cumulative checkpoint record up to
 * that day, and effort is the seven days ending on it. Six extra days are read
 * behind the window to fill each day's trailing week; the line ends exactly on
 * today's number.
 */
export function overallScoreHistory(
  days: Record<string, StudyDay>,
  done: number,
  totalCheckpoints: number,
  span = 14,
): number[] {
  if (totalCheckpoints <= 0) return [];
  const padded = studyHistory(days, span + 6);
  const start = padded.length - span;
  const out: number[] = [];
  for (let i = start; i < padded.length; i++) {
    let clearedAfter = 0;
    for (let j = i + 1; j < padded.length; j++) clearedAfter += padded[j].checks;
    const coverage = Math.min(1, Math.max(0, done - clearedAfter) / totalCheckpoints);
    const seven = padded.slice(Math.max(0, i - 6), i + 1);
    const weekDays = seven.filter((d) => d.secs >= STUDY_DAY_MIN_SECS || d.checks > 0).length;
    const weekMins = seven.reduce((n, d) => n + d.secs, 0) / 60;
    out.push(blend(coverage, weekDays, weekMins).score);
  }
  return out;
}
