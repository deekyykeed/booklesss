"use client";

import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ *
 * Ask for an account — by sending the reader to the real sign-in page.
 *
 * This store has now outlived three auth surfaces: the first custom sheet,
 * Clerk's prebuilt modal (2026-08-03 to 2026-08-05), the app's own sheet again
 * (to 2026-08-09) — and now no sheet at all. The owner's call, 2026-08-09, on
 * the eve of launch: a reader arriving through a shared step link who taps a
 * gated control should not meet a popup over the page; they go to /sign-in
 * or /sign-up like anybody else, and a new account goes through the REAL
 * onboarding questions rather than having them deferred to the dashboard.
 *
 * The store survives the fourth surface for the same reason it survived the
 * first three: the things that ask are a checkpoint button halfway down a step
 * and the next-step gate in lib/account — plain handlers on a static page,
 * with no router of their own, on builds that may have no auth keys at all.
 * So `requireAccount()` stays the one call every gate makes, and exactly one
 * component (components/auth/AuthRedirect) consumes the ask and performs the
 * navigation — a soft client-side push, so the trip to the form doesn't cost
 * a full page load on mobile data.
 *
 * NOBODY LOSES THEIR PLACE — the promise is kept by the URL now, not by an
 * overlay. The redirect carries `?next=<where they were>` (see lib/next-path):
 * a returning student signs in and is put straight back; a new student goes
 * from the form into /onboarding?next=<same place>, and the flow's finish()
 * returns them there with their scroll offset restored by LessonReader.
 * ------------------------------------------------------------------ */

export type OnboardingReason = "checkpoint" | "note" | "comment" | "next-step" | "manual";

/** Which page the redirect lands on. The form behind both is one box doing
 *  both jobs (see AuthForm), so this chooses the greeting, not the branch. */
export type OnboardingMode = "sign-up" | "sign-in";

/** One ask. `seq` makes every call distinct, so asking again after the reader
 *  came back without an account re-navigates — equality on the rest of the
 *  fields must not swallow the second tap. */
export type AccountAsk = {
  seq: number;
  reason: OnboardingReason;
  /** Where to land once the session is live; null means "wherever the reader
   *  is standing when the ask fires" — AuthRedirect reads the live URL. */
  after: string | null;
  mode: OnboardingMode;
};

const IDLE: AccountAsk = { seq: 0, reason: "manual", after: null, mode: "sign-up" };
let ask: AccountAsk = IDLE;
const listeners = new Set<() => void>();

/** Ask for an account. Call this instead of building a /sign-up link by hand —
 *  the redirect carries where the reader was, so the round trip through the
 *  form (and onboarding, if they turn out to be new) ends where it began. */
export function requireAccount(
  reason: OnboardingReason = "manual",
  after: string | null = null,
  mode: OnboardingMode = "sign-up",
): void {
  ask = { seq: ask.seq + 1, reason, after, mode };
  for (const l of listeners) l();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => ask;

/** AuthRedirect's feed. Nothing else should need this. */
export function useAccountAsk(): AccountAsk {
  return useSyncExternalStore(subscribe, snapshot, () => IDLE);
}
