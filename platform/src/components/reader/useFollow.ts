"use client";

import { useLayoutEffect, useState } from "react";

/*
 * Measures an "active" element relative to a container and follows it for a
 * short window (so it tracks expand/collapse). The consumer applies a CSS
 * transition to get the smooth slide. Elements are read through a getter so
 * the hook never has to know their concrete types.
 */
export function useFollow(
  deps: unknown[],
  getEls: () => { container: HTMLElement | null; active: HTMLElement | null },
) {
  const [m, setM] = useState({ top: 0, height: 0, visible: false });

  useLayoutEffect(() => {
    let raf = 0;
    const start = performance.now();
    const measure = () => {
      const { container, active } = getEls();
      if (!container || !active) { setM((s) => ({ ...s, visible: false })); return; }
      // Inside a collapsed folder: hidden immediately (the element is only
      // clipped by overflow, so its measured height is still non-zero).
      if (active.closest('[data-open="false"]')) { setM((s) => ({ ...s, visible: false })); return; }
      const er = active.getBoundingClientRect();
      const br = container.getBoundingClientRect();
      if (er.height < 4) { setM((s) => ({ ...s, visible: false })); return; }
      setM({ top: er.top - br.top, height: er.height, visible: true });
    };
    const loop = () => {
      measure();
      // Must outlast the folder collapse (260ms) so the bar keeps tracking
      // the active row for the whole animation.
      if (performance.now() - start < 340) raf = requestAnimationFrame(loop);
    };
    measure();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return m;
}
