import { admin } from "@/lib/supabase-admin";
import { currentUserId } from "@/lib/supabase/server";
import { authEnabled } from "@/lib/auth";
import { GRASPS, type Grasp } from "@/lib/progress-shared";

/* ------------------------------------------------------------------ *
 * How a section landed — the server copy, and the counts read back.
 *
 * A reaction has always lived only in the reader's own localStorage. This is the
 * other copy, and it exists for two reasons, in this order:
 *   1. the tally beside each face (owner, 2026-08-08: "numbers after each of the
 *      3 icons … counting how many people thought what about the step")
 *   2. the question a per-device store can never answer: WHICH SECTIONS LOSE
 *      PEOPLE. That one is worth more than the tally.
 *
 * THE USER ID COMES FROM THE VERIFIED SESSION, NEVER THE BODY. `currentUserId()`
 * calls `getUser()`, which has the token checked by the auth server rather than
 * trusting a cookie's claims — the same rule /api/profile follows, and the only
 * thing stopping one signed-in reader overwriting another's answers.
 *
 * IT FAILS SOFT, ALWAYS. No auth configured, no service key, a dropped
 * connection, a bad row: all answer 200 with `ok: false` and a reason. The
 * reaction is already in localStorage by the time this is called, so the reader
 * has lost nothing and must never be shown an error for a tally that did not
 * save. Same contract as /api/profile.
 * ------------------------------------------------------------------ */

/** GET /api/reaction?lesson=<id> → { counts: { [sectionId]: {got,almost,not} } }
 *
 *  One request per STEP, not per section. A step draws a row of faces per
 *  section, so a per-section fetch would be three to six requests for one page.
 *
 *  Counts only. No user ids, no timestamps, nothing that says who said what —
 *  which is what makes it safe to hand to a browser at all. */
export async function GET(req: Request) {
  const lesson = new URL(req.url).searchParams.get("lesson");
  if (!lesson) return Response.json({ ok: false, reason: "no-lesson" }, { status: 400 });

  const sb = admin();
  if (!sb) return Response.json({ ok: true, counts: {} });

  const { data, error } = await sb
    .from("section_reactions")
    .select("section_id, grasp")
    .eq("lesson_id", lesson);

  if (error || !data) return Response.json({ ok: true, counts: {} });

  /* Tallied here rather than in SQL. A GROUP BY would be the tidier query, but
     PostgREST cannot express one without a view or an RPC, and this is a handful
     of rows per lesson — the whole readership is smaller than one step's worth of
     sections. Revisit if a lesson ever returns thousands. */
  const counts: Record<string, Record<Grasp, number>> = {};
  for (const row of data) {
    const g = row.grasp as Grasp;
    if (!GRASPS.includes(g)) continue; // a value the check constraint should have refused
    counts[row.section_id] ??= { got: 0, almost: 0, not: 0 };
    counts[row.section_id][g] += 1;
  }

  return Response.json(
    { ok: true, counts },
    /* Cached briefly at the edge. A tally does not have to be to-the-second, and
       without this every step view is a database round trip. Short enough that a
       reader who answers and reloads sees their own vote counted. */
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=120" } },
  );
}

/** POST /api/reaction — body { lesson, section, grasp }.
 *
 *  `grasp: null` deletes the row, which is what "press the answer you already
 *  gave to take it back" means on the server. Without it, an undo would leave a
 *  vote counted forever. */
export async function POST(req: Request) {
  if (!authEnabled) return Response.json({ ok: false, reason: "no-auth" });

  const userId = await currentUserId();
  if (!userId) return Response.json({ ok: false, reason: "signed-out" }, { status: 401 });

  let body: { lesson?: unknown; section?: unknown; grasp?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, reason: "bad-json" }, { status: 400 });
  }

  const lesson = typeof body.lesson === "string" ? body.lesson : null;
  const section = typeof body.section === "string" ? body.section : null;
  if (!lesson || !section) return Response.json({ ok: false, reason: "bad-target" }, { status: 400 });

  /* Validated against the same list the reader uses, not just "is a string".
     The column has a CHECK too — this is so a typo answers 400 rather than
     surfacing as a database error. */
  const grasp = body.grasp === null ? null : GRASPS.includes(body.grasp as Grasp) ? (body.grasp as Grasp) : undefined;
  if (grasp === undefined) return Response.json({ ok: false, reason: "bad-grasp" }, { status: 400 });

  const sb = admin();
  if (!sb) return Response.json({ ok: false, reason: "no-server" });

  if (grasp === null) {
    const { error } = await sb
      .from("section_reactions")
      .delete()
      .eq("user_id", userId)
      .eq("lesson_id", lesson)
      .eq("section_id", section);
    return Response.json({ ok: !error });
  }

  const { error } = await sb.from("section_reactions").upsert(
    { user_id: userId, lesson_id: lesson, section_id: section, grasp, updated_at: new Date().toISOString() },
    /* The primary key, so changing your mind updates the one row you own rather
       than adding a second vote. */
    { onConflict: "user_id,lesson_id,section_id" },
  );
  return Response.json({ ok: !error });
}
