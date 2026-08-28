"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MynaIcon } from "@/components/icons/myna";
import { askFirstMessage, askPrompt, type AskContext } from "@/lib/ask";
import { labelFor } from "@/lib/course";
import { hapticTap } from "@/lib/haptics";
import { useIdentity } from "@/lib/identity";
import { daysStudiedIn, useProgress } from "@/lib/progress";
import type { AskControls, AskItem, AskPhase, NewAskItem } from "../ask-types";

/* ------------------------------------------------------------------ *
 * The centre of the pane: a greeting and the box under it.
 *
 * This is the reference UI's composer, wired to the agent this app already
 * runs. Its three documented frame states are reproduced exactly in CSS — rest,
 * hover, focus-within, with hover suppressed while the pointer is over a
 * control inside the box, which is what stops the whole frame lighting up when
 * you reach for the microphone.
 *
 * TWO TRANSPORTS, ONE BOX, AND THEY ARE NOT INTERCHANGEABLE. The microphone
 * opens a WebRTC call on a conversation token; typing opens a signed WebSocket
 * with `textOnly`, which is billed per message (~$0.003) rather than per minute
 * (~$0.08). The SDK will not convert one into the other, so the engine is
 * REMOUNTED to switch — that is what the `key` on <AskEngine> is for, and why
 * `mode` is fixed for the lifetime of a conversation.
 *
 * ⚠️ TYPED ANSWERS ARRIVE WHOLE, NOT WORD BY WORD. The engine streams
 * `agent_chat_response_part` into its own state and draws it through its panel
 * chrome; this composer renders `chrome="none"` and its own thread, so it sees
 * only the finished `agent_response`. The alternative was adopting the engine's
 * panel, which brings a second visual language onto the surface this port
 * exists to unify. If the wait starts reading as a hang, the fix is to lift the
 * stream out of the engine behind a callback — not to switch chrome.
 *
 * NOTHING CONNECTS UNTIL THERE IS SOMETHING TO SAY. The engine is a dynamic
 * import: it carries a WebRTC stack that has no business in the dashboard's
 * first load on Zambian mobile data, and a conversation opened because somebody
 * glanced at the box is one the account is billed for. `ask-types.ts` exists so
 * this file can never import it as a value.
 * ------------------------------------------------------------------ */

const AskEngine = dynamic(() => import("../ask-engine").then((m) => m.AskEngine), {
  ssr: false,
});

type Session = { mode: "voice" | "text"; initial: string | null; n: number };

