import React from "react";
import { Easing, interpolate } from "remotion";
import { triggers, type TimedBeat } from "./align";
import { Ink, K, Paper, PenLoop, Sparkle, sat } from "./look";
import { Pixel, pixelSize } from "./pixels";
import { Typed, type SceneProps } from "./scenes";

/* Scenes for explaining HOW something works rather than a calculation — first
 * written for the cognition explainer (attention / working memory / executive
 * function), but each is data-driven from script.json, so any subject can use
 * them: a list of parts, a flood through a gate, a spotlight, a workbench,
 * stat meters, a ratio.
 *
 * Same rule as scenes.tsx: no scene owns a duration. Every move is keyed to a
 * word being spoken (`on`), via triggers(). */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const overshoot = Easing.bezier(0.34, 1.56, 0.64, 1);
const pop = (frame: number, at: number, len = 7, ease = overshoot) =>
  interpolate(frame, [at - 1, at - 1 + len], [0, 1], { ...clamp, easing: ease });
const land = (p: number, from = 1.4): React.CSSProperties => ({
  opacity: p > 0 ? 1 : 0,
  transform: `scale(${from + (1 - from) * p})`,
  filter: p < 1 ? `blur(${(1 - Math.min(p, 1)) * 12}px)` : undefined,
});
/* a deterministic 0..1 noise per integer seed, so particles are the same every render */
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const iconPx = (name: string, maxW: number, maxH: number) => {
  const s = pixelSize(name);
  return Math.max(2, Math.floor(Math.min(maxW / s.w, maxH / s.h)));
};

/* Resolve a title and a list of cues INDEPENDENTLY. triggers() searches its
 * list in order, each word after the last — right for a run of cues, wrong for
 * a title: a title on a late word ("level up") made every cue after it search
 * past the end and land on the beat's last word, so bars sat empty for six
 * seconds in the first real render. */
const cue = (beat: TimedBeat, on: string | null | undefined) => (on ? triggers(beat, [on])[0] : beat.at);
const cues = (beat: TimedBeat, ons: (string | null | undefined)[]) => (ons.length ? triggers(beat, ons) : []);

/* ================================================================ trio
 * A thing made of parts: an optional title, then each part lands as it's
 * named — its object on the left, its name on the right.
 *   { "scene": "trio", "title": {"text": "cognition =", "on": "cognition"},
 *     "items": [{"text": "attention", "icon": "eye", "on": "attention"}, …] } */
type Trio = { title?: { text: string; on: string }; items: { text: string; icon: string; on: string }[] };

export const TrioScene: React.FC<SceneProps> = ({ frame, beat }) => {
  const b = beat as unknown as TimedBeat & Trio;
  const ts = [cue(beat, b.title?.on), ...cues(beat, b.items.map((i) => i.on))];
  const titleAt = b.title ? ts[0] : beat.at;
  const rows = b.items.length;
  const top = 620;
  const gap = Math.min(270, 760 / rows);
  return (
    <Paper>
      <Typed frame={frame} beat={beat} color={K.ink} />
      {b.title ? (
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 470,
            fontFamily: sat,
            fontWeight: 700,
            fontSize: 72,
            letterSpacing: -2,
            color: K.ink,
            ...land(pop(frame, titleAt)),
          }}
        >
          {b.title.text}
        </div>
      ) : null}
      {b.items.map((it, i) => {
        const at = ts[i + 1];
        const p = pop(frame, at);
        const px = iconPx(it.icon, 170, 150);
        return (
          <div key={i} style={{ position: "absolute", left: 90, top: top + i * gap, display: "flex", alignItems: "center", gap: 40 }}>
            <div style={{ width: 190, display: "flex", justifyContent: "center", ...land(p, 1.7) }}>
              <Pixel name={it.icon} px={px} />
            </div>
            <div style={{ fontFamily: sat, fontWeight: 700, fontSize: 76, letterSpacing: -2, color: K.ink, opacity: p > 0 ? 1 : 0, transform: `translateX(${(1 - p) * 40}px)` }}>
              {it.text}
              <span style={{ color: K.red }}>.</span>
            </div>
          </div>
        );
      })}
    </Paper>
  );
};

