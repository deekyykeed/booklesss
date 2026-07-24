"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Item = { group: string; label: string; hint?: string };

const ITEMS: Item[] = [
  { group: "Lesson", label: "What is Economics", hint: "Course / Foundations" },
  { group: "Getting started", label: "Quickstart (App Router)", hint: "Docs" },
  { group: "Getting started", label: "Quickstart (Pages Router)", hint: "Docs" },
  { group: "Getting started", label: "Core concepts", hint: "Docs" },
  { group: "Organization", label: "Projects", hint: "Dashboard" },
  { group: "Organization", label: "Usage", hint: "Dashboard" },
  { group: "Organization", label: "Billing", hint: "Dashboard" },
];

// Inline magnifier so the trigger needs no server round-trip for its icon.
function Magnifier({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CommandSearch({ minWidth = 150 }: { minWidth?: number }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter(
      (i) => i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q),
    );
  }, [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ minWidth }}
        className="group flex items-center gap-2.5 rounded-full border border-[#d4d4d4] bg-white py-2 pl-2 pr-3 text-left shadow-[0_0.6px_0.6px_-1.25px_rgba(0,0,0,0.18),0_2.3px_2.3px_-2.5px_rgba(0,0,0,0.16),0_10px_10px_-3.75px_rgba(0,0,0,0.06)] transition-colors hover:bg-[#fbfbfb]"
        aria-label="Search"
      >
        <Magnifier size={16} className="text-muted" />
        <span className="flex-1 text-xs text-placeholder">Search...</span>
        <kbd className="rounded bg-[#f2f2f2] px-1.5 py-0.5 font-sans text-[11px] leading-none tracking-[-0.275px] text-muted">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/20 px-4 pt-[12vh] backdrop-blur-[2px]"
          onClick={close}
        >
          <div
            className="w-full max-w-[560px] overflow-hidden rounded-xl border border-[#e6e6e6] bg-white shadow-[0_16px_48px_-12px_rgba(0,0,0,0.25)]"
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
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={close}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#f4f4f4]"
                  >
                    <span className="text-sm text-ink">{item.label}</span>
                    {item.hint && <span className="text-xs text-placeholder">{item.hint}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
