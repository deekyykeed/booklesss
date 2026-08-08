"use client";

import { PAGES, siteFor } from "./favicons";

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
  /* ONE CHIP PER PAGE, and its label is that page's own title (owner,
   * 2026-08-07: "the text should be the title of the page on the source, not
   * the name of the company or website").
   *
   * It was one chip per SITE, labelled with the site's name, and the reason for
   * that was real: two pages from one place are one source as far as trust
   * goes. But trust is not what the reader is asking the strip. They are asking
   * "what is behind this paragraph", and "Corporate Finance Institute" answers
   * a question about who rather than about what. "Net Present Value" tells them
   * whether it is worth the tap.
   *
   * Deduped by URL now rather than by site, so a paragraph resting on two
   * different pages shows both. Still deduped, because the same URL cited twice
   * in one block is one source.
   *
   * The title comes from PAGES, filled at build time by gen-favicons. A page it
   * could not read falls back to the site name, which is exactly the old
   * behaviour, so this can only improve a chip and never empty one. */
  const seen = new Map<string, { href: string; name: string; icon: string }>();
  for (const href of urls) {
    const site = siteFor(href);
    if (!site || seen.has(href)) continue;
    seen.set(href, { href, name: PAGES[href] ?? site.name, icon: site.icon });
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
          /* Shrunk back down and quietened, owner's call late on 2026-08-02.
             They were grown earlier the same day — a white pill with a border
             and a shadow at 15px — and that made a footnote look like a
             feature: three of them under a paragraph carried more visual weight
             than the sentence they were annotating.
             A flat tint with no shadow and grey type, so a source reads as a
             quiet note under the claim and the prose stays the loudest thing
             in the column. It darkens on hover, which is the only state that
             needs to say "this is a link".

             THE BORDER IS BACK (owner, 2026-08-07: "add a border to the
             source container"), though the shadow it arrived with the first
             time is not — that combination was the thing that overweighted
             it, not the border on its own.

             `--color-line`, NOT `--color-line-2`. It shipped as line-2
             (#d4d4d4) on the reasoning that that is the app's pills-and-tags
             token, and the owner's answer was immediate: "its too dark."
             The token is right for a pill on WHITE, where it has the full
             surface to contrast against; these sit on a #f6f6f5 tint that has
             already used up part of that distance, so the same grey reads a
             step heavier here than it does anywhere else it is used. #dfdfdf
             gives the pill its edge without the row of them competing with
             the sentence above.

             The tint is a hair off white (#f6f6f5), not the #eeeeec it was for
             one revision — that read as a grey block sitting ON the page rather
             than as part of it. It only has to be far enough from the surface
             to show the pill's shape. */
          className="flex shrink-0 items-center gap-1 rounded-full border border-line bg-[#f6f6f5] py-0.5 pl-0.5 pr-2 text-[11px] leading-4 text-[#7a7a82] transition-colors hover:bg-[#ededeb] hover:text-ink"
        >
          {/* Round, whatever shape the site's own mark is. Most favicons are
              squares with their own padding, so a circular crop of one reads
              as a logo rather than as a pasted-in tile. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* No white disc behind it any more — on a tinted chip that read as a
              second shape inside the pill. The favicon sits on the tint. */}
          {/* 16px, up from 12 (owner, 2026-08-08: "the source favicon needs to be
              bigger"). It costs nothing: the label's line box is already 16px
              (`text-[11px] leading-4`), so the mark grows into height the chip
              was reserving anyway and the pill does not get taller. 12 was
              smaller than the type it sat beside, which is why it read as a
              speck rather than as the site's mark.
              Above 16 the chip WOULD grow, because then the icon rather than the
              line box sets the height — check that before going further. */}
          <img
            src={c.icon}
            alt=""
            aria-hidden="true"
            className="h-4 w-4 shrink-0 rounded-full object-cover"
          />
            <span className="whitespace-nowrap">{c.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
