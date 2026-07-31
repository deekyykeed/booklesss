import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offline · Booklesss" };

/* Shown only when a reader opens a step they have never opened before while
 * they have no connection. Anything already read is served from the cache and
 * never reaches this page.
 *
 * It is cached at install time, so it must not depend on course data or on
 * anything the network would have to supply — including a "retry" that fetches.
 * Reloading is the retry. */
export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-3 px-6 text-center">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
        You&rsquo;re offline
      </h1>
      <p className="text-[15px] leading-relaxed text-ink-2">
        This step hasn&rsquo;t been opened on this device yet, so there&rsquo;s no saved copy to
        read. Steps you&rsquo;ve already read are still available.
      </p>
      <p className="text-[15px] leading-relaxed text-muted">
        Reconnect and reload, or go back to a step you&rsquo;ve read before.
      </p>
    </main>
  );
}
