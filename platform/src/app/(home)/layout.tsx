import { TopBar } from "@/components/TopBar";
import { HomeSidebar } from "@/components/home/HomeSidebar";
import { MobileNavProvider, MobileScrim } from "@/components/reader/MobileNav";
import { ProgressScope } from "@/components/reader/ProgressScope";
import { clerkEnabled } from "@/lib/clerk";
import { ClerkIsland } from "@/components/ClerkIsland";

/* Home sits above the courses, so it swaps the course navigator for the home
 * rail — same chrome, same geometry, different destinations. No right rail
 * here either; that panel is about a step. */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {clerkEnabled && (
        <ClerkIsland>
          <ProgressScope />
        </ClerkIsland>
      )}
      <MobileNavProvider hasRightPanel={false}>
        <div className="bg-waves" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <TopBar orgName="Bklsss" />
        <HomeSidebar active="home" />
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
