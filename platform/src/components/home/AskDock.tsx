"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MynaIcon } from "@/components/icons/myna";
import { Orb } from "@/components/study/Orb";
import { askFirstMessage, askOpener, askPrompt, type AskContext } from "@/lib/ask";
import { labelFor } from "@/lib/course";
import { enrolledCourses } from "@/lib/courses";
import { hapticTap } from "@/lib/haptics";
import { useIdentity } from "@/lib/identity";
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
 * screen, and it does not fade one thing out to fade another in: the same fixed
 * shell grows from a 58px pill at the bottom of the page to the whole viewport,
 * and the composer that sat inside the pill is the same composer that ends up
 * at the bottom of the open panel. Nothing is remounted on the way, which is
 * not only a nicer animation — it is the only version that keeps the KEYBOARD.
 * A student taps the text, a real <textarea> takes focus inside their own tap,
 * iOS opens the keyboard, and the panel expands behind it. Mount the input as
 * part of the opening instead and the focus call lands outside the gesture,
 * which Safari answers by doing nothing at all.
 *
 * WHAT ACTUALLY ANIMATES: the shell's four insets and its radius, plus two
 * stacked background skins cross-fading (cream pill → the dark call surface).
 * A gradient cannot be transitioned, so it is two layers and an opacity. The
 * contents do not animate at all — they are laid out by flex and simply have
 * more room afterwards — which is what keeps a 560ms morph off the main
 * thread's back on a mid-range Android.
 *
 * NOTHING CONNECTS UNTIL THERE IS SOMETHING TO SAY. Opening the panel costs no
 * network: the ElevenLabs engine is a dynamic import, mounted on the first sent
 * message or the first tap of the mic, and until then the panel is an empty
 * state with three things worth asking. Two reasons, and the second is the real
 * one — the SDK carries a WebRTC stack with no business in the dashboard bundle
 * on Zambian mobile data, and a conversation that opens because somebody
 * glanced at the box is a conversation the account is billed for.
 * ------------------------------------------------------------------ */

/* Loaded on first use, never on the dashboard's first paint. `ssr: false`
 * because it touches getUserMedia and opens a socket the moment it mounts. */
const AskEngine = dynamic(() => import("./ask-engine").then((m) => m.AskEngine), {
  ssr: false,
});

/** The pill's height — the one number the collapsed geometry needs. */
const DOCK_H = 58;

