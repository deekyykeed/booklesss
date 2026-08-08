import type { Metadata } from "next";
import { HapticsProbe } from "./HapticsProbe";

/* A DIAGNOSTIC PAGE, and a deliberately temporary one.
 *
 * Owner, 2026-08-08, on Android in the installed PWA: "I still cannot feel it."
 * Two rounds of reasoning from a sandbox had already guessed wrong, and there
 * are four independent things that each produce exactly the same symptom —
 * silence, no error, `vibrate()` returning true:
 *
 *   1. the service worker is still serving the JS from before haptics existed
 *   2. the durations asked for are too short for the motor to spin up
 *   3. the app's own reduced-motion switch, or the OS one, is silencing it
 *   4. Android itself has vibration off (touch feedback, silent mode, battery
 *      saver) and no page can override that
 *
 * No amount of reading tells you which. This page tells you in ten seconds, and
 * it exists because MDN's and Chrome's docs are both unreachable from the
 * environment this was written in, so the alternative was more guessing.
 *
 * IT IS NOT LINKED FROM ANYWHERE and is noindex. Reach it by typing the path.
 * Delete the folder once the answer is known; nothing imports it.
 */
export const metadata: Metadata = {
  title: "Haptics test",
  robots: { index: false, follow: false },
};

export default function HapticsTestPage() {
  return (
    <main className="mx-auto max-w-md px-5 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Haptics test</h1>
      <p className="mt-2 text-sm text-muted">
        Not part of the app. Tap the buttons top to bottom and stop at the first one you can feel.
      </p>
      <HapticsProbe />
    </main>
  );
}
