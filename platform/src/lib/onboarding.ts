"use client";

import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ *
 * Ask for an account — by opening the app's own sheet.
 *
 * This store has now outlived two auth surfaces: the first custom sheet, then
 * Clerk's prebuilt modal (2026-08-03 to 2026-08-05), and now the app's own
 * again. It survives each time because its reason is not about the surface —
 * the things that ask are a checkpoint button halfway down a step and the
 * next-step gate in lib/account, plain handlers on a static page, on builds
 * that may have no auth keys at all. So `requireAccount()` stays the one call
 * every gate makes, and exactly one component (components/auth/AuthGate)
 * consumes the ask and puts a form on screen.
 *
 * `reason` chooses the line above the form again — Clerk's card said Clerk's
 * words, and keeping the reason in the ask through that period is what made it
 * a one-line change to say ours instead. See WHY in AuthGate.
 * ------------------------------------------------------------------ */

export type OnboardingReason = "checkpoint" | "note" | "comment" | "next-step" | "manual";

/** Which card the modal opens on. It can be flipped from inside either way —
 *  this is only the opening state, so a "Sign in" button opens onto sign-in
 *  rather than making an existing student find the toggle. */
export type OnboardingMode = "sign-up" | "sign-in";

/** One ask. `seq` makes every call distinct, so asking again after the reader
 *  closed the modal reopens it — equality on the rest of the fields must not
 *  swallow the second tap. */
export type AccountAsk = {
  seq: number;
  reason: OnboardingReason;
  /** Where to land once the session is live; null means stay on this page. */
  after: string | null;
  mode: OnboardingMode;
  /** An email the reader already typed (the landing card asks for one), so
   *  the modal opens with it filled in rather than asking twice. */
  email: string | null;
};

const IDLE: AccountAsk = { seq: 0, reason: "manual", after: null, mode: "sign-up", email: null };
let ask: AccountAsk = IDLE;
const listeners = new Set<() => void>();

/** Ask for an account. Call this instead of navigating to /sign-up or
 *  /sign-in — the modal opens over whatever the reader was doing, which is
 *  the whole point: nobody loses their place as a reward for signing up. */
export function requireAccount(
  reason: OnboardingReason = "manual",
  after: string | null = null,
  mode: OnboardingMode = "sign-up",
  email: string | null = null,
): void {
  ask = { seq: ask.seq + 1, reason, after, mode, email };
  for (const l of listeners) l();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => ask;

/** AuthGate's feed. Nothing else should need this. */
export function useAccountAsk(): AccountAsk {
  return useSyncExternalStore(subscribe, snapshot, () => IDLE);
}
