"use client";

import { useEffect, useState } from "react";
import type { Grasp } from "./progress-shared";

/* ------------------------------------------------------------------ *
 * The tally beside each face — how many readers said what about a section.
 *
 * Owner, 2026-08-08: "can I have numbers after each of the 3 icons, so those
 * will be counting how many people thought what about the step."
 *
 * ONE FETCH PER STEP, SHARED BY EVERY SECTION IN IT. A step draws a row of faces
 * per section, so a hook that fetched per section would fire three to six
 * requests for one page and each `Checkpoint` would hold its own copy. Instead
 * the lesson's counts are fetched once into a module-level cache and every
 * checkpoint subscribes to it, which is the same shape lib/progress uses for
 * localStorage: one store, many readers, no prop threading.
 *
 * IT NEVER BLOCKS THE READING. The counts arrive after paint and render as
 * nothing until they do. A step is readable and answerable with this endpoint
 * down, because the answer itself is written to localStorage first and the tally
 * is decoration on top of it.
 * ------------------------------------------------------------------ */

/* HOW MANY ANSWERS A SECTION NEEDS BEFORE ITS TALLY IS DRAWN.
 *
 * ⚠️ This is the same decision as `MemberCount`'s floor and it is here for the
 * same reason. `students` had 2 rows the day this was built, so an unguarded
 * tally would print "0 0 0" beside every face on roughly 160 section
 * checkpoints — a per-section announcement that nobody has read this, on every
 * page of a product being sold. Honest and much worse than silence.
 *
 * Five, because at five a count reads as "other people" rather than as a number
 * you could have produced by yourself and a friend. Raise it freely; the only
 * wrong value is one that lets a step imply a readership it does not have.
 *
 * The tally appears on its own, with no code change, once sections start
 * clearing it. */
export const COUNT_FLOOR = 5;

export type Counts = Record<Grasp, number>;
/** sectionId → counts. A section absent from the map has no answers yet. */
export type LessonCounts = Record<string, Counts>;

/** lessonId → what we know, or a promise while it is in flight. Module-level so
 *  a second checkpoint mounting reuses the first one's request rather than
 *  starting its own. */
const cache = new Map<string, LessonCounts>();
const inFlight = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

async function load(lessonId: string): Promise<void> {
  const existing = inFlight.get(lessonId);
  if (existing) return existing;

  const p = (async () => {
    try {
      const res = await fetch(`/api/reaction?lesson=${encodeURIComponent(lessonId)}`);
      if (!res.ok) return;
      const json = (await res.json()) as { ok?: boolean; counts?: LessonCounts };
      cache.set(lessonId, json.counts ?? {});
      emit();
    } catch {
      /* Offline, or the route is not there. The tally simply does not appear;
         nothing about the step stops working. Deliberately not retried — a
         reader who reloads gets another attempt, and a failed decoration is not
         worth a backoff loop. */
    } finally {
      inFlight.delete(lessonId);
    }
  })();

  inFlight.set(lessonId, p);
  return p;
}

/** Counts for one section, or null until they are known. */
export function useSectionCounts(lessonId: string, sectionId: string): Counts | null {
  const [, bump] = useState(0);

  useEffect(() => {
    const l = () => bump((n) => n + 1);
    listeners.add(l);
    if (!cache.has(lessonId)) void load(lessonId);
    return () => {
      listeners.delete(l);
    };
  }, [lessonId]);

  return cache.get(lessonId)?.[sectionId] ?? null;
}

/* ------------------------------------------------------------------ *
 * Writing.
 *
 * Called from `rate()` and from the un-answer path, AFTER localStorage has been
 * written. That order is the contract: the device's copy is the one the reader
 * sees, and this is the copy that can be counted. If this fails, the reader's own
 * answer is unaffected and they are told nothing, because there is nothing they
 * could do about it.
 *
 * `grasp: null` deletes the row. Without it, taking an answer back would leave a
 * vote counted forever and the tally would only ever climb.
 * ------------------------------------------------------------------ */
export function recordReaction(lessonId: string, sectionId: string, grasp: Grasp | null): void {
  /* The local tally moves immediately, so the number under the reader's thumb
     responds to their own tap rather than waiting for a round trip. It is
     corrected by the next real fetch if the write did not land. */
  const row = cache.get(lessonId);
  if (row) {
    const c = (row[sectionId] ??= { got: 0, almost: 0, not: 0 });
    if (grasp) c[grasp] += 1;
    emit();
  }

  void fetch("/api/reaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lesson: lessonId, section: sectionId, grasp }),
    /* Survives the page being navigated away from mid-request, which is exactly
       what a tap on the last checkpoint of a step tends to be followed by. */
    keepalive: true,
  }).catch(() => {
    /* Fail soft, and silently. See the note above. */
  });
}
