"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { labelFor, nextLessonId, pathForId } from "@/lib/course";
import { rate, useProgress, type Grasp } from "@/lib/progress";
import { LordIcon } from "@/components/icons/lordicon";
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
 * The marks went through four pairs on 2026-08-02, all owner-led. The row lost
 * its labels, so a clipboard carrying the word "Later" became a bare clipboard
 * saying nothing; that gave a bookmark and a ticked circle; then a Solar
 * Duotone thumbs pair; and now a smiling face and a sad one, MynaUI's own,
 * picked off a search of the set.
 *
 * A face is the right answer to the question this control actually asks. The
 * bookmark and tick described what happens next, which is a step removed from
 * "how did that land", and the thumbs read as a verdict on the writing rather
 * than on the reader's grasp of it. A face is neither: it is how you feel
 * about the section you just read, needs no word, and is understood by anyone.
 *
 * Round rather than the square or ghost variants of the same pair, because at
 * 20px on a phone the square's corners and the ghost's tail are noise.
 *
 * Back on MynaUI, so the line/solid swap on `active` returns: the answer given
 * fills in, which is a second signal beside the colour and the one the rest of
 * the app's chrome already uses for "this is the current one".
 *
 * ORDER: "Later" then "Got it", so the smiling face is the outermost mark on
 * the right (owner, 2026-08-02). It reads worst-to-best towards the edge, and
 * it puts the answer most readers are reaching for under the thumb that is
 * already there.
 *
 * DOODLES, not glyphs, as of 2026-08-07 — owner, with two files dropped in the
 * bucket: "trying to see if I can replace my old smile and sad face one for
 * something more interesting". Fifth pair on this control. They are FILES in
 * public/reader, never inlined: 110KB of artwork each, which is the trap
 * card-glyphs.tsx and the avatars both walked into and only the avatars have
 * climbed out of.
 *
 * Each answer is TWO files and that is the whole design:
 *   .png  the last frame, drawn at rest. A still cannot animate, so five
 *         sections on screen do not set ten faces going on first paint.
 *   .gif  a one-shot reveal, swapped in only once the answer is given, so the
 *         animation is the reward for the tap rather than wallpaper.
 * At rest the still is the colourless version of the face, which keeps the row
 * calm and means colour arriving IS the answer landing.
 *
 * "Later" is a shock face rather than a sad one, because that is the pair the
 * owner picked. It reads as "wait, no" rather than "I am unhappy", which is
 * closer to what the button actually records.
 *
 * `tone` still drives the hover and the focus ring. It no longer tints a mark:
 * the artwork carries its own colour.
 *
 * `state` is the named animation inside the Lottie, and these two came off
 * Lordicon's own code panel rather than off the files, which do not exist here
 * yet. **Confirm them with `node scripts/lord-states.mjs` the moment they do**
 * — a state name that does not match falls back to the default silently, so a
 * wrong one plays the wrong animation and says nothing. It degrades gently
 * (these icons make their hover state the default) but "gently" is not
 * "correctly". */
const ANSWERS: { id: Grasp; label: string; art: string; state: string; tone: string }[] = [
  { id: "not", label: "Later", art: "grasp-not", state: "hover-pinch", tone: "#96601f" },
  { id: "got", label: "Got it", art: "grasp-got", state: "hover-smile", tone: "#17754d" },
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

          A PILL, FILLED GREY, NO BORDER — which is the reference, and it
          corrects the word that came before it. "White and rounded" was the
          first instruction and it does not survive contact with this page: the
          reading sits on white already, so a white fill has to be drawn with a
          border to exist at all, and a bordered white box is the callout's own
          surface language. That made a control read as one more container to
          READ. Filled grey with no border is the opposite and is what every
          comment bar on a phone looks like: the page is what you read, the grey
          is what you press.
          `rounded-full`, not the `rounded-3xl` a callout takes. At this height
          a pill is unmistakably a control, and it is the one shape in the
          reader that never appears around prose. */}
      <div className="checkpoint-row flex flex-wrap items-center justify-between gap-3 rounded-full bg-[#f2f2f1] px-4 py-2">
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
                {/* Colour arriving IS the answer landing — the same thing the
                    line/solid glyph swap used to say, made the only way it can
                    be made on artwork, which takes no `color`.
                    `-rest.png` is the last frame with every pixel above a
                    luminance threshold flattened to #ededf0 and everything
                    below it to the ink: the drawing at full strength, the fill
                    gone. A CSS filter cannot do that — grayscale and opacity
                    hit the black line work exactly as hard as the orange, so
                    the face does not lose its colour, it fades towards the
                    page ("the other icon is way too dim", owner, 2026-08-07).

                    TWO STILLS STACKED AND CROSS-FADED, and no animation at all
                    for now. Both of those are the same bug, reported the same
                    day: "when you tap, they disappear and do a reveal after a
                    weird length of time."
                    · The GAP was mine. Swapping `src` on a re-keyed element
                      unmounts the image and mounts a new one, which then has to
                      fetch and decode 110KB before it can paint anything.
                      Stacked, both files are loaded at mount and the tap is a
                      pure opacity change with nothing to wait for.
                    · The REVEAL was the wrong animation. Those GIFs were
                      exported from Lordicon's `in-reveal` state, which plays
                      when an icon APPEARS and so begins from an empty frame by
                      design — owner: "the mistake i made was having the icons
                      in-reveal instead of on hover or on taps". A GIF bakes
                      that choice into pixels.
                    So the animation comes back with the Lottie, not before, and
                    it comes back correct: one file holds every state, `state`
                    picks the hover one, `colors` does what these three files do.
                    `scripts/lord-states.mjs` prints what a given file actually
                    carries, so the state name is read rather than guessed. */}
                <span
                  className="relative block"
                  style={{ width: 26, height: 26 }}
                  aria-hidden="true"
                >
                  {/* THE REST STATE STAYS A STILL, and only the chosen one is
                      the Lottie. Colouring a Lottie grey would mean `colorize`,
                      which flattens EVERY colour to one — including the black
                      line work, so the face would become a grey blob, which is
                      the thing that was rejected two goes ago. `colors` can set
                      the fill alone but reloads the animation, and reloading on
                      tap is the flicker this control has already had. The
                      still is right and costs nothing. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/reader/${a.art}-rest.png`}
                    alt=""
                    width={26}
                    height={26}
                    draggable={false}
                    className="absolute inset-0"
                    style={{ opacity: active ? 0 : 1, transition: "opacity 140ms ease" }}
                  />
                  <span
                    className="absolute inset-0"
                    style={{ opacity: active ? 1 : 0, transition: "opacity 140ms ease" }}
                  >
                    {/* `playToken` flips with `active`, and LordIcon replays
                        from the first frame whenever it changes — so the
                        animation happens because the answer was given.
                        `fallback` is the coloured still, drawn while the icon
                        data loads AND left in place permanently if the file is
                        not there. That is what makes the Lottie a DROP-IN: with
                        no .json in public/reader/icons this is exactly the
                        still-plus-CSS-pop that ships today, and the moment the
                        two files land the real animation takes over with no
                        code change. */}
                    <LordIcon
                      name={a.art}
                      state={a.state}
                      size={26}
                      playToken={active}
                      fallback={
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={`/reader/${a.art}.png`}
                          alt=""
                          width={26}
                          height={26}
                          draggable={false}
                          className={active ? "grasp-pop" : undefined}
                        />
                      }
                    />
                  </span>
                </span>
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
