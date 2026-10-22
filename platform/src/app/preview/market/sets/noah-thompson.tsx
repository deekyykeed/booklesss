"use client";

import type { CardSet, Course } from "../_types";
import { Avatar, Bookmark, Play, SaveButton, Verified, fmtTime, useSaved } from "../_shared";
import s from "./noah-thompson.module.css";

/* The Noah Thompson profile card (Pinterest, p13) as a course card. Two
   variants, alternating down the row like the pin's pair: A has the "Start +"
   pill, a level bar and the stats cut by rules; B has the "+" disc, the
   rainbow ring on the avatar and the stats inside a grey pill. Sizes are the
   Paper rebuild's × 1.145 (262px card → 300px). */

const TICKS = 22;
const LEVEL_TICKS = { Beginner: 7, Intermediate: 13, Advanced: 19 } as const;

const Plus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 4V20M20 12H4" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const Share = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M7 17L17 7M17 7H9M17 7V15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function LevelBar({ course }: { course: Course }) {
  const lit = LEVEL_TICKS[course.level];
  const [a, b] = course.tone;
  return (
    <div className={s.level} aria-label={`${course.level} level`}>
      <span className={s.levelLabel}>level</span>
      <span className={s.ticks} style={{ "--a": a, "--b": b } as React.CSSProperties}>
        {Array.from({ length: TICKS }, (_, i) => (
          <i key={i} className={i < lit ? s.tickOn : s.tick} style={i < lit ? { opacity: 0.55 + (0.45 * i) / lit } : undefined} />
        ))}
      </span>
    </div>
  );
}

function Stats({ course, pill }: { course: Course; pill?: boolean }) {
  return (
    <div className={pill ? s.statsPill : s.stats}>
      <div className={s.stat}>
        <strong>{course.rating.toFixed(1)}</strong>
        <span>Rating</span>
      </div>
      <div className={`${s.stat} ${pill ? "" : s.statMid}`}>
        <strong>{course.videos}</strong>
        <span>Videos</span>
      </div>
      <div className={s.stat}>
        <strong>{fmtTime(course.minutes)}</strong>
        <span>Time</span>
      </div>
    </div>
  );
}

function Actions({ course, bare }: { course: Course; bare?: boolean }) {
  const [saved] = useSaved(course.slug);
  return (
    <div className={bare ? s.actionsBare : s.actions}>
      <button type="button" className={s.action} aria-label={`Start ${course.title}`}>
        <Play size={15} />
      </button>
      <SaveButton course={course} className={`${s.action} ${bare ? "" : s.actionMid} ${saved ? s.actionOn : ""}`} size={16} />
      <button type="button" className={s.action} aria-label={`Share ${course.title}`}>
        <Share />
      </button>
    </div>
  );
}

/* featured → the sky fills the whole card and everything sits over it; the
   layout is variant A's, with the stats in a frosted pill */
function Card({ course, index, featured }: { course: Course; index: number; featured: boolean }) {
  const b = !featured && index % 2 === 1;
  const sky = { "--sky": course.tone[0] } as React.CSSProperties;
  return (
    <article className={`${s.card} ${b ? s.cardB : ""} ${featured ? s.cardF : ""}`}>
      <div className={s.sky} style={sky} aria-hidden>
        <i className={s.cloud1} />
        <i className={s.cloud2} />
        <i className={s.cloud3} />
      </div>

      {b ? (
        <button type="button" className={s.plusDisc} aria-label={`Start ${course.title}`}>
          <Plus />
        </button>
      ) : (
        <button type="button" className={s.startPill}>
          Start <Plus />
        </button>
      )}

      <div className={b ? s.avatarRing : s.avatarWrap}>
        <Avatar course={course} size={b ? 86 : 92} className={s.avatar} />
        {course.creator.verified && <Verified size={22} ring="#fff" className={s.badge} />}
      </div>

      {!b && <LevelBar course={course} />}

      <div className={s.text}>
        <h3 className={s.title}>{course.title}</h3>
        <p className={s.by}>{course.creator.name}</p>
        <p className={s.blurb}>{course.blurb}</p>
      </div>

      <Stats course={course} pill={b || featured} />
      <Actions course={course} bare={b || featured} />
      {/* keeps the bookmark mark in the module graph for the filled state's colour */}
      <span hidden>
        <Bookmark size={1} />
      </span>
    </article>
  );
}

export default {
  id: "noah-thompson",
  name: "Noah Thompson",
  from: "Pinterest · profile card, light with a cloud header",
  width: 300,
  Card,
} satisfies CardSet;
