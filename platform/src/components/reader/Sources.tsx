import { MynaIcon } from "@/components/icons/myna";

/* "Where this is taught properly" — the outside sources for a section.
 *
 * The lecture decks and textbooks a step is built from are not in here on
 * purpose. They set what gets covered, but a reader can't open them and
 * shouldn't be sent to them; the sites that teach the same idea for a living
 * can be, and are the ones a student actually goes to at 11pm.
 *
 * Styled quieter than a callout — this is an exit from the step, and it should
 * not compete with the step for attention while the reader is still in it.
 */
export function Sources({
  items,
}: {
  items: { label: string; url: string; site?: string; note?: string }[];
}) {
  return (
    <aside className="squircle rounded-2xl border border-[#e7e7e6] bg-[#fafafa] px-4 py-3.5">
      <p className="mb-2.5 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">
        <MynaIcon name="external-link" size={13} />
        Read further
      </p>
      <ul className="flex flex-col gap-2.5">
        {items.map((s) => (
          <li key={s.url} className="text-[14.5px] leading-6">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-[#c9c9cf] underline-offset-[3px] transition-colors hover:decoration-ink"
            >
              {s.label}
            </a>
            {s.site && <span className="text-muted"> · {s.site}</span>}
            {s.note && <span className="block text-[14px] text-muted">{s.note}</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
}
