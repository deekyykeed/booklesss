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

/* Durations, milliseconds.
 *
 * ⚠️ THESE WERE 8 AND 14 AND NOBODY COULD FEEL THEM. Owner, on Android, in the
 * installed PWA, after the first version shipped: "I still cannot feel it."
 *
 * The mistake was picking a number for how it should READ ("one tick, not a
 * buzz") when the constraint is physical. A phone's vibration motor has to spin
 * up: an ERM motor needs tens of milliseconds to reach an amplitude a hand
 * notices, and even an LRA has a rise time. Ask for 8ms and the honest outcome
 * is that the motor is still accelerating when the request ends, so nothing
 * reaches the hand — the call succeeds, `navigator.vibrate` returns true, and
 * there is nothing to feel. Silence with no error is exactly what was reported.
 *
 * 20 and 35 are the low end of what is reliably perceptible across Android
 * hardware rather than a taste judgement.
 *
 * ⚠️ AND ON THE OWNER'S OWN PHONE, NONE OF IT IS FELT — INCLUDING 200ms AND A
 * PATTERN. That was measured, not assumed. A diagnostic page (`/haptics-test`,
 * deleted 2026-08-08 once it had answered; recover it from git if it is ever
 * wanted again) reported `navigator.vibrate` present, no service worker in the
 * way, reduced motion off in both the app and the OS, and `vibrate()` returning
 * TRUE for every duration from 8 to 200ms and for `[100,60,100]`. Nothing was
 * felt at any of them.
 *
 * What that rules out is the useful part: returning true means Chrome accepted
 * and queued the request, so the page is being obeyed and the hardware is not
 * responding. It is not the numbers, not the bundle, not this file. It is the
 * device or the OS — battery saver, the system touch-feedback setting, ring
 * mode — or a Chrome/OEM build that simply does not honour the API from a page.
 *
 * SO DO NOT TUNE THESE NUMBERS AGAIN CHASING THAT REPORT. The next person to
 * hear "I can't feel it" should check whether the phone gives haptic feedback
 * ANYWHERE — long-press the home screen, type on the keyboard — before touching
 * a line of this. Two rounds were already spent guessing from a sandbox.
 *
 * The feature stays because it costs nothing, is silenced correctly for
 * reduced-motion, and will work for readers whose devices honour it. Nothing in
 * the app may ever DEPEND on the buzz being felt. */
const TAP = 20;
const CONFIRM = 35;

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
