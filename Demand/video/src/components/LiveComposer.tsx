import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyStack } from "../brand";
import { UI } from "./Overlay";

/* ------------------------------------------------------------------ *
 * The reader's AI composer, rebuilt live so it can actually DO things:
 * type a question a character at a time, light its send button, push the
 * turn up as a bubble, and — in voice mode — drive the glow from a
 * loudness signal, exactly the way RightPanel.tsx drives it from the mic.
 *
 * Built to the real construction in globals.css: a white slab carrying a
 * soft drop shadow plus a hairline ring (a shadow, not a border, so it
 * stays crisp), nested radii, and the voice blobs sitting BEHIND the card
 * with opacity = von * (0.06 + voice * 0.88).
 *
 * The loudness here is synthesised, not recorded — a render has no
 * microphone. It's a speech-shaped envelope: syllable bursts inside
 * phrases, with breaths between them.
 * ------------------------------------------------------------------ */

/** The voice-mode palette from RightPanel.tsx. */
const GLOW = ["168 85 247", "45 212 191", "236 72 153"] as const;

const TAU = Math.PI * 2;

/** Speech-shaped loudness in 0..1. Pure function of time, so it's scrubbable. */
export function speechEnvelope(t: number): number {
  // Phrases of ~2.6s with ~0.55s of breath between them.
  const PHRASE = 2.6;
  const BREATH = 0.55;
  const cycle = PHRASE + BREATH;
  const inCycle = t % cycle;
  if (inCycle > PHRASE) return 0;

  // Ease the phrase in and out so it never starts or stops on a hard edge.
  const edge = 0.18;
  const gate = Math.min(
    1,
    Math.min(inCycle, PHRASE - inCycle) / edge,
  );

  // Syllables at ~4.4Hz, with a slower swell riding over them.
  const syll = Math.abs(Math.sin(TAU * 4.4 * t)) ** 0.65;
  const swell = 0.62 + 0.38 * Math.sin(TAU * 0.9 * t + 1.1);
  const detail = 0.85 + 0.15 * Math.sin(TAU * 11.3 * t);

  return Math.max(0, Math.min(1, gate * syll * swell * detail));
}

const Paperclip: React.FC<{ s: number; color: string }> = ({ s, color }) => (
  <svg width={26 * s} height={26 * s} viewBox="0 0 24 24" fill="none">
    <path
      d="M17.5 8.5 9.7 16.3a2.4 2.4 0 0 0 3.4 3.4l7.4-7.4a4.3 4.3 0 0 0-6.1-6.1l-7.4 7.4a6.2 6.2 0 0 0 8.8 8.8"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(-1.5 -2.2)"
    />
  </svg>
);

const MicGlyph: React.FC<{ s: number; color: string; solid?: boolean }> = ({
  s,
  color,
  solid,
}) => (
  <svg width={26 * s} height={26 * s} viewBox="0 0 24 24" fill="none">
    <rect
      x={9}
      y={3}
      width={6}
      height={11}
      rx={3}
      fill={solid ? color : "none"}
      stroke={color}
      strokeWidth={1.7}
    />
    <path
      d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
    />
  </svg>
);

