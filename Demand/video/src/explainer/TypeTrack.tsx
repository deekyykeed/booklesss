import React from "react";
import { Easing, interpolate } from "remotion";
import type { TimedBeat, TimedWord } from "./align";
import { K, sat } from "./look";
import { Pixel } from "./pixels";

/* Subtitles for the camera beats — set into the frame, never a strip.
 *
 * Owner, 2026-10-09: the first captions were "not very creative", "slapped on
 * top of the video"; the reference for the level wanted was a launch film where
 * words are set around the speaker's head. That grammar, rebuilt in this film's
 * own palette (ivory type, one red, Satoshi):
 *
 *   - words are placed in the EMPTY SPACE AROUND THE FACE — above the head, to
 *     its left, across the chest — each one popping in as it's spoken. The face
 *     box comes from `scripts/footage.py faces` (detection only; nothing is cut
 *     out of the picture — owner: no background removal)
 *   - one word per phrase is set huge above the head and gets a MARK: a red box
 *     wiping in behind it, a hand-drawn underline, or its letters dropping into
 *     red tiles one by one
 *   - quieter phrases are set in { braces } with corner dots, red dashes
 *     sliding out as the phrase ends
 *   - spoken numbers become figures (a hundred kwacha -> K100, ten percent -> 10%)
 *   - words that name a thing get its pixel object in a red pill beside them
 *     (bank, maths, years, bonds…) — the pixel set doubling as inline logos
 *
 * Words appear only as they're spoken — never ahead of the voice. It lives in
 * the picture layer, so the thermal transition heats it with you and a punch-in
 * moves it with the camera. */

const IVORY = "#F6F2E9";
const INK = "#15120F";

/* tone: what the type sits on. "dark" footage gets ivory type with a dark
 * shadow; "light" footage (a bright wall) gets ink type with a light halo —
 * ivory on a cream wall disappears. Red boxes and tiles keep ivory either way. */
export type Tone = "dark" | "light";
const ToneCtx = React.createContext<{ fg: string; halo: string }>({ fg: IVORY, halo: "0 2px 22px rgba(0,0,0,0.5)" });
const toneOf = (t: Tone) =>
  t === "light"
    ? { fg: INK, halo: "0 0 2px rgba(250,246,238,0.9), 0 0 18px rgba(250,246,238,0.85)" }
    : { fg: IVORY, halo: "0 1px 3px rgba(0,0,0,0.55), 0 2px 22px rgba(0,0,0,0.5)" };
const RED = K.red;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Face = { x: number; y: number; w: number; h: number };

/* ---------------------------------------------------------------- phrases */

type Tok = { text: string; f: number; fEnd: number; em?: boolean; num?: boolean };
type Look = "box" | "underline" | "tiles" | "scatter" | "braces" | "figure";
type Phrase = { toks: Tok[]; start: number; end: number; look: Look };

const STOP = new Set(
  "a an the is are was be to of in on at for and or but it its this that these those your my our their you i we they he she me us them by with as from out up so then here there where what which who will can".split(
    " ",
  ),
);

const UNITS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
};
const TENS: Record<string, number> = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const bare = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const isNumWord = (s: string) => bare(s) in UNITS || bare(s) in TENS || ["hundred", "thousand", "million", "point"].includes(bare(s));

/* Read a run of number words starting at i: "a hundred", "one point one",
 * "ninety one". Returns the value as a string and how many words it used. */
function readNumber(words: TimedWord[], i: number): { value: string; used: number } | null {
  let j = i;
  if (bare(words[j]?.text ?? "") === "a" && ["hundred", "thousand", "million"].includes(bare(words[j + 1]?.text ?? ""))) j++;
  if (!words[j] || !isNumWord(words[j].text) || bare(words[j].text) === "point") return null;
  let total = 0;
  let cur = bare(words[i].text) === "a" ? 1 : 0;
  let decimals = "";
  let k = j;
  for (; k < words.length; k++) {
    const w = bare(words[k].text);
    if (w in UNITS) cur += UNITS[w];
    else if (w in TENS) cur += TENS[w];
    else if (w === "hundred") cur = (cur || 1) * 100;
    else if (w === "thousand") (total += (cur || 1) * 1000), (cur = 0);
    else if (w === "million") (total += (cur || 1) * 1e6), (cur = 0);
    else if (w === "point") {
      let d = k + 1;
      while (d < words.length && bare(words[d].text) in UNITS && UNITS[bare(words[d].text)] < 10) decimals += UNITS[bare(words[d++].text)];
      k = d;
      break;
    } else break;
    // a spoken number ends at its own punctuation: "ninety kwacha, ninety one"
    if (/[,.?!]$/.test(words[k].text)) {
      k++;
      break;
    }
  }
  const value = String(total + cur) + (decimals ? `.${decimals}` : "");
  return { value, used: k - i };
}

