"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { MynaIcon, type MynaIconName } from "@/components/icons/myna";
import type { AskControls, AskItem, AskPhase, NewAskItem, PinKind } from "./ask-types";

/* ------------------------------------------------------------------ *
 * The conversation behind the ask box — the half that talks to ElevenLabs.
 *
 * SPLIT FROM AskDock ON PURPOSE, and the split is a load boundary rather than a
 * tidiness one. Importing this module pulls in @elevenlabs/client, which
 * carries a whole WebRTC stack; the dashboard is the first screen a student
 * sees on mobile data, and most visits to it never open a conversation at all.
 * So the dock is a plain box with a textarea in it, and this arrives on the
 * first sent message or the first tap of the mic. Nothing here may ever be
 * imported by AskDock as a value — see ask-types.ts.
 *
 * TWO TRANSPORTS, ONE AGENT. A call is WebRTC on a conversation token; a typed
 * conversation is a WebSocket on a signed URL with `textOnly`, which is what
 * stops the account paying to synthesise speech nobody will hear. They are not
 * interchangeable and the SDK will not convert one into the other, so the mode
 * is fixed when this mounts and switching means remounting — which is exactly
 * what the mic button does.
 *
 * WHAT IS ON SCREEN DIFFERS BY MODE, and that is the product decision, not a
 * layout convenience:
 *   · a CALL shows the level meter and the pinned points, and NO transcript. A
 *     running transcript is the reading this replaces, in pieces.
 *   · a TYPED conversation is the transcript, because that is what typing is —
 *     with the same pinned cards landing inline where they were made.
 *
 * IT IS DRAWN IN THE APP'S OWN PALETTE (owner, 2026-08-22: "that green, or
 * whatever colour you keep adding, does not match the actual UI that I already
 * have"). The first version borrowed the session call's dark surface and its
 * green orb. Nothing here introduces a colour — ink on card, on the app's
 * hairline, exactly like the reader's callouts. The presence during a call is a
 * five-bar LEVEL METER in `--color-ink` rather than the orb, for the same
 * reason: the orb is a saturated green sphere, which is the single loudest
 * thing this palette could put on a white panel.
 * ------------------------------------------------------------------ */

/** Why a conversation could not start, in the words a student should see. */
const REASONS: Record<string, string> = {
  "no-key": "Talking isn't switched on yet.",
  "no-agent": "Talking isn't switched on yet.",
  upstream: "Couldn't reach the voice service. Try again in a moment.",
  "bad-response": "Couldn't reach the voice service. Try again in a moment.",
  mic: "Booklesss needs your microphone. Allow it and try again.",
  failed: "That didn't connect. Try again in a moment.",
};

/* Deliberately the same marks the reader draws for the same ideas — a key
 * point should not wear one glyph when it is read and another when it is
 * heard. Mirrors MARKS in study/PointStack. */
const MARKS: Record<PinKind, { icon: MynaIconName; label: string }> = {
  key: { icon: "key", label: "Key point" },
  warning: { icon: "danger-triangle", label: "Watch out" },
  example: { icon: "clipboard", label: "Example" },
  formula: { icon: "zap", label: "Formula" },
  point: { icon: "check", label: "Point" },
};

export type AskEngineProps = {
  mode: "voice" | "text";
  prompt: string;
  firstMessage: string;
  /** Sent the instant the connection opens — the question that started this. */
  initialMessage: string | null;
  /** The thread so far, owned by the dock so it survives this unmounting. */
  items: AskItem[];
  muted: boolean;
  onItem: (item: NewAskItem) => void;
  onPhase: (phase: AskPhase) => void;
  onError: (message: string | null) => void;
  onReady: (controls: AskControls | null) => void;
};

export function AskEngine(props: AskEngineProps) {
  /* The provider is required as of @elevenlabs/react 1.13 — useConversation
   * throws outside one. Older tutorials call Conversation.startSession
   * directly; that API still exists but gives the hook no context, so the
   * status this screen reads would never update. */
  return (
    <ConversationProvider>
      <Engine {...props} />
      <ThreadStyles />
    </ConversationProvider>
  );
}

