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
    <div className="mt-6">
      <div
        /* The scroller is its own element so the fade and the border stay put
           while the chips move under them. data-no-swipe stops a sideways drag
           here from opening the reader's drawer (see MobileNav). */
        data-no-swipe
        className="no-scrollbar squircle flex items-center gap-2 overflow-x-auto rounded-full border border-[#e7e7e6] bg-white px-2.5 py-2"
      >
        <span className="shrink-0 pl-1 pr-0.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">
          Sources
        </span>
        {chips.map((c) => (
          <a
            key={c.name}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ${c.name} in a new tab`}
            className="squircle flex shrink-0 items-center gap-2 rounded-full border border-[#e7e7e6] py-1 pl-1 pr-3 text-[14px] leading-5 text-ink transition-colors hover:border-[#c9c9c6] hover:bg-[#fafafa]"
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