/* Spoken words -> display tokens. Numbers become figures, "percent" folds into
 * them, "kwacha" becomes the K prefix (and "N kwacha, M" becomes K N.MM). An
 * explicit `display` map on the beat wins over all of it. */
function toTokens(beat: TimedBeat): Tok[] {
  const words = beat.words;
  const disp = (beat.display ?? {}) as Record<string, string>;
  const em = new Set(((beat.em ?? []) as string[]).map(bare));
  const toks: Tok[] = [];
  for (let i = 0; i < words.length; ) {
    const hit = Object.keys(disp)
      .sort((a, b) => b.split(" ").length - a.split(" ").length)
      .find((k) => k.split(" ").every((kw, o) => bare(words[i + o]?.text ?? "") === bare(kw)));
    if (hit) {
      const n = hit.split(" ").length;
      toks.push({ text: disp[hit], f: words[i].f, fEnd: words[i + n - 1].fEnd, num: true, em: true });
      i += n;
      continue;
    }
    const num = readNumber(words, i);
    if (num) {
      let text = num.value;
      let used = num.used;
      const nxt = bare(words[i + used]?.text ?? "");
      if (nxt === "percent") (text += "%"), used++;
      else if (nxt === "kwacha") {
        used++;
        const ng = readNumber(words, i + used);
        if (ng && !ng.value.includes(".") && +ng.value < 100) {
          text = `K${text}.${ng.value.padStart(2, "0")}`;
          used += ng.used;
        } else text = `K${text}`;
      }
      // a lone "one" is a word, not a figure ("next one is…"): only set it as
      // a number when it took several words or carries a unit
      if (used > 1 || /[%K]/.test(text)) {
        const last = words[i + used - 1];
        toks.push({ text, f: words[i].f, fEnd: last.fEnd, num: true });
        i += used;
        continue;
      }
    }
    const w = words[i];
    // Whisper writes "2 %" as two words: one figure
    if (/^\d+(\.\d+)?$/.test(w.text) && /^%/.test(words[i + 1]?.text ?? "")) {
      toks.push({ text: `${w.text}%`, f: w.f, fEnd: words[i + 1].fEnd, num: true });
      i += 2;
      continue;
    }
    // ...and "problem -solving" as two: join a word that starts with a hyphen
    if (/^-/.test(w.text) && toks.length) {
      const prev = toks[toks.length - 1];
      prev.text += w.text.replace(/[,;:]$/, "");
      prev.fEnd = w.fEnd;
      i++;
      continue;
    }
    toks.push({ text: w.text.replace(/[,;:]$/, ""), f: w.f, fEnd: w.fEnd, em: em.has(bare(w.text)) });
    i++;
  }
  return toks;
}

