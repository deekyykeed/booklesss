import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Blobs } from "../components/Blobs";
import { bodyStack } from "../brand";
import {
  BAR,
  BAR_H,
  FOLDER_IDS,
  PANEL_W,
  RAIL,
  RAIL_INSET,
  ROW_H,
  barLeftFor,
  childIdsOf,
  layout,
  padFor,
  type Placed,
} from "../nav-tree";

/* ------------------------------------------------------------------ *
 * A short demo of the reader's left sidebar: the selector card riding
 * between steps while folders open and close under it.
 *
 * Two things this leans on that a CSS mock could not:
 *  - every position is a pure function of the frame, so the selector's
 *    squash is derived from its own velocity (sample the layout at
 *    `frame` and at `frame - 1` and diff) rather than guessed;
 *  - the background blobs loop in exactly the clip length, so the whole
 *    thing repeats seamlessly on a feed.
 *
 * Colours, geometry and labels all come from the real app — see
 * ../nav-tree.ts and platform/src/app/globals.css.
 * ------------------------------------------------------------------ */

const INK = "#171717";
const MUTED = "#707070";
const LINE = "#dfdfdf";

/* The voice-mode glow palette from RightPanel.tsx. One colour per beat, so
 * every step change recolours the halo behind the card. */
const GLOW = [
  "168 85 247",
  "59 130 246",
  "45 212 191",
  "236 72 153",
  "251 146 60",
  "52 211 153",
  "129 140 248",
  "244 63 94",
];

type Beat = { at: number; open: string[]; selected: string };

/* The script. Folders open and close mid-travel on purpose — that reflow under
 * a moving selector is the whole point of the demo. */
const BEATS: Beat[] = [
  { at: 0, open: ["getting-started", "microeconomics", "supply-demand"], selected: "law-of-demand" },
  { at: 34, open: ["getting-started", "microeconomics", "supply-demand"], selected: "law-of-supply" },
  { at: 68, open: ["getting-started", "microeconomics", "supply-demand"], selected: "market-equilibrium" },
  { at: 104, open: ["getting-started", "microeconomics", "supply-demand", "elasticity"], selected: "ped" },
  { at: 140, open: ["getting-started", "microeconomics", "supply-demand", "elasticity"], selected: "yed" },
  { at: 170, open: ["getting-started", "microeconomics", "supply-demand", "elasticity"], selected: "xed" },
  { at: 206, open: ["microeconomics", "supply-demand", "consumer-choice"], selected: "utility" },
  { at: 240, open: ["microeconomics", "supply-demand", "consumer-choice"], selected: "indifference" },
];

export const SIDEBAR_DEMO_DURATION = 276; // 9.2s at 30fps

/* ------------------------------------------------------------------ *
 * Scene state at an arbitrary frame — pure, so it can be sampled twice
 * (frame and frame-1) to get velocity.
 * ------------------------------------------------------------------ */
type Row = Placed & { y: number; opacity: number; entering: number };

type Scene = {
  rows: Row[];
  rails: { id: string; x: number; top: number; bottom: number; opacity: number }[];
  chipY: number;
  barX: number;
  glowFrom: string;
  glowTo: string;
  glowT: number;
};

function beatIndexAt(frame: number) {
  let i = 0;
  for (let k = 0; k < BEATS.length; k++) if (frame >= BEATS[k].at) i = k;
  return i;
}

