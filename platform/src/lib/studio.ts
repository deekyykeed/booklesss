"use client";

import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ *
 * The video-course framework (owner, 2026-10-18: "set up some sort of
 * framework for people to create videos", inside the original /dashboard
 * design).
 *
 * A VIDEO COURSE is material → lessons → scenes, plus a style preset and a
 * voice. A scene is one screen of the video: a heading, at most two lines on
 * the stage, and the narration read over it. Each lesson carries one quick
 * check that stops the video, the same one-concept-one-check rule the reader
 * runs on.
 *
 * ⚠️ WHAT IS REAL AND WHAT IS A STAND-IN. The structure, the editor, the
 * player and the in-video quiz are real and work end to end. Two pieces are
 * stand-ins with a seam each, so the real thing drops in without touching a
 * component:
 *   · `buildOutline` splits the material by its own headings and paragraphs
 *     and writes a fill-the-gap check from it. The model call that writes a
 *     proper script replaces this one function.
 *   · The voice is the browser's own speech (speechSynthesis), so a preview
 *     costs nothing and works offline. Rendered audio (ElevenLabs, already
 *     wired for sessions) replaces `speak` in the player.
 * Courses live in this device's localStorage until a `video_courses` table
 * exists — same arrangement the reader's progress had before /api/state.
 * ------------------------------------------------------------------ */

export type StyleId = "editorial" | "whiteboard" | "chalk" | "night";

export type Scene = { id: string; heading: string; lines: string[]; narration: string };
export type Quiz = { question: string; options: string[]; answer: number };
export type Lesson = { id: string; title: string; scenes: Scene[]; quiz: Quiz | null };

export type VideoCourse = {
  id: string;
  title: string;
  creator: string;
  material: string;
  lessons: Lesson[];
  style: StyleId;
  /** A speechSynthesis voice name; empty means the browser's default. */
  voice: string;
  rate: number;
  status: "draft" | "published";
  updatedAt: number;
  /** Shipped with the app as an example, never saved or deleted. */
  sample?: boolean;
};

export const STYLES: { id: StyleId; name: string; blurb: string }[] = [
  { id: "editorial", name: "Editorial", blurb: "Big serif titles on warm grey, like a magazine page" },
  { id: "whiteboard", name: "Whiteboard", blurb: "Clean white board, black marker headings" },
  { id: "chalk", name: "Chalkboard", blurb: "Dark green board, chalk-white writing" },
  { id: "night", name: "Night", blurb: "Near-black stage with one warm accent" },
];

/* ---------------------------------------------------------------- *
 * The outline builder — the stand-in for a scripting model.
 * ---------------------------------------------------------------- */

const uid = () => Math.random().toString(36).slice(2, 10);

const sentencesOf = (p: string) =>
  p.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/).map((s) => s.trim()).filter(Boolean);

const firstWords = (s: string, n: number) => {
  const w = s.replace(/[.!?:;,]+$/, "").split(/\s+/);
  return w.slice(0, n).join(" ") + (w.length > n ? "…" : "");
};

/** Material → sections. Markdown headings win; otherwise every three
 *  paragraphs make a lesson. */
function sections(text: string): { title: string; paras: string[] }[] {
  const lines = text.replace(/\r/g, "").split("\n");
  const out: { title: string; paras: string[] }[] = [];
  let cur: { title: string; paras: string[] } | null = null;
  let buf: string[] = [];
  const flush = () => {
    const p = buf.join(" ").trim();
    if (p) {
      if (!cur) { cur = { title: "", paras: [] }; out.push(cur); }
      cur.paras.push(p);
    }
    buf = [];
  };
  for (const raw of lines) {
    const l = raw.trim();
    const h = /^#{1,3}\s+(.*)$/.exec(l);
    if (h) { flush(); cur = { title: h[1].trim(), paras: [] }; out.push(cur); continue; }
    if (!l) { flush(); continue; }
    buf.push(l);
  }
  flush();
  const hasHeadings = out.some((s) => s.title);
  if (hasHeadings) return out.filter((s) => s.paras.length);
  const paras = out.flatMap((s) => s.paras);
  const chunks: { title: string; paras: string[] }[] = [];
  for (let i = 0; i < paras.length; i += 3) chunks.push({ title: "", paras: paras.slice(i, i + 3) });
  return chunks;
}

const STOP = new Set("because between through without another however therefore company companies".split(" "));