function phrases(beat: TimedBeat, beatIndex: number): Phrase[] {
  const toks = toTokens(beat);
  const groups: Tok[][] = [];
  let cur: Tok[] = [];
  toks.forEach((t, i) => {
    cur.push(t);
    const raw = beat.words.find((w) => w.fEnd === t.fEnd)?.text ?? t.text;
    if (/[.?!,]$/.test(raw) || /[.?!]$/.test(t.text) || cur.length === 5 || i === toks.length - 1) {
      groups.push(cur);
      cur = [];
    }
  });
  // one emphasised token per phrase: explicit > figure > longest content word
  groups.forEach((g) => {
    if (g.some((t) => t.em)) {
      let seen = false;
      g.forEach((t) => (t.em = t.em && !seen ? ((seen = true), true) : false));
      return;
    }
    const fig = g.find((t) => t.num);
    if (fig) return void (fig.em = true);
    const content = g.filter((t) => !STOP.has(bare(t.text)) && bare(t.text).length >= 4);
    const pick = content.sort((a, b) => bare(b.text).length - bare(a.text).length)[0];
    if (pick) pick.em = true;
  });
  // a figure always gets the figure look; otherwise rotate, so no two
  // neighbouring phrases are set the same way
  const cycle: Look[] = ["box", "scatter", "underline", "braces", "tiles", "scatter"];
  return groups.map((g, i) => {
    const em = g.find((t) => t.em);
    let look: Look = em?.num ? "figure" : cycle[(i + beatIndex * 2) % cycle.length];
    if (!em && (look === "box" || look === "underline" || look === "tiles")) look = "braces";
    if (look === "tiles" && em && bare(em.text).length > 9) look = "box";
    return { toks: g, start: g[0].f, end: g.at(-1)!.fEnd, look };
  });
}

/* ---------------------------------------------------------------- inline objects */

const ICON_FOR: Record<string, string> = {
  bank: "bank", banks: "bank", loan: "bank", loans: "bank",
  maths: "calculator", math: "calculator", calculate: "calculator",
  year: "hourglass", years: "hourglass", time: "hourglass",
  money: "note", cash: "note",
  bond: "bond", bonds: "bond", npv: "chart", discounting: "chart",
};

/* ---------------------------------------------------------------- pieces */

const pop = (frame: number, f: number, len = 6) => interpolate(frame, [f - 2, f - 2 + len], [0, 1], { ...clamp, easing: out });

type Mark = "box" | "underline" | "tiles" | null;

