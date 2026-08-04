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

/* ------------------------------------------------------------------ *
 * Has the ACCOUNT'S OWN RECORD been read yet?
 *
 * Separate from `signedIn`, and the difference matters exactly once: at the
 * onboarding gate. A student signing in on a second device is signed in a
 * beat before their answers arrive — Clerk resolves the session first and the
 * metadata AccountSignal reconciles from it a moment later — so for that beat
 * the device holds a blank record belonging to somebody who answered
 * everything months ago. A gate that fired on `signedIn` alone would send
 * them back through onboarding to re-answer questions they had already
 * answered, which is the failure the gate exists to prevent, arrived at from
 * the other side.
 *
 * Set by AccountSignal once it has read the user's metadata and settled the
 * device's record against it — see the reconcile effect there.
 * ------------------------------------------------------------------ */

let accountRead = false;

/** Called only by AccountSignal. */
export function setAccountRead(v: boolean): void {
  if (v === accountRead) return;
  accountRead = v;
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

const readSnapshot = () => accountRead;

/** Whether the signed-in account's own record has landed on this device.
 *  False on a signed-out or Clerk-less build, where there is no record to
 *  wait for — callers pair it with `useSignedIn`. */
export function useAccountRead(): boolean {
  return useSyncExternalStore(subscribe, readSnapshot, () => false);
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

/* ------------------------------------------------------------------ *
 * The free step (owner, 2026-08-03: "the one free step is okay … then the
 * next one is counting steps per device").
 *
 * A signed-out device gets ONE step: the first one it opens. That step stays
 * readable forever — going back to reread your step is not a second step —
 * and every other step asks for an account, from every surface that links to
 * one: the foot of a step, the sidebar, the course page rows, the home cards.
 *
 * Claimed by the reader on mount and stored as the step's path, because the
 * path is what every link carries and what the gate compares against.
 *
 * ARRIVALS ARE NEVER GATED — only in-app clicks. A link shared into a
 * WhatsApp group must open for everyone it reaches, whatever this device has
 * read before: the shared link is the whole growth loop, and a gate on it
 * would be a gate on the front door. A determined reader can therefore type
 * step URLs by hand and read on; that person is rehearsing the sign-up
 * argument for us.
 * ------------------------------------------------------------------ */

const FREE_KEY = "booklesss:free-step:v1";

/** The path of this device's one signed-out step, or null if none claimed
 *  (or storage is blocked — in which case the gate fails open, matching the
 *  rule everywhere else that a broken store never blocks the reader). */
export function freeStep(): string | null {
  try {
    return window.localStorage.getItem(FREE_KEY);
  } catch {
    return null;
  }
}

/** Called by the reader on every step mount. First step in wins; an already
 *  claimed device is left alone, and a signed-in reader's claim is inert
 *  because the gate never runs for them. */
export function claimFreeStep(path: string): void {
  try {
    if (!window.localStorage.getItem(FREE_KEY)) window.localStorage.setItem(FREE_KEY, path);
  } catch {
    /* storage blocked — nothing to claim, and the gate fails open */
  }
}

/** "Forget this device" forgets this too: coming back as somebody new means
 *  a first step to claim again. */
export function clearFreeStep(): void {
  try {
    window.localStorage.removeItem(FREE_KEY);
  } catch {
    /* nothing stored to remove */
  }
}

/**
 * The gate on opening a step. Returns true if it took the click — the caller
 * has nothing left to do.
 *
 * ONE HELPER, EVERY WAY IN. The gate began at the foot of a step, then the
 * sidebar, and now every course surface, because a gate on some of the doors
 * is not a gate, it is a detour sign — and the reader who walks round it is
 * exactly the one who was going to sign up.
 *
 * Lets through: signed-in readers, the device's own free step, and a device
 * with nothing claimed yet (its first step is about to become the claim).
 *
 * Everything except a plain left-click is left alone. Cmd/Ctrl/Shift/Alt and
 * the middle button are the reader asking the BROWSER for the link — a new
 * tab, a new window — and answering those with a sheet in the page they were
 * leaving is a control that has misunderstood what it was asked.
 */
export function gateStepLink(e: React.MouseEvent, href: string): boolean {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return false;
  if (!needsAccount()) return false;
  const free = freeStep();
  if (!free || free === href) return false;
  e.preventDefault();
  requireAccount("next-step", href);
  return true;
}