function sceneAt(frame: number, fps: number): Scene {
  const bi = beatIndexAt(frame);
  const next = BEATS[bi];
  const prev = BEATS[Math.max(0, bi - 1)];

  /* The list reflow settles without overshoot — a folder opening should feel
   * like a drawer, not a spring toy. */
  const tList = spring({
    frame: frame - next.at,
    fps,
    config: { damping: 200, mass: 0.9 },
  });

  /* The card itself gets a little overshoot. This is the "fun" the sidebar
   * doesn't have in the app yet. */
  const tChip = spring({
    frame: frame - next.at,
    fps,
    config: { damping: 15, mass: 0.42, stiffness: 120 },
  });

  const prevL = layout(new Set(prev.open));
  const nextL = layout(new Set(next.open));

  const ids = new Set([...prevL.keys(), ...nextL.keys()]);

  /* A row that is appearing slides out from under its parent rather than
   * materialising in place; a row that is leaving slides back into it. */
  const yIn = (id: string, l: Map<string, Placed>): number => {
    const hit = l.get(id);
    if (hit) return hit.y;
    // Walk up to the nearest ancestor that IS in this layout.
    let p = (prevL.get(id) ?? nextL.get(id))?.parent ?? null;
    while (p) {
      const up = l.get(p);
      if (up) return up.y;
      p = (prevL.get(p) ?? nextL.get(p))?.parent ?? null;
    }
    return 0;
  };

  const yOf = (id: string) => interpolate(tList, [0, 1], [yIn(id, prevL), yIn(id, nextL)]);

  const rows: Row[] = [];
  ids.forEach((id) => {
    const meta = nextL.get(id) ?? prevL.get(id)!;
    const inPrev = prevL.has(id);
    const inNext = nextL.has(id);
    /* Rows entering or leaving fade about twice as fast as they travel — they
     * are stacked on top of each other while they collapse into the parent, so
     * a slow fade reads as a smear. */
    const opacity =
      inPrev && inNext
        ? 1
        : inNext
          ? Math.min(1, tList * 2)
          : Math.max(0, 1 - tList * 2.4);
    rows.push({
      ...meta,
      // Depth and open-ness follow whichever layout the row actually lives in.
      depth: (inNext ? nextL.get(id)! : prevL.get(id)!).depth,
      open: (inNext ? nextL.get(id)! : prevL.get(id)!).open,
      y: yOf(id),
      opacity,
      entering: inPrev && inNext ? 1 : opacity,
    });
  });
  rows.sort((a, b) => a.y - b.y);

  /* Rails: a folder's rail spans its direct children, inset at both ends. */
  const rails: Scene["rails"] = [];
  FOLDER_IDS.forEach((fid) => {
    const inPrev = prevL.get(fid)?.open ?? false;
    const inNext = nextL.get(fid)?.open ?? false;
    if (!inPrev && !inNext) return;
    const kids = childIdsOf(fid).filter((k) => prevL.has(k) || nextL.has(k));
    if (!kids.length) return;
    const ys = kids.map(yOf);
    const depth = (nextL.get(fid) ?? prevL.get(fid))!.depth;
    rails.push({
      id: fid,
      x: barLeftFor(depth) + (BAR - RAIL) / 2,
      top: Math.min(...ys) + RAIL_INSET,
      bottom: Math.max(...ys) + ROW_H - RAIL_INSET,
      opacity: inPrev && inNext ? 1 : inNext ? tList : 1 - tList,
    });
  });

  const selDepth = (id: string) => (nextL.get(id) ?? prevL.get(id))?.depth ?? 1;

  return {
    rows,
    rails,
    chipY: interpolate(tChip, [0, 1], [yOf(prev.selected), yOf(next.selected)]),
    barX: interpolate(tChip, [0, 1], [
      barLeftFor(selDepth(prev.selected) - 1),
      barLeftFor(selDepth(next.selected) - 1),
    ]),
    glowFrom: GLOW[(bi === 0 ? 0 : bi - 1) % GLOW.length],
    glowTo: GLOW[bi % GLOW.length],
    glowT: tList,
  };
}

/* ------------------------------------------------------------------ */

