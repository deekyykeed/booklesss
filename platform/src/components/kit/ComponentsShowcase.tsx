"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { CategoryBar, type CategoryLook } from "./CategoryBar";
import { Button, CallBar, Fit } from "./primitives";
import { AvatarTile, BookCall, BriefCard, FilesCard, NudgeCard, PlusTile } from "./JayWidgets";
import { RonSidebar } from "./RonSidebar";
import { FolderCard, type FolderStat } from "./FolderCard";
import { APP_FOOT, APP_NAV } from "./AppShell";
import "./kit.css";
import "./app.css";

/* /components — the live half of the Paper page "Components". The board shows
 * every piece still; this page shows what each one does. Phone first: every
 * widget keeps its drawn size and is scaled to the screen by <Fit>, so a
 * phone sees the same proportions the desktop does. */

const SWATCHES: [string, string][] = [
  ["Page", "#E0E0E0"],
  ["Tile", "#F6F6F6"],
  ["Ink", "#0A0A0A"],
  ["Quiet text", "#A3A3A3"],
  ["Label", "#C4C4C4"],
  ["Count", "#7F7F81"],
  ["Sun", "#F7B500"],
  ["Glass panel", "#EBEAF0"],
  ["Glass card", "#FBFBFD"],
  ["Peach", "#FFB57C"],
  ["Coral", "#FF9C8C"],
  ["Blue", "#5C68FE"],
];

/* The widest pair that shares a row on a phone: the brief (382.5) beside the
 * avatar (166) with the 26.5 gutter between — and Happy Files (346.5) beside
 * the add tile (201.5) comes to the same 575. Below that column width every
 * component on the page shrinks by the same factor. */
const PAIR = 575;

const FOLDER_STATS: FolderStat[] = [
  { icon: "image", n: 6, label: "units", kind: "image" },
  { icon: "video", n: 26, label: "steps", kind: "video" },
  { icon: "file", n: 128, label: "quick checks", kind: "file" },
  { icon: "video", n: 2, label: "hours", kind: "video" },
];

const FOLDER_STATES: [undefined | "hover" | "selected" | "menu", string][] = [
  [undefined, "Rest"],
  ["hover", "Hover (lifted)"],
  ["selected", "Selected"],
  ["menu", "Menu open"],
];

const LOOKS: [CategoryLook, string][] = [
  ["duotone", "Solar · Bold Duotone"],
  ["bold", "Solar · Bold"],
  ["plump", "Streamline · Plump"],
];

const TODS = [
  { tod: "morning", label: "Morning", icon: "sun" },
  { tod: "evening", label: "Evening", icon: "sun-cloud" },
  { tod: "night", label: "Night", icon: "moon" },
] as const;

