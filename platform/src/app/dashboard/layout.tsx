import { TopBar } from "@/components/TopBar";
import { MobileNavProvider, MobileScrim } from "@/components/reader/MobileNav";
import { ProgressScope } from "@/components/reader/ProgressScope";
import { clerkEnabled } from "@/lib/clerk";
import { ClerkIsland } from "@/components/ClerkIsland";

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
      {clerkEnabled && (
        <ClerkIsland>
          <ProgressScope />
        </ClerkIsland>
      )}
      <MobileNavProvider hasRightPanel={false} hasLeftPanel={false}>
        <div className="bg-waves" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <TopBar orgName="Bklsss" />
        <MobileScrim />
        <main className="content-frame no-rightbar no-leftbar">
          <div id="content-surface" className="content-surface no-scrollbar">
            {children}
          </div>
        </main>
      </MobileNavProvider>
    </>
  );
}
