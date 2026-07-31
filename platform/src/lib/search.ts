import { COURSE, breadcrumbFor, pathForId, type Block, type Section } from "./course";

/* ------------------------------------------------------------------ *
 * Course search.
 *
 * Everything searchable is in the bundled course data — the same snapshot
 * the reader renders — so this is a plain in-memory index, no request and
 * no backend. 30 lessons and 69 sections is small enough that scoring the
 * whole set on every keystroke is cheaper than any cleverness would be.
 *
 * Two kinds of hit: the lesson itself (title/kicker) and an individual
 * section (heading and body). Section hits deep-link to `#id`, so a search
 * for "price maker" lands on the paragraph that says it rather than at the
 * top of Monopoly.
 *
 * DELIBERATELY NOT INDEXED: `section.check`. Those are the dormant
 * comprehension questions (no longer rendered — see course.ts). If they are
 * ever brought back, indexing the options or the explanation would let a
 * reader search up an answer without reading the step, so keep them out.
 * ------------------------------------------------------------------ */

export type Hit = {
  kind: "lesson" | "section";
  /** Primary line — the lesson title, or the section heading. */
  label: string;
  /** Trail of ancestor labels; for a section hit it ends with the lesson. */
  hint: string;
  href: string;
  /** Body excerpt around the match, for section hits that matched on text. */
  snippet?: string;
  score: number;
};

type Record_ = {
  kind: "lesson" | "section";
  label: string;
  hint: string;
  href: string;
  /** Title/heading, lowercased. */
  key: string;
  /** Body text, lowercased. */
  body: string;
  /** Body text in its original case, for excerpting. */
  bodyRaw: string;
  /** Ties a section back to its lesson so lesson hits can outrank it. */
  order: number;
};

/** Every readable string in a section, minus anything to do with its check. */
function sectionText(s: Section): string {
  const parts: string[] = [];
  for (const b of s.blocks) {
    if (b.type === "p" || b.type === "h2" || b.type === "callout") parts.push(b.text);
    else if (b.type === "ul") parts.push(b.items.join(" "));
    else if (b.type === "playground") parts.push(b.code);
  }
  return parts.join(" ");
}

/* The index is built twice, on purpose.
 *
 * Lesson titles come from the nav tree, which is already loaded — so the
 * palette opens with something in it and can match a lesson name before a
 * single extra byte is fetched. Section-body matching needs the prose, which
 * is 566 KB and used to ride along on every first visit for a feature most
 * readers never open. loadSearchIndex() pulls it in the first time the palette
 * is opened, and the index is rebuilt with sections included.
 *
 * A node whose sections carry no `blocks` is the nav tree, so section rows are
 * simply skipped — which is what makes one builder serve both passes. */
type IndexNode = {
  id: string;
  label: string;
  lesson?: { title: string; kicker?: string; sections: { id: string; heading: string; blocks?: Block[] }[] };
  children?: IndexNode[];
};

function buildIndex(nodes: IndexNode[]): Record_[] {
  const out: Record_[] = [];
  let order = 0;

  const walk = (nodes: IndexNode[]) => {
    for (const n of nodes) {
      if (n.lesson) {
        /* Just the immediate parent, not the whole trail. "Microeconomics /
         * Supply & demand / Elasticity" is three quarters of a narrow screen
         * spent on context nobody asked for — and it used to crowd the lesson
         * title, the one thing being scanned, down to a couple of letters. */
        const trail = breadcrumbFor(n.id);
        const parents = trail.at(-2) ?? "";
        const href = pathForId(n.id);
        const kicker = n.lesson.kicker ?? "";

        out.push({
          kind: "lesson",
          label: n.lesson.title,
          hint: parents,
          href,
          key: n.lesson.title.toLowerCase(),
          body: kicker.toLowerCase(),
          bodyRaw: kicker,
          order: order++,
        });

        for (const s of n.lesson.sections) {
          // Nav-only pass: no prose to index yet.
          if (!s.blocks) continue;
          const raw = sectionText(s as Section);
          out.push({
            kind: "section",
            label: s.heading,
            // A section is only meaningful next to the lesson it belongs to —
            // and the lesson alone is enough to place it.
            hint: n.lesson.title,
            href: `${href}#${s.id}`,
            key: s.heading.toLowerCase(),
            body: raw.toLowerCase(),
            bodyRaw: raw,
            order: order++,
          });
        }
      }
      if (n.children) walk(n.children);
    }
  };

  walk(nodes);
  return out;
}

