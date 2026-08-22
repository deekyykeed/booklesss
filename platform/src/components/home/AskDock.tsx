"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MynaIcon } from "@/components/icons/myna";
import { askFirstMessage, askOpener, askPrompt, type AskContext } from "@/lib/ask";
import { labelFor } from "@/lib/course";
import { enrolledCourses } from "@/lib/courses";
import { hapticTap } from "@/lib/haptics";
import { onboardingComplete, useIdentity } from "@/lib/identity";
import { daysStudiedIn, useProgress } from "@/lib/progress";
import type { AskControls, AskItem, AskPhase, NewAskItem } from "./ask-types";

/* ------------------------------------------------------------------ *
 * The box at the bottom of the home screen.
 *
 * Owner, 2026-08-22: "a big, rounded chat box at the bottom. When the user taps
 * it, they can either put in text or just hit the microphone icon so that they
 * can just start a voice chat … once someone taps that box, I see some
 * animation that pushes them through into the chat experience."
 *
 * ONE ELEMENT, TWO STATES — the box IS the panel. It does not open a second
 * screen and it does not fade one thing out to fade another in: the same fixed
 * shell grows from a card at the bottom of the page to the whole viewport, and
 * the composer that sat inside the card is the same composer at the bottom of
 * the open panel. Nothing is remounted on the way, which is not only a nicer
 * animation — it is the only version that keeps the KEYBOARD. A student taps
 * the text, a real <textarea> takes focus inside their own tap, iOS opens the
 * keyboard, and the panel expands behind it. Mount the input as part of the
 * opening instead and the focus call lands outside the gesture, which Safari
 * answers by doing nothing at all.
 *
 * TWO ROWS, NOT ONE (owner, 2026-08-22, with a reference: "set up the text box
 * to look like this"). The first version was a 58px pill with the placeholder
 * and the button on one line — "way too small". The card is ~112px now: the
 * question gets a line of its own at reading size, and the controls sit under
 * it. That shape is also what makes the morph read, because the collapsed state
 * is already a card rather than a bar.
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
const AskEngine = dynamic(() => import("./ask-engine").then((m) => m.AskEngine), {
  ssr: false,
});

/** The card's height, and the one number the collapsed geometry needs. */
const DOCK_H = 112;

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

  /* Auto-grow, capped. The card already gives the text a line of its own, so
     this only matters once a question runs past one. */
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, open ? 132 : 52) + "px";
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
        className="ask-shell squircle"
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        aria-label={open ? "Ask Booklesss" : undefined}
      >
        {/* ---- the panel above the composer ---- */}
        <div className="ask-body">
          {open ? (
            <>
              <div className="ask-topbar">
                <span className="ask-title">Ask</span>
                <button type="button" onClick={close} className="ask-quiet-btn" aria-label="Close">
                  <MynaIcon name="x" size={17} />
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

        {/* ---- the composer: the same element in both states ----
            Two rows, per the owner's reference: the question on its own line at
            reading size, the controls under it. */}
        <div className="ask-composer">
          <textarea
            ref={field}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={openPanel}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={open ? "Type your question" : opener}
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
                <MynaIcon name={muted ? "microphone-off" : "microphone"} size={19} />
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
              <MynaIcon
                name={typed ? "arrow-up" : inCall ? "telephone-off" : "microphone"}
                size={19}
              />
            </button>
          </div>
        </div>
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

           The border and the radius are on THIS element, together. See the
           header note — a ring drawn on an inner layer with no radius of its
           own gets clipped away at the corners, which is what "the border
           disappears at the corners" was. */
        .ask-shell {
          position: absolute;
          left: max(14px, calc(50% - 300px));
          right: max(14px, calc(50% - 300px));
          top: calc(100% - ${DOCK_H}px - var(--ask-gap));
          bottom: var(--ask-gap);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid var(--color-line);
          border-radius: 26px;
          /* White, not --color-card. That token is #fcfcfb and is meant for a
             card sitting on the grey canvas; this one floats on the frosted
             white content surface, where the two values are within one step of
             each other and the card stops reading as a card.
             (No backticks anywhere in this block: it is inside a template
             literal, so one would end the string and the parse error lands
             pages away from the comment that caused it.) */
          background-color: #ffffff;
          pointer-events: auto;
          /* Deliberately deeper than --shadow-lift, which is sized for a card
             sitting IN the page. This one floats over scrolling content and has
             to read as above it. */
          box-shadow: 0 1px 2px -1px rgb(0 0 0 / 0.06), 0 12px 32px -12px rgb(0 0 0 / 0.16);
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
          border-color: transparent;
          box-shadow: none;
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

        /* The panel. Squeezed to nothing while collapsed — the flex column is
           what puts the composer on the bottom edge in BOTH states without
           positioning it twice. */
        .ask-body {
          position: relative;
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transition: opacity 260ms ease 140ms;
          contain: layout paint;
        }
        .ask-layer[data-open="true"] .ask-body { opacity: 1; }

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
          padding: 16px 14px 14px 20px;
          transition: padding var(--ask-morph) var(--ask-ease);
        }
        .ask-layer[data-open="true"] .ask-composer {
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
          .ask-composer { transition: none !important; }
        }
        html[data-motion="reduced"] .ask-shell,
        html[data-motion="reduced"] .ask-body,
        html[data-motion="reduced"] .ask-scrim,
        html[data-motion="reduced"] .ask-composer { transition: none !important; }
      `}</style>
    </div>
  );
}
