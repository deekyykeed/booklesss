import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import type { TimedBeat } from "./align";
import { K, sat } from "./look";

/* The presenter — you, on camera, full screen. Never split-screen.
 *
 * With `footage` set, this is your recording, playing at the COMPOSITION's
 * time (no Sequence offset), so picture and voice can't drift: the video is
 * one continuous take and the edit only chooses when it is visible.
 *
 * Without it, a stand-in: a lit head-and-shoulders silhouette in a dark room,
 * framed the way the real shot should be framed (head in the upper third, eyes
 * around y=640, shoulders out of frame at the bottom). It is lit brighter than
 * its background on purpose — that is what the thermal transition needs from
 * the real footage too.
 *
 * `heat` 0..1 crossfades to the thermal gradient-mapped version of the same
 * picture. Both copies render from the same source, so the heat-map lines up
 * with you pixel for pixel. */

export const Presenter: React.FC<{
  frame: number;
  beat: TimedBeat;
  heat: number;
  footage?: string | null;
}> = ({ frame, beat, heat, footage }) => {
  const talking = beat.words.some((w) => frame >= w.f && frame <= w.fEnd + 2);
  const picture = footage ? (
    <OffthreadVideo
      src={staticFile(footage)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  ) : (
    <StandIn frame={frame} talking={talking} />
  );

  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <AbsoluteFill style={{ opacity: 1 - heat }}>{picture}</AbsoluteFill>
      {heat > 0.001 ? <AbsoluteFill style={{ opacity: heat, filter: "url(#thermal)" }}>{picture}</AbsoluteFill> : null}
      {footage ? null : <PlaceholderTag frame={frame} talking={talking} fade={1 - heat} />}
      <Captions frame={frame} beat={beat} fade={1 - heat} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- stand-in */

const StandIn: React.FC<{ frame: number; talking: boolean }> = ({ frame, talking }) => {
  // breathing + a small nod while speaking, so the shot isn't a still
  const breathe = Math.sin(frame / 22) * 3;
  const nod = talking ? Math.sin(frame / 3.2) * 2.2 : 0;
  const sway = Math.sin(frame / 37) * 6;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 70% 55% at 30% 30%, #4A423B 0%, #2B2622 45%, #151210 100%)",
      }}
    >
      {/* key light spill on the back wall */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 75% 25%, rgba(255,220,180,0.10), transparent 40%)",
        }}
      />
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="skin" cx="38%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#B9AA9A" />
            <stop offset="55%" stopColor="#8C7E71" />
            <stop offset="100%" stopColor="#5A5048" />
          </radialGradient>
          <linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6E665E" />
            <stop offset="100%" stopColor="#3A3530" />
          </linearGradient>
        </defs>
        <g transform={`translate(${sway} ${breathe})`}>
          {/* shoulders + chest, off the bottom of frame */}
          <path
            d="M120,1920 C140,1560 300,1430 430,1395 L650,1395 C780,1430 940,1560 960,1920 Z"
            fill="url(#shirt)"
          />
          {/* neck */}
          <path d="M470,1180 L610,1180 L620,1420 Q540,1450 460,1420 Z" fill="#7A6D62" />
          <g transform={`rotate(${nod} 540 1100)`}>
            {/* head */}
            <ellipse cx={540} cy={860} rx={215} ry={270} fill="url(#skin)" />
            {/* hair mass */}
            <path
              d="M320,820 C300,600 420,540 540,545 C680,545 790,610 765,820 C740,700 650,660 540,665 C440,668 350,700 320,820 Z"
              fill="#2A231E"
            />
            {/* ears */}
            <ellipse cx={327} cy={890} rx={28} ry={55} fill="#7E7064" />
            <ellipse cx={753} cy={890} rx={28} ry={55} fill="#7E7064" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* "This is where you go" — so nobody reviewing the placeholder cut mistakes
 * the silhouette for a design choice. */
const PlaceholderTag: React.FC<{ frame: number; talking: boolean; fade: number }> = ({
  frame,
  talking,
  fade,
}) => (
  <div
    style={{
      position: "absolute",
      left: 90,
      top: 320,
      opacity: fade,
      fontFamily: sat,
      color: K.white,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: 2,
        padding: "10px 18px",
        border: `2px solid rgba(246,244,238,0.5)`,
        borderRadius: 999,
        width: "fit-content",
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          background: K.red,
          opacity: Math.floor(frame / 15) % 2 ? 0.35 : 1,
        }}
      />
      YOU · ON CAMERA
      <Meter frame={frame} on={talking} />
    </div>
    <div style={{ fontSize: 24, fontWeight: 500, opacity: 0.6 }}>placeholder — your footage replaces this</div>
  </div>
);

const Meter: React.FC<{ frame: number; on: boolean }> = ({ frame, on }) => (
  <span style={{ display: "inline-flex", gap: 4, alignItems: "flex-end", height: 20 }}>
    {[0, 1, 2, 3].map((i) => {
      const h = on ? 5 + Math.abs(Math.sin(frame / 2.3 + i * 1.7)) * 15 : 4;
      return <span key={i} style={{ width: 4, height: h, background: K.white, borderRadius: 2 }} />;
    })}
  </span>
);

/* ---------------------------------------------------------------- captions */

/* Burned-in captions for the camera beats — most people watch with the sound
 * off. Small, lowercase, word by word as it's said (never ahead of the voice),
 * in chunks of up to four words that break at punctuation. */
const Captions: React.FC<{ frame: number; beat: TimedBeat; fade: number }> = ({ frame, beat, fade }) => {
  const chunks: { start: number; words: typeof beat.words }[] = [];
  let cur: typeof beat.words = [];
  beat.words.forEach((w, i) => {
    cur.push(w);
    const brk = /[.,?!]$/.test(w.text) || cur.length === 4 || i === beat.words.length - 1;
    if (brk) {
      chunks.push({ start: cur[0].f, words: cur });
      cur = [];
    }
  });
  const chunk = [...chunks].reverse().find((c) => frame >= c.start - 2);
  if (!chunk) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 210,
        top: 1330,
        opacity: fade,
        fontFamily: sat,
        fontWeight: 700,
        fontSize: 58,
        lineHeight: 1.15,
        letterSpacing: -0.5,
        color: K.white,
        textShadow: "0 2px 18px rgba(0,0,0,0.55)",
      }}
    >
      {chunk.words.map((w, i) => {
        const shown = frame >= w.f - 1;
        const active = frame >= w.f - 1 && frame <= w.fEnd + 2;
        return (
          <span key={i} style={{ opacity: shown ? (active ? 1 : 0.72) : 0 }}>
            {w.text.toLowerCase().replace(/[.,]$/, "")}{" "}
          </span>
        );
      })}
    </div>
  );
};
