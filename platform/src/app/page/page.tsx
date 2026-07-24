import { TopBar } from "@/components/TopBar";

/* The Framer "/page" is a work-in-progress docs surface: an "Integrations"
 * group and a "Getting started" list. Rendered statically. */

const DOCS = ["Quickstart (App Router)", "Quickstart (Pages Router)", "Core concepts"];

export default function ScratchPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <TopBar orgName="Bklsss" breadcrumb={["Course", "Lesson", "Step"]} />

      <aside
        className="fixed left-0 top-12 hidden h-[calc(100vh-48px)] flex-col overflow-y-auto scroll-thin border-r border-[#dfdfdf] bg-canvas p-2 md:flex"
        style={{ width: "var(--sidebar-docs)" }}
      >
        <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-[#d0d6e0]">
          <span>Integrations</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="-rotate-90 text-[#d0d6e0]">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="mt-2 rounded-md px-2 py-1.5 text-sm text-ink">Getting started</div>
        <div className="flex flex-col">
          {DOCS.map((d) => (
            <a
              key={d}
              href="#"
              className="rounded-md py-1.5 pl-7 pr-2 text-sm text-[#5e5f6e] transition-colors hover:text-ink"
            >
              {d}
            </a>
          ))}
        </div>
      </aside>

      <main className="pt-12 md:pl-[var(--sidebar-docs)]">
        <article className="flex flex-col gap-7 p-8" />
      </main>
    </div>
  );
}
