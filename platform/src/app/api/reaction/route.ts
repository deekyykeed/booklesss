import { admin } from "@/lib/supabase-admin";
import { currentUserId } from "@/lib/supabase/server";
import { authEnabled } from "@/lib/auth";
import { GRASPS, type Grasp } from "@/lib/progress-shared";

/* ------------------------------------------------------------------ *
 * How a section landed — the server copy. WRITE ONLY.
 *
 * A reaction has always lived only in the reader's own localStorage. This is the
 * other copy, and it existed for two reasons:
 *   1. the tally beside each face (owner, 2026-08-08: "numbers after each of the
 *      3 icons … counting how many people thought what about the step")
 *   2. the question a per-device store can never answer: WHICH SECTIONS LOSE
 *      PEOPLE.
 *
 * REASON 1 IS GONE (owner, 2026-08-09 — see the top of Checkpoint.tsx) and with
 * it the GET that served it: one request per step returning `{sectionId:
 * {got,almost,not}}`, tallied in JS because PostgREST cannot GROUP BY without a
 * view. It is in git if the tally ever returns.
 *
 * REASON 2 IS WHY THIS ROUTE STILL EXISTS, and it was always the bigger one. The
 * table keeps filling. Nothing in the app reads it back — the audience for
 * "which sections lose people" is whoever rewrites the step, through a query,
 * not the reader. **A new read path must not become a second tally by accident:**
 * anything that puts these numbers on a step page is re-opening a decision that
 * has been made, not adding a feature.
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
