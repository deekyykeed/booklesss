import React from "react";
import { AbsoluteFill, Audio, Easing, getStaticFiles, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { speaking, triggers, type TimedBeat, type TransitionKind } from "./align";
import { Grain, K, ThermalDefs, Vignette } from "./look";
import { Presenter } from "./Presenter";
import { SCENES as CALC_SCENES } from "./scenes";
import { MIND_SCENES } from "./scenes-mind";

const SCENES = { ...CALC_SCENES, ...MIND_SCENES };
import { EXPLAINERS, type ExplainerProps } from "../explainers";

/* An explainer: you on camera, cutting FULL SCREEN to animation and back.
 *
 * Every beat owns the screen from its `at` frame (just before its first word)
 * to the next beat's. Transitions straddle that boundary: the incoming beat
 * mounts a few frames early so it can slide/clip/fade in over the outgoing
 * one, and overlays (the glow, the bar, the ink) cover the seam.
 *
 *   you -> anim   thermal   you heat up into a heat map, a glow swallows the frame
 *   anim -> you   punch     hard cut back, a small push-in, the heat cools off you
 *   anim -> anim  whip | slam | ink | cut
 */

const FPS = 30;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* frames the incoming beat mounts BEFORE its boundary */
const PRE: Record<TransitionKind, number> = { thermal: 6, punch: 0, whip: 8, slam: 10, ink: 10, cut: 0 };
/* frames the outgoing beat is affected by the NEXT beat's transition */
const EXIT: Record<TransitionKind, number> = { thermal: 18, punch: 0, whip: 8, slam: 0, ink: 0, cut: 0 };

const SFX: Record<TransitionKind, { file: string; lead: number; vol: number } | null> = {
  thermal: { file: "thermal", lead: 20, vol: 0.55 },
  punch: { file: "punch", lead: 1, vol: 0.6 },
  whip: { file: "whoosh", lead: 9, vol: 0.55 },
  slam: { file: "slam", lead: 4, vol: 0.6 },
  ink: { file: "ink", lead: 18, vol: 0.55 },
  cut: { file: "punch", lead: 0, vol: 0.35 },
};

export const Explainer: React.FC<ExplainerProps> = ({ slug, footage, faces }) => {
  const frame = useCurrentFrame();
  const { beats, duration } = EXPLAINERS[slug].timeline;
  const tone = EXPLAINERS[slug].script.tone ?? "dark";
  const music = musicVolume(beats, duration);

  // subtle gate weave: the whole picture drifts a pixel or two, like film
  const weaveX = Math.sin(frame * 1.3) * 0.8 + Math.sin(frame * 0.37) * 0.9;
  const weaveY = Math.cos(frame * 1.1) * 0.7;

  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <ThermalDefs />
      <AbsoluteFill style={{ transform: `translate(${weaveX}px, ${weaveY}px) scale(1.004)` }}>
        {beats.map((b, i) => {
          const next = beats[i + 1];
          const kindIn: TransitionKind = b.in ?? "cut";
          const kindOut: TransitionKind | null = next ? next.in ?? "cut" : null;
          const from = b.at - (i === 0 ? 0 : PRE[kindIn]);
          if (frame < from || frame >= b.until) return null;
          return (
            <BeatLayer key={i} frame={frame} beat={b} kindIn={kindIn} kindOut={kindOut} next={next} footage={footage} faces={faces} tone={tone} first={i === 0} />
          );
        })}
        {beats.slice(1).map((b, i) => (
          // the glow starts on the face: tracked box when there's footage,
          // the stand-in's head otherwise
          (() => {
            const fb = faces?.[Math.min(b.at, faces.length - 1)];
            return (
              <Overlay
                key={i}
                frame={frame}
                kind={b.in ?? "cut"}
                at={b.at}
                cx={fb ? fb[0] + fb[2] / 2 : 540}
                cy={fb ? fb[1] + fb[3] / 2 : 860}
              />
            );
          })()
        ))}
      </AbsoluteFill>
      <Vignette />
      <Grain frame={frame} />
      <FadeIO frame={frame} duration={duration} />

      {/* ---------------- sound
       * With your footage: YOUR audio and nothing else — no music, no sfx, no
       * ducking (owner, 2026-10-09: "don't do anything to the sound at all").
       * scripts/mux-audio.mjs then swaps the original stream back in bit for
       * bit, so even Remotion's re-encode doesn't touch it.
       * Without footage (placeholder cut): TTS voice + the beat-locked score
       * + sfx. */}
      {footage ? (
        <Audio src={staticFile(footage)} />
      ) : (
        <PlaceholderMix slug={slug} beats={beats} music={music} />
      )}
    </AbsoluteFill>
  );
};

