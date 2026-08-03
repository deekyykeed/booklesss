"use client";

import { useEffect, useState } from "react";
import { PLAYLIST_NAME, embedSrc } from "@/lib/music";

/* ------------------------------------------------------------------ *
 * Study music, docked at the foot of the reader's sidebar.
 *
 * Spotify's own compact embed rather than a bespoke bar: it already draws the
 * artwork, the track and the play button, and it is the only shape of player
 * that works without a Spotify login (see lib/music.ts for that trade).
 * Building our own controls around it would mean the IFrame API, which buys
 * nothing a reader can hear.
 *
 * WHY IT LIVES IN THE SIDEBAR, AND MUST STAY THERE.
 * The sidebar is rendered by the reader LAYOUT, which Next keeps mounted while
 * you navigate between steps. An iframe that unmounts stops playing, so a
 * player inside a step page would cut out every time someone opened the next
 * step — which is exactly when they are still reading. Collapsing the sidebar
 * translates the panel off-screen rather than unmounting it, and the mobile
 * drawer slides, so playback survives both.
 *
 * Consequence to keep in mind: this must never be moved into a page, a modal,
 * or anything that conditionally renders. Hide it with CSS if it ever needs
 * hiding.
 *
 * DEFERRED TO IDLE. The embed is a third-party iframe that pulls its own
 * scripts, artwork and audio, and most readers are on Zambian mobile data. It
 * would otherwise compete with the step's own fonts and content during the
 * first paint, for a thing nobody has asked to hear yet. So the row reserves
 * its space immediately and the iframe swaps in once the browser is idle.
 * ------------------------------------------------------------------ */

/* Spotify's compact height for a playlist. 352 is the other supported size and
 * shows a scrolling track list, which is a second thing to read in a column
 * that is already a list of steps. */
const HEIGHT = 152;

export function MusicBar() {
  const src = embedSrc();
  /* Mounted late, never early — see the header. `loaded` only ever goes
     false → true, so this cannot flap and reload the iframe mid-track. */
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    /* requestIdleCallback isn't in Safari until 17, and a student on an older
       iPhone should still get music — fall back to a timeout. */
    const idle = window.requestIdleCallback;
    if (idle) {
      const h = idle(() => setLoaded(true), { timeout: 3000 });
      return () => window.cancelIdleCallback?.(h);
    }
    const t = window.setTimeout(() => setLoaded(true), 1200);
    return () => window.clearTimeout(t);
  }, [src]);

  // A mistyped playlist link renders nothing rather than a broken frame.
  if (!src) return null;

  return (
    <div className="px-2 pb-2">
      {/* Same 12px radius Spotify's own embed rounds itself to, so the corners
          agree instead of showing a hairline of our background inside theirs. */}
      <div className="overflow-hidden rounded-xl bg-[#f4f4f3]" style={{ height: HEIGHT }}>
        {loaded ? (
          <iframe
            /* Not "Spotify" — the reader is being told what the thing plays,
               and a screen reader announcing the brand says nothing useful. */
            title={`Study music — ${PLAYLIST_NAME}`}
            src={src}
            width="100%"
            height={HEIGHT}
            style={{ border: 0, display: "block" }}
            /* encrypted-media is the one that matters: without it the audio is
               blocked outright, because Spotify serves DRM-protected streams.
               autoplay is listed because Spotify's own embed code lists it —
               nothing here autoplays (see lib/music.ts). */
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        ) : (
          /* Holds the exact height the iframe will take, so the sidebar doesn't
             jump when it arrives. */
          <div
            className="flex h-full items-center justify-center px-3 text-[12px] text-muted"
            aria-hidden="true"
          >
            {PLAYLIST_NAME}
          </div>
        )}
      </div>
    </div>
  );
}
