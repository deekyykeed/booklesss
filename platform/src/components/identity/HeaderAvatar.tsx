"use client";

import { Avatar } from "./avatars";
import { EDIT_EVENT } from "./IdentityGate";
import { PlanRing } from "./PlanRing";
import { initials, useIdentity } from "@/lib/identity";
import { planLabel, usePlan } from "@/lib/plan";

/* The header's account control while Clerk is off: the face the reader picked,
 * in the same 32px shell the circle buttons beside it wear. Clicking it
 * reopens the form — the only way to fix a typo in a name that is never asked
 * for twice, or to change school and courses.
 *
 * The shell's hairline is drawn by PlanRing rather than by a CSS border, so the
 * same circle can carry how much of their plan's period is spent. With no plan
 * to report — which is every reader while Clerk is off — it is a plain grey
 * ring, exactly the border it replaced. */
export function HeaderAvatar() {
  const { identity } = useIdentity();
  const plan = usePlan();

  const shell =
    "relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[11px] font-semibold text-ink-2 shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)]";

  const ring = <PlanRing used={plan?.used ?? null} daysLeft={plan?.daysLeft} />;

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
      onClick={() => window.dispatchEvent(new Event(EDIT_EVENT))}
      className={`${shell} transition-opacity hover:opacity-80`}
      title={`${tip} — change your details`}
      aria-label={`${tip}. Change your details`}
    >
      {ring}
      {/* Inside the shell, not filling it. The art is a full-bleed disc, so at
          32px it covered the white, the border and the shadow — a solid blob
          beside two light circles.
          At 20 the white reads as a gap rather than a seam: a filled disc
          carries far more weight than the line glyphs beside it, so matching
          their airiness means giving up more of the button than an icon
          would, and it leaves the ring room to be a ring. */}
      {identity.avatar ? <Avatar id={identity.avatar} size={20} /> : initials(identity.name)}
    </button>
  );
}
