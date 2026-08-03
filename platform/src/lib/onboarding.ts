"use client";

import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ *
 * Ask for an account — by opening CLERK'S OWN modal.
 *
 * The custom sheet and AuthForm this store used to drive are gone (owner,
 * 2026-08-03: "use clerk stuff just remove the logo") — Clerk's prebuilt
 * sign-up/sign-in card, opened as a modal, is the one auth surface. The logo
 * slot is hidden in lib/clerk-appearance so the card wears no logo at all.
 *
 * The store outlives the sheet it was built for, because its reason does:
 * the things that ask are a checkpoint button halfway down a step and the
 * next-step gate in lib/account — plain handlers with no ClerkProvider above
 * them, on builds that may have no Clerk keys at all. So `requireAccount()`
 * stays the one call every gate makes, and exactly one component inside the
 * provider (components/auth/ClerkGate) consumes the ask and opens the modal.
 *
 * `reason` no longer chooses the words on the card — Clerk's card says
 * Clerk's words — but the call sites still know why they asked, and keeping
 * the reason in the ask is what lets any later surface (a toast, analytics,
 * a reopened sheet) say it again without re-plumbing every gate.
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

/** ClerkGate's feed. Nothing else should need this. */
export function useAccountAsk(): AccountAsk {
  return useSyncExternalStore(subscribe, snapshot, () => IDLE);
}
