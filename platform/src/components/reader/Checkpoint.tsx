"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { labelFor, nextLessonId, pathForId } from "@/lib/course";
import { rate, useProgress, type Grasp } from "@/lib/progress";
import { UltimateIcon, type UltimateIconName } from "@/components/icons/ultimate";
import { hapticConfirm } from "@/lib/haptics";
import { gateStepLink, needsAccount } from "@/lib/account";
import { requireAccount } from "@/lib/onboarding";
import { SectionNote } from "./SectionNote";

/* Two answers: "Later" and "Got it".
 *
 * It was three, worst-to-best ("Not yet", "Almost", "Got it"), and the owner's
 * objection to "Not yet" is the right one: it asks the reader to grade
 * themselves and then leaves them with nothing to do about the grade. "Later"
 * is a decision instead of a verdict, and it is the one the reader actually
 * has: come back to this, or move on. "Almost" went with it, because the
 * moment the scale stops being a self-rating a midpoint means nothing.
 *
 * `Grasp` still carries "almost" and progress.tsx still weights it at 0.5, so
 * ratings already saved on a device keep counting. Nothing writes it any more.
 *
 * Amber then green, each dark enough to hold 5.2:1 on the content surface.
 * Green is completion, the same thing it means everywhere else here.
 *
 * THE MARKS, in order, all owner-led. Worth keeping because the pattern in it
 * is the useful part: every pair that described what happens NEXT lost to a
 * pair that described how the reader FEELS.
 *   2026-08-02  a clipboard and a bookmark, with words beside them
 *               → bookmark + ticked circle, once the words came off
 *               → Solar Duotone thumbs
 *               → MynaUI smiling and sad faces
 *   2026-08-07  drawn doodle faces (Lordicon), grey at rest and colour when
 *               chosen
 *               → thumbs again, and this time they stay
 *
 * The thumbs lost in August on the argument that they read as a verdict on the
 * WRITING rather than on the reader's grasp of it, and the faces answered "how
 * did that land". That argument is now spent, because the row has a second
 * control: the flag on the left is where a verdict on the writing goes, and it
 * says which kind. With that question asked properly somewhere else, the right
 * hand side is free to be the plain thing it always wanted to be — did this
 * land, yes or no.
 *
 *   2026-08-08  Streamline Ultimate Colors faces, and THREE of them
 *
 * THREE ANSWERS, NOT TWO (owner, 2026-08-08: "3 icons indicating the 3 main
 * reactions someone would have about what they've just read"). This is a
 * restoration rather than a new scale: `Grasp` in lib/progress has always been
 * `got | almost | not` with a weight each (1 / 0.5 / 0), and the middle one has
 * been unreachable from the UI for weeks while the dashboard went on scoring
 * it. Nothing stored changes meaning, and every answer already recorded still
 * reads the same.
 *
 * ORDER: worst to best, left to right, so the positive answer is the outermost
 * mark on the right (owner, 2026-08-02, when there were two). It puts the
 * answer most readers reach for under the thumb already there, and the middle
 * step slots in where it belongs on that scale rather than beside it.
 *
 * THE FACES ARE STREAMLINE ULTIMATE COLORS (FREE) — owner's pick of family.
 * They are multicolour and ignore currentColor, so `tone` is gone: the marks no
 * longer take a hue from CSS, they arrive with their own. What replaces it is a
 * pair of drawn states, `full` and `rest`, generated together — see
 * icons/ultimate.tsx. An unchosen face keeps all of its black line work and
 * loses only its colour, which is the treatment the owner arrived at on
 * 2026-08-07 (a793eae) after a CSS `grayscale`/`opacity` filter greyed the line
 * work as hard as the fill and made the whole mark faint.
 *
 * WHY THESE THREE FACES of the ten in the free set: the set has NO neutral or
 * confused face (checked exhaustively), so the middle step had to be built from
 * what exists. Grin / flat mouth / frown is the only trio that reads as one
 * scale. `smiley-mad` is red and furious, which is not what "not yet" means,
 * and `smiley-unhappy-1` is a weaker `smiley-sad-1`, so the bottom two steps
 * would have been the same picture. Full reasoning in the generator.
 */
