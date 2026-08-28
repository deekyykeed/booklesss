"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { MynaIcon, type MynaIconName } from "@/components/icons/myna";
import { Avatar } from "@/components/identity/avatars";
import { enrolledCourses } from "@/lib/courses";
import { useIdentity } from "@/lib/identity";
import { useProgress } from "@/lib/progress";
import { sessionsForCourse, type SessionRef } from "@/lib/session-nav";

/* ------------------------------------------------------------------ *
 * The left column of the dashboard shell.
 *
 * Its structure is the reference UI's, slot for slot: a wordmark row, a
 * highlighted "new" row, a short run of destinations, a titled list section,
 * and a user footer pinned to the bottom. What fills those slots is Booklesss.
 *
 * THE SESSION LIST TAKES THE RECENTS SLOT, which is the mapping that made the
 * whole port work. The reference puts a conversation history there; a session
 * is this app's equivalent unit — a thing you can pick up and do — and
 * `lib/session-nav` already derives one per lesson group from the tree every
 * course has. So the list filled itself the moment this file existed, for all
 * four courses, and a new course appears in it by being written normally.
 *
 * ⚠️ ICONS ARE MynaUI, NOT THE REFERENCE'S INLINE SPRITE. The reference drew
 * its own 20px paths because it had no icon system; this app has one, and
 * CLAUDE.md is explicit that MynaUI is the chrome. Every name used here was
 * already in `gen-icons.mjs`, so nothing had to be regenerated.
 * ------------------------------------------------------------------ */

type NavRow = {
  href: string;
  icon: MynaIconName;
  label: string;
  match: (path: string) => boolean;
};

const NAV: NavRow[] = [
  {
    href: "/dashboard",
    icon: "layout-dashboard",
    label: "Home",
    match: (p) => p === "/dashboard",
  },
  {
    href: "/dashboard/courses",
    icon: "book-open",
    label: "Courses",
    match: (p) => p.startsWith("/dashboard/courses"),
  },
  {
    href: "/dashboard/saved",
    icon: "bookmark",
    label: "Saved",
    match: (p) => p.startsWith("/dashboard/saved"),
  },
];

/** How many sessions the sidebar lists before it stops. */
const SHOWN = 8;

type Row = SessionRef & { course: string; courseTitle: string; done: number };

/**
 * The sessions worth listing, in the order they should be met.
 *
 * ROUND-ROBIN ACROSS COURSES, not course-by-course — the same rule the screen
 * this replaces used, and for the same reason. Treasury Management has 21
 * sessions and Strategic Management 3; concatenating them gives a student
 * taking both a sidebar that is eight rows of Treasury and no sign the second
 * course exists. Taking one from each course in turn makes the visible part of
 * the list a picture of the term.
 *
 * Within a course: the group already part-way through first, then the first
 * untouched one. Finished groups drop out — they stay reachable from the course
 * page, and a sidebar is not an archive.
 */
function pick(
  courses: { slug: string; title: string; unitIds: string[] }[],
  isComplete: (lessonId: string) => boolean,
  hydrated: boolean,
): Row[] {
  const queues = courses.map((c) => {
    const rows = sessionsForCourse(c.unitIds).map((s) => ({
      ...s,
      course: c.slug,
      courseTitle: c.title,
      done: hydrated ? s.stepIds.filter(isComplete).length : 0,
    }));
    const unfinished = rows.filter((r) => r.done < r.stepIds.length);
    return [...unfinished.filter((r) => r.done > 0), ...unfinished.filter((r) => r.done === 0)];
  });

  const out: Row[] = [];
  for (let i = 0; out.length < SHOWN; i++) {
    /* Every queue exhausted. Without this the loop spins forever once a
       student has finished everything. */
    if (queues.every((q) => i >= q.length)) break;
    for (const q of queues) {
      if (i < q.length && out.length < SHOWN) out.push(q[i]);
    }
  }
  return out;
}

