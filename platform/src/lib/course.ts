/* The Booklesss economics course. Content is authored in Supabase (courses →
 * nav_nodes → lessons) and mirrored into course-data.json by
 * scripts/gen-course.mjs (`npm run gen:course`). The reader consumes that JSON,
 * so the site stays fully static — Supabase is only touched at generation time.
 * Everything below (types + the routing/lookup index) is unchanged from when the
 * tree was an inline literal; only its source moved. */

import courseData from "./course-data.json";

/* A column in a `table` block. Numeric columns align right so figures stack by
 * their digits — the whole reason a working is a table and not a list. */
export type Column = { label: string; align?: "left" | "right" };

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "playground"; code: string }
  /* A display equation. Deliberately plain text rather than LaTeX: the finance
   * courses need ~20 formulas, none of which need a typesetting engine, and a
   * math bundle would cost more than it returns. `where` names every symbol —
   * a formula whose letters aren't defined on the same screen is decoration. */
  | { type: "formula"; text: string; where?: string[] }
  /* Anything with columns: cash-flow workings, waterfalls, comparisons. `total`
   * is a final row set off by a rule above it, for the figure the working was
   * building towards; `subtotals` marks intermediate rows that are ruled off
   * the same way (operating cash flow on the way to free cash flow). */
  | {
      type: "table";
      columns: Column[];
      rows: string[][];
      /** Indices into `rows` that are carried subtotals, not workings. */
      subtotals?: number[];
      total?: string[];
      note?: string;
    };

/* A section's comprehension check. Answering it correctly is what ticks that
 * checkpoint — the point being that a step is completed by demonstrating the
 * idea, not by asserting you read it.
 *
 * Optional on purpose: a section without one falls back to a plain "mark as
 * done" tick, so questions can be written gradually without the reader caring
 * which sections have them yet. */
export type Check = {
  question: string;
  /** Two to four choices; order is as authored. */
  options: string[];
  /** Index into `options`. */
  answer: number;
  /** Why the right answer is right — shown after answering, right or wrong. */
  explain: string;
};

export type Section = { id: string; heading: string; blocks: Block[]; check?: Check };
export type Lesson = { title: string; kicker?: string; sections: Section[] };

export type NavNode = {
  id: string;
  label: string;
  children?: NavNode[];
  lesson?: Lesson;
  defaultOpen?: boolean;
};

export const COURSE: NavNode[] = courseData as unknown as NavNode[];

/* ---- routing / lookup index (built once) ---------------------------- */
export const DEFAULT_LESSON = "what-is-economics";

type CourseIndex = {
  lessons: Map<string, Lesson>;
  labels: Map<string, string>;
  parents: Map<string, string | null>;
  depths: Map<string, number>;
  pathToId: Map<string, string>;
  idToPath: Map<string, string>;
  defaultOpen: Set<string>;
};

let cached: CourseIndex | null = null;

export function courseIndex(): CourseIndex {
  if (cached) return cached;
  const lessons = new Map<string, Lesson>();
  const labels = new Map<string, string>();
  const parents = new Map<string, string | null>();
  const depths = new Map<string, number>();
  const pathToId = new Map<string, string>();
  const idToPath = new Map<string, string>();
  const defaultOpen = new Set<string>();

  const walk = (list: NavNode[], parent: string | null, depth: number, trail: string[]) => {
    for (const n of list) {
      labels.set(n.id, n.label);
      parents.set(n.id, parent);
      depths.set(n.id, depth);
      const seg = [...trail, n.id];
      if (n.defaultOpen) defaultOpen.add(n.id);
      if (n.lesson) {
        lessons.set(n.id, n.lesson);
        const p = seg.join("/");
        pathToId.set(p, n.id);
        idToPath.set(n.id, p);
      }
      if (n.children) walk(n.children, n.id, depth + 1, seg);
    }
  };
  walk(COURSE, null, 0, []);
  cached = { lessons, labels, parents, depths, pathToId, idToPath, defaultOpen };
  return cached;
}

/** Human labels from the top of the tree down to (and including) a lesson. */
export function breadcrumbFor(id: string): string[] {
  const { labels } = courseIndex();
  const chain = [...ancestorsOf(id)].reverse().map((a) => labels.get(a) ?? a);
  chain.push(labels.get(id) ?? id);
  return chain;
}

export function ancestorsOf(id: string): string[] {
  const { parents } = courseIndex();
  const out: string[] = [];
  let cur = parents.get(id) ?? null;
  while (cur) { out.push(cur); cur = parents.get(cur) ?? null; }
  return out;
}

export function depthOf(id: string): number {
  return courseIndex().depths.get(id) ?? 0;
}

/** URL path (with leading slash) for a lesson id, e.g. "/microeconomics/supply-demand/law-of-demand". */
export function pathForId(id: string): string {
  return "/" + (courseIndex().idToPath.get(id) ?? "");
}

/** Lesson id for a catch-all slug array, or null if it isn't a real lesson. */
export function lessonIdForSlug(slug: string[]): string | null {
  return courseIndex().pathToId.get(slug.join("/")) ?? null;
}

/** Every lesson slug (for generateStaticParams). */
export function allLessonSlugs(): string[][] {
  return [...courseIndex().idToPath.values()].map((p) => p.split("/"));
}

/* ---- checkpoints ----------------------------------------------------- *
 * A step's checkpoints ARE its sections: one per section, in reading order.
 * Nothing extra to author — adding a section adds a checkpoint, so the ring
 * and the "on this page" list can never drift apart. */

/** Checkpoint ids for a lesson (its section ids), or [] if unknown. */
export function checkpointsFor(lessonId: string): string[] {
  return courseIndex().lessons.get(lessonId)?.sections.map((s) => s.id) ?? [];
}

/** Every lesson id beneath a nav node, in reading order. */
export function lessonsUnder(nodeId: string): string[] {
  const find = (list: NavNode[]): NavNode | null => {
    for (const n of list) {
      if (n.id === nodeId) return n;
      const hit = n.children ? find(n.children) : null;
      if (hit) return hit;
    }
    return null;
  };
  const out: string[] = [];
  const collect = (n: NavNode) => {
    if (n.lesson) out.push(n.id);
    n.children?.forEach(collect);
  };
  const node = find(COURSE);
  if (node) collect(node);
  return out;
}

/** Every checkpoint in the course — the denominator for overall progress. */
export function totalCheckpoints(): number {
  let n = 0;
  for (const id of courseIndex().idToPath.keys()) n += checkpointsFor(id).length;
  return n;
}

/** True when any of the lesson's sections carries a comprehension check. */
export function hasChecks(lessonId: string): boolean {
  return !!courseIndex().lessons.get(lessonId)?.sections.some((s) => s.check);
}

/** Every lesson id in reading order — the order they appear in the nav tree. */
export function orderedLessonIds(): string[] {
  return [...courseIndex().idToPath.keys()];
}

/** The next lesson in reading order, or null at the end of the course. */
export function nextLessonId(id: string): string | null {
  const order = orderedLessonIds();
  const i = order.indexOf(id);
  return i >= 0 && i < order.length - 1 ? order[i + 1] : null;
}

/** Human label for a lesson or folder id. */
export function labelFor(id: string): string {
  return courseIndex().labels.get(id) ?? id;
}
