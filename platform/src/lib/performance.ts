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
 *   velocity     checkpoints cleared this week, against the weekly rate
 *                the course actually needs: remaining work spread over the
 *                weeks to the exam when a date is set, a steady 4-a-week
 *                otherwise. Output of effort, not duration — reading time
 *                can idle in a tab; a cleared checkpoint can't.
 *   schedule     only when the course has an exam date: coverage against
 *                how far along the runway is, measured from the first day
 *                this course was ever read to the exam
 *
 * Weights favour coverage but leave real room for effort, so a reader who
 * shows up all week moves the number even before much of the course is
 * covered.
 * ------------------------------------------------------------------ */

/** Exam dates by course slug (yyyy-mm-dd), owner-maintained. A course with a
 *  date gets the schedule term in its score and a velocity target derived
 *  from the real deadline; without one the score rests on the measurable
 *  terms and a steady default rate. */
export const EXAM_DATES: Record<string, string> = {};

/** Weekly checkpoint rate that earns full velocity marks when no exam date
 *  sets a real one. */
const DEFAULT_WEEKLY_CHECKS = 4;

export type Performance = {
  /** 0..100, rounded. */
  score: number;
  /** Each term 0..1; schedule is null when no exam date is set (or nothing
   *  has been read yet, so there is no runway to judge). */
  parts: { coverage: number; consistency: number; velocity: number; schedule: number | null };
  /** Checkpoints cleared in the last 7 days — the effort velocity measures. */
  weekChecks: number;
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

  /* This week, from the same history the card's curve draws. */
  const week = studyHistory(days, 7);
  const weekDays = week.filter((d) => (d.courses?.[slug] ?? 0) >= STUDY_DAY_MIN_SECS).length;
  const weekChecks = week.reduce((n, d) => n + (d.courseChecks?.[slug] ?? 0), 0);

  const consistency = Math.min(1, weekDays / 5);

  const exam = EXAM_DATES[slug];
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  /* The rate the course actually needs: remaining checkpoints spread over
   * the weeks left to the exam, or the steady default without a date. */
  let target = DEFAULT_WEEKLY_CHECKS;
  if (exam && dayUTC(exam) > today) {
    const weeksLeft = Math.max(1, (dayUTC(exam) - today) / (7 * 86_400_000));
    target = Math.max(1, Math.ceil((totalCheckpoints - done) / weeksLeft));
  }
  const velocity = Math.min(1, weekChecks / target);

  let schedule: number | null = null;
  if (exam) {
    const first = Object.keys(days)
      .filter((d) => (days[d].courses?.[slug] ?? 0) > 0)
      .sort()[0];
    if (first) {
      const runway = dayUTC(exam) - dayUTC(first);
      const gone = Math.min(Math.max(today - dayUTC(first), 0), runway);
      const expected = runway > 0 ? gone / runway : 1;
      schedule = expected > 0 ? Math.min(1, coverage / expected) : 1;
    }
  }

  const score =
    schedule === null
      ? 45 * coverage + 30 * consistency + 25 * velocity
      : 35 * coverage + 25 * consistency + 15 * velocity + 25 * schedule;

  return { score: Math.round(score), parts: { coverage, consistency, velocity, schedule }, weekChecks, weekDays };
}
