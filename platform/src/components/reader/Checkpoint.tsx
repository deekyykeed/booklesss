"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { labelFor, nextLessonId, pathForId } from "@/lib/course";
import { rate, useProgress, type Grasp } from "@/lib/progress";
import { TablerIcon, type TablerIconName } from "@/components/icons/tabler";
import { LordIcon } from "@/components/icons/lordicon";
import { hapticConfirm } from "@/lib/haptics";
import { recordReaction } from "@/lib/reactions";
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
 *   2026-08-09  Streamline Freehand, and the question changes underneath them
 *   2026-08-09  Tabler, and the answers get their words back
 *
 * THE QUESTION IS NO LONGER "HOW MUCH LANDED" (owner, 2026-08-09: "the icons
 * will now be love it, hate it or Save for later"). Every earlier version of
 * this row asked the reader to place themselves on a comprehension scale. These
 * three are not a scale: two are verdicts on the writing and the third is a
 * decision about what to do next. That is a real change of question, not a
 * relabelling, and the drawings follow it — which is why "save for later" is an
 * object you come back to rather than a face.
 *
 * ⚠️ WHAT IT COSTS, WRITTEN DOWN BECAUSE NOTHING ELSE WILL SAY IT. The three
 * answers still store as `Grasp` (`got | almost | not`, weighted 1 / 0.5 / 0 in
 * lib/progress), so nothing already recorded breaks and the dashboard keeps
 * working untouched. But the dashboard's Performance figure is computed off
 * those weights, and it now measures whether a reader LIKED a section rather
 * than whether they understood it. A step somebody hated and understood
 * perfectly scores zero. If Performance is meant to stay a comprehension
 * measure, this row is no longer its input and the two need separating —
 * see the mapping below for where a fourth value would go.
 *   love → got     hate → not     save for later → almost
 *
 * ORDER: the positive answer is the outermost mark on the right (owner,
 * 2026-08-02, when there were two), because it puts the answer most readers
 * reach for under the thumb already there. "Save for later" sits in the middle
 * on the same logic that put "almost" there — it is the answer that is neither.
 *
 *   2026-08-09  Lordicon doodles again, and this time they stay put
 *
 * THE MARKS ARE LORDICON DOODLE-COLOR, ANIMATED (owner, 2026-08-09: "let's go
 * back to the lordicons i had a few iterations before"). They were here for one
 * afternoon on 2026-08-07 and came off the same day; the path was kept working
 * and parked rather than deleted, which is why coming back is a wiring job and
 * not a rebuild — see WORKSPACE.md "Animated icons", and the long note in
 * icons/lordicon.tsx for every trap in getting one on screen.
 *
 * ⚠️ TABLER IS STILL HERE, AS THE FALLBACK, AND THAT IS THE POINT. A Lottie is
 * a fetch, and this reader is read on Zambian mobile data. `LordIcon` draws
 * whatever `fallback` gives it until its JSON has landed and leaves it there
 * forever if the fetch fails, so a checkpoint on a bad connection is a static
 * Tabler mark rather than a hole. Everything about the row still works in that
 * state: the outline/filled pair still says which answer is yours. The note
 * button and its five verdicts opposite are Tabler outright — see the note over
 * `.grasp-mark` in globals.css for why they did not follow the faces.
 *
 * GREY AT REST, ITS OWN COLOURS WHEN CHOSEN — the same state model the row has
 * had through every family.
 *
 * ⚠️ NOT `colorize`, AND THIS WAS BUILT WRONG FIRST. `colorize` is the obvious
 * tool — it flattens a Lottie to one colour without reloading it, which is the
 * whole reason this app uses `@lordicon/react` over `@lordicon/element`. It is
 * also the wrong tool for a FILLED drawing: flattening every colour to one grey
 * paints the eyes and the mouth the same grey as the head, and the rest state
 * rendered as a featureless grey disc. Every face in the row was a blank circle
 * until it was tapped. `colorize` suits a line icon, where the only colour is
 * the line.
 *
 * `filter: grayscale(1)` in CSS instead (see `.grasp-btn:not([data-active])
 * .grasp-mark`). It takes the hue out and leaves the drawing, so a resting mark
 * is still a recognisable sad or happy face — which matters more here than in
 * any previous family, because these are the only marks in this row a reader
 * cannot identify from their outline alone.
 *
 * It also puts the rest state back in CSS, where the rest of the row's colours
 * live. A `colorize` grey would have had to be a hex in this file kept in step
 * with `.grasp-btn`'s `color` by hand — one value written twice, which is the
 * thing moving to Tabler had just fixed.
 *
 * THE ANIMATION PLAYS BECAUSE THE TAP HAPPENED, which is why `playToken` is a
 * per-answer counter rather than `active`. Keyed on `active`, the mark you just
 * turned OFF would replay too — the previously chosen answer flips true→false in
 * the same click — so letting go of an answer would animate a mark you did not
 * touch. The counter only ever changes on the button that was pressed, and only
 * after the signed-out gate has let the tap through: a tap that did nothing
 * animates nothing.
 *
 * ⚠️ LICENCE, STILL UNSETTLED, AND NOW IT SHIPS. Lordicon's free tier requires
 * attribution and its paid tiers do not; nothing in this repo records which plan
 * applies. It was a note on a parked experiment and is now a note on something
 * students see. Same shape as the Burbank question in PROJECT_MEMORY.
 */
/* `lord` is a file stem under public/reader/icons, named for what the mark
 * MEANS rather than for Lordicon's catalogue number, so swapping the artwork is
 * a file replacement touching no code.
 *
 * `state` picks one animation out of the several a Lottie holds, and ⚠️ A NAME
 * THAT DOES NOT MATCH FALLS BACK TO THE DEFAULT SILENTLY — a guess plays the
 * wrong thing with no error. These two were read off `node scripts/lord-states.mjs`,
 * never guessed. Both are `hover-` states: an `in-` state plays when an icon
 * APPEARS and so starts from an empty frame, which on a control already on
 * screen reads as the mark vanishing and rebuilding itself.
 *
 * ⚠️ `grasp-save` HAS NO STATE SET AND NO FILE YET. The owner picked the artwork
 * — Lordicon `book-bookmark`, doodle/color, catalogue doodle-color-112 — but
 * lordicon.com and cdn.lordicon.com are both blocked from the environment this
 * was wired in, so the Lottie could not be fetched. One command lands it:
 *     node scripts/fetch-lordicon.mjs book-bookmark doodle color grasp-save
 *     node scripts/lord-states.mjs        # then set `state` below if the
 *                                         # default it prints is an `in-` one
 * Until that file exists the fetch 404s and this answer simply keeps drawing its
 * Tabler bookmark, which is exactly what the fallback is for. */
const ANSWERS: {
  id: Grasp;
  label: string;
  icon: TablerIconName;
  lord: string;
  state?: string;
}[] = [
  /* ONE WORD EACH (owner, 2026-08-09: "buy only one word for each"). "Save for
     later" was the odd one out at three words and roughly twice the width of
     its neighbours, which made the middle answer look like the important one.
     The caption names the mark; the mark carries the meaning. */
  { id: "not", label: "Hate", icon: "mood-sad", lord: "grasp-not", state: "hover-pinch" },
  { id: "almost", label: "Save", icon: "bookmark", lord: "grasp-save" },
  { id: "got", label: "Love", icon: "mood-happy", lord: "grasp-got", state: "hover-smile" },
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

  /* One counter per answer, bumped by its own button. `LordIcon` replays from
     the first frame whenever its `playToken` changes, so this is what makes a
     mark animate — and, because only the pressed button's count moves, the ONLY
     mark that animates is the one under the reader's thumb. See the note over
     ANSWERS for why `active` cannot do this job. */
  const [plays, setPlays] = useState<Partial<Record<Grasp, number>>>({});

  /* NO TALLY BESIDE THE FACES (owner, 2026-08-09). A count lived here for one
   * day — built 2026-08-08 on the owner's own ask, behind two gates: hidden
   * until the reader had answered, and hidden until five people had. Both gates
   * were right and the thing they were protecting was still wrong.
   *
   * WHAT THE GATES COULD NOT FIX: a number beside a face turns "how did that
   * land for you" into "here is how it landed for everyone else". Revealing it
   * after the vote stops it anchoring the answer, but it does not stop the next
   * section's row being read as a scoreboard — and a reader who sees four
   * people were lost here arrives at the following section already braced.
   * The row is a private question and reads better without an audience.
   *
   * THE ANSWERS ARE STILL RECORDED. `recordReaction` below is untouched and
   * `section_reactions` keeps filling, because the valuable half was never the
   * tally — it is knowing WHICH SECTIONS LOSE PEOPLE, which is a question for
   * whoever is rewriting the step, not for the person reading it. If the tally
   * is ever wanted again the data is all there; the read side is in git (the
   * `useSectionCounts` hook and the GET on /api/reaction). */

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
      {/* TOP-ALIGNED, not centred, since 2026-08-09. The three answers carry a
          word under the mark and the note button does not, so the two clusters
          are different heights; centring them would float the note's flag
          halfway down beside the gap between the faces and their captions. The
          marks are what a reader lines up, so the marks are what is aligned. */}
      <div className="checkpoint-row flex flex-wrap items-start justify-between gap-3">
        <SectionNote lessonId={lessonId} sectionId={checkpointId} />
        <div
          className="grasp-group mark-cluster"
          role="radiogroup"
          /* The question a screen reader hears, and it had to change with the
             answers. "How much of X landed?" was the comprehension scale's
             question, and reading it out before three options that say Hate /
             Save / Love would offer a scale and then present a choice. */
          aria-label={`What did you make of "${heading}"?`}
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
                  /* Past the gate, so a tap that did nothing animates nothing.
                     Only this answer's count moves, so only this mark plays. */
                  setPlays((p) => ({ ...p, [a.id]: (p[a.id] ?? 0) + 1 }));
                  if (active) toggle(lessonId, checkpointId);
                  else rate(lessonId, checkpointId, a.id);
                  /* The server copy, written AFTER the device's. That order is
                     the contract: localStorage is what the reader sees and this
                     is what can be counted, so a failed write costs the tally
                     and never the answer. `null` on un-answer, or taking a
                     reaction back would leave a vote counted forever. */
                  recordReaction(lessonId, checkpointId, active ? null : a.id);
                }}
                role="radio"
                aria-checked={active}
                /* No aria-label and no title. The word is on screen now, so the
                   button's accessible name comes from its own text — which is
                   the better source anyway: a visible label and an aria-label
                   are two strings that can drift apart, and a screen-reader user
                   hearing something the sighted reader cannot see is a bug that
                   nothing on screen will ever reveal. The tooltip went for the
                   same reason it existed: it was there to recover a word that
                   had been hidden. */
                data-active={active ? "" : undefined}
                className="grasp-btn"
              >
                {/* The mark sits in its own box rather than in the button, so
                    the hover plate stays a 28px circle around the glyph instead
                    of growing into a tall rounded slab behind the caption. */}
                <span className="grasp-mark">
                  {/* 26 IN A 28px BOX, where the Tabler mark under it is 20.
                      A doodle Lottie is drawn on a 192×192 canvas with its own
                      margin baked in, so at 20 it would sit visibly smaller than
                      the static mark it replaces rather than the same size. The
                      fallback keeps 20 for the same reason, from the other side:
                      a bare outline has no margin of its own and needs the box's.

                      No `colorize`. The rest state is a CSS grayscale filter on
                      `.grasp-mark` — see the warning over ANSWERS for why
                      flattening a filled doodle to one colour erases its face.

                      `fallback` is what makes this safe on a slow connection:
                      the Tabler pair draws until the JSON lands, and stays if it
                      never does. It is also what covers `grasp-save`, whose file
                      is not in the repo yet.

                      No `autoplay`. A step has a checkpoint per section, so
                      opening one would otherwise set every mark on the page
                      animating at once. */}
                  <LordIcon
                    name={a.lord}
                    state={a.state}
                    size={26}
                    playToken={plays[a.id] ?? 0}
                    fallback={<TablerIcon name={a.icon} size={20} muted={!active} />}
                  />
                </span>
                {/* THE WORD, UNDER THE MARK (owner, 2026-08-09: "can I have text
                    below them saying what they are… a satoshi small text saying
                    what it is"). It is the first time these answers have been
                    readable without tapping one since 2026-08-02, when the words
                    came off and the marks were left to carry the meaning alone.
                    Five families in seven days is what that costs: every swap
                    was an attempt to find a drawing that says "save for later"
                    on its own, and no drawing does. Satoshi, because a word that
                    annotates rather than reads is a container — the owner's
                    2026-08-02 rule. See .grasp-caption. */}
                <span className="grasp-caption">{a.label}</span>
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
