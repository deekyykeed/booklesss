import { HomeDock } from "@/components/home/HomeDock";
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
 * than removing — the rows become real as the features land. THE HOME DOCK
 * BELOW IS NOT THAT RAIL COMING BACK by another route: its four rows all go
 * somewhere that exists today, which was the rail's problem and is the test any
 * fifth row has to pass.
 *
 * `hasLeftPanel={false}` is what stops the header drawing a hamburger onto an
 * empty drawer, and stops a right-swipe pulling one open. `no-leftbar` reclaims
 * the desktop gutter the rail used to occupy, mirroring `no-rightbar` next to
 * it.
 *
 * ⚠️ THE HOME SURFACE HAS ITS OWN PALETTE AND ITS OWN BACKGROUND, both applied
 * here (owner, 2026-08-27, with the sketch: "#f9f9f7 for backgrounds. #da7757
 * for the accent #ffffff, #f0efeb"). The TOKENS are global (globals.css, next
 * to the app's own) because the dock reads them from outside this tree; only
 * the SURFACE is scoped, by `.content-surface-home` on the scroller. Two
 * consequences worth knowing before editing either:
 *
 *   · `.bg-waves` IS NOT RENDERED HERE ANY MORE. The drifting blobs exist to be
 *     seen through the frosted `#content-surface`; this surface is a flat warm
 *     off-white, so they would be six animated elements nobody can see. Every
 *     other route still has them.
 *   · `#content-surface` DROPS ITS `backdrop-filter` on this surface, which
 *     also stops it being a containing block for `position: fixed`. Do NOT read
 *     that as permission to move the dock inside `<main>`. It is one CSS line
 *     away from returning, and the failure it causes is silent — see the dock's
 *     own header, and AskDock's before it.
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* See the reader layout — a module store, so no provider and no guard. */}
      <ProgressScope />
      <MobileNavProvider hasRightPanel={false} hasLeftPanel={false}>
        <TopBar orgName="Bklsss" />
        <MobileScrim />
        {/* THE APP ARRIVES RATHER THAN APPEARING (owner, 2026-08-23: opening
            or reloading "shouldn't just feel like it's just kind of jumped
            onto the screen"). Index 2 puts the content behind the header,
            which carries `app-enter-top` on its own element — see globals.css
            for why the chrome's index is a default on the class rather than
            passed in, and AppEnter for why the whole thing runs once per
            document instead of on every navigation back here.

            The dock is deliberately NOT staggered. It is `position: fixed`, an
            animation on it would make it a containing block for the call
            button's own layers, and it is the one thing on the screen that
            should already be there when the screen arrives. */}
        <main
          className="content-frame no-rightbar no-leftbar app-enter"
          style={{ ["--enter-i" as string]: 2 }}
        >
          <div id="content-surface" className="content-surface content-surface-home no-scrollbar">
            {children}
          </div>
        </main>
        {/* ⚠️ OUTSIDE <main>, AND THAT IS THE ONLY PLACE IT WORKS. See the
            note above and the dock's own header: `#content-surface` is the
            scroller, and on every other surface it is also a backdrop-filter
            element — which makes it a containing block for fixed-position
            descendants exactly like a transform would. A "fixed" element
            rendered inside it is fixed to a box that scrolls, and rides the
            page instead of the viewport. It shipped that way for an afternoon
            on 2026-08-22: "when I scroll up or down it moves with the screen
            instead of being fixed". Anything else fixed on this page belongs
            here too. */}
        <HomeDock />
      </MobileNavProvider>
    </>
  );
}
