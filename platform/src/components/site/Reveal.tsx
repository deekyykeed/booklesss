"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Fades a block up as it scrolls into view.
 *
 * VISIBLE UNTIL PROVEN OTHERWISE. The server renders every block at full
 * strength, and only once this has mounted does a block that is still below
 * the fold get hidden to wait for its entrance. So a crawler, a no-JS visitor
 * or a slow hydrate all see the whole page — the front door has to explain
 * the product in static HTML (Google's OAuth review rejected it twice for not
 * doing so) — and nothing on screen at load ever blinks out. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"idle" | "waiting" | "in">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState("waiting");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-reveal={state}
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
