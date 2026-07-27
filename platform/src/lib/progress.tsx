"use client";

import { useSyncExternalStore } from "react";
import { checkpointsFor } from "./course";

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
};

type State = {
  /** lessonId -> cleared checkpoint ids. */
  done: Record<string, string[]>;
  /** Local ISO date (yyyy-mm-dd) -> what that day held. A date appears only
   *  once something has been recorded against it. */
  days: Record<string, StudyDay>;
};

/* A day counts toward the streak once it carries a cleared checkpoint or two
 * minutes of reading. Without a floor, opening a step and closing it again
 * would mint a study day, which would make the streak flattering rather than
 * true. */
export const STUDY_DAY_MIN_SECS = 120;

const counts = (d: StudyDay | undefined) => (d ? d.checks > 0 || d.secs >= STUDY_DAY_MIN_SECS : false);

type Snapshot = {
  /** Signed-in user id, or null for the shared anonymous bucket. */
  scope: string | null;
  state: State;
  /** False until localStorage has actually been read. */
  hydrated: boolean;
};

const EMPTY_STATE: State = { done: {}, days: {} };
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

/** Dates mapped to a day record. Anything that isn't one is dropped. */
function cleanDays(raw: unknown): Record<string, StudyDay> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, StudyDay> = {};
  for (const [date, v] of Object.entries(raw)) {
    if (!v || typeof v !== "object") continue;
    const day = { checks: whole((v as StudyDay).checks), secs: whole((v as StudyDay).secs) };
    if (day.checks || day.secs) out[date] = day;
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
        for (const d of rawDays) if (typeof d === "string") days[d] = { checks: 1, secs: 0 };
      }
      return { done: cleanMap((parsed as { done?: unknown })?.done), days };
    }

    /* Migrate whoever is still on v1. Their dates are genuinely unknown, so days
     * starts empty rather than backfilled with invented ones — a streak begins
     * the next time they study. */
    const v1 = localStorage.getItem(storageKey(scope, V1_KEY));
    if (v1) return { done: cleanMap(JSON.parse(v1)), days: {} };
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
  days[date] ?? { checks: 0, secs: 0 };

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
  if (markToday && added) {
    const t = today();
    const day = dayAt(days, t);
    days = { ...days, [t]: { ...day, checks: day.checks + added } };
  }

  const state = { done, days };
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
export function addStudySeconds(secs: number) {
  const n = Math.floor(secs);
  if (!snapshot.hydrated || n <= 0) return;

  const t = today();
  const day = dayAt(snapshot.state.days, t);
  const updated = { ...day, secs: day.secs + n };
  const state = {
    done: snapshot.state.done,
    days: { ...snapshot.state.days, [t]: updated },
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
  /** Days that carry a checkpoint or at least STUDY_DAY_MIN_SECS of reading. */
  daysStudied: number;
  /** True if today has crossed that same bar. */
  studiedToday: boolean;
  /** Total seconds read, all time. */
  totalSecs: number;
  /** Every recorded day, for the activity chart. */
  days: Record<string, StudyDay>;
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
    daysStudied: snap.hydrated ? Object.values(days).filter(counts).length : 0,
    studiedToday: snap.hydrated && counts(days[today()]),
    totalSecs: snap.hydrated ? Object.values(days).reduce((n, d) => n + d.secs, 0) : 0,
    days: snap.hydrated ? days : EMPTY_STATE.days,
  };
}
