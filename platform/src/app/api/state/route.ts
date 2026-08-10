import { admin } from "@/lib/supabase-admin";
import { currentUserId } from "@/lib/supabase/server";
import { authEnabled } from "@/lib/auth";
import {
  bundleSize,
  cleanBundle,
  EMPTY_PROGRESS,
  type StateBundle,
} from "@/lib/study-state";

/* ------------------------------------------------------------------ *
 * What a student DOES, given a server home. Both directions, one route.
 *
 * Until 2026-08-10 only who a student IS travelled with the account. Progress,
 * saves, note verdicts and typed comments lived in localStorage alone — so a
 * cleared browser, a reinstalled app or a new phone wiped every one of them, and
 * a student who signed in on a second device got their name and their courses
 * back beside a dashboard that said they had never studied.
 *
 * ── ONE ROUTE, NOT FOUR, AND ONE ROUND TRIP EACH WAY ──
 *
 * The obvious shape is /api/saved, /api/note, /api/comment, /api/progress, each
 * mirroring /api/reaction. It is the wrong shape HERE for one reason: the
 * moment that matters is sign-in, when the device has to reconcile all four
 * stores at once. Four routes make that four round trips before the dashboard
 * is right, and on Zambian mobile data a dashboard that fills in four stages
 * looks broken. So the wire carries a bundle.
 *
 * ── REPLACE-ALL, AND WHY THAT IS SAFE HERE ──
 *
 * POST is authoritative: the rows this user has are made to equal the rows in
 * the body. That is only safe because THE CLIENT MERGES BEFORE IT PUSHES — it
 * pulls the server's copy, unions it into its own (see lib/study-state), and
 * sends the union. So "replace" never means "discard the other device's work";
 * it means "here is the union, which already contains it".
 *
 * It also buys the one thing an upsert-only route cannot do: a DELETE that
 * propagates. Un-saving a section has to remove the row, or the reader's own
 * next sign-in hands it straight back and the control looks broken.
 *
 * The cost is churn — a debounced flush rewrites a student's rows rather than
 * diffing them. At a few dozen rows a student that is the right trade against
 * the plumbing a delta protocol needs. The upgrade path, if a student ever
 * carries thousands of rows: send a per-lesson bundle and scope the delete to
 * the lessons present in the body.
 *
 * ── THE CONTRACT IT SHARES WITH /api/reaction AND /api/profile ──
 *
 * The user id comes from the VERIFIED SESSION, never the body — `currentUserId`
 * calls `getUser()`, which has the token checked by the auth server rather than
 * trusting a cookie's claims. It is the only thing standing between this route
 * and one signed-in student overwriting another's studying.
 *
 * It FAILS SOFT, always. No auth, no service key, a dropped connection, a bad
 * row: 200 with `ok: false` and a reason. Every one of these stores is already
 * written to localStorage by the time this is called, so the student has lost
 * nothing they can see and must never be shown an error about a background
 * sync. The one exception is a signed-out caller, which is a real 401 because
 * the client needs to know not to retry.
 * ------------------------------------------------------------------ */

/** A student with more rows than this is not a student. It is a script, a bug,
 *  or a corrupted store — and the point of the cap is that all three should be
 *  rejected rather than persisted. Generous: 5,000 rows is years of real
 *  reading across every course the app has. */
const MAX_ROWS = 5000;
/** Belt to the row cap's braces: bounds the progress blob, which is the one
 *  part of the bundle that is not row-shaped. A decade of study days is well
 *  under this. */
const MAX_BYTES = 512 * 1024;

/* ------------------------------------------------------------------ *
 * GET — everything this student has, for a device that has just signed in.
 * ------------------------------------------------------------------ */
export async function GET() {
  if (!authEnabled) return Response.json({ ok: false, reason: "no-auth" });

  const userId = await currentUserId();
  if (!userId) return Response.json({ ok: false, reason: "signed-out" }, { status: 401 });

  const sb = admin();
  if (!sb) return Response.json({ ok: false, reason: "no-server" });

  /* In parallel: four reads that do not depend on each other, on a path a
     student is actively waiting on. Sequential awaits here would be four times
     the latency for no benefit. */
  const [saved, notes, comments, progress] = await Promise.all([
    sb.from("saved_sections").select("lesson_id, section_id").eq("user_id", userId),
    sb.from("section_notes").select("lesson_id, section_id, note").eq("user_id", userId),
    sb.from("section_comments").select("lesson_id, section_id, body, updated_at").eq("user_id", userId),
    sb.from("student_progress").select("state").eq("user_id", userId).maybeSingle(),
  ]);

  /* A read that failed answers with an EMPTY store for that slice, never a
     partial one — and the client merges rather than replaces, so an empty
     slice costs nothing but a missed reconcile this time round. Reporting the
     failure would only invite the client to act on it, and there is nothing
     useful it could do. */
  const bundle: StateBundle = {
    saved: {},
    notes: {},
    comments: {},
    progress: (progress.data?.state as StateBundle["progress"]) ?? { ...EMPTY_PROGRESS },
  };

  for (const r of saved.data ?? []) {
    (bundle.saved[r.lesson_id] ??= {})[r.section_id] = true;
  }
  for (const r of notes.data ?? []) {
    (bundle.notes[r.lesson_id] ??= {})[r.section_id] = r.note as never;
  }
  for (const r of comments.data ?? []) {
    (bundle.comments[r.lesson_id] ??= {})[r.section_id] = {
      text: r.body,
      at: r.updated_at ?? "",
    };
  }

  /* Validated on the way out as well as on the way in. The progress blob is
     jsonb — whatever was written is what comes back — and the client's merge
     assumes the shape. */
  return Response.json({ ok: true, ...cleanBundle(bundle) });
}

