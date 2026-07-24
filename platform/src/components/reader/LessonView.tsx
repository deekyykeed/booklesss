import type { Lesson } from "@/lib/course";
import { CodePlayground } from "./CodePlayground";

// Content column. Base font is Aptos (font-content); headings use Familjen.
export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <div className="font-content">
      <p className="mb-2 font-sans text-xs font-medium uppercase tracking-[0.08em] text-muted">{lesson.kicker}</p>
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
          </section>
        ))}
      </div>
    </div>
  );
}
