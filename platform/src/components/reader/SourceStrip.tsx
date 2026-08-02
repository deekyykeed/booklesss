"use client";

import { siteFor } from "./favicons";

/* Where a section's claims came from, collected at its foot.
 *
 * This is the third arrangement and the first that leaves the prose alone. A
 * "read further" box was furniture, arriving after the reader had finished the
 * idea. Marking the phrase in the sentence competed with the two marks that
 * carry meaning, since bold says remember this and a ruled term says tap me. A
 * favicon at the end of each sentence was quieter but still put punctuation the
 * reader has to step over inside the reading line.
 *
 * So the sources sit as a single row of chips, directly under the block whose
 * claims they back. The sentence is untouched, and a reader can see at a
 * glance what that paragraph rests on and who it came from.
 *
 * They used to collect at the foot of the whole section, between the last
 * block and the checkpoint. The owner's objection (2026-08-02): down there
 * they read as part of the checkpoint and divider furniture rather than as a
 * note on the paragraph, and by the end of a long section the reader had lost
 * which claim they belonged to. One strip per citing block instead, so a
 * section with links in two paragraphs shows two.
 *
 * One line, always. More chips than fit scroll sideways rather than wrapping,
 * because a block that grows a second row pushes the checkpoint around and
 * changes the shape of the page depending on how well sourced a section
 * happens to be.
 */
export function SourceStrip({ urls }: { urls: string[] }) {
  /* One chip per site, not per link. Two Investopedia pages under one section
   * are one source as far as the reader is concerned; the first link wins and
   * the chip opens it. */
  const seen = new Map<string, { href: string; name: string; icon: string }>();
  for (const href of urls) {
    const site = siteFor(href);
    if (!site || seen.has(site.name)) continue;
    seen.set(site.name, { href, name: site.name, icon: site.icon });
  }
  const chips = [...seen.values()];
  if (!chips.length) return null;

  return (
    /* No wrapper box. A bordered container around a row of bordered chips was
       two frames doing one job, and it fenced the sources off as a widget
       rather than letting them sit under the section as a footnote does. The
       chips carry their own edges; the row just scrolls.

       Full-bleed: the negative margins cancel the reading column's own padding
       (px-4, md:px-6 in LessonReader) and the matching padding puts the first
       chip back on the text's left edge. So the scroll box runs to the edge of
       the surface rather than stopping short inside the column, and a chip
       being scrolled away disappears off the page instead of being cut off at
       a boundary the reader can see. `.content-surface` is overflow-x hidden,
       so this never gives the page itself a horizontal scrollbar.

       data-no-swipe stops a sideways drag here from opening the reader's
       drawer instead of moving the chips (see MobileNav). */
    /* No top margin: the strip now sits directly under the block that cites
       it, and the gap between the two belongs to that wrapper (see
       `BlockWithSources`) rather than to this component. */
    /* `font-container`: the chips are a note about the paragraph, not part of
       the reading, so they take Satoshi while the prose stays Aptos.
       `font-medium` (owner, 2026-08-02) — Satoshi's 500 is a real face here,
       not a synthesised one, and at chip size the regular sat too light
       against the prose it annotates. */
    <div className="font-container font-medium">
      {/* No "SOURCES" heading. It was there because a bare row of logos at the
          foot of a section could have been a partner list or a set of tools,
          and one quiet word settled it. Now the strip sits directly under the
          paragraph it belongs to, and that position says what the word was
          saying: a named site under a claim reads as where the claim came
          from. The label was the second piece of furniture in a component
          whose whole point is not being furniture. */}
      <div
        data-no-swipe
        className="no-scrollbar bleed-x flex items-center gap-2.5 overflow-x-auto py-1"
      >
      {chips.map((c) => (
        <a
          key={c.name}
          href={c.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open ${c.name} in a new tab`}
          /* Genuinely round, so no `squircle`: the superellipse mask is a
             subtle flattening that reads as a wobble on a full pill, where it
             is exactly right on a large card. */
          /* Grown on 2026-08-02: at 22px/14px in a py-1 pill these read as
             tokens rather than as sites you could go to — too tight to look
             like a real thing to tap, and too small for the favicon to be
             recognisable, which is the whole point of showing a logo instead
             of a domain. The mark now sets at 26px and the pill has room
             around it. */
          className="flex shrink-0 items-center gap-2.5 rounded-full border border-[#e7e7e6] bg-white py-1.5 pl-1.5 pr-4 text-[15px] leading-5 text-ink shadow-chip transition-colors hover:border-[#c9c9c6] hover:bg-[#fafafa]"
        >
          {/* Round, whatever shape the site's own mark is. Most favicons are
              squares with their own padding, so a circular crop of one reads
              as a logo rather than as a pasted-in tile. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.icon}
            alt=""
            aria-hidden="true"
            className="h-4 w-4 shrink-0 rounded-full bg-white object-cover"
          />
            <span className="whitespace-nowrap">{c.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
