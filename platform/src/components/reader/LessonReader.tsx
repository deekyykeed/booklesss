"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { Lesson } from "@/lib/course";
import { LessonView } from "./LessonView";
import { useReaderShell } from "./MobileNav";
import { scrollToSection } from "@/lib/scroll-to-section";

// Per-lesson content. The "on this page" TOC now lives in the persistent right
// panel, so this route just renders the reading column and publishes its
// sections to the shell for that panel to pick up. Remounts on navigation (each
// lesson is its own route); the persistent chrome lives in the layout.
export function LessonReader({ lesson, lessonId }: { lesson: Lesson; lessonId: string }) {
  const { setLesson } = useReaderShell();
  const pathname = usePathname();

  // Publish this lesson's id + sections for the right panel's TOC, scroll-spy
  // and progress ring.
  useEffect(() => {
    setLesson(lessonId, lesson.sections);
    return () => setLesson(null, null);
  }, [lesson, lessonId, setLesson]);

  // A new lesson opens at the top. The content surface is the scroll container
  // on desktop and persists across routes, so reset it explicitly; on mobile the
  // document itself scrolls. Runs before the fade so the text doesn't animate in
  // halfway down the previous scroll position.
  //
  // Unless we arrived at a section anchor — from a search hit, or a shared
  // link — in which case that section is the point, so go there instead.
  // Instant rather than smooth: a fresh page shouldn't animate past content
  // the reader never asked to see.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && scrollToSection(hash, "auto")) return;
    document.getElementById("content-surface")?.scrollTo({ top: 0 });
    if (window.matchMedia("(max-width: 767px)").matches) window.scrollTo(0, 0);
  }, [pathname]);

  return (
    // key={pathname} makes this a fresh element each lesson, so .lesson-fade
    // replays the quick fade + de-blur on every navigation (the segment file is
    // shared across lessons, so React would otherwise reconcile and not replay).
    // maxWidth inline rather than a Tailwind arbitrary class — the scanner has
    // silently dropped several of those. px-4 (16px) so the content sits close to
    // the surface edges on mobile.
    <div key={pathname} className="lesson-fade mx-auto px-4 py-10 md:px-6" style={{ maxWidth: 720 }}>
      <div className="min-w-0 pb-[40vh]">
        <LessonView lesson={lesson} lessonId={lessonId} />
      </div>
    </div>
  );
}
