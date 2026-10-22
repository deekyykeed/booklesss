"use client";

import type { CardSet, Course } from "../_types";
import { Avatar, SaveButton, Star, Verified, fmtTime, useSaved } from "../_shared";
import s from "./alexander-ross.module.css";

/* The Alexander Ross freelancer card (Pinterest, p14) as a course card: a
   white card, a header of soft 3D shapes in the course's two tones, the
   creator's picture over its bottom-left corner. Sizes are the Paper
   rebuild's × 1.415 (212px card → 300px). */

/* featured → the 3D-shapes art fills the whole card, a dark fade rises from
   the bottom and the text goes white */
function Card({ course, featured }: { course: Course; featured: boolean }) {
  const [saved] = useSaved(course.slug);
  const [light, dark] = course.tone;
  const art = { "--a": light, "--b": dark } as React.CSSProperties;
  return (
    <article className={`${s.card} ${featured ? s.cardF : ""}`}>
      <div className={s.art} style={art} aria-hidden>
        <i className={s.blob1} />
        <i className={s.blob2} />
        <i className={s.blob3} />
        <i className={s.blob4} />
      </div>

      <div className={s.avatarWrap}>
        <Avatar course={course} size={79} className={s.avatar} />
        {course.creator.verified && <Verified size={20} ring={featured ? dark : "#fff"} className={s.badge} />}
      </div>

      <div className={s.body}>
        <div className={s.nameRow}>
          <div className={s.names}>
            <h3 className={s.title}>{course.title}</h3>
            <p className={s.by}>{course.creator.name}</p>
          </div>
          <SaveButton course={course} className={`${s.save} ${saved ? s.saveOn : ""}`} size={18} />
        </div>

        <div className={s.chips}>
          <span className={s.chip}>
            <i className={s.chipMark} style={{ background: dark }}>
              {course.subject[0]}
            </i>
            {course.level}
          </span>
          <span className={s.chipGhost}>+{course.videos} videos</span>
        </div>

        <div className={s.stats}>
          <div className={s.stat}>
            <strong>
              <Star size={16} />
              {course.rating.toFixed(1)}
            </strong>
            <span>rating</span>
          </div>
          <i className={s.rule} />
          <div className={s.stat}>
            <strong>{course.videos}</strong>
            <span>videos</span>
          </div>
          <i className={s.rule} />
          <div className={s.stat}>
            <strong>{fmtTime(course.minutes)}</strong>
            <span>length</span>
          </div>
        </div>

        <button type="button" className={s.cta}>
          Start course
        </button>
      </div>
    </article>
  );
}

export default {
  id: "alexander-ross",
  name: "Alexander Ross",
  from: "Pinterest · freelancer card with a 3D-shapes header",
  width: 300,
  Card,
} satisfies CardSet;
