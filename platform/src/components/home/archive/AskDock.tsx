"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { AskMic } from "../ask-mic";
import { askFirstMessage, askOpener, askPrompt, type AskContext } from "@/lib/ask";
import { labelFor } from "@/lib/course";
import { enrolledCourses } from "@/lib/courses";
import { hapticTap } from "@/lib/haptics";
import { onboardingComplete, useIdentity } from "@/lib/identity";
import { daysStudiedIn, useProgress } from "@/lib/progress";
import type { AskControls, AskItem, AskPhase, NewAskItem } from "../ask-types";

/* ------------------------------------------------------------------ *
 * The box at the bottom of the home screen.
 *
 * Owner, 2026-08-22: "a big, rounded chat box at the bottom. When the user taps
 * it, they can either put in text or just hit the microphone icon so that they
 * can just start a voice chat … once someone taps that box, I see some
 * animation that pushes them through into the chat experience."
 *
 * ONE ELEMENT, TWO STATES — the button IS the panel. It does not open a second
 * screen: the same fixed shell grows from a circle in the corner to the whole
 * viewport, and the black disc is a layer inside it that fades as the panel
 * arrives.
 *
 * ⚠️ THE COMPOSER IS NOW MOUNTED ON OPEN, AND THAT USED TO BE A BUG. While the
 * collapsed state was a text box, the textarea had to be mounted the whole time
 * or iOS would not open the keyboard — a tap has to land focus on an element
 * that already exists, inside the student's own gesture, and mounting the input
 * as part of the opening put the focus call outside the gesture, which Safari
 * answers by doing nothing at all.
 *
 * That constraint died with the text box. The collapsed control is a
 * MICROPHONE: tapping it starts a call, and nothing wants the keyboard. The
 * student who then decides to type taps a textarea that is already on screen in
 * the open panel — a direct gesture on a mounted element, which is the case
 * that always worked. Put a text field back in the collapsed state and the old
 * rule comes back with it.
 *
 * ⚠️ THE HOME SCREEN HAS NO TEXT BOX. Owner, 2026-08-22, on the third version
 * of this: "okay that's too much — switch to just a microphone button bottom
 * left. no more text box", then, on seeing it: "put the icon bottom right and
 * size it smaller and comfortably". The collapsed state is ONE 52px circle in
 * the bottom RIGHT corner and nothing else. It went card → card-under-a-progressive-blur →
 * this, and the middle step is the instructive one: the box was too quiet, so
 * it got a blurred shelf to sit on, and the answer to "too quiet" turned out to
 * be less on the screen rather than more behind it. A button that is the only
 * object on a surface never has to compete for notice.
 *
 * The veil went with the box (git history has it, ~120 lines of stacked
 * backdrop-filter). It existed to make a wide card announce itself over
 * scrolling content; a black circle on cream announces itself unaided, and five
 * compositing layers on a phone were rent for a problem that no longer exists.
 *
 * TYPING SURVIVES, INSIDE THE PANEL. "No more text box" is about the home
 * screen — the composer is still the bottom of the opened panel, because a
 * typed turn is billed per message (~$0.003) where a call is billed per minute
 * (~$0.08), and the cheap transport is worth keeping reachable.
 *
 * NO GREEN, ANYWHERE (owner, same day: "that green, or whatever colour you keep
 * adding, does not match the actual UI that I already have"). The first version
 * borrowed the session call's dark-and-green surface. This app is cream, white
 * and ink, and every value here is one the app already had: `--color-card` on
 * `--color-line`, `--color-btn` for the one action that matters, `--color-active`
 * for the quiet circle beside it, `--color-placeholder` for the prompt.
 *
 * ⚠️ THE HAIRLINE IS ON THE SHELL, NOT ON A LAYER INSIDE IT. It used to be an
 * `inset 0 0 0 1px` shadow on a separate background element with no radius of
 * its own, clipped by the shell's `overflow: hidden` — so the ring was square,
 * the clip was round, and the border VANISHED at the four corners ("there's a
 * difference in radius between the white container and the border"). A real
 * `border` on the element that owns the `border-radius` cannot disagree with
 * itself. Any future edge treatment goes on the shell for the same reason.
 *
 * NOTHING CONNECTS UNTIL THERE IS SOMETHING TO SAY. Opening the panel costs no
 * network: the ElevenLabs engine is a dynamic import, mounted on the first sent
 * message or the first tap of the mic. The SDK carries a WebRTC stack with no
 * business in the dashboard bundle on Zambian mobile data, and a conversation
 * that opens because somebody glanced at the box is one the account is billed
 * for.
 * ------------------------------------------------------------------ */

