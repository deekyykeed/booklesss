import type { ReactElement } from "react";

/* The contract every card set on /preview/market builds to. A set is one of
   the owner's reference profile cards turned into a course card; the page
   feeds it a course and an index, and the set decides how it looks. */

export type Subject = "Finance" | "Business" | "Economics";
export type Level = "Beginner" | "Intermediate" | "Advanced";

export type Course = {
  slug: string;
  title: string;
  subject: Subject;
  /** one line, what the course is about */
  blurb: string;
  creator: {
    name: string;
    /** "@mwila" */
    handle: string;
    /** an id in /public/avatars (the Kameleon set) */
    avatar: string;
    verified: boolean;
  };
  videos: number;
  minutes: number;
  rating: number;
  /** days since the last new video */
  updatedDays: number;
  level: Level;
  /** two tones for any art a set draws itself: [light, dark] */
  tone: [string, string];
  /** a featured course is drawn in the set's full-bleed variant (owner: "the
   *  one which is covered with that image will be a featured course") */
  featured?: boolean;
};

export type CardProps = {
  course: Course;
  /** position in the row, so a set can alternate its light/dark variants */
  index: number;
  /** true → the full-bleed variant: one image covers the whole card and the
   *  text sits over it. Every set has one; sets whose reference had no such
   *  variant draw their own in the same spirit. */
  featured: boolean;
};

export type CardSet = {
  /** url-safe, also the folder under /public/preview/market */
  id: string;
  /** shown as the section title, e.g. "Jorixent" */
  name: string;
  /** where the design came from, e.g. "Pinterest · Jorixent profile card" */
  from: string;
  /** suggested card width in px, so the row can size its scroll snap */
  width: number;
  Card: (props: CardProps) => ReactElement;
};
