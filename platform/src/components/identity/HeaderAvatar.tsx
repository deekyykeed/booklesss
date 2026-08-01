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
      onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}
      className={`${shell} transition-opacity hover:opacity-80`}
      title={`${tip} — settings`}
      aria-label={`${tip}. Open settings`}
    >
      {ring}
      {/* Full-bleed, softened at the rim. Sizing the art down to 20px left a
          white moat that read as a mistake rather than as breathing room; the
          face is the thing being shown, so it gets the whole button.
          A radial mask fades the last few pixels to nothing, which keeps the
          disc from butting hard against the ring and stops the heavy fill
          shouting over the line icons beside it — the same restraint the small
          size was buying, without the moat. Solid to 74% of the radius, gone by
          the rim, so the ring reads clean all the way round. */}
      {identity.avatar ? (
        <span
          className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden rounded-full"
          style={{
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 74%, transparent 97%)",
            maskImage: "radial-gradient(circle at 50% 50%, #000 74%, transparent 97%)",
          }}
        >
          <Avatar id={identity.avatar} size={32} />
        </span>
      ) : (
        initials(identity.name)
      )}
    </button>
  );
}
