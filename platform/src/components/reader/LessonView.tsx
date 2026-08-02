"use client";

import { type Block, type Column, type Lesson } from "@/lib/course";
import { links, runs } from "@/lib/emphasis";
import { CardGlyph, isCardGlyph } from "./card-glyphs";
import { CodePlayground } from "./CodePlayground";
import { Checkpoint, StepComplete } from "./Checkpoint";
import { Term } from "./Term";
import { SourceStrip } from "./SourceStrip";

/* Step prose with its three inline marks: `**bold**`, `[[term|definition]]`
 * and `[label](url)`.
 *
 * Emphasis is the reader's recall handle, the phrase they'll find again when
 * they skim the step the night before the exam, so it is set in ink against the
 * #4a4a52 body rather than just heavier, which at 18px is barely a difference.
 *
 * A source link renders as **nothing at all** here: the words appear exactly as
 * written, and the site turns up in the strip under the section instead. The
 * brackets in the .mjs are there to record which claim rests on which source,
 * not to decorate the sentence. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {runs(text).map((r, i) =>
        r.define ? (
          <Term key={i} term={r.text} definition={r.define} />
        ) : r.bold ? (
          <strong key={i} className="font-semibold text-ink">
            {r.text}
          </strong>
        ) : (
          <span key={i}>{r.text}</span>
        ),
      )}
    </>
  );
}

/** Every source URL in one block, in the order the reader meets them. */
function sourcesInBlock(b: Block): string[] {
  if (b.type === "p" || b.type === "callout" || b.type === "h2") return links(b.text);
  if (b.type === "ul") return b.items.flatMap((it) => links(it));
  return [];
}

/* A definitional set as cards rather than table rows.
 *
 * The three treasury levels were a three-column table, and on a phone that is
 * the worst thing on the page: the Examples column wrapped one word per line
 * and still clipped, so "bank communications" read as "communicatior". Nothing
 * in it lines up, which is the only reason to reach for a table.
 *
 * One tone per card, cycled from the palette the dashboard stat tiles already
 * use — those four were validated together for lightness, chroma and CVD
 * separation, so borrowing them is cheaper and safer than inventing three more.
 * The mark takes the tone, the rule under the title takes it at low alpha, and
 * nothing else is coloured: the reading text stays the reading text. */
const CARD_TONES = ["#eb6834", "#4a3aa7", "#17754d", "#2a78d6"];

