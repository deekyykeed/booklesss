"use client";

import { useMemo } from "react";
import { enrolledCourses } from "@/lib/courses";
import { useIdentity } from "@/lib/identity";
import { useProgress } from "@/lib/progress";
import { CoursesSection } from "./CoursesSection";

/* The courses grid, on its own tab.
 *
 * It used to be the bottom half of the home page. The 2026-08-27 sketch has one
 * list on the home screen and a row of destinations under it, so the grid moved
 * here rather than being archived with the page around it — this is the same
 * `CoursesSection`, with the same props, doing the same job. Tabs, drag-to-
 * reorder, the completed/active split and the demand signal all came with it
 * unchanged, because none of them was what changed.
 *
 * The four lines below are the whole of what `archive/HomeView.tsx` did to feed
 * it: the student's own courses, and the two progress readers it counts with.
 */
export function CoursesTab() {
  const { identity } = useIdentity();
  const { hydrated, doneCount, isComplete, days } = useProgress();
  const mine = useMemo(() => enrolledCourses(identity?.courses), [identity]);

  return (
    <div className="home-surface">
      <header className="home-head">
        <h1 className="home-title">Your courses</h1>
        <p className="home-sub">Everything on your timetable, and how far in you are.</p>
      </header>

      <CoursesSection
        mine={mine}
        hydrated={hydrated}
        doneCount={doneCount}
        isComplete={isComplete}
        days={days}
      />
    </div>
  );
}
