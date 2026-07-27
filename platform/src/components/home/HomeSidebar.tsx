"use client";

import Link from "next/link";
import { useMobileNav } from "@/components/reader/MobileNav";

/* The home rail. Same material and geometry as the course navigator — this is
 * the same app, not a separate marketing shell — but it lists places rather
 * than steps.
 *
 * Only Home and Courses go anywhere yet. The rest are drawn as they will be
 * and marked "Soon" instead of being wired to a 404: showing the shape is
 * useful, pretending it works is not. */

type Item = { id: string; label: string; href?: string; icon: React.ReactNode };

const Icons = {
  home: (
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5.5H9V20H5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  ),
  courses: (
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  ),
  exams: (
    <>
      <path d="M6 3.5h12a.5.5 0 0 1 .5.5v16a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  events: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.5 1.5M16.5 16.5 18 18M18 6l-1.5 1.5M7.5 16.5 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
};

function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      {children}
    </svg>
  );
}

const ITEMS: Item[] = [
  { id: "home", label: "Home", href: "/", icon: <Glyph>{Icons.home}</Glyph> },
  { id: "courses", label: "My courses", href: "/#courses", icon: <Glyph>{Icons.courses}</Glyph> },
  { id: "exams", label: "Exams", icon: <Glyph>{Icons.exams}</Glyph> },
  { id: "events", label: "Upcoming", icon: <Glyph>{Icons.events}</Glyph> },
  { id: "settings", label: "Settings", icon: <Glyph>{Icons.settings}</Glyph> },
];

export function HomeSidebar({ active = "home" }: { active?: string }) {
  const { close } = useMobileNav();

  return (
    <aside
      className="sidebar-panel fixed left-0 top-12 z-40 flex h-[calc(100dvh-48px)] flex-col border-r border-line"
      style={{ width: "var(--sidebar-docs)" }}
    >
      <nav className="no-scrollbar flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-0.5">
          {ITEMS.map((item) =>
            item.href ? (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => close()}
                aria-current={active === item.id ? "page" : undefined}
                data-active={active === item.id ? "" : undefined}
                className="home-nav squircle"
              >
                {item.icon}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </Link>
            ) : (
              <span key={item.id} className="home-nav squircle" data-soon="">
                {item.icon}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span className="home-soon">Soon</span>
              </span>
            ),
          )}
        </div>
      </nav>
    </aside>
  );
}