/* ================================================================ flood
 * Too much coming in, a gate letting a slice through. A steady rain of small
 * pixel specks falls on a red gate; named things (`items`) join the rain on
 * their word, bigger and labelled. Almost everything is turned away — only
 * every `pass`-th speck, and none of the named things, makes it through.
 *   { "scene": "flood", "title": {"text": "attention", "on": "attention"},
 *     "items": [{"text": "headset", "icon": "headset", "on": "headsets"}, …] } */
type Flood = { title?: { text: string; on: string }; items: { text: string; icon?: string; on: string }[]; pass?: number };

export const FloodScene: React.FC<SceneProps> = ({ frame, beat }) => {
  const b = beat as unknown as TimedBeat & Flood;
  const ts = [cue(beat, b.title?.on), ...cues(beat, b.items.map((i) => i.on))];
  const t = frame - beat.at;
  const GATE_Y = 1240;
  const GAP_L = 470;
  const GAP_R = 610;
  const pass = b.pass ?? 9;
  const specks: React.ReactNode[] = [];
  // the rain: one speck every 2 frames, 3 seconds to fall
  for (let k = Math.max(0, Math.floor(t / 2) - 45); k <= Math.floor(t / 2); k++) {
    const age = t - k * 2;
    if (age < 0) continue;
    const through = k % pass === 0;
    const x0 = 120 + rnd(k) * 840;
    const y = 300 + age * 12;
    let x = x0;
    let alpha = 1;
    if (y > GATE_Y - 40) {
      if (through) x = x0 + ((GAP_L + GAP_R) / 2 - x0) * Math.min(1, (y - GATE_Y + 260) / 300);
      else {
        const over = y - (GATE_Y - 40);
        x = x0 + (x0 < 540 ? -1 : 1) * over * 1.6;
        alpha = Math.max(0, 1 - over / 120);
      }
    } else if (through) x = x0 + ((GAP_L + GAP_R) / 2 - x0) * Math.max(0, (y - GATE_Y + 260) / 300);
    const yy = through ? y : Math.min(y, GATE_Y - 40);
    if (yy > 1900 || alpha <= 0) continue;
    const c = through ? "#FFE680" : ["#F6F4EE", "#8C8880", "#D7261E", "#3A78C9"][k % 4];
    specks.push(<div key={k} style={{ position: "absolute", left: x, top: yy, width: 14, height: 14, background: c, opacity: alpha * (through ? 1 : 0.8) }} />);
  }
  return (
    <Ink>
      <Typed frame={frame} beat={beat} color="rgba(246,244,238,0.6)" />
      {b.title ? (
        <div style={{ position: "absolute", left: 90, top: 470, fontFamily: sat, fontWeight: 700, fontSize: 80, letterSpacing: -2, color: K.white, ...land(pop(frame, ts[0])) }}>
          {b.title.text}
          <span style={{ color: K.red }}>.</span>
        </div>
      ) : null}
      {specks}
      {/* named things: fall slower, labelled, always turned away at the gate */}
      {b.items.map((it, i) => {
        const at = ts[i + 1];
        const age = frame - at;
        if (age < 0) return null;
        const x0 = 150 + rnd(i + 99) * 560;
        const y = Math.min(GATE_Y - 130, 600 + age * 9);
        const bounced = 600 + age * 9 > GATE_Y - 130;
        const out2 = bounced ? (600 + age * 9 - (GATE_Y - 130)) / 9 : 0;
        const x = x0 + (bounced ? (x0 < 450 ? -1 : 1) * out2 * 14 : 0);
        const alpha = bounced ? Math.max(0, 1 - out2 / 22) : 1;
        if (alpha <= 0) return null;
        return (
          <div key={`n${i}`} style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, opacity: alpha, ...land(pop(frame, at, 5), 1.3) }}>
            {it.icon ? <Pixel name={it.icon} px={iconPx(it.icon, 90, 80)} /> : null}
            <span style={{ fontFamily: sat, fontWeight: 700, fontSize: 46, color: K.white, whiteSpace: "nowrap" }}>{it.text}</span>
          </div>
        );
      })}
      {/* the gate: two red posts, one narrow gap */}
      <div style={{ position: "absolute", left: 0, width: GAP_L, top: GATE_Y, height: 22, background: K.red }} />
      <div style={{ position: "absolute", left: GAP_R, right: 0, top: GATE_Y, height: 22, background: K.red }} />
      <div style={{ position: "absolute", left: GAP_L - 6, top: GATE_Y - 30, width: 12, height: 82, background: K.red }} />
      <div style={{ position: "absolute", left: GAP_R - 6, top: GATE_Y - 30, width: 12, height: 82, background: K.red }} />
    </Ink>
  );
};

