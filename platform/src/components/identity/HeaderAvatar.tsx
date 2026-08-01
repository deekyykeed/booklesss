"use client";

import { Avatar } from "./avatars";
import { SETTINGS_EVENT } from "./pickers";
import { PlanRing } from "./PlanRing";
import { initials, useIdentity } from "@/lib/identity";
import { planLabel, usePlan } from "@/lib/plan";

/* The header's account control while Clerk is off: the face the reader picked,
 * in the same 32px shell the circle buttons beside it wear. Clicking it
 * opens Settings — the only way back to a name, a university and a course list
 * the app never asks about twice.
 *
 * The shell's hairline is drawn by PlanRing rather than by a CSS border, so the
 * same circle can carry how much of their plan's period is spent. With no plan
 * to report — which is every reader while Clerk is off — it is a plain grey
 * ring, exactly the border it replaced. */
/** The 32px button, less its 1px border on each side. */
const AVATAR_PX = 30;

export function HeaderAvatar() {
  const { identity } = useIdentity();
  const plan = usePlan();

  /* Same shell as the circle buttons beside it, border included. PlanRing draws
     the spend arc over the top; it used to draw the hairline too, but an SVG
     stroke on the 32px box reads thinner than a real 1px CSS border, so the
     avatar looked borderless next to search. The border is the button's now,
     and the ring only draws when there is a plan to report. */
  const shell =
    "relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#d4d4d4] bg-white text-[11px] font-semibold text-ink-2 shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)]";

  /* Sized to the inner circle, like the art, so the arc traces the border
     rather than a circle 1px outside it. */
  const ring = <PlanRing used={plan?.used ?? null} daysLeft={plan?.daysLeft} size={AVATAR_PX} />;

  /* Before the store has read localStorage there is no name to draw, and
   * guessing one would flash the wrong monogram at a returning reader. */
  if (!identity)
    return (
      <div className={shell} aria-label="Account">
        {ring}
      </div>
    );

  /* Two facts, one control, so the tooltip says both — what the ring is
     showing, then what clicking does. */
  const tip = plan ? `${planLabel(plan)} · ${identity.name}` : identity.name;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}
      className={`${shell} transition-opacity hover:opacity-80`}
      title={`${tip} — settings`}
      aria-label={`${tip}. Open settings`}
    >
      {/* The art fills the border's inner circle exactly, and nothing fades.
          Two earlier attempts both left a gap the eye reads as a detached
          border: sizing the art to 20px drew a white moat, and a radial mask
          that went transparent at the rim drew a thinner version of the same
          moat between the disc and the border.
          The mask existed to keep the ring visible when the ring was an SVG
          stroke under the art. The button carries a real 1px border now, which
          sits outside the art entirely, so the art can meet it edge to edge.
          AVATAR_PX is the button's 32px box less that 1px border on each side.
          Tailwind sets border-box, so `inset-0` is already that inner circle;
          the number has to match it or the disc is clipped off-centre. */}
      {identity.avatar ? (
        <span className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden rounded-full">
          <Avatar id={identity.avatar} size={AVATAR_PX} />
        </span>
      ) : (
        initials(identity.name)
      )}
      {/* After the art, not before it. Both are absolutely positioned over the
          same box, so the later one paints on top; drawn first, the spend arc
          was hidden behind the face. */}
      {ring}
    </button>
  );
}