function Engine({
  mode,
  prompt,
  firstMessage,
  initialMessage,
  items,
  muted,
  onItem,
  onPhase,
  onError,
  onReady,
}: AskEngineProps) {
  const [phase, setPhase] = useState<AskPhase>("connecting");
  /* The answer as it is being written. Held here rather than pushed into the
   * thread, because it is not a thread item yet — it is replaced wholesale by
   * the finished text when `agent_response` lands. */
  const [stream, setStream] = useState("");

  /* Callbacks arrive fresh on every parent render — the dock re-renders on each
   * keystroke in the box — and the SDK reads its handler map once, when the
   * session opens. Holding them in a ref means the map it captured is never
   * stale and never a reason to re-open the session. */
  const cb = useRef({ onItem, onPhase, onError, onReady });
  /* Updated in an effect, not during render — writing a ref while rendering is
   * a real hazard (React may render without committing) and the linter is
   * right to refuse it. One render late costs nothing here: every reader of
   * this map is an SDK event arriving over a socket, long after the commit. */
  useEffect(() => {
    cb.current = { onItem, onPhase, onError, onReady };
  });

  const setBoth = useCallback((p: AskPhase) => {
    setPhase(p);
    cb.current.onPhase(p);
  }, []);

  /* The tool the agent calls to put something on screen. Registered once and
   * kept stable, for the same reason as above. */
  const clientTools = useMemo(
    () => ({
      show_point: ({ text, kind }: { text?: string; kind?: string }) => {
        const body = (text ?? "").trim();
        if (!body) return "empty";
        const allowed: PinKind[] = ["key", "warning", "example", "formula", "point"];
        const k = allowed.includes(kind as PinKind) ? (kind as PinKind) : "point";
        cb.current.onItem({ role: "pin", text: body, kind: k });
        return "pinned";
      },
    }),
    [],
  );

  const conversation = useConversation({
    clientTools,
    onConnect: () => setBoth("live"),
    onDisconnect: () => setBoth("ended"),
    onError: () => {
      cb.current.onError(REASONS.failed);
      setBoth("ended");
    },
    onMessage: ({ message, source }) => {
      /* A voice call keeps no transcript — see the note at the top. The user's
       * own turns are skipped in both modes: in text they were already drawn
       * optimistically by the composer, and echoing them would double every
       * question the moment the server confirms it. */
      if (mode !== "text" || source !== "ai") return;
      const body = (message ?? "").trim();
      if (!body) return;
      setStream("");
      cb.current.onItem({ role: "agent", text: body });
    },
    /* THE ANSWER, ARRIVING. A typed conversation streams the reply word by word
     * (`agent_chat_response_part`) and then sends the whole thing again as one
     * `agent_response`, which is what `onMessage` above receives. Rendering only
     * the finished message would leave a student watching three dots for several
     * seconds and then take a paragraph in one blink; the frames are already on
     * the wire, so this shows the answer being written and swaps in the final
     * text when it lands. */
    onAgentChatResponsePart: (part) => {
      if (mode !== "text") return;
      if (part?.type === "start") {
        setStream("");
        return;
      }
      if (part?.type === "delta" && part.text) setStream((prev) => prev + part.text);
    },
  });

  const { status, isSpeaking, startSession, endSession, sendUserMessage, setMuted } = conversation;

  /* Loudness for the meter, read through a getter so nothing here re-renders on
   * it — the value changes sixty times a second and is written straight onto a
   * CSS variable. */
  const getLevel = useCallback(() => {
    try {
      const data = isSpeaking
        ? conversation.getOutputByteFrequencyData()
        : conversation.getInputByteFrequencyData();
      if (!data?.length) return 0;
      /* Mean of the low half of the spectrum: speech energy lives down there,
       * and averaging the whole range drags the value towards nothing. */
      const half = Math.max(1, Math.floor(data.length / 2));
      let sum = 0;
      for (let i = 0; i < half; i++) sum += data[i];
      return Math.min(1, sum / half / 128);
    } catch {
      /* Called before the audio graph exists, which happens on the first frames
       * of a connection. Silence is the right answer, not a crash. */
      return 0;
    }
  }, [conversation, isSpeaking]);

  /* ---- opening the conversation ---------------------------------- *
   * Runs once per mount. `mode` and the brief are fixed for the lifetime of
   * this component by construction: the dock remounts it to change either.
   *
   * ⚠️ THE GUARD MUST BE RELEASED BY THE CLEANUP, and getting that wrong is
   * silent. React's StrictMode mounts an effect, tears it down and mounts it
   * again. With a ref guard that is set but never cleared, the first run marks
   * itself started and is then CANCELLED by its own cleanup, and the second run
   * returns early because the ref says a run already happened — so no socket is
   * ever opened, no request is made, and nothing errors. It looks exactly like
   * an agent that will not answer. Clearing the ref in the cleanup makes the
   * second mount a real first run, which is what StrictMode is checking for.
   * ---------------------------------------------------------------- */
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;

    (async () => {
      cb.current.onError(null);
      setBoth("connecting");

      /* Microphone FIRST, before a credential is spent. Asking in this order
       * means a student who declines has not burned a token, and — the part
       * that actually matters — the browser prompt appears as a direct result
       * of their tap, which is the only time Safari shows it at all. */
      if (mode === "voice") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          /* Released immediately: the SDK opens its own, and holding this one
           * leaves the recording indicator lit for the whole call on some
           * browsers, even while muted. */
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          if (cancelled) return;
          cb.current.onError(REASONS.mic);
          setBoth("ended");
          return;
        }
      }

      let credential: string;
      try {
        const res = await fetch("/api/agent/token" + (mode === "text" ? "?mode=text" : ""), {
          cache: "no-store",
        });
        const data = (await res.json()) as { ok?: boolean; credential?: string; reason?: string };
        if (!data.ok || !data.credential) {
          if (cancelled) return;
          cb.current.onError(REASONS[data.reason ?? "failed"] ?? REASONS.failed);
          setBoth("ended");
          return;
        }
        credential = data.credential;
      } catch {
        if (cancelled) return;
        cb.current.onError(REASONS.upstream);
        setBoth("ended");
        return;
      }

      if (cancelled) return;

      try {
        /* The per-call brief travels through the browser. That is the accepted
         * trade recorded for sessions and it holds here for the same reason:
         * it is what lets ONE agent serve every surface, and the agent holds no
         * tool that touches data and no secret worth editing a prompt to reach.
         *
         * `overrides.conversation.textOnly` is what stops the server
         * synthesising audio for a typed conversation. It needs the agent to
         * permit conversation overrides — scripts/setup-elevenlabs.mjs sets
         * that, and a re-run repairs an agent created before it did. */
        startSession(
          mode === "text"
            ? {
                signedUrl: credential,
                connectionType: "websocket",
                textOnly: true,
                overrides: {
                  agent: { prompt: { prompt }, firstMessage },
                  conversation: { textOnly: true },
                },
              }
            : {
                conversationToken: credential,
                connectionType: "webrtc",
                overrides: { agent: { prompt: { prompt }, firstMessage } },
              },
        );
      } catch {
        if (cancelled) return;
        cb.current.onError(REASONS.failed);
        setBoth("ended");
      }
    })();

    return () => {
      cancelled = true;
      started.current = false;
    };
  }, [mode, prompt, firstMessage, startSession, setBoth]);

  /* Leaving mid-conversation must hang up. Without this the connection survives
   * a client-side navigation and the student is billed for a call they are no
   * longer in — and, on a phone, keeps hearing it. */
  useEffect(() => {
    return () => {
      try {
        endSession();
      } catch {
        /* already closed */
      }
    };
  }, [endSession]);

  /* The question that opened this, sent the moment there is a socket to send it
   * down. Guarded by a ref so a re-render at `live` cannot send it twice. */
  const sentInitial = useRef(false);
  useEffect(() => {
    if (phase !== "live" || sentInitial.current || !initialMessage) return;
    sentInitial.current = true;
    try {
      sendUserMessage(initialMessage);
    } catch {
      cb.current.onError(REASONS.failed);
    }
  }, [phase, initialMessage, sendUserMessage]);

  /* Mute is owned by the dock — it draws the button — and applied here. */
  useEffect(() => {
    try {
      setMuted(muted);
    } catch {
      /* not connected yet; the next render after `live` applies it */
    }
  }, [muted, setMuted]);

  /* ---- what the composer is allowed to do ------------------------ */
  useEffect(() => {
    const controls: AskControls = {
      send: (text: string) => {
        try {
          sendUserMessage(text);
        } catch {
          cb.current.onError(REASONS.failed);
        }
      },
      hangUp: () => {
        try {
          endSession();
        } catch {
          /* ending one that already dropped is not an error worth showing */
        }
      },
      setMuted: (m: boolean) => {
        try {
          setMuted(m);
        } catch {
          /* as above */
        }
      },
    };
    cb.current.onReady(controls);
    return () => cb.current.onReady(null);
  }, [sendUserMessage, endSession, setMuted]);

  /* ---- the screen ------------------------------------------------ */

  /* DERIVED, not state. "We are waiting on an answer" is exactly "the last
   * thing in the thread is the student's own line and nothing has started
   * arriving yet" — so it needs no flag, no setter, and no effect setting one.
   * It was three setAwaiting calls, one of them inside an effect, which is the
   * shape the linter objects to and it was right: a flag that can be computed
   * is a flag that can disagree with the thing it describes. */
  const awaiting =
    mode === "text" && !stream && items[items.length - 1]?.role === "you";

  const live = phase === "live";
  const stateWord =
    phase === "connecting" || status === "connecting"
      ? "Connecting…"
      : live
        ? isSpeaking
          ? "Speaking…"
          : "Listening…"
        : "Call over";

  return mode === "voice" ? (
    <VoiceBody
      stateWord={stateWord}
      live={live}
      getLevel={live ? getLevel : undefined}
      items={items}
    />
  ) : (
    <TextBody
      items={items}
      stream={stream}
      awaiting={awaiting}
      connecting={phase === "connecting"}
    />
  );
}

