"use client";

import { useState } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { minutesOf, publishedOf, useMyCourses, type VideoCourse } from "@/lib/studio";
import { Player } from "./Player";
import { Stage } from "./Stage";
import "./studio.css";

/* The learner's side: every published video course, and the player. A
 * course a creator publishes in Studio appears here straight away. */

export function CourseCard({ c, onOpen, badge }: { c: VideoCourse; onOpen: () => void; badge?: React.ReactNode }) {
  const first = c.lessons[0]?.scenes[0] ?? { heading: c.title, lines: [] };
  return (
    <li>
      <button type="button" className="st-card" onClick={onOpen}>
        <Stage scene={{ heading: c.title, lines: first.lines.slice(0, 1) }} style={c.style} eyebrow={`${c.lessons.length} lessons`} />
        <span className="st-card-body">
          {badge}
          <span className="st-card-title">{c.title}</span>
          <span className="st-card-meta">by {c.creator} · {c.lessons.length} lessons · {minutesOf(c)} min</span>
        </span>
      </button>
    </li>
  );
}

export function ExplorePage() {
  const mine = useMyCourses();
  const courses = publishedOf(mine);
  const [open, setOpen] = useState<VideoCourse | null>(null);

  if (open) {
    return (
      <div className="proj-page">
        <div className="st-ed-head">
          <button type="button" className="btn-sec is-icon" aria-label="Back to Explore" onClick={() => setOpen(null)}>
            <HugeIcon name="chevron-left" className="i" />
          </button>
          <div style={{ minWidth: 0 }}>
            <div className="st-eyebrow">by {open.creator}</div>
            <h1 className="proj-title">{open.title}</h1>
          </div>
        </div>
        <Player course={open} key={open.id} />
      </div>
    );
  }

  return (
    <div className="proj-page">
      <div className="proj-head">
        <h1 className="proj-title">Explore</h1>
      </div>
      <p className="st-lede">Short video courses made by people who know the subject. Each lesson stops for a quick check before it moves on.</p>
      <ul className="st-grid">
        {courses.map((c) => <CourseCard key={c.id} c={c} onOpen={() => setOpen(c)} />)}
      </ul>
    </div>
  );
}
