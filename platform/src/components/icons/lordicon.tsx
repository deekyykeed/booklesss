"use client";

import { useEffect, useState } from "react";

/* Lordicon's `<lord-icon>` custom element, wrapped so the rest of the app can
 * use it like any other component (owner's pick, 2026-08-07: "i want to use it
 * this way, that way i can always change it up without doing too much").
 *
 * WHY THIS RATHER THAN THE GIFs IT REPLACES. A GIF is a decision baked into
 * pixels: to change the colour, the size, or when it plays, you go back to
 * Lordicon and export again. A Lottie is vectors and a timeline, so `colors`,
 * `trigger`, `state`, `speed` and `stroke` are all attributes — the icon can be
 * recoloured to the tone of whatever it sits on, told to play on tap rather
 * than on load, and swapped for a different one by changing a filename.
 *
 * `@lordicon/element` v2 BUNDLES ITS OWN PLAYER (`@lordicon/web`). The install
 * line in Lordicon's own docs still pairs it with `lottie-web`, which v2 does
 * not import — that was installed here, found to be dead weight, and removed
 * the same hour. Do not add it back; it is ~250KB of player for a player that
 * is already in the box.
 *
 * THE JSON IS SELF-HOSTED, never fetched from cdn.lordicon.com. Two reasons and
 * both matter: `/sw.js` is served under `default-src 'self'`, and an icon that
 * needs the network is an icon that is missing for a student on a bad
 * connection — which is exactly the reader this app is built for. Files live in
 * `public/reader/icons/<name>.json` and are named for what they ARE, not for
 * Lordicon's catalogue number, so swapping the artwork behind a meaning is a
 * file replacement and touches no code.
 *
 * ADDING ONE:
 *   1. Lordicon → the icon → Download → Lottie (.json)
 *   2. save it as `platform/public/reader/icons/<meaning>.json`
 *   3. `node scripts/lord-states.mjs` — it prints the states that file has
 *   4. use `<LordIcon name="<meaning>" state="<one of those>" …>`
 * There is no generator here, unlike myna.tsx: these are files served as
 * files, so nothing has to be inlined and nothing has to be kept in step.
 *
 * ⚠️ STEP 3 IS NOT OPTIONAL, AND IT IS THE ONE THAT HAS ALREADY COST SOMETHING.
 * An icon is not one animation. It is several, held in the same file as named
 * markers — `in-reveal`, `hover-smile`, `hover-pinch` — and `state` picks
 * between them. **The player falls back to the default state when a name does
 * not match, silently**, so a guessed name does not fail, it plays the wrong
 * thing.
 * `in-reveal` is the trap. It is what Lordicon previews first and it plays when
 * an icon APPEARS, so it begins from an empty frame. On a control that is
 * already on screen it reads as the icon vanishing and rebuilding itself. That
 * is what the checkpoint faces did as GIFs, and it is why they are stills right
 * now — owner, 2026-08-07: "the mistake i made was having the icons in-reveal
 * instead of on hover or on taps." **For anything the reader taps, take a
 * `hover-` state and set `trigger="click"`.**
 *
 * ⚠️ LICENCE, UNSETTLED. Lordicon's free tier requires attribution, its paid
 * tiers do not. Nothing in this repo records which applies here. That is the
 * same shape as the Burbank question still open in PROJECT_MEMORY, and it is
 * cheaper to settle now, while it is on one control, than after it has spread.
 */

/* React needs to be told this tag exists; it is a custom element, not an
 * intrinsic one. Attributes are passed through as-is, which is what a custom
 * element wants — React 19 sets unknown props as attributes rather than
 * dropping them. */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "lord-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        trigger?: string;
        state?: string;
        colors?: string;
        stroke?: string;
        speed?: string | number;
        target?: string;
        loading?: string;
      };
    }
  }
}

/** How the icon is set going. `click` and `hover` are self-explanatory; `in`
 *  plays once on appearing; `loop` and `loop-on-hover` repeat; `morph`,
 *  `boomerang` and `sequence` are the multi-state ones. */
export type LordTrigger =
  | "in"
  | "click"
  | "hover"
  | "loop"
  | "loop-on-hover"
  | "morph"
  | "boomerang"
  | "sequence";

/* Defined ONCE per page, and only in the browser: `customElements` does not
 * exist on the server, and defining the same tag twice throws.
 *
 * The define runs in an effect, which looks like it would be too late — the
 * element is in the DOM before the effect fires. It is not: an unrecognised tag
 * renders as an inert element and the browser UPGRADES it the moment the
 * definition arrives. That is the whole point of the upgrade step, and it is
 * why this needs no script in the document head.
 *
 * The module-level flag is what stops fifty checkpoints each importing the
 * package: the import itself is shared, and the define is a no-op after the
 * first. */
let defined = false;
let defining: Promise<void> | null = null;

function useLordicon(): boolean {
  const [ready, setReady] = useState(defined);
  useEffect(() => {
    if (defined) return;
    /* Imported dynamically so the player lands in its own chunk rather than in
       the reader's first load. Nothing above the fold needs it. */
    defining ??= import("@lordicon/element").then(({ defineElement }) => {
      if (defined) return;
      defineElement();
      defined = true;
    });
    let live = true;
    defining.then(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, []);
  return ready;
}

export function LordIcon({
  name,
  size = 26,
  trigger = "in",
  state,
  colors,
  className,
  style,
}: {
  /** File stem under `public/reader/icons/`. */
  name: string;
  size?: number;
  trigger?: LordTrigger;
  /** A named segment of the animation, e.g. "hover-pinch". */
  state?: string;
  /** Lordicon's own format: "primary:#17171c,secondary:#faa709". */
  colors?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ready = useLordicon();
  /* Until the element is defined the tag is inert and paints nothing, which
     would make the control appear empty for a beat on a slow connection. A box
     of the right size holds the space so nothing under it moves when the icon
     arrives. */
  if (!ready) return <span aria-hidden="true" style={{ width: size, height: size }} />;
  return (
    <lord-icon
      src={`/reader/icons/${name}.json`}
      trigger={trigger}
      state={state}
      colors={colors}
      className={className}
      style={{ width: size, height: size, ...style }}
    />
  );
}