const ANSWERS: { id: Grasp; label: string; icon: UltimateIconName }[] = [
  { id: "not", label: "Lost me", icon: "smiley-sad-1" },
  { id: "almost", label: "Sort of", icon: "smiley-disapointed" },
  { id: "got", label: "Got it", icon: "smiley-happy" },
];

/* End-of-section checkpoint — a scale rather than a tick.
 *
 * "Mark as done" only ever asked whether the reader had scrolled past. Asking
 * what they want to do about the section costs the same one tap and returns
 * something the dashboard can use: which steps are understood and which are
 * waiting to be come back to. Either answer clears the checkpoint (see rate():
 * withholding progress from an honest "Later" would just teach everyone to
 * press the good one); pressing the answer you already gave takes it back.
 *
 * The buttons carry their own words, so there is no prompt above them. */
export function Checkpoint({
  lessonId,
  checkpointId,
  heading,
}: {
  lessonId: string;
  checkpointId: string;
  heading: string;
}) {
  const { hydrated, graspOf, toggle } = useProgress();
  // Before hydration the server HTML knows nothing, so everything renders
  // unanswered and settles once localStorage has been read.
  const chosen = hydrated ? graspOf(lessonId, checkpointId) : null;

  /* The comment control is NOT here. It sat beside the note button for one
     revision and the owner moved it out (2026-08-02): commenting lives in the
     right panel with the table of contents, and a third mark in this row was
     the "extra icon" that made two clear controls read as a toolbar. This row
     stays two questions, one at each end. */

  return (
    <>
      {/* Two ends, asking two different things: how the section READ (left) and
          what the reader wants to DO about it (right). Pushed apart rather than
          sat together, so neither looks like an option in the other's set. That
          much has held through every revision of this row.

          NOTHING IS DRAWN AROUND ANY OF IT as of 2026-08-08 (owner: "id like to
          remove the containers around the buttons"). Four marks on the page, held
          apart by space. The container is not lost work: see .mark-cluster in
          globals.css for the recipe and for why bare reads correctly now when it
          did not on 2026-08-07 — the marks were always-coloured artwork then and
          are line-drawn-until-chosen now.

          THREE SHAPES IN TWO DAYS, and the useful part is that each one was
          answering a real objection: bare hairlines → one white strip (drawn
          faces loose on the reading column read as decoration) → a pill per
          question (one strip made four marks look like one set of options) →
          bare again. The row did not go in a circle; the marks changed under it
          each time.

          ⚠️ ONE MEASUREMENT WORTH NOT LOSING, since nothing here has a radius
          any more. CSS clamps a border-radius to HALF the box it curves, so on
          the 44px strip this row used to be, every value from 22px up rendered as
          an identical full pill — which is why 24px was asked for, applied, and
          changed nothing, and why 16px was the first value that drew a visible
          corner. If a container ever comes back here, check the radius against
          half the height before trusting the number. */}
      <div className="checkpoint-row flex flex-wrap items-center justify-between gap-3">
        <SectionNote lessonId={lessonId} sectionId={checkpointId} />
        <div
          className="grasp-group mark-cluster"
          role="radiogroup"
          aria-label={`How much of "${heading}" landed?`}
          data-answered={chosen ?? undefined}
        >
          {ANSWERS.map((a) => {
            const active = chosen === a.id;
            return (
              <button
                key={a.id}
                type="button"
                /* Pressing the current answer takes it back — the same
                   second-press-undoes rule the tick had, so an answer stays the
                   reader's to correct. */
                /* SIGNED OUT, THE TAP DOES NOT LAND (owner, 2026-08-03, off
                   the live app: "shouldn't be able to use these feedback
                   icons if I'm not signed in"). The first cut recorded the
                   answer and then offered to keep it, and the owner's tap
                   stuck while the header still said Sign in — an answered
                   checkpoint next to a signed-out header reads as a control
                   that ignored the rule. So the ask replaces the answer, and
                   it asks on every tap: the tap did nothing, so there is
                   nothing to nag about, only the same door each time. */
                onClick={() => {
                  if (needsAccount()) {
                    requireAccount("checkpoint");
                    return;
                  }
                  /* Called here, in the handler, because a browser ignores
                     vibrate() outside a user gesture. Android only; silently
                     nothing on iOS, and nothing at all if the reader has asked
                     this app for reduced motion. See lib/haptics. */
                  hapticConfirm();
                  if (active) toggle(lessonId, checkpointId);
                  else rate(lessonId, checkpointId, a.id);
                }}
                role="radio"
                aria-checked={active}
                aria-label={a.label}
                /* The label is off-screen now (see .grasp-label), so the tooltip
                   is the only way a mouse reader recovers the word. */
                title={a.label}
                data-active={active ? "" : undefined}
                className="grasp-btn"
              >
                {/* 20px. It went to 12 and back on 2026-08-08 (owner), and the
                    reason is about the button rather than the mark: `.grasp-btn`
                    is a fixed 28px, so shrinking the glyph does not shrink the
                    control, it leaves a small mark floating in a full-size
                    target. 20 in 28 fills its button.
                    `muted` is the whole state model now that these carry their
                    own colour: the chosen face is drawn in full, the other two
                    keep every black line and lose their fills. Nothing fades and
                    nothing is filtered — see the generator for why a CSS
                    grayscale was the wrong tool for this.
                    SectionNote's flag is the fourth mark in this row and is set
                    to 20 as well. Move the two together. */}
                <UltimateIcon name={a.icon} size={20} muted={!active} />
                <span className="grasp-label">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* The foot of a step, and the app's one real gate.
 *
 * A reader from a WhatsApp link gets the step they were sent, whole: no form
 * on arrival, no wall mid-read, checkpoints they can answer. Moving to the
 * NEXT step is where an account is asked for, because that is the first moment
 * the reader has shown the app is worth something to them, and the first
 * moment it can honestly say what an account is for — carrying this on.
 *
 * It stays a real <Link>: the href is the true destination, so the browser
 * shows it on hover, it opens in a new tab from a long-press, and a crawler
 * follows it. The gate is on the plain left-click only, which is the one the
 * sheet can actually serve.
 *
 * `after` carries the destination into the sheet, so signing up lands on the
 * step they were reaching for rather than back at the top of the app.
 *
 * ONE FREE STEP IS A GUESS. It is the owner's spec as stated, and it is also
 * the whole funnel in one number — a WhatsApp reader meets this at the end of
 * their first step. If the group drop converts badly this is the first dial to
 * turn, and turning it means counting steps read on the device rather than
 * changing this file's shape. Left as it is rather than invented differently.
 */
export function StepComplete({ lessonId }: { lessonId: string }) {
  const next = nextLessonId(lessonId);
  const router = useRouter();
  /* No closing card. It carried a ring, a progress count, a "Keep going"
   * heading and a "Mark rest done" button, and every one of those was the page
   * talking about itself. "Keep going" congratulates a reader who has not
   * finished; the count repeats what the sidebar already shows; and "Mark rest
   * done" asks someone to declare sections finished that they have not read,
   * which is the one thing the checkpoints exist to record honestly.
   *
   * What is left is the only thing the reader wanted at the foot of a step:
   * the way on. With no next step the page simply stops. */
  if (!next) return null;

  const href = pathForId(next);

  return (
    <Link
      href={href}
      onClick={(e) => {
        /* Prefetched when the gate takes the click, so the moment they finish
           signing up the step is already there — the sheet's whole promise is
           that they carry on. */
        if (gateStepLink(e, href)) router.prefetch(href);
      }}
      className="mt-14 flex items-center gap-2 text-[17px] font-medium text-ink transition-colors hover:text-muted"
    >
      <span className="truncate">{labelFor(next)}</span>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
        <path
          d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