const Chevron: React.FC<{ open: number; s: number; color: string }> = ({ open, s, color }) => (
  <svg
    width={14 * s}
    height={14 * s}
    viewBox="0 0 24 24"
    fill="none"
    style={{ flexShrink: 0, transform: `rotate(${open * 90}deg)` }}
  >
    <path
      d="M9 6l6 6-6 6"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SidebarDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  /* The panel, blown up from its real 265px so the type is legible on a
   * phone. Everything inside is drawn in app pixels and scaled as a unit. */
  const s = 2.55;
  const panelW = PANEL_W * s;
  const panelH = height - 400;
  const panelX = (width - panelW) / 2;
  const panelY = 220;

  const now = sceneAt(frame, fps);
  const before = sceneAt(Math.max(0, frame - 1), fps);

  /* Velocity-driven squash: the card stretches along its direction of travel
   * and thins across it. Nothing hand-keyed — it falls out of the motion. */
  const v = now.chipY - before.chipY;
  const squash = Math.min(0.16, Math.abs(v) * 0.012);

  const selectedId = BEATS[beatIndexAt(frame)].selected;

  /* Panel entrance, once. */
  const intro = spring({ frame, fps, config: { damping: 200, mass: 1.2 } });

  const NAV_PAD = 8; // nav p-2

  return (
    <AbsoluteFill>
      <Blobs palette="voice" strength={0.55} />

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: bodyStack,
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: 0.4,
          color: MUTED,
          opacity: interpolate(intro, [0, 1], [0, 1]),
        }}
      >
        Your course, always one tap away
      </div>

      {/* The sidebar panel */}
      <div
        style={{
          position: "absolute",
          left: panelX,
          top: panelY,
          width: panelW,
          height: panelH,
          borderRadius: 34,
          border: `1px solid rgba(255,255,255,0.75)`,
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: "0 40px 90px rgba(60,74,110,0.16), 0 2px 6px rgba(60,74,110,0.06)",
          overflow: "hidden",
          opacity: intro,
          transform: `translateY(${interpolate(intro, [0, 1], [26, 0])}px)`,
        }}
      >
        {/* Everything below is in app pixels, scaled as one unit. */}
        <div
          style={{
            position: "absolute",
            left: NAV_PAD * s,
            top: NAV_PAD * s,
            width: (PANEL_W - NAV_PAD * 2) * s,
            transform: `scale(${s})`,
            transformOrigin: "0 0",
          }}
        >
          <div style={{ position: "relative", width: PANEL_W - NAV_PAD * 2 }}>
            {/* Rails — bottom of the stack, so the selected card paints over them. */}
            {now.rails.map((r) => (
              <span
                key={r.id}
                style={{
                  position: "absolute",
                  left: r.x,
                  top: r.top,
                  width: RAIL,
                  height: Math.max(0, r.bottom - r.top),
                  borderRadius: 999,
                  background: LINE,
                  opacity: r.opacity,
                  zIndex: 0,
                }}
              />
            ))}

            {/* Coloured halo behind the card — the voice-glow palette, recoloured
                on every step change. Sits under the card, over the rail. */}
            <span
              style={{
                position: "absolute",
                left: -10,
                top: now.chipY - 9,
                width: PANEL_W - NAV_PAD * 2 + 20,
                height: ROW_H + 18,
                borderRadius: 20,
                zIndex: 0,
                filter: "blur(9px)",
                opacity: 0.5,
                background: `linear-gradient(90deg,
                  rgb(${now.glowFrom} / ${0.85 * (1 - now.glowT)}) 0%,
                  rgb(${now.glowTo} / ${0.85 * now.glowT}) 100%)`,
              }}
            />

            {/* Selected-step card. */}
            <span
              style={{
                position: "absolute",
                left: 0,
                top: now.chipY,
                width: "100%",
                height: ROW_H,
                zIndex: 1,
                boxSizing: "border-box",
                border: `1px solid ${LINE}`,
                borderRadius: 12,
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 1px 1px -0.5px rgba(0,0,0,0.06)",
                transform: `scaleY(${1 + squash}) scaleX(${1 - squash * 0.5})`,
                transformOrigin: "50% 50%",
              }}
            />

            {/* Active bar. */}
            <span
              style={{
                position: "absolute",
                left: now.barX,
                top: now.chipY + (ROW_H - BAR_H) / 2,
                width: BAR,
                height: BAR_H * (1 + squash * 2),
                borderRadius: 2,
                background: "#808080",
                zIndex: 10,
              }}
            />

            {/* Rows. */}
            {now.rows.map((r) => {
              const active = r.id === selectedId;
              return (
                <div
                  key={r.id}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: r.y,
                    width: "100%",
                    height: ROW_H,
                    zIndex: 2,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "4px 8px",
                    paddingLeft: padFor(r.depth),
                    border: "2px solid transparent",
                    borderRadius: 16,
                    fontFamily: bodyStack,
                    fontSize: 14,
                    lineHeight: "20px",
                    fontWeight: 600,
                    color: active ? INK : MUTED,
                    opacity: r.opacity,
                    transform: `translateX(${(1 - r.entering) * -6}px)`,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      minWidth: 0,
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {r.label}
                  </span>
                  {r.isFolder ? (
                    <Chevron open={r.open ? 1 : 0} s={1} color={MUTED} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer line */}
      <div
        style={{
          position: "absolute",
          bottom: 96,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: bodyStack,
          fontSize: 28,
          fontWeight: 500,
          color: MUTED,
          opacity: intro * 0.9,
        }}
      >
        booklesss.vercel.app
      </div>
    </AbsoluteFill>
  );
};
