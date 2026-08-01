"use client";

import { useSyncExternalStore } from "react";
import { resolveAvatar, type AvatarId } from "@/components/identity/avatars";
import { isSchoolChoice, OTHER_SCHOOL, type SchoolChoice } from "@/lib/schools";

/* ------------------------------------------------------------------ *
 * Who is reading — a name, a face, a school and the courses they're taking,
 * asked once and kept on the device.
 *
 * With Clerk switched off there is no account to hang a student off, and a
 * reader who has just landed on a lesson is the worst possible moment to ask
 * for an email. So the app asks for the things it actually needs to address
 * someone and show them their own dashboard — never an email, never a
 * password — and stores them locally.
 *
 * School and courses earn their place by changing what the reader sees: a
 * student at ZCAS taking two courses gets those two on their home page, their
 * progress measured against those two, and no scrolling past a course they
 * will never open. Nothing else in the app is gated on them.
 *
 * Same store shape as progress.tsx and for the same reason: localStorage is an
 * external mutable store that doesn't exist during SSR, so this is a
 * useSyncExternalStore store rather than state-plus-an-effect. The server
 * snapshot is "nobody yet", and the real one swaps in after mount with no
 * hydration mismatch.
 *
 * `id` is a random per-device string, not a user id — it exists so that when
 * there IS a server to sync to, the rows written from this device can be
 * matched up. Nothing keys off it yet; progress deliberately stays on its own
 * unscoped key, because rescoping it now would read as wiping the ticks a
 * reader already has.
 * ------------------------------------------------------------------ */

const KEY = "booklesss:identity:v1";

export type Identity = {
  /** What to call them. Trimmed, never empty — the popup won't submit blank. */
  name: string;
  avatar: AvatarId;
  /** Where they study. `null` on records written before the form asked, and on
   *  any record naming a school this build no longer carries. */
  school: SchoolChoice | null;
  /** The university they typed when theirs wasn't on the list. Set only
   *  alongside `school: "other"` — a demand signal for where to go next, and
   *  the only free text this app stores about anybody. */
  schoolName: string | null;
  /** Course slugs they're taking, as in course-index.json. Empty means "not
   *  answered yet" — the gate reads it that way and asks. */
  courses: string[];
  /** Random, per device. See the note above. */
  id: string;
  /** ISO date the identity was created, for a later "member since". */
  since: string;
};

let cache: Identity | null = null;
let read = false;
const listeners = new Set<() => void>();

function load(): Identity | null {
  if (read) return cache;
  read = true;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Identity>;
    // A stored record with no name is not an identity — treat it as unset so
    // the popup asks again rather than greeting an empty string.
    if (!v || typeof v.name !== "string" || !v.name.trim()) return null;
    cache = {
      name: v.name.trim(),
      // The avatar set has changed once already (Plump → Kameleon), so a
      // stored id is only kept if this build still draws it.
      avatar: resolveAvatar(v.avatar),
      school: isSchoolChoice(v.school) ? v.school : null,
      schoolName: typeof v.schoolName === "string" && v.schoolName.trim() ? v.schoolName.trim() : null,
      // Course slugs are validated where they're used (lib/courses), not here:
      // this module loads on every page and has no business pulling the course
      // tree in to check a list of strings.
      courses: Array.isArray(v.courses) ? v.courses.filter((c) => typeof c === "string") : [],
      id: typeof v.id === "string" ? v.id : newId(),
      since: typeof v.since === "string" ? v.since : new Date().toISOString(),
    };
  } catch {
    // Unparseable or storage blocked (private mode, embedded webview) — the
    // app runs fine unidentified, so fall back rather than throw.
    cache = null;
  }
  return cache;
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  // Another tab writing the same key is the same person changing their name.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      invalidate();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

/* The snapshot carries `hydrated` for the same reason progress.tsx's does:
 * "nobody has said who they are" and "localStorage hasn't been read yet" are
 * both `null`, and only one of them should open a modal. Reading it off the
 * snapshot keeps that out of an effect, so nothing re-renders to find out. */
type Snapshot = { identity: Identity | null; hydrated: boolean };

const EMPTY: Snapshot = { identity: null, hydrated: false };
let snapshot: Snapshot = EMPTY;

function getSnapshot(): Snapshot {
  if (!snapshot.hydrated) snapshot = { identity: load(), hydrated: true };
  return snapshot;
}

function invalidate() {
  read = false;
  cache = null;
  snapshot = EMPTY;
}

/** The reader, plus whether that answer is the stored one yet. */
export function useIdentity(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

/** Saves everything the form asked. Keeps `id` and `since` across later edits. */
export function saveIdentity(input: {
  name: string;
  avatar: AvatarId;
  school: SchoolChoice | null;
  schoolName: string | null;
  courses: string[];
}): Identity {
  const prev = load();
  const next: Identity = {
    name: input.name.trim(),
    avatar: input.avatar,
    school: input.school,
    // Only "other" carries a typed name; picking a listed school later must
    // not leave the old one behind to be read as their university.
    schoolName: input.school === OTHER_SCHOOL ? (input.schoolName?.trim() || null) : null,
    // Deduplicated so a double tap in the picker can't enrol anyone twice.
    courses: [...new Set(input.courses)],
    id: prev?.id ?? newId(),
    since: prev?.since ?? new Date().toISOString(),
  };
  cache = next;
  read = true;
  snapshot = { identity: next, hydrated: true };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: they stay identified for this session and get asked
    // again next visit. Better than blocking the reader on a failed write.
  }
  emit();
  return next;
}

/** Erases the identity from this device. Used by Settings' "forget this
 *  device", which pairs it with clearProgress() and a reload — every store on
 *  the page is holding a copy of what this just deleted. */
export function clearIdentity(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: nothing was stored to remove.
  }
  invalidate();
  emit();
}

/** Up to two letters for the fallback monogram — "Deeky Mvula" -> "DM". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
