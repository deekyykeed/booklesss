"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/lib/course";
import { LessonView } from "./LessonView";
import { OnThisPage } from "./OnThisPage";

// Per-lesson content + on-this-page TOC. Remounts on navigation (each lesson
// is its own route); the persistent sidebar lives in the layout.
export function LessonReader({ lesson }: { lesson: Lesson }) {
  const [activeSection, setActiveSection] = useState(lesson.sections[0].id);

  // scroll-spy
  useEffect(() => {
    setActiveSection(lesson.sections[0].id);
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const first = lesson.sections.find((s) => visible.has(s.id));
        if (first) setActiveSection(first.id);
      },
      { rootMargin: "-72px 0px -68% 0px", threshold: 0 },
    );
    lesson.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [lesson]);

  const goToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto flex max-w-[1080px] items-stretch gap-12 px-5 py-10 md:px-8">
      {/* maxWidth inline rather than a Tailwind arbitrary class — the scanner
          has silently dropped several of those in this project. */}
      <div className="min-w-0 flex-1 pb-[40vh]" style={{ maxWidth: 700 }}>
        <LessonView lesson={lesson} />
      </div>
      <div className="hidden w-[210px] shrink-0 xl:block">
        <OnThisPage sections={lesson.sections} activeId={activeSection} onSelect={goToSection} />
      </div>
    </div>
  );
}
