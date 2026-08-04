import { auth } from "@clerk/nextjs/server";
import { clerkEnabled } from "@/lib/clerk";
import { admin } from "@/lib/supabase-admin";
import { cleanTitle, isCourseTitle, MAX_TYPED_COURSES, normTitle } from "@/lib/curriculum-text";

/* ------------------------------------------------------------------ *
 * The student's academic record, written where it can be asked a question.
 *
 * Clerk already carries these answers in unsafeMetadata, and that copy is what
 * makes a second device resume instantly with no network call. This is the
 * other copy, and it exists because Clerk's is unqueryable in aggregate: you
 * cannot ask a per-user metadata blob "what are CBU students being taught",
 * and with seven of ten universities publishing no curriculum, that question is
 * how the curriculum gets built at all.
 *
 * FAILS SOFT, ALWAYS. A student mid-sign-up is never blocked by this: no Clerk,
 * no Supabase, a bad row, a dropped connection — all of it answers 200 and the
 * flow carries on against the device's own copy. Losing one student's answers
 * is recoverable; losing the student is not.
 * ------------------------------------------------------------------ */

const MAX_SLUGS = 60;

function str(v: unknown, max: number): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;
}

function slugs(v: unknown): string[] {
  return Array.isArray(v)
    ? [...new Set(v.filter((s): s is string => typeof s === "string" && !!s))].slice(0, MAX_SLUGS)
    : [];
}

export async function POST(req: Request) {
  if (!clerkEnabled) return Response.json({ ok: false, reason: "no-auth" });
  const sb = admin();
  if (!sb) return Response.json({ ok: false, reason: "no-db" });

  const { userId } = await auth();
  /* The id comes from the SESSION, never from the body. It is the only thing
     standing between this route and one signed-in student overwriting
     another's timetable. */
  if (!userId) return Response.json({ ok: false, reason: "signed-out" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, reason: "bad-json" }, { status: 400 });
  }

  const school = str(body.school, 40);
  const year = typeof body.year === "number" && body.year >= 1 && body.year <= 7 ? body.year : null;
  const target = (body.target ?? null) as { days?: unknown; minutes?: unknown; weekdays?: unknown } | null;

  /* "other" is a marker, not a university id, and the column is a foreign key
     to universities — so it goes in the free-text half of the pair, the same
     way an unlisted programme does. */
  const known = school && school !== "other" ? school : null;

  const row = {
    id: userId,
    device_id: str(body.deviceId, 64),
    name: str(body.name, 40),
    avatar_id: str(body.avatarId, 60),
    university_id: known,
    university_other: known ? null : str(body.schoolName, 80),
    programme_slug: str(body.programme, 120) === "other" ? null : str(body.programme, 120),
    programme_other: str(body.programmeName, 160),
    year,
    curriculum: slugs(body.curriculum),
    courses: slugs(body.courses),
    target_days: typeof target?.days === "number" ? target.days : null,
    target_minutes: typeof target?.minutes === "number" ? target.minutes : null,
    target_weekdays: Array.isArray(target?.weekdays)
      ? target.weekdays.filter((d): d is number => typeof d === "number" && d >= 0 && d <= 6)
      : null,
    updated_at: new Date().toISOString(),
  };

  const up = await sb.from("students").upsert(row, { onConflict: "id" });
  if (up.error) {
    console.error("profile: students upsert", up.error.message);
    return Response.json({ ok: false, reason: "write-failed" });
  }

  /* The typed course list is REPLACED, not merged. It is the answer to one
     question — "what are you taking?" — and a student who removes a course
     they dropped means it to be gone, not to sit in the reported curriculum
     forever being counted as evidence. */
  const typed = Array.isArray(body.typedCourses) ? body.typedCourses : [];
  const seen = new Set<string>();
  const rows = typed
    .filter((t): t is string => typeof t === "string")
    .map(cleanTitle)
    .filter(isCourseTitle)
    .map((title) => ({ student_id: userId, title, norm: normTitle(title), year }))
    .filter((r) => !seen.has(r.norm) && seen.add(r.norm))
    .slice(0, MAX_TYPED_COURSES);

  await sb.from("student_courses").delete().eq("student_id", userId);
  if (rows.length) {
    const ins = await sb.from("student_courses").insert(rows);
    if (ins.error) console.error("profile: student_courses insert", ins.error.message);
  }

  return Response.json({ ok: true, courses: rows.length });
}