const PlaceholderMix: React.FC<{ slug: string; beats: TimedBeat[]; music: (f: number) => number }> = ({ slug, beats, music }) => {
  // the score written to this edit's grid if it has been generated, else the generic bed
  const scored = getStaticFiles().some((f) => f.name === `explainers/${slug}/music.wav`);
  return (
    <>
      <Audio src={staticFile(`explainers/${slug}/voice.wav`)} />
      <Audio src={staticFile(scored ? `explainers/${slug}/music.wav` : "music/bed.wav")} volume={(f) => music(f)} />
      {beats.slice(1).map((b, i) => {
        const s = SFX[b.in ?? "cut"];
        if (!s) return null;
        return (
          <Sequence key={`t${i}`} from={Math.max(0, b.at - s.lead)} durationInFrames={45}>
            <Audio src={staticFile(`sfx/${s.file}.wav`)} volume={s.vol} />
          </Sequence>
        );
      })}
      {beats.flatMap((b) => sceneSounds(b)).map((s, i) => (
        <Sequence key={`s${i}`} from={Math.max(0, s.at)} durationInFrames={45}>
          <Audio src={staticFile(`sfx/${s.file}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </>
  );
};

/* ---------------------------------------------------------------- one beat */

const BeatLayer: React.FC<{
  frame: number;
  beat: TimedBeat;
  next?: TimedBeat;
  kindIn: TransitionKind;
  kindOut: TransitionKind | null;
  footage?: string | null;
  faces?: number[][] | null;
  tone: "dark" | "light";
  first: boolean;
}> = ({ frame, beat, next, kindIn, kindOut, footage, faces, tone, first }) => {
  const tIn = frame - beat.at; // negative while mounting early
  const tOut = next ? frame - next.at : -999; // approaches 0 at the hand-off

  const style: React.CSSProperties = {};
  let heat = 0;
  let scale = 1;
  let x = 0;
  let blur = 0;

  // ---- entrance
  if (!first) {
    if (kindIn === "whip") {
      x += interpolate(tIn, [-PRE.whip, 0], [1080, 0], { ...clamp, easing: ease });
      blur += interpolate(tIn, [-PRE.whip, 0], [30, 0], clamp);
    } else if (kindIn === "thermal" || kindIn === "ink") {
      if (tIn < -2) style.opacity = 0; // hidden under the glow / ink
    } else if (kindIn === "slam") {
      // revealed behind the bar's trailing edge
      const trail = slamTrail(tIn);
      style.clipPath = `inset(0 ${Math.max(0, 1080 - trail)}px 0 0)`;
    } else if (kindIn === "punch") {
      scale *= interpolate(tIn, [0, 10], [1.12, 1], { ...clamp, easing: ease });
      if (beat.show === "you") heat = Math.max(heat, interpolate(tIn, [0, 9], [0.9, 0], clamp));
    }
  }

  // ---- exit (what the next beat's transition does to this one)
  if (kindOut === "thermal" && beat.show === "you") {
    heat = Math.max(heat, interpolate(tOut, [-EXIT.thermal, -4], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }));
    scale *= interpolate(tOut, [-EXIT.thermal, 0], [1, 1.07], clamp);
  } else if (kindOut === "whip") {
    x += interpolate(tOut, [-EXIT.whip, 0], [0, -520], { ...clamp, easing: Easing.in(Easing.quad) });
    blur += interpolate(tOut, [-EXIT.whip, 0], [0, 26], clamp);
  }

  const transform = `translateX(${x}px) scale(${scale})`;
  const Scene = beat.scene ? SCENES[beat.scene] : null;

  return (
    <AbsoluteFill style={{ ...style, transform, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
      {beat.show === "you" ? (
        <Presenter frame={frame} beat={beat} heat={heat} footage={footage} faces={faces} tone={tone} />
      ) : Scene ? (
        <Scene frame={frame} beat={beat} />
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- overlays */

const BAR_W = 520;
/* the slam bar's trailing edge x, as a function of time around the boundary */
const slamTrail = (t: number) => interpolate(t, [-PRE.slam, 6], [-BAR_W, 1080 + 40], { ...clamp, easing: ease });

const Overlay: React.FC<{ frame: number; kind: TransitionKind; at: number; cx?: number; cy?: number }> = ({
  frame,
  kind,
  at,
  cx = 540,
  cy = 860,
}) => {
  const t = frame - at;
  if (t < -24 || t > 14) return null;

  if (kind === "thermal") {
    // a red-orange glow blooms from the FACE (tracked, when there's footage)
    // and swallows the frame, then clears. Drawn as a gradient at its real
    // size every frame — scaling up a small blurred disc instead rasterised
    // into hard concentric rings, a target over the face.
    const r = interpolate(t, [-7, 0], [40, 2600], { ...clamp, easing: Easing.in(Easing.quad) });
    const fade = interpolate(t, [0, 9], [1, 0], clamp);
    if (t < -7 || fade <= 0) return null;
    return (
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: fade,
          background: `radial-gradient(circle ${r}px at ${cx}px ${cy}px, #FFD25A 0%, #FF7A1A 22%, ${K.red} 48%, rgba(120,10,0,0.95) 70%, rgba(19,18,17,0) 100%)`,
        }}
      />
    );
  }

  if (kind === "slam") {
    const trail = slamTrail(t);
    if (trail <= -BAR_W || trail >= 1080 + 40) return null;
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: trail, width: BAR_W, background: K.ink }} />
        {/* pen flicks thrown off the bar's leading edge */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {[700, 1010, 1240].map((y, i) => (
            <path
              key={i}
              d={`M${trail + BAR_W} ${y} q ${120 + i * 40} ${-30 + i * 20} ${260 + i * 50} ${10 - i * 8}`}
              stroke={K.ink}
              strokeWidth={5 - i}
              fill="none"
              strokeLinecap="round"
              opacity={0.85}
            />
          ))}
        </svg>
      </AbsoluteFill>
    );
  }

  if (kind === "ink") {
    // an ink drop spreads to cover, then the new frame shows through as it thins
    const r = interpolate(t, [-PRE.ink, -2], [0, 1300], { ...clamp, easing: Easing.in(Easing.cubic) });
    const thin = interpolate(t, [-2, 7], [1, 0], clamp);
    if (t < -PRE.ink || thin <= 0) return null;
    return (
      <AbsoluteFill style={{ pointerEvents: "none", opacity: thin }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g filter="url(#inkEdge)">
            <circle cx={560} cy={980} r={r} fill={K.ink} />
            <circle cx={380} cy={820} r={r * 0.35} fill={K.ink} />
            <circle cx={760} cy={1200} r={r * 0.28} fill={K.ink} />
          </g>
        </svg>
      </AbsoluteFill>
    );
  }

  if (kind === "punch" || kind === "cut") {
    // two frames of near-white: the "shutter" of a hard cut
    const a = interpolate(t, [0, 1, 3], [0.55, 0.25, 0], clamp);
    if (t < 0 || a <= 0) return null;
    return <AbsoluteFill style={{ pointerEvents: "none", background: K.white, opacity: kind === "cut" ? a * 0.6 : a }} />;
  }

  if (kind === "whip") {
    if (t < -PRE.whip || t > 3) return null;
    const p = interpolate(t, [-PRE.whip, 3], [0, 1], clamp);
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {[260, 610, 930, 1180, 1460, 1700].map((y, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: y,
              left: 1200 - p * 2400 + i * 90,
              width: 600 - i * 40,
              height: 5,
              background: i % 3 === 0 ? K.red : "rgba(19,18,17,0.55)",
            }}
          />
        ))}
      </AbsoluteFill>
    );
  }
  return null;
};

