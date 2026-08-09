/* What a reader thought of a section, in their own taps.
 *
 * The checkpoint already asks what they want to DO about a section ("Later" or
 * "Got it"). This asks the different question: how the writing landed. They are
 * not the same thing, and the second one is the one the step can act on — a
 * reader who understood a section and had to read it three times to get there
 * has told us something no completion figure will.
 *
 * Device-local, like progress. There is no account and no endpoint yet, so this
 * is a collection point rather than a pipeline: the notes accumulate under one
 * key, and `allNotes()` hands the lot over whenever there is somewhere to send
 * them. Storing them now costs nothing and means the first weeks of reading are
 * not lost when that endpoint arrives.
 *
 * The options map onto the rules in .claude/skills/step-skill/RULES.md, so a
 * tally points at a specific rule rather than at a mood:
 *   hard      → W-3 / W-12   the writing, or a sentence doing two jobs
 *   long      → S-8 / W-2    the step, or the section, is too much at once
 *   example   → C-5 / C-3    definition end to end, nothing concrete
 *   wrong     → E-7          a figure or a method looks wrong: urgent
 *   clear     → the "keep" signal, so a rewrite doesn't delete what worked
 */

import { type SolarIconName } from "@/components/icons/solar";

export type NoteId = "hard" | "long" | "example" | "wrong" | "clear";

/* Each row carries its own mark, on the right (owner, 2026-08-07). The mark says
 * which answer the row IS and, by whether it carries colour, whether it is the
 * one selected — replacing a tick that could only ever say the second of those,
 * in the slot where the first belonged.
 *
 * The pair it used to draw was a MynaUI outline and its `-solid` twin, both
 * written out longhand rather than built as `${icon}-solid`, because a template
 * literal is a plain string to the compiler and would have let a missing twin
 * render nothing at all. That whole mechanism is gone: one name per reason now,
 * with the chosen/unchosen states drawn by the generator instead of named here. */
/* ONE MARK PER REASON, drawn in two places: the menu row that offers it, and the
 * collapsed flag once it has been given. Both are the same picture on purpose —
 * that is what lets a reader recognise a verdict later without reopening the
 * menu.
 *
 * `icon`/`iconOn` (MynaUI, an outline and its solid twin) were here until
 * 2026-08-08 and are gone rather than left in place: nothing drew them once the
 * menu moved to this family, and a dead field with a "keep in step with" story
 * attached is exactly the drift that makes the next addition half-done. The
 * MynaUI names are recoverable from git if a monochrome fallback is ever wanted.
 *
 * SOLAR as of 2026-08-09 evening (owner: "for the flag thing use solar line
 * broken and then go solar duotone when selected"), Tabler for the afternoon
 * before it, Freehand and Ultimate Colors earlier the same day. The flag
 * collapses into one of these marks, so the menu could not stay in a different
 * family than the button that draws from it — that rule has now carried the
 * whole control through four families in one day.
 *
 * TWO NAMES PER REASON, LONGHAND, and the reason is a rule this file already
 * learned once with MynaUI's `-solid` twins: a template literal
 * (`${mark}-bold-duotone`) is a plain string to the compiler, and a missing
 * twin would render nothing with no error. Written out, `SolarIconName` makes
 * a typo or an absent style a build error. `mark` is the "-broken" style — a
 * stroke drawing with a gap in its line, greyed through currentColor at rest —
 * and `markOn` is "-bold-duotone", two currentColor fills with the back one at
 * half opacity, which is what "selected" looks like in this family.
 *
 * Every reason keeps the picture it had under Tabler — bulb, question mark,
 * clock, clipboard, warning triangle — because Solar draws all five. Only the
 * hand changed. */
export const NOTES: {
  id: NoteId;
  label: string;
  mark: SolarIconName;
  markOn: SolarIconName;
}[] = [
  { id: "clear", label: "Clear", mark: "lightbulb-broken", markOn: "lightbulb-bold-duotone" },
  { id: "hard", label: "Hard to follow", mark: "question-circle-broken", markOn: "question-circle-bold-duotone" },
  { id: "long", label: "Too long", mark: "clock-circle-broken", markOn: "clock-circle-bold-duotone" },
  { id: "example", label: "Needs an example", mark: "clipboard-text-broken", markOn: "clipboard-text-bold-duotone" },
  { id: "wrong", label: "Something looks wrong", mark: "danger-triangle-broken", markOn: "danger-triangle-bold-duotone" },
];

const KEY = "booklesss:step-notes:v1";

/** noteId, by section id, by lesson id. */
type Store = Record<string, Record<string, NoteId>>;

function read(): Store {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Store;
  } catch {
    return {}; // private mode, or someone else's key
  }
}

function write(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* out of quota or private mode: losing a note is not worth a crash */
  }
}

/* ------------------------------------------------------------------ *
 * Who is watching. localStorage is an external mutable store, so a component
 * reading it needs to be told when it changes rather than copying it into
 * state inside an effect — that copy is a cascading render, and the lint rule
 * that refuses it is right. Same shape as lib/identity and lib/progress, which
 * both solved this first.
 * ------------------------------------------------------------------ */
const listeners = new Set<() => void>();

/** For useSyncExternalStore. Returns the unsubscribe, as it must. */
export function subscribeNotes(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function noteFor(lessonId: string, sectionId: string): NoteId | null {
  /* A PRIMITIVE, which is what makes this safe as a snapshot:
     useSyncExternalStore compares snapshots by identity and would loop forever
     on a fresh object each call. A NoteId or null cannot do that. */
  return read()[lessonId]?.[sectionId] ?? null;
}

/** Set a note, or clear it by passing the one already stored. */
export function setNote(lessonId: string, sectionId: string, note: NoteId | null) {
  const s = read();
  const forLesson = { ...(s[lessonId] ?? {}) };
  if (note === null) delete forLesson[sectionId];
  else forLesson[sectionId] = note;
  s[lessonId] = forLesson;
  write(s);
  for (const fn of listeners) fn();
}

/** Everything collected on this device, for whenever there is somewhere to
 *  send it. */
export function allNotes(): Store {
  return read();
}