export function ShellSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { identity, hydrated: idHydrated } = useIdentity();
  const { hydrated, isComplete } = useProgress();
  const path = usePathname() ?? "/dashboard";

  const mine = useMemo(() => enrolledCourses(identity?.courses), [identity]);
  const rows = useMemo(() => pick(mine, isComplete, hydrated), [mine, isComplete, hydrated]);

  /* TWO COURSES CAN NAME A GROUP THE SAME THING, and with the course itself
     nowhere on the row that produces two rows a student cannot tell apart —
     economics opens with "Getting started" and corporate finance with "Getting
     Started", which differ by one capital letter and nothing else. The course
     is appended only where a title is not unique in what is actually being
     shown, so the common case stays the single clean line the reference draws
     and the ambiguous one gets the word it needs. */
  const ambiguous = useMemo(() => {
    const seen = new Map<string, number>();
    for (const r of rows) {
      const k = r.title.trim().toLowerCase();
      seen.set(k, (seen.get(k) ?? 0) + 1);
    }
    return new Set([...seen].filter(([, n]) => n > 1).map(([k]) => k));
  }, [rows]);

  /* Both stores, because the list needs the courses AND the counts, and filling
     the two halves at different moments is the "dashboard that assembles itself
     in stages" this app has a rule against. */
  const ready = idHydrated && hydrated;

  /* The CHOSEN name only. `identity.name` is never empty — it is the assigned
     avatar's name until somebody types their own — so reading it without
     `nameChosen` is how a student ends up labelled "Astronaut". */
  const name = identity?.nameChosen ? identity.name.trim().split(/\s+/)[0] : null;

  return (
    <aside
      className="shell-side"
      id="shell-sidebar"
      /* Delegated, so every row — including any added later — closes the
         drawer behind it without being wired up individually. Anything that is
         not a link (the section heading, the empty line) falls through. */
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) onNavigate?.();
      }}
    >
      <div className="shell-side-head">
        <Link href="/dashboard" className="shell-wordmark">
          Bklsss
        </Link>
      </div>

      <div className="shell-side-body no-scrollbar">
        <div className="shell-rows">
          {/* The reference's highlighted first row. Here it starts a call
              rather than a chat, which is this app's equivalent gesture — and
              it is a link to the home pane, where the composer lives, rather
              than a second control that would need its own copy of the call. */}
          <Link href="/dashboard" className="shell-row shell-row-new">
            <span className="shell-slot">
              <MynaIcon name="plus" size={16} />
            </span>
            <span className="shell-label">New session</span>
          </Link>

          {NAV.map((r) => {
            const current = r.match(path);
            return (
              <Link
                key={r.href}
                href={r.href}
                className="shell-row"
                aria-current={current ? "page" : undefined}
                data-current={current || undefined}
              >
                <span className="shell-slot">
                  <MynaIcon
                    name={(current ? `${r.icon}-solid` : r.icon) as MynaIconName}
                    size={20}
                  />
                </span>
                <span className="shell-label">{r.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="shell-sec">
          <div className="shell-sec-head">
            <span>Your sessions</span>
          </div>

          {!ready ? (
            <ul className="shell-list" aria-hidden>
              {[0, 1, 2].map((i) => (
                <li key={i} className="shell-list-ghost">
                  <span className="ghost-line" style={{ width: `${72 - i * 12}%` }} />
                </li>
              ))}
            </ul>
          ) : rows.length ? (
            <ul className="shell-list">
              {rows.map((r) => (
                <li key={r.course + "/" + r.id}>
                  <Link
                    href={r.path}
                    className="shell-row shell-row-session"
                    title={`${r.title} — ${r.courseTitle}`}
                  >
                    <span className="shell-label">{r.title}</span>
                    {ambiguous.has(r.title.trim().toLowerCase()) ? (
                      <span className="shell-row-course">{r.courseTitle}</span>
                    ) : null}
                    {r.done ? (
                      <span className="shell-row-count">
                        {r.done}/{r.stepIds.length}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="shell-empty">
              {mine.length ? "Every session is done." : "No courses on your record yet."}
            </p>
          )}
        </div>
      </div>

      <div className="shell-side-foot">
        <div className="shell-hairline" />
        <Link href="/settings" className="shell-user">
          <span className="shell-user-face">
            <Avatar id={identity?.avatar ?? ""} size={24} />
          </span>
          <span className="shell-user-name">{name ?? "Your account"}</span>
          <MynaIcon name="chevron-right" size={14} />
        </Link>
      </div>
    </aside>
  );
}
