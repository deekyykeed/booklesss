"use client";

import type { CSSProperties } from "react";
import { Avatar, SaveButton, Verified, fmtTime, fmtUpdated } from "../_shared";
import type { CardSet, CardProps } from "../_types";
import s from "./james-peterson.module.css";

/* The "James Peterson" freelancer card (Pinterest, Morshedur Rana): a black
   card with a small role label top-left, the time top-right, a round avatar
   beside the name and an availability dot, two buttons, and a lime strip that
   hangs out under the card. Converted: role → subject, time → course length,
   name → course title, availability → "new videos this week", Hire Me → Start
   course, Copy Mail → the save button, the strip → videos and rating. Built
   at 320px, every measure 0.77 of the pin's 414px showcase card. The pin has
   no full-bleed twin, so the FEATURED card draws its own: the course's tones
   fill the black card behind a dark scrim, text goes white, the strip stays. */

const Clock = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
    <circle cx="12" cy="12" r="9.5" fill="none" stroke="#CFCFCF" strokeWidth="1.6" />
    <path d="M12 7v5l3 2" fill="none" stroke="#CFCFCF" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const Plus = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
    <circle cx="12" cy="12" r="9.5" fill="none" stroke="#fff" strokeWidth="1.6" />
    <path d="M12 8v8M8 12h8" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const Bolt = () => (
  <svg viewBox="0 0 16 18" width="13" height="15" aria-hidden>
    <path d="M9.5 0L1 10.5h6L5.5 18 15 7H8.8z" fill="#111" />
  </svg>
);

function Card({ course, featured }: CardProps) {
  const fresh = course.updatedDays <= 7;
  const vars = {
    "--tone": course.tone[0],
    "--bleed": `linear-gradient(135deg, ${course.tone[0]} 0%, ${course.tone[1]} 100%)`,
  } as CSSProperties;
  return (
    <div className={`${s.wrap} ${featured ? s.featured : ""}`} style={vars}>
      {/* drawn first so the card sits over it, as in the pin */}
      <div className={s.strip}>
        <Bolt />
        <span>
          {course.videos} videos · {course.rating.toFixed(1)} rating
        </span>
      </div>

      <article className={s.card}>
        <div className={s.head}>
          <span className={s.role}>{course.subject}</span>
          <span className={s.time}>
            <Clock />
            {fmtTime(course.minutes)}
          </span>
        </div>

        <div className={s.who}>
          <span className={s.pic}>
            <Avatar course={course} size={40} className={s.avatar} />
            {course.creator.verified && <Verified size={16} ring="#0b0b0b" className={s.badge} />}
          </span>
          <div className={s.names}>
            <h3 className={s.title}>{course.title}</h3>
            <p className={s.status}>
              <span className={`${s.dot} ${fresh ? s.dotOn : ""}`} />
              {fresh ? "New videos this week" : `Updated ${fmtUpdated(course.updatedDays)}`}
            </p>
          </div>
        </div>

        <div className={s.actions}>
          <button type="button" className={s.primary}>
            <Plus />
            Start course
          </button>
          <SaveButton course={course} className={s.secondary} size={15}>
            {(saved) => <span>{saved ? "Saved" : "Save"}</span>}
          </SaveButton>
        </div>
      </article>
    </div>
  );
}

export default {
  id: "james-peterson",
  name: "James Peterson",
  from: "Pinterest · freelancer card by Morshedur Rana",
  width: 320,
  Card,
} satisfies CardSet;