const FadeIO: React.FC<{ frame: number; duration: number }> = ({ frame, duration }) => {
  const a = interpolate(frame, [duration - 14, duration - 1], [0, 1], clamp);
  return a > 0 ? <AbsoluteFill style={{ background: K.ink, opacity: a }} /> : null;
};

/* ---------------------------------------------------------------- mix */

/* Music sits around -18 dB under speech and comes up between lines. A rolling
 * average over ±6 frames makes the ducking glide instead of chattering. */
function musicVolume(beats: TimedBeat[], duration: number) {
  const UP = 0.32;
  const DOWN = 0.11;
  const raw = Array.from({ length: duration }, (_, f) => (speaking(beats, f) ? DOWN : UP));
  const smooth = raw.map((_, f) => {
    let s = 0;
    let n = 0;
    for (let k = -6; k <= 6; k++) {
      const v = raw[f + k];
      if (v !== undefined) {
        s += v;
        n++;
      }
    }
    return s / n;
  });
  return (f: number) => {
    const v = smooth[Math.min(Math.max(0, f), duration - 1)];
    const fadeIn = interpolate(f, [0, 15], [0.4, 1], clamp);
    const fadeOut = interpolate(f, [duration - 30, duration - 1], [1, 0], clamp);
    return v * fadeIn * fadeOut;
  };
}

/* Small sounds inside a scene, on the same triggers its visuals use. */
function sceneSounds(b: TimedBeat): { at: number; file: string; vol: number }[] {
  const x = b as unknown as Record<string, { on: string; result?: boolean }[]>;
  switch (b.scene) {
    case "formula":
      return triggers(b, [...x.terms.map((t) => t.on), ...x.defs.map((d) => d.on)]).map((at) => ({ at, file: "pop", vol: 0.35 }));
    case "calc":
      return triggers(b, x.steps.map((s) => s.on)).map((at, i) => ({
        at,
        file: x.steps[i].result ? "hit" : "pop",
        vol: x.steps[i].result ? 0.55 : 0.35,
      }));
    case "bars":
      return triggers(b, (x.bars as { on: string | null }[]).map((s) => s.on))
        .filter((_, i) => (x.bars as { on: string | null }[])[i].on)
        .map((at) => ({ at, file: "pop", vol: 0.3 }));
    case "cards":
      return triggers(b, x.cards.map((c) => c.on)).flatMap((at, i) => [
        ...(i > 0 ? [{ at: at - 6, file: "whoosh", vol: 0.3 }] : []),
        { at, file: "type", vol: 0.45 },
        { at: at + 2, file: "type", vol: 0.35 },
        { at: at + 4, file: "type", vol: 0.35 },
      ]);
    case "spell":
      return triggers(b, x.tokens.map((t) => t.on)).map((at, i, all) => ({
        at,
        file: i === all.length - 1 ? "hit" : "slam",
        vol: i === all.length - 1 ? 0.5 : 0.28,
      }));
    default:
      return [];
  }
}

export { FPS as EXPLAINER_FPS };
