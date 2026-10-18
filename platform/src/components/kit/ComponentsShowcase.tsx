"use client";

import { Fit } from "./primitives";
import { AvatarTile, BookCall, BriefCard, FilesCard, GlassButtonState, NudgeCard, PlusTile } from "./JayWidgets";
import { RonSidebar } from "./RonSidebar";
import "./kit.css";

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

export function ComponentsShowcase({ className }: { className?: string }) {
  return (
    <main className={`kit ${className ?? ""}`}>
      <div className="kit-wrap">
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
            <span className="kit-hint">Tap the arrows, the card, the dots</span>
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

        <section className="kit-section">
          <header>
            <h2>Glass button</h2>
            <span className="kit-hint">Rest · hover · pressed · disabled</span>
          </header>
          <div className="kit-states">
            {(["rest", "hover", "pressed", "disabled"] as const).map((s) => (
              <div key={s} className="kit-state">
                <Fit w={320}>
                  <GlassButtonState state={s} />
                </Fit>
                <span>{s}</span>
              </div>
            ))}
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
            <span className="kit-hint">Rest · hover · selected · menu open</span>
          </header>
          <div className="kit-states">
            <div className="kit-state">
              <Fit w={346.5}>
                <FilesCard state="hover" />
              </Fit>
              <span>Hover (lifted)</span>
            </div>
            <div className="kit-state">
              <Fit w={346.5}>
                <FilesCard state="selected" />
              </Fit>
              <span>Selected</span>
            </div>
            <div className="kit-state">
              <Fit w={346.5}>
                <FilesCard state="menu" />
              </Fit>
              <span>Menu open</span>
            </div>
          </div>
        </section>

        <section className="kit-section">
          <header>
            <h2>Sidebar</h2>
            <span className="kit-hint">Tap a row, a +, the search or the ×</span>
          </header>
          <Fit w={519}>
            <RonSidebar />
          </Fit>
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
