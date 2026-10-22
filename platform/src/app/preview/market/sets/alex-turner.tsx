"use client";

import { Avatar, Clock, Play, SaveButton, Star, Verified, fmtTime } from "../_shared";
import type { CardSet, CardProps, Subject } from "../_types";
import s from "./alex-turner.module.css";

/* The Free UI Cards pin (Spline): a 246px card with a banner image, the
   creator's portrait breaking its bottom edge, a chip over the banner, the
   title and creator beside a round bookmark, three stats and a full-width
   button. Three variants, as the pins have them: light, dark, and Jordan
   Blake's full-bleed cover, which is the FEATURED course (owner: "the one
   covered with the image will be a featured course").

   Every measure is the pin's own, in em off the cell width (see the CSS), so
   the card is the pin's 246px on a desktop and shrinks whole on a phone —
   the owner's call after a 300px version: "ridiculously big... keep them
   sized small, properly". */

const DOT: Record<Subject, string> = { Finance: "#3E82F7", Business: "#F5A623", Economics: "#34C77B" };

function Card({ course, index, featured }: CardProps) {
  const variant = featured ? "bleed" : index % 2 ? "dark" : "light";
  const ring = variant === "light" ? "#FFFFFF" : variant === "dark" ? "#1C1C1E" : "#FFFFFF";

  return (
    <article className={`${s.card} ${s[variant]}`}>
      {featured && (
        <>
          <img className={s.cover} src={course.cover} alt="" />
          <span className={s.shade} aria-hidden />
        </>
      )}

      <div className={s.top}>
        {!featured && <img className={s.banner} src={course.cover} alt="" />}
        <Avatar course={course} size={54} className={s.avatar} />
        {course.creator.verified && <Verified size={18} ring={ring} className={s.badge} />}
        <span className={s.chip}>
          <span className={s.dot} style={{ background: DOT[course.subject] }} />
          {course.subject}
        </span>
      </div>

      <div className={s.who}>
        <div className={s.names}>
          <h3 className={s.title}>{course.title}</h3>
          <p className={s.by}>{course.creator.name}</p>
        </div>
        <SaveButton course={course} className={s.save} size={14} />
      </div>

      <div className={s.stats}>
        <div className={s.stat}>
          <Star size={14} className={s.star} />
          <b>{course.rating.toFixed(1)}</b>
          <span>Rating</span>
        </div>
        <div className={s.stat}>
          <Play size={14} className={s.play} />
          <b>{course.videos}</b>
          <span>Videos</span>
        </div>
        <div className={s.stat}>
          <Clock size={14} className={s.clock} />
          <b>{fmtTime(course.minutes)}</b>
          <span>Time</span>
        </div>
      </div>

      <button type="button" className={s.cta}>
        Start course
      </button>
    </article>
  );
}

export default {
  id: "alex-turner",
  name: "Free UI Cards",
  from: "Pinterest · Free UI Cards by Spline",
  width: 246,
  Card,
} satisfies CardSet;
