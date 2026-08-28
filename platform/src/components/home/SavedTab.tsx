"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { PlumpIcon } from "@/components/icons/plump";
import { labelFor, nodeById, pathForId } from "@/lib/course";
import { savedServerSnapshot, savedSnapshot, subscribeSaved } from "@/lib/saved";

/* Everything a student pressed Save on, in one place.
 *
 * Save has existed since 2026-08-09 and has never had a page: a section could
 * be saved and then only found again by scrolling back to it, which is most of
 * a bookmark's value missing. The 2026-08-27 dock has four destinations either
 * side of the call button, and this is the one that was already paid for —
 * `lib/saved` holds the records, `lib/state-sync` already carries them between
 * a student's devices, and nothing new had to be stored to draw them.
 *
 * ⚠️ IT READS `savedSnapshot`, NOT `allSaved`. The latter parses JSON and
 * returns a fresh object every call, which is not a legal
 * `useSyncExternalStore` getter — a snapshot that never compares equal to the
 * last one re-renders forever. Nothing noticed for as long as the only reader
 * was `savedFor`, which returns a boolean. See the note in lib/saved.
 *
 * `savedServerSnapshot` is what the server renders and what the first client
 * pass matches: an empty store, so this page draws its placeholder and swaps
 * once — the same "count the states, three is a glitch and two is a load" rule
 * the rest of the app follows.
 */
/* Two module constants, not inline arrows: `useSyncExternalStore` calls its
 * getter on every render and compares the result, so an arrow written in place
 * is a new function each time — harmless for a boolean, and exactly the habit
 * that produced the object-identity bug this file's header describes. */
const TRUE = () => true;
const FALSE = () => false;

export function SavedTab() {
  const store = useSyncExternalStore(subscribeSaved, savedSnapshot, savedServerSnapshot);
  /* The store is `{}` both before the device has been read and when a student
     genuinely has nothing saved, so it cannot say on its own which of the two
     is true — the same problem `hydrated` solves everywhere else in this app.
     One frame of placeholder is the honest answer; `useSyncExternalStore` gives
     the server snapshot on the first client render and the real one on the
     next, so this is exactly one swap. */
  const hydrated = useSyncExternalStore(subscribeSaved, TRUE, FALSE);

  /* Resolved against the CURRENT tree, not against what was stored. A section
     removed or renamed upstream simply stops appearing, the same way
     `doneCount` counts against a lesson's current checkpoints — a bookmark
     pointing at a heading that no longer exists is worse than one fewer row. */
  const rows = useMemo(() => {
    return Object.entries(store).flatMap(([lessonId, sections]) => {
      const node = nodeById(lessonId);
      if (!node?.lesson) return [];
      const path = pathForId(lessonId);
      return node.lesson.sections
        .filter((s) => sections[s.id])
        .map((s) => ({
          key: lessonId + "/" + s.id,
          heading: s.heading,
          step: labelFor(lessonId),
          href: path + "#" + s.id,
        }));
    });
  }, [store]);

  return (
    <div className="home-surface">
      <header className="home-head">
        <h1 className="home-title">Saved</h1>
        <p className="home-sub">The sections you kept, in course order.</p>
      </header>

      {!hydrated ? (
        <ul className="home-cards" aria-hidden>
          {[0, 1].map((i) => (
            <li key={i}>
              <div className="home-card home-card-ghost">
                <span className="ghost-line" style={{ width: "34%" }} />
                <span className="ghost-line ghost-lg" style={{ width: "68%" }} />
              </div>
            </li>
          ))}
        </ul>
      ) : rows.length ? (
        <ul className="home-cards">
          {rows.map((r) => (
            <li key={r.key}>
              <Link href={r.href} className="home-card">
                <span className="home-card-kicker">{r.step}</span>
                <span className="home-card-title">{r.heading}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="home-empty">
          <PlumpIcon
            name="bookmark"
            size={44}
            light="var(--color-home-sunk)"
            dark="var(--color-placeholder)"
          />
          <p className="home-empty-line">Nothing saved yet.</p>
          <Link href="/dashboard" className="home-empty-cta">
            Back to your sessions
          </Link>
        </div>
      )}
    </div>
  );
}
