"use client";

import { type Column, type Lesson } from "@/lib/course";
import { runs } from "@/lib/emphasis";
import { CodePlayground } from "./CodePlayground";
import { Checkpoint, StepComplete } from "./Checkpoint";
import { Term } from "./Term";
import { faviconFor } from "./favicons";
import { MynaIcon } from "@/components/icons/myna";

/* The site's mark, at the end of the sentence it backs and just before the full
 * stop. The marked phrase itself is left completely alone: no underline, no
 * colour, no weight.
 *
 * Marking the phrase competed with the two marks that carry meaning. Bold says
 * "remember this" and a ruled term says "tap me"; a third underline in the same
 * paragraph turned prose into a field of decorated words and none of the three
 * read as anything in particular. A favicon at the end of the sentence says
 * where the claim came from without touching the sentence, and scanning a step
 * for them shows how much of it is externally backed.
 *
 * A host with no mark falls back to a plain link glyph. Dropping the link
 * entirely would lose it silently, since nothing in the prose is styled now. */
function SourceMark({ href }: { href: string }) {
  const icon = faviconFor(href);
  let host = href;
  try {
    host = new URL(href).hostname.replace(/^www\./, "");
  } catch {
    /* an unparseable href is the step's problem; the label just falls back */
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Source: ${host}`}
      title={host}
      className="ml-[3px] inline-block align-middle opacity-80 transition-opacity hover:opacity-100"
    >
      {icon ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={icon} alt="" aria-hidden="true" className="h-[17px] w-[17px] translate-y-[-2px] rounded-[3px]" />
      ) : (
        <MynaIcon name="external-link" size={14} className="translate-y-[-1px] text-muted" />
      )}
    </a>
  );
}

/* Step prose with its three inline marks: `**bold**`, `[[term|definition]]`
 * and `[label](url)`.
 *
 * Emphasis is the reader's recall handle, the phrase they'll find again when
 * they skim the step the night before the exam, so it is set in ink against the
 * #4a4a52 body rather than just heavier, which at 18px is barely a difference.
 *
 * Rendering is sentence by sentence rather than run by run, because a source
 * mark belongs to its sentence rather than to the words it was authored on. So
 * the runs are buffered until a sentence ends, and any marks collected along
 * the way are emitted between the last word and the full stop. A terminator
 * only counts when whitespace or the end of the block follows it, which keeps
 * "0.025%" and "ZMW 1,001,100." from splitting a sentence mid-figure. */
function Rich({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let buf: React.ReactNode[] = [];
  let marks: string[] = [];
  let k = 0;

  const flush = (tail: string) => {
    if (!buf.length && !marks.length && !tail) return;
    out.push(
      <span key={k++}>
        {buf}
        {marks.map((h, i) => (
          <SourceMark key={i} href={h} />
        ))}
        {tail}
      </span>,
    );
    buf = [];
    marks = [];
  };

  for (const r of runs(text)) {
    if (r.define) {
      buf.push(<Term key={k++} term={r.text} definition={r.define} />);
      continue;
    }
    if (r.href) {
      // The words stay exactly as written; only the mark is added, later.
      buf.push(<span key={k++}>{r.text}</span>);
      marks.push(r.href);
      continue;
    }
    // Plain or bold text can carry the sentence end, so it is split on one.
    const parts = r.text.split(/([.!?](?=\s|$))/);
    for (let i = 0; i < parts.length; i += 2) {
      const body = parts[i];
      const term = parts[i + 1];
      if (body)
        buf.push(
          r.bold ? (
            <strong key={k++} className="font-semibold text-ink">
              {body}
            </strong>
          ) : (
            <span key={k++}>{body}</span>
          ),
        );
      if (term !== undefined) flush(term);
    }
  }
  flush("");
  return <>{out}</>;
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
            {i > 0 && <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.01em] text-ink">{s.heading}</h2>}
            <div className="flex flex-col gap-5">
              {s.blocks.map((b, j) => {
                if (b.type === "p") return <p key={j} className="text-[18px] leading-[30px] text-[#4a4a52]"><Rich text={b.text} /></p>;
                if (b.type === "h2") return <h2 key={j} className="text-[19px] font-semibold text-ink">{b.text}</h2>;
                if (b.type === "callout")
                  return (
                    <div key={j} className="squircle rounded-3xl border border-[#e7e7e6] bg-white px-5 py-4 text-[16.5px] leading-[27px] text-[#4a4a52]">
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
