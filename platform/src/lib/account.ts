"use client";

import { useSyncExternalStore } from "react";
import { clerkEnabled } from "@/lib/clerk";
import { requireAccount } from "@/lib/onboarding";

/* ------------------------------------------------------------------ *
 * Does the thing this reader just did need an account?
 *
 * A module store, like `progress`, `identity` and `onboarding`, and for a
 * sharper reason than those: the things that have to ask are a checkpoint
 * button halfway down a step and a next-step link in the footer, and NEITHER
 * CAN CALL CLERK. `useAuth()` throws without a ClerkProvider above it, the
 * provider is only mounted when keys exist (see lib/clerk), and a hook cannot
 * be called conditionally. A reader on a build with no keys would take the
 * whole step down with them.
 *
 * So exactly one component touches Clerk — components/auth/AccountSignal,
 * mounted inside the provider — and writes what it learns here. Everything
 * else reads this and imports nothing from Clerk at all.
 *
 * DEFAULT: NOT GATED. `signedIn` starts null meaning "we don't know yet", and
 * needsAccount() is false until Clerk has actually said otherwise. Letting
 * somebody through a gate that hasn't loaded is a missed sign-up; stopping
 * somebody who is already signed in, because their session hadn't resolved
 * yet, is a reader told to make an account they already have. The second is
 * much worse, and on a slow Zambian connection it is the likelier one.
 * ------------------------------------------------------------------ */

/** null = Clerk hasn't reported yet. */
let signedIn: boolean | null = null;
const listeners = new Set<() => void>();

/** Called only by AccountSignal, on every change to the Clerk session. */
export function setSignedIn(v: boolean | null): void {
  if (v === signedIn) return;
  signedIn = v;
  for (const l of listeners) l();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const snapshot = () => signedIn;

export function useSignedIn(): boolean | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}

/**
 * Whether an action should stop and ask for an account.
 *
 * False on a build with no Clerk keys — there is no account to make, so a gate
 * would be a dead end rather than a funnel — and false until the session has
 * resolved, per the note above.
 *
 * Not a hook: it is read inside click handlers, where the answer wanted is the
 * one true at the moment of the tap.
 */
export function needsAccount(): boolean {
  return clerkEnabled && signedIn === false;
}

/**
 * The gate on leaving a step for another one. Returns true if it took the
 * click — the caller has nothing left to do.
 *
 * ONE HELPER, EVERY WAY OUT. The owner's spec names the next-step link at the
 * foot of a step, but that link is not the only way to the next step: the
 * sidebar lists all of them, a lesson caret away. A gate on one and not the
 * other is not a gate, it is a detour sign, and the reader who ignores it is
 * exactly the one who was going to sign up.
 *
 * Everything except a plain left-click is left alone. Cmd/Ctrl/Shift/Alt and
 * the middle button are the reader asking the BROWSER for the link — a new
 * tab, a new window — and answering those with a sheet in the page they were
 * leaving is a control that has misunderstood what it was asked.
 */
export function gateStepLink(e: React.MouseEvent, href: string): boolean {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return false;
  if (!needsAccount()) return false;
  e.preventDefault();
  requireAccount("next-step", href);
  return true;
}
