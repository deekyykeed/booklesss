"use client";

import { useSyncExternalStore } from "react";
import { checkpointsFor } from "./course";
import { courseForNode } from "./courses";

/* ------------------------------------------------------------------ *
 * Step progress — which checkpoints a reader has cleared, and what each day
 * of studying actually held.
 *
 * A step's checkpoints are its sections (see checkpointsFor). Clear them all
 * and the step is complete; the ring in the sidebar, the right panel and the
 * lesson header all read the same numbers from here.
 *
 * localStorage is an external mutable store that doesn't exist during SSR, so
 * this is a useSyncExternalStore store rather than state-plus-an-effect:
 * React renders the server snapshot (nothing cleared), then swaps to the real
 * one after mount without a hydration mismatch and without a cascading render.
 *
 * Storage is scoped per signed-in user so two people on one machine don't
 * inherit each other's progress. Nothing is on the server yet — the shape
 * below is deliberately what `progress` and `study_days` rows would hold, so
 * syncing later is a write-through, not a rewrite.
 * ------------------------------------------------------------------ */

const KEY = "booklesss:progress:v3";
/** v2 stored study days as a bare date list — no counts, no time. */
const V2_KEY = "booklesss:progress:v2";
/** v1 stored the bare lessonId -> checkpoint ids map, with no dates at all. */
const V1_KEY = "booklesss:progress:v1";

/** What one day of studying held. */
export type StudyDay = {
  /** Checkpoints cleared that day. */
  checks: number;
  /** Seconds spent reading, measured by StudyClock — see its accrual rules. */
  secs: number;
  /** Steps whose final checkpoint was cleared that day. Counts completion
   *  events — un-ticking later doesn't erase the day the step was finished. */
  steps: number;
  /** Seconds per course slug, summing (bar rounding) to `secs`. Optional and
   *  additive: days recorded before this field shipped have the total only,
   *  and the chart draws course lines only from where this data starts —
   *  a zero here would be an invention, not a measurement. */
  courses?: Record<string, number>;
  /** Checkpoints per course slug, summing to `checks`. Same additive rule as
   *  `courses`: days recorded before this field shipped carry the total only,
   *  and per-course velocity is measured only from where this data starts. */
  courseChecks?: Record<string, number>;
};

/** What a lesson's comprehension checks have shown: how many were answered
 *  there, and how many of those were right at the first attempt. First-try is
 *  the honest signal — a question answered right on the third go proves the
 *  explanation worked, not that it was known. */
export type QuizRecord = { first: number; total: number };

type State = {
  /** lessonId -> cleared checkpoint ids. */
  done: Record<string, string[]>;
  /** Local ISO date (yyyy-mm-dd) -> what that day held. A date appears only
   *  once something has been recorded against it. */
  days: Record<string, StudyDay>;
  /** lessonId -> the local date it was last read or worked. What review debt
   *  is measured from; only accrues from the day this field shipped, so a
   *  lesson finished before then is untouched until it's next opened. */
  touched: Record<string, string>;
  /** lessonId -> its comprehension-check record. */
  quiz: Record<string, QuizRecord>;
};

/* A day counts toward the streak once it carries a cleared checkpoint or two
 * minutes of reading. Without a floor, opening a step and closing it again
 * would mint a study day, which would make the streak flattering rather than
 * true. */
export const STUDY_DAY_MIN_SECS = 120;

const counts = (d: StudyDay | undefined) => (d ? d.checks > 0 || d.secs >= STUDY_DAY_MIN_SECS : false);

/** Whether a day clears the bar above. Exported so callers measuring weeks
 *  count the same days the streak does. */
export const isStudyDay = counts;

type Snapshot = {
  /** Signed-in user id, or null for the shared anonymous bucket. */
  scope: string | null;
  state: State;
  /** False until localStorage has actually been read. */
  hydrated: boolean;
};

const EMPTY_STATE: State = { done: {}, days: {}, touched: {}, quiz: {} };
const EMPTY: Snapshot = { scope: null, state: EMPTY_STATE, hydrated: false };

/* Module-level: one reader per tab, so a singleton store is the whole state.
 * Snapshots are replaced, never mutated — useSyncExternalStore compares them
 * by identity to decide whether to re-render. */
let snapshot: Snapshot = EMPTY;

const listeners = new Set<() => void>();
const emit = () => {
  for (const l of listeners) l();
};

