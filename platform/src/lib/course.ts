/* The Booklesss economics course. Content is authored in Supabase (courses →
 * nav_nodes → lessons) and mirrored into course-data.json by
 * scripts/gen-course.mjs (`npm run gen:course`). The reader consumes that JSON,
 * so the site stays fully static — Supabase is only touched at generation time.
 * Everything below (types + the routing/lookup index) is unchanged from when the
 * tree was an inline literal; only its source moved. */

import courseData from "./course-data.json";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "playground"; code: string };

export type Section = { id: string; heading: string; blocks: Block[] };
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