function quizFor(sents: string[], seed: number): Quiz | null {
  const words = (s: string) => s.match(/[A-Za-z][A-Za-z-]{5,}/g) ?? [];
  const pool = [...new Set(sents.flatMap(words).map((w) => w.toLowerCase()))].filter((w) => !STOP.has(w));
  for (let k = 0; k < sents.length; k++) {
    const s = sents[(k + seed) % sents.length];
    const cands = words(s).filter((w) => !STOP.has(w.toLowerCase()));
    if (!cands.length || s.split(" ").length < 6) continue;
    const target = cands.sort((a, b) => b.length - a.length)[0];
    // Wrong answers come from OTHER sentences: a word lifted from the same one
    // can fit the gap and be "wrong" only on a technicality.
    const own = new Set(words(s).map((w) => w.toLowerCase()));
    const others = pool.filter((w) => !own.has(w)).slice(0, 8);
    if (others.length < 2) continue;
    const opts = [target.toLowerCase(), others[seed % others.length], others[(seed + 3) % others.length]]
      .filter((v, i, a) => a.indexOf(v) === i);
    if (opts.length < 3) continue;
    const order = [0, 1, 2].sort((a, b) => ((a * 7 + seed) % 3) - ((b * 7 + seed) % 3));
    return {
      question: s.replace(target, "_____"),
      options: order.map((i) => opts[i]),
      answer: order.indexOf(0),
    };
  }
  return null;
}

export function buildOutline(material: string): Lesson[] {
  return sections(material).slice(0, 12).map((sec, li) => {
    const sents = sec.paras.flatMap(sentencesOf);
    const scenes: Scene[] = [];
    for (let i = 0; i < sents.length && scenes.length < 6; i += 2) {
      const pair = sents.slice(i, i + 2);
      scenes.push({
        id: uid(),
        heading: i === 0 && sec.title ? sec.title : firstWords(pair[0], 5),
        lines: pair,
        narration: pair.join(" "),
      });
    }
    return {
      id: uid(),
      title: sec.title || firstWords(sents[0] ?? `Lesson ${li + 1}`, 6),
      scenes,
      quiz: quizFor(sents, li),
    };
  }).filter((l) => l.scenes.length);
}

export const minutesOf = (c: Pick<VideoCourse, "lessons" | "rate">) => {
  const words = c.lessons.reduce((n, l) => n + l.scenes.reduce((m, s) => m + s.narration.split(/\s+/).length, 0), 0);
  return Math.max(1, Math.round(words / (150 * (c.rate || 1))));
};

/* ---------------------------------------------------------------- *
 * The sample course, so Explore is never empty.
 * ---------------------------------------------------------------- */

const SAMPLE_TEXT = `# What a budget is for
A budget is a plan for money before it is spent. A household in Lusaka that earns ZMW 9,000 a month decides in advance how much goes to rent, food, transport and savings. Companies do exactly the same thing, only with more lines and more people arguing over them.

The point is not to predict the future perfectly. The point is to notice early when spending drifts away from the plan, so there is still time to act.

# Fixed and variable costs
Some costs stay the same however busy a business is. A bakery in Ndola pays the same rent in a quiet month as in a busy one, and that rent is a fixed cost.

Other costs rise and fall with activity. Flour, packaging and delivery fuel grow with every extra loaf, so they are variable costs. Knowing which is which tells the owner how much each extra sale really earns.

# Break-even
Break-even is the level of sales where income exactly covers costs. Below it the business loses money, and above it every sale adds profit.

If each loaf sells for ZMW 25 and its variable cost is ZMW 15, each loaf contributes ZMW 10 towards fixed costs. With ZMW 20,000 of monthly rent and wages, the bakery must sell 2,000 loaves before it makes any profit at all.`;

const SAMPLES: VideoCourse[] = [
  {
    id: "sample-budgets",
    title: "Budgets, costs and break-even",
    creator: "Thandiwe Banda",
    material: SAMPLE_TEXT,
    lessons: buildOutline(SAMPLE_TEXT),
    style: "editorial",
    voice: "",
    rate: 1,
    status: "published",
    updatedAt: Date.UTC(2026, 9, 18),
    sample: true,
  },
];

/* ---------------------------------------------------------------- *
 * The store — localStorage, read through useSyncExternalStore.
 * ---------------------------------------------------------------- */

const KEY = "booklesss:studio:v1";
let cache: VideoCourse[] | null = null;
const subs = new Set<() => void>();
const EMPTY: VideoCourse[] = [];

function load(): VideoCourse[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as VideoCourse[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function save(next: VideoCourse[]) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage full or blocked: keep it in memory */ }
  subs.forEach((f) => f());
}

const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };

/** The creator's own courses, newest first. */
export function useMyCourses(): VideoCourse[] {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}

/** What a learner can watch: everything published, samples last. */
export function publishedOf(mine: VideoCourse[]): VideoCourse[] {
  return [...mine.filter((c) => c.status === "published"), ...SAMPLES];
}

export function newCourse(creator: string): VideoCourse {
  return {
    id: uid(), title: "Untitled course", creator, material: "", lessons: [],
    style: "editorial", voice: "", rate: 1, status: "draft", updatedAt: Date.now(),
  };
}

export function upsertCourse(c: VideoCourse) {
  if (c.sample) return;
  const list = load().filter((x) => x.id !== c.id);
  save([{ ...c, updatedAt: Date.now() }, ...list]);
}

export function deleteCourse(id: string) {
  save(load().filter((x) => x.id !== id));
}

export const SAMPLE_MATERIAL = SAMPLE_TEXT;
