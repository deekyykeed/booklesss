"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { highlight, search } from "@/lib/search";
import { scrollToSection } from "@/lib/scroll-to-section";

/* Searches the whole course — lesson titles AND the body of every section —
 * against the bundled course data (see lib/search.ts). A section hit links to
 * its anchor, so a search for a phrase lands on the paragraph containing it
 * rather than the top of the lesson. */

/** Renders a string with the matched terms marked. */
function Marked({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlight(text, query).map((p, i) =>
        p.hit ? (
          <mark key={i} className="rounded-[3px] bg-[#fdf3c7] px-[1px] text-ink">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

/* Marks a hit that points at a section rather than a whole lesson. */
function SectionMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-[3px] shrink-0 text-placeholder">
      <path d="M10 3 8 21M16 3l-2 18M3.5 8.5h17M3 15.5h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

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
  // Which result the keyboard is on. Reset whenever the query changes, since
  // the list underneath it has changed.
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => search(query), [query]);

  const close = useCallback(() => setOpen(false), []);
  const go = useCallback(
    (href: string) => {
      setOpen(false);
      const [path, hash] = href.split("#");
      /* Already on this lesson: pushing the same path wouldn't re-run the
       * route's scroll handling, so the jump has to happen here. Waiting a
       * frame lets the palette's exit animation start first. */
      if (hash && path === window.location.pathname) {
        window.history.replaceState(null, "", href);
        requestAnimationFrame(() => scrollToSection(hash));
        return;
      }
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

  /* Arrow keys move the selection and Enter opens it — table stakes for a
   * ⌘K palette, and previously the results were mouse-only. Handled on the
   * input, which holds focus the whole time the palette is open. */
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(results.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active];
      if (hit) go(hit.href);
    }
  };

  // Keep the highlighted row in view as the selection moves past the fold.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>("[data-active='true']")
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

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
      setActive(0);
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
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0); // the list underneath just changed
                  }}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search lessons and their content…"
                  aria-label="Search the course"
                  className="w-full bg-transparent py-3.5 text-sm text-ink outline-none placeholder:text-placeholder"
                />
                <kbd className="rounded border border-[#e6e6e6] bg-[#fafafa] px-1.5 py-0.5 text-[11px] leading-none text-muted">
                  Esc
                </kbd>
              </div>

              <ul ref={listRef} className="max-h-[380px] overflow-y-auto scroll-thin p-2">
                {results.length === 0 && (
                  <li className="px-3 py-8 text-center text-sm text-muted">
                    Nothing matches “{query.trim()}”.
                  </li>
                )}
                {results.map((item, i) => (
                  <li key={item.href}>
                    <button
                      type="button"
                      data-active={i === active}
                      onClick={() => go(item.href)}
                      // Pointer and keyboard drive the same selection, so the
                      // highlight never splits in two.
                      onMouseMove={() => i !== active && setActive(i)}
                      className="flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors data-[active=true]:bg-[#f4f4f4]"
                    >
                      {item.kind === "section" && <SectionMark />}
                      <span className="min-w-0 flex-1">
                        {/* The title takes the room and the context yields:
                            min-w-0 + flex-1 on the title, and a capped hint
                            that truncates and disappears entirely on narrow
                            screens. Previously the hint was shrink-0, so on a
                            phone it kept its full width and squeezed the title
                            down to a letter or two. */}
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="min-w-0 flex-1 truncate text-sm text-ink">
                            <Marked text={item.label} query={query} />
                          </span>
                          {item.hint && (
                            <span className="hidden max-w-[40%] shrink truncate text-xs text-placeholder sm:block">
                              {item.hint}
                            </span>
                          )}
                        </span>
                        {/* Why this hit matched, when it matched on body text. */}
                        {item.snippet && (
                          <span className="mt-0.5 block text-xs leading-5 text-muted">
                            <Marked text={item.snippet} query={query} />
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {results.length > 0 && (
                <div className="flex items-center gap-3 border-t border-[#ececec] px-4 py-2 text-[11px] text-placeholder">
                  <span>↑↓ to move</span>
                  <span>↵ to open</span>
                  <span className="ml-auto">
                    {results.length} result{results.length === 1 ? "" : "s"}
                  </span>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
