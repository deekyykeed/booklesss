/* ------------------------------------------------------------------ *
 * A tap you can feel.
 *
 * Owner, 2026-08-08: "can I have a haptic touch on a PWA". Yes, with one real
 * limit, stated here because it decides where this is worth using:
 *
 *   · ANDROID (Chrome, and the installed PWA): works. The Vibration API is
 *     `navigator.vibrate(ms)`, it needs no permission, and it works the same
 *     inside an installed PWA as in the browser tab.
 *   · iOS (Safari, and the installed PWA): DOES NOT WORK. WebKit has never
 *     shipped the Vibration API, and being installed to the home screen does
 *     not change that — a PWA on iOS is still WebKit. There is a known trick
 *     (toggling a hidden `<input type="checkbox" switch>` plays a system
 *     haptic on iOS 17.4+), and it is deliberately NOT used here: it fires the
 *     switch's own haptic rather than one we chose, it is undocumented
 *     behaviour that can go away in a point release, and it needs a real
 *     control in the DOM being really toggled.
 *
 * So this is an enhancement for roughly the Android half of the readership and
 * silently nothing for the rest. That is the right trade for a confirmation
 * buzz, and the wrong one for anything a reader would MISS if it never
 * arrived — never make a haptic the only signal that something happened.
 *
 * A GESTURE IS REQUIRED. Browsers ignore `vibrate()` outside a user gesture
 * and some log a console warning for it, so call this from the handler of the
 * tap itself, never from an effect or a timer reacting to one.
 * ------------------------------------------------------------------ */

/** Durations, milliseconds. Short enough to read as one tick, not a buzz. */
const TAP = 8;
const CONFIRM = 14;

/* `data-motion="reduced"` is the app's own motion switch (lib/motion), and it
 * governs this too. A haptic is not motion on screen, so no spec says it must,
 * and the reasoning is that a reader who has asked this app to hold still has
 * told us they want it calmer — buzzing their hand instead would be answering
 * a request by moving the noise somewhere else. `prefers-reduced-motion` is
 * checked as well, so the OS setting works even where the app's switch has
 * never been touched. */
function silenced(): boolean {
  if (typeof document === "undefined") return true;
  if (document.documentElement.dataset.motion === "reduced") return true;
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function buzz(ms: number): void {
  if (silenced()) return;
  /* Feature-detected rather than typed away: `vibrate` is absent on every iOS
     browser, and TypeScript's lib.dom declares it regardless. */
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(ms);
  } catch {
    /* Some browsers throw inside an iframe or with the page hidden. A failed
       haptic is never worth an error a reader can see. */
  }
}

/** A control was pressed. The lightest tick available. */
export function hapticTap(): void {
  buzz(TAP);
}

/** An answer was recorded — a checkpoint rated, a section flagged. Slightly
 *  longer than a tap, so "it counted" feels different from "it moved". */
export function hapticConfirm(): void {
  buzz(CONFIRM);
}
