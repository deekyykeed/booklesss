import "server-only";
import { admin } from "@/lib/supabase-admin";

/* ------------------------------------------------------------------ *
 * How many students there actually are.
 *
 * One `count` off `students`, and nothing else crosses the boundary: no id, no
 * name, no WhatsApp number, no timetable. That matters, because this is the
 * only thing on a PUBLIC page that reads a service-role table, and the reason
 * it is allowed to is that a single integer cannot identify anybody.
 *
 * `head: true` sends no rows at all — PostgREST answers the count in a header,
 * so the query costs one round trip whatever the table grows to.
 *
 * NULL, NOT ZERO, WHEN THERE IS NO ANSWER. A fresh clone, a preview build and
 * CI all run with no Supabase keys, and `admin()` is null there. Zero would be
 * a claim ("nobody has signed up"); null is the absence of one, and the caller
 * draws nothing. Same fail-soft contract as /api/profile: our environment is
 * never allowed to put a wrong number in front of a visitor.
 * ------------------------------------------------------------------ */

export async function memberCount(): Promise<number | null> {
  const sb = admin();
  if (!sb) return null;
  const { count, error } = await sb
    .from("students")
    .select("id", { count: "exact", head: true });
  if (error || count === null || count === undefined) return null;
  return count;
}
