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

export type OnboardingReason = "checkpoint" | "note" | "comment" | "next-step" | "manual";

/** Which form the sheet opens on. It can be flipped from inside either way —
 *  this is only the opening state, so a "Sign in" button opens onto sign-in
 *  rather than making an existing student find the toggle. */
export type OnboardingMode = "sign-up" | "sign-in";

type State = { open: boolean; reason: OnboardingReason; after: string | null; mode: OnboardingMode };

let state: State = { open: false, reason: "manual", after: null, mode: "sign-up" };
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  for (const l of listeners) l();
}

/** Open the sheet. Call this instead of navigating to /sign-up or /sign-in —
 *  and instead of Clerk's own modal, which wears Clerk's branding and the
 *  dashboard's logo rather than this app's. */
export function requireAccount(
  reason: OnboardingReason = "manual",
  after: string | null = null,
  mode: OnboardingMode = "sign-up",
) {
  set({ open: true, reason, after, mode });
}

export function closeOnboarding() {
  set({ ...state, open: false });
}

/** The sheet's own toggle — "Already have an account?" / "New here?". Lives in
 *  the store with the rest of the sheet's state so opening it needs no effect
 *  to reset a local copy. */
export function setOnboardingMode(mode: OnboardingMode) {
  set({ ...state, mode });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => state;
/* The server has no sheet open, and this object is stable, so the server
 * snapshot can be a constant — returning a fresh object here would loop. */
const SERVER: State = { open: false, reason: "manual", after: null, mode: "sign-up" };

export function useOnboarding(): State {
  return useSyncExternalStore(subscribe, snapshot, () => SERVER);
}
