"use client";

import { useEffect, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ *
 * Live readers — the one runtime touch of Supabase.
 *
 * The site is otherwise fully static (Supabase is consumed at generation
 * time), so presence degrades to nothing: without the public env vars the
 * hook returns null forever and the UI that would show counts doesn't
 * render. One realtime channel, "live-readers": reader pages track
 * { course } onto it, the home page subscribes without tracking and counts
 * what's there. Every count is therefore a measurement of open tabs, not
 * an estimate — two tabs are honestly two readers of a sort.
 * ------------------------------------------------------------------ */

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const presenceEnabled = !!(URL_ && KEY);

let client: SupabaseClient | null = null;
function getClient(): SupabaseClient | null {
  if (!presenceEnabled) return null;
  return (client ??= createClient(URL_!, KEY!));
}

/** Live reader counts per course slug. Pass a slug to also announce this tab
 *  as reading that course; null to only watch. Returns null until the first
 *  sync — or forever, when presence isn't configured, so `null` also means
 *  "don't show a number you don't have". */
export function useLiveReaders(track: string | null): Record<string, number> | null {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const supa = getClient();
    if (!supa) return;
    const ch = supa.channel("live-readers");
    const update = () => {
      const next: Record<string, number> = {};
      for (const metas of Object.values(ch.presenceState<{ course?: string }>())) {
        for (const m of metas) if (m.course) next[m.course] = (next[m.course] ?? 0) + 1;
      }
      setCounts(next);
    };
    ch.on("presence", { event: "sync" }, update).subscribe((status) => {
      if (status === "SUBSCRIBED" && track) void ch.track({ course: track });
    });
    return () => {
      void supa.removeChannel(ch);
    };
  }, [track]);

  return counts;
}