/* ================================================================ spotlight
 * Things scattered in the dark; a beam moves to one of them on each `on`. The
 * lit one shows its name and colour, the rest stay grey.
 *   { "scene": "spotlight", "items": [{"text": "…", "icon": "…"}, …],
 *     "moves": [{"to": 2, "on": "spotlight"}, …] } */
type Spot = { items: { text: string; icon: string }[]; moves: { to: number; on: string }[] };
const SPOT_POS = [
  [240, 760],
  [760, 700],
  [520, 1000],
  [220, 1230],
  [780, 1260],
  [500, 1440],
];

export const SpotlightScene: React.FC<SceneProps> = ({ frame, beat }) => {
  const b = beat as unknown as TimedBeat & Spot;
  const ts = triggers(beat, b.moves.map((m) => m.on));
  // where the beam is: glide from target to target, 10 frames each
  let cx = 540;
  let cy = 400;
  let lit = -1;
  b.moves.forEach((m, i) => {
    const [tx, ty] = SPOT_POS[m.to % SPOT_POS.length];
    const k = interpolate(frame, [ts[i] - 2, ts[i] + 9], [0, 1], { ...clamp, easing: out });
    if (k > 0) {
      cx = cx + (tx - cx) * k;
      cy = cy + (ty - cy) * k;
      if (k > 0.7) lit = m.to;
    }
  });
  const on = interpolate(frame, [ts[0] - 4, ts[0] + 4], [0, 1], clamp);
  return (
    <Ink tint="#0B0A0A">
      <Typed frame={frame} beat={beat} color="rgba(246,244,238,0.6)" />
      {/* the beam: a cone from the lamp above, and a pool of light */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: on }}>
        <defs>
          <radialGradient id="pool">
            <stop offset="0%" stopColor="rgba(255,236,170,0.55)" />
            <stop offset="60%" stopColor="rgba(255,236,170,0.18)" />
            <stop offset="100%" stopColor="rgba(255,236,170,0)" />
          </radialGradient>
          <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,236,170,0.35)" />
            <stop offset="100%" stopColor="rgba(255,236,170,0.06)" />
          </linearGradient>
        </defs>
        <path d={`M ${540 - 30} 300 L ${540 + 30} 300 L ${cx + 190} ${cy} L ${cx - 190} ${cy} Z`} fill="url(#cone)" />
        <ellipse cx={cx} cy={cy} rx={230} ry={150} fill="url(#pool)" />
      </svg>
      <div style={{ position: "absolute", left: 540 - 50, top: 220, opacity: on }}>
        <Pixel name="lamp" px={7} style={{ transform: "rotate(90deg)" }} />
      </div>
      {b.items.map((it, i) => {
        const [x, y] = SPOT_POS[i % SPOT_POS.length];
        const isLit = i === lit;
        const px = iconPx(it.icon, 130, 110);
        const s = pixelSize(it.icon);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - (s.w * px) / 2,
              top: y - (s.h * px) / 2,
              filter: isLit ? undefined : "grayscale(1) brightness(0.35)",
              transform: `scale(${isLit ? 1.15 : 1})`,
              transition: "none",
            }}
          >
            <Pixel name={it.icon} px={px} />
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: s.h * px + 14,
                transform: "translateX(-50%)",
                fontFamily: sat,
                fontWeight: 700,
                fontSize: 40,
                color: K.white,
                whiteSpace: "nowrap",
                opacity: isLit ? 1 : 0,
              }}
            >
              {it.text}
            </div>
          </div>
        );
      })}
    </Ink>
  );
};

