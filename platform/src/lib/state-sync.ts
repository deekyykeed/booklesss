"use client";

import {
  cleanBundle,
  mergeBundle,
  type StateBundle,
} from "./study-state";
import { allSaved, replaceSaved, subscribeSaved } from "./saved";
import { allNotes, replaceNotes, subscribeNotes } from "./step-notes";
import { allComments, replaceComments, subscribe as subscribeComments } from "./step-comments";
import { progressScope, progressState, replaceProgress, subscribeProgress } from "./progress";

/* ------------------------------------------------------------------ *
 * Studying, made to survive the device.
 *
 * Four stores — saves, note verdicts, typed comments, progress — were
 * localStorage-only until 2026-08-10. Clearing a browser wiped them; a second
 * device never saw them. This module is the bridge, and it is deliberately the
 * ONLY thing that talks to /api/state, so the ordering rule below lives in one
 * place rather than at four call sites.
 *
 * ══ THE ORDERING RULE, WHICH IS THE WHOLE FILE ══
 *
 *   NOTHING IS PUSHED UNTIL THE PULL HAS LANDED AND BEEN MERGED.
 *
 * POST /api/state is authoritative — it makes the server's rows equal the
 * body's. So a push from a device that has not yet read the server would
 * replace a student's entire history with whatever that browser happened to
 * have, which on a fresh phone is nothing at all. One signed-in second on a
 * borrowed laptop would delete everything.
 *
 * This project has already paid for this exact mistake once, in the other
 * direction: on 2026-08-05 the identity sync pushed before the account read
 * completed, and six sign-ups lost their name, face, programme, year and whole
 * ticked curriculum to a placeholder. `AccountSignal` fixed it by sequencing
 * the read before the write with `accountRead`. `ready` below is the same
 * guard for the same reason, and it is why the subscriptions are only attached
 * AFTER the first merge succeeds — an un-pushed change is recoverable, a push
 * that deletes is not.
 *
 * ══ FAIL SOFT, AND KEEP TRYING ══
 *
 * Every failure is silent. The device's own copy is what the app renders from,
 * so a student loses nothing they can see, and there is nothing they could do
 * about it anyway. Recovery is not a retry loop but the next flush: each push
 * sends the WHOLE merged union, so any single dropped request is made good by
 * the one after it, and a session that never syncs at all is made good at the
 * next sign-in.
 * ------------------------------------------------------------------ */

/** How long to wait after a change before pushing. Long enough that clearing
 *  four checkpoints in a row is one request rather than four, short enough that
 *  a reader who closes the tab has almost always already synced. The
 *  pagehide flush below covers the rest. */
const DEBOUNCE_MS = 2_000;

let userId: string | null = null;
/** False until the pull has landed and merged. THE push guard — see above. */
let ready = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let unsubscribes: (() => void)[] = [];
/** The last body sent, so a flush that changes nothing costs a string compare
 *  and no request. Same trick as lib/profile-sync. */
let lastSent = "";

/** Everything this device holds, in the shape the wire wants. */
function localBundle(): StateBundle {
  return cleanBundle({
    saved: allSaved(),
    notes: allNotes(),
    comments: allComments(),
    progress: progressState(),
  });
}

/** Write a merged bundle back into all four stores. Each store notifies its own
 *  subscribers, so an open reader redraws with the adopted saves and notes
 *  rather than waiting for a navigation. */
function applyBundle(b: StateBundle) {
  replaceSaved(b.saved);
  replaceNotes(b.notes);
  replaceComments(b.comments);
  replaceProgress(b.progress);
}

function schedulePush() {
  if (!ready) return; // the guard, again — subscriptions can fire early
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => void push(), DEBOUNCE_MS);
}

async function push(keepalive = false) {
  if (!ready || !userId) return;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  const body = JSON.stringify(localBundle());
  if (body === lastSent) return;
  lastSent = body;

  try {
    await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      /* Survives the tab closing, which is exactly what follows the last
         checkpoint of a step. */
      keepalive,
    });
  } catch {
    /* Offline, blocked, or the route is not deployed. Clearing lastSent is what
       lets the next flush try again with the same payload. */
    lastSent = "";
  }
}

/**
 * Reconcile this device against the account, then keep them in step.
 *
 * Call with the signed-in user's id, or null when signed out. Safe to call
 * repeatedly with the same id — the second call is a no-op, which matters
 * because supabase-js hands back a fresh user object on every hourly token
 * refresh and on every tab focus.
 *
 * Returns nothing; call `stopStateSync()` to tear down.
 */
export function startStateSync(id: string | null): void {
  if (id === userId) return;
  stopStateSync();
  userId = id;
  if (!id) return;

  void (async () => {
    let remote: StateBundle;
    try {
      const res = await fetch("/api/state", { headers: { Accept: "application/json" } });
      if (!res.ok) return; // 401 signed-out, or the route is absent: stay local
      const json: unknown = await res.json();
      if (!json || typeof json !== "object" || !("ok" in json) || !json.ok) return;
      remote = cleanBundle(json);
    } catch {
      return; // offline. The device keeps working; the next sign-in reconciles.
    }

    /* The session may have changed underneath the round trip — a sign-out, or a
       different account signing in. Adopting into the wrong scope would hand
       one student's studying to another. */
    if (userId !== id) return;

    /* THE PROGRESS BUCKET MUST ALREADY BE THIS STUDENT'S. `ProgressScope` moves
       it on the same session change that started this sync, and a network round
       trip is orders of magnitude longer than an effect — but "almost always"
       is not a guarantee worth betting a student's history on. If the scope has
       not caught up, skip the merge entirely: the next sign-in reconciles, and
       nothing has been pushed. */
    if (progressScope() !== id) return;

    const merged = mergeBundle(localBundle(), remote);
    applyBundle(merged);

    /* Only now. Everything above this line is why. */
    ready = true;

    /* The union straight back up, so the server holds what this device just
       learned — and so a device that has been offline for a week lands its
       backlog in one request rather than waiting for the next tap. */
    void push();

    unsubscribes = [
      subscribeSaved(schedulePush),
      subscribeNotes(schedulePush),
      subscribeComments(schedulePush),
      subscribeProgress(schedulePush),
    ];

    /* The last chance to save. `visibilitychange` rather than `beforeunload`:
       on mobile a tab is usually backgrounded and then killed, and beforeunload
       is not reliably delivered there. `keepalive` lets the request outlive the
       page. */
    const onHide = () => {
      if (document.visibilityState === "hidden") void push(true);
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", () => void push(true));
    unsubscribes.push(() => document.removeEventListener("visibilitychange", onHide));
  })();
}

/** Stop syncing and forget the session. Called on sign-out and before adopting
 *  a different account. */
export function stopStateSync(): void {
  if (timer) clearTimeout(timer);
  timer = null;
  ready = false;
  lastSent = "";
  userId = null;
  for (const off of unsubscribes) off();
  unsubscribes = [];
}