export function AskDock() {
  const { identity } = useIdentity();
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
    [identity?.nameChosen, identity?.name, identity?.courses, hydrated, last, days],
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

  const mine = useMemo(() => enrolledCourses(identity?.courses), [identity?.courses]);

  const opener = useMemo(
    () => askOpener((identity?.since ?? "").length + (identity?.courses?.length ?? 0)),
    [identity?.since, identity?.courses],
  );

  /* Three things worth asking, built from what this student is actually taking,
   * so an empty panel is a starting point rather than a blank page. Falls back
   * to subject-free openers where the record has no courses yet. */
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
       the CALL, not the thread — reopening shows the pins and the exchange
       again, and starts nothing. */
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

  /* The page behind must not scroll under the panel. `#content-surface` is this
     app's scroller, not <body> — see the dashboard layout. */
  useEffect(() => {
    if (!open) return;
    const surface = document.getElementById("content-surface");
    if (!surface) return;
    const prev = surface.style.overflow;
    surface.style.overflow = "hidden";
    return () => {
      surface.style.overflow = prev;
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
         /api/agent/token). So this ends the old one and opens a call, and the
         engine is handed what has been said so the student needn't repeat it. */
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

  /* ---- the composer's one button --------------------------------- */

  const live = engaged && (phase === "live" || phase === "connecting");
  const typing = draft.trim().length > 0;
  /* Send when there is something to send; hang up when a call is running;
     otherwise the microphone, which is the box's whole invitation. */
  const action: "send" | "end" | "mic" =
    typing ? "send" : live && mode === "voice" ? "end" : "mic";

  /* Auto-grow, capped: one line in the pill, up to about five in the panel. */
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 116) + "px";
  }, [draft, open]);

  return (
    <div className="ask-layer" data-open={open} data-mode={mode}>
      <div className="ask-scrim" onClick={close} aria-hidden />

      <div
        className="ask-shell"
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        aria-label={open ? "Ask Booklesss" : undefined}
      >
        {/* The two skins: cream pill, dark call. Cross-faded, because a
            gradient is not an animatable value. */}
        <div className="ask-skin ask-skin-dock" aria-hidden />
        <div className="ask-skin ask-skin-call" aria-hidden />

        {/* ---- the panel above the composer ---- */}
        <div className="ask-body">
          {open ? (
            <>
              <div className="ask-topbar">
                <span className="ask-title">Ask</span>
                <button type="button" onClick={close} className="ask-icon-btn" aria-label="Close">
                  <MynaIcon name="x" size={17} style={{ color: "rgba(255,255,255,0.8)" }} />
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
                  {/* The same presence a session call has, at rest. It fills
                      what would otherwise be most of a phone screen of black,
                      and it says what the mic beside it does — the two doors
                      into the agent should look like the same thing. CSS only,
                      so it costs nothing to put here. */}
                  <div className="ask-empty-orb">
                    <Orb state="idle" size={116} />
                  </div>
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

        {/* ---- the composer: the same element in both states ---- */}
        <div className="ask-composer">
          {live && mode === "voice" ? (
            <button
              type="button"
              onClick={toggleMute}
              className="ask-icon-btn ask-mute"
              aria-label={muted ? "Unmute" : "Mute"}
              aria-pressed={muted}
            >
              <MynaIcon
                name={muted ? "microphone-off" : "microphone"}
                size={17}
                style={{ color: muted ? "#ff8f8f" : "rgba(255,255,255,0.75)" }}
              />
            </button>
          ) : null}

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

          <button
            type="button"
            onClick={action === "send" ? send : action === "end" ? hangUp : startVoice}
            className="ask-go"
            data-action={action}
            aria-label={
              action === "send" ? "Send" : action === "end" ? "End the call" : "Start a voice chat"
            }
          >
            <MynaIcon
              name={
                action === "send" ? "arrow-up" : action === "end" ? "telephone-off" : "microphone"
              }
              size={action === "send" ? 19 : 18}
              className="ask-go-mark"
            />
          </button>
        </div>
      </div>

      <style>{`
        /* --------------------------------------------------------------
           Colocated, like the orb's. globals.css is a file two sessions have
           collided on before, and none of this is reused anywhere else.
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
          background: rgba(8, 11, 9, 0.45);
          -webkit-backdrop-filter: blur(3px);
          backdrop-filter: blur(3px);
          transition: opacity 420ms ease;
          pointer-events: none;
        }
        .ask-layer[data-open="true"] .ask-scrim { opacity: 1; pointer-events: auto; }

        /* THE MORPH. Four insets and a radius; nothing else moves. */
        .ask-shell {
          position: absolute;
          left: max(14px, calc(50% - 288px));
          right: max(14px, calc(50% - 288px));
          top: calc(100% - ${DOCK_H}px - var(--ask-gap));
          bottom: var(--ask-gap);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 26px;
          pointer-events: auto;
          box-shadow: 0 2px 6px -2px rgb(0 0 0 / 0.10), 0 18px 44px -24px rgb(0 0 0 / 0.40);
          /* NOT the app's usual cubic-bezier(0.16, 1, 0.3, 1). That curve is
             right for the 200px sweep across an ActionBar and wrong here: it
             spends ninety per cent of its travel in the first third, which over
             800px of screen reads as a jump cut with a slow tail rather than as
             a box opening. Measured, not guessed — a per-frame probe of the
             shell's own rect had it 71% of the way home 119ms into a 560ms
             transition. This is the sheet curve: slower off the mark, so the
             box is visibly a box for long enough to be followed. */
          transition:
            top var(--ask-morph) var(--ask-ease),
            bottom var(--ask-morph) var(--ask-ease),
            left var(--ask-morph) var(--ask-ease),
            right var(--ask-morph) var(--ask-ease),
            border-radius var(--ask-morph) var(--ask-ease),
            box-shadow 420ms ease;
        }
        .ask-layer[data-open="true"] .ask-shell {
          left: 0; right: 0; top: 0; bottom: 0;
          border-radius: 0;
          box-shadow: none;
        }
        /* On a wide screen the panel is a centred card, not a takeover — the
           same morph, stopped short of the edges. */
        @media (min-width: 768px) {
          .ask-layer[data-open="true"] .ask-shell {
            left: max(24px, calc(50% - 340px));
            right: max(24px, calc(50% - 340px));
            top: 6vh;
            bottom: 6vh;
            border-radius: 28px;
            box-shadow: 0 30px 80px -40px rgb(0 0 0 / 0.6);
          }
        }

        .ask-skin {
          position: absolute;
          inset: 0;
          transition: opacity 380ms ease;
          pointer-events: none;
        }
        .ask-skin-dock {
          background: #fcfcfb;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.075);
          opacity: 1;
        }
        .ask-skin-call {
          opacity: 0;
          background:
            radial-gradient(90% 60% at 50% 6%, #16281f 0%, rgba(22, 40, 31, 0) 62%),
            radial-gradient(70% 50% at 50% 100%, #10241a 0%, rgba(16, 36, 26, 0) 70%),
            #0a0d0b;
        }
        .ask-layer[data-open="true"] .ask-skin-dock { opacity: 0; }
        .ask-layer[data-open="true"] .ask-skin-call { opacity: 1; }

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
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 14px 6px 20px;
          flex: 0 0 auto;
        }
        .ask-title {
          font-family: var(--font-container);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }

        .ask-icon-btn {
          display: grid;
          place-items: center;
          height: 34px;
          width: 34px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.10);
          transition: background-color 160ms ease;
          flex: 0 0 auto;
        }
        .ask-icon-btn:hover { background: rgba(255, 255, 255, 0.2); }

        .ask-empty {
          position: relative;
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 12px;
          padding: 0 18px 18px;
        }
        /* Takes the slack, so the orb centres in whatever is left above the
           line and the chips stay pinned over the composer. */
        .ask-empty-orb {
          flex: 1 1 auto;
          min-height: 0;
          display: grid;
          place-items: center;
        }
        .ask-empty-line {
          font-family: var(--font-container);
          font-weight: 500;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.5);
        }
        .ask-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .ask-chip {
          font-family: var(--font-container);
          font-weight: 500;
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.82);
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          padding: 8px 13px;
          text-align: left;
          transition: background-color 160ms ease;
        }
        .ask-chip:hover { background: rgba(255, 255, 255, 0.16); }

        .ask-error {
          font-family: var(--font-container);
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          margin: 0 18px 10px;
          padding: 10px 14px;
          flex: 0 0 auto;
        }

        /* THE COMPOSER — one element, both states. Its padding is all that
           changes; the field and the round button never move between parents. */
        .ask-composer {
          position: relative;
          flex: 0 0 auto;
          display: flex;
          align-items: flex-end;
          gap: 8px;
          padding: 9px 9px 9px 18px;
          transition: padding var(--ask-morph) var(--ask-ease);
        }
        .ask-layer[data-open="true"] .ask-composer {
          padding: 10px 10px calc(10px + env(safe-area-inset-bottom, 0px)) 18px;
        }

        .ask-field {
          flex: 1 1 auto;
          min-width: 0;
          resize: none;
          border: 0;
          outline: none;
          background: transparent;
          font-family: var(--font-container);
          font-weight: 500;
          font-size: 15px;
          line-height: 20px;
          padding: 10px 0;
          max-height: 116px;
          color: var(--color-ink);
          transition: color 380ms ease;
        }
        .ask-field::placeholder { color: var(--color-placeholder); }
        .ask-layer[data-open="true"] .ask-field { color: #fff; }
        .ask-layer[data-open="true"] .ask-field::placeholder { color: rgba(255, 255, 255, 0.35); }

        .ask-go {
          display: grid;
          place-items: center;
          height: 40px;
          width: 40px;
          flex: 0 0 auto;
          border-radius: 999px;
          background: var(--color-brand);
          color: #06281b;
          transition: background-color 200ms ease, color 200ms ease, transform 160ms ease;
        }
        .ask-go-mark { color: currentColor; }
        .ask-go:hover { transform: scale(1.04); }
        .ask-go:active { transform: scale(0.96); }
        /* Sending from the closed pill is an ink button on cream; sending from
           the open panel is the brand green on near-black. Both are the app's
           existing primary — neither is a new colour. */
        .ask-go[data-action="send"] { background: var(--color-ink); color: #fff; }
        .ask-layer[data-open="true"] .ask-go[data-action="send"] {
          background: var(--color-brand);
          color: #06281b;
        }
        .ask-go[data-action="end"] { background: #c8342f; color: #fff; }

        .ask-mute { margin-bottom: 1px; }

        /* Reduced motion: the same two states, they simply arrive. Honours the
           app's own switch as well as the OS one — see lib/motion. */
        @media (prefers-reduced-motion: reduce) {
          .ask-shell,
          .ask-skin,
          .ask-body,
          .ask-scrim,
          .ask-composer { transition: none !important; }
        }
        html[data-motion="reduced"] .ask-shell,
        html[data-motion="reduced"] .ask-skin,
        html[data-motion="reduced"] .ask-body,
        html[data-motion="reduced"] .ask-scrim,
        html[data-motion="reduced"] .ask-composer { transition: none !important; }
      `}</style>
    </div>
  );
}