/* Starts as titles only; loadSearchIndex() replaces it with the full thing. */
let INDEX: Record_[] = buildIndex(COURSE as unknown as IndexNode[]);
let loaded = false;
let loading: Promise<void> | null = null;

/** Whether section bodies are searchable yet. */
export function searchIndexReady(): boolean {
  return loaded;
}

/**
 * Pulls in the lesson prose and rebuilds the index with section bodies.
 * Safe to call repeatedly and concurrently — the work happens once.
 */
export function loadSearchIndex(): Promise<void> {
  if (loaded) return Promise.resolve();
  loading ??= import("./course-data.json").then((mod) => {
    INDEX = buildIndex(mod.default as unknown as IndexNode[]);
    loaded = true;
  });
  return loading;
}

/** Lessons only, in course order — what the palette shows before you type. */
export const BROWSE: Hit[] = INDEX.filter((r) => r.kind === "lesson").map((r) => ({
  kind: r.kind,
  label: r.label,
  hint: r.hint,
  href: r.href,
  score: 0,
}));

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when `term` appears at the start of a word, not buried inside one. */
function hasWordStart(haystack: string, term: string): boolean {
  const i = haystack.indexOf(term);
  if (i < 0) return false;
  if (i === 0) return true;
  return !/[a-z0-9]/.test(haystack[i - 1]);
}

/* An excerpt centred on the first match, so a hit shows the sentence that
 * earned it rather than the opening line of the section. */
function excerpt(raw: string, lower: string, terms: string[], width = 130): string | undefined {
  if (!raw) return undefined;
  let at = -1;
  for (const t of terms) {
    const i = lower.indexOf(t);
    if (i >= 0 && (at < 0 || i < at)) at = i;
  }
  if (at < 0) return undefined;

  let start = Math.max(0, at - Math.floor(width / 3));
  // Don't start mid-word.
  if (start > 0) {
    const space = raw.indexOf(" ", start);
    if (space > 0 && space - start < 20) start = space + 1;
  }
  const end = Math.min(raw.length, start + width);
  return (start > 0 ? "…" : "") + raw.slice(start, end).trim() + (end < raw.length ? "…" : "");
}

/** Split a match into plain/highlighted runs, for rendering <mark>s. */
export function highlight(text: string, query: string): { text: string; hit: boolean }[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [{ text, hit: false }];

  const re = new RegExp(`(${terms.map(escapeRe).join("|")})`, "gi");
  const parts = text.split(re);
  const wanted = new Set(terms);
  return parts
    .filter((p) => p !== "")
    .map((p) => ({ text: p, hit: wanted.has(p.toLowerCase()) }));
}

/**
 * Rank the course against a query. Every term must appear somewhere in the
 * record (AND), so "opportunity cost" doesn't drag in every mention of "cost".
 */
export function search(query: string, limit = 40): Hit[] {
  const q = query.trim().toLowerCase();
  if (!q) return BROWSE;
  const terms = q.split(/\s+/).filter(Boolean);

  const hits: Hit[] = [];

  for (const r of INDEX) {
    const all = `${r.key} ${r.body}`;
    if (!terms.every((t) => all.includes(t))) continue;

    let score = 0;

    // Whole-phrase matches are the strongest signal, and a title beats a
    // heading, which beats body text.
    if (r.key.includes(q)) score += r.kind === "lesson" ? 120 : 70;
    if (r.key.startsWith(q)) score += 40;
    if (r.body.includes(q)) score += 25;

    for (const t of terms) {
      if (r.key.includes(t)) score += hasWordStart(r.key, t) ? 14 : 7;
      if (r.body.includes(t)) score += hasWordStart(r.body, t) ? 5 : 2;
    }

    // A lesson and its own sections often both match; nudge the lesson up so
    // the landing page comes before its parts.
    if (r.kind === "lesson") score += 8;

    hits.push({
      kind: r.kind,
      label: r.label,
      hint: r.hint,
      href: r.href,
      snippet: r.kind === "section" ? excerpt(r.bodyRaw, r.body, terms) : undefined,
      score,
    });
  }

  // Stable within equal scores: course order, which INDEX is already in.
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}
