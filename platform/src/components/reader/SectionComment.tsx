"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Section } from "@/lib/course";
import { MynaIcon } from "@/components/icons/myna";
import { needsAccount } from "@/lib/account";
import { requireAccount } from "@/lib/onboarding";
import {
  getServerSnapshot,
  getSnapshot,
  setComment,
  subscribe,
} from "@/lib/step-comments";

/* Comments, in the right panel under the table of contents (owner, 2026-08-02).
 *
 * They spent one revision inline, as a bubble in the checkpoint row that opened
 * a box under it. The owner moved them here and took the bubble off the row: a
 * third mark beside two clear controls turned that row into a toolbar, and the
 * panel is where everything ABOUT the step already lives — the section list and
 * the progress ring.
 *
 * The box follows the reading. The panel's scroll-spy already knows which
 * section is on screen, so the composer is bound to that section and re-labels
 * itself as you scroll: no picking a section from a list, no wondering what a
 * comment will attach to. Everything else you have written in the step is
 * listed underneath, and tapping one jumps to that section.
 *
 * On a phone this panel is a drawer behind a button, so a comment written here
 * is two taps away rather than under the paragraph it is about. That is the
 * trade the owner chose; it is worth revisiting once comments are real and
 * there is something to see rather than only something to write.
 */

export function StepComments({
  lessonId,
  sections,
  activeId,
  onJump,
}: {
  lessonId: string;
  sections: Section[];
  activeId: string;
  onJump: (id: string) => void;
}) {
  /* Everything commented on this device, straight from the store. The server
     snapshot is empty, so the panel renders "nothing yet" on the server and the
     real comments swap in after hydration with no mismatch. */
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const saved = store[lessonId] ?? {};
  const savedText = saved[activeId]?.text ?? "";

  /* `null` means "showing what is saved" rather than an empty edit. Derived at
     render instead of copied into state by an effect, so a comment written on
     this device appears the moment the store hydrates. */
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? savedText;
  const dirty = draft !== null && draft !== savedText;
  const area = useRef<HTMLTextAreaElement>(null);

  /* Scrolling to a new section swaps the composer over to it, and an unsaved
     draft is NOT carried across — it belongs to the section it was written
     under, and silently re-filing someone's sentence under a different heading
     is worse than losing a line they never saved. Adjusted during render (the
     documented React pattern) rather than in an effect, which would render the
     previous section's draft once before correcting itself. */
  const [prevSection, setPrevSection] = useState(activeId);
  if (prevSection !== activeId) {
    setPrevSection(activeId);
    setDraft(null);
  }

  // Grows with what is typed rather than scrolling inside a fixed box. A real
  // DOM effect, not state kept in sync by one.
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [text]);

  const activeHeading = sections.find((s) => s.id === activeId)?.heading ?? "this section";

  const save = () => {
    /* Same gate as every other recording control (owner's rule, 2026-08-03),
       applied at Save rather than at the textarea: typing costs the reader
       nothing. KNOWN COST of the 2026-08-09 redirect flow: the gate now
       navigates to /sign-in, so an unsaved draft does not survive the trip
       the way it survived the sheet. The round trip does return them to this
       section (`?next=` keeps the hash) — if this loss shows up in feedback,
       the fix is stashing the draft in localStorage before the ask, not
       bringing the sheet back. */
    if (needsAccount()) {
      requireAccount("comment");
      return;
    }
    setComment(lessonId, activeId, text);
    setDraft(null);
  };

  /* Everything written in this step, in document order, with the one being
     composed left out — it is already in the box above. */
  const others = sections.filter((s) => s.id !== activeId && saved[s.id]?.text);

  return (
    <div className="mt-6 border-t border-line pt-4">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.09em] text-[#9a9aa2]">
        Comments
      </p>

      {/* What this will attach to, named. The composer moves with the reading,
          so without this line it is never clear which section is about to get
          the comment. */}
      <p className="mb-1.5 truncate text-[12px] text-muted" title={activeHeading}>
        On <span className="text-ink">{activeHeading}</span>
      </p>

      <div
        className="squircle rounded-2xl border border-[#e7e7e6] bg-white p-2.5 font-container font-medium"
        data-no-swipe
        onKeyDown={(e) => {
          // Escape abandons the edit and falls back to what is saved.
          if (e.key === "Escape") setDraft(null);
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
        }}
      >
        <label htmlFor={`comment-${activeId}`} className="grasp-label">
          {`Your comment on ${activeHeading}`}
        </label>
        <textarea
          id={`comment-${activeId}`}
          ref={area}
          value={text}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="What did you make of this section?"
          className="block w-full resize-none border-0 bg-transparent p-0 text-[13px] leading-[21px] text-ink outline-none placeholder:text-placeholder"
        />
        {(dirty || text) && (
          <div className="mt-2 flex items-center justify-end gap-1.5 border-t border-[#f0efee] pt-2">
            <button
              type="button"
              onClick={save}
              disabled={!dirty}
              className="squircle rounded-full bg-ink px-3 py-1 text-[12.5px] text-white transition-opacity disabled:opacity-35"
            >
              {dirty ? "Save" : "Saved"}
            </button>
          </div>
        )}
      </div>

      {/* Says plainly where this goes. There is no account and no endpoint, so
          a box that looked like it posted to a thread would be lying about what
          happens when the button is pressed. */}
      <p className="mt-1.5 px-1 text-[10.5px] text-placeholder">Saved on this device</p>

      {others.length > 0 && (
        <div className="mt-3 flex flex-col gap-1">
          {others.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onJump(s.id)}
              className="squircle rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-active"
            >
              <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
                <MynaIcon name="message-dots" size={12} strokeWidth={1.6} />
                <span className="min-w-0 flex-1 truncate">{s.heading}</span>
              </span>
              {/* Two lines of what was written — enough to recognise it,
                  not enough to turn the rail into a reading surface. */}
              <span className="mt-0.5 line-clamp-2 block text-[12px] leading-[18px] text-ink-2">
                {saved[s.id].text}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
