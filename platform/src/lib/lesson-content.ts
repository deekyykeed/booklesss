import type { Lesson } from "./course";
import courseData from "./course-data.json";

/* The lesson prose, server-side only.
 *
 * Importing course-data.json from anywhere a client component can reach puts
 * the entire course text back into the browser bundle — 566 KB — which is
 * exactly what splitting the data exists to prevent. The guard below makes
 * that regression loud instead of silent: any page that pulls this module
 * client-side fails on first render rather than quietly growing by a third.
 *
 * The `server-only` package would catch it at build time instead, which is
 * better, but it isn't a declared dependency here and package.json currently
 * carries another session's changes. Worth switching to when that settles.
 *
 * The reader route calls this for the one lesson being rendered and passes it
 * down as a prop, so each page carries its own text and nothing else's. */
if (typeof window !== "undefined") {
  throw new Error(
    "lesson-content.ts is server-only — importing it from a client component " +
      "ships the whole course to the browser. Use lib/course.ts for nav data.",
  );
}

type Node = {
  id: string;
  lesson?: Lesson;
  children?: Node[];
};

let index: Map<string, Lesson> | null = null;

function build(): Map<string, Lesson> {
  const out = new Map<string, Lesson>();
  const walk = (nodes: Node[]) => {
    for (const n of nodes) {
      if (n.lesson) out.set(n.id, n.lesson);
      if (n.children) walk(n.children);
    }
  };
  walk(courseData as unknown as Node[]);
  return out;
}

/** The full lesson, prose and all. Undefined for a node that isn't a lesson. */
export function lessonContent(id: string): Lesson | undefined {
  index ??= build();
  return index.get(id);
}
