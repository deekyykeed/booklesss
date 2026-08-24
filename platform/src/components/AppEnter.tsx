"use client";

import { useEffect } from "react";

/* ------------------------------------------------------------------ *
 * Stamps <html data-entered> once the opening stagger has finished.
 *
 * Owner, 2026-08-23: the app should not "just kind of jump onto the screen"
 * when it is opened or reloaded. The animation itself is CSS (see the
 * "THE APP ARRIVING" block in globals.css); this is the half that decides it
 * happens ONCE.
 *
 * ⚠️ WHY AN ATTRIBUTE AND NOT JUST A CSS ANIMATION. A CSS animation runs
 * whenever its element mounts, and in the App Router the dashboard's contents
 * remount on every client-side navigation back to it. Without this guard,
 * tapping "back" from a course would re-stage the entire screen — a page
 * transition wearing an app launch's clothes. Scoping every rule to
 * `html:not([data-entered])` means the stagger belongs to the DOCUMENT, which
 * is what "when I open the app or I reload" actually describes.
 *
 * ⚠️ THE DELAY IS NOT DECORATIVE. Adding the attribute removes the matching
 * rules, and removing a running animation's rule SNAPS the element to its
 * final state. So it has to be stamped after the last piece has landed, never
 * on mount: the longest run here is the 560ms animation plus the largest
 * --enter-i delay in use, and 1100ms clears that with room for a slow frame.
 * If a caller ever staggers past index 6, raise this with it.
 *
 * Nothing is rendered. It is an effect with a DOM side effect, mounted once in
 * the root layout, and it deliberately does not gate on
 * prefers-reduced-motion — the media query in globals.css already turns the
 * animations off, and the attribute costs nothing when there is nothing to
 * suppress.
 * ------------------------------------------------------------------ */

/** Longest animation (560ms) + the largest stagger index currently in use. */
const SETTLED_MS = 1100;

export function AppEnter() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.hasAttribute("data-entered")) return;

    const t = window.setTimeout(() => {
      root.setAttribute("data-entered", "true");
    }, SETTLED_MS);

    return () => window.clearTimeout(t);
  }, []);

  return null;
}