/* ================================================================ bench
 * A workbench that holds a few things at once. Steps in order, each on its word:
 *   put   an object drops onto the next free slot
 *   work  sparks fly off the newest object
 *   done  it gets a red tick
 *   clear everything slides off the bench
 *   { "scene": "bench", "steps": [{"do": "put", "icon": "book", "on": "put"}, …] } */
type Bench = { steps: { do: "put" | "work" | "done" | "clear"; icon?: string; on: string }[]; label?: string };

export const BenchScene: React.FC<SceneProps> = ({ frame, beat }) => {
  const b = beat as unknown as TimedBeat & Bench;
  const ts = triggers(beat, b.steps.map((s) => s.on));
  const SLOTS = [250, 540, 830];
  const TOP = 1080;
  type Item = { icon: string; slot: number; at: number; doneAt?: number; clearAt?: number };
  const items: Item[] = [];
  let next = 0;
  let workAt = -1;
  b.steps.forEach((s, i) => {
    const at = ts[i];
    if (s.do === "put" && s.icon) items.push({ icon: s.icon, slot: next++ % SLOTS.length, at });
    if (s.do === "work") workAt = at;
    if (s.do === "done" && items.length) items[items.length - 1].doneAt = at;
    if (s.do === "clear") {
      items.forEach((it) => it.clearAt === undefined && (it.clearAt = at));
      next = 0;
    }
  });
  const benchPx = 46;
  const bs = pixelSize("bench");
  return (
    <Paper>
      <Typed frame={frame} beat={beat} color={K.ink} />
      {b.label ? (
        <div style={{ position: "absolute", left: 90, top: 470, fontFamily: sat, fontWeight: 700, fontSize: 72, letterSpacing: -2, color: K.ink, ...land(pop(frame, beat.at + 4)) }}>
          {b.label}
          <span style={{ color: K.red }}>.</span>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 540 - (bs.w * benchPx) / 2, top: TOP + 40 - 3 * benchPx }}>
        <Pixel name="bench" px={benchPx} />
      </div>
      {items.map((it, i) => {
        if (frame < it.at - 1) return null;
        const drop = interpolate(frame, [it.at - 1, it.at + 8], [-700, 0], { ...clamp, easing: Easing.bezier(0.5, 0, 0.75, 0) });
        const bounce = interpolate(frame, [it.at + 8, it.at + 12, it.at + 16], [0, -24, 0], clamp);
        const gone = it.clearAt !== undefined ? interpolate(frame, [it.clearAt + i * 2, it.clearAt + 12 + i * 2], [0, 1200], { ...clamp, easing: Easing.in(Easing.quad) }) : 0;
        const px = iconPx(it.icon, 180, 170);
        const s = pixelSize(it.icon);
        const tick = it.doneAt !== undefined ? interpolate(frame, [it.doneAt, it.doneAt + 6], [0, 1], clamp) : 0;
        const working = workAt > 0 && i === items.filter((x) => x.at <= workAt).length - 1 && frame >= workAt && frame < workAt + 26;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: SLOTS[it.slot] - (s.w * px) / 2 + gone,
              // sits on the bench top: row 3 of the bench drawing
              top: TOP + 40 - s.h * px + drop + bounce,
              transform: `rotate(${gone * 0.03}deg)`,
            }}
          >
            <Pixel name={it.icon} px={px} />
            {working
              ? [0, 1, 2, 3].map((k) => (
                  <Sparkle
                    key={k}
                    size={60}
                    color={k % 2 ? K.red : "#F2C230"}
                    style={{
                      position: "absolute",
                      left: (s.w * px) / 2 + Math.cos(k * 1.7 + frame / 3) * 110 - 30,
                      top: (s.h * px) / 2 + Math.sin(k * 1.7 + frame / 3) * 90 - 30,
                      transform: `scale(${0.5 + 0.5 * Math.abs(Math.sin(frame / 2 + k))})`,
                    }}
                  />
                ))
              : null}
            {tick > 0 ? (
              <svg width={90} height={90} viewBox="0 0 90 90" style={{ position: "absolute", right: -50, top: -50, overflow: "visible" }}>
                <circle cx={45} cy={45} r={40} fill={K.red} transform={`scale(${tick})`} style={{ transformOrigin: "45px 45px" }} />
                <path d="M26,47 L40,60 L66,32" stroke={K.white} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
              </svg>
            ) : null}
          </div>
        );
      })}
    </Paper>
  );
};