/* ------------------------------------------------------------------ *
 * POST — the merged union, on its way up.
 * ------------------------------------------------------------------ */
export async function POST(req: Request) {
  if (!authEnabled) return Response.json({ ok: false, reason: "no-auth" });

  const userId = await currentUserId();
  if (!userId) return Response.json({ ok: false, reason: "signed-out" }, { status: 401 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, reason: "bad-json" }, { status: 400 });
  }

  const bundle = cleanBundle(raw);

  if (bundleSize(bundle) > MAX_ROWS) {
    return Response.json({ ok: false, reason: "too-many-rows" }, { status: 413 });
  }
  if (JSON.stringify(bundle.progress).length > MAX_BYTES) {
    return Response.json({ ok: false, reason: "too-big" }, { status: 413 });
  }

  const sb = admin();
  if (!sb) return Response.json({ ok: false, reason: "no-server" });

  const now = new Date().toISOString();

  /* Flattened out of the nested store shape. Done before any write so a
     malformed body cannot leave half the tables cleared. */
  const savedRows = Object.entries(bundle.saved).flatMap(([lesson_id, row]) =>
    Object.keys(row).map((section_id) => ({ user_id: userId, lesson_id, section_id })),
  );
  const noteRows = Object.entries(bundle.notes).flatMap(([lesson_id, row]) =>
    Object.entries(row).map(([section_id, note]) => ({
      user_id: userId,
      lesson_id,
      section_id,
      note,
      updated_at: now,
    })),
  );
  const commentRows = Object.entries(bundle.comments).flatMap(([lesson_id, row]) =>
    Object.entries(row).map(([section_id, c]) => ({
      user_id: userId,
      lesson_id,
      section_id,
      body: c.text,
      updated_at: c.at || now,
    })),
  );

  /* ------------------------------------------------------------------ *
   * Delete-then-insert, per table, sequenced so a table is never left empty by
   * a failed insert that follows a successful delete... which it can still be,
   * if the insert fails. That is survivable HERE and nowhere else: the device
   * holds the same data in localStorage and re-pushes the union on the next
   * flush, so the worst case is one sync's worth of server-side gap, not lost
   * work. It is also why the client keeps pushing rather than treating one
   * successful POST as final.
   *
   * NOT one clever statement. A data-modifying CTE's rows are invisible to a
   * sibling CTE reading the same table, which is exactly how a migration in
   * this project silently linked three of six rows and reported success.
   * ------------------------------------------------------------------ */
  const results = await Promise.all([
    replaceAll(sb, "saved_sections", userId, savedRows),
    replaceAll(sb, "section_notes", userId, noteRows),
    replaceAll(sb, "section_comments", userId, commentRows),
    sb.from("student_progress").upsert(
      {
        user_id: userId,
        state: bundle.progress,
        /* The DEVICE's clock, for merge ordering only. `updated_at` is the
           server's and is the one to trust when auditing — see the column
           comment. */
        client_at: Date.now(),
        updated_at: now,
      },
      { onConflict: "user_id" },
    ),
  ]);

  const failed = results.filter((r) => r.error).length;
  /* 200 either way, with the count. The client logs nothing and retries on its
     next flush; the field is here so a failure is visible in the network tab
     rather than indistinguishable from success. */
  return Response.json({ ok: failed === 0, failed });
}

/** Make this user's rows in one table equal the rows given. Returns the first
 *  error of the two statements, or none. */
async function replaceAll(
  sb: NonNullable<ReturnType<typeof admin>>,
  table: "saved_sections" | "section_notes" | "section_comments",
  userId: string,
  rows: Record<string, unknown>[],
) {
  const del = await sb.from(table).delete().eq("user_id", userId);
  if (del.error) return del;
  if (!rows.length) return del;
  return await sb.from(table).insert(rows);
}