export function ShellComposer() {
  const { identity, hydrated: idHydrated } = useIdentity();
  const { hydrated, days, last } = useProgress();

  const [session, setSession] = useState<Session | null>(null);
  const [phase, setPhase] = useState<AskPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AskItem[]>([]);
  const [draft, setDraft] = useState("");

  const controls = useRef<AskControls | null>(null);
  const nextId = useRef(1);
  const box = useRef<HTMLTextAreaElement | null>(null);
  const runs = useRef(0);

  /* The CHOSEN name only — `identity.name` is the assigned avatar's name until
     somebody types their own, so reading it without `nameChosen` greets a
     student as "Astronaut". */
  const firstName = identity?.nameChosen ? identity.name.trim().split(/\s+/)[0] : undefined;

  const ctx: AskContext = useMemo(
    () => ({
      name: firstName,
      courses: identity?.courses ?? [],
      last: hydrated && last ? labelFor(last.id) : null,
      studyDays: hydrated ? daysStudiedIn(days, 7) : undefined,
    }),
    [firstName, identity, hydrated, last, days],
  );

  /* Built per conversation rather than per render — the prompt is a few
     kilobytes of concatenation over the whole course nav. */
  const brief = useMemo(
    () => ({
      voice: { prompt: askPrompt(ctx, "voice"), firstMessage: askFirstMessage(ctx) },
      text: { prompt: askPrompt(ctx, "text"), firstMessage: askFirstMessage(ctx) },
    }),
    [ctx],
  );

  const push = useCallback((item: NewAskItem) => {
    setItems((prev) => [...prev, { ...item, id: nextId.current++ } as AskItem]);
  }, []);

  const hangUp = useCallback(() => {
    hapticTap();
    controls.current?.hangUp();
    controls.current = null;
    setSession(null);
    setPhase("idle");
  }, []);

  /* Leaving the dashboard must hang up. This component unmounts when the
     student navigates into the reader or a session, and without this the
     connection survives it — billed, and still audible. */
  useEffect(() => {
    return () => {
      controls.current?.hangUp();
      controls.current = null;
    };
  }, []);

  /* A call that ends on its own — the agent finished, or the socket dropped —
     must put the button back. Without this the meter keeps drawing silence and
     the only way out is a reload. The thread is left standing: unlike a voice
     call's pins, a typed exchange is something the student may still be
     reading. */
  useEffect(() => {
    if (phase !== "ended") return;
    const t = setTimeout(() => {
      setSession(null);
      setPhase("idle");
    }, 1200);
    return () => clearTimeout(t);
  }, [phase]);

  const inCall = session?.mode === "voice" && (phase === "connecting" || phase === "live");
  const live = phase === "live";

  const talk = useCallback(() => {
    if (inCall) {
      hangUp();
      return;
    }
    hapticTap();
    setError(null);
    setItems([]);
    setSession({ mode: "voice", initial: null, n: ++runs.current });
  }, [inCall, hangUp]);

  const submit = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setError(null);

    /* Drawn immediately rather than waiting for the server to confirm it. The
       engine deliberately drops the user's own turns coming back down the
       socket, precisely so this optimistic copy is the only one. */
    push({ role: "you", text });

    /* Into a conversation that is already open — voice included, where the
       agent answers a typed question out loud. */
    if (session && live) {
      controls.current?.send(text);
      return;
    }
    setSession({ mode: "text", initial: text, n: ++runs.current });
  }, [draft, session, live, push]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    /* Enter sends, Shift+Enter opens a line — the convention every composer
       this one is modelled on uses. */
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const started = items.length > 0 || session !== null;
  const pins = items.filter((i) => i.role === "pin");
  const said = items.filter((i) => i.role !== "pin");

  return (
    <div className="shell-centre" data-started={started || undefined}>
      {/* The greeting steps aside once there is a conversation to read. It is a
          welcome, not a heading, and leaving it above a thread makes every
          answer look like it belongs to it. */}
      {!started ? (
        <h1 className="shell-greeting">
          {idHydrated && firstName ? `Good to see you, ${firstName}` : "What are you studying?"}
        </h1>
      ) : null}

      {said.length ? (
        <ul className="shell-thread">
          {said.map((m) => (
            <li key={m.id} className={m.role === "you" ? "shell-said-you" : "shell-said-agent"}>
              {m.text}
            </li>
          ))}
        </ul>
      ) : null}

      {/* WHAT THE AGENT DECIDED WAS WORTH KEEPING. In a voice call these are
          the only thing on screen — a transcript is the reading this replaces,
          in pieces, which is the rule study/PointStack sets. */}
      {pins.length ? (
        <ul className="shell-pins">
          {pins.slice(-3).map((p) => (
            <li key={p.id} className="shell-pin">
              {p.text}
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <p className="shell-error">{error}</p> : null}

      <div className="shell-composer">
        <textarea
          ref={box}
          className="shell-editor"
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={inCall ? "Listening — or type to ask" : "What can I help you with?"}
          aria-label="Ask Booklesss"
        />

        <div className="shell-bar">
          <div className="shell-bar-left">
            {session ? (
              <span className="shell-state" aria-live="polite">
                {phase === "connecting"
                  ? "Connecting…"
                  : phase === "live"
                    ? inCall
                      ? "Listening"
                      : "Thinking…"
                    : "Over"}
              </span>
            ) : null}
          </div>

          <div className="shell-bar-right">
            <button
              type="button"
              className="shell-cbtn"
              onClick={talk}
              data-live={inCall || undefined}
              aria-label={inCall ? "End the call" : "Talk to Booklesss"}
              title={inCall ? "End the call" : "Talk to Booklesss"}
            >
              {inCall ? (
                <Meter controls={controls} live={live} />
              ) : (
                <MynaIcon name="microphone" size={20} />
              )}
            </button>

            {/* Never disabled — the glyph says what it does, and a dead-looking
                circle is the first thing on the screen otherwise. With nothing
                typed it simply focuses the box. */}
            <button
              type="button"
              className="shell-send"
              onClick={() => (draft.trim() ? submit() : box.current?.focus())}
              aria-label="Send"
              title="Send"
            >
              <MynaIcon name="arrow-up" size={18} />
            </button>
          </div>
        </div>
      </div>

      {session ? (
        <AskEngine
          /* REMOUNTED PER CONVERSATION. `mode` and the brief are fixed for the
             lifetime of a session inside the engine, and the two transports are
             not convertible — so switching from typing to talking, or starting
             a second exchange, has to be a new mount rather than new props. */
          key={session.n}
          chrome="none"
          mode={session.mode}
          prompt={session.mode === "voice" ? brief.voice.prompt : brief.text.prompt}
          firstMessage={
            session.mode === "voice" ? brief.voice.firstMessage : brief.text.firstMessage
          }
          initialMessage={session.initial}
          items={items}
          muted={false}
          onItem={push}
          onPhase={setPhase}
          onError={setError}
          onReady={(c) => {
            controls.current = c;
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * Five bars inside the microphone button, following the voice.
 *
 * THE LEVEL IS POLLED ON AN ANIMATION FRAME AND WRITTEN TO A CSS VARIABLE, so
 * it never touches React. Re-rendering a component sixty times a second to move
 * five bars is how a call starts dropping frames on a mid-range Android.
 *
 * It reads through the controls REF rather than a prop, because the engine
 * mounts a moment after this does — the button flips to the meter the instant
 * the student presses it, and `onReady` lands once the SDK has a session. A
 * prop would need a re-render to arrive; polling a ref simply starts returning
 * real numbers when there are some.
 */
function Meter({
  controls,
  live,
}: {
  controls: React.RefObject<AskControls | null>;
  live: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let smoothed = 0;
    const tick = () => {
      /* Eased towards the reading rather than set to it — raw frequency data is
         spiky enough that bars bound directly to it flicker instead of move. */
      const next = Math.max(0, Math.min(1, controls.current?.getLevel() ?? 0));
      smoothed += (next - smoothed) * 0.22;
      el.style.setProperty("--lvl", smoothed.toFixed(3));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [controls]);

  /* Tallest in the middle, so the shape reads as a voice rather than a chart. */
  return (
    <span ref={ref} className="shell-meter" data-live={live || undefined} aria-hidden>
      {[0.4, 0.7, 1, 0.7, 0.4].map((w, i) => (
        <span key={i} style={{ ["--w" as string]: w }} />
      ))}
    </span>
  );
}
