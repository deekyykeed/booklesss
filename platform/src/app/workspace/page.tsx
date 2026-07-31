import type { Metadata } from "next";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";

export const metadata: Metadata = {
  title: "Workspace — Booklesss",
  description: "Dark workspace shell. The sidebar is built; the board is not.",
};

/**
 * /workspace — a standalone surface, deliberately outside the app's light
 * chrome. It exists to hold the sidebar replicated from the reference shot in
 * `Booklesss Bucket/`; the panel to its right is a placeholder so the sidebar
 * is seen in the frame it belongs to, not floating on its own.
 *
 * The whole thing is fixed to the viewport because the reference is a desktop
 * app shell: the frame never scrolls, only the lists inside it do.
 */
export default function WorkspacePage() {
  return (
    <div
      className="fixed inset-0 overflow-hidden p-6"
      /* Backdrop sampled off the reference: near-#323234 at the top left,
         falling to #101010 by the bottom right. */
      style={{
        background:
          "radial-gradient(120% 110% at 18% 0%, #343436 0%, #232325 42%, #131314 78%, #0B0B0C 100%)",
      }}
    >
      <div
        className="mx-auto flex h-full w-full max-w-[1560px] overflow-hidden rounded-[24px]"
        style={{ background: "#101010", boxShadow: "0 40px 120px -40px rgba(0,0,0,0.8)" }}
      >
        <WorkspaceSidebar />

        {/* Placeholder board. Nothing here is replicated yet — it holds the
            space so the sidebar reads at its true proportion. */}
        <main className="flex flex-1 items-center justify-center p-10">
          <p className="max-w-sm text-center text-[13.5px] leading-relaxed" style={{ color: "#4A4A4A" }}>
            Board area — not built yet. The sidebar on the left is the piece
            replicated from the reference.
          </p>
        </main>
      </div>
    </div>
  );
}
