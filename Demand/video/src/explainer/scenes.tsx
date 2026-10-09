import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { triggers, type TimedBeat } from "./align";
import { Cursor, Ink, K, Paper, PenLine, PenLoop, Sparkle, sat } from "./look";
import { Pixel, pixelSize } from "./pixels";

/* The animation beats. Each scene is a pure function of (frame, beat): every
 * element's entrance is keyed to the frame a word is spoken, via triggers().
 * No scene owns a duration — the voice does. */

export type SceneProps = { frame: number; beat: TimedBeat };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const overshoot = Easing.bezier(0.34, 1.56, 0.64, 1);

/* How far into an entrance we are: 0 before the trigger, 1 after `len`. */
const pop = (frame: number, at: number, len = 7, ease = overshoot) =>
  interpolate(frame, [at - 1, at - 1 + len], [0, 1], { ...clamp, easing: ease });

/* An entrance: scale down from big, blur clears, opacity snaps. The "smear"
 * of the launch-film look, without drawing smear frames by hand. */
const landStyle = (p: number, from = 1.45): React.CSSProperties => ({
  opacity: p > 0 ? 1 : 0,
  transform: `scale(${from + (1 - from) * p})`,
  filter: p < 1 ? `blur(${(1 - Math.min(p, 1)) * 14}px)` : undefined,
});

/* The line being said, typed out small at the top as it's spoken — the
 * subtitle and the texture at once. Lowercase, block cursor. */
export const Typed: React.FC<{ frame: number; beat: TimedBeat; color: string; top?: number }> = ({
  frame,
  beat,
  color,
  top = 330,
}) => {
  // only the phrase being said — from the last sentence break, at most ~14
  // words — so a long beat never piles up into a paragraph over the scene
  const said = beat.words.filter((w) => frame >= w.f - 1);
  let from = 0;
  said.forEach((w, i) => {
    if (i < said.length - 1 && /[.?!]$/.test(w.text)) from = i + 1;
  });
  if (said.length - from > 14) from = said.length - 14;
  const shown = said.slice(from);
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 210,
        top,
        fontFamily: sat,
        fontWeight: 500,
        fontSize: 38,
        lineHeight: 1.3,
        color,
        letterSpacing: -0.2,
      }}
    >
      {shown.map((w) => w.text.toLowerCase()).join(" ")}
      <Cursor frame={frame} color={color} h={38} />
    </div>
  );
};

/* Small pixel objects drifting at the edges, slightly out of focus — depth, and
 * the "things" register of the look, without competing with the maths. */
const Drifters: React.FC<{ frame: number; items: { name: string; x: number; y: number; px: number }[] }> = ({
  frame,
  items,
}) => (
  <>
    {items.map((it, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: it.x + Math.sin(frame / (28 + i * 5) + i) * 14,
          top: it.y + Math.cos(frame / (33 + i * 4) + i * 2) * 12,
          transform: `rotate(${Math.sin(frame / 40 + i) * 8}deg)`,
          filter: i % 2 ? "blur(1.5px)" : undefined,
          opacity: 0.92,
        }}
      >
        <Pixel name={it.name} px={it.px} />
      </div>
    ))}
  </>
);

/* ================================================================ formula
 * PV = FV / (1 + r)^n, built term by term as it's said, then r and n get
 * circled in red pen with their meaning written beside. */
type FormulaBeat = { terms: { id: string; on: string }[]; defs: { id: string; on: string; label: string }[] };

