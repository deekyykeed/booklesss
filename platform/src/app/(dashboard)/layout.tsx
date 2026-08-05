import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/reader/Sidebar";
import { MobileNavProvider, MobileScrim } from "@/components/reader/MobileNav";
import { ProgressScope } from "@/components/reader/ProgressScope";

/* The dashboard shares the reader's chrome — same header, same course nav —
 * but has no right rail: "on this page" and the step composer are both about a
 * step, and there isn't one here. hasRightPanel={false} hides its toggle and
 * stops a left-swipe uncovering an empty drawer; `no-rightbar` gives the
 * content back the gutter the rail would have taken. */
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
        <main className="content-frame no-rightbar">
          <div id="content-surface" className="content-surface no-scrollbar">
            {children}
          </div>
        </main>
      </MobileNavProvider>
    </>
  );
}
