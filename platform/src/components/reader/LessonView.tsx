"use client";

import { type Column, type Lesson, type Section } from "@/lib/course";
import { links, runs } from "@/lib/emphasis";
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

/** Every source URL in a section, in the order the reader meets them. */
function sourcesIn(section: Section): string[] {
  const out: string[] = [];
  for (const b of section.blocks) {
    if (b.type === "p" || b.type === "callout" || b.type === "h2") out.push(...links(b.text));
    else if (b.type === "ul") for (const it of b.items) out.push(...links(it));
  }
  return out;
}

/* A display equation, set apart from the prose. `where` names each symbol
 * directly beneath it — the formula and its legend have to be readable in one
 * look, so they share a card rather than sitting as separate blocks. */
function Formula({ text, where }: { text: string; where?: string[] }) {
  return (
    <div className="squircle rounded-3xl border border-[#e7e7e6] bg-white px-5 py-5">
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
  const cell = (i: number) =>
    columns[i]?.align === "right" ? "text-right tabular-nums" : "text-left";
  const carried = new Set(subtotals ?? []);

  return (
    <figure className="flex flex-col gap-2">
      {/* Wide workings scroll inside their own box; the page never does. */}
      <div className="no-scrollbar squircle overflow-x-auto rounded-[32px] border border-[#e7e7e6] bg-white">
        <table className="w-full border-collapse text-[15.5px]">
          <thead>
            <tr className="bg-[#f7f7f6]">
              {columns.map((c, i) => (
                <th
                  key={i}
                  scope="col"
                  className={
                    "whitespace-nowrap px-3.5 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.05em] text-muted " +
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
                <tr key={i} className={sub ? "border-t border-[#c9c9c6]" : "border-t border-[#f0efee]"}>
                  {r.map((v, j) => (
                    <td
                      key={j}
                      className={
                        "px-3.5 py-2 leading-6 " +
                        (sub ? "font-semibold text-ink " : "text-[#39393f] ") +
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

// Content column. Base font is Aptos (font-content); headings use Familjen.
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
                if (b.type === "p") return <p key={j} className="text-[18px] leading-[30px] text-[#4a4a52]"><Rich text={b.text} /></p>;
                if (b.type === "h2") return <h2 key={j} className="text-[19px] font-semibold text-ink">{b.text}</h2>;
                if (b.type === "callout")
                  return (
                    /* Lifted off the page with a shadow: the callout is the one
                       sentence in a section meant to survive when the rest is
                       forgotten, and a plain outlined box sat too flat against
                       prose that already has boxes in it. */
                    <div
                      key={j}
                      className="squircle rounded-3xl border border-[#e7e7e6] bg-white px-5 py-4 text-[16.5px] leading-[27px] text-[#4a4a52] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.08),0_8px_16px_-6px_rgba(0,0,0,0.10),0_20px_32px_-16px_rgba(0,0,0,0.10)]"
                    >
                      <Rich text={b.text} />
                    </div>
                  );
                if (b.type === "playground") return <CodePlayground key={j} code={b.code} />;
                if (b.type === "formula") return <Formula key={j} text={b.text} where={b.where} />;
                if (b.type === "table")
                  return (
                    <DataTable
                      key={j}
                      columns={b.columns}
                      rows={b.rows}
                      subtotals={b.subtotals}
                      total={b.total}
                      note={b.note}
                    />
                  );
                return (
                  <ul key={j} className="flex flex-col gap-2.5">
                    {b.items.map((it, k) => (
                      <li key={k} className="flex gap-3 text-[18px] leading-[30px] text-[#4a4a52]">
                        <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#cfcfd4]" />
                        <span><Rich text={it} /></span>
                      </li>
                    ))}
                  </ul>
                );
              })}
            </div>
            {/* Sources sit between the reading and the checkpoint: after the
                idea is finished, before the reader is asked to mark it done. */}
            <SourceStrip urls={sourcesIn(s)} />
            {/* One checkpoint closes each section — working down the step is
                what fills the ring. Where the section carries a check, the
                tick is earned by answering it. */}
            <Checkpoint lessonId={lessonId} checkpointId={s.id} heading={s.heading} />
          </section>
        ))}
      </div>

      <StepComplete lessonId={lessonId} />
    </div>
  );
}