const storageKey = (scope: string | null, key: string) => (scope ? `${key}:${scope}` : key);

/** Local calendar date, not UTC — a streak is about the reader's own days. */
function isoDay(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
const today = () => isoDay(new Date());

/** Strings only, and nothing that didn't survive as an array. */
function cleanMap(raw: unknown): Record<string, string[]> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (Array.isArray(v)) out[k] = v.filter((x): x is string => typeof x === "string");
  }
  return out;
}

const whole = (n: unknown) => (typeof n === "number" && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0);

/** Positive numbers keyed by course slug; anything else is dropped. */
function cleanCourses(raw: unknown): Record<string, number> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const out: Record<string, number> = {};
  for (const [slug, v] of Object.entries(raw)) {
    const n = whole(v);
    if (n) out[slug] = n;
  }
  return Object.keys(out).length ? out : undefined;
}

/** lessonId -> yyyy-mm-dd. Anything that isn't a plain date string goes. */
function cleanDates(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) out[k] = v;
  }
  return out;
}

/** lessonId -> quiz record. A record claiming more first-try answers than
 *  answers is clamped rather than trusted. */
function cleanQuiz(raw: unknown): Record<string, QuizRecord> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, QuizRecord> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!v || typeof v !== "object") continue;
    const total = whole((v as QuizRecord).total);
    const first = Math.min(total, whole((v as QuizRecord).first));
    if (total) out[k] = { first, total };
  }
  return out;
}

/** Dates mapped to a day record. Anything that isn't one is dropped. */
function cleanDays(raw: unknown): Record<string, StudyDay> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, StudyDay> = {};
  for (const [date, v] of Object.entries(raw)) {
    if (!v || typeof v !== "object") continue;
    const day: StudyDay = {
      checks: whole((v as StudyDay).checks),
      secs: whole((v as StudyDay).secs),
      steps: whole((v as StudyDay).steps),
    };
    const courses = cleanCourses((v as StudyDay).courses);
    if (courses) day.courses = courses;
    const courseChecks = cleanCourses((v as StudyDay).courseChecks);
    if (courseChecks) day.courseChecks = courseChecks;
    if (day.checks || day.secs || day.steps) out[date] = day;
  }
  return out;
}

function read(scope: string | null): State {
  try {
    const raw = localStorage.getItem(storageKey(scope, KEY));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return {
          done: cleanMap((parsed as { done?: unknown }).done),
          days: cleanDays((parsed as { days?: unknown }).days),
          touched: cleanDates((parsed as { touched?: unknown }).touched),
          quiz: cleanQuiz((parsed as { quiz?: unknown }).quiz),
        };
      }
    }

    /* Migrate v2. It recorded that a day happened, but not how much was done on
     * it and not for how long. Each of its dates comes across as one checkpoint
     * and no time — the floor, since v2 only ever wrote a date when a checkpoint
     * was cleared. The streak and the day count survive intact, the chart starts
     * from what can be proved, and nothing invents a duration that was never
     * measured. Real numbers accrue from the next session on. */
    const v2 = localStorage.getItem(storageKey(scope, V2_KEY));
    if (v2) {
      const parsed = JSON.parse(v2);
      const rawDays: unknown = (parsed as { days?: unknown })?.days;
      const days: Record<string, StudyDay> = {};
      if (Array.isArray(rawDays)) {
        for (const d of rawDays) if (typeof d === "string") days[d] = { checks: 1, secs: 0, steps: 0 };
      }
      return { done: cleanMap((parsed as { done?: unknown })?.done), days, touched: {}, quiz: {} };
    }

    /* Migrate whoever is still on v1. Their dates are genuinely unknown, so days
     * starts empty rather than backfilled with invented ones — a streak begins
     * the next time they study. */
    const v1 = localStorage.getItem(storageKey(scope, V1_KEY));
    if (v1) return { done: cleanMap(JSON.parse(v1)), days: {}, touched: {}, quiz: {} };
    return EMPTY_STATE;
  } catch {
    return EMPTY_STATE; // private mode, quota, or malformed JSON
  }
}

function persist(scope: string | null, state: State) {
  try {
    localStorage.setItem(storageKey(scope, KEY), JSON.stringify(state));
  } catch {
    /* private mode / quota — progress stays in memory for this session */
  }
}

