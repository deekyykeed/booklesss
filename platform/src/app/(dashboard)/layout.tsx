import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/reader/Sidebar";
import { MobileNavProvider, MobileScrim } from "@/components/reader/MobileNav";
import { ProgressScope } from "@/components/reader/ProgressScope";

/* The dashboard shares the reader's chrome — same header, same course nav —
 * but has no right rail: "on this page" and the step composer are both about a
 * step, and there isn't one here. hasRightPanel={false} hides its toggle and
 * stops a left-swipe uncovering an empty drawer; `no-rightbar` gives the
 * content back the gutter the rail would have taken.
 *
 * THE APP ARRIVES RATHER THAN APPEARING (owner, 2026-08-23: opening or
 * reloading "shouldn't just feel like it's just kind of jumped onto the
 * screen"). The three pieces below carry `app-enter-*` and an `--enter-i`
 * saying where they sit in the reading order — chrome first, from its own
 * edge, then the content it frames.
 *
 * ⚠️ THE HEADER AND THE SIDEBAR CARRY THEIR CLASS THEMSELVES — do NOT wrap
 * either in an animated <div>. Both are `position: fixed`, and an element
 * running a transform-bearing animation becomes a CONTAINING BLOCK for its
 * fixed descendants exactly as `backdrop-filter` does. Wrapped, the header
 * would be fixed to a box that is itself moving for the length of the
 * animation, and it would drift. This is the same trap AskDock paid for on
 * 2026-08-22, arriving from the other direction.
 *
 * Their stagger index is therefore a DEFAULT ON THE CLASS (see globals.css)
 * rather than an inline style — nothing here can reach inside those
 * components to set one, and a chrome element wants the same place in the
 * order wherever it is used.
 *
 * ⚠️ THE ORDER IS THE READING ORDER, NOT THE DOM ORDER. The header is index 0
 * and the sidebar 1 even though the sidebar is a wider, more prominent object:
 * the eye lands at the top of a phone screen first, and staggering against the
 * DOM instead would have the app assemble itself in an order nobody reads in.
 *
 * ⚠️ IT RUNS ONCE PER DOCUMENT. Every rule is scoped to
 * `html:not([data-entered])`, and <AppEnter> in the root layout stamps that
 * attribute when the last piece lands — otherwise navigating back here would
 * re-stage the whole screen, which is a page transition wearing an app
 * launch's clothes. Raising any index past 6 means raising SETTLED_MS there
 * with it, or the attribute lands mid-animation and the piece snaps.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* See the reader layout — a module store, so no provider and no guard. */}
      <ProgressScope />
      <MobileNavProvider hasRightPanel={false}>
        <div className="bg-waves" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <TopBar orgName="Bklsss" />
        <Sidebar />
        <MobileScrim />
        <main className="content-frame no-rightbar app-enter" style={{ ["--enter-i" as string]: 2 }}>
          <div id="content-surface" className="content-surface no-scrollbar">
            {children}
          </div>
        </main>
      </MobileNavProvider>
    </>
  );
}