function Cards({ cards }: { cards: { icon: string; title: string; lead?: string; text: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      {cards.map((c, i) => {
        const tone = CARD_TONES[i % CARD_TONES.length];
        return (
          <div
            key={i}
            className="squircle rounded-3xl border border-[#e7e7e6] bg-white px-5 py-4 shadow-lift"
          >
            <div className="flex items-center gap-3">
              {isCardGlyph(c.icon) ? <CardGlyph name={c.icon} size={28} tone={tone} /> : null}
              <div className="min-w-0">
                <p className="text-[17px] font-semibold leading-6 text-ink">{c.title}</p>
                {c.lead ? (
                  <p className="text-[14px] leading-5" style={{ color: tone }}>
                    {c.lead}
                  </p>
                ) : null}
              </div>
            </div>
            {/* The rule is the card's own hue at low alpha rather than the
                house hairline: it ties the divider to the mark above it, and
                three cards in a row then read as a set rather than as three
                unrelated boxes that happen to be stacked. */}
            <div
              className="mt-3 border-t pt-3 text-[16.5px] leading-[27px] text-[#4a4a52]"
              style={{ borderColor: `color-mix(in oklab, ${tone} 22%, #ffffff)` }}
            >
              <Rich text={c.text} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* A display equation, set apart from the prose. `where` names each symbol
 * directly beneath it — the formula and its legend have to be readable in one
 * look, so they share a card rather than sitting as separate blocks. */
function Formula({ text, where }: { text: string; where?: string[] }) {
  return (
    <div className="squircle rounded-3xl border border-[#e7e7e6] bg-white px-5 py-5 shadow-lift">
      <p className="text-center font-display text-[17.5px] leading-8 tracking-[-0.01em] text-ink">{text}</p>
      {where?.length ? (
        <div className="mt-3 flex flex-col gap-1.5 border-t border-[#f0efee] pt-3">
          {where.map((w, i) => {
            // "r = the cost of capital" → the symbol carries the display face,
            // so the eye can jump from the equation straight to its definition.
            const at = w.indexOf("=");
            if (at < 1) return <p key={i} className="text-[15px] leading-[25px] text-muted">{w}</p>;
            return (
              <p key={i} className="text-[15px] leading-[25px] text-muted">
                <span className="font-display text-ink">{w.slice(0, at).trim()}</span>
                {" = "}
                {w.slice(at + 1).trim()}
              </p>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/* Columns of figures. Numeric columns are right-aligned and tabular so digits
 * stack by place value — a working the reader can check line by line, which is
 * the only reason to make it a table instead of prose. */
function DataTable({
  columns,
  rows,
  subtotals,
  total,
  note,
}: {
  columns: Column[];
  rows: string[][];
  subtotals?: number[];
  total?: string[];
  note?: string;
}) {
  /* Numeric columns stay tight and never wrap: a figure broken across two
     lines stops being a figure. Text columns are capped at a readable measure
     instead, so a prose cell wraps at about six words rather than at whatever
     width is left over. See the table's own note on sizing. */
  const cell = (i: number) =>
    columns[i]?.align === "right"
      ? "text-right tabular-nums whitespace-nowrap"
      : "text-left max-w-[17rem]";
  const carried = new Set(subtotals ?? []);

  return (
    <figure className="flex flex-col gap-2">
      {/* A wide working runs OFF THE PAGE, not inside a box.

          It used to be a rounded, bordered, lifted card with the scroll
          happening inside it, and the owner's objection is the right one: the
          card draws a hard edge a few pixels from the screen edge, so a column
          being scrolled to is cut off at a boundary the reader can see, and
          the table reads as held rather than continuing. A working on paper
          runs to the edge of the paper.

          `bleed-x` cancels the reading column's padding and puts it back
          inside, so a narrow table still lines up with the prose while a wide
          one slides out past the text and off the screen. Same treatment the
          source chips already use.

          data-no-swipe so dragging the table sideways moves the table rather
          than opening the reader's drawer (see MobileNav). */}
      <div data-no-swipe className="no-scrollbar bleed-x overflow-x-auto">
        {/* `w-max`, not `w-full`. At `width: 100%` the table is told to fit the
            reading column, so the auto layout squeezes every prose cell down
            towards its minimum and "Stronger controls, economies of scale…"
            came out two words to a line over seven lines. Sizing to
            `max-content` lets each column ask for the width its text wants;
            the cap in `cell()` stops a long cell asking for one enormous line,
            so it wraps at a readable measure instead. `min-w-full` keeps a
            small table spanning the column rather than huddling at the left. */}
        <table className="w-max min-w-full border-collapse text-[15.5px]">
          <thead>
            {/* The header is the only band of colour, so it carries the weight:
                ink rather than muted, and a rule under it heavy enough to read
                as the top of the working rather than as another row line. */}
            <tr className="border-b border-[#e0e0dd] bg-[#f7f7f6]">
              {columns.map((c, i) => (
                <th
                  key={i}
                  scope="col"
                  className={
                    /* `font-container`, not `font-sans` and not the reading
                       face. A column heading labels the table; it is not a
                       sentence anyone reads, and it was the app's UI font
                       (Inter) purely by inheritance rather than by choice. */
                    "whitespace-nowrap px-4 py-3 font-container text-[12px] font-semibold uppercase tracking-[0.06em] text-ink " +
                    (c.align === "right" ? "text-right" : "text-left")
                  }
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              // A carried subtotal is a figure, not a working — ruled off above
              // and set in ink so the eye can find the line the sum lands on.
              const sub = carried.has(i);
              return (
                <tr
                  key={i}
                  className={
                    "transition-colors hover:bg-[#fafaf9] " +
                    (sub ? "border-t border-[#c9c9c6]" : "border-t border-[#f0efee]")
                  }
                >
                  {r.map((v, j) => (
                    <td
                      key={j}
                      className={
                        "px-4 py-3 leading-[26px] " +
                        (sub ? "font-semibold text-ink " : "text-[#39393f] ") +
                        /* The first column is the row's name, so it holds the
                           eye while the rest of the row is read across. */
                        (j === 0 && !sub ? "font-medium text-ink " : "") +
                        cell(j)
                      }
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          {total?.length ? (
            /* The figure the working was building towards — a heavier rule
               above it, the way it is ruled off on paper. */
            <tfoot>
              <tr className="border-t-2 border-[#d9d9d7]">
                {total.map((v, j) => (
                  <td key={j} className={"px-3.5 py-2.5 font-semibold leading-6 text-ink " + cell(j)}>
                    {v}
                  </td>
                ))}
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
      {note ? <figcaption className="px-1 text-[13.5px] leading-6 text-muted">{note}</figcaption> : null}
    </figure>
  );
}

// Content column. Reading is Aptos (font-content); the containers inside a
// step take Satoshi (font-container). Headings use Familjen.
export function LessonView({ lesson, lessonId }: { lesson: Lesson; lessonId: string }) {
  /* Nothing above the title. The crumbs went first — the sidebar already says
   * where you are — and the section count followed: it sat over an unread page
   * scoring you 0/6 before you had read a word. The sidebar and the right panel
   * still carry the same numbers for anyone who wants them. */
  return (
    <div className="font-content">
      <h1 className="font-display text-[30px] font-medium leading-[1.2] tracking-[-0.02em] text-ink">{lesson.title}</h1>

      <div className="mt-8 flex flex-col gap-10">
        {lesson.sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            {/* A new section has to announce itself. Its heading used to be
                19px semibold, the same as the `h2` block used *inside* a
                section, so arriving at a new idea looked exactly like arriving
                at a sub-point of the old one, and the sources strip above it
                made the seam blurrier still.
                Now: a rule across the column, real space either side of it, and
                the heading in the display face at 24px. The in-section `h2`
                stays 19px sans, so the two are no longer interchangeable. */}
            {i > 0 && (
              <>
                <hr className="mb-8 mt-2 border-0 border-t border-[#e7e7e6]" />
                <h2 className="mb-5 font-display text-[24px] font-medium leading-[1.25] tracking-[-0.015em] text-ink">
                  {s.heading}
                </h2>
              </>
            )}
            <div className="flex flex-col gap-5">
              {s.blocks.map((b, j) => {
                /* Each block draws its own sources under itself (see
                   `BlockWithSources`), so the chips sit against the sentence
                   they back. They used to collect at the foot of the section,
                   where they read as part of the checkpoint furniture rather
                   than as a note on the paragraph above. */
                return (
                  <BlockWithSources key={j} urls={sourcesInBlock(b)}>
                    {renderBlock(b)}
                  </BlockWithSources>
                );
              })}
            </div>
            {/* One checkpoint closes each section — working down the step is
                what fills the ring. Where the section carries a check, the
                tick is earned by answering it. */}
            <Checkpoint lessonId={lessonId} checkpointId={s.id} heading={s.heading} />
          </section>
        ))}
        <StepComplete lessonId={lessonId} />
      </div>
    </div>
  );
}

/* A block, with any sources it cites shown directly beneath it. Renders the
   block alone when it cites none, which is most of them. */
function BlockWithSources({ urls, children }: { urls: string[]; children: React.ReactNode }) {
  if (!urls.length) return <>{children}</>;
  return (
    <div className="flex flex-col gap-3">
      {children}
      <SourceStrip urls={urls} />
    </div>
  );
}

/** One block, drawn. The `key` is applied by the caller's wrapper. */
function renderBlock(b: Block) {
  if (b.type === "p") return <p className="text-[18px] leading-[30px] text-[#4a4a52]"><Rich text={b.text} /></p>;
  if (b.type === "h2") return <h2 className="text-[19px] font-semibold text-ink">{b.text}</h2>;
  if (b.type === "callout")
    return (
      /* Lifted off the page with a shadow: the callout is the one sentence in a
         section meant to survive when the rest is forgotten, and a plain
         outlined box sat too flat against prose that already has boxes in it. */
      <div className="squircle rounded-3xl border border-[#e7e7e6] bg-white px-5 py-4 text-[16.5px] leading-[27px] text-[#4a4a52] shadow-lift">
        <Rich text={b.text} />
      </div>
    );
  if (b.type === "cards") return <Cards cards={b.cards} />;
  if (b.type === "playground") return <CodePlayground code={b.code} />;
  if (b.type === "formula") return <Formula text={b.text} where={b.where} />;
  if (b.type === "table")
    return (
      <DataTable
        columns={b.columns}
        rows={b.rows}
        subtotals={b.subtotals}
        total={b.total}
        note={b.note}
      />
    );
  return (
    <ul className="flex flex-col gap-2.5">
      {b.items.map((it, k) => (
        <li key={k} className="flex gap-3 text-[18px] leading-[30px] text-[#4a4a52]">
          <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#cfcfd4]" />
          <span><Rich text={it} /></span>
        </li>
      ))}
    </ul>
  );
}