/* Loaded on first use, never on the dashboard's first paint. `ssr: false`
 * because it touches getUserMedia and opens a socket the moment it mounts. */
const AskEngine = dynamic(() => import("../ask-engine").then((m) => m.AskEngine), {
  ssr: false,
});

/** The button's diameter, and the one number the collapsed geometry needs.
 *
 *  52, down from 62 (owner, 2026-08-22: "size it smaller and comfortably").
 *  Comfortably is the operative half — 44px is the smallest target a thumb hits
 *  reliably, so this keeps 8px of margin over the floor rather than shrinking
 *  until it looks tidy. The glyph came down with it, 26 to 22, which holds the
 *  same 42% of the disc; scaling the circle alone would have left the mark
 *  crowding its own edge. */
const FAB = 52;

export function AskDock() {
  const { identity, hydrated: idHydrated } = useIdentity();
  const { hydrated, days, last } = useProgress();

  const [open, setOpen] = useState(false);
  /* Which transport the engine should use. Only read when `engaged` flips on;
   * changing it mid-conversation is what the mic button does, and that tears
   * the old one down first (see startVoice). */
  const [mode, setMode] = useState<"voice" | "text">("text");
  /* Whether a conversation exists at all. Separate from `open`, because the
   * panel can be open with nothing connected — that is the empty state. */
  const [engaged, setEngaged] = useState(false);
  const [phase, setPhase] = useState<AskPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [draft, setDraft] = useState("");
  const [items, setItems] = useState<AskItem[]>([]);
  /* Handed to the engine on mount and sent the moment it connects, so a typed
   * question never waits on a round trip the student can see. */
  const [pending, setPending] = useState<string | null>(null);

  const controls = useRef<AskControls | null>(null);
  const field = useRef<HTMLTextAreaElement | null>(null);
  const nextId = useRef(1);

  /* ---- who the agent is talking to ------------------------------- */

  /* The CHOSEN name only. `identity.name` is never empty — it is the assigned
   * avatar's name until somebody types their own — so reading it without
   * `nameChosen` is how a student ends up being called "Astronaut", which is
   * the exact bug the dashboard greeting had (see HomeView). */
  const ctx: AskContext = useMemo(
    () => ({
      name: identity?.nameChosen ? identity.name.trim().split(/\s+/)[0] : undefined,
      courses: identity?.courses ?? [],
      last: hydrated && last ? labelFor(last.id) : null,
      studyDays: hydrated ? daysStudiedIn(days, 7) : undefined,
    }),
    /* `identity`, not the four fields off it. The React Compiler infers the
       whole object and refuses to optimise a component whose manual deps are
       NARROWER than its inference — the value could then change less often
       than it should. The object is replaced wholesale on every write to the
       identity store anyway, and those are rare (onboarding, settings), so the
       narrower list bought nothing. */
    [identity, hydrated, last, days],
  );

  /* Built per conversation rather than per render: the prompt is a few
   * kilobytes of concatenation over the whole course nav, and this component
   * re-renders on every keystroke in the box. */
  const brief = useMemo(
    () => ({
      prompt: askPrompt(ctx, mode),
      /* A typed conversation opens silently. The student has already written
         the first thing, and a greeting arriving above their own question reads
         as the agent talking over them. */
      firstMessage: mode === "voice" ? askFirstMessage(ctx) : "",
    }),
    [ctx, mode],
  );

  const mine = useMemo(() => enrolledCourses(identity?.courses), [identity]);

  const opener = useMemo(
    () => askOpener((identity?.since ?? "").length + (identity?.courses?.length ?? 0)),
    [identity],
  );

  /* Three things worth asking, built from what this student is actually taking,
   * so an empty panel is a starting point rather than a blank page. */
  const suggestions = useMemo(() => {
    const out: string[] = ["What should I go over today?"];
    /* The SECOND unit where there is one. The first is very often a preamble —
       economics opens on "Getting started" — and "Explain getting started
       simply" is a chip that makes the feature look like it cannot read. */
    const units = mine[0]?.displayUnitIds ?? [];
    const unit = units[1] ?? units[0];
    if (unit) out.push("Explain " + labelFor(unit).toLowerCase() + " simply");
    if (mine[0]) out.push("Ask me questions on " + mine[0].title.toLowerCase());
    while (out.length < 3) out.push("Give me an example with kwacha in it");
    return out.slice(0, 3);
  }, [mine]);

  /* ---- opening and closing --------------------------------------- */

  const push = useCallback((item: NewAskItem) => {
    setItems((prev) => [...prev, { ...item, id: nextId.current++ } as AskItem]);
  }, []);

  const openPanel = useCallback(() => {
    setOpen((was) => {
      if (!was) hapticTap();
      return true;
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    /* Hang up, but keep what was said. Closing the panel mid-call is leaving
       the CALL, not the thread — reopening shows the exchange again, and starts
       nothing. */
    controls.current?.hangUp();
    controls.current = null;
    setEngaged(false);
    setPhase("idle");
    setPending(null);
    field.current?.blur();
  }, []);

  /* Escape closes, and so does the phone's back gesture. The pushed entry
     carries Next's own history state forward rather than replacing it — the App
     Router reads its routing tree off history.state, and pushing a bare object
     is how a back press turns into a blank page. */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPop = () => setOpen(false);

    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    try {
      window.history.pushState({ ...window.history.state, __ask: true }, "");
    } catch {
      /* Some embedded browsers refuse pushState. Escape and the close button
         still work; only the back gesture is lost. */
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      /* Pop only the entry we pushed. Closing VIA the back gesture has already
         consumed it, and calling back() again would leave the page. */
      try {
        if ((window.history.state as { __ask?: boolean } | null)?.__ask) window.history.back();
      } catch {
        /* as above */
      }
    };
  }, [open, close]);

  /* The page behind must not scroll under the panel — and BOTH of these have to
     be held, because which one actually scrolls depends on the width. On a
     desktop the inner `#content-surface` panel is the scroller; on a phone it
     is the document itself (measured, not assumed: a probe that scrolled only
     `#content-surface` moved nothing at 390px wide, and would have reported a
     pass for a panel you could still scroll the page behind). */
  useEffect(() => {
    if (!open) return;
    const held: [HTMLElement, string][] = [];
    for (const el of [document.getElementById("content-surface"), document.documentElement]) {
      if (!el) continue;
      held.push([el, el.style.overflow]);
      el.style.overflow = "hidden";
    }
    return () => {
      for (const [el, prev] of held) el.style.overflow = prev;
    };
  }, [open]);

  /* ---- starting and stopping a conversation ---------------------- */

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setError(null);
    push({ role: "you", text });

    if (engaged && controls.current) {
      /* Typing into a live VOICE call is deliberately allowed — the SDK sends
         it as a user turn and the agent answers out loud. A student on a bus
         with no headphones can still ask something. */
      controls.current.send(text);
      return;
    }
    setMode("text");
    setPending(text);
    setEngaged(true);
    openPanel();
  }, [draft, engaged, push, openPanel]);

  const startVoice = useCallback(() => {
    hapticTap();
    setError(null);
    if (engaged) {
      /* A typed conversation cannot BECOME a call — they are different
         transports (a signed WebSocket versus a WebRTC token; see
         /api/agent/token). So this ends the old one and opens a call. */
      controls.current?.hangUp();
      controls.current = null;
    }
    setMuted(false);
    setMode("voice");
    setPending(null);
    setEngaged(true);
    openPanel();
  }, [engaged, openPanel]);

  const hangUp = useCallback(() => {
    hapticTap();
    controls.current?.hangUp();
    controls.current = null;
    setEngaged(false);
    setPhase("idle");
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      controls.current?.setMuted(next);
      return next;
    });
  }, []);

  /* ---- the two circles ------------------------------------------- */

  const inCall = engaged && mode === "voice" && (phase === "live" || phase === "connecting");
  const typed = draft.trim().length > 0;

  /* Auto-grow, capped. One cap, not two: the field is mounted only inside the
     open panel now, so there is no collapsed height to grow from. */
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 132) + "px";
  }, [draft, open]);

  /* Never on a record that has not finished onboarding. This used to be the
     page's <RequireOnboarding> doing it; the dock lives in the layout now (see
     the note there), so it carries its own gate rather than relying on where it
     happens to be mounted. Renders nothing until the device has been read, so
     it cannot flash up and disappear. */
  if (!idHydrated || !onboardingComplete(identity)) return null;

  return (
    <div className="ask-layer" data-open={open}>
      <div className="ask-scrim" onClick={close} aria-hidden />

      <div
        className="ask-shell"
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        aria-label={open ? "Ask Booklesss" : undefined}
      >
        {/* THE BUTTON. A layer inside the shell rather than the shell itself,
            so the disc can fade while the shape keeps morphing — the shell's
            own background is white throughout and never animates between two
            colours, which black-to-white across 800px of screen does badly.
            Hidden from the tree and from tab order once open: it is still in
            the DOM under the panel, and a focusable control behind a dialog is
            a keyboard trap. */}
        <button
          type="button"
          onClick={startVoice}
          className="ask-fab"
          aria-label="Start a voice chat"
          tabIndex={open ? -1 : 0}
          aria-hidden={open || undefined}
        >
          <AskMic size={22} />
        </button>

        {/* ---- the panel above the composer ---- */}
        <div className="ask-body">
          {open ? (
            <>
              <div className="ask-topbar">
                <span className="ask-title">Ask</span>
                <button type="button" onClick={close} className="ask-quiet-btn" aria-label="Close">
                  <HugeIcon name="x" size={17} />
                </button>
              </div>

              {engaged ? (
                <AskEngine
                  mode={mode}
                  prompt={brief.prompt}
                  firstMessage={brief.firstMessage}
                  initialMessage={pending}
                  items={items}
                  muted={muted}
                  onItem={push}
                  onPhase={setPhase}
                  onError={setError}
                  onReady={(c) => {
                    controls.current = c;
                  }}
                />
              ) : (
                <div className="ask-empty">
                  <p className="ask-empty-line">Ask anything, or talk it through.</p>
                  <div className="ask-chips">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="ask-chip"
                        onClick={() => {
                          setDraft(s);
                          field.current?.focus();
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error ? <p className="ask-error">{error}</p> : null}
            </>
          ) : null}
        </div>

        {/* ---- the composer, and only once the panel is open ----
            Two rows: the question on its own line at reading size, the controls
            under it. See the header note on why mounting this with the panel is
            safe now and was not before. */}
        {open ? (
        <div className="ask-composer">
          <textarea
            ref={field}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={opener}
            enterKeyHint="send"
            aria-label="Ask a question"
            className="ask-field"
          />

          <div className="ask-controls">
            {/* Mute, and ONLY during a call. There is nothing for a second
                circle to do the rest of the time, and a control that is present
                but inert is worse than one that arrives when it applies. */}
            {inCall ? (
              <button
                type="button"
                onClick={toggleMute}
                className="ask-quiet-btn ask-circle"
                aria-label={muted ? "Unmute" : "Mute"}
                aria-pressed={muted}
              >
                <HugeIcon name={muted ? "microphone-off" : "microphone"} size={19} />
              </button>
            ) : null}

            {/* ONE BLACK CIRCLE, ALWAYS LIVE, and its glyph says what it does:
                the microphone with nothing typed, the arrow once there is
                something to send, the handset during a call.

                It briefly had a permanent second circle beside it with the
                black one DISABLED until you typed — which meant the first thing
                anybody saw on the home screen was a greyed-out primary button
                sitting next to a grey secondary, two dead-looking circles and
                no invitation. The owner's reference has one black button you
                press; this is that, and the mic being the resting state is also
                his own framing of the feature ("just hit the microphone icon so
                that they can just start a voice chat"). */}
            <button
              type="button"
              onClick={typed ? send : inCall ? hangUp : startVoice}
              className="ask-primary-btn ask-circle"
              aria-label={typed ? "Send" : inCall ? "End the call" : "Start a voice chat"}
            >
              <HugeIcon
                name={typed ? "arrow-up" : inCall ? "telephone-off" : "microphone"}
                size={19}
              />
            </button>
          </div>
        </div>
        ) : null}
      </div>

      <style>{`
        /* --------------------------------------------------------------
           Colocated, like the orb's. globals.css is a file two sessions have
           collided on before, and none of this is reused anywhere else. Every
           colour is a token the app already defines — nothing new enters the
           palette to draw this.
           -------------------------------------------------------------- */
        .ask-layer {
          position: fixed;
          inset: 0;
          z-index: 60;                     /* over the 48px header, which is z-50 */
          pointer-events: none;
          --ask-gap: calc(14px + env(safe-area-inset-bottom, 0px));
          --ask-edge: max(14px, env(safe-area-inset-left, 0px));
          --ask-fab: ${FAB}px;
          --ask-morph: 480ms;
          --ask-ease: cubic-bezier(0.32, 0.72, 0, 1);
        }

        .ask-scrim {
          position: absolute;
          inset: 0;
          opacity: 0;
          /* The app's own ink, not a neutral black — and light enough that the
             dashboard stays legible behind the panel rather than going dark. */
          background-color: rgba(23, 23, 23, 0.28);
          transition: opacity 420ms ease;
          pointer-events: none;
        }
        .ask-layer[data-open="true"] .ask-scrim { opacity: 1; pointer-events: auto; }

        /* THE MORPH. Four insets and a radius; nothing else moves.

           Collapsed, the shell is a 52px square pinned to the BOTTOM RIGHT —
           the LEFT inset is the one measured from the far edge, which is what
           lets a single transition drive both the position and the size. Swap
           the corner by swapping which of the two carries the calc, never by
           adding a transform: this element's whole animation is its insets, and
           a transform on top would fight the morph. Open, it is the viewport.

           The squircle utility came off this element with the text box. It is
           corner-shape: superellipse(2.4), which is right for a card and wrong
           for a button: at a 999px radius it draws a rounded square where a
           circle is wanted, and the shell CLIPS the disc inside it, so the
           squircle would have won.

           (Note the plain prose above. This is inside a JS template literal and
           a backtick in a COMMENT ends the string just as well as one in a
           declaration — the parse error then lands pages later, at the opening
           style tag. The file header has said so since August; it still caught
           the edit that wrote this block.)

           The border and the radius are on THIS element, together. See the
           header note — a ring drawn on an inner layer with no radius of its
           own gets clipped away at the corners, which is what "the border
           disappears at the corners" was. */
        .ask-shell {
          position: absolute;
          left: calc(100% - var(--ask-edge) - var(--ask-fab));
          right: var(--ask-edge);
          top: calc(100% - var(--ask-fab) - var(--ask-gap));
          bottom: var(--ask-gap);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          /* --color-line-2, a step darker than the app's usual hairline. The
             box floats over a blurred shelf now rather than sitting in the
             page, and at #dfdfdf its top edge dissolved into the wash. */
          border: 1px solid transparent;
          border-radius: 999px;
          /* White, and white while collapsed too — the black disc on top is
             what you actually see at 52px. Holding one value here is what stops
             the morph crossfading black to white through 480ms of grey.
             (No backticks anywhere in this block: it is inside a template
             literal, so one would end the string and the parse error lands
             pages away from the comment that caused it.) */
          background-color: #ffffff;
          pointer-events: auto;
          /* Sized for a 52px button, not for the wide card this used to be: a
             tight contact shadow so the disc sits ON the page, and one soft
             throw so it sits ABOVE it. The card's version needed a third, wider
             stop to separate it from the blur behind it; there is no blur now
             and a small circle wearing a 50px shadow looks like it is falling.
             The throw came in 2px with the diameter — a shadow held at its old
             size while the object shrinks reads as the object floating higher,
             not as the same button made smaller. */
          box-shadow:
            0 2px 4px -1px rgb(0 0 0 / 0.16),
            0 8px 18px -8px rgb(0 0 0 / 0.26);
          transition:
            top var(--ask-morph) var(--ask-ease),
            bottom var(--ask-morph) var(--ask-ease),
            left var(--ask-morph) var(--ask-ease),
            right var(--ask-morph) var(--ask-ease),
            border-radius var(--ask-morph) var(--ask-ease),
            border-color 300ms ease,
            box-shadow 420ms ease;
        }
        .ask-layer[data-open="true"] .ask-shell {
          left: 0; right: 0; top: 0; bottom: 0;
          border-radius: 0;
          box-shadow: none;
        }

        /* THE DISC. Fills the shell, so collapsed it IS the button and open it
           is a black square being cropped away behind the panel — hence the
           opacity, which is gone well before the shape stops moving. */
        .ask-fab {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          border-radius: inherit;
          background-color: var(--color-btn);
          color: #ffffff;
          transition:
            opacity 200ms ease,
            background-color 160ms ease,
            transform 140ms ease;
        }
        .ask-fab:active { transform: scale(0.94); }
        .ask-fab:hover { background-color: #000000; }
        .ask-layer[data-open="true"] .ask-fab {
          opacity: 0;
          pointer-events: none;
          transition: opacity 140ms ease;
        }
        /* On a wide screen the panel is a centred card, not a takeover — the
           same morph, stopped short of the edges. */
        @media (min-width: 768px) {
          .ask-layer[data-open="true"] .ask-shell {
            left: max(24px, calc(50% - 340px));
            right: max(24px, calc(50% - 340px));
            top: 5vh;
            bottom: 5vh;
            border-radius: 26px;
            border-color: var(--color-line);
            box-shadow: 0 24px 70px -30px rgb(0 0 0 / 0.35);
          }
        }

        /* The panel.

           ⚠️ pointer-events: none WHILE COLLAPSED, AND THAT IS NOT A DETAIL.
           This element is flex: 1 1 auto, so with the composer no longer
           rendered in the collapsed state it now fills the ENTIRE 52px shell
           and paints after the disc — and opacity: 0 does not stop an element
           receiving a tap. An invisible empty div swallowed every press on the
           button, which presents as a mic that simply does nothing rather than
           as anything you would think to look for in CSS.

           It used to be squeezed to nothing by the composer sitting under it,
           which is why this was never needed before. Re-mount anything in the
           collapsed state and check this again. */
        .ask-body {
          position: relative;
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transition: opacity 260ms ease 140ms;
          contain: layout paint;
        }
        .ask-layer[data-open="true"] .ask-body { opacity: 1; pointer-events: auto; }

        .ask-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 12px 4px 20px;
          flex: 0 0 auto;
        }
        .ask-title {
          font-family: var(--font-container);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-muted);
        }

        /* The quiet circle: the app's selected-row grey, ink glyph. Same value
           the sidebar marks a current row with. */
        .ask-quiet-btn {
          display: grid;
          place-items: center;
          border-radius: 999px;
          background-color: var(--color-active);
          color: var(--color-ink);
          flex: 0 0 auto;
          transition: background-color 160ms ease;
        }
        .ask-quiet-btn:hover { background-color: var(--color-line-2); }

        /* The one action that matters: the app's solid black. */
        .ask-primary-btn {
          display: grid;
          place-items: center;
          border-radius: 999px;
          background-color: var(--color-btn);
          color: #ffffff;
          flex: 0 0 auto;
          transition: background-color 160ms ease, opacity 200ms ease, transform 140ms ease;
        }
        .ask-primary-btn:hover:not(:disabled) { background-color: #000000; }
        .ask-primary-btn:active:not(:disabled) { transform: scale(0.94); }
        .ask-primary-btn:disabled { opacity: 0.28; }

        .ask-circle { height: 42px; width: 42px; }
        .ask-topbar .ask-quiet-btn { height: 32px; width: 32px; }

        .ask-empty {
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 10px;
          padding: 0 18px 14px;
        }
        .ask-empty-line {
          font-family: var(--font-container);
          font-weight: 500;
          font-size: 15px;
          color: var(--color-muted);
        }
        .ask-chips { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
        .ask-chip {
          font-family: var(--font-container);
          font-weight: 500;
          font-size: 13px;
          color: var(--color-ink);
          background-color: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--color-line);
          border-radius: 999px;
          padding: 8px 14px;
          text-align: left;
          box-shadow: var(--shadow-chip);
          transition: background-color 160ms ease;
        }
        .ask-chip:hover { background-color: #ffffff; }

        .ask-error {
          font-family: var(--font-container);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-ink);
          background-color: var(--color-active);
          border-radius: 14px;
          margin: 0 18px 10px;
          padding: 10px 14px;
          flex: 0 0 auto;
        }

        /* THE COMPOSER — one element, both states, two rows. */
        .ask-composer {
          position: relative;
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px 14px calc(14px + env(safe-area-inset-bottom, 0px)) 20px;
        }

        .ask-field {
          width: 100%;
          resize: none;
          border: 0;
          outline: none;
          background: transparent;
          font-family: var(--font-container);
          font-weight: 500;
          /* 17px, up from 15. The owner's note was "way too small", and the
             placeholder is the only invitation this control has. */
          font-size: 17px;
          line-height: 26px;
          padding: 0;
          max-height: 132px;
          color: var(--color-ink);
        }
        .ask-field::placeholder { color: var(--color-placeholder); }

        .ask-controls {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
        }

        /* Reduced motion: the same two states, they simply arrive. Honours the
           app's own switch as well as the OS one — see lib/motion. */
        @media (prefers-reduced-motion: reduce) {
          .ask-shell,
          .ask-body,
          .ask-scrim,
          .ask-fab { transition: none !important; }
        }
        html[data-motion="reduced"] .ask-shell,
        html[data-motion="reduced"] .ask-body,
        html[data-motion="reduced"] .ask-scrim,
        html[data-motion="reduced"] .ask-fab { transition: none !important; }
      `}</style>
    </div>
  );
}
