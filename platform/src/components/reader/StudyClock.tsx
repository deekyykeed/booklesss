"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { addStudySeconds } from "@/lib/progress";
import { lessonIdForSlug } from "@/lib/course";
import { courseForNode } from "@/lib/courses";

/* ------------------------------------------------------------------ *
 * Measures time spent reading, so the dashboard can plot it.
 *
 * Mounted in the reader layout and nowhere else: time is credited for being in
 * a lesson, not for sitting on the dashboard looking at how much time you've
 * spent. Renders nothing.
 *
 * What counts as reading — deliberately strict, because an inflated number is
 * worse than a small one:
 *   - the tab is visible (a lesson left open in a background tab earns nothing)
 *   - something has happened in the last IDLE_MS (pointer, key, scroll, touch),
 *     so a step left open while you make tea stops the clock
 *   - elapsed wall-clock between ticks, capped, so a throttled or suspended
 *     timer can't dump a huge block of "reading" in at once
 *
 * The failure mode is undercounting: read a long passage perfectly still for
 * more than a minute and that minute is not credited. That's the right way for
 * this to be wrong.
 * ------------------------------------------------------------------ */

const TICK_MS = 15_000;
/** No interaction for this long and the reader is treated as away. */
const IDLE_MS = 60_000;
/** Never credit more than this from one tick, whatever the clock says. */
const MAX_TICK_S = (TICK_MS * 2) / 1000;

const ACTIVITY = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"] as const;

export function StudyClock() {
  /* Which course the open lesson belongs to, so the seconds land attributed as
   * well as totalled. A ref, not effect state: flush() runs from timers and
   * unload handlers that must see the current route without re-arming them. */
  const pathname = usePathname();
  const courseRef = useRef<string | undefined>(undefined);
  const lessonId = pathname ? lessonIdForSlug(pathname.replace(/^\/+/, "").split("/")) : null;
  courseRef.current = lessonId ? courseForNode(lessonId)?.slug : undefined;
  /* And which step, so reading one clears its review debt. */
  const lessonRef = useRef<string | undefined>(undefined);
  lessonRef.current = lessonId ?? undefined;

  useEffect(() => {
    let last = Date.now();
    let lastActive = Date.now();

    const bump = () => {
      lastActive = Date.now();
    };

    const flush = () => {
      const now = Date.now();
      const elapsed = (now - last) / 1000;
      last = now;
      if (document.visibilityState !== "visible") return;
      if (now - lastActive > IDLE_MS) return;
      if (elapsed <= 0) return;
      addStudySeconds(Math.min(Math.round(elapsed), MAX_TICK_S), courseRef.current, lessonRef.current);
    };

    const onVisibility = () => {
      // Bank what was earned up to the moment of leaving, then restart the
      // window on return so hidden time never lands in the next tick.
      flush();
      last = Date.now();
      if (document.visibilityState === "visible") lastActive = Date.now();
    };

    const timer = window.setInterval(flush, TICK_MS);
    for (const e of ACTIVITY) window.addEventListener(e, bump, { passive: true, capture: true });
    document.addEventListener("visibilitychange", onVisibility);
    // The tail of the last tick would otherwise be lost on close or reload.
    window.addEventListener("pagehide", flush);

    return () => {
      flush();
      window.clearInterval(timer);
      for (const e of ACTIVITY) window.removeEventListener(e, bump, { capture: true });
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  return null;
}
