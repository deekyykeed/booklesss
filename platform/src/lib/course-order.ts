"use client";

import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ *
 * The order a student's own course cards appear in — theirs to set, not ours.
 *
 * Owner, 2026-08-07: "id like the ability to organise my courses manually so
 * i cn drag them above and below each other."
 *
 * DEVICE-ONLY, ON PURPOSE. Everything else about a student's courses (which
 * ones, their programme, their year) travels to the account so a second
 * device resumes with it — see lib/identity's three-copy system. Card order
 * is a much smaller thing to get wrong: threading it through that merge (a
 * new AccountIdentity field, a line in sameAnswers, a column on `students`)
 * is a lot of surface for "which shelf a book sits on", and losing it costs
 * a re-drag, not a re-answered onboarding. If cross-device order turns out to
 * matter, this is the seam to extend — not a reason to build it in from here.
 *
 * SLUGS, NOT INDICES. A slug survives a course being added or dropped; a
 * position 3 in an eight-item list means something different the moment the
 * list is seven items long, which it will be the day a pipeline course ships.
 * ------------------------------------------------------------------ */

const KEY = "booklesss-course-order";

let cache: string[] = [];
let read = false;
const listeners = new Set<() => void>();

function load(): string[] {
  if (read) return cache;
  read = true;
  if (typeof window === "undefined") return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot(): string[] {
  return load();
}

/** The saved order — empty until read, and empty for a student who has never
 *  dragged anything, which callers treat as "keep the natural order". */
export function useCourseOrder(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => cache);
}

/** Save a full order and tell every subscriber. Takes the complete list
 *  (already resolved through `applyOrder`) rather than a single move, so a
 *  drag started by a student who has never reordered anything still writes a
 *  real list — not just the one or two slugs somebody previously touched. */
export function saveCourseOrder(slugs: string[]) {
  cache = slugs;
  read = true;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(slugs));
  } catch {
    // Storage blocked (private mode, embedded webview) — order lives for
    // this visit only, same fallback every other local store in this app takes.
  }
  emit();
}

/** Lay a list out in the saved order. Anything saved but no longer in the
 *  list is dropped silently — a course that left "My courses" doesn't leave a
 *  gap. Anything in the list but never ordered (added after the student last
 *  dragged anything) is appended in ITS OWN natural order, so a newly enrolled
 *  course shows up at the end rather than jumping to the front or vanishing. */
export function applyOrder<T>(items: T[], order: string[], keyOf: (item: T) => string): T[] {
  if (!order.length) return items;
  const byKey = new Map(items.map((it) => [keyOf(it), it]));
  const ordered = order.map((k) => byKey.get(k)).filter((it): it is T => it !== undefined);
  const seen = new Set(order);
  return [...ordered, ...items.filter((it) => !seen.has(keyOf(it)))];
}