const SendGlyph: React.FC<{ s: number; active: boolean }> = ({ s, active }) => (
  <svg width={30 * s} height={30 * s} viewBox="0 0 24 24" fill="none">
    <circle cx={12} cy={12} r={10} fill={active ? UI.ink : "none"} stroke={active ? UI.ink : "#9a9aa2"} strokeWidth={1.6} />
    <path
      d="M12 16.5v-9M8 11l4-3.5 4 3.5"
      stroke={active ? "#fff" : "#9a9aa2"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type ComposerMode =
  | { kind: "typing"; text: string; startAt: number; cps?: number; sendAt?: number }
  | { kind: "voice"; startAt: number };

export const LiveComposer: React.FC<{
  width: number;
  /** visual scale; 1 = the app's own pixel sizes */
  s?: number;
  mode: ComposerMode;
}> = ({ width, s = 1, mode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typing = mode.kind === "typing" ? mode : null;
  const voice = mode.kind === "voice" ? mode : null;

  /* ---- typing ---- */
  const cps = typing?.cps ?? 21;
  const typedCount = typing
    ? Math.max(0, Math.floor(((frame - typing.startAt) / fps) * cps))
    : 0;
  const typed = typing ? typing.text.slice(0, typedCount) : "";
  const doneTyping = typing ? typedCount >= typing.text.length : false;
  const caretOn = Math.floor(frame / (fps * 0.5)) % 2 === 0;

  /* Never let `sendAt` be Infinity: spring() rejects a non-finite frame, and
   * the springs below are evaluated even when this beat never sends. */
  const hasSend = typing?.sendAt !== undefined;
  const sendAt = typing?.sendAt ?? 0;
  const sent = hasSend && frame >= sendAt;
  const sendPress = spring({
    frame: hasSend ? frame - sendAt : -1,
    fps,
    config: { damping: 12, mass: 0.3, stiffness: 200 },
  });

  /* The turn, once sent, rises above the card as a bubble — which is what the
   * app really does today: it echoes your message. It does NOT answer; there
   * is no backend yet. */
  const bubble = spring({
    frame: hasSend ? frame - sendAt - 3 : -1,
    fps,
    config: { damping: 200, mass: 0.8 },
  });

  /* ---- voice ---- */
  const von = voice ? spring({ frame: frame - voice.startAt, fps, config: { damping: 200 } }) : 0;
  const level = voice ? speechEnvelope(Math.max(0, (frame - voice.startAt) / fps)) : 0;
  /* Same curve as the CSS: an idle floor plus a loudness-driven climb. */
  const glowOpacity = von * (0.06 + level * 0.88);

  const placeholder = "Ask about this step...";
  const showPlaceholder = !typed && !sent;

  const radius = 24 * s;
  const pad = 18 * s;

  return (
    <div style={{ position: "relative", width }}>
      {/* Sent turn, above the card */}
      {typing && sent ? (
        <div
          style={{
            position: "absolute",
            bottom: `calc(100% + ${22 * s}px)`,
            right: 0,
            maxWidth: width * 0.86,
            opacity: bubble,
            transform: `translateY(${interpolate(bubble, [0, 1], [26, 0])}px)`,
            background: UI.ink,
            color: "#fff",
            borderRadius: `${20 * s}px ${20 * s}px ${6 * s}px ${20 * s}px`,
            padding: `${16 * s}px ${20 * s}px`,
            fontFamily: bodyStack,
            fontSize: 24 * s,
            lineHeight: 1.35,
            textAlign: "left",
          }}
        >
          {typing.text}
        </div>
      ) : null}

      {/* Voice glow — behind the card, clipped upward like .voice-glow */}
      {voice ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            filter: `blur(${24 * s}px)`,
          }}
        >
          {GLOW.map((c, i) => {
            const spread = [
              { left: "-8%", bottom: "-30%", width: "56%", height: "170%" },
              { right: "-8%", bottom: "-30%", width: "56%", height: "170%" },
              { left: "22%", top: "-45%", width: "58%", height: "170%" },
            ][i];
            return (
              <span
                key={c}
                style={{
                  position: "absolute",
                  ...spread,
                  borderRadius: "50%",
                  opacity: glowOpacity,
                  transform: `scale(${1 + level * 0.22})`,
                  background: `radial-gradient(closest-side, rgb(${c}) 0%, rgb(${c} / 0) 100%)`,
                }}
              />
            );
          })}
        </div>
      ) : null}

      {/* The card */}
      <div
        style={{
          position: "relative",
          background: voice ? "rgba(255,255,255,0.72)" : "#fff",
          backdropFilter: voice ? `blur(${10 * s}px)` : undefined,
          borderRadius: radius,
          padding: `${pad}px ${pad}px ${pad * 0.72}px`,
          boxShadow: [
            `0 0 0 ${1 * s}px rgba(0,0,0,${voice ? 0.1 : 0.07})`,
            `0 ${10 * s}px ${28 * s}px rgba(40,48,70,0.10)`,
          ].join(", "),
        }}
      >
        <div
          style={{
            fontFamily: bodyStack,
            fontSize: 27 * s,
            lineHeight: 1.35,
            color: showPlaceholder ? "#9a9aa2" : UI.ink,
            minHeight: 27 * s * 1.35,
            textAlign: "left",
          }}
        >
          {showPlaceholder ? placeholder : sent ? placeholder : typed}
          {typing && !sent && !doneTyping ? (
            <span style={{ opacity: caretOn ? 1 : 0 }}>|</span>
          ) : null}
          {typing && !sent && doneTyping ? (
            <span style={{ opacity: caretOn ? 1 : 0 }}>|</span>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 16 * s,
          }}
        >
          <Paperclip s={s} color="#6f6f78" />
          <div style={{ display: "flex", alignItems: "center", gap: 18 * s }}>
            <div
              style={{
                transform: voice ? `scale(${1 + level * 0.16})` : undefined,
              }}
            >
              <MicGlyph s={s} color={voice ? UI.ink : "#6f6f78"} solid={!!voice} />
            </div>
            <div
              style={{
                transform: `scale(${1 - Math.min(0.14, sendPress * 0.14)})`,
              }}
            >
              <SendGlyph s={s} active={!!typed && !sent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
