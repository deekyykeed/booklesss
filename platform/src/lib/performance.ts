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
  /** Points moved since a week ago: the score minus the same score computed
   *  with every window shifted back 7 days. Positive is climbing. */
  delta: number;
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

  /* Both weeks of the same fortnight the card's curve draws: the newest 7
   * are this week's terms, the older 7 rebuild last week's score for the
   * delta. */
  const fortnight = studyHistory(days, 14);
  const week = fortnight.slice(7);
  const prevWeek = fortnight.slice(0, 7);
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

  const weigh = (cov: number, con: number, vel: number, sch: number | null) =>
    sch === null ? 45 * cov + 30 * con + 25 * vel : 35 * cov + 25 * con + 15 * vel + 25 * sch;

  const score = weigh(coverage, consistency, velocity, schedule);

  /* The same score as it stood a week ago: coverage rolled back by this
   * week's cleared checkpoints, effort terms from the older week, schedule
   * against a runway seven days shorter. courseChecks only accrues from the
   * day it shipped, so early deltas move on effort alone rather than
   * inventing a coverage history. */
  const prevDays = prevWeek.filter((d) => (d.courses?.[slug] ?? 0) >= STUDY_DAY_MIN_SECS).length;
  const prevChecks = prevWeek.reduce((n, d) => n + (d.courseChecks?.[slug] ?? 0), 0);
  const coveragePrev = totalCheckpoints > 0 ? Math.min(1, Math.max(0, done - weekChecks) / totalCheckpoints) : 0;
  let schedulePrev: number | null = null;
  if (schedule !== null && exam) {
    const first = Object.keys(days)
      .filter((d) => (days[d].courses?.[slug] ?? 0) > 0)
      .sort()[0]!;
    const runway = dayUTC(exam) - dayUTC(first);
    const gone = Math.min(Math.max(today - 7 * 86_400_000 - dayUTC(first), 0), runway);
    const expected = runway > 0 ? gone / runway : 1;
    schedulePrev = expected > 0 ? Math.min(1, coveragePrev / expected) : 1;
  }
  const scorePrev = weigh(coveragePrev, Math.min(1, prevDays / 5), Math.min(1, prevChecks / target), schedulePrev);

  return {
    score: Math.round(score),
    delta: Math.round(score) - Math.round(scorePrev),
    parts: { coverage, consistency, velocity, schedule },
    weekChecks,
    weekDays,
  };
}

/**
 * The same score for the whole library — the figure the study chart carries.
 *
 * It reads the day totals (`secs`, `checks`) rather than the per-course maps,
 * which is both simpler and more honest: those totals have been recorded since
 * the store's first version, so an overall score has no attribution gap to
 * apologise for. No exam term — a library doesn't sit one exam.
 */
export function overallPerformance(
  days: Record<string, StudyDay>,
  done: number,
  totalCheckpoints: number,
): Performance {
  const coverage = totalCheckpoints > 0 ? Math.min(1, done / totalCheckpoints) : 0;

  const fortnight = studyHistory(days, 14);
  const week = fortnight.slice(7);
  const prevWeek = fortnight.slice(0, 7);

  const weekDays = week.filter((d) => d.secs >= STUDY_DAY_MIN_SECS || d.checks > 0).length;
  const weekChecks = week.reduce((n, d) => n + d.checks, 0);
  const prevDays = prevWeek.filter((d) => d.secs >= STUDY_DAY_MIN_SECS || d.checks > 0).length;
  const prevChecks = prevWeek.reduce((n, d) => n + d.checks, 0);

  /* One course's worth of weekly checkpoints per active course: a reader
   * carrying three courses is expected to move on more of them than one
   * carrying a single course. */
  const target = Math.max(1, DEFAULT_WEEKLY_CHECKS);

  const weigh = (cov: number, con: number, vel: number) => 45 * cov + 30 * con + 25 * vel;

  const score = weigh(coverage, Math.min(1, weekDays / 5), Math.min(1, weekChecks / target));
  const coveragePrev = totalCheckpoints > 0 ? Math.min(1, Math.max(0, done - weekChecks) / totalCheckpoints) : 0;
  const scorePrev = weigh(coveragePrev, Math.min(1, prevDays / 5), Math.min(1, prevChecks / target));

  return {
    score: Math.round(score),
    delta: Math.round(score) - Math.round(scorePrev),
    parts: {
      coverage,
      consistency: Math.min(1, weekDays / 5),
      velocity: Math.min(1, weekChecks / target),
      schedule: null,
    },
    weekChecks,
    weekDays,
  };
}
