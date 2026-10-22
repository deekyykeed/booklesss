"use client";

import { Avatar, Clock, Play, SaveButton, Star, Verified, fmtTime } from "../_shared";
import type { CardProps, CardSet } from "../_types";
import s from "./olivia-rhye.module.css";

/* The Olivia Rhye card (Paper: "Ref · Olivia Rhye green cards") at its own
   316px. The green fluid header is layered gradients in the course's tones.
   Even cards are the white variant with the gradient as a header; odd cards
   let the gradient fill the whole card and turn everything white. */

const fluid = ([a, b]: [string, string]) =>
  `radial-gradient(58% 80% at 18% 28%, ${a} 0%, ${a}00 70%), radial-gradient(70% 62% at 82% 72%, ${a}CC 0%, ${a}00 72%), radial-gradient(40% 50% at 55% 10%, ${b} 0%, ${b}00 80%), linear-gradient(135deg, ${b} 0%, ${a} 100%)`;

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden style={{ display: "block" }}>
    <path d="M18.5 12L5 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M13 18C13 18 19 13.581 19 12C19 10.419 13 6 13 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Card({ course, featured }: CardProps) {
  // the gradient fills the whole card for the featured course
  const full = featured;
  const bg = fluid(course.tone);

  return (
    <article className={`${s.card} ${full ? s.full : ""}`} style={full ? { backgroundImage: bg } : undefined}>
      <div className={s.header} style={full ? undefined : { backgroundImage: bg }} />
      <div className={s.avatarWrap}>
        <Avatar course={course} size={74} />
        {course.creator.verified && <Verified size={22} ring="#f8f4e8" className={s.badge} />}
      </div>

      <div className={s.row}>
        <div className={s.names}>
          <h3 className={s.title}>{course.title}</h3>
          <p className={s.by}>{course.creator.name}</p>
        </div>
        <div className={s.btns}>
          <button type="button" className={s.start}>
            Start
          </button>
          <SaveButton course={course} className={s.save} size={14} />
        </div>
      </div>

      <div className={s.rule} />

      <div className={s.stats}>
        <div className={s.stat}>
          <div className={s.val}>
            <Star size={17} />
            {course.rating.toFixed(1)}
          </div>
          <div className={s.lab}>Rating</div>
        </div>
        <div className={s.stat}>
          <div className={s.val}>
            <Play size={17} />
            {course.videos}
          </div>
          <div className={s.lab}>Videos</div>
        </div>
        <div className={s.stat}>
          <div className={s.val}>
            <Clock size={17} />
            {fmtTime(course.minutes)}
          </div>
          <div className={s.lab}>Time</div>
        </div>
      </div>

      <button type="button" className={s.cta}>
        <span className={s.arrow}>
          <Arrow />
        </span>
        Start course
      </button>
    </article>
  );
}

export default {
  id: "olivia-rhye",
  name: "Olivia Rhye",
  from: "Pinterest · Olivia Rhye green cards",
  width: 316,
  Card,
} satisfies CardSet;
