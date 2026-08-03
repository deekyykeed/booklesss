"use client";

import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ *
 * Whether the onboarding sheet is open, and what asked for it.
 *
 * A module store rather than context, for the same reason `progress` and
 * `identity` are: the thing that needs to open this is a checkpoint button
 * halfway down a step or a "next step" link in the footer, and neither wants
 * a provider threaded to it. Any component calls `requireAccount()` and the
 * sheet appears.
 *
 * `reason` is what the sheet says at the top. A student who tapped a
 * checkpoint and one who hit the end of a step are being interrupted for
 * different purposes, and a sheet that explains itself is one they will finish.
 *
 * `after` is where to go once they're in — the next step, usually. Held here
 * rather than passed through the sheet's props because the caller is gone by
 * the time the sheet resolves.
 * ------------------------------------------------------------------ */

export type OnboardingReason = "checkpoint" | "next-step" | "manual";

type State = { open: boolean; reason: OnboardingReason; after: string | null };

let state: State = { open: false, reason: "manual", after: null };
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  for (const l of listeners) l();
}

/** Open the sheet. Call this instead of navigating to /sign-up. */
export function requireAccount(reason: OnboardingReason = "manual", after: string | null = null) {
  set({ open: true, reason, after });
}

export function closeOnboarding() {
  set({ ...state, open: false });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => state;
/* The server has no sheet open, and this object is stable, so the server
 * snapshot can be a constant — returning a fresh object here would loop. */
const SERVER: State = { open: false, reason: "manual", after: null };

export function useOnboarding(): State {
  return useSyncExternalStore(subscribe, snapshot, () => SERVER);
}
