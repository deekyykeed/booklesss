"use client";

import { useState } from "react";
import { AVATARS, Avatar, type AvatarId } from "./avatars";
import { avatarName } from "@/lib/identity";

/* ------------------------------------------------------------------ *
 * Twelve faces to choose from, out of two hundred.
 *
 * Owner, 2026-08-04, having finished onboarding: "i didnt get to pick my
 * avatar, can i not select it during onboarding?"
 *
 * TWELVE, NOT TWO HUNDRED. The set is 200 and showing all of them would be a
 * scroll with no end and no way to compare anything to anything — a choice
 * nobody can actually make. It is also not what the set is FOR: the note on
 * avatars.tsx says the pool is large so that "a student picks from twelve
 * UNCLAIMED faces", the size being what stops the thirteenth person meeting an
 * empty grid rather than something anyone is meant to see at once.
 *
 * SHUFFLED, NOT PAGED. "Show me others" rerolls the twelve rather than moving
 * through the set in order, because there is no order — no face is better than
 * another and page 14 of 17 is a decision nobody wants to make. Rerolling keeps
 * every tap the same size: look, pick, or look again.
 *
 * THE ONE THEY ALREADY HAVE IS ALWAYS IN IT, and always first. They arrived
 * with a face assigned on their first visit; a picker that could not contain it
 * would mean opening this screen silently costs you the avatar you have been
 * reading under, which is the opposite of a choice.
 * ------------------------------------------------------------------ */

/** How many at once. Four columns of three on a phone. */
const SHOWN = 12;

/** A sample of the set, with `keep` guaranteed to be in it and at the front. */
function sample(keep: AvatarId): AvatarId[] {
  const rest = AVATARS.filter((a) => a.id !== keep);
  /* Partial Fisher–Yates: only the first SHOWN-1 positions are needed, so this
     does not shuffle 200 entries to read 11 of them. */
  const pool = rest.slice();
  const take = Math.min(SHOWN - 1, pool.length);
  for (let i = 0; i < take; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return [keep, ...pool.slice(0, take).map((a) => a.id)];
}

export function AvatarPicker({
  value,
  onPick,
}: {
  value: AvatarId;
  onPick: (id: AvatarId) => void;
}) {
  /* Rolled once per mount rather than per render, or every keystroke in the
     name field beside it would deal a new set of faces under the reader's
     thumb. The lazy initialiser is safe here because this component is only
     ever rendered on the client — the step it lives on is behind `isClient`. */
  const [faces, setFaces] = useState<AvatarId[]>(() => sample(value));

  /* A face they picked from an earlier roll has to stay on screen, or tapping
     one and then shuffling would leave the grid with no selected tile and the
     student unable to see what they had chosen. */
  const shown = faces.includes(value) ? faces : [value, ...faces.slice(0, SHOWN - 1)];

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {shown.map((id) => {
          const on = id === value;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onPick(id)}
              aria-pressed={on}
              aria-label={avatarName(id)}
              title={avatarName(id)}
              className={
                "squircle grid aspect-square place-items-center rounded-2xl border transition-colors " +
                (on
                  ? "border-ink bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "border-line bg-white/60 hover:border-line-2")
              }
            >
              {/* The art is a full-bleed disc, so the tile's border is the only
                  shell — see the note on Avatar. Sized under the tile so the
                  selected ring reads as around it rather than cropping it. */}
              <Avatar id={id} size={38} />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setFaces(sample(value))}
        className="mt-3 text-[13px] font-medium text-muted transition-colors hover:text-ink"
      >
        Show me others
      </button>
    </div>
  );
}
