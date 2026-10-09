/* Script + word timings -> a timed edit.
 *
 * The script says WHAT is said and what fills the screen; words.json says WHEN
 * each word was said (from the TTS placeholder today, from Whisper on the real
 * footage later). This file walks the two together. Nothing else in the
 * explainer knows a time in seconds — every scene asks "when is the word X
 * spoken" and gets a frame back.
 *
 * Whisper will not transcribe exactly what the script says ("10%" for "ten
 * percent", a dropped "the"), so matching is forgiving: each script word looks
 * a few transcript words ahead, and any word that can't be found is placed by
 * interpolating between its found neighbours. A mismatch costs a few frames of
 * accuracy on one word, never the edit. */

export type Word = { word: string; start: number; end: number };

export type TransitionKind = "thermal" | "punch" | "whip" | "slam" | "ink" | "cut";

export type Beat = {
  show: "you" | "anim";
  in?: TransitionKind;
  say: string;
  scene?: string;
  [key: string]: unknown;
};

export type Script = { slug: string; title: string; tail: number; beats: Beat[]; tone?: "dark" | "light" };

export type TimedWord = { text: string; f: number; fEnd: number };

export type TimedBeat = Beat & {
  index: number;
  words: TimedWord[];
  /** the frame this beat takes the screen — a few frames BEFORE its first word */
  at: number;
  /** the frame the next beat takes over (or the end of the video) */
  until: number;
};

/* Picture leads the word slightly. A cut that lands exactly on the syllable
 * reads as late, because the eye needs a beat to take in a new frame. */
export const LEAD_FRAMES = 3;

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]/g, "");

export function align(script: Script, words: Word[], fps: number) {
  const timed: TimedBeat[] = [];
  let p = 0;

  for (let bi = 0; bi < script.beats.length; bi++) {
    const beat = script.beats[bi];
    const tokens = beat.say.split(/\s+/).filter(Boolean);
    const slots: (Word | null)[] = tokens.map((tok) => {
      const n = norm(tok);
      for (let j = p; j < Math.min(p + 6, words.length); j++) {
        const w = norm(words[j].word);
        if (w && n && (w === n || w.startsWith(n) || n.startsWith(w))) {
          p = j + 1;
          return words[j];
        }
      }
      return null;
    });

    // fill gaps by interpolation between the nearest found neighbours
    const times = slots.map((s) => (s ? { start: s.start, end: s.end } : null));
    for (let i = 0; i < times.length; i++) {
      if (times[i]) continue;
      let a = i - 1;
      while (a >= 0 && !times[a]) a--;
      let b = i + 1;
      while (b < times.length && !times[b]) b++;
      const t0 = a >= 0 ? times[a]!.end : timed.length ? timed[timed.length - 1].words.at(-1)!.fEnd / fps : 0;
      const t1 = b < times.length ? times[b]!.start : t0 + 0.35 * (b - a);
      const k = (i - a) / (b - a);
      const s = t0 + (t1 - t0) * k;
      times[i] = { start: s, end: s + 0.25 };
    }

    timed.push({
      ...beat,
      index: bi,
      words: tokens.map((text, i) => ({
        text,
        f: Math.round(times[i]!.start * fps),
        fEnd: Math.round(times[i]!.end * fps),
      })),
      at: 0,
      until: 0,
    });
  }

  const lastEnd = timed.at(-1)!.words.at(-1)!.fEnd;
  const duration = Math.ceil(lastEnd + script.tail * fps);

  timed.forEach((b, i) => {
    b.at = i === 0 ? 0 : Math.max(0, b.words[0].f - LEAD_FRAMES);
  });
  timed.forEach((b, i) => {
    b.until = i + 1 < timed.length ? timed[i + 1].at : duration;
  });

  return { beats: timed, duration };
}

/** Frame at which `on` is spoken in this beat (first match at or after `from`
 *  word index), or the beat's start if the word isn't there. */
export function when(beat: TimedBeat, on: string | null | undefined, from = 0): number {
  if (!on) return beat.at;
  const n = norm(on);
  for (let i = from; i < beat.words.length; i++) {
    if (norm(beat.words[i].text).startsWith(n)) return beat.words[i].f;
  }
  return beat.at;
}

/** Same, but returns the word index, so a run of triggers can search in order. */
export function whenIndex(beat: TimedBeat, on: string, from = 0): number {
  const n = norm(on);
  for (let i = from; i < beat.words.length; i++) {
    if (norm(beat.words[i].text).startsWith(n)) return i;
  }
  return from;
}

/** Resolve a list of `on` words in order — so "one" in "one plus r" and the
 *  "one" in "one year" can't be confused for each other. */
export function triggers(beat: TimedBeat, ons: (string | null | undefined)[]): number[] {
  let from = 0;
  return ons.map((on) => {
    if (!on) return beat.at;
    const i = whenIndex(beat, on, from);
    from = i + 1;
    return beat.words[i]?.f ?? beat.at;
  });
}

/** Frames during which someone is speaking — the music ducks under these. */
export function speaking(beats: TimedBeat[], frame: number): boolean {
  for (const b of beats) {
    if (frame < b.words[0].f - 4 || frame > b.words.at(-1)!.fEnd + 6) continue;
    for (const w of b.words) if (frame >= w.f - 4 && frame <= w.fEnd + 6) return true;
  }
  return false;
}