/* ================================================================ meters
 * Stat bars, RPG-style. `keys` set every bar's level (0..1) on a word; bars
 * glide between levels, red when low. `sources` appear on their word and, while
 * any bar is rising, throw "+" bonuses into the bars.
 *   { "scene": "meters", "bars": [{"text": "attention", "icon": "eye"}, …],
 *     "keys": [{"on": "attention", "values": [0.15, 0.2, 0.1]}, …],
 *     "sources": [{"text": "hardware", "icon": "chip", "on": "hardware"}] } */
type Meters = {
  title?: { text: string; on: string };
  bars: { text: string; icon: string }[];
  keys: { on: string; values: number[] }[];
  sources?: { text: string; icon: string; on: string }[];
};

export const MetersScene: React.FC<SceneProps> = ({ frame, beat }) => {
  const b = beat as unknown as TimedBeat & Meters;
  const srcs = b.sources ?? [];
  const ts = [cue(beat, b.title?.on), ...cues(beat, b.keys.map((k) => k.on)), ...cues(beat, srcs.map((s) => s.on))];
  const keyAt = b.keys.map((_, i) => ts[1 + i]);
  const srcAt = srcs.map((_, i) => ts[1 + b.keys.length + i]);
  // current level of bar j: glide between consecutive keys over 14 frames
  const level = (j: number, f: number) => {
    let v = 0;
    b.keys.forEach((k, i) => {
      const prev = v;
      const p = interpolate(f, [keyAt[i] - 2, keyAt[i] + 14], [0, 1], { ...clamp, easing: out });
      v = prev + (k.values[j] - prev) * p;
    });
    return v;
  };
  const rising = b.bars.some((_, j) => level(j, frame) - level(j, frame - 3) > 0.004);
  const Y0 = srcs.length ? 860 : 700;
  const ROW = 230;
  const X = 300;
  const W = 520;
  return (
    <Ink>
      <Typed frame={frame} beat={beat} color="rgba(246,244,238,0.6)" />
      {b.title ? (
        <div style={{ position: "absolute", left: 90, top: 470, fontFamily: sat, fontWeight: 700, fontSize: 76, letterSpacing: -2, color: K.white, ...land(pop(frame, ts[0])) }}>
          {b.title.text}
          <span style={{ color: K.red }}>.</span>
        </div>
      ) : null}
      {srcs.map((s, i) => {
        const p = pop(frame, srcAt[i]);
        const x = srcs.length === 1 ? 540 : 300 + i * 480;
        return (
          <div key={i} style={{ position: "absolute", left: x - 110, top: 600, width: 220, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...land(p, 1.6) }}>
            <Pixel name={s.icon} px={iconPx(s.icon, 120, 100)} />
            <span style={{ fontFamily: sat, fontWeight: 700, fontSize: 38, color: K.white }}>{s.text}</span>
          </div>
        );
      })}
      {b.bars.map((bar, j) => {
        const v = level(j, frame);
        const y = Y0 + j * ROW;
        const low = v < 0.3;
        const cells = 10;
        return (
          <React.Fragment key={j}>
            <div style={{ position: "absolute", left: 90, top: y - 6 }}>
              <Pixel name={bar.icon} px={iconPx(bar.icon, 150, 110)} />
            </div>
            <div style={{ position: "absolute", left: X, top: y - 56, fontFamily: sat, fontWeight: 700, fontSize: 40, color: K.white }}>{bar.text}</div>
            <div style={{ position: "absolute", left: X, top: y, width: W, height: 70, border: `4px solid ${K.white}`, display: "flex", gap: 6, padding: 6, boxSizing: "border-box" }}>
              {Array.from({ length: cells }, (_, c) => {
                const fill = Math.max(0, Math.min(1, v * cells - c));
                return (
                  <div key={c} style={{ flex: 1, position: "relative", background: "rgba(246,244,238,0.08)" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: low ? K.red : "#62B04F" }} />
                  </div>
                );
              })}
            </div>
            {/* the + bonuses, thrown in while the bar rises */}
            {rising && srcs.length
              ? [0, 1, 2].map((k) => {
                  const ph = ((frame + k * 7 + j * 5) % 21) / 21;
                  const sx = (srcs.length === 1 ? 540 : 300 + ((k + j) % srcs.length) * 480) + (rnd(k + j * 3) - 0.5) * 60;
                  const ex = X + W * Math.max(0.05, v);
                  return (
                    <div
                      key={k}
                      style={{
                        position: "absolute",
                        left: sx + (ex - sx) * ph,
                        top: 760 + (y + 20 - 760) * ph - Math.sin(ph * Math.PI) * 80,
                        fontFamily: sat,
                        fontWeight: 700,
                        fontSize: 52,
                        color: "#F2C230",
                        opacity: 1 - ph * 0.5,
                      }}
                    >
                      +
                    </div>
                  );
                })
              : null}
          </React.Fragment>
        );
      })}
    </Ink>
  );
};

