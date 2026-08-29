/* ------------------------------------------------------------------ *
 * RESOURCE PACKS — what a student hands the agent as context.
 *
 * A pack is a named collection of PDFs a student has saved or imported over
 * time: their own lecture handouts, a textbook chapter, a set of worked
 * solutions. Before a session they pick which packs are in play, and the agent
 * explains against those rather than against general knowledge.
 *
 * ⚠️ THE PACKS BELOW ARE PLACEHOLDER DATA AND THE REAL ONES DO NOT EXIST YET.
 * Nothing in this app stores an uploaded PDF today — there is no table, no
 * bucket, and no import path. This module is the SEAM: the modal reads
 * `listPacks()` and nothing else, so wiring it to real storage is a change to
 * this file rather than to the UI.
 *
 * When that happens, the shape below is what the storage has to answer with,
 * and two things about it are load-bearing:
 *   · `count` is a number of FILES, not of pages or bytes. It is the only
 *     quantity shown, because it is the only one a student can verify at a
 *     glance against what they remember uploading.
 *   · `id` is what gets persisted in a student's selection. Keep them stable
 *     across renames — a pack renamed should stay selected, and a selection
 *     that silently empties is worse than one that shows a stale name.
 *
 * ⚠️ NO COURSE CODES AND NO SCHOOL NAMES IN A PACK TITLE. Standing rule, and
 * these strings are drawn on screen.
 * ------------------------------------------------------------------ */

export type ResourcePack = {
  /** Stable across renames — this is what a saved selection stores. */
  id: string;
  name: string;
  /** One line on what is in it. Shown under the name, clamped to two lines. */
  blurb: string;
  /** How many files. Not pages, not bytes. */
  count: number;
};

/* Placeholder set. Deliberately mixed — some packs are a course's own
   material, some are the student's own notes, some are shared — because a
   picker that only ever shows one kind of row hides the cases that will
   actually break the layout (a long name, a pack of one, a pack of forty). */
const PLACEHOLDER: ResourcePack[] = [
  {
    id: "cf-handouts",
    name: "Corporate Finance handouts",
    blurb: "Lecture slides and the worked examples given out in class.",
    count: 12,
  },
  {
    id: "treasury-notes",
    name: "Treasury Management notes",
    blurb: "Everything from the term, including the tutorial answers.",
    count: 41,
  },
  {
    id: "my-summaries",
    name: "My own summaries",
    blurb: "Notes typed up after each session.",
    count: 7,
  },
  {
    id: "strategy-readings",
    name: "Strategic Management readings",
    blurb: "The case studies and the two chapters they came from.",
    count: 5,
  },
  {
    id: "formula-sheet",
    name: "Formula sheet",
    blurb: "One page, every formula worth having in front of you.",
    count: 1,
  },
  {
    id: "econ-textbook",
    name: "Economics textbook",
    blurb: "Scanned chapters, split by topic.",
    count: 23,
  },
];

/** The packs a student can choose from. Async on purpose: the real one is a
 *  fetch, and a caller written against a synchronous list would have to be
 *  rewritten rather than repointed. */
export async function listPacks(): Promise<ResourcePack[]> {
  return PLACEHOLDER;
}

/** Synchronous view, for first paint. Drop this when the packs become real —
 *  it exists so the modal has something to draw before a fetch would land. */
export function packsSnapshot(): ResourcePack[] {
  return PLACEHOLDER;
}