function load(scope: string | null) {
  snapshot = { scope, state: read(scope), hydrated: true };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // First subscriber on the client pulls in what's stored. React re-reads the
  // snapshot straight after subscribing, so the loaded data lands immediately.
  if (!snapshot.hydrated) load(snapshot.scope);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => EMPTY;

/** Today's row, with whatever is already on it. */
const dayAt = (days: Record<string, StudyDay>, date: string): StudyDay =>
  days[date] ?? { checks: 0, secs: 0, steps: 0 };

/**
 * @param markToday true when the change represents studying (clearing a
 *   checkpoint), which is what credits the day. Un-ticking and resetting don't.
 */
function mutate(lessonId: string, next: (prev: string[]) => string[], markToday: boolean) {
  const prev = snapshot.state.done[lessonId] ?? [];
  const list = next(prev);
  const done = { ...snapshot.state.done, [lessonId]: list };
  if (!list.length) delete done[lessonId]; // don't store empty rows

  let days = snapshot.state.days;
  // Credit what was actually cleared, so finishing a whole step in one go
  // counts as the several checkpoints it was, not as one.
  const added = Math.max(0, list.length - prev.length);
  // A step is finished the moment its last checkpoint clears — that event is
  // what the steps series records, so it's detected here rather than derived
  // later (the store can't reconstruct WHEN a step completed after the fact).
  const ids = checkpointsFor(lessonId);
  const covers = (l: string[]) => ids.length > 0 && ids.every((id) => l.includes(id));
  const finished = markToday && !covers(prev) && covers(list) ? 1 : 0;
  if (markToday && (added || finished)) {
    const t = today();
    const day = dayAt(days, t);
    const next_: StudyDay = { ...day, checks: day.checks + added, steps: day.steps + finished };
    // The same checkpoints, attributed to their course — what per-course
    // velocity is measured from. A lesson no course claims credits nothing.
    const slug = added ? courseForNode(lessonId)?.slug : undefined;
    if (slug) next_.courseChecks = { ...day.courseChecks, [slug]: (day.courseChecks?.[slug] ?? 0) + added };
    days = { ...days, [t]: next_ };
  }

  /* Working a lesson refreshes it — that is what stops review debt from
   * accruing against a step you are actually keeping up with. */
  const touched = markToday ? { ...snapshot.state.touched, [lessonId]: today() } : snapshot.state.touched;

  const state = { ...snapshot.state, done, days, touched };
  snapshot = { ...snapshot, state };
  persist(snapshot.scope, state);
  emit();
}

/**
 * Record the outcome of a comprehension check. Called once per question the
 * moment it is first answered correctly, with whether that was the first
 * attempt — the reader gets the tick either way, but only a first-attempt
 * answer counts toward knowing it.
 */
export function recordCheck(lessonId: string, firstTry: boolean) {
  if (!snapshot.hydrated) return;
  const prev = snapshot.state.quiz[lessonId] ?? { first: 0, total: 0 };
  const state = {
    ...snapshot.state,
    quiz: {
      ...snapshot.state.quiz,
      [lessonId]: { first: prev.first + (firstTry ? 1 : 0), total: prev.total + 1 },
    },
  };
  snapshot = { ...snapshot, state };
  persist(snapshot.scope, state);
  emit();
}

/**
 * Credit reading time to today. Called by StudyClock, which decides what
 * counts as reading — this only stores it.
 *
 * Persists on every call but re-renders only when the displayed minute rolls
 * over: the clock ticks four times a minute and the sidebar has a ring per
 * step, so emitting each tick would re-render the whole reader for a number
 * nobody can see change.
 */
export function addStudySeconds(secs: number, course?: string, lessonId?: string) {
  const n = Math.floor(secs);
  if (!snapshot.hydrated || n <= 0) return;

  const t = today();
  const day = dayAt(snapshot.state.days, t);
  const updated: StudyDay = { ...day, secs: day.secs + n };
  // The same seconds, attributed — so the chart can draw one line per course.
  if (course) updated.courses = { ...day.courses, [course]: (day.courses?.[course] ?? 0) + n };
  const state = {
    ...snapshot.state,
    days: { ...snapshot.state.days, [t]: updated },
    // Reading a step counts as touching it, so revisiting clears its debt
    // without needing to re-tick anything.
    touched: lessonId ? { ...snapshot.state.touched, [lessonId]: t } : snapshot.state.touched,
  };
  snapshot = { ...snapshot, state };
  persist(snapshot.scope, state);

  const crossedMinute = Math.floor(day.secs / 60) !== Math.floor(updated.secs / 60);
  // The floor is what turns a day into a study day, so crossing it has to show.
  const crossedFloor = day.secs < STUDY_DAY_MIN_SECS && updated.secs >= STUDY_DAY_MIN_SECS;
  if (crossedMinute || crossedFloor) emit();
}

/** Namespaces storage to a user. Pass null when signed out. */
export function setProgressScope(scope: string | null) {
  if (snapshot.hydrated && snapshot.scope === scope) return;
  load(scope);
}

/** Consecutive study days ending today (or yesterday — today isn't over). */
function streakFrom(days: Record<string, StudyDay>): number {
  const cursor = new Date();
  // A streak shouldn't break just because you haven't studied yet today.
  if (!counts(days[isoDay(cursor)])) {
    cursor.setDate(cursor.getDate() - 1);
    if (!counts(days[isoDay(cursor)])) return 0;
  }
  let n = 0;
  while (counts(days[isoDay(cursor)])) {
    n++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

/** The longest run of consecutive study days ever recorded. */
function longestStreakFrom(days: Record<string, StudyDay>): number {
  const dates = Object.keys(days).filter((d) => counts(days[d])).sort();
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const date of dates) {
    const [y, m, d] = date.split("-").map(Number);
    const t = Date.UTC(y, m - 1, d);
    // Compare in whole UTC days: the dates are already local calendar days, so
    // this is date arithmetic, not a timezone conversion.
    run = prev !== null && t - prev === 86_400_000 ? run + 1 : 1;
    prev = t;
    if (run > best) best = run;
  }
  return best;
}

/** The current consecutive-day run on one course, counted the way the app
 *  streak is: the same seconds bar, measured against the course's own
 *  recorded time (checkpoints aren't recorded per course), and the run
 *  doesn't break just because today hasn't been studied yet. */
export function courseStreak(days: Record<string, StudyDay>, slug: string): number {
  const qualifies = (date: string) => (days[date]?.courses?.[slug] ?? 0) >= STUDY_DAY_MIN_SECS;
  const cursor = new Date();
  if (!qualifies(isoDay(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!qualifies(isoDay(cursor))) return 0;
  }
  let n = 0;
  while (qualifies(isoDay(cursor))) {
    n++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

/** The streak as it stood at the end of each of the last `span` days —
 *  the series a sparkline can plot. No "today isn't over" grace here: a day
 *  either qualified or it didn't. */
export function streakSeries(days: Record<string, StudyDay>, span: number): number[] {
  const out: number[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - (span - 1));
  for (let i = 0; i < span; i++) {
    let n = 0;
    const c = new Date(cursor);
    while (counts(days[isoDay(c)])) {
      n++;
      c.setDate(c.getDate() - 1);
    }
    out.push(n);
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

/** How many of the last `span` days cleared the study bar. The forgiving twin
 *  of the streak: six days out of seven still reads as six, not as broken. */
export function daysStudiedIn(days: Record<string, StudyDay>, span = 7): number {
  return studyHistory(days, span).filter(counts).length;
}

/** First-try answers against answers given, across every lesson. */
export function firstTryStats(quiz: Record<string, QuizRecord>): { first: number; total: number } {
  let first = 0;
  let total = 0;
  for (const q of Object.values(quiz)) {
    first += q.first;
    total += q.total;
  }
  return { first, total };
}

/** The lesson answered worst at the first attempt. Needs a few answers before
 *  it will name anything — one missed question is a bad day, not a weakness. */
export function weakestLesson(
  quiz: Record<string, QuizRecord>,
  minAnswered = 3,
): { lessonId: string; first: number; total: number } | null {
  let worst: { lessonId: string; first: number; total: number } | null = null;
  for (const [lessonId, q] of Object.entries(quiz)) {
    if (q.total < minAnswered || q.first === q.total) continue;
    if (!worst || q.first / q.total < worst.first / worst.total) worst = { lessonId, ...q };
  }
  return worst;
}

/** Finished steps not opened in `after` days, oldest first — what is going
 *  stale. Only steps that were completed: an unfinished one isn't owed a
 *  review, it's owed the rest of itself. */
export function staleLessons(
  done: Record<string, string[]>,
  touched: Record<string, string>,
  after = 21,
): { lessonId: string; date: string; days: number }[] {
  const now = new Date();
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const out: { lessonId: string; date: string; days: number }[] = [];
  for (const [lessonId, cleared] of Object.entries(done)) {
    const ids = checkpointsFor(lessonId);
    if (!ids.length || !ids.every((id) => cleared.includes(id))) continue;
    const date = touched[lessonId];
    if (!date) continue; // never touched since the field shipped — nothing measured
    const [y, m, d] = date.split("-").map(Number);
    const age = Math.round((todayUTC - Date.UTC(y, m - 1, d)) / 86_400_000);
    if (age >= after) out.push({ lessonId, date, days: age });
  }
  return out.sort((a, b) => b.days - a.days);
}

/** One entry per day from `from` to today, gaps filled with zeroes. */
export function studyHistory(days: Record<string, StudyDay>, span: number): (StudyDay & { date: string })[] {
  const out: (StudyDay & { date: string })[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - (span - 1));
  for (let i = 0; i < span; i++) {
    const date = isoDay(cursor);
    out.push({ date, ...dayAt(days, date) });
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

export type ProgressApi = {
  /** Gate progress-dependent UI on this, or the server HTML (which knows
   *  nothing) won't match what the client renders. */
  hydrated: boolean;
  isDone: (lessonId: string, checkpointId: string) => boolean;
  doneCount: (lessonId: string) => number;
  /** 0..1 across the lesson's checkpoints. */
  ratio: (lessonId: string) => number;
  isComplete: (lessonId: string) => boolean;
  toggle: (lessonId: string, checkpointId: string) => void;
  completeAll: (lessonId: string) => void;
  reset: (lessonId: string) => void;
  /** Consecutive days studied, ending today or yesterday. */
  streak: number;
  /** The longest such run ever recorded. */
  bestStreak: number;
  /** Days that carry a checkpoint or at least STUDY_DAY_MIN_SECS of reading. */
  daysStudied: number;
  /** True if today has crossed that same bar. */
  studiedToday: boolean;
  /** Total seconds read, all time. */
  totalSecs: number;
  /** Every recorded day, for the activity chart. */
  days: Record<string, StudyDay>;
  /** lessonId -> its comprehension-check record. */
  quiz: Record<string, QuizRecord>;
  /** lessonId -> the date it was last read or worked. */
  touched: Record<string, string>;
  /** Cleared checkpoints per lesson, for staleness. */
  done: Record<string, string[]>;
};

export function useProgress(): ProgressApi {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { done, days } = snap.state;

  /* Counts are taken against the lesson's CURRENT checkpoints, so a section
   * removed upstream stops inflating anyone's total. */
  const validDone = (lessonId: string) => {
    const valid = new Set(checkpointsFor(lessonId));
    return (done[lessonId] ?? []).filter((id) => valid.has(id)).length;
  };

  return {
    hydrated: snap.hydrated,
    isDone: (lessonId, checkpointId) => (done[lessonId] ?? []).includes(checkpointId),
    doneCount: validDone,
    ratio: (lessonId) => {
      const total = checkpointsFor(lessonId).length;
      return total ? validDone(lessonId) / total : 0;
    },
    isComplete: (lessonId) => {
      const total = checkpointsFor(lessonId).length;
      return total > 0 && validDone(lessonId) === total;
    },
    toggle: (lessonId, checkpointId) => {
      const adding = !(done[lessonId] ?? []).includes(checkpointId);
      mutate(
        lessonId,
        (prev) =>
          prev.includes(checkpointId)
            ? prev.filter((id) => id !== checkpointId)
            : [...prev, checkpointId],
        adding,
      );
    },
    completeAll: (lessonId) => mutate(lessonId, () => checkpointsFor(lessonId), true),
    reset: (lessonId) => mutate(lessonId, () => [], false),
    streak: snap.hydrated ? streakFrom(days) : 0,
    bestStreak: snap.hydrated ? longestStreakFrom(days) : 0,
    daysStudied: snap.hydrated ? Object.values(days).filter(counts).length : 0,
    studiedToday: snap.hydrated && counts(days[today()]),
    totalSecs: snap.hydrated ? Object.values(days).reduce((n, d) => n + d.secs, 0) : 0,
    days: snap.hydrated ? days : EMPTY_STATE.days,
    quiz: snap.hydrated ? snap.state.quiz : EMPTY_STATE.quiz,
    touched: snap.hydrated ? snap.state.touched : EMPTY_STATE.touched,
    done: snap.hydrated ? done : EMPTY_STATE.done,
  };
}
