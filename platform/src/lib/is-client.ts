"use client";

import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ *
 * "Are we past the server render yet?"
 *
 * Three components had grown their own copy of this by 2026-08-05 — the
 * onboarding flow, the landing page's auth card, and the offline tools — so it
 * lives in one place now.
 *
 * IT IS NOT useState + useEffect(() => setReady(true)). That is the obvious
 * spelling and it is a cascading render: the component paints, the effect
 * fires, the component paints again, and React's lint rule refuses it as an
 * error. A store whose value never changes, whose SERVER snapshot is false and
 * whose CLIENT snapshot is true, answers the same question in a single render.
 *
 * WHAT IT IS FOR. Anything that cannot exist during SSR and must not be guessed
 * at: reading localStorage, measuring the viewport, dealing a random set of
 * avatars, portalling to document.body. Rendering a placeholder until this is
 * true is what keeps the server's HTML and the client's first paint identical,
 * which is the whole contract hydration rests on.
 *
 * WHAT IT IS NOT FOR: anything that can simply be rendered on the server. A
 * component that hides behind this is a component Google's crawler and a slow
 * phone both see as empty first.
 * ------------------------------------------------------------------ */

/** Module-level so its identity is stable across renders — a fresh function
 *  here would make useSyncExternalStore resubscribe on every one. */
const NEVER_CHANGES = () => () => {};

export function useIsClient(): boolean {
  return useSyncExternalStore(
    NEVER_CHANGES,
    () => true,
    () => false,
  );
}