export const FormulaScene: React.FC<SceneProps> = ({ frame, beat }) => {
  const b = beat as unknown as TimedBeat & FormulaBeat;
  const ts = triggers(beat, [...b.terms.map((t) => t.on), ...b.defs.map((d) => d.on)]);
  const at: Record<string, number> = {};
  b.terms.forEach((t, i) => (at[t.id] = ts[i]));
  b.defs.forEach((d, i) => (at[`def-${d.id}`] = ts[b.terms.length + i]));

  const P = (id: string) => pop(frame, at[id]);
  const FS = 132;
  const term = (id: string, child: React.ReactNode, extra?: React.CSSProperties) => (
    <span style={{ display: "inline-block", lineHeight: 1.1, ...landStyle(P(id)), ...extra }}>{child}</span>
  );
  const defP = (id: string) => interpolate(frame, [at[`def-${id}`] - 2, at[`def-${id}`] + 10], [0, 1], clamp);

  return (
    <Paper>
      <Drifters
        frame={frame}
        items={[
          { name: "coin", x: 120, y: 560, px: 6 },
          { name: "hourglass", x: 760, y: 520, px: 6 },
          { name: "note", x: 640, y: 1500, px: 5 },
          { name: "calculator", x: 140, y: 1480, px: 5 },
        ]}
      />
      <Typed frame={frame} beat={beat} color={K.ink} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 760,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 34,
          fontFamily: sat,
          fontWeight: 700,
          fontSize: FS,
          color: K.ink,
          letterSpacing: -3,
          paddingRight: 60,
        }}
      >
        {term("pv", "PV")}
        {term("eq", "=")}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
          {term("fv", "FV")}
          <div style={{ position: "relative", width: 430, height: 28 }}>
            <PenLine x1={6} y1={14} x2={424} y2={12} progress={interpolate(frame, [at.bar - 1, at.bar + 7], [0, 1], clamp)} bow={6} width={9} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {term(
              "base",
              <span style={{ display: "inline-flex", alignItems: "baseline" }}>
                (1 +<span style={{ position: "relative", fontStyle: "italic", fontWeight: 400, margin: "0 8px 0 30px" }}>
                  r
                  <PenLoop rx={48} ry={62} progress={defP("r")} seed={2} />
                </span>)
              </span>,
            )}
            {term(
              "exp",
              <span style={{ position: "relative", fontSize: FS * 0.55, lineHeight: 1, fontStyle: "italic", fontWeight: 400, marginLeft: 6, display: "inline-block" }}>
                n
                <PenLoop rx={36} ry={44} progress={defP("n")} seed={5} />
              </span>,
              { lineHeight: 1, alignSelf: "flex-start", marginTop: -14 },
            )}
          </div>
        </div>
      </div>
      {/* the legend, written in as each symbol is explained */}
      <div style={{ position: "absolute", left: 150, top: 1230, fontFamily: sat, color: K.red, fontSize: 46, lineHeight: 1.45 }}>
        {b.defs.map((d) => {
          const p = defP(d.id);
          return (
            <div key={d.id} style={{ opacity: p, transform: `translateX(${(1 - p) * -18}px)` }}>
              <span style={{ fontStyle: "italic" }}>{d.id}</span>
              <span style={{ fontWeight: 500 }}> — {d.label}</span>
            </div>
          );
        })}
      </div>
    </Paper>
  );
};

/* ================================================================ calc
 * The worked example on ink: K100, ÷ 1.10, and the answer counting down to
 * K90.91 with a red hit behind it. A spinning pixel coin above. */
type CalcBeat = { steps: { text: string; on: string; result?: boolean }[] };

