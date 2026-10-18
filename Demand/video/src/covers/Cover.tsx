import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain, Ink, K, Paper, Vignette, sat, serif } from "../explainer/look";

/* A lesson's cover is a frame of its own video: the explainer look (paper or
 * ink, Satoshi + one Instrument Serif word, red as the one accent) with the
 * lesson's idea drawn as the diagram the video animates. Rendered as a still
 * per lesson — `npm run covers` — until real renders replace them with an
 * actual frame of each video. */

export type CoverKind =
  | "budget"
  | "costs"
  | "breakeven"
  | "supply"
  | "customer"
  | "averages"
  | "elasticity"
  | "markets"
  | "price"
  | "cashflow";

export type CoverProps = {
  kind: CoverKind;
  eyebrow: string; // "budgets · lesson 1"
  lead: string; // sans part of the headline
  word: string; // the serif word
  world: "paper" | "ink";
};

export const COVER_W = 1600;
export const COVER_H = 1000;

const Diagram: React.FC<{ kind: CoverKind; fg: string; soft: string }> = ({ kind, fg, soft }) => {
  const R = K.red;
  const t = { fontFamily: sat, fontWeight: 500, fontSize: 26, fill: soft } as const;
  const big = { fontFamily: sat, fontWeight: 700, fontSize: 34, fill: fg } as const;
  switch (kind) {
    case "budget": {
      const parts = [
        ["rent", 3600, fg],
        ["food", 2400, soft],
        ["travel", 1200, soft],
        ["savings", 1800, R],
      ] as const;
      let x = 0;
      return (
        <g>
          <text x={0} y={-40} style={big}>ZMW 9,000</text>
          {parts.map(([label, v, c], i) => {
            const w = (v / 9000) * 760;
            const g = (
              <g key={label}>
                <rect x={x} y={0} width={w - 10} height={150} rx={18} fill={c} opacity={c === soft ? 0.35 + i * 0.12 : 1} />
                <text x={x} y={200} style={t}>{label}</text>
                <text x={x} y={238} style={{ ...t, fill: fg }}>{v.toLocaleString()}</text>
              </g>
            );
            x += w;
            return g;
          })}
        </g>
      );
    }
    case "costs":
      return (
        <g>
          <path d="M0 360 H760" stroke={soft} strokeWidth={3} />
          <path d="M0 0 V360" stroke={soft} strokeWidth={3} />
          <path d="M0 230 H760" stroke={fg} strokeWidth={8} strokeLinecap="round" />
          <path d="M0 230 L760 20" stroke={R} strokeWidth={8} strokeLinecap="round" />
          <text x={560} y={268} style={t}>fixed · rent</text>
          <text x={560} y={60} style={{ ...t, fill: R }}>variable · flour</text>
          <text x={0} y={410} style={t}>loaves baked →</text>
        </g>
      );
    case "breakeven":
      return (
        <g>
          <path d="M0 380 H760 M0 0 V380" stroke={soft} strokeWidth={3} />
          <path d="M0 380 L760 20" stroke={fg} strokeWidth={8} strokeLinecap="round" />
          <path d="M0 220 L760 110" stroke={soft} strokeWidth={8} strokeLinecap="round" />
          <circle cx={398} cy={191} r={22} fill={R} />
          <circle cx={398} cy={191} r={48} fill="none" stroke={R} strokeWidth={3} opacity={0.5} />
          <path d="M398 191 V380" stroke={R} strokeWidth={3} strokeDasharray="10 10" />
          <text x={420} y={430} style={{ ...t, fill: R }}>480 loaves</text>
          <text x={600} y={60} style={t}>revenue</text>
          <text x={600} y={170} style={t}>costs</text>
        </g>
      );
    case "supply":
      return (
        <g>
          <path d="M0 380 H760 M0 0 V380" stroke={soft} strokeWidth={3} />
          <path d="M40 340 C 300 300, 520 160, 740 30" stroke={fg} strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d="M40 40 C 300 90, 520 240, 740 350" stroke={R} strokeWidth={8} fill="none" strokeLinecap="round" />
          <circle cx={392} cy={192} r={18} fill={fg} />
          <text x={650} y={20} style={t}>supply</text>
          <text x={640} y={400} style={{ ...t, fill: R }}>demand</text>
          <text x={0} y={440} style={t}>tomatoes, December</text>
        </g>
      );
    case "customer":
      return (
        <g transform="translate(380 200)">
          {[200, 140, 80].map((r, i) => (
            <circle key={r} r={r} fill="none" stroke={soft} strokeWidth={3} opacity={0.4 + i * 0.25} />
          ))}
          {Array.from({ length: 22 }).map((_, i) => {
            const a = (i / 22) * Math.PI * 2;
            const r = 110 + (i % 3) * 45;
            return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={10} fill={soft} opacity={0.6} />;
          })}
          <circle r={30} fill={R} />
          <text x={-110} y={270} style={t}>the one who buys</text>
        </g>
      );
    case "averages": {
      const hs = [120, 180, 150, 360, 140, 170];
      const mean = hs.reduce((a, b) => a + b, 0) / hs.length;
      return (
        <g>
          {hs.map((h, i) => (
            <rect key={i} x={i * 128} y={380 - h} width={96} height={h} rx={14} fill={h > 300 ? R : fg} opacity={h > 300 ? 1 : 0.85} />
          ))}
          <path d={`M-20 ${380 - mean} H780`} stroke={soft} strokeWidth={4} strokeDasharray="14 12" />
          <text x={600} y={380 - mean - 18} style={t}>mean</text>
          <text x={0} y={430} style={t}>one big week moves the line</text>
        </g>
      );
    }
    case "elasticity":
      return (
        <g>
          <path d="M0 380 H760 M0 0 V380" stroke={soft} strokeWidth={3} />
          <path d="M120 20 L220 360" stroke={fg} strokeWidth={8} strokeLinecap="round" />
          <path d="M60 140 L740 260" stroke={R} strokeWidth={8} strokeLinecap="round" />
          <text x={240} y={60} style={t}>salt · steep</text>
          <text x={560} y={220} style={{ ...t, fill: R }}>soft drinks · flat</text>
          <text x={0} y={430} style={t}>same price rise, different answer</text>
        </g>
      );
    case "markets":
      return (
        <g>
          <rect x={0} y={60} width={300} height={320} rx={22} fill={R} />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={340 + (i % 4) * 106} y={140 + Math.floor(i / 4) * 84} width={86} height={64} rx={12} fill={fg} opacity={0.75 - (i % 3) * 0.15} />
          ))}
          <text x={0} y={430} style={t}>one supermarket</text>
          <text x={340} y={430} style={t}>many stalls</text>
        </g>
      );
    case "price":
      return (
        <g transform="translate(120 20) rotate(-8)">
          <path d="M0 60 L60 0 H520 Q540 0 540 20 V320 Q540 340 520 340 H60 L0 280 Z" fill={K.white} stroke={fg} strokeWidth={4} />
          <circle cx={58} cy={170} r={18} fill="none" stroke={fg} strokeWidth={4} />
          <text x={120} y={150} style={{ ...t, fontSize: 30, fill: K.muted }}>one loaf</text>
          <text x={120} y={260} style={{ fontFamily: sat, fontWeight: 700, fontSize: 112, fill: K.ink, letterSpacing: "-0.03em" }}>ZMW 25</text>
          <ellipse cx={330} cy={225} rx={260} ry={95} fill="none" stroke={R} strokeWidth={6} />
        </g>
      );
    case "cashflow": {
      const ins = [180, 140, 220, 160, 240, 200];
      const outs = [150, 190, 120, 210, 130, 140];
      let run = 0;
      const pts = ins.map((v, i) => {
        run += v - outs[i];
        return `${i * 128 + 48},${200 - run * 0.9}`;
      });
      return (
        <g>
          <path d="M-20 200 H780" stroke={soft} strokeWidth={3} />
          {ins.map((v, i) => (
            <g key={i}>
              <rect x={i * 128 + 20} y={200 - v * 0.8} width={56} height={v * 0.8} rx={10} fill={fg} opacity={0.85} />
              <rect x={i * 128 + 20} y={204} width={56} height={outs[i] * 0.8} rx={10} fill={soft} opacity={0.45} />
            </g>
          ))}
          <polyline points={pts.join(" ")} fill="none" stroke={R} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          <text x={0} y={440} style={t}>money in · money out · what is left</text>
        </g>
      );
    }
  }
};

export const Cover: React.FC<CoverProps> = ({ kind, eyebrow, lead, word, world }) => {
  const ink = world === "ink";
  const fg = ink ? K.white : K.ink;
  const soft = ink ? "#8C8880" : "#8C8880";
  const World = ink ? Ink : Paper;
  return (
    <AbsoluteFill>
      <World />
      <AbsoluteFill style={{ padding: "84px 96px", display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: sat, fontWeight: 500, fontSize: 30, color: soft, letterSpacing: "0.01em" }}>{eyebrow}</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: sat, fontWeight: 700, fontSize: 112, lineHeight: "104px", letterSpacing: "-0.04em", color: fg, maxWidth: 760 }}>
          {lead}{" "}
          <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, color: K.red, letterSpacing: "-0.02em" }}>{word}</span>
        </div>
      </AbsoluteFill>
      <svg width={COVER_W} height={COVER_H} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(760 250)">
          <Diagram kind={kind} fg={fg} soft={soft} />
        </g>
      </svg>
      <Vignette strength={ink ? 0.42 : 0.18} />
      <Grain frame={7} opacity={ink ? 0.14 : 0.1} />
    </AbsoluteFill>
  );
};
