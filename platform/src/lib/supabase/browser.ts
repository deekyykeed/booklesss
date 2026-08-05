"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { authEnabled, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/auth";

/* ------------------------------------------------------------------ *
 * The browser's Supabase client — the session, and the student's own row.
 *
 * ONE INSTANCE PER TAB, cached in the module. `createBrowserClient` is
 * documented as safe to call repeatedly, but each call builds a fresh auth
 * client with its own refresh timer and its own `onAuthStateChange` listener
 * set, and this app subscribes from a component that React may mount twice in
 * development. A singleton makes "who is signed in" one answer rather than a
 * race between two clients refreshing the same cookie.
 *
 * NULL WHEN UNCONFIGURED, exactly like `admin()` next door in supabase-admin.
 * The reader has always worked with no keys and must keep working: every
 * caller treats null as "there are no accounts today" and carries on
 * signed-out. Throwing here would take down a step page over an env var.
 *
 * COOKIES, NOT localStorage. `createBrowserClient` from `@supabase/ssr` stores
 * the session in a cookie so the SERVER can read it too — which is the whole
 * reason this app uses `@supabase/ssr` rather than plain `supabase-js`. The
 * onboarding gate, `/api/profile` and every route handler all need to know who
 * is signed in, and a session in localStorage is invisible to all of them.
 * ------------------------------------------------------------------ */

let client: SupabaseClient | null | undefined;

export function browserClient(): SupabaseClient | null {
  if (client !== undefined) return client;
  client = authEnabled ? createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
  return client;
}
