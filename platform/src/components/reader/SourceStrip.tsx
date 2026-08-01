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
 * So the sources sit below the section, above its checkpoint, as a single row
 * of chips. The sentence is untouched, and a reader can see at a glance both
 * how many outside sources a section rests on and who they are.
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
    <div className="mt-6">
      {/* Named, because a bare row of logos under a section is a puzzle: it
          could be a partner list or a set of tools. One quiet word settles it.
          It sits outside the scroller so it stays put while the chips move. */}
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">Sources</p>
      <div
        data-no-swipe
        className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 py-0.5 md:-mx-6 md:px-6"
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
          className="flex shrink-0 items-center gap-2 rounded-full border border-[#e7e7e6] bg-white py-1 pl-1 pr-3.5 text-[14px] leading-5 text-ink transition-colors hover:border-[#c9c9c6] hover:bg-[#fafafa]"
        >
          {/* Round, whatever shape the site's own mark is. Most favicons are
              squares with their own padding, so a circular crop of one reads
              as a logo rather than as a pasted-in tile. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.icon}
            alt=""
            aria-hidden="true"
            className="h-[22px] w-[22px] shrink-0 rounded-full bg-white object-cover"
          />
            <span className="whitespace-nowrap">{c.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