/* ================================================================ ratio
 * A share of one thing against a share of another, as two 10x10 pixel grids:
 * "2% of the weight" next to "20% of the energy". Each fills on its word; the
 * last one gets a red pen loop on `stress`.
 *   { "scene": "ratio", "icon": "brain",
 *     "parts": [{"label": "body weight", "pct": 2, "on": "2"}, {"label": "energy", "pct": 20, "on": "20"}],
 *     "stress": "disproportionate" } */
type Ratio = { icon?: string; parts: { label: string; pct: number; on: string }[]; stress?: string };

export const RatioScene: React.FC<SceneProps> = ({ frame, beat }) => {
  const b = beat as unknown as TimedBeat & Ratio;
  const ts = [...cues(beat, b.parts.map((p) => p.on)), b.stress ? cue(beat, b.stress) : beat.at];
  const stressAt = b.stress ? ts[b.parts.length] : -1;
  const CELL = 33;
  return (
    <Paper>
      <Typed frame={frame} beat={beat} color={K.ink} />
      {b.icon ? (
        <div style={{ position: "absolute", left: 540 - (pixelSize(b.icon).w * 9) / 2, top: 470, ...land(pop(frame, beat.at + 3), 1.5) }}>
          <Pixel name={b.icon} px={9} />
        </div>
      ) : null}
      {b.parts.map((part, i) => {
        const at = ts[i];
        const p = pop(frame, at);
        const filled = Math.round(interpolate(frame, [at, at + 16], [0, part.pct], clamp));
        const x0 = i === 0 ? 96 : 512;
        const last = i === b.parts.length - 1;
        return (
          <div key={i} style={{ position: "absolute", left: x0, top: 800, width: 10 * CELL + 9 * 4, opacity: p > 0 ? 1 : 0.25 }}>
            <div style={{ position: "relative", fontFamily: sat, fontWeight: 700, fontSize: 150, letterSpacing: -6, color: last ? K.red : K.ink, ...land(p, 1.3) }}>
              {Math.max(1, Math.ceil(interpolate(frame, [at, at + 16], [0, part.pct], clamp)))}%
              {last && stressAt > 0 ? <PenLoop rx={150} ry={80} seed={4} progress={interpolate(frame, [stressAt, stressAt + 12], [0, 1], clamp)} width={6} /> : null}
            </div>
            <div style={{ fontFamily: sat, fontWeight: 500, fontSize: 38, color: K.ink, margin: "6px 0 26px" }}>{part.label}</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(10, ${CELL}px)`, gap: 4 }}>
              {Array.from({ length: 100 }, (_, c) => (
                <div key={c} style={{ width: CELL, height: CELL, background: c < filled ? (last ? K.red : K.ink) : "rgba(19,18,17,0.1)" }} />
              ))}
            </div>
          </div>
        );
      })}
    </Paper>
  );
};

export const MIND_SCENES: Record<string, React.FC<SceneProps>> = {
  trio: TrioScene,
  flood: FloodScene,
  spotlight: SpotlightScene,
  bench: BenchScene,
  meters: MetersScene,
  ratio: RatioScene,
};
