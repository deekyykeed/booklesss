import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ *
 * The service-role Supabase client, for route handlers only.
 *
 * `server-only` is the load-bearing line: importing this from a client
 * component is a BUILD ERROR rather than a key in the browser bundle. The
 * tables it reaches — students, student_courses, and the pipeline — have RLS on
 * with no policies, so this key is the only thing that can touch them, and a
 * leak would hand a stranger every student's timetable.
 *
 * Null when the keys are absent. The reader has always worked with no Supabase
 * configured (a fresh clone, a preview build, CI), and it must keep working:
 * every caller treats a missing client as "there is no server today" and fails
 * soft, because a student halfway through sign-up must not be blocked by our
 * environment.
 * ------------------------------------------------------------------ */

let client: SupabaseClient | null | undefined;

export function admin(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}
