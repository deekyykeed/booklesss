"use client";

import { useSyncExternalStore } from "react";
import { checkpointsFor } from "./course";

/* ------------------------------------------------------------------ *
 * Step progress — which checkpoints a reader has ticked off.
 *
 * A step's checkpoints are its sections (see checkpointsFor). Tick them all
 * and the step is complete; the ring in the sidebar, the right panel and the
 * lesson header all read the same numbers from here.
 *
 * localStorage is an external mutable store that doesn't exist during SSR, so
 * this is a useSyncExternalStore store rather than state-plus-an-effect:
 * React renders the server snapshot (nothing ticked), then swaps to the real
 * one after mount without a hydration mismatch and without a cascading render.
 *
 * Storage is scoped per signed-in user so two people on one machine don't
 * inherit each other's ticks. Nothing is on the server yet — the shape below
 * (lessonId -> checkpoint ids) is deliberately what a `progress` table row
 * would hold, so syncing later is a write-through, not a rewrite.
 * ------------------------------------------------------------------ */

const KEY = "booklesss:progress:v1";

/** lessonId -> completed checkpoint ids. */
type State = Record<string, string[]>;

type Snapshot = {
  /** Signed-in user id, or null for the shared anonymous bucket. */
  scope: string | null;
  data: State;
  /** False until localStorage has actually been read. */
  hydrated: boolean;
};

/* Module-level: one reader per tab, so a singleton store is the whole state.
 * Snapshots are replaced, never mutated — useSyncExternalStore compares them
 * by identity to decide whether to re-render. */
const EMPTY: Snapshot = { scope: null, data: {}, hydrated: false };
let snapshot: Snapshot = EMPTY;

const listeners = new Set<() => void>();
const emit = () => {
  for (const l of listeners) l();
};

const storageKey = (scope: string | null) => (scope ? `${KEY}:${scope}` : KEY);

function read(scope: string | null): State {
  try {
    const raw = localStorage.getItem(storageKey(scope));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    // Trust nothing that round-tripped through storage — a hand-edited or
    // half-written value must not take the reader down.
    const out: State = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (Array.isArray(v)) out[k] = v.filter((x): x is string => typeof x === "string");
    }
    return out;
  } catch {
    return {}; // private mode, quota, or malformed JSON
  }
}

function persist(scope: string | null, data: State) {
  try {
    localStorage.setItem(storageKey(scope), JSON.stringify(data));
  } catch {
    /* private mode / quota — progress stays in memory for this session */
  }
}

function load(scope: string | null) {
  snapshot = { scope, data: read(scope), hydrated: true };
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

function mutate(lessonId: string, next: (prev: string[]) => string[]) {
  const data = { ...snapshot.data, [lessonId]: next(snapshot.data[lessonId] ?? []) };
  if (!data[lessonId].length) delete data[lessonId]; // don't store empty rows
  snapshot = { ...snapshot, data };
  persist(snapshot.scope, data);
  emit();
}

/** Namespaces storage to a user. Pass null when signed out. */
export function setProgressScope(scope: string | null) {
  if (snapshot.hydrated && snapshot.scope === scope) return;
  load(scope);
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
};

export function useProgress(): ProgressApi {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /* Counts are taken against the lesson's CURRENT checkpoints, so a section
   * removed upstream stops inflating anyone's total. */
  const validDone = (lessonId: string) => {
    const valid = new Set(checkpointsFor(lessonId));
    return (snap.data[lessonId] ?? []).filter((id) => valid.has(id)).length;
  };

  return {
    hydrated: snap.hydrated,
    isDone: (lessonId, checkpointId) => (snap.data[lessonId] ?? []).includes(checkpointId),
    doneCount: validDone,
    ratio: (lessonId) => {
      const total = checkpointsFor(lessonId).length;
      return total ? validDone(lessonId) / total : 0;
    },
    isComplete: (lessonId) => {
      const total = checkpointsFor(lessonId).length;
      return total > 0 && validDone(lessonId) === total;
    },
    toggle: (lessonId, checkpointId) =>
      mutate(lessonId, (prev) =>
        prev.includes(checkpointId)
          ? prev.filter((id) => id !== checkpointId)
          : [...prev, checkpointId],
      ),
    completeAll: (lessonId) => mutate(lessonId, () => checkpointsFor(lessonId)),
    reset: (lessonId) => mutate(lessonId, () => []),
  };
}
