"use client";

import type { CSSProperties } from "react";
import { Avatar, Clock, Play, SaveButton, Star, Verified, fmtTime } from "../_shared";
import type { CardSet, CardProps, Subject } from "../_types";
import s from "./alex-turner.module.css";

/* The Liam O'Connor / Alex Turner profile cards (Pinterest, Spline's free UI
   cards): a 34px-radius card with a cover image, the avatar breaking its
   bottom edge, a company chip, name and role beside a round bookmark, three
   stats and a full-width button. Three variants, as the pins have them: dark,
   light, and Jordan Blake's full-bleed cover, which is the FEATURED course
   (owner: "the one covered with the image will be a featured course"). Every
   measure is the Paper board
   "Course card · dark + light" on the Course UI page (300px card). */

const CHIP: Record<Subject, string> = { Finance: "#3E82F7", Business: "#F5A623", Economics: "#34C77B" };

function Card({ course, index, featured }: CardProps) {
  // featured = Jordan Blake's full-bleed card; the rest alternate dark / light
  const variant = featured ? "bleed" : index % 2 ? "light" : "dark";
  const [light, dark] = course.tone;
  const ring = variant === "light" ? "#FFFFFF" : variant === "dark" ? "#1E1E1E" : dark;
  const vars = {
    "--cover": `linear-gradient(160deg, ${light} 0%, ${dark} 100%)`,
    "--bleed": `linear-gradient(135deg, ${light} 0%, ${dark} 70%, #0E0F11 100%)`,
    "--avatar": light,
    "--chip": CHIP[course.subject],
  } as CSSProperties;

  return (
    <article className={`${s.card} ${s[variant]}`} style={vars}>
      <div className={s.top}>
        <div className={s.cover} />
        <Avatar course={course} size={65} className={s.avatar} />
        {course.creator.verified && <Verified size={22} ring={ring} className={s.badge} />}
        <span className={s.chip}>
          <span className={s.mark} />
          {course.subject}
        </span>
      </div>

      <div className={s.who}>
        <div className={s.names}>
          <h3 className={s.title}>{course.title}</h3>
          <p className={s.by}>{course.creator.name}</p>
        </div>
        <SaveButton course={course} className={s.save} size={18} />
      </div>

      <div className={s.stats}>
        <div className={s.stat}>
          <Star size={19} style={{ color: "#F5B50A" }} />
          <div>
            <b>{course.rating.toFixed(1)}</b>
            <span>Rating</span>
          </div>
        </div>
        <div className={s.stat}>
          <Play size={19} style={{ color: "#3B82F6" }} />
          <div>
            <b>{course.videos}</b>
            <span>Videos</span>
          </div>
        </div>
        <div className={s.stat}>
          <Clock size={19} style={{ color: "#A35BF0" }} />
          <div>
            <b>{fmtTime(course.minutes)}</b>
            <span>Time</span>
          </div>
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
  name: "Alex Turner",
  from: "Pinterest · Liam O'Connor and Alex Turner cards by Spline",
  width: 300,
  Card,
} satisfies CardSet;
