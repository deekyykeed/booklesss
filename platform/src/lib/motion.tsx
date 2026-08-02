"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ *
 * Motion preference.
 *
 * The canvas behind every page runs six blob animations continuously, at 17 to
 * 30 seconds a cycle, and they never stop while the app is open. The CSS
 * already honours `prefers-reduced-motion: reduce`, but that is an operating
 * system switch: a reader who wants the page to hold still on this app, and
 * nowhere else, has no way to say so, and on Android the OS setting is buried
 * deep enough that most people never find it.
 *
 * So: "System" follows the OS, "Reduced" forces it on here. Stored per device
 * beside identity and progress, because that is where everything else about a
 * reader lives.
 *
 * The switch is a `data-motion` attribute on <html> rather than a class or a
 * React context, because what it turns off is CSS animation on elements React
 * does not own (`.bg-waves span` is painted by the layout, not a component).
 * One attribute, one CSS rule, no re-render.
 * ------------------------------------------------------------------ */

const KEY = "booklesss:motion:v1";

export type MotionPref = "system" | "reduced";

export function readMotion(): MotionPref {
  try {
    return localStorage.getItem(KEY) === "reduced" ? "reduced" : "system";
  } catch {
    return "system"; // private mode: follow the OS, which is the safe default
  }
}

/** Writes the attribute the CSS reads. Safe to call before React has mounted. */
export function applyMotion(pref: MotionPref): void {
  if (typeof document === "undefined") return;
  if (pref === "reduced") document.documentElement.dataset.motion = "reduced";
  else delete document.documentElement.dataset.motion;
}

export function saveMotion(pref: MotionPref): void {
  try {
    localStorage.setItem(KEY, pref);
  } catch {
    /* nothing to do — the attribute below still applies for this session */
  }
  applyMotion(pref);
  window.dispatchEvent(new Event(CHANGED));
}

const CHANGED = "booklesss:motion-changed";

/**
 * The current preference, and a setter.
 *
 * `hydrated` is in the snapshot rather than a mount effect, the same pattern
 * `lib/progress.tsx` and `lib/identity.tsx` use: it distinguishes "storage not
 * read yet" from "nothing stored", and a `useEffect(() => setMounted(true))`
 * trips `react-hooks/set-state-in-effect`.
 */
export function useMotion(): { pref: MotionPref; hydrated: boolean; setPref: (p: MotionPref) => void } {
  const [state, setState] = useState<{ pref: MotionPref; hydrated: boolean }>({
    pref: "system",
    hydrated: false,
  });

  useEffect(() => {
    const sync = () => setState({ pref: readMotion(), hydrated: true });
    sync();
    window.addEventListener(CHANGED, sync);
    // Another tab on the same device changing it should be reflected here.
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { pref: state.pref, hydrated: state.hydrated, setPref: saveMotion };
}
