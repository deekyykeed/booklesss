"use client";

import { useEffect, useRef, useState } from "react";
import { MynaIcon } from "@/components/icons/myna";
import { commentFor, setComment } from "@/lib/step-comments";

/* The comment box for one section.
 *
 * Two pieces, because they sit in different places: the BUTTON belongs in the
 * checkpoint row beside the note button, and the BOX opens BELOW the whole row
 * (owner, 2026-08-02). So the open state lives in Checkpoint, which owns both
 * ends, and this file exports the two halves rather than one self-contained
 * dropdown the way SectionNote does.
 *
 * Below, not floating: unlike the note menu this is something you type into,
 * and a popover over the next section's first line is the wrong shape for that
 * — it hides the very words you are commenting on and a phone keyboard would
 * shove it off the screen. Pushing the page down instead costs nothing; the
 * section is finished by the time the row is reached.
 */

export function CommentButton({
  hasComment,
  open,
  onToggle,
}: {
  hasComment: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const label = hasComment ? "Edit your comment" : "Comment on this section";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={label}
      /* Same as its neighbours: the word is off-screen, so the tooltip is the
         only way a mouse reader recovers it. */
      title={label}
      className="grasp-btn squircle"
      /* Active on "there is a comment here", not on "the box is open" — the
         mark reports the section's state, and a box opened and closed again
         without typing has changed nothing. */
      data-active={hasComment ? "" : undefined}
      style={{ "--grasp-tone": "#5b5b66" } as React.CSSProperties}
    >
      <MynaIcon name={hasComment ? "message-dots-solid" : "message-dots"} size={20} strokeWidth={1.2} />
      <span className="grasp-label">{label}</span>
    </button>
  );
}

export function CommentBox({
  lessonId,
  sectionId,
  heading,
  onClose,
  onSaved,
}: {
  lessonId: string;
  sectionId: string;
  heading: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [text, setText] = useState("");
  const area = useRef<HTMLTextAreaElement>(null);

  /* localStorage is read after mount, like every other store here — the server
     render knows nothing and guessing would flash someone else's words. */
  useEffect(() => {
    const existing = commentFor(lessonId, sectionId);
    setText(existing?.text ?? "");
    const el = area.current;
    if (el) {
      el.focus();
      // Caret at the end, not the start: reopening a saved comment is almost
      // always to add to it.
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [lessonId, sectionId]);

  /* Grows with what is typed instead of scrolling inside a fixed box. Runs on
     every change because the value can also arrive from the effect above. */
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const save = () => {
    setComment(lessonId, sectionId, text);
    onSaved();
    onClose();
  };

  return (
    <div
      /* `font-container` — this is a container round the reading, not the
         reading, so Satoshi at 500 like every other framing surface. */
      className="squircle mt-3 rounded-2xl border border-[#e7e7e6] bg-white p-3.5 font-container font-medium shadow-lift"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
        // ⌘/Ctrl+Enter saves, for anyone reading on a laptop. Plain Enter has
        // to stay a newline — this is a paragraph box, not a chat line.
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
      }}
    >
      <label htmlFor={`comment-${sectionId}`} className="grasp-label">
        {`Your comment on "${heading}"`}
      </label>
      <textarea
        id={`comment-${sectionId}`}
        ref={area}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="What did you make of this section?"
        className="block w-full resize-none border-0 bg-transparent p-0 text-[15.5px] leading-[25px] text-ink outline-none placeholder:text-[#9a9aa2]"
      />
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#f0efee] pt-2.5">
        {/* Says plainly where this goes. There is no account and no endpoint,
            so a box that looked like it posted to a thread would be lying about
            what happens when you press the button. */}
        <span className="text-[12.5px] leading-4 text-muted">Saved on this device</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClose}
            className="squircle rounded-full px-3 py-1.5 text-[14px] text-ink-2 transition-colors hover:bg-[#f4f4f3]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="squircle rounded-full bg-ink px-3.5 py-1.5 text-[14px] text-white transition-opacity hover:opacity-85"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