/* ------------------------------------------------------------------ *
 * The call: a word, a level meter, and what it decided was worth keeping.
 * ------------------------------------------------------------------ */
function VoiceBody({
  stateWord,
  live,
  getLevel,
  items,
}: {
  stateWord: string;
  live: boolean;
  getLevel?: () => number;
  items: AskItem[];
}) {
  const pins = items.filter((i) => i.role === "pin");
  return (
    <div className="ask-voice">
      <LevelMeter getLevel={getLevel} live={live} />
      <p className="ask-state">{stateWord}</p>
      <div className="ask-thread ask-thread-voice">
        {pins.length ? (
          pins.map((p) => <PinCard key={p.id} text={p.text} kind={p.kind as PinKind} />)
        ) : (
          <p className="ask-hint">Anything worth keeping will stay here.</p>
        )}
        <Anchor dep={pins.length * 1000} />
      </div>
    </div>
  );
}

/**
 * Five ink bars that follow the voice.
 *
 * This replaces the session screen's orb here, and the reason is the palette
 * rather than the drawing: an orb is a big saturated sphere, and this panel is
 * white with ink on it. A meter says the same thing — something is happening,
 * and it is responding to sound — in the one colour this surface already uses.
 *
 * The level is polled on an animation frame and written to a CSS variable, so
 * it never touches React. Re-rendering a component sixty times a second to move
 * five bars is how a call starts dropping frames on a mid-range Android.
 */