export const CalcScene: React.FC<SceneProps> = ({ frame, beat }) => {
  const b = beat as unknown as TimedBeat & CalcBeat;
  const ts = triggers(beat, b.steps.map((s) => s.on));
  const spin = Math.abs(Math.cos(frame / 9));

  return (
    <Ink>
      <Typed frame={frame} beat={beat} color="rgba(246,244,238,0.6)" />
      <div style={{ position: "absolute", left: 540 - 112 - 60, top: 560, transform: `scaleX(${0.15 + spin * 0.85})` }}>
        <Pixel name="coin" px={14} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 120,
          top: 900,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: sat,
          fontWeight: 700,
          color: K.white,
          gap: 8,
        }}
      >
        {b.steps.map((s, i) => {
          const p = pop(frame, ts[i]);
          if (!s.result) {
            return (
              <div key={i} style={{ fontSize: i === 0 ? 120 : 92, opacity: i === 0 ? 1 : 0.82, letterSpacing: -2, ...landStyle(p) }}>
                {s.text}
              </div>
            );
          }
          // count down from the starting amount to the answer over 12 frames
          const target = parseFloat(s.text.replace(/[^0-9.]/g, ""));
          const k = interpolate(frame, [ts[i], ts[i] + 12], [0, 1], { ...clamp, easing: out });
          const v = 100 + (target - 100) * k;
          const burst = interpolate(frame, [ts[i] - 1, ts[i] + 3, ts[i] + 14], [0, 1.15, 0.85], clamp);
          return (
            <div key={i} style={{ position: "relative", marginTop: 40, ...landStyle(p, 1.25) }}>
              <Sparkle
                size={420}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  marginLeft: -210,
                  marginTop: -210,
                  transform: `scale(${burst}) rotate(${frame * 0.6}deg)`,
                  opacity: 0.95,
                }}
              />
              <div style={{ position: "relative", fontSize: 150, letterSpacing: -4, color: K.white }}>
                = K{v.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </Ink>
  );
};

/* ================================================================ bars
 * Discounting over time as a pixel bar chart: the same K100, worth less each
 * year it is pushed out. The gap gets measured in red pen at the end. */
type BarsBeat = { bars: { label: string; value: number; on: string | null }[] };

export const BarsScene: React.FC<SceneProps> = ({ frame, beat }) => {
  const b = beat as unknown as TimedBeat & BarsBeat;
  const ts = triggers(beat, b.bars.map((x) => x.on));
  const BASE = 1330;
  const MAXH = 640;
  const BLOCK = 20;
  const X0 = 130;
  const W = 130;
  const GAP = 52;
  const lastT = beat.words.at(-1)!.f;
  const newest = ts.reduce((acc, t, i) => (frame >= t - 1 ? i : acc), 0);

  return (
    <Paper>
      <Typed frame={frame} beat={beat} color={K.ink} />
      {/* the K100 line, dashed, so every bar is read against today */}
      <div
        style={{
          position: "absolute",
          left: X0 - 20,
          width: 4 * (W + GAP),
          top: BASE - MAXH,
          borderTop: `3px dashed ${K.muted}`,
          opacity: interpolate(frame, [beat.at, beat.at + 8], [0, 0.8], clamp),
        }}
      />
      {b.bars.map((bar, i) => {
        // bars without a trigger stagger in at the start of the scene
        const start = bar.on ? ts[i] : beat.at + 2 + i * 4;
        const h = (bar.value / 100) * MAXH;
        const blocks = Math.round(h / BLOCK);
        const grown = Math.floor(interpolate(frame, [start - 1, start + 9], [0, blocks], { ...clamp, easing: out }));
        const x = X0 + i * (W + GAP);
        const color = i === newest && i > 0 ? K.red : K.ink;
        const labelP = interpolate(frame, [start + 6, start + 12], [0, 1], clamp);
        return (
          <React.Fragment key={i}>
            {Array.from({ length: grown }, (_, k) => (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: x,
                  top: BASE - (k + 1) * BLOCK,
                  width: W,
                  height: BLOCK - 3,
                  background: color,
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: x - 30,
                width: W + 60,
                top: BASE - blocks * BLOCK - 64,
                textAlign: "center",
                fontFamily: sat,
                fontWeight: 700,
                fontSize: 38,
                color,
                opacity: labelP,
                letterSpacing: -1,
              }}
            >
              K{bar.value % 1 ? bar.value.toFixed(2) : bar.value}
            </div>
            <div
              style={{
                position: "absolute",
                left: x - 20,
                width: W + 40,
                top: BASE + 22,
                textAlign: "center",
                fontFamily: sat,
                fontWeight: 500,
                fontSize: 32,
                color: K.muted,
                opacity: frame >= start - 1 ? 1 : 0,
              }}
            >
              {bar.label}
            </div>
          </React.Fragment>
        );
      })}
      {/* baseline */}
      <div style={{ position: "absolute", left: X0 - 20, width: 4 * (W + GAP), top: BASE, height: 4, background: K.ink }} />
      {/* the gap, measured: today's K100 minus three years out */}
      {(() => {
        const last = b.bars.at(-1)!;
        const x = X0 + 3 * (W + GAP) + W + 26;
        const yTop = BASE - MAXH;
        const yBot = BASE - Math.round(((last.value / 100) * MAXH) / BLOCK) * BLOCK;
        const p = interpolate(frame, [lastT, lastT + 10], [0, 1], clamp);
        return (
          <>
            <PenLine x1={x} y1={yTop} x2={x} y2={yBot} progress={p} bow={-8} color={K.red} width={6} />
            <div
              style={{
                position: "absolute",
                left: x - 150,
                top: (yTop + yBot) / 2 - 150,
                fontFamily: sat,
                fontWeight: 700,
                fontSize: 40,
                color: K.red,
                opacity: interpolate(frame, [lastT + 6, lastT + 12], [0, 1], clamp),
                transform: "rotate(-4deg)",
              }}
            >
              −K{(100 - last.value).toFixed(2)}
            </div>
          </>
        );
      })()}
    </Paper>
  );
};

/* ================================================================ cards
 * One word per card on ink, each with its object: npv. bonds. loans.
 * Whip between cards; a red sparkle strikes each object as it lands. */
type CardsBeat = { cards: { text: string; on: string; icon: string }[] };

export const CardsScene: React.FC<SceneProps> = ({ frame, beat }) => {
  const b = beat as unknown as TimedBeat & CardsBeat;
  const ts = triggers(beat, b.cards.map((c) => c.on));
  ts[0] = Math.min(ts[0], beat.at + 2);
  let idx = 0;
  ts.forEach((t, i) => frame >= t - 4 && (idx = i));
  const card = b.cards[idx];
  const t = ts[idx];
  const local = frame - (t - 4);
  const x = idx > 0 ? interpolate(local, [0, 6], [700, 0], { ...clamp, easing: out }) : 0;
  const blur = idx > 0 ? interpolate(local, [0, 6], [24, 0], clamp) : 0;
  const typedChars = Math.floor(interpolate(frame, [t, t + 6], [0, card.text.length], clamp));
  const strike = interpolate(local, [2, 6, 14], [0, 1, 0], clamp);

  return (
    <Ink>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${x}px)`, filter: blur ? `blur(${blur}px)` : undefined }}>
        <div style={{ position: "absolute", left: 0, right: 120, top: 640, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            <Pixel name={card.icon} px={17} />
            <Sparkle
              size={340}
              style={{
                position: "absolute",
                right: -150,
                top: -130,
                transform: `scale(${strike}) rotate(${local * 4}deg)`,
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 120,
            top: 1040,
            textAlign: "center",
            fontFamily: sat,
            fontWeight: 700,
            fontSize: 118,
            letterSpacing: -3,
            color: K.white,
          }}
        >
          {card.text.slice(0, typedChars)}
          <Cursor frame={frame} color={K.white} h={118} />
        </div>
      </div>
      {/* speed lines while whipping in */}
      {idx > 0 && local < 8
        ? [220, 540, 900, 1260, 1500].map((y, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: y,
                left: interpolate(local, [0, 8], [1100, -700], clamp) + i * 60,
                width: 520 - i * 50,
                height: 4,
                background: i % 2 ? K.red : "rgba(246,244,238,0.6)",
              }}
            />
          ))
        : null}
    </Ink>
  );
};

/* ================================================================ spell
 * The payoff: the formula lands one symbol per word, and every landing flips
 * the background. The slot the next symbol will take holds an object until it
 * arrives. After the last word, back to paper and the symbols get pen loops.
 * In script.json a token's `icon` is the object standing in ITS slot before it
 * lands. */
type SpellBeat = { tokens: { text: string; on: string; icon: string | null }[] };
const FLIP = [K.white, K.ink, K.red, K.ink, K.paper];

export const SpellScene: React.FC<SceneProps> = ({ frame, beat }) => {
  const b = beat as unknown as TimedBeat & SpellBeat;
  const ts = triggers(beat, b.tokens.map((t) => t.on));
  const landed = ts.filter((t) => frame >= t - 1).length; // 0..n
  const done = landed === b.tokens.length && frame >= ts.at(-1)! + 10;
  const bg = done ? K.paper : landed === 0 ? K.ink : FLIP[(landed - 1) % FLIP.length];
  const dark = bg === K.ink;
  const fg = done ? K.ink : bg === K.red ? K.paper : dark ? K.white : K.ink;

  // slot centres across the safe width (90..870), weighted by token width
  const widths = b.tokens.map((t) => Math.max(1, t.text.length) * 0.9 + 0.6);
  const total = widths.reduce((a, c) => a + c, 0);
  let acc = 0;
  const slotPx = widths.map((w) => (w / total) * 780);
  const xs = widths.map((w) => {
    const c = 90 + ((acc + w / 2) / total) * 780;
    acc += w;
    return c;
  });

  return (
    <AbsoluteFill style={{ background: bg }}>
      {b.tokens.map((tok, i) => {
        if (i >= landed) {
          // a token's object holds its slot until the token lands — only the
          // next slot, so the screen is never empty and never cluttered
          if (i === landed && b.tokens[i].icon) {
            const ic = b.tokens[i].icon!;
            return (
              <div key={i} style={{ position: "absolute", left: xs[i], top: 960, transform: "translate(-50%, -50%)" }}>
                {/* sized to its slot, so a wide object can't sit on the
                    symbol beside it */}
                <Pixel name={ic} px={Math.max(3, Math.min(7, Math.floor((slotPx[i] * 0.85) / pixelSize(ic).w)))} />
              </div>
            );
          }
          return null;
        }
        const p = pop(frame, ts[i], 5);
        const wobble = done ? Math.sin(frame / 9 + i * 1.3) * 6 : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: xs[i],
              top: 960 + wobble,
              transform: `translate(-50%, -50%) rotate(${done ? (i % 2 ? 6 : -5) : 0}deg)`,
            }}
          >
            <div
              style={{
                position: "relative",
                fontFamily: sat,
                fontWeight: 700,
                fontSize: 96,
                color: fg,
                letterSpacing: -2,
                whiteSpace: "nowrap",
                ...landStyle(p, 1.6),
              }}
            >
              {tok.text}
              {done ? (
                <PenLoop
                  rx={tok.text.length * 22 + 26}
                  ry={58}
                  seed={i + 3}
                  progress={interpolate(frame, [ts.at(-1)! + 10 + i * 2, ts.at(-1)! + 20 + i * 2], [0, 1], clamp)}
                  width={4}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC<SceneProps>> = {
  formula: FormulaScene,
  calc: CalcScene,
  bars: BarsScene,
  cards: CardsScene,
  spell: SpellScene,
};
