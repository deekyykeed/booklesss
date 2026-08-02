"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { Lesson } from "@/lib/course";
import { LessonView } from "./LessonView";
import { useReaderShell } from "./MobileNav";
import { scrollToSection } from "@/lib/scroll-to-section";
import { restorePosition, savePosition } from "@/lib/reading-position";

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

  /* Where the step opens, in priority order:
   *
   *   1. a section anchor, from a search hit or a shared link — that section
   *      is the whole point of the link, so it wins over everything;
   *   2. where this reader stopped last time, if they had got past the first
   *      screen — a step is a long read and coming back to the top means
   *      scrolling through what you've already read to find your place;
   *   3. the top, for a step being opened for the first time.
   *
   * The content surface is the scroll container on desktop and persists across
   * routes, so it has to be set explicitly; on mobile the document scrolls.
   * Runs before the fade, so the text doesn't animate in halfway down the
   * previous lesson's scroll position. Instant rather than smooth throughout:
   * a step being opened shouldn't animate past content nobody asked to see.
   *
   * Restoring waits a frame. The reading column is static HTML, but Satoshi can
   * land a beat later and reflow it, and restoring against a shorter document
   * would clamp the offset to a wrong place. */
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && scrollToSection(hash, "auto")) return;

    document.getElementById("content-surface")?.scrollTo({ top: 0 });
    if (window.matchMedia("(max-width: 767px)").matches) window.scrollTo(0, 0);

    let frame = 0;
    const restore = () => restorePosition(lessonId);
    frame = requestAnimationFrame(() => {
      restore();
      // A second pass after the fonts settle, in case the first landed early.
      document.fonts?.ready.then(restore).catch(() => {});
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, lessonId]);

  /* Record the position as they read.
   *
   * Throttled to one write per frame at most — a scroll handler that touches
   * localStorage on every event janks the very scrolling it's measuring. The
   * pagehide save is the one that matters: closing a tab or backgrounding the
   * app on a phone fires no final scroll event, so without it the last stretch
   * of reading is the part that gets lost. */
  useEffect(() => {
    const el = document.getElementById("content-surface");
    let queued = false;

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        savePosition(lessonId);
      });
    };
    const onLeave = () => savePosition(lessonId);

    el?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onLeave);
    document.addEventListener("visibilitychange", onLeave);

    return () => {
      el?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onLeave);
      document.removeEventListener("visibilitychange", onLeave);
      // Leaving this lesson is the last chance to record where they were.
      onLeave();
    };
  }, [lessonId]);

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
