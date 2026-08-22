"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { MynaIcon } from "@/components/icons/myna";
import { Orb, type OrbState } from "./Orb";
import { PointStack } from "./PointStack";
import {
  addPin,
  sessionRecord,
  setNotes,
  subscribeSessions,
  type Pin,
} from "@/lib/session-notes";

/* ------------------------------------------------------------------ *
 * A study session — a voice call with the points pinned to the screen.
 *
 * The owner's brief, 2026-08-21: minimal, "almost like a call", a voice
 * explaining while the important points pop up and STAY up, and the student
 * taking their own notes beside them. The reference decks he sent all share
 * one shape — a big orb, a state word, near-zero chrome, three buttons at the
 * bottom — and this is that shape in Booklesss's own palette.
 *
 * IT WEARS THE APP'S OWN SURFACE (2026-08-22). It shipped dark — a black and
 * green screen, argued for at the time as the one liberty taken with the
 * design system so a student could tell Listen from Read before reading a
 * word. The owner's reaction on seeing it in the app: it "has completely
 * disregarded the look and feel of the app by building its own black and green
 * screen". So the same two layers every other full-bleed page in this app is
 * built on — `.bg-waves` drifting behind, a frosted white surface over it,
 * exactly as /sign-in and /onboarding do it — and every control is the app's:
 * white circle buttons on the header's hairline-and-paper shadow, `.btn`
 * primary for the one action that matters, --color-card cards for the pins.
 *
 * THE DOOR IS STILL LEGIBLE, AND THAT WAS NEVER THE PALETTE'S JOB. What tells
 * a student they walked into a call is the LAYOUT: no sidebar, no header, one
 * breathing orb at the centre of the screen and three round buttons at the
 * bottom. A surface that needs to feel different differs in what it puts at
 * the centre, not by inventing a palette the app does not own.
 *
 * WHAT THE SERVER SENDS AND WHY. The whole brief — system prompt and opening
 * line — is built server-side (lib/session.ts) and handed down as props, then
 * sent to ElevenLabs as a per-call override. One agent therefore serves all
 * ~48 sessions across all four courses, and a rewritten step changes what the
 * agent teaches on the next call with nothing to update in a dashboard.
 * ------------------------------------------------------------------ */

export type CallProps = {
  sessionId: string;
  title: string;
  kicker?: string;
  minutes: number;
  beats: number;
  /** The full system prompt, built by lib/session.ts. */
  prompt: string;
  firstMessage: string;
  /** The steps behind this call, for reading it properly instead. */
  steps: { id: string; title: string; path: string }[];
  /** Where "back" goes — the course page this session belongs to. */
  backHref: string;
};

/** Why a call could not start, in the words a student should see. */
const REASONS: Record<string, string> = {
  "no-key": "Voice sessions aren't switched on yet.",
  "no-agent": "Voice sessions aren't switched on yet.",
  upstream: "Couldn't reach the voice service. Try again in a moment.",
  "bad-response": "Couldn't reach the voice service. Try again in a moment.",
  mic: "Booklesss needs your microphone for a session. Allow it and try again.",
  failed: "The call didn't connect. Try again in a moment.",
};

export function SessionCall(props: CallProps) {
  /* The provider is required as of @elevenlabs/react 1.13 — useConversation
   * throws outside one. Older tutorials call Conversation.startSession
   * directly; that API is still there but does not give the hook its context,
   * so the mode/status the screen reads would never update. */
  return (
    <ConversationProvider>
      <CallScreen {...props} />
    </ConversationProvider>
  );
}

