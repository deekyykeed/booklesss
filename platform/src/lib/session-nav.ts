/* A SESSION is a guided call, and this file is the list of them.
 *
 * The reader's unit of work used to be a step you read. A session is a unit of
 * work you LISTEN to: a voice agent walks you through a run of related steps
 * while the points worth keeping pin themselves to the screen, and you take
 * your own notes beside them. Owner's call, 2026-08-21 — the reading was long
 * and the sessions were longer, and "when I'm reading I'm only reading
 * important things that I need to read" is a description of the pinned points,
 * not of a step page.
 *
 * A session is ONE LESSON GROUP — a folder in the sidebar, covering the steps
 * directly inside it. That granularity is the owner's pick and it is the one
 * that makes the arithmetic work: Treasury's 60 steps sit in 21 groups, which
 * is ~3 steps a call, which is the 10-15 minutes a person will actually sit
 * through. A step alone (~5 min) spends more time connecting than teaching; a
 * whole unit (~35 min) is a lecture, which is the thing being replaced.
 *
 * NOTHING WAS RE-AUTHORED TO GET HERE. A session is derived from the tree the
 * course already has, so all four courses had sessions the day this shipped and
 * a new course gets them by being written normally.
 *
 * This module is CLIENT-SAFE: it reads course-nav.json (headings and ids, no
 * prose) exactly like lib/course.ts does, so a "Listen" button costs the same
 * as the "Read" button beside it. The prose half — what the agent actually
 * teaches from — is server-only and lives in lib/session.ts.
 */
import { COURSE, ancestorsOf, type NavNode } from "./course";

export type SessionRef = {
  /** The nav node id of the group. */
  id: string;
  /** The group's own label: "The Treasury Function". */
  title: string;
  /** Its parent's label, drawn above the title: "Treasury Operations". */
  kicker?: string;
  /** URL path for the call, e.g. "/study/treasury-management/…/the-treasury-function". */
  path: string;
  /** The steps this call covers, in order. */
  stepIds: string[];
  /** Section count across those steps — one concept each, post-D-18. */
  sections: number;
  /** Rounded talk time. See estimate() for why it is a guess and stays one. */
  minutes: number;
};

/* Roughly a minute and a half of talk per section, floored at six.
 *
 * Deliberately estimated from the STRUCTURE rather than the word count: the
 * word count lives in course-data.json, which is server-only, and a number
 * that can only be computed on the server cannot be drawn on a course card
 * without shipping the whole course to the browser to get it. The label says
 * "~12 min" for that reason — it is an honest approximation of how long a
 * person will be here, not a measurement of the audio, which does not exist
 * until the agent speaks it. */
function estimate(sections: number): number {
  return Math.max(6, Math.round(sections * 1.6));
}

type Indexed = { refs: Map<string, SessionRef>; order: string[]; forLesson: Map<string, string> };

let cached: Indexed | null = null;

function build(): Indexed {
  const refs = new Map<string, SessionRef>();
  const order: string[] = [];
  const forLesson = new Map<string, string>();

  const walk = (nodes: NavNode[], trail: string[], parentLabel?: string) => {
    for (const n of nodes) {
      const seg = [...trail, n.id];
      const kids = n.children ?? [];
      const steps = kids.filter((c) => c.lesson);

      /* A group qualifies as a session when steps sit DIRECTLY inside it. A
       * node holding only other folders is scaffolding — it would otherwise
       * produce a session that is really several sessions wearing one name. */
      if (steps.length) {
        const stepIds = steps.map((s) => s.id);
        const sections = steps.reduce((n2, s) => n2 + (s.lesson?.sections.length ?? 0), 0);
        refs.set(n.id, {
          id: n.id,
          title: n.label,
          kicker: parentLabel,
          path: "/study/" + seg.join("/"),
          stepIds,
          sections,
          minutes: estimate(sections),
        });
        order.push(n.id);
        for (const s of stepIds) forLesson.set(s, n.id);
      }
      if (kids.length) walk(kids, seg, n.label);
    }
  };

  walk(COURSE, [], undefined);
  return (cached = { refs, order, forLesson });
}

function index(): Indexed {
  return cached ?? build();
}

/** Every session, in course order. */
export function allSessions(): SessionRef[] {
  const { refs, order } = index();
  return order.map((id) => refs.get(id)!).filter(Boolean);
}

export function sessionRef(id: string): SessionRef | undefined {
  return index().refs.get(id);
}

/** The session covering a given step — for the "listen instead" offer on a step page. */
export function sessionForLesson(lessonId: string): SessionRef | undefined {
  const { forLesson, refs } = index();
  const id = forLesson.get(lessonId);
  return id ? refs.get(id) : undefined;
}

/** Session id for a catch-all slug array, or null when the path isn't one. */
export function sessionIdForSlug(slug: string[]): string | null {
  const want = "/study/" + slug.join("/");
  for (const ref of index().refs.values()) if (ref.path === want) return ref.id;
  return null;
}

/** Every session slug, for generateStaticParams. */
export function allSessionSlugs(): string[][] {
  return allSessions().map((s) => s.path.replace(/^\/study\//, "").split("/"));
}

/* The sessions inside one unit, in order.
 *
 * The dashboard lists a course as units with a FLAT run of steps under each,
 * which skips the level a session lives at — Treasury's five units hold
 * twenty-one groups between them. This is what puts that level back where it
 * is needed, without the dashboard having to know how the tree is shaped.
 *
 * Includes the unit itself when steps sit directly inside it, which is the
 * common case in the smaller courses: there, unit and session are one node. */
export function sessionsUnder(unitId: string): SessionRef[] {
  return allSessions().filter((s) => s.id === unitId || ancestorsOf(s.id).includes(unitId));
}

/** The sessions belonging to one course, given that course's unit node ids. */
export function sessionsForCourse(unitIds: string[]): SessionRef[] {
  const roots = new Set(unitIds);
  return allSessions().filter((s) => {
    const first = s.path.replace(/^\/study\//, "").split("/")[0];
    return roots.has(first) || roots.has(s.id);
  });
}
