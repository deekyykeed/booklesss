"use client";

import { checkpointsFor, type Lesson } from "@/lib/course";
import { useProgress } from "@/lib/progress";
import { CodePlayground } from "./CodePlayground";
import { Checkpoint, StepComplete } from "./Checkpoint";
import { CompletionRing } from "./CompletionRing";

/* Ring + count beside the step's kicker — the same numbers the sidebar and the
 * right panel show, at the top of what they describe. */
function StepProgressBadge({ lessonId }: { lessonId: string }) {
  const { hydrated, doneCount, ratio } = useProgress();
  const total = checkpointsFor(lessonId).length;
  if (!total) return null;
  const done = hydrated ? doneCount(lessonId) : 0;

  return (
    <span className="flex shrink-0 items-center gap-1.5 text-muted">
      <CompletionRing
        value={hydrated ? ratio(lessonId) : 0}
        size={15}
        stroke={2}
        label={`${done} of ${total} checkpoints complete`}
      />
      <span className="font-sans text-xs font-medium tabular-nums">
        {done}/{total}
      </span>
    </span>
  );
}

// Content column. Base font is Aptos (font-content); headings use Familjen.
export function LessonView({ lesson, lessonId }: { lesson: Lesson; lessonId: string }) {
  return (
    <div className="font-content">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate font-sans text-xs font-medium uppercase tracking-[0.08em] text-muted">
          {lesson.kicker}
        </p>
        <StepProgressBadge lessonId={lessonId} />
      </div>
      <h1 className="font-display text-[30px] font-medium leading-[1.2] tracking-[-0.02em] text-ink">{lesson.title}</h1>

      <div className="mt-8 flex flex-col gap-10">
        {lesson.sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            {i > 0 && <h2 className="mb-4 text-[19px] font-semibold tracking-[-0.01em] text-ink">{s.heading}</h2>}
            <div className="flex flex-col gap-5">
              {s.blocks.map((b, j) => {
                if (b.type === "p") return <p key={j} className="text-[15.5px] leading-7 text-[#39393f]">{b.text}</p>;
                if (b.type === "h2") return <h2 key={j} className="text-[19px] font-semibold text-ink">{b.text}</h2>;
                if (b.type === "callout")
                  return (
                    <div key={j} className="squircle rounded-xl border border-[#e7e7e6] bg-white px-4 py-3 text-[14.5px] leading-6 text-[#4a4a52]">
                      {b.text}
                    </div>
                  );
                if (b.type === "playground") return <CodePlayground key={j} code={b.code} />;
                return (
                  <ul key={j} className="flex flex-col gap-2.5">
                    {b.items.map((it, k) => (
                      <li key={k} className="flex gap-3 text-[15.5px] leading-7 text-[#39393f]">
                        <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#cfcfd4]" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                );
              })}
            </div>
            {/* One checkpoint closes each section — ticking down the step is
                what fills the ring. */}
            <Checkpoint lessonId={lessonId} checkpointId={s.id} />
          </section>
        ))}
      </div>

      <StepComplete lessonId={lessonId} />
    </div>
  );
}
