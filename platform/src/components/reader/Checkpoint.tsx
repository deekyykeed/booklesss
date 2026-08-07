"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { labelFor, nextLessonId, pathForId } from "@/lib/course";
import { rate, useProgress, type Grasp } from "@/lib/progress";
import { MynaIcon, type MynaIconName } from "@/components/icons/myna";
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
 * ORDER: "Later" then "Got it" (owner, 2026-08-02), so the positive answer is
 * the outermost mark on the right. It reads worst-to-best towards the edge and
 * puts the answer most readers reach for under the thumb already there.
 *
 * COLOUR ON TAP, from the doodles that were here for an afternoon: the orange
 * off the smiling face, and a pink for the down. The pink is the shock face's
 * own #fcb4cd brought down to the orange's weight — at 20px solid, the original
 * is so light it reads as a smudge, and a pair has to carry the same weight or
 * one of them looks disabled.
 *
 * `tone` drives the hue of the mark, the hover and the focus ring, and the mark
 * swaps to its solid twin when chosen — so an answer given is bolder AND
 * coloured, which is the same two-signal pattern the sidebar rows use.
 */
const ANSWERS: { id: Grasp; label: string; icon: MynaIconName; iconOn: MynaIconName; tone: string }[] = [
  { id: "not", label: "Later", icon: "dislike", iconOn: "dislike-solid", tone: "#f2749b" },
  { id: "got", label: "Got it", icon: "like", iconOn: "like-solid", tone: "#faa709" },
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
          sat together, so neither looks like an option in the other's set.

          ON ITS OWN SURFACE as of 2026-08-07 (owner: "put the interaction items
          in their own container", then a picture of a comment bar). The
          controls used to float directly on the page, which was fine while they
          were hairline glyphs and stopped being fine the moment they became
          drawn artwork: three coloured marks loose on the reading column read
          as decoration that had landed there, not as a thing to use.

          WHITE, LIKE EVERY OTHER CONTAINER, and lifted with the same shadow
          (owner, 2026-08-07: "the container will be white just like other
          containers, will have a shadow"). It was a grey pill for one revision.
          The grey said "control" loudly, but it also said "not part of this
          page" — the reader has exactly one filled-grey surface language and it
          belongs to menus and inputs, not to the reading column. White plus
          `shadow-lift` is what a callout and a card already use, so the row
          reads as one more thing the step is made of rather than as chrome that
          landed on it.
          6px of padding all round (`p-1.5`), down from the 8px it shipped at
          this afternoon. The buttons inside are 34px and carry their own
          breathing room, so the container's padding is stacked on top of theirs
          and 8px made the row taller than the controls in it needed. The marks
          are 20px, so this is a control strip rather than a box with things in
          it.
          `rounded-3xl` (owner, 2026-08-07: "the container radius needs a lot
          more rounded, and keep the squircle there"). It is the same 24px a
          callout and a card take, which is the point — this is one of the
          containers, so it wears their corner. At a row height of about 50px
          that reads as very round without being the pill it was an hour ago,
          and `squircle` is what keeps the corner a continuous curve rather than
          the quarter-circle a plain radius draws. */}
      <div className="squircle checkpoint-row flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[#e7e7e6] bg-white p-1.5 shadow-lift">
        <SectionNote lessonId={lessonId} sectionId={checkpointId} />
        <div
          className="grasp-group"
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
                className="grasp-btn squircle"
                style={{ "--grasp-tone": a.tone } as React.CSSProperties}
              >
                {/* 26px, not the 20px the glyphs sat at: a drawn face needs
                    more room to be legible than a two-stroke mark does, and
                    the button is 34px so it still has air round it.
                    `key` on the src is what makes the reveal REPLAY. A browser
                    plays a GIF once and then holds the last frame; swapping
                    the same src back in is a cache hit and shows a still.
                    Re-keying on the answer forces a fresh element each time
                    the reader changes their mind, so the animation fires on
                    every real selection and never on a re-render.
                    Unoptimised: next/image would re-encode the GIF and drop
                    every frame but one. These are already sized and already
                    small, so they are served as they are. */}
                {/* 20px (owner, 2026-08-07). Line at rest, solid when it is
                    the answer given, and coloured by `--grasp-tone` off the CSS
                    — so a tap changes BOTH the weight and the hue, which is the
                    same pair of signals the sidebar uses for its current row.
                    strokeWidth 1.2 rather than MynaUI's 1.5: at 20px with
                    nothing bounding it, the default weight reads heavy beside
                    the flag on the other end of the row. */}
                <MynaIcon name={active ? a.iconOn : a.icon} size={20} strokeWidth={1.2} />
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
