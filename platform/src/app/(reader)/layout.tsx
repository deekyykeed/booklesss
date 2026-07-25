import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/reader/Sidebar";
import { RightPanel } from "@/components/reader/RightPanel";
import { LessonBreadcrumb } from "@/components/reader/LessonBreadcrumb";
import { MobileNavProvider, MobileScrim } from "@/components/reader/MobileNav";

// Persistent chrome: this layout stays mounted while you navigate between
// lessons, so the sidebar's sliding active indicator animates across routes
// instead of resetting. MobileNavProvider owns the h-screen wrapper and the
// data-mobile-nav flag that drives the drawer slide.
export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileNavProvider>
      {/* Animated backdrop — shows through the transparent top bar and
          sidebar, and around the content card. */}
      <div className="bg-waves" aria-hidden="true">
        {/* 6, not 12 — the glass panel blurs them into a wash anyway, so the
            extra half were pure GPU cost for no visible gain. */}
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <TopBar orgName="Bklsss" breadcrumbSlot={<LessonBreadcrumb />} />
      <Sidebar />
      <RightPanel />
      <MobileScrim />
      {/* Flush against the top bar and the sidebar; on mobile it slides right
          to uncover the drawer. */}
      <main className="content-frame">
        <div id="content-surface" className="content-surface no-scrollbar">
          {children}
        </div>
      </main>
    </MobileNavProvider>
  );
}
