import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { authEnabled } from "@/lib/auth";
import { openGraph, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { ToApp } from "@/components/landing/landing-bits";

/* ------------------------------------------------------------------ *
 * The front door. One screen, and nothing under it.
 *
 * THE DESIGN IS THE OWNER'S, drawn in Framer (project "Booklesss RESERVE",
 * page "/") and read off the canvas on 2026-08-06 — layout, type, colour,
 * shadows and timing are all measured from that file rather than interpreted.
 * If it needs to change, change it there first and re-read it; a value edited
 * only here goes stale the next time anyone looks at the source.
 *
 * WHAT THIS REPLACED, so the reasoning isn't lost: a scrolling page with a
 * headline, an inline sign-up card, a "Meet Booklesss" paragraph and three
 * feature sections each carrying a screenshot of the real app. The owner's
 * call (2026-08-06) was hero only — "a very simple landing page".
 *
 * ⚠️ THE OAUTH CONSTRAINT THIS BREAKS, ON PURPOSE. Google's OAuth branding
 * review rejected this app twice in August 2026 because the home page did not
 * name the product, describe what it does, or link the privacy policy without
 * JavaScript. The previous page existed in that shape to pass it, and Google
 * sign-in is currently OFF in production as the workaround. This page carries
 * the name and a one-line description in static HTML, but no privacy link and
 * no fuller explanation — so turning Google sign-in back on needs either a
 * footer here or a different verification URL. Raised with the owner before
 * this shipped; the decision was to ship it.
 *
 * STILL A SERVER COMPONENT. Nothing here needs the browser: the entrance is
 * CSS keyframes with per-element delays (see globals.css → "the front door's
 * entrance"), and the only client piece is ToApp, which renders nothing.
 * ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: { absolute: SITE_NAME },
  description:
    "Booklesss is a course reader: university study notes rewritten as short steps you read on your phone, with checkpoints that track your studying.",
  alternates: { canonical: "/" },
  openGraph: openGraph({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/" }),
};

/* The five faces above "Trusted by Students". Template stock photography that
 * came with the design, downscaled from the 3–6MP originals Framer was serving
 * to the 96px they are actually drawn at (3.5MB → 17KB for the set).
 *
 * They are photographs of nobody in particular, over a line claiming students
 * trust us. Flagged to the owner on 2026-08-06 and kept deliberately. The
 * honest version is public/avatars/ — the same 200 Kameleon discs students are
 * actually assigned — and swapping to it is this array plus a rounded <img>. */
const FACES = [1, 2, 3, 4, 5] as const;

/** The row is the five faces TWICE. The track slides one full set and starts
 *  over, and because the second set is the same images in the same order the
 *  last frame and the first are identical — so the loop has no seam. See
 *  `.faces-track` in globals.css for the stepped timing. */
const FACE_LOOP = [...FACES, ...FACES];

/** The headline, one span per word, because the design plays it in a word at a
 *  time. Splitting in the markup rather than at runtime is what keeps the page
 *  a server component — and it keeps the whole line in the HTML, so it is
 *  still one readable sentence to a crawler that runs no CSS. */
/**
 * The owner's pick, 2026-08-06, from a set rendered into the live hero.
 *
 * It aims at the thing a student is actually sick of, which is reading the same
 * page four times — not at speed, and not at us. No number to defend, no
 * product name (the wordmark two blocks up has just said it), and no "while
 * still", which was the hedge in the drafts either side of this one: `still`
 * concedes you would expect to understand less, so it argues with an objection
 * the reader has not raised.
 *
 * WHAT IT REPLACED: "Learn 2X faster with Booklesss", from the Framer file.
 * "2X" is a measurement nobody has taken — the kind of number a student
 * discounts on sight and we would have to defend if asked.
 *
 * NESTED BY LINE, AND THAT IS THE POINT. Left to wrap on its own this breaks
 * "Understand it the / first time", which strands the weak half of the sentence
 * on its own line and puts the stress on "the". Breaking after "it" balances
 * the two lines and lands the emphasis on "the first time", which is the claim.
 * A headline is four words long; letting the browser choose where it folds is
 * leaving the only typographic decision on the page to chance.
 */
const HEADLINE: string[][] = [
  ["Understand", "it"],
  ["the", "first", "time"],
];

/** Framer's word stagger: 50ms per token. */
const WORD_STEP = 0.05;

export default function LandingPage() {
  return (
    /* THE MARK RIDES THE TOP; THE TEXT IS BACK WHERE IT WAS.
       The logo moved up on the owner's call (2026-08-06: "move Booklesss and
       the actual logo to the top") and stays there. The pitch went down with it
       in the same pass and came straight back — "no, revert the positioning of
       the text": dropping it to 56px put the headline, the subtitle and the
       button in a block at the very bottom of the frame, which opens the middle
       but crowds the foot. Framer's 140px is the value that holds; only the top
       changed. The safe-area insets are added rather than assumed: on a notched
       phone in a PWA this is the top and bottom of the screen. */
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-end overflow-clip bg-black px-4 pt-[calc(1.75rem+env(safe-area-inset-top))] pb-[calc(140px+env(safe-area-inset-bottom))]">
      <ToApp />

      {/* ---- the backdrop ----
          Three layers, painted bottom to top: the photograph, a gradient that
          drowns its lower half in black so white type has somewhere solid to
          sit, and a noise tile over both.

          No z-index on either this or the content beside it. Both are
          positioned and both are z-index auto, so DOM order alone decides:
          this comes first and the content paints over it. Stacking here is one
          less thing to reason about than three competing layer numbers. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <Image
          src="/landing/hero/photo.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_42%,rgb(0,0,0)_100%)]" />
        {/* Tiled at its native 256px rather than stretched to cover. Framer
            scales the same PNG across the whole frame, which at this size
            turns 1px grain into 3px blotches; repeating it is what the texture
            is for and it holds up at any viewport. */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url(/landing/hero/noise.png)", backgroundSize: "256px" }}
        />
      </div>

      {/* ---- the content ----
          Top and bottom of the screen, pushed apart. The design is a 390px
          phone; the column is capped just above that and centred so a laptop
          gets the same composition on a full-bleed photo rather than a hero
          stretched sideways. "/" is exempt from the DesktopGate, so a desktop
          render is a real case, not a hypothetical. */}
      <div className="relative flex h-full w-full max-w-[430px] flex-1 flex-col items-center justify-between gap-8">
        {/* ---- the mark ---- */}
        <div className="flex flex-col items-center gap-2.5">
          {/* The B is 40px on a 50px disc that clips it, and the clipping is the
              design: the 10px-offset underline runs past the bottom of the
              circle, so what is left is a solid bar with its ends cut by the
              curve. Do not relax the overflow or it escapes as a full rule.

              LINE HEIGHT IS 50px, NOT THE DESIGN'S 1.4em, AND THAT IS A FIX
              RATHER THAN A DEVIATION. 1.4em is a 56px line box in a 50px disc;
              Framer centres it at -3px, but a grid or flex item TALLER than its
              container is aligned to the start edge instead of centred — the
              engine refusing to push content out of the top where it could not
              be scrolled back to. So `place-items-center` silently yields y=0,
              the glyph sits 3px low, and the bar falls off the bottom of the
              circle. Setting the line box to the disc's own height puts the
              baseline exactly where the design has it (half-leading 5px from
              50, vs Framer's 8px from 56 on a box starting 3px higher — the
              same 85px) and nothing overflows, so no alignment rule applies.
              Measured against a screenshot of the Framer page, not derived. */}
          {/* THE 1px BLACK RING is the owner's (2026-08-06), and it does nothing
              here on purpose: black on black against a dark photograph. It is
              for everywhere else this mark is about to go — "i actually want to
              experiment using that logo on the page as my actual logo exactly
              as it is, just add a 1px black border to the whole thing". On a
              white surface the ring is what gives the disc an edge instead of
              letting it read as a hole. Defining it here, where the mark is
              drawn, means the version that travels already has it. */}
          <div className="hero-in grid size-[50px] place-items-center overflow-clip rounded-full border border-black bg-black shadow-[var(--shadow-hero-disc)] [--rise-blur:0px] [--rise-dur:0.4s] [--rise:0px]">
            <span className="font-mark text-[40px] leading-[50px] text-white underline decoration-solid decoration-[5px] underline-offset-[10px]">
              B
            </span>
          </div>
          {/* No underline on the wordmark. Framer's canvas carries a stale
              text-decoration on this node that its own render ignores — checked
              against a screenshot of the page before dropping it. */}
          <p
            className="hero-in hero-shade font-mark text-[22px] leading-[1.2em] tracking-[-0.03em] text-white"
            style={{ animationDelay: "0.05s" }}
          >
            Booklesss
          </p>
        </div>

        {/* ---- the pitch ---- */}
        <div className="flex w-full flex-col items-center gap-8">
          {/* Five faces, 31px each, overlapping by 6px — and they keep arriving
              (owner, 2026-08-06: "id like the student profile pics to cycle
              round. cycle then stay then cycle. as more students come from the
              left more disappear on the right").

              The window is exactly five discs wide; the track inside it is ten,
              stepping one disc at a time and holding between steps. The hold is
              the point — a face that never stops moving is a ticker, and a
              ticker reads as decoration rather than as people showing up.
              Timing and the seamless wrap are in globals.css → .faces-track. */}
          <div className="flex flex-col items-center gap-2">
            {/* 240px shows five discs and the four gaps between them, ending
                flush with the fifth — the sixth begins at 250 and is clipped by
                the window, which is where an arriving face comes from. */}
            <div className="hero-in w-[240px] overflow-hidden" style={{ animationDelay: "0.2s" }}>
              <div className="faces-track flex w-max">
                {FACE_LOOP.map((n, i) => (
                  /* NO WHITE RING, AND REAL GAPS (owner, 2026-08-06: "remove
                     the white border, what i'd like is to see through the gaps
                     between them, and increase the gaps too"). The discs used
                     to overlap by 6px with a 1px white border drawing the
                     separation — a stack, in other words, which is the
                     convention for "and 400 more" rather than for five people.
                     Held apart with the photograph showing through, they read
                     as five separate students, and the gap does the job the
                     border was doing without putting a colour on the picture.
                     mr-[10px] on every disc INCLUDING the last: see the note on
                     .faces-track for why this cannot be a flex gap. */
                  <Image
                    key={i}
                    src={`/landing/hero/face-${n}.jpg`}
                    alt=""
                    width={40}
                    height={40}
                    className="face-pop mr-[10px] size-10 shrink-0 rounded-full object-cover"
                  />
                ))}
              </div>
            </div>
            <p
              className="hero-in hero-shade font-hero-meta text-[14px] leading-[1.3em] text-[#dedede]"
              style={{ "--rise": "20px", "--rise-blur": "10px", "--rise-dur": "0.7s", animationDelay: "0.25s" } as React.CSSProperties}
            >
              Trusted by Students
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            {/* NO mix-blend-mode, and the design file says otherwise on purpose.
                The Framer node carries `blendingMode: exclusion`, but Framer
                wraps this content in a z-indexed layer, which makes it its own
                stacking context — and an element only blends with what is
                painted beneath it INSIDE that context. The photograph is
                outside it, so Framer's own render draws this line solid white.
                Checked against a screenshot of the page rather than the canvas.

                Implementing the attribute faithfully therefore produces
                something the owner has never seen: over the skin tones in the
                middle of the photo, exclusion turns white into muddy blue-grey
                and the headline gets noticeably harder to read. The rendered
                design is the design. */}
            {/* BRICOLAGE, THE BUTTON'S FACE (owner, 2026-08-06: "use bricolage
                for the hero text"). It was Familjen Grotesk, which is the app's
                heading face and correct inside the app — on the front door it
                made the headline and the button look like they came from two
                different pages. One weight is registered, 800, so this is the
                same cut the button wears rather than a lighter instance of it;
                at 42px that is heavy on purpose. */}
            <h1 className="hero-shade text-center font-hero text-[42px] leading-[46px] font-extrabold tracking-[-0.03em] text-white sm:text-[48px] sm:leading-[52px]">
              {/* One block per line, words inside. The stagger counts across
                  the whole headline rather than restarting per line — the
                  reveal follows the sentence, not the layout — so the delay is
                  the running word index, not the index within its line. */}
              {HEADLINE.map((line, li) => (
                <span key={li} className="block">
                  {line.map((word, wi) => {
                    const n = HEADLINE.slice(0, li).reduce((t, l) => t + l.length, 0) + wi;
                    return (
                      <span
                        key={word}
                        className="hero-in hero-word"
                        style={{ animationDelay: `${n * WORD_STEP}s` }}
                      >
                        {word}
                        {wi < line.length - 1 ? " " : ""}
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>
            {/* THE ONLY SENTENCE ON THE PAGE THAT SAYS WHAT THIS IS, and the
                whole of what a crawler or an OAuth reviewer gets. Which is why
                it had to stop being untrue.

                It read: "Track your academic progress, analyze your
                performance, and get real-time coaching, all on your phone."
                Three claims from the Framer template, and the app does one of
                them. There is no coaching, real-time or otherwise, and
                "analyze your performance" oversells a score on a dashboard.
                Cosmetic on a mock-up; on a live front door it is the first
                thing a stranger reads and the line Google's branding check
                reads as the description of the product.

                What replaces it is the previous landing page's own subline —
                already written, already true, and the same sentence this
                page's `description` metadata carries, so the page says one
                thing to a person and to a crawler rather than two. */}
            {/* RUBIK (owner, 2026-08-06: "still use rubik for the subtitle
                text"). It was Aptos — the reading face, which belongs inside a
                step and nowhere near a hero. Rubik puts it in the same voice as
                "Trusted by Students" just above it, so the two quiet lines read
                as one register under the headline.

                DIMMED, THEN BROUGHT BACK UP. "Dim the subtitle text" took it to
                white/70 regular; "increase the opacity and weight" is the
                correction, and both are right — at 70% regular over a
                photograph the line was quiet to the point of being work to
                read. 90% at a real 500 keeps it clearly subordinate to the
                headline while staying a sentence rather than a texture.
                A transparent white rather than a grey: on a photograph a grey
                goes muddy where the picture is light, while white at an alpha
                holds the same relationship to whatever is behind it. */}
            <p
              className="hero-in hero-shade max-w-[90%] text-center font-hero-meta text-[16px] leading-[1.45] font-medium text-white/90"
              style={{ "--rise": "20px", "--rise-blur": "10px", "--rise-dur": "0.7s", animationDelay: "0.25s" } as React.CSSProperties}
            >
              Your whole course, rewritten as short steps you read on your phone.
            </p>
          </div>

          {/* ---- the one thing to do ----
              A black pill inside a lighter one: the outer gradient is the rim,
              the inner is the button. It arrives a full second after the rest,
              which is the design's timing and not an accident — the page
              finishes settling, then offers the tap.

              Framer points this at /category, a route on the marketing site
              that has no counterpart here. The app's answer is the sign-up
              flow; on a build with no auth keys /sign-up 404s, so it falls
              back to the dashboard rather than to a dead end. */}
          <div
            className="hero-in flex w-full flex-col items-center"
            style={
              {
                "--rise": "48px",
                "--rise-blur": "0px",
                "--rise-dur": "1s",
                "--rise-ease": "cubic-bezier(0.44, 0, 0.56, 1)",
                animationDelay: "1s",
              } as React.CSSProperties
            }
          >
            <Link
              href={authEnabled ? "/sign-up" : "/dashboard"}
              className="rounded-[33px] bg-[linear-gradient(120deg,rgb(255,255,255)_0%,rgba(255,255,255,0.75)_100%)] p-2 transition-transform duration-200 active:scale-[0.97]"
            >
              <span className="flex items-center justify-center rounded-full bg-black px-6 py-3 pr-5 shadow-[var(--shadow-hero-cta)]">
                <span className="font-hero text-[16px] leading-[1.7em] font-extrabold text-white select-none">
                  Get started now
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
