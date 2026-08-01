"use client";

import { Avatar } from "./avatars";
import { EDIT_EVENT } from "./IdentityGate";
import { initials, useIdentity } from "@/lib/identity";

/* The header's account control while Clerk is off: the face the reader picked,
 * in the same 32px shell the circle buttons beside it wear. Clicking it
 * reopens the form — the only way to fix a typo in a name that is never asked
 * for twice, or to change school and courses. */
export function HeaderAvatar() {
  const { identity } = useIdentity();

  const shell =
    "grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full border border-[#d4d4d4] bg-white text-[11px] font-semibold text-ink-2 shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)]";

  /* Before the store has read localStorage there is no name to draw, and
   * guessing one would flash the wrong monogram at a returning reader. */
  if (!identity) return <div className={shell} aria-label="Account" />;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(EDIT_EVENT))}
      className={`${shell} transition-opacity hover:opacity-80`}
      title={`${identity.name} — change your details`}
      aria-label={`${identity.name}. Change your details`}
    >
      {/* The art is a full-bleed disc, so it fills the shell rather than
          sitting inside it. */}
      {identity.avatar ? <Avatar id={identity.avatar} size={32} /> : initials(identity.name)}
    </button>
  );
}
