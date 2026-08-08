"use client";

import INDEX from "./avatar-index.json";

/* ------------------------------------------------------------------ *
 * The profile pictures.
 *
 * TWO HUNDRED, SERVED AS FILES. This module used to inline twelve icons as
 * markup strings, and carried its own warning about why it could never be more:
 * ~2KB of path data each, in a client component, shipped to every reader for
 * one picture. Now `public/avatars/<id>.svg` holds the artwork and this file
 * holds a list of ids — so the browser fetches and caches only the faces it
 * actually draws, and a reader who never opens the picker downloads none.
 *
 * That is what made 200 possible (owner, 2026-08-04): a student picks from
 * twelve UNCLAIMED faces, which needs a pool far larger than twelve or the
 * thirteenth person to sign up meets an empty grid.
 *
 * Streamline "Kameleon Colors" free set, CC BY 4.0, attribution owed with the
 * rest. Each icon is a finished badge — a full-bleed disc in one of the set's
 * flat colours with its subject on it — so nothing is recoloured and nothing
 * needs a shell drawn round it.
 *
 * Regenerate the artwork and the index with `npm run gen:avatars`. The JSON is
 * generated; this file is not, and is where behaviour lives.
 * ------------------------------------------------------------------ */

/**
 * An avatar's id.
 *
 * `string`, where it used to be a literal union of twelve. The list is data
 * now, and a union here would be a hand-kept copy of a 200-row file — right
 * until somebody regenerates it and forgets, at which point the types deny a
 * face that exists. `resolveAvatar` does the checking the union pretended to,
 * and does it against the actual list.
 */
export type AvatarId = string;

type Entry = { id: AvatarId; label: string };

export const AVATARS: Entry[] = INDEX.avatars;

/** Old ids kept working. The first twelve were hand-named and do not all match
 *  their icon — "smiley" is the icon "love-smiley" — so a record written before
 *  today would otherwise resolve to nothing and that student would silently
 *  lose their face. A stored id is a promise. */
const LEGACY: Record<string, string> = INDEX.legacy;

const BY_ID = new Map(AVATARS.map((a) => [a.id, a]));

/** The one a student gets before they have chosen. */
export const DEFAULT_AVATAR: AvatarId = "astronaut";

/** An id this build still draws, resolving an old alias on the way. A stored id
 *  can outlive its entry — the set was Plump before it was Kameleon — so
 *  anything unknown resolves to the default rather than rendering a broken
 *  image. */
export function resolveAvatar(id: AvatarId | string | null | undefined): AvatarId {
  if (typeof id !== "string" || !id) return DEFAULT_AVATAR;
  if (BY_ID.has(id)) return id;
  const aliased = LEGACY[id];
  return aliased && BY_ID.has(aliased) ? aliased : DEFAULT_AVATAR;
}

/** The file an avatar's artwork lives at. Same-origin, so the CSP that forbids
 *  a remotely-hosted logo has never had anything to say about it. */
export function avatarSrc(id: AvatarId | string): string {
  return `/avatars/${resolveAvatar(id)}.svg`;
}

/**
 * One avatar. The art is a full-bleed disc, so it needs no shell of its own —
 * anything round it is the caller's border, not the icon's.
 */
export function Avatar({ id, size = 40 }: { id: AvatarId | string; size?: number }) {
  const resolved = resolveAvatar(id);
  /* An <img>, not inline SVG. width/height are attributes as well as style so
     the box is reserved before the file lands: the picker draws twelve at once,
     and a grid that reflows as they arrive is a grid somebody mis-taps.
     Not lazy — the header's avatar and every tile in an open picker are already
     on screen, and lazy would blink them in.

     `avatar-fade` takes the pop off the arrival (owner, 2026-08-08, Safari).
     The box was always reserved, so nothing moved — but the art appeared at
     full strength in one frame, which against the pulsing placeholder it
     replaces read as a flicker rather than a load. See globals.css. */
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/avatars/${resolved}.svg`}
      alt=""
      role="img"
      aria-label={BY_ID.get(resolved)?.label}
      width={size}
      height={size}
      decoding="async"
      className="avatar-fade shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

/** The label for an id — for alt text and tooltips outside the picker. */
export function avatarLabel(id: AvatarId | string): string {
  return BY_ID.get(resolveAvatar(id))?.label ?? "Avatar";
}
