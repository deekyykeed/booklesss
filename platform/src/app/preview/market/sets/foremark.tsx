"use client";

import { Avatar, SaveButton, Verified, fmtTime, fmtUpdated } from "../_shared";
import type { CardProps, CardSet } from "../_types";
import s from "./foremark.module.css";

/* The Foremark profile card (Pinterest), scaled from its 292px showcase to a
   310px card (×1.06). A dark card with a soft pale cover inset at the top, a
   square dark tile for the picture sitting on the cover's lower edge, the
   name and handle beside it with a small pill, then bio, two stats and a
   link row on the dark part. The cover's warm blobs are drawn from the
   course's light tone. Converted the same way as the rest of the page. */

function Card({ course, featured }: CardProps) {
  const v = course.creator.verified;
  const vars = { "--t0": course.tone[0], "--t1": course.tone[1] } as React.CSSProperties;

  /* FEATURED: the cover's blobs fill the whole card; the tile, title, creator,
     pill, blurb, stats and updated row sit at the bottom over a dark scrim. */
  if (featured) {
    return (
      <article className={`${s.card} ${s.featured}`} style={vars}>
        <div className={`${s.cover} ${s.fCover}`}>
          <span className={s.blobA} />
          <span className={s.blobB} />
          <span className={s.wedge} />
        </div>
        <SaveButton course={course} className={`${s.save} ${s.fSave}`} size={16} />
        <div className={s.scrim} />
        <div className={s.fBody}>
          <div className={s.head}>
            <div className={s.tile}>
              <Avatar course={course} size={56} />
              {v && <Verified size={20} ring="#1a1a1a" className={s.badge} />}
            </div>
            <div className={s.who}>
              <h3 className={`${s.title} ${s.fTitle}`}>{course.title}</h3>
              <p className={`${s.handle} ${s.fHandle}`}>{course.creator.name}</p>
              <button type="button" className={`${s.pill} ${s.fPill}`}>
                Start
              </button>
            </div>
          </div>
          <div className={s.body}>
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
              <svg viewBox="0 0 24 24" width={12} height={12} aria-hidden>
                <path d="M9.5 14.5L14.5 9.5" fill="none" stroke="var(--t0)" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M16.8 13.4L19.3 10.9C21.2 8.9 21.2 5.8 19.3 3.9 17.4 2 14.2 2 12.3 3.9L9.8 6.4M14.2 17.6L11.7 20.1C9.8 22 6.6 22 4.7 20.1 2.8 18.2 2.8 15 4.7 13.1L7.2 10.6" fill="none" stroke="var(--t0)" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              Updated {fmtUpdated(course.updatedDays)}
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={s.card} style={vars}>
      <div className={s.cover}>
        <span className={s.blobA} />
        <span className={s.blobB} />
        <span className={s.wedge} />
        <SaveButton course={course} className={s.save} size={16} />
      </div>

      <div className={s.head}>
        <div className={s.tile}>
          <Avatar course={course} size={56} />
          {v && <Verified size={20} ring="var(--cov)" className={s.badge} />}
        </div>
        <div className={s.who}>
          <h3 className={s.title}>{course.title}</h3>
          <p className={s.handle}>{course.creator.name}</p>
          <button type="button" className={s.pill}>
            Start
          </button>
        </div>
      </div>

      <div className={s.body}>
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
          <svg viewBox="0 0 24 24" width={12} height={12} aria-hidden>
            <path d="M9.5 14.5L14.5 9.5" fill="none" stroke="var(--t0)" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M16.8 13.4L19.3 10.9C21.2 8.9 21.2 5.8 19.3 3.9 17.4 2 14.2 2 12.3 3.9L9.8 6.4M14.2 17.6L11.7 20.1C9.8 22 6.6 22 4.7 20.1 2.8 18.2 2.8 15 4.7 13.1L7.2 10.6" fill="none" stroke="var(--t0)" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Updated {fmtUpdated(course.updatedDays)}
        </p>
      </div>
    </article>
  );
}

export default {
  id: "foremark",
  name: "Foremark",
  from: "Pinterest · Foremark brand profile card",
  width: 310,
  Card,
} satisfies CardSet;
