"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { breadcrumbFor, courseIndex, pathForId } from "@/lib/course";

type Item = { label: string; hint: string; href: string };

// Built once from the REAL course tree, so search reflects the actual lessons
// (and navigates to them) rather than a placeholder list. Steps live in
// lib/course.ts today — there is no backend yet — so this stays in sync with
// the sidebar for free.
const ITEMS: Item[] = (() => {
  const { lessons } = courseIndex();
  return [...lessons.entries()].map(([id, lesson]) => ({
    label: lesson.title,
    hint: breadcrumbFor(id).slice(0, -1).join(" / "),
    href: pathForId(id),
  }));
})();

// Inline magnifier so the trigger needs no server round-trip for its icon.
function Magnifier({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // `mounted` keeps the palette in the DOM through its exit animation; `show`
  // is the on/off flag the enter/exit transitions read.
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q));
  }, [query]);

  const close = useCallback(() => setOpen(false), []);
  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  // Cmd/Ctrl-K toggles, Esc closes.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Mount, then flip `show` on the next frame so the enter transition runs from
  // the closed state. On close, flip `show` off and unmount once it has played.
  useEffect(() => {
    if (open) {
      setMounted(true);
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setShow(true));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setShow(false);
    const t = setTimeout(() => {
      setMounted(false);
      setQuery("");
    }, 200);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (show) inputRef.current?.focus();
  }, [show]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group grid h-8 w-8 place-items-center rounded-full border border-[#d4d4d4] bg-white text-left text-muted shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#fbfbfb] hover:text-ink md:flex md:h-auto md:w-auto md:min-w-[150px] md:items-center md:gap-2.5 md:py-2 md:pl-2 md:pr-3"
        aria-label="Search"
      >
        {/* Mobile: a plain circle matching the other header buttons. Desktop:
            expands into the labelled search pill with the Ctrl-K hint. */}
        <Magnifier size={16} className="text-muted" />
        <span className="hidden flex-1 text-xs text-placeholder md:block">Search...</span>
        <kbd className="hidden rounded bg-[#f2f2f2] px-1.5 py-0.5 font-sans text-[11px] leading-none tracking-[-0.275px] text-muted md:block">
          Ctrl K
        </kbd>
      </button>

      {/* Portaled to <body> so no ancestor's filter/transform (e.g. the frosted
          header) becomes its containing block and clips the full-screen
          backdrop to a strip. */}
      {mounted &&
        createPortal(
          <div
            className={
              "fixed inset-0 z-[100] flex items-start justify-center bg-black/25 px-4 pt-[12vh] backdrop-blur-md transition-opacity duration-200 " +
              (show ? "opacity-100" : "opacity-0")
            }
            onClick={close}
          >
            <div
              className={
                "w-full max-w-[560px] overflow-hidden rounded-xl border border-[#e6e6e6] bg-white shadow-[0_16px_48px_-12px_rgba(0,0,0,0.25)] transition-[opacity,transform] duration-200 ease-out " +
                (show ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-[0.98] opacity-0")
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 border-b border-[#ececec] px-4">
                <Magnifier size={18} className="text-muted" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, lessons, docs…"
                  className="w-full bg-transparent py-3.5 text-sm text-ink outline-none placeholder:text-placeholder"
                />
                <kbd className="rounded border border-[#e6e6e6] bg-[#fafafa] px-1.5 py-0.5 text-[11px] leading-none text-muted">
                  Esc
                </kbd>
              </div>

              <ul className="max-h-[320px] overflow-y-auto scroll-thin p-2">
                {results.length === 0 && (
                  <li className="px-3 py-8 text-center text-sm text-muted">No results found.</li>
                )}
                {results.map((item) => (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => go(item.href)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#f4f4f4]"
                    >
                      <span className="text-sm text-ink">{item.label}</span>
                      {item.hint && <span className="text-xs text-placeholder">{item.hint}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
