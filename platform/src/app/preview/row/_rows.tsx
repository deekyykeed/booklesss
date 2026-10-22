"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { SavedContext } from "../market/_shared";
import type { CardSet, Course } from "../market/_types";
import alexTurner from "../market/sets/alex-turner";
import alexanderRoss from "../market/sets/alexander-ross";
import foremark from "../market/sets/foremark";
import jamesPeterson from "../market/sets/james-peterson";
import jorixent from "../market/sets/jorixent";
import noahThompson from "../market/sets/noah-thompson";
import odusanya from "../market/sets/odusanya";
import oliviaRhye from "../market/sets/olivia-rhye";
import r from "./row.module.css";

/* Every other card design, one row each, under the final card's row (owner:
   "put in all the other cards in rows as well so I can look at what each
   looks like with proper sizing", "all including the feature cards", "don't
   change the names on them").

   So every card carries the final card's own content, Financial Management
   by Alex Turner with the same portrait and cover, and the only thing that
   changes row to row is the design. Each row opens with the featured
   (full-bleed) version, then the normal one in its variants.

   PROPER SIZING: every card is drawn 250px wide, the final card's width, so
   the rows compare like for like. The sets were built at 300–320px (the size
   the owner called "ridiculously big"); `zoom` scales each one down whole
   rather than reflowing it. Free UI Cards is drawn in container units and
   sizes itself to the 250px slot instead. */

const SLOT = 250;

const COURSE: Course = {
  slug: "financial-management",
  title: "Financial Management",
  subject: "Finance",
  blurb: "Valuation, capital and risk, and how a firm decides.",
  creator: { name: "Alex Turner", handle: "@alex", avatar: "money-graph", photo: "/preview/row/avatar.webp", verified: true },
  cover: "/preview/row/banner.webp",
  videos: 24,
  minutes: 380,
  rating: 5,
  updatedDays: 2,
  level: "Intermediate",
  tone: ["#F4A63A", "#2A1A10"],
};

const SETS: CardSet[] = [alexTurner, jorixent, foremark, jamesPeterson, noahThompson, alexanderRoss, odusanya, oliviaRhye];

/* drawn in container units, so it fills the slot rather than being zoomed */
const FLUID = new Set(["alex-turner"]);

const SAVED_KEY = "booklesss:row-saved:v1";

export function Rows() {
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSaved(new Set(JSON.parse(raw) as string[]));
    } catch {}
  }, []);

  const toggle = (slug: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });

  return (
    <SavedContext.Provider value={{ saved, toggle }}>
      {SETS.map((set) => (
        <section key={set.id} className={r.set} aria-label={set.name}>
          <h2 className={r.setName}>
            {set.name} <span>{set.from}</span>
          </h2>
          <div className={r.row}>
            {[
              { featured: true, index: 0 },
              { featured: false, index: 0 },
              { featured: false, index: 1 },
              { featured: false, index: 2 },
            ].map(({ featured, index }) => (
              <div key={`${featured}-${index}`} className={r.slot}>
                {FLUID.has(set.id) ? (
                  <set.Card course={COURSE} index={index} featured={featured} />
                ) : (
                  <div style={{ width: set.width, zoom: SLOT / set.width } as CSSProperties}>
                    <set.Card course={COURSE} index={index} featured={featured} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </SavedContext.Provider>
  );
}
