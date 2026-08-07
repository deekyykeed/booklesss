"use client";

import { useEffect, useRef, useState } from "react";
/* The ref is typed as the `Player` CLASS, not the `IPlayer` interface it
 * implements: the package's index only re-exports `./player`, so `IPlayer`
 * itself is not reachable from outside. The class carries the same methods. */
import { Player } from "@lordicon/react";

/* Lordicon, wrapped so the rest of the app can use it like any other icon
 * (owner's pick, 2026-08-07: "i want to use it this way, that way i can always
 * change it up without doing too much").
 *
 * WHY THIS RATHER THAN THE GIFs IT REPLACES. A GIF is a decision baked into
 * pixels: to change the colour, the size, or which animation plays, you go back
 * to Lordicon and export again. A Lottie is vectors and a timeline, so the
 * colour, the state and the moment it plays are all parameters. That is not
 * theoretical here — the first pass shipped GIFs exported from the `in-reveal`
 * state, which plays when an icon APPEARS and therefore starts from an empty
 * frame, and on a control already on screen it read as the icon vanishing and
 * rebuilding itself. Owner: "the mistake i made was having the icons in-reveal
 * instead of on hover or on taps." With a Lottie that is one attribute.
 *
 * `@lordicon/react`, NOT `@lordicon/element`. The custom element was tried
 * first and works, but the React player is the better fit for two reasons out
 * of Lordicon's own docs:
 *   · `colorize` changes colour WITHOUT reloading the animation. `colors` (the
 *     element's only option) "requires reloading the animation", which is
 *     exactly the wrong cost on a control whose entire job is to change colour
 *     the instant it is tapped.
 *   · an imperative `playFromBeginning()` off a ref, so a tap plays the
 *     animation because the tap happened — rather than because a class was
 *     re-applied, which is the trick the CSS stand-in has to use.
 *
 * NEITHER PACKAGE SHIPS ANY ICONS, which is worth writing down because the
 * install line sits directly above a `<lord-icon src="…json">` snippet on
 * Lordicon's site and reads as though it does. Both are players; the artwork is
 * a separate per-icon download from your account. Checked, not assumed: there
 * is no icon JSON in either package beyond the handful of demos under
 * `@lordicon/element/examples/icons`.
 *
 * THE JSON IS SELF-HOSTED, fetched from `public/reader/icons/<meaning>.json`
 * rather than `require`d into the bundle or pulled off cdn.lordicon.com.
 *   · Not the CDN: Lordicon's own best-practice note says to host your own if
 *     the project matters, and an icon that needs the network is an icon that
 *     is missing for a student on a bad connection, which is this reader.
 *   · Not `require`: that is shipping artwork as code, the trap the avatars and
 *     the school crests both fell into and were pulled out of (see CLAUDE.md).
 *     Fetched, it is a file the browser caches once and no bytes in the bundle.
 * Named for what the icon MEANS, not Lordicon's catalogue number, so swapping
 * the artwork behind a meaning is a file replacement touching no code.
 *
 * ADDING ONE:
 *   1. Lordicon → the icon → Export → **Lottie**, not GIF
 *   2. save it as `platform/public/reader/icons/<meaning>.json`
 *   3. `node scripts/lord-states.mjs` — it prints the states that file has
 *   4. `<LordIcon name="<meaning>" state="<one of those>" …>`
 *
 * ⚠️ STEP 3 IS NOT OPTIONAL. An icon is not one animation, it is several, held
 * in the same file as named markers, and `state` picks between them. **A name
 * that does not match falls back to the default state silently** — so a guess
 * does not fail, it plays the wrong thing, which is the same bug as the GIF
 * with no error attached. For anything the reader taps, take a `hover-` state.
 *
 * ⚠️ LICENCE, UNSETTLED. Lordicon's free tier requires attribution, its paid
 * tiers do not, and nothing in this repo records which applies. Same shape as
 * the Burbank question still open in PROJECT_MEMORY, and cheaper to settle now
 * while it is on one control than after it has spread.
 */

/* One fetch per icon per page, however many copies are on screen. A step has a
 * checkpoint per section, so the un-cached version would be twenty requests for
 * two files. */
const cache = new Map<string, Promise<unknown>>();

function useIconData(name: string): unknown | null {
  const [data, setData] = useState<unknown | null>(null);
  useEffect(() => {
    let live = true;
    const url = `/reader/icons/${name}.json`;
    if (!cache.has(url)) {
      cache.set(
        url,
        fetch(url).then((r) => {
          if (!r.ok) throw new Error(`${url} → ${r.status}`);
          return r.json();
        }),
      );
    }
    cache
      .get(url)!
      .then((d) => live && setData(d))
      /* A missing icon must never take a checkpoint down with it. The caller
         renders its own fallback while this is null, so a failed fetch simply
         leaves that fallback in place. */
      .catch(() => {
        cache.delete(url);
      });
    return () => {
      live = false;
    };
  }, [name]);
  return data;
}

export function LordIcon({
  name,
  size = 26,
  state,
  colorize,
  playToken,
  autoplay = false,
  fallback = null,
}: {
  /** File stem under `public/reader/icons/`. */
  name: string;
  size?: number;
  /** A named animation inside the file. Read them with `lord-states.mjs`. */
  state?: string;
  /** Flatten every colour to this one, without reloading the animation. */
  colorize?: string;
  /** Change this value to replay from the first frame. */
  playToken?: unknown;
  /** Play once when the icon first becomes ready. */
  autoplay?: boolean;
  /** Drawn until the icon data has loaded, and left in place if it never does. */
  fallback?: React.ReactNode;
}) {
  const data = useIconData(name);
  const player = useRef<Player>(null);
  const first = useRef(true);

  useEffect(() => {
    if (!data) return;
    /* Skip the mount so a page of checkpoints does not all animate at once on
       arrival — the very thing `in-reveal` did wrong. `autoplay` opts in. */
    if (first.current) {
      first.current = false;
      if (!autoplay) return;
    }
    player.current?.playFromBeginning();
  }, [playToken, data, autoplay]);

  if (!data) return <>{fallback}</>;
  return <Player ref={player} icon={data} size={size} state={state} colorize={colorize} />;
}
