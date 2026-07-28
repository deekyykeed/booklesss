import { STUDY_DAY_MIN_SECS, studyHistory, type StudyDay } from "./progress";

/* ------------------------------------------------------------------ *
 * The course performance score — one number that praises effort.
 *
 * Everything in it is measured, and each term is a 0..1 the reader could
 * recompute by hand:
 *
 *   coverage     how much of the course's checkpoints are cleared
 *   consistency  study days this week, against a 5-of-7 target — showing
 *                up most days is full marks, not showing up every day
 *   momentum     this week's reading time against last week's — holding
 *                steady is full marks, fading costs
 *   schedule     only when the course has an exam date: coverage against
 *                how far along the runway is, measured from the first day
 *                this course was ever read to the exam
 *
 * Weights favour coverage but leave real room for effort, so a reader who
 * shows up all week moves the number even before the checkpoints land.
 * ------------------------------------------------------------------ */

/** Exam dates by course slug (yyyy-mm-dd), owner-maintained. A course with a
 *  date gets the schedule term in its score; without one the score rests on
 *  the three measurable terms alone. */
export const EXAM_DATES: Record<string, string> = {};

export type Performance = {
  /** 0..100, rounded. */
  score: number;
  /** Each term 0..1; schedule is null when no exam date is set (or nothing
   *  has been read yet, so there is no runway to judge). */
  parts: { coverage: number; consistency: number; momentum: number; schedule: number | null };
  /** Seconds read in the last 7 days — the effort the score is praising. */
  weekSecs: number;
  /** Qualifying study days in the last 7. */
  weekDays: number;
};

const dayUTC = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

export function coursePerformance(
  days: Record<string, StudyDay>,
  slug: string,
  done: number,
  totalCheckpoints: number,
): Performance {
  const coverage = totalCheckpoints > 0 ? Math.min(1, done / totalCheckpoints) : 0;

  /* The same fortnight the card's curve draws, split into last week and
   * this week. */
  const secs = studyHistory(days, 14).map((d) => d.courses?.[slug] ?? 0);
  const prev = secs.slice(0, 7).reduce((a, b) => a + b, 0);
  const week = secs.slice(7);
  const weekSecs = week.reduce((a, b) => a + b, 0);
  const weekDays = week.filter((s) => s >= STUDY_DAY_MIN_SECS).length;

  const consistency = Math.min(1, weekDays / 5);
  const momentum = weekSecs === 0 ? 0 : prev === 0 ? 1 : Math.min(1, weekSecs / prev);

  let schedule: number | null = null;
  const exam = EXAM_DATES[slug];
  if (exam) {
    const first = Object.keys(days)
      .filter((d) => (days[d].courses?.[slug] ?? 0) > 0)
      .sort()[0];
    if (first) {
      const now = new Date();
      const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      const runway = dayUTC(exam) - dayUTC(first);
      const gone = Math.min(Math.max(today - dayUTC(first), 0), runway);
      const expected = runway > 0 ? gone / runway : 1;
      schedule = expected > 0 ? Math.min(1, coverage / expected) : 1;
    }
  }

  const score =
    schedule === null
      ? 45 * coverage + 30 * consistency + 25 * momentum
      : 35 * coverage + 25 * consistency + 15 * momentum + 25 * schedule;

  return { score: Math.round(score), parts: { coverage, consistency, momentum, schedule }, weekSecs, weekDays };
}
