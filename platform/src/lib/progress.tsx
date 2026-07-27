"use client";

import { useSyncExternalStore } from "react";
import { checkpointsFor } from "./course";

/* ------------------------------------------------------------------ *
 * Step progress — which checkpoints a reader has cleared, and which days
 * they studied on.
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

const KEY = "booklesss:progress:v2";
/** v1 stored the bare lessonId -> checkpoint ids map, with no dates. */
const LEGACY_KEY = "booklesss:progress:v1";

type State = {
  /** lessonId -> cleared checkpoint ids. */
  done: Record<string, string[]>;
  /** Local ISO dates (yyyy-mm-dd) on which at least one checkpoint was
   *  cleared. This is what makes a study streak a fact rather than a guess. */
  days: string[];
};

type Snapshot = {
  /** Signed-in user id, or null for the shared anonymous bucket. */
  scope: string | null;
  state: State;
  /** False until localStorage has actually been read. */
  hydrated: boolean;
};

const EMPTY_STATE: State = { done: {}, days: [] };
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
function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Strings only, and nothing that didn't survive as an array. */
function cleanMap(raw: unknown): Record<string, string[]> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (Array.isArray(v)) out[k] = v.filter((x): x is string => typeof x === "string");
  }
  return out;
}

function read(scope: string | null): State {
  try {
    const raw = localStorage.getItem(storageKey(scope, KEY));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const rawDays: unknown = (parsed as { days?: unknown }).days;
        const days: string[] = Array.isArray(rawDays)
          ? rawDays.filter((d): d is string => typeof d === "string")
          : [];
        return {
          done: cleanMap((parsed as { done?: unknown }).done),
          days: [...new Set(days)].sort(),
        };
      }
    }
    /* Migrate whoever already has v1 progress. Their dates are genuinely
     * unknown, so days starts empty rather than backfilled with invented
     * ones — a streak begins the next time they study. */
    const legacy = localStorage.getItem(storageKey(scope, LEGACY_KEY));
    if (legacy) return { done: cleanMap(JSON.parse(legacy)), days: [] };
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

/**
 * @param markToday true when the change represents studying (clearing a
 *   checkpoint), which is what stamps the day. Un-ticking and resetting don't.
 */
function mutate(lessonId: string, next: (prev: string[]) => string[], markToday: boolean) {
  const done = { ...snapshot.state.done, [lessonId]: next(snapshot.state.done[lessonId] ?? []) };
  if (!done[lessonId].length) delete done[lessonId]; // don't store empty rows

  let days = snapshot.state.days;
  if (markToday) {
    const t = today();
    if (!days.includes(t)) days = [...days, t].sort();
  }

  const state = { done, days };
  snapshot = { ...snapshot, state };
  persist(snapshot.scope, state);
  emit();
}

/** Namespaces storage to a user. Pass null when signed out. */
export function setProgressScope(scope: string | null) {
  if (snapshot.hydrated && snapshot.scope === scope) return;
  load(scope);
}

/** Consecutive study days ending today (or yesterday — today isn't over). */
function streakFrom(days: string[]): number {
  if (!days.length) return 0;
  const set = new Set(days);
  const cursor = new Date();
  const iso = (d: Date) => {
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  };
  // A streak shouldn't break just because you haven't studied yet today.
  if (!set.has(iso(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(iso(cursor))) return 0;
  }
  let n = 0;
  while (set.has(iso(cursor))) {
    n++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
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
  /** Total distinct days with any checkpoint cleared. */
  daysStudied: number;
  /** True if a checkpoint was cleared today. */
  studiedToday: boolean;
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
    daysStudied: snap.hydrated ? days.length : 0,
    studiedToday: snap.hydrated && days.includes(today()),
  };
}