export function ComponentsShowcase({ className }: { className?: string }) {
  const [cats, setCats] = useState<Record<string, string>>({});
  const catOf = (k: string) => cats[k] ?? "finance";
  const setCat = (k: string) => (id: string) => setCats((c) => ({ ...c, [k]: id }));
  const main = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const host = main.current;
    const col = wrap.current;
    if (!host || !col) return;
    const set = () => {
      // 1px under the column so the pairs never round over and wrap.
      const s = Math.min(1, (col.clientWidth - 1) / PAIR);
      host.style.setProperty("--kit-s", s.toFixed(4));
      host.dataset.ready = "";
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(col);
    return () => ro.disconnect();
  }, []);

  return (
    <main ref={main} className={`kit ${className ?? ""}`}>
      <div ref={wrap} className="kit-wrap">
        <header className="kit-head">
          <h1>Components</h1>
          <p>
            The pieces the app is built from, working. Tap, hover and type — each one does here what it will do in
            the app.
          </p>
        </header>

        <section className="kit-section">
          <header>
            <h2>Widgets</h2>
            <span className="kit-hint">The Jay reference set, shrunk to fit this screen · the real-size kit is below</span>
          </header>
          <div className="kit-stage">
            <Fit w={563}>
              <BookCall />
            </Fit>
            <Fit w={166}>
              <AvatarTile />
            </Fit>
            <Fit w={382.5}>
              <BriefCard />
            </Fit>
            <Fit w={346.5}>
              <FilesCard />
            </Fit>
            <Fit w={201.5}>
              <PlusTile />
            </Fit>
            <Fit w={527}>
              <NudgeCard />
            </Fit>
          </div>
        </section>

        {/* Real sizes, never scaled: a button is the same size on a phone as
            anywhere else. The widget's button above stays widget-sized. */}
        <section className="kit-section">
          <header>
            <h2>Buttons</h2>
            <span className="kit-hint">36 · 44 · 52 tall · icons 16 / 20</span>
          </header>

          <div className="kit-btn-group">
            <span>Glass · primary</span>
            <div className="kit-btn-row">
              <Button size="sm">Book a Call</Button>
              <Button size="md">Book a Call</Button>
              <Button size="lg">Book a Call</Button>
            </div>
          </div>

          <div className="kit-btn-group">
            <span>Soft · secondary</span>
            <div className="kit-btn-row">
              <Button variant="soft" size="sm">
                Not now
              </Button>
              <Button variant="soft" size="md">
                Not now
              </Button>
              <Button variant="soft" size="lg">
                Not now
              </Button>
            </div>
          </div>

          <div className="kit-btn-group">
            <span>With an icon · icon only</span>
            <div className="kit-btn-row">
              <Button size="md" icon="play">
                Start
              </Button>
              <Button variant="soft" size="md" icon="plus">
                New folder
              </Button>
              <Button size="md" icon="plus" iconOnly label="Add" />
              <Button variant="soft" size="md" icon="dots" iconOnly label="More" />
              <Button variant="soft" size="sm" icon="search" iconOnly label="Search" />
              <Button variant="soft" size="sm" icon="user" iconOnly label="Profile" />
            </div>
          </div>

          <div className="kit-btn-group">
            <span>Rest · hover · pressed · disabled</span>
            <div className="kit-btn-row">
              <Button size="md">Book a Call</Button>
              <Button size="md" state="hover">
                Book a Call
              </Button>
              <Button size="md" state="pressed">
                Book a Call
              </Button>
              <Button size="md" disabled>
                Book a Call
              </Button>
            </div>
            <div className="kit-btn-row">
              <Button variant="soft" size="md">
                Not now
              </Button>
              <Button variant="soft" size="md" state="hover">
                Not now
              </Button>
              <Button variant="soft" size="md" state="pressed">
                Not now
              </Button>
              <Button variant="soft" size="md" disabled>
                Not now
              </Button>
            </div>
          </div>

          <div className="kit-btn-group">
            <span>In use · the widget as a control</span>
            <div className="kit-btn-row">
              <CallBar />
            </div>
          </div>
        </section>

        <section className="kit-section">
          <header>
            <h2>Buttons by time of day</h2>
            <span className="kit-hint">Morning is the original · evening is a sunset · night is moonlit</span>
          </header>
          <div className="kit-tods">
            {TODS.map((t) => (
              <div key={t.tod} className="kit-tod" data-tod={t.tod}>
                <span className="kit-tod-head">
                  <HugeIcon name={t.icon} size={16} strokeWidth={1.75} />
                  {t.label}
                </span>
                <div className="kit-btn-row">
                  <Button size="md" icon="play">
                    Start
                  </Button>
                  <Button variant="soft" size="md">
                    Not now
                  </Button>
                  <Button size="md" icon="plus" iconOnly label="Add" />
                  <Button variant="soft" size="md" icon="dots" iconOnly label="More" />
                </div>
                <div className="kit-btn-row">
                  <Button size="sm">Book a Call</Button>
                  <Button size="sm" state="pressed">
                    Pressed
                  </Button>
                  <Button variant="soft" size="sm" disabled>
                    Disabled
                  </Button>
                </div>
                <div className="kit-btn-row">
                  <CallBar />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="kit-section">
          <header>
            <h2>Category selector</h2>
            <span className="kit-hint">Three icon sets · tap to choose · scrolls sideways on a phone</span>
          </header>
          {LOOKS.map(([look, name]) => (
            <div key={look} className="kit-cat-demo">
              <span>{name}</span>
              <CategoryBar look={look} value={catOf(look)} onChange={setCat(look)} />
            </div>
          ))}
          <div className="kit-cat-demo">
            <span>Tiles · Solar Bold Duotone</span>
            <CategoryBar layout="tiles" value={catOf("tiles")} onChange={setCat("tiles")} />
          </div>
          <div className="kit-cat-demo">
            <span>Tiles · Streamline Plump</span>
            <CategoryBar layout="tiles" look="plump" value={catOf("tiles-p")} onChange={setCat("tiles-p")} />
          </div>
        </section>

        <section className="kit-section">
          <header>
            <h2>Brief card</h2>
            <span className="kit-hint">One, two, three notes · the greeting follows the clock</span>
          </header>
          <div className="kit-states">
            <div className="kit-state">
              <Fit w={382.5}>
                <BriefCard stack={1} fixed={{ t: "9:41", ap: "AM", hour: 9 }} />
              </Fit>
              <span>Morning · one note</span>
            </div>
            <div className="kit-state">
              <Fit w={382.5}>
                <BriefCard stack={2} fixed={{ t: "1:15", ap: "PM", hour: 13 }} />
              </Fit>
              <span>Afternoon · two</span>
            </div>
            <div className="kit-state">
              <Fit w={382.5}>
                <BriefCard stack={3} fixed={{ t: "7:30", ap: "PM", hour: 19 }} />
              </Fit>
              <span>Evening · three</span>
            </div>
          </div>
        </section>

        <section className="kit-section">
          <header>
            <h2>Folder card</h2>
            <span className="kit-hint">Real size · title 28 · description 16 · stats 16 with 18px icons</span>
          </header>
          <div className="kit-fc-states">
            {FOLDER_STATES.map(([state, label]) => (
              <div key={label} className="kit-state">
                <FolderCard
                  state={state}
                  title="Corporate Finance"
                  eyebrow="FINANCE"
                  description="Investment appraisal, cost of capital, valuation and risk."
                  stats={FOLDER_STATS}
                  actions={[{ label: "Open" }, { label: "Save" }, { label: "Share" }]}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="kit-section">
          <header>
            <h2>Sidebar</h2>
            <span className="kit-hint">Real size, as the app draws it · 16px rows · 18px icons</span>
          </header>
          <div className="kit-side-demo">
            <RonSidebar app compact flush minimal brand="booklesss" title="Explore" nav={APP_NAV} foot={APP_FOOT} />
          </div>
        </section>

        <section className="kit-section">
          <header>
            <h2>Tokens</h2>
            <span className="kit-hint">The colours every piece above is made of</span>
          </header>
          <div className="kit-gradient" aria-hidden />
          <div className="kit-swatches">
            {SWATCHES.map(([name, hex]) => (
              <div key={name} className="kit-swatch">
                <div style={{ background: hex }} />
                {name}
                <code>{hex}</code>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
