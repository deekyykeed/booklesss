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

import { type MynaIconName } from "@/components/icons/myna";
import { type UltimateIconName } from "@/components/icons/ultimate";

export type NoteId = "hard" | "long" | "example" | "wrong" | "clear";

/* Each row carries its own mark, on the right (owner, 2026-08-07). `icon` is a
 * MynaUI Line name and the row draws its `-solid` twin when it is the answer
 * given — the same line-at-rest / solid-when-chosen pair the sidebar rows and
 * the two faces beside this menu use, so the mark says which answer the row is
 * AND whether it is the one selected. It replaces a tick that could only say
 * the second of those, in the slot where the first belonged.
 *
 * `clipboard` and `danger-triangle` are on purpose the same two marks the
 * Example and Watch-out callouts draw: one mark per idea across the reader.
 *
 * Both names are written out rather than the solid one being built as
 * `${icon}-solid`: a template literal is a plain string to the compiler, so
 * that spelling would let a missing twin through to render nothing at all.
 * Named separately, `MynaIconName` refuses at build time any pair the generator
 * has not actually emitted. */
/* `mark` is the THIRD field and it is a different job from the other two.
 * `icon`/`iconOn` are MynaUI, drawn on the menu's own rows, where a monochrome
 * outline beside a line of text is correct — a coloured fill in a list of five
 * would sit as heavy as the Duotone marks that were pulled out of this row on
 * 2026-08-02. `mark` is Streamline Ultimate Colors and is drawn in ONE place:
 * the collapsed flag, once a reason has been given (owner, 2026-08-08: "find
 * icons to replace the flag when I tap something, from the same set").
 *
 * So the same reason is a clipboard in both families, and that is the point —
 * the menu row and the flag it collapses to have to be recognisably the same
 * verdict. Adding a reason means adding all three, and the two type names are
 * what makes a half-done addition a build error rather than a blank space.
 * The picks, and the two the free set could not supply, are argued in
 * scripts/gen-ultimate-icons.mjs. */
export const NOTES: {
  id: NoteId;
  label: string;
  icon: MynaIconName;
  iconOn: MynaIconName;
  mark: UltimateIconName;
}[] = [
  { id: "clear", label: "Clear", icon: "lamp", iconOn: "lamp-solid", mark: "check" },
  { id: "hard", label: "Hard to follow", icon: "question-circle", iconOn: "question-circle-solid", mark: "question-help-message" },
  { id: "long", label: "Too long", icon: "clock-1", iconOn: "clock-1-solid", mark: "time-clock-circle" },
  { id: "example", label: "Needs an example", icon: "clipboard", iconOn: "clipboard-solid", mark: "task-list-text-1" },
  { id: "wrong", label: "Something looks wrong", icon: "danger-triangle", iconOn: "danger-triangle-solid", mark: "delete-2" },
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
