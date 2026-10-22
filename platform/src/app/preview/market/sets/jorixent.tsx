"use client";

import { Avatar, SaveButton, Verified, fmtTime, fmtUpdated } from "../_shared";
import type { CardProps, CardSet } from "../_types";
import s from "./jorixent.module.css";

/* The Jorixent profile card (Pinterest), scaled from its 395px showcase to a
   320px card (×0.81). Light card, a header of two overlapping discs, the
   round picture breaking the header's edge, a pill top right, then name,
   handle, bio, two stats and a link row. Converted: name → course, handle →
   creator, bio → blurb, following/followers → videos / hours, link → updated.
   The header's grey and black become the course's two tones. */

function Card({ course, featured }: CardProps) {
  const v = course.creator.verified;
  const vars = { "--t0": course.tone[0], "--t1": course.tone[1] } as React.CSSProperties;

  /* FEATURED: the header's disc art covers the whole card and everything sits
     over it near the bottom, on a dark scrim, in white, with light pills. */
  if (featured) {
    return (
      <article className={`${s.card} ${s.featured}`} style={vars}>
        <span className={s.fDiscL} />
        <span className={s.fDiscR} />
        <SaveButton course={course} className={`${s.save} ${s.fSave}`} size={18} />
        <div className={s.scrim} />
        <div className={s.fBody}>
          <div className={s.fTop}>
            <div className={`${s.pic} ${s.fPic}`}>
              <Avatar course={course} size={69} />
              {v && <Verified size={20} ring="#0E0F11" className={s.badge} />}
            </div>
            <button type="button" className={`${s.pill} ${s.fPill}`}>
              Start
            </button>
          </div>
          <h3 className={s.title}>{course.title}</h3>
          <p className={s.handle}>{course.creator.name}</p>
          <p className={s.bio}>{course.blurb}</p>
          <div className={s.stats}>
            <span>
              <b>{course.videos}</b> Videos
            </span>
            <span>
              <b>{fmtTime(course.minutes)}</b> of video
            </span>
          </div>
          <p className={s.link}>
            <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden>
              <path d="M9.5 14.5L14.5 9.5" fill="none" stroke="var(--t0)" strokeWidth="2" strokeLinecap="round" />
              <path d="M16.8 13.4L19.3 10.9C21.2 8.9 21.2 5.8 19.3 3.9 17.4 2 14.2 2 12.3 3.9L9.8 6.4M14.2 17.6L11.7 20.1C9.8 22 6.6 22 4.7 20.1 2.8 18.2 2.8 15 4.7 13.1L7.2 10.6" fill="none" stroke="var(--t0)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Updated {fmtUpdated(course.updatedDays)}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className={s.card} style={vars}>
      <div className={s.head}>
        <span className={s.discL} />
        <span className={s.discR} />
        <SaveButton course={course} className={s.save} size={18} />
      </div>

      <div className={s.pic}>
        <Avatar course={course} size={89} />
        {v && <Verified size={22} ring="#E4E4E4" className={s.badge} />}
      </div>

      <button type="button" className={s.pill}>
        Start
      </button>

      <div className={s.body}>
        <h3 className={s.title}>{course.title}</h3>
        <p className={s.handle}>{course.creator.name}</p>
        <p className={s.bio}>{course.blurb}</p>
        <div className={s.stats}>
          <span>
            <b>{course.videos}</b> Videos
          </span>
          <span>
            <b>{fmtTime(course.minutes)}</b> of video
          </span>
        </div>
        <p className={s.link}>
          <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden>
            <path d="M9.5 14.5L14.5 9.5" fill="none" stroke="var(--t1)" strokeWidth="2" strokeLinecap="round" />
            <path d="M16.8 13.4L19.3 10.9C21.2 8.9 21.2 5.8 19.3 3.9 17.4 2 14.2 2 12.3 3.9L9.8 6.4M14.2 17.6L11.7 20.1C9.8 22 6.6 22 4.7 20.1 2.8 18.2 2.8 15 4.7 13.1L7.2 10.6" fill="none" stroke="var(--t1)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Updated {fmtUpdated(course.updatedDays)}
        </p>
      </div>
    </article>
  );
}

export default {
  id: "jorixent",
  name: "Jorixent",
  from: "Pinterest · Jorixent profile card",
  width: 320,
  Card,
} satisfies CardSet;
