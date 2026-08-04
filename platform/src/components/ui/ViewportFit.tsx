"use client";

import { useEffect } from "react";

/* ------------------------------------------------------------------ *
 * How far the bottom of the page is from the bottom of what you can SEE.
 *
 * Published as `--vv-bottom` on <html>, for anything that has to sit on the
 * bottom edge of a phone screen and stay there.
 *
 * THE PROBLEM IT SOLVES (owner, 2026-08-04, with a screenshot of the onboarding
 * button sliced in half by the bottom of the screen: "this happens to the
 * button so it might need to be fixed or use some dynamic way to measure the
 * changing viewport").
 *
 * There are two viewports on a phone and CSS mostly talks to the wrong one. The
 * LAYOUT viewport is what `vh`, `position: fixed` and `position: sticky` are
 * measured against, and on Chrome Android it is sized for the state where the
 * URL bar has scrolled away — the tall one. The VISUAL viewport is what you can
 * actually see right now, which while the URL bar is showing is shorter by
 * exactly its height. So `bottom: 0` is honest about a bottom edge that is
 * somewhere below the glass, and an action bar pinned to it gets cut in half.
 *
 * `dvh` does not fix this. It gives the height of the dynamic viewport, which
 * is the right NUMBER, but a sticky or fixed element is still positioned
 * against the layout viewport's bottom — the units and the positioning are
 * answering different questions.
 *
 * So the gap is measured rather than assumed. `visualViewport` reports the
 * visible rectangle and where it sits, and the difference between the bottom of
 * the layout viewport and the bottom of that rectangle is the number every
 * bottom-pinned control needs. It is 0 on a desktop browser and 0 on a phone
 * once the URL bar has collapsed, which is why the bug is easy to miss: it only
 * appears in the state a student's FIRST screen is always in.
 *
 * IT ALSO ANSWERS THE KEYBOARD. When the on-screen keyboard opens, the visual
 * viewport shrinks from the bottom and this number grows by the keyboard's
 * height — so a bar using it rides above the keys instead of behind them. That
 * matters on the two questions in this flow with a text field in them.
 *
 * Mounted once, near the root. It sets a custom property and renders nothing.
 * ------------------------------------------------------------------ */

export function ViewportFit() {
  useEffect(() => {
    const vv = window.visualViewport;
    /* No API — every desktop browser and anything old enough to lack it. The
       property simply stays unset and its `0px` fallback applies, which is the
       behaviour everything had before this existed. */
    if (!vv) return;

    const root = document.documentElement;

    const measure = () => {
      /* innerHeight is the layout viewport; vv.height + vv.offsetTop is where
         the visible rectangle ends inside it. Clamped at 0 because the two can
         disagree by a fraction of a pixel mid-scroll, and a negative offset
         would lift the bar off the bottom edge for a frame. */
      const gap = Math.max(0, Math.round(window.innerHeight - (vv.height + vv.offsetTop)));
      root.style.setProperty("--vv-bottom", `${gap}px`);
    };

    measure();
    /* `scroll` as well as `resize`: on iOS the visual viewport OFFSET changes
       while the page is scrolled and the URL bar animates, without the height
       ever changing — resize alone leaves the bar a step behind the chrome it
       is meant to sit above. */
    vv.addEventListener("resize", measure);
    vv.addEventListener("scroll", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      vv.removeEventListener("resize", measure);
      vv.removeEventListener("scroll", measure);
      window.removeEventListener("orientationchange", measure);
      root.style.removeProperty("--vv-bottom");
    };
  }, []);

  return null;
}
