"use client";

import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ *
 * The student's plan, and how much of its period is spent.
 *
 * One shape, one source, so the ring around the header avatar has exactly one
 * thing to read. What fills it is a billing period: a Notes or Community
 * subscription, or a manual course_access grant with an end date — see
 * Operations/pricing-strategy.md for the two rails.
 *
 * Nothing writes to this store yet: there is no billing rail, so every reader
 * has no plan to report and the ring draws its empty track and says nothing,
 * which is the honest state rather than an invented countdown. When billing is
 * live, AccountSignal calls setPlan(planFrom(...)) once and the ring starts
 * moving — that call is the whole integration.
 *
 * Same store shape as identity.tsx and progress.tsx: a useSyncExternalStore
 * store, so a value that arrives after hydration can't cause a mismatch.
 * ------------------------------------------------------------------ */

export type Plan = {
  /** What to call it where it's shown: "Notes", "Community", "Trial". */
  name: string;
  /** When the current period ends. */
  endsOn: Date;
  /** 0..1 — how much of the period is gone. This is what the ring draws:
   *  it fills as the period runs down, so a nearly-spent plan is a nearly
   *  closed ring rather than a nearly empty one nobody notices. */
  used: number;
  /** Whole days left, never below zero. */
  daysLeft: number;
};

const DAY = 86_400_000;

/**
 * Builds a Plan from whatever the billing rail recorded on the account.
 *
 * Deliberately tolerant about its input: this reads untyped JSON written by a
 * billing webhook or by hand for a mobile-money grant. Anything missing or unparseable is no plan at all, not a
 * plan of zero days — a ring that reads "expired" because a date was
 * misspelled is worse than a ring that stays quiet.
 */
export function planFrom(
  source: { plan?: unknown; periodStart?: unknown; periodEnd?: unknown } | null | undefined,
  now: Date = new Date(),
): Plan | null {
  if (!source) return null;
  const name = typeof source.plan === "string" && source.plan.trim() ? source.plan.trim() : null;
  const end = date(source.periodEnd);
  if (!name || !end) return null;

  // Without a start there is no period to measure against, so fall back to a
  // month — every plan on offer is monthly, and it keeps the ring meaningful
  // for a grant recorded with an end date only.
  const start = date(source.periodStart) ?? new Date(end.getTime() - 30 * DAY);
  const span = end.getTime() - start.getTime();
  const gone = now.getTime() - start.getTime();

  return {
    name,
    endsOn: end,
    used: span > 0 ? clamp(gone / span) : 1,
    daysLeft: Math.max(0, Math.ceil((end.getTime() - now.getTime()) / DAY)),
  };
}

function date(v: unknown): Date | null {
  if (typeof v !== "string" && typeof v !== "number") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function clamp(v: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
}

/** One line for the ring's tooltip — what it is and how long it has. */
export function planLabel(plan: Plan): string {
  if (plan.daysLeft === 0) return `${plan.name} ends today`;
  return `${plan.name} — ${plan.daysLeft} day${plan.daysLeft === 1 ? "" : "s"} left`;
}

/* ---- the store ------------------------------------------------------ */

let current: Plan | null = null;
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** The plan in force, or null when nobody has reported one. */
export function usePlan(): Plan | null {
  // Server snapshot is always null: a plan is per-account, and this site
  // prerenders one copy of every page for everybody.
  return useSyncExternalStore(subscribe, () => current, () => null);
}

/** Reports the plan — or its absence, on sign-out. */
export function setPlan(plan: Plan | null): void {
  current = plan;
  for (const fn of listeners) fn();
}
