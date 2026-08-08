"use client";

import { useEffect, useState } from "react";

/* The probe. Deliberately calls `navigator.vibrate` DIRECTLY rather than going
 * through lib/haptics, so that a silent result here rules the app's own code out
 * entirely: if 100ms does nothing on this page, nothing about Booklesss is the
 * cause and the answer is in Android's settings.
 *
 * Everything is read on mount rather than during render, because two of the four
 * readings (the SW controller, the motion attribute) do not exist on the server
 * and would mismatch on hydration. */

/** Ascending, so the first one felt IS the device's floor. */
const STEPS = [8, 14, 20, 35, 50, 100, 200];

type Facts = {
  hasApi: boolean;
  motionAttr: string | null;
  prefersReduced: boolean;
  swControlled: boolean;
  standalone: boolean;
};

export function HapticsProbe() {
  const [f, setF] = useState<Facts | null>(null);
  const [last, setLast] = useState<string>("");

  useEffect(() => {
    setF({
      hasApi: typeof navigator !== "undefined" && typeof navigator.vibrate === "function",
      motionAttr: document.documentElement.dataset.motion ?? null,
      prefersReduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
      swControlled: !!navigator.serviceWorker?.controller,
      standalone: matchMedia("(display-mode: standalone)").matches,
    });
    /* Nothing here reports the build id, and it does not need to: this page did
       not exist before haptics did, so simply REACHING it proves the bundle is
       new enough. A stale service worker would have served a 404 or the offline
       page instead. */
  }, []);

  const fire = (ms: number) => {
    /* Straight at the API, no reduced-motion gate: this page is a measurement,
       so it must not be silenced by the thing it is trying to measure. */
    const ok = typeof navigator.vibrate === "function" ? navigator.vibrate(ms) : false;
    setLast(`${ms}ms → vibrate() returned ${String(ok)}`);
  };

  const row = (label: string, value: boolean | string | null, good?: boolean) => (
    <div className="flex items-baseline justify-between gap-4 border-b border-[#ececeb] py-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className={good === false ? "font-medium text-[#c2410c]" : "font-medium text-ink"}>
        {value === null ? "—" : String(value)}
      </span>
    </div>
  );

  if (!f) return <p className="mt-6 text-sm text-muted">Reading…</p>;

  return (
    <>
      <section className="mt-7">
        <h2 className="font-display text-sm font-semibold tracking-wide text-ink uppercase">
          What this device reports
        </h2>
        <div className="mt-2">
          {row("navigator.vibrate exists", f.hasApi, f.hasApi)}
          {row("Installed (standalone)", f.standalone)}
          {row("Service worker controlling", f.swControlled)}
          {row("App motion setting", f.motionAttr ?? "system")}
          {row("OS prefers-reduced-motion", f.prefersReduced, !f.prefersReduced)}
        </div>
        {!f.hasApi && (
          <p className="mt-3 text-sm text-[#c2410c]">
            No Vibration API on this browser. Nothing the app does can produce a haptic here — this
            is the expected result on any iOS browser.
          </p>
        )}
        {(f.motionAttr === "reduced" || f.prefersReduced) && (
          <p className="mt-3 text-sm text-[#c2410c]">
            Reduced motion is on, so the app silences haptics by design. The buttons below ignore
            that and fire anyway, which is how you tell this cause apart from the others.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-sm font-semibold tracking-wide text-ink uppercase">
          Find the floor
        </h2>
        <p className="mt-1 text-sm text-muted">
          Ascending. The first one you can feel is this phone&rsquo;s minimum useful duration, and
          the app&rsquo;s two values should sit at or above it.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {STEPS.map((ms) => (
            <button
              key={ms}
              type="button"
              onClick={() => fire(ms)}
              className="squircle rounded-xl border border-[#d4d4d4] bg-white px-4 py-3 text-sm font-medium text-ink shadow-lift active:scale-[0.98]"
            >
              {ms} ms
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const ok = navigator.vibrate?.([100, 60, 100]) ?? false;
              setLast(`pattern [100,60,100] → vibrate() returned ${String(ok)}`);
            }}
            className="squircle col-span-2 rounded-xl border border-[#d4d4d4] bg-white px-4 py-3 text-sm font-medium text-ink shadow-lift active:scale-[0.98]"
          >
            Pattern — buzz, pause, buzz
          </button>
        </div>
        {last && <p className="mt-3 font-mono text-[13px] text-muted">{last}</p>}
        <p className="mt-4 text-sm text-muted">
          If even the pattern and 200 ms are silent while <code>vibrate()</code> returns{" "}
          <code>true</code>, the page is being obeyed and Android is dropping it. Check{" "}
          <strong>Settings → Sound &amp; vibration → Vibration &amp; haptics</strong> (touch feedback
          on, intensity above zero), then silent mode, then battery saver.
        </p>
      </section>
    </>
  );
}