function CallScreen({
  sessionId,
  title,
  kicker,
  minutes,
  beats,
  prompt,
  firstMessage,
  steps,
  backHref,
}: CallProps) {
  const [phase, setPhase] = useState<"idle" | "connecting" | "live" | "ended">("idle");
  const [error, setError] = useState<string | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [muted, setMuted] = useState(false);

  /* The record is read through useSyncExternalStore so a pin written by the
   * agent's tool call re-renders the stack without any of this owning it. */
  const record = useSyncExternalStore(
    subscribeSessions,
    () => sessionRecord(sessionId),
    () => sessionRecord(sessionId),
  );

  const startedAt = useRef(0);

  /* The tool the agent calls to put something on screen. Registered once and
   * kept stable — the SDK reads this map when the session opens, so a new
   * identity on every render would leave it holding a stale closure. */
  const clientTools = useMemo(
    () => ({
      show_point: ({ text, kind }: { text?: string; kind?: string }) => {
        const body = (text ?? "").trim();
        if (!body) return "empty";
        const allowed: Pin["kind"][] = ["key", "warning", "example", "formula", "point"];
        const k = allowed.includes(kind as Pin["kind"]) ? (kind as Pin["kind"]) : "point";
        addPin(sessionId, {
          text: body,
          kind: k,
          at: startedAt.current ? Date.now() - startedAt.current : 0,
        });
        /* A string back rather than nothing: the tool is declared with
         * expects_response false, so this is ignored, but returning a value
         * costs nothing and makes the tool debuggable from the agent's side if
         * that ever flips. */
        return "pinned";
      },
    }),
    [sessionId],
  );

  const conversation = useConversation({
    clientTools,
    onConnect: () => {
      startedAt.current = Date.now();
      setPhase("live");
    },
    onDisconnect: () => {
      setPhase((p) => (p === "live" ? "ended" : p));
    },
    onError: () => {
      setError(REASONS.failed);
      setPhase("idle");
    },
  });

  const { status, isSpeaking, startSession, endSession, setMuted: sdkSetMuted } = conversation;

  /* Loudness for the orb. Read through a ref-free getter so nothing here
   * re-renders on it — see the note at the top of Orb.tsx. */
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
      /* Called before the audio graph exists, which happens on the first
       * frames of a connection. Silence is the right answer, not a crash. */
      return 0;
    }
  }, [conversation, isSpeaking]);

  const begin = useCallback(async () => {
    setError(null);
    setPhase("connecting");

    /* Microphone FIRST, before the token is spent. Asking in this order means a
     * student who declines has not burned a token, and — more importantly — the
     * browser prompt appears as a direct result of their tap, which is the only
     * time Safari will show it at all. */
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      /* Release it immediately: the SDK opens its own, and holding this one
       * leaves the recording indicator lit on some browsers for the whole
       * call even while muted. */
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      setError(REASONS.mic);
      setPhase("idle");
      return;
    }

    let token: string;
    try {
      const res = await fetch("/api/agent/token", { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; token?: string; reason?: string };
      if (!data.ok || !data.token) {
        setError(REASONS[data.reason ?? "failed"] ?? REASONS.failed);
        setPhase("idle");
        return;
      }
      token = data.token;
    } catch {
      setError(REASONS.upstream);
      setPhase("idle");
      return;
    }

    try {
      startSession({
        conversationToken: token,
        connectionType: "webrtc",
        /* The per-call brief. See the trade-off note in lib/session.ts: this
         * travels through the browser, which is what lets one agent serve
         * every session, and is why the agent holds no tools that touch data. */
        overrides: { agent: { prompt: { prompt }, firstMessage } },
      });
    } catch {
      setError(REASONS.failed);
      setPhase("idle");
    }
  }, [prompt, firstMessage, startSession]);

  const finish = useCallback(() => {
    try {
      endSession();
    } catch {
      /* Ending a call that already dropped is not an error worth showing. */
    }
    setPhase("ended");
  }, [endSession]);

  /* Leaving the page mid-call must hang up. Without this the connection
   * survives a client-side navigation and the student is billed for a call
   * they are no longer in — and, on a phone, keeps hearing it. */
  useEffect(() => {
    return () => {
      try {
        endSession();
      } catch {
        /* already closed */
      }
    };
  }, [endSession]);

  const orbState: OrbState =
    phase === "connecting" || status === "connecting"
      ? "connecting"
      : phase === "live"
        ? isSpeaking
          ? "speaking"
          : "listening"
        : "idle";

  const stateWord =
    phase === "connecting"
      ? "Connecting…"
      : phase === "live"
        ? isSpeaking
          ? "Speaking…"
          : "Listening…"
        : phase === "ended"
          ? "Session over"
          : `${minutes} min · ${beats} ${beats === 1 ? "idea" : "ideas"}`;

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    try {
      sdkSetMuted(next);
    } catch {
      /* Not connected yet — the state still flips so the button is honest. */
    }
  };

  return (
    <>
      {/* The app's own backdrop, not a surface of this screen's own — the same
          two layers /sign-in and /onboarding are built on. Six spans because
          `.bg-waves` styles them by :nth-child(1..6). */}
      <div className="bg-waves" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <main className="relative z-10 flex min-h-[100dvh] flex-col bg-white/[0.62] backdrop-blur-[16px]">
        {/* ---- header: back, name, notes ---- */}
        <header className="relative z-10 flex items-center gap-3 px-4 pt-4">
          <CircleControl href={backHref} label="Leave this session">
            <MynaIcon name="chevron-right" size={17} className="rotate-180" />
          </CircleControl>
          <div className="min-w-0 flex-1 text-center">
            {kicker ? (
              <div className="font-container text-[10px] uppercase tracking-[0.1em] text-muted">
                {kicker}
              </div>
            ) : null}
            <h1 className="truncate font-title text-[15px] font-semibold text-ink">{title}</h1>
          </div>
          <CircleControl
            onClick={() => setNotesOpen((v) => !v)}
            label={notesOpen ? "Hide your notes" : "Write a note"}
            pressed={notesOpen}
          >
            <MynaIcon name="pencil" size={16} />
          </CircleControl>
        </header>

        {/* ---- the orb and its state word ---- */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-6">
          <p className="font-container text-[13px] font-medium tracking-wide text-muted">
            {stateWord}
          </p>
          <div className="mt-5">
            <Orb state={orbState} size={168} getLevel={phase === "live" ? getLevel : undefined} />
          </div>
        </div>

        {/* ---- what is being kept ---- */}
        <div className="relative z-10 mx-auto mt-8 w-full max-w-[520px] flex-1 overflow-y-auto px-5 pb-40">
          {error ? (
            <div className="squircle mb-4 rounded-2xl border border-line bg-card px-4 py-3 text-center shadow-lift">
              <p className="font-container text-[13px] font-medium text-ink">{error}</p>
              {(error === REASONS["no-key"] || error === REASONS.upstream) && steps.length ? (
                <Link
                  href={steps[0].path}
                  className="font-container mt-2 inline-block text-[13px] font-semibold text-brand-deep underline underline-offset-4"
                >
                  Read it instead
                </Link>
              ) : null}
            </div>
          ) : null}

          {phase === "ended" ? (
            <div className="mb-5 text-center">
              <p className="font-container text-[13px] text-muted">
                {record.pins.length
                  ? `${record.pins.length} ${record.pins.length === 1 ? "point" : "points"} kept. They stay here.`
                  : "No points were pinned this time."}
              </p>
            </div>
          ) : null}

          <PointStack pins={record.pins} />

          {phase === "ended" && steps.length ? (
            <div className="mt-8 border-t border-line pt-5">
              <div className="font-container mb-2.5 text-[10px] uppercase tracking-[0.1em] text-muted">
                Read any of this properly
              </div>
              <div className="flex flex-col gap-1.5">
                {steps.map((s) => (
                  <Link
                    key={s.id}
                    href={s.path}
                    className="squircle font-container flex items-center justify-between rounded-xl border border-line bg-card px-3.5 py-2.5 text-[13px] font-medium text-ink transition hover:bg-active"
                  >
                    {s.title}
                    <MynaIcon name="chevron-right" size={15} className="text-placeholder" />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* ---- notes ---- */}
        {notesOpen ? (
          <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[560px] px-4 pb-4">
            <div className="squircle rounded-3xl border border-line bg-white/85 p-4 shadow-[0_1px_2px_-1px_rgb(0_0_0/0.06),0_-10px_30px_-14px_rgb(0_0_0/0.18)] backdrop-blur-[16px]">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-container text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Your notes
                </span>
                <button
                  type="button"
                  onClick={() => setNotesOpen(false)}
                  className="font-container text-[12px] font-medium text-muted transition-colors hover:text-ink"
                >
                  Done
                </button>
              </div>
              <textarea
                autoFocus
                value={record.notes}
                onChange={(e) => setNotes(sessionId, e.target.value)}
                placeholder="Write while you listen…"
                rows={5}
                className="font-container squircle w-full resize-none rounded-2xl border border-line bg-white p-3.5 text-[14px] leading-relaxed text-ink outline-none transition-colors placeholder:text-placeholder focus:border-line-2"
              />
            </div>
          </div>
        ) : null}

        {/* ---- the three buttons ---- */}
        {!notesOpen ? (
          <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-center gap-5 pb-9 pt-6">
            {phase === "live" ? (
              <>
                <RoundButton onClick={toggleMute} label={muted ? "Unmute" : "Mute"} tone="paper">
                  <MynaIcon
                    name={muted ? "microphone-off" : "microphone"}
                    size={19}
                    style={{ color: muted ? "var(--color-danger)" : "var(--color-ink)" }}
                  />
                </RoundButton>
                <RoundButton onClick={finish} label="End the session" tone="end" big>
                  <MynaIcon name="telephone-off" size={22} style={{ color: "#fff" }} />
                </RoundButton>
                <RoundButton onClick={() => setNotesOpen(true)} label="Write a note" tone="paper">
                  <MynaIcon name="pencil" size={18} style={{ color: "var(--color-ink)" }} />
                </RoundButton>
              </>
            ) : (
              <button
                type="button"
                onClick={phase === "ended" ? () => setPhase("idle") : begin}
                disabled={phase === "connecting"}
                className="btn font-container font-semibold"
                data-variant="primary"
                data-size="lg"
              >
                {phase === "connecting"
                  ? "Connecting…"
                  : phase === "ended"
                    ? "Go again"
                    : "Start session"}
              </button>
            )}
          </div>
        ) : null}
      </main>
    </>
  );
}

/* The paper circle from the app header (components/TopBar), as the one control
 * this screen's chrome is built from. Same 1px #d4d4d4 and the same three-layer
 * paper shadow — copied rather than imported because TopBar's is private to it
 * and takes an icon name where this needs to wrap a link as well as a button.
 * If a third surface ever wants it, that is the moment it becomes a class in
 * globals.css rather than a second copy. */
const CIRCLE =
  "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-2 bg-white shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)] transition-colors";

function CircleControl({
  href,
  onClick,
  label,
  pressed,
  children,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  /* Pressed is carried by INK, not by a fill: the header's circles are paper
     in every other part of the app, and a filled one here would be a control
     this app does not otherwise have. */
  const cls = `${CIRCLE} ${pressed ? "text-brand-deep" : "text-muted hover:text-ink"}`;
  if (href) {
    return (
      <Link href={href} aria-label={label} title={label} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cls}
    >
      {children}
    </button>
  );
}

function RoundButton({
  onClick,
  label,
  tone,
  big,
  children,
}: {
  onClick: () => void;
  label: string;
  tone: "paper" | "end";
  big?: boolean;
  children: React.ReactNode;
}) {
  const size = big ? "h-16 w-16" : "h-12 w-12";
  /* Hanging up is the app's solid black — the same --color-btn the primary
     button and the header's icon tiles wear. A red circle was the dark
     screen's idea of a call control; on the app's surface it is the only
     saturated thing on the page and it shouts. */
  const skin =
    tone === "end"
      ? "bg-btn hover:bg-black shadow-[0_2px_6px_-2px_rgb(0_0_0/0.25),0_12px_28px_-14px_rgb(0_0_0/0.45)]"
      : `border border-line-2 bg-white hover:bg-active shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)]`;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid ${size} place-items-center rounded-full transition-colors ${skin}`}
    >
      {children}
    </button>
  );
}
