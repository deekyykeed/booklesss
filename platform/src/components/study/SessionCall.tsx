"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { HugeIcon } from "@/components/icons/huge";
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
 * DARK, WHERE THE REST OF THE APP IS CREAM. That is the one liberty taken with
 * the design system and it is deliberate: Listen and Read are now two doors on
 * every group, and a student should be able to tell which one they walked
 * through before reading a word. The green is the brand green already in
 * globals.css, so nothing new enters the palette to get it.
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
    <div className="call-surface relative flex min-h-[100dvh] flex-col text-white">
      {/* ---- header: back, name, notes ---- */}
      <header className="relative z-10 flex items-center gap-3 px-4 pt-4">
        <Link
          href={backHref}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
          aria-label="Leave this session"
        >
          <HugeIcon name="chevron-right" size={17} className="rotate-180" style={{ color: "#fff" }} />
        </Link>
        <div className="min-w-0 flex-1 text-center">
          {kicker ? (
            <div className="font-container text-[10px] uppercase tracking-[0.1em] text-white/40">
              {kicker}
            </div>
          ) : null}
          <h1 className="truncate font-title text-[15px] font-semibold text-white/90">{title}</h1>
        </div>
        <button
          type="button"
          onClick={() => setNotesOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
          aria-label={notesOpen ? "Hide your notes" : "Write a note"}
          aria-pressed={notesOpen}
        >
          <HugeIcon name="pencil" size={16} style={{ color: notesOpen ? "#3ecf8e" : "#fff" }} />
        </button>
      </header>

      {/* ---- the orb and its state word ---- */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-6">
        <p className="font-container text-[13px] font-medium tracking-wide text-white/45">
          {stateWord}
        </p>
        <div className="mt-5">
          <Orb state={orbState} size={200} getLevel={phase === "live" ? getLevel : undefined} />
        </div>
      </div>

      {/* ---- what is being kept ---- */}
      <div className="relative z-10 mx-auto mt-8 w-full max-w-[520px] flex-1 overflow-y-auto px-5 pb-40">
        {error ? (
          <div className="mb-4 rounded-2xl bg-white/10 px-4 py-3 text-center">
            <p className="font-container text-[13px] font-medium text-white/85">{error}</p>
            {(error === REASONS["no-key"] || error === REASONS.upstream) && steps.length ? (
              <Link
                href={steps[0].path}
                className="font-container mt-2 inline-block text-[13px] font-semibold text-[#3ecf8e] underline underline-offset-4"
              >
                Read it instead
              </Link>
            ) : null}
          </div>
        ) : null}

        {phase === "ended" ? (
          <div className="mb-5 text-center">
            <p className="font-container text-[13px] text-white/50">
              {record.pins.length
                ? `${record.pins.length} ${record.pins.length === 1 ? "point" : "points"} kept. They stay here.`
                : "No points were pinned this time."}
            </p>
          </div>
        ) : null}

        <PointStack pins={record.pins} />

        {phase === "ended" && steps.length ? (
          <div className="mt-8 border-t border-white/10 pt-5">
            <div className="font-container mb-2.5 text-[10px] uppercase tracking-[0.1em] text-white/35">
              Read any of this properly
            </div>
            <div className="flex flex-col gap-1.5">
              {steps.map((s) => (
                <Link
                  key={s.id}
                  href={s.path}
                  className="font-container flex items-center justify-between rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-[13px] font-medium text-white/80 transition hover:bg-white/[0.12]"
                >
                  {s.title}
                  <HugeIcon name="chevron-right" size={15} style={{ color: "rgba(255,255,255,0.4)" }} />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* ---- notes ---- */}
      {notesOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[560px] px-4 pb-4">
          <div className="rounded-3xl bg-[#101512] p-4 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-container text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
                Your notes
              </span>
              <button
                type="button"
                onClick={() => setNotesOpen(false)}
                className="font-container text-[12px] font-medium text-white/50 hover:text-white/80"
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
              className="font-container w-full resize-none rounded-2xl bg-white/[0.06] p-3.5 text-[14px] leading-relaxed text-white/90 outline-none ring-1 ring-white/10 placeholder:text-white/25 focus:ring-white/25"
            />
          </div>
        </div>
      ) : null}

      {/* ---- the three buttons ---- */}
      {!notesOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-center gap-5 pb-9 pt-6">
          {phase === "live" ? (
            <>
              <RoundButton onClick={toggleMute} label={muted ? "Unmute" : "Mute"} tone="dim">
                <HugeIcon
                  name={muted ? "microphone-off" : "microphone"}
                  size={19}
                  style={{ color: muted ? "#ff8f8f" : "#fff" }}
                />
              </RoundButton>
              <RoundButton onClick={finish} label="End the session" tone="end" big>
                <HugeIcon name="telephone-off" size={22} style={{ color: "#fff" }} />
              </RoundButton>
              <RoundButton onClick={() => setNotesOpen(true)} label="Write a note" tone="dim">
                <HugeIcon name="pencil" size={18} style={{ color: "#fff" }} />
              </RoundButton>
            </>
          ) : (
            <button
              type="button"
              onClick={phase === "ended" ? () => setPhase("idle") : begin}
              disabled={phase === "connecting"}
              className="font-container rounded-full bg-[#3ecf8e] px-8 py-3.5 text-[15px] font-semibold text-[#06281b] shadow-[0_12px_40px_-12px_rgba(62,207,142,0.7)] transition hover:brightness-105 disabled:opacity-60"
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

      <style>{`
        .call-surface {
          background:
            radial-gradient(90% 60% at 50% 8%, #16281f 0%, rgba(22,40,31,0) 62%),
            radial-gradient(70% 50% at 50% 100%, #10241a 0%, rgba(16,36,26,0) 70%),
            #0a0d0b;
        }
      `}</style>
    </div>
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
  tone: "dim" | "end";
  big?: boolean;
  children: React.ReactNode;
}) {
  const size = big ? "h-16 w-16" : "h-12 w-12";
  const bg =
    tone === "end"
      ? "bg-[#c8342f] hover:bg-[#d8433e] shadow-[0_12px_34px_-14px_rgba(200,52,47,0.9)]"
      : "bg-white/10 hover:bg-white/20";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid ${size} place-items-center rounded-full transition ${bg}`}
    >
      {children}
    </button>
  );
}
