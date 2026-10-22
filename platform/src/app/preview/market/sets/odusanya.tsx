"use client";

import { Avatar, Play, SaveButton, Star, Verified, fmtTime } from "../_shared";
import type { CardProps, CardSet } from "../_types";
import s from "./odusanya.module.css";

/* The Odusanya photo card (Paper: "Ref · Odusanya photo profile cards"),
   scaled 290 → 310. There is no course photo, so the picture is a cover: a
   gradient in the course's tones with the creator's badge drawn large, like a
   portrait, and the verified mark on its bottom right. Even cards are the
   light variant (picture in a rounded frame, text below), odd cards the dark
   one (the picture fills the card, text over its lower half). */

const cover = ([a, b]: [string, string]) =>
  `radial-gradient(110% 80% at 18% 12%, ${a}E6 0%, ${a}00 58%), radial-gradient(70% 55% at 85% 95%, ${a}66 0%, ${a}00 70%), linear-gradient(165deg, ${b} 0%, #121212 100%)`;

function Card({ course, featured }: CardProps) {
  // the dark card is the full-bleed one, so it is the featured course's
  const dark = featured;

  const portrait = (
    <div className={s.portrait}>
      <Avatar course={course} size={128} />
      {course.creator.verified && <Verified size={30} ring={course.tone[1]} className={s.badge} />}
    </div>
  );

  const stats = (
    <div className={s.stats}>
      <div className={s.stat}>
        <div className={s.val}>
          <Star size={15} className={s.star} />
          {course.rating.toFixed(1)}
        </div>
        <div className={s.lab}>Rating</div>
      </div>
      <span className={s.div} />
      <div className={s.stat}>
        <div className={s.val}>{course.videos}</div>
        <div className={s.lab}>Videos</div>
      </div>
      <span className={s.div} />
      <div className={s.stat}>
        <div className={s.val}>{fmtTime(course.minutes)}</div>
        <div className={s.lab}>Time</div>
      </div>
    </div>
  );

  if (dark) {
    return (
      <article className={`${s.card} ${s.dark}`}>
        <div className={s.full} style={{ backgroundImage: cover(course.tone) }}>
          {portrait}
          <div className={s.shade} />
          <div className={s.body}>
            <h3 className={s.title}>{course.title}</h3>
            <p className={s.by}>{course.creator.name}</p>
            <p className={s.blurb}>{course.blurb}</p>
            {stats}
            <div className={s.actions}>
              <button type="button" className={s.cta}>
                <Play size={16} />
                Start course
              </button>
              <SaveButton course={course} className={s.saveSq} size={17} />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={s.card}>
      <div className={s.image} style={{ backgroundImage: cover(course.tone) }}>
        {portrait}
        <SaveButton course={course} className={s.saveRound} size={17} />
      </div>
      <div className={s.body}>
        <h3 className={s.title}>{course.title}</h3>
        <p className={s.by}>{course.creator.name}</p>
        <p className={s.blurb}>{course.blurb}</p>
        {stats}
        <button type="button" className={s.cta}>
          <Play size={16} />
          Start course
        </button>
      </div>
    </article>
  );
}

export default {
  id: "odusanya",
  name: "Odusanya",
  from: "Pinterest · Odusanya photo profile cards",
  width: 310,
  Card,
} satisfies CardSet;
