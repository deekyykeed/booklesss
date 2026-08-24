import { AskDock } from "@/components/home/AskDock";
import { TopBar } from "@/components/TopBar";
import { MobileNavProvider, MobileScrim } from "@/components/reader/MobileNav";
import { ProgressScope } from "@/components/reader/ProgressScope";

/**
 * Home sits above the courses. It has no right rail — that panel is about a
 * step — and, since 2026-08-05, no left one either.
 *
 * THE HOME RAIL IS PARKED, NOT DELETED (owner: "remove this sidebar
 * temporarily, don't need it yet"). Four of its six rows were SOON placeholders
 * — Community, Exams, Upcoming, Settings — so it spent a third of a phone
 * screen advertising things that do not exist, and the two rows that did work
 * are both reachable from the header: the wordmark goes to the dashboard and
 * the user menu carries the same two links.
 *
 * `components/home/HomeSidebar.tsx` stays on disk untouched. Putting it back is
 * this import and this one line, which is the whole point of parking rather
 * than removing — the rows become real as the features land.
 *
 * `hasLeftPanel={false}` is what stops the header drawing a hamburger onto an
 * empty drawer, and stops a right-swipe pulling one open. `no-leftbar` reclaims
 * the desktop gutter the rail used to occupy, mirroring `no-rightbar` next to
 * it.
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* See the reader layout — a module store, so no provider and no guard. */}
      <ProgressScope />
      <MobileNavProvider hasRightPanel={false} hasLeftPanel={false}>
        <div className="bg-waves" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <TopBar orgName="Bklsss" />
        <MobileScrim />
        {/* THE APP ARRIVES RATHER THAN APPEARING (owner, 2026-08-23: opening
            or reloading "shouldn't just feel like it's just kind of jumped
            onto the screen"). Index 2 puts the content behind the header,
            which carries `app-enter-top` on its own element — see globals.css
            for why the chrome's index is a default on the class rather than
            passed in, and AppEnter for why the whole thing runs once per
            document instead of on every navigation back here.

            The ask box is deliberately NOT staggered. It is `position: fixed`
            and already animates its own insets and radius; a second transform
            on the same element during the opening would fight the morph it
            plays when tapped. */}
        <main
          className="content-frame no-rightbar no-leftbar app-enter"
          style={{ ["--enter-i" as string]: 2 }}
        >
          <div id="content-surface" className="content-surface no-scrollbar">
            {children}
          </div>
        </main>
        {/* ⚠️ OUTSIDE <main>, AND THAT IS THE ONLY PLACE IT WORKS. The ask box
            is `position: fixed`, and `#content-surface` carries
            `backdrop-filter: blur(16px)` — which makes it a CONTAINING BLOCK
            for fixed-position descendants, exactly like a transform would. It
            is also the scroller. So a "fixed" element rendered inside it is
            fixed to a box that scrolls, and rides the page instead of the
            viewport. It shipped that way for an afternoon on 2026-08-22:
            "when I scroll up or down it moves with the screen instead of being
            fixed". Nothing about the element was wrong; it was in the wrong
            parent. Anything else fixed on this page belongs here too. */}
        <AskDock />
      </MobileNavProvider>
    </>
  );
}
