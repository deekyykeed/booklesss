"use client";

import { useEffect, useRef, useState } from "react";
import { useSwipeDrawer } from "@/lib/use-swipe-drawer";
import { ExplorePage } from "@/components/home/claude-ui/studio/ExplorePage";
import { StudioPage } from "@/components/home/claude-ui/studio/StudioPage";
import { MarketHome } from "./MarketHome";
import { Button } from "./primitives";
import { RonSidebar, type SidebarItem } from "./RonSidebar";
import "./kit.css";
import "./app.css";

/* The app, built from the kit (owner, 2026-10-18: "have the sidebar active,
 * and to work on mobile with the same functionality as the Booklesss sidebar
 * I had before, where you swipe"). The Ron sidebar is the real navigation:
 *
 *   ≥ 1280px  the whole two-column panel, docked, scaled to the screen height
 *   900–1279  its first column alone (compact), docked
 *   < 900     the compact column as a PULLED DRAWER — lib/use-swipe-drawer,
 *             the same hook and the same numbers as the old sidebar: it
 *             follows the finger, settles on 40% or a flick, closes on a
 *             swipe, a tap on the blurred scrim, the ×, or Escape.
 *
 * Studio and My courses are the video framework built earlier the same day
 * (components/home/claude-ui/studio); they are .cui components, so they sit
 * inside a .cui wrapper with its page colour cleared. */

const NAV: SidebarItem[] = [
  { id: "explore", icon: "nav-home", label: "Explore" },
  { id: "library", icon: "nav-files", label: "My courses" },
  { id: "studio", icon: "video", label: "Studio", add: true },
  { id: "saved", icon: "bookmark", label: "Saved" },
  { id: "creators", icon: "star", label: "Creators" },
  { id: "more", icon: "nav-more", label: "More" },
];

const FOOT: SidebarItem[] = [
  { id: "notifications", icon: "mail", label: "Notifications" },
  { id: "settings", icon: "settings", label: "Settings" },
  { id: "account", icon: "user", label: "Account" },
];

const DRAWER = "(max-width: 899px)";
const FULL = "(min-width: 1280px)";
const FRAME_H = 933;

export function AppShell({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("explore");
  // Compact until measured, so a phone never paints the 519px panel first.
  const [full, setFull] = useState(false);

  useSwipeDrawer({ root: rootRef, side: sideRef, scrim: scrimRef, open, setOpen, query: DRAWER });

  useEffect(() => {
    const mq = window.matchMedia(FULL);
    const sync = () => {
      setFull(mq.matches);
      const z = Math.min(1, (window.innerHeight - 16) / FRAME_H);
      rootRef.current?.style.setProperty("--side-z", z.toFixed(4));
    };
    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const all = [...NAV, ...FOOT];
  const label = all.find((n) => n.id === page)?.label ?? "Explore";

  const pick = (id: string | null) => {
    setPage(id ?? "explore");
    if (window.matchMedia(DRAWER).matches) setOpen(false);
  };

  return (
    <div ref={rootRef} className={`kit kit-app ${open ? "nav-open" : ""} ${className ?? ""}`}>
      <div className="kit-app-scrim" ref={scrimRef} onClick={() => setOpen(false)} aria-hidden />
      <div className="kit-app-side" ref={sideRef}>
        <RonSidebar
          app
          brand="booklesss"
          title={label}
          nav={NAV}
          foot={FOOT}
          active={page}
          onPick={pick}
          onClose={() => setOpen(false)}
          compact={!full}
          flush
        />
      </div>

      <main className="kit-app-main">
        {page !== "explore" && (
          <div className="kit-app-bar">
            <Button variant="soft" size="sm" icon="menu" iconOnly label="Open menu" onClick={() => setOpen(true)} />
          </div>
        )}
        {page === "explore" && <MarketHome onMenu={() => setOpen(true)} />}
        {page === "studio" && (
          <div className="cui kit-app-cui">
            <StudioPage />
          </div>
        )}
        {page === "library" && (
          <div className="cui kit-app-cui">
            <ExplorePage />
          </div>
        )}
        {page !== "explore" && page !== "studio" && page !== "library" && (
          <div className="kit-app-soon">
            <h2>{label}</h2>
            Built next. Explore, My courses and Studio work now.
          </div>
        )}
      </main>
    </div>
  );
}
