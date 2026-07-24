import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/reader/Sidebar";
import { LessonBreadcrumb } from "@/components/reader/LessonBreadcrumb";

// Persistent chrome: this layout stays mounted while you navigate between
// lessons, so the sidebar's sliding active indicator animates across routes
// instead of resetting.
export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-canvas">
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
      {/* Flush against the top bar and the sidebar; inset only from the
          right and bottom edges. The left inset tracks the resizable sidebar. */}
      <main className="content-frame">
        <div id="content-surface" className="content-surface no-scrollbar h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