/* one word, popping in on its own frame, with its mark */
const Word: React.FC<{ frame: number; t: Tok; size: number; weight?: number; mark?: Mark; loop?: boolean }> = ({
  frame,
  t,
  size,
  weight = 500,
  mark = null,
  loop = false,
}) => {
  const tone = React.useContext(ToneCtx);
  const p = pop(frame, t.f);
  const icon = ICON_FOR[bare(t.text)];
  const markP = interpolate(frame, [t.f, t.f + 7], [0, 1], { ...clamp, easing: out });
  const base: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    fontFamily: sat,
    fontWeight: weight,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: weight >= 700 ? "-0.035em" : "-0.01em",
    color: mark === "box" ? IVORY : tone.fg,
    textShadow: mark === "box" ? undefined : tone.halo,
    opacity: p,
    transform: `translateY(${(1 - p) * 14}px) scale(${0.9 + 0.1 * p})`,
    filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
    whiteSpace: "nowrap",
  };

  if (mark === "tiles") {
    // letters drop into red tiles one by one across the time the word is said
    const letters = [...t.text];
    const span = Math.max(8, t.fEnd - t.f + 4);
    return (
      <span style={{ display: "inline-flex", gap: size * 0.06, fontFamily: sat, fontWeight: weight, fontSize: size, lineHeight: 1, color: IVORY }}>
        {letters.map((ch, i) => {
          const at = t.f - 2 + (i / letters.length) * span;
          const q = interpolate(frame, [at, at + 5], [0, 1], { ...clamp, easing: out });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                minWidth: size * 0.62,
                padding: size * 0.06,
                background: RED,
                textAlign: "center",
                opacity: q,
                transform: `translateY(${(1 - q) * -size * 0.25}px)`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </span>
    );
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.18 }}>
      <span style={base}>
        {mark === "box" ? (
          <span
            style={{
              position: "absolute",
              left: -size * 0.12,
              right: -size * 0.12,
              top: size * 0.04,
              bottom: -size * 0.1,
              background: RED,
              transform: `scaleX(${markP})`,
              transformOrigin: "0 50%",
            }}
          />
        ) : null}
        <span style={{ position: "relative" }}>{t.text}</span>
        {mark === "underline" ? (
          // revealed by a sliding window, not a dash offset: with a stretched,
          // non-scaling stroke, pathLength stops normalising and the line
          // draws as dashes
          <span style={{ position: "absolute", left: "-2%", width: `${104 * markP}%`, bottom: -size * 0.2, height: size * 0.22, overflow: "hidden" }}>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${100 / Math.max(markP, 0.01)}%`, overflow: "visible" }}>
              <path
                d="M1,12 C25,4 60,17 99,6"
                fill="none"
                stroke={RED}
                strokeWidth={Math.max(4, size * 0.05)}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </span>
        ) : null}
        {loop ? (
          <svg
            viewBox="-60 -30 120 60"
            preserveAspectRatio="none"
            style={{ position: "absolute", left: "-14%", top: "-30%", width: "128%", height: "160%", overflow: "visible" }}
          >
            <path
              d="M-48,-4 C-50,-26 42,-30 54,-6 C62,14 -10,30 -44,16 C-62,8 -50,-16 -20,-22"
              fill="none"
              stroke={RED}
              strokeWidth={4}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - interpolate(frame, [t.f + 4, t.f + 14], [0, 1], clamp)}
            />
          </svg>
        ) : null}
      </span>
      {icon && !t.num ? <IconPill frame={frame} at={t.f + 3} icon={icon} size={size} /> : null}
    </span>
  );
};

/* the pixel object in a red pill — the inline "logo" of the word */
const IconPill: React.FC<{ frame: number; at: number; icon: string; size: number }> = ({ frame, at, icon, size }) => {
  const q = interpolate(frame, [at - 1, at + 5], [0, 1], { ...clamp, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  const px = Math.max(3, Math.round(size / 18));
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: `${px * 2}px ${px * 3}px`,
        background: RED,
        borderRadius: px * 3,
        opacity: q > 0 ? 1 : 0,
        transform: `scale(${q})`,
      }}
    >
      <Pixel name={icon} px={px} />
    </span>
  );
};

/* ---------------------------------------------------------------- the track */

/* Where the subtitles sit: one fixed block below the face, the same place on
 * every camera beat. Owner, 2026-10-09, after the first real edit: "have the
 * subtitles in one place instead of the around my face thing … below the face
 * … white". A fixed place means no face tracking is needed — the presenter is
 * framed the same way every take (head in the upper half of a 9:16 frame). */
const CAPTION_TOP = 1170;
const CAPTION_X = 120;
const CAPTION_W = 840;
const CAPTION_SIZE = 62;
const WHITE = "#FFFFFF";

export const TypeTrack: React.FC<{ frame: number; beat: TimedBeat; beatIndex: number; face?: Face; tone?: Tone }> = ({
  frame,
  beat,
  beatIndex,
}) => {
  const ps = phrases(beat, beatIndex);
  const idx = ps.reduce((acc, p, i) => (frame >= p.start - 3 ? i : acc), -1);
  if (idx < 0) return null;
  const p = ps[idx];
  const next = ps[idx + 1];
  // a phrase clears just before the next begins, and fades after the last word
  const exit = next ? interpolate(frame, [next.start - 5, next.start - 2], [1, 0], clamp) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: CAPTION_X,
        width: CAPTION_W,
        top: CAPTION_TOP,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: CAPTION_SIZE * 0.26,
        rowGap: CAPTION_SIZE * 0.12,
        opacity: exit,
      }}
    >
      {p.toks.map((t, i) => {
        const q = pop(frame, t.f, 5);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: sat,
              fontWeight: 700,
              fontSize: CAPTION_SIZE,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: WHITE,
              // white on any background: a tight edge plus a soft spread, so it
              // holds on the cream wall as well as on the shirt
              textShadow: "0 0 3px rgba(0,0,0,0.75), 0 2px 6px rgba(0,0,0,0.55), 0 4px 24px rgba(0,0,0,0.45)",
              opacity: q,
              transform: `translateY(${(1 - q) * 10}px)`,
            }}
          >
            {t.text}
          </span>
        );
      })}
    </div>
  );
};

/* the old layouts (headline marks, braces, scatter around the face) live in
 * git history at 48172b6 — retired for camera beats by the owner's call */
void Word;
void IconPill;
void ToneCtx;
void toneOf;