function LevelMeter({ getLevel, live }: { getLevel?: () => number; live: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !getLevel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let smoothed = 0;
    const tick = () => {
      /* Eased towards the reading rather than set to it. Raw frequency data is
       * spiky enough that bars bound directly to it flicker instead of moving. */
      const next = Math.max(0, Math.min(1, getLevel() || 0));
      smoothed += (next - smoothed) * 0.22;
      el.style.setProperty("--lvl", smoothed.toFixed(3));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [getLevel]);

  /* Tallest in the middle, so the shape reads as a voice rather than a chart. */
  const weights = [0.42, 0.72, 1, 0.72, 0.42];
  return (
    <div ref={ref} className="ask-meter" data-live={live} aria-hidden>
      {weights.map((w, i) => (
        <span key={i} style={{ "--w": w } as React.CSSProperties} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The typed conversation.
 * ------------------------------------------------------------------ */
function TextBody({
  items,
  stream,
  awaiting,
  connecting,
}: {
  items: AskItem[];
  stream: string;
  awaiting: boolean;
  connecting: boolean;
}) {
  return (
    <div className="ask-thread">
      {items.map((it) =>
        it.role === "pin" ? (
          <PinCard key={it.id} text={it.text} kind={it.kind as PinKind} />
        ) : (
          <p key={it.id} className={it.role === "you" ? "ask-you" : "ask-agent"}>
            {it.text}
          </p>
        ),
      )}

      {/* The answer being written. Same class as a finished one, so nothing
          moves or restyles when the final text replaces it. `aria-live` polite
          rather than assertive: a screen reader should not read a paragraph
          again on every word. */}
      {stream ? (
        <p className="ask-agent" aria-live="polite">
          {stream}
        </p>
      ) : awaiting || connecting ? (
        <div className="ask-dots" aria-label="Thinking">
          <span />
          <span />
          <span />
        </div>
      ) : null}

      {/* Scrolls on each new item, and again as the answer grows — otherwise a
          reply longer than the panel writes itself off the bottom of it. */}
      <Anchor dep={items.length * 1000 + stream.length} />
    </div>
  );
}

/** Keeps the newest thing in view. Keyed on a COUNT, not on the array — the
 *  parent hands back a new array identity on every render. */
function Anchor({ dep }: { dep: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const seen = useRef(0);
  useEffect(() => {
    if (!dep) return;
    /* `auto` while an answer is streaming, `smooth` when something lands. A
       smooth scroll restarted on every streamed word never finishes one, so
       the view crawls behind the text it is meant to be following. */
    const streaming = dep - seen.current < 1000;
    seen.current = dep;
    ref.current?.scrollIntoView({ behavior: streaming ? "auto" : "smooth", block: "end" });
  }, [dep]);
  return <div ref={ref} />;
}

function PinCard({ text, kind }: { text: string; kind: PinKind }) {
  const mark = MARKS[kind] ?? MARKS.point;
  return (
    <div className="ask-pin">
      <MynaIcon name={mark.icon} size={15} strokeWidth={1.6} className="ask-pin-mark" />
      <div className="min-w-0">
        <div className="ask-pin-label">{mark.label}</div>
        <p className="ask-pin-text">{text}</p>
      </div>
    </div>
  );
}

/* Shared by both bodies, so it is rendered once by the wrapper rather than
 * inside whichever body happens to be on screen.
 *
 * THE TWO FACES ARE THE OWNER'S 2026-08-02 SPLIT, applied by job: a sentence
 * someone reads is Aptos (`--font-content`), and chrome that frames or
 * annotates a sentence is Satoshi (`--font-container`). So the agent's answer
 * and the student's own question are Aptos — they are the reading — while the
 * pin card, its label and the state word are Satoshi. */
function ThreadStyles() {
  return (
    <style>{`
      .ask-thread {
        flex: 1 1 auto;
        min-height: 0;
        width: 100%;
        overflow-y: auto;
        overscroll-behavior: contain;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 4px 18px 14px;
        -webkit-overflow-scrolling: touch;
      }
      .ask-thread::-webkit-scrollbar { width: 0; height: 0; }

      /* The student's own question. Right-aligned and boxed in the app's own
         selected-row grey, because in a two-voice thread the only thing that
         reliably says who is speaking is which edge the text starts from. */
      .ask-you {
        align-self: flex-end;
        max-width: 84%;
        font-family: var(--font-content);
        font-size: 15px;
        line-height: 1.5;
        color: var(--color-ink);
        background-color: var(--color-active);
        border-radius: 18px 18px 6px 18px;
        padding: 10px 14px;
        white-space: pre-wrap;
      }
      /* The answer is NOT in a bubble. It is the longest thing on screen and
         the thing actually worth reading; boxing it would put a border around
         the reading and make the panel a chat app rather than an answer. */
      .ask-agent {
        font-family: var(--font-content);
        font-size: 15.5px;
        line-height: 1.62;
        color: var(--color-ink);
        white-space: pre-wrap;
      }

      .ask-hint {
        font-family: var(--font-container);
        font-size: 13px;
        line-height: 1.6;
        text-align: center;
        color: var(--color-muted);
        padding: 0 24px;
      }

      /* A pin, in the same card-on-a-hairline the reader gives a callout. */
      .ask-pin {
        display: flex;
        gap: 11px;
        border: 1px solid var(--color-line);
        border-radius: 16px;
        padding: 12px 14px;
        background-color: rgba(255, 255, 255, 0.75);
        box-shadow: var(--shadow-lift);
        animation: ask-pin-in 380ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }
      .ask-pin-mark { margin-top: 3px; flex: 0 0 auto; color: var(--color-ink); }
      .ask-pin-label {
        font-family: var(--font-container);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-muted);
      }
      .ask-pin-text {
        font-family: var(--font-container);
        font-weight: 500;
        font-size: 14px;
        line-height: 1.45;
        color: var(--color-ink);
        margin-top: 4px;
      }
      @keyframes ask-pin-in {
        from { opacity: 0; transform: translateY(10px) scale(0.985); }
        to   { opacity: 1; transform: none; }
      }

      /* ---- the call ---- */
      .ask-voice {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .ask-state {
        font-family: var(--font-container);
        font-weight: 500;
        font-size: 13px;
        color: var(--color-muted);
        flex: 0 0 auto;
        margin-top: 14px;
      }
      .ask-thread-voice { margin-top: 18px; }

      .ask-meter {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        height: 64px;
        flex: 0 0 auto;
        margin-top: 8px;
      }
      .ask-meter span {
        width: 7px;
        border-radius: 999px;
        background-color: var(--color-ink);
        /* 10px at silence, up to 10 + 44 * weight at full voice. Height rather
           than scaleY: a 7px bar with a full radius squashes its own caps under
           a vertical scale, and five squashed capsules read as a glitch. */
        height: calc(10px + (var(--w) * var(--lvl, 0) * 44px));
        transition: height 90ms linear;
      }
      /* Before it connects there is no audio to follow, so the bars breathe
         instead of sitting still — the same job the orb's idle state does. */
      .ask-meter[data-live="false"] span {
        animation: ask-meter-idle 1.5s ease-in-out infinite;
        animation-delay: calc(var(--w) * -0.5s);
      }
      @keyframes ask-meter-idle {
        0%, 100% { height: 10px; }
        50%      { height: 26px; }
      }

      .ask-dots { display: flex; gap: 5px; padding: 4px 2px; }
      .ask-dots span {
        width: 6px;
        height: 6px;
        border-radius: 999px;
        background-color: var(--color-line-2);
        animation: ask-dot 1.1s ease-in-out infinite;
      }
      .ask-dots span:nth-child(2) { animation-delay: 0.16s; }
      .ask-dots span:nth-child(3) { animation-delay: 0.32s; }
      @keyframes ask-dot {
        0%, 60%, 100% { opacity: 0.35; transform: translateY(0); }
        30%           { opacity: 1;    transform: translateY(-3px); }
      }

      @media (prefers-reduced-motion: reduce) {
        .ask-pin { animation: none; }
        .ask-dots span { animation: none; opacity: 0.6; }
        .ask-meter span { animation: none; transition: none; }
      }
      html[data-motion="reduced"] .ask-pin { animation: none; }
      html[data-motion="reduced"] .ask-dots span { animation: none; opacity: 0.6; }
      html[data-motion="reduced"] .ask-meter span { animation: none; transition: none; }
    `}</style>
  );
}
