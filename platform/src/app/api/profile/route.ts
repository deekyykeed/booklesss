import { auth } from "@clerk/nextjs/server";
import { clerkEnabled } from "@/lib/clerk";
import { admin } from "@/lib/supabase-admin";
import { cleanTitle, isCourseTitle, MAX_TYPED_COURSES, normTitle } from "@/lib/curriculum-text";
/* The curriculum, read SERVER-SIDE. It is 131KB and lib/programmes exists to
   keep it out of pages that don't need it — a route handler is the one place
   that cost is zero, because nothing here is sent to a browser. */
import PROGRAMMES from "@/lib/programme-index.json";

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

/** The windows lib/identity offers. A string outside this set is a client that
 *  is not ours, so it is stored as null rather than as a value nothing can
 *  group by. */
const STUDY_WINDOWS = new Set(["early-morning", "morning", "afternoon", "evening", "night"]);

const HEARD_FROM = new Set(["friend", "whatsapp-group", "tiktok", "facebook", "flyer", "search", "other"]);

/**
 * The normal number of courses in one year of a degree.
 *
 * Owner's figure (2026-08-04): "the usual 4/semester". Two semesters, so eight.
 * Used ONLY where the programme is one we don't carry a curriculum for — where
 * we do, the real count is read off the timetable below, because a programme
 * that genuinely runs ten courses a year would otherwise mark its entire
 * cohort as retaking.
 */
const USUAL_COURSES_PER_YEAR = 8;

/** The owner's figure as stated — "the usual 4/semester" — for a student who
 *  told us which half of the year they are in. */
const USUAL_COURSES_PER_SEMESTER = 4;

/**
 * Whether this student's course load looks like a retake.
 *
 * INFERRED, NEVER ASKED (owner, 2026-08-04: "id know about a retake as well
 * because it will be off — an extra course or less courses than the usual
 * 4/semester. Set that up as well for identifying people who are retaking").
 * A student carrying a failed course sits one more than their year runs; one
 * who has dropped to a reduced load sits fewer. Both are visible in a number
 * they have already given us, so neither is worth a question — and a question
 * about failing is one plenty of students would answer dishonestly anyway.
 *
 * A SIGNAL, NOT A VERDICT, and the column name says so. "heavy" is most often a
 * retake and is sometimes an ambitious student taking an elective; "light" is
 * sometimes a retake, sometimes part-time, and sometimes somebody who could not
 * be bothered ticking the last two boxes. It is worth exactly what a lead is
 * worth: a shortlist of people to look at, not a label to show anyone.
 *
 * Null where there is nothing to compare against — no year, or no courses
 * picked yet. An unfinished record must not read as a light load.
 */
function courseLoad(expected: number | null, picked: number): "light" | "normal" | "heavy" | null {
  if (!expected || !picked) return null;
  if (picked > expected) return "heavy";
  if (picked < expected) return "light";
  return "normal";
}

/**
 * A Zambian mobile as +260XXXXXXXXX, or null.
 *
 * Deliberately a SECOND copy of lib/identity's normalisePhone rather than an
 * import: that module is "use client" and pulls the avatar set in with it, and
 * a route handler has no business loading either. Nine lines duplicated is the
 * cheaper half of that trade — and the rule it encodes (9 digits, starting 7 or
 * 9) is a fact about Zambian networks, not a preference that will drift.
 */
function phone(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const d = v.replace(/[^\d+]/g, "").replace(/^\+/, "");
  const local = d.startsWith("260") ? d.slice(3) : d.startsWith("0") ? d.slice(1) : d;
  return /^[79]\d{8}$/.test(local) ? `+260${local}` : null;
}

/** A referral code as lib/referral writes them — slug characters, short. This
 *  arrives from a browser like everything else on this request. */
function code(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const c = v.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 32);
  return c.length >= 2 ? c : null;
}

type IndexedProgramme = { slug: string; courses: { year: number | null; semester: number | null }[] };

/**
 * How many courses this student's year normally runs.
 *
 * The programme's OWN timetable where we hold it, and the 4-a-semester
 * convention where we do not. Preferring the real count matters: a degree that
 * genuinely runs ten courses a year would otherwise have its whole cohort
 * marked as carrying two extra.
 */
function expectedCourses(
  university: string | null,
  programme: string | null,
  year: number | null,
  semester: number | null,
): number | null {
  if (!year) return null;
  const list = (PROGRAMMES as Record<string, IndexedProgramme[]>)[university ?? ""];
  const courses = list?.find((p) => p.slug === programme)?.courses ?? [];
  /* Judged against the same span the student was asked to confirm. Comparing a
     semester's four picks against a year's eight would mark every student on
     earth as carrying a reduced load — which is the bug this argument exists to
     prevent, and the reason the two conventions below are separate numbers. */
  const n = courses.filter((c) => c.year === year && (!semester || c.semester === semester)).length;
  return n || (semester ? USUAL_COURSES_PER_SEMESTER : USUAL_COURSES_PER_YEAR);
}

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

  /* What they are actually sitting: the ticked timetable where there is one,
     and what they typed where their programme is not on file. The two are never
     both populated — see the onboarding flow — so a sum would be wrong and a max
     is only defensive. */
  const curriculum = slugs(body.curriculum);
  const typedCount = Array.isArray(body.typedCourses)
    ? body.typedCourses.filter((t) => typeof t === "string" && isCourseTitle(t)).length
    : 0;
  const picked = Math.max(curriculum.length, typedCount);
  const semester = body.semester === 1 || body.semester === 2 ? body.semester : null;
  const expected = expectedCourses(known, str(body.programme, 120), year, semester);

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
    semester,
    curriculum,
    courses: slugs(body.courses),
    target_days: typeof target?.days === "number" ? target.days : null,
    target_minutes: typeof target?.minutes === "number" ? target.minutes : null,
    target_weekdays: Array.isArray(target?.weekdays)
      ? target.weekdays.filter((d): d is number => typeof d === "number" && d >= 0 && d <= 6)
      : null,
    study_window: STUDY_WINDOWS.has(String(body.studyWindow)) ? String(body.studyWindow) : null,
    heard_from: HEARD_FROM.has(String(body.heardFrom)) ? String(body.heardFrom) : null,
    /* Who brought them, and their own code so the other side of that count has
       something to join on. Sanitised to the same slug shape lib/referral
       enforces on the way in — this arrives from a browser. */
    referred_by: code(body.referredBy),
    referral_code: code(body.referralCode),
    /* The retake signal and the number it was read against, stored together.
       Keeping `expected_courses` beside the verdict is what makes the column
       auditable: "heavy" on its own is an assertion, "heavy, against 8" can be
       checked — and when a programme's real timetable lands later, the rows
       decided against the 8-course convention are the ones to recompute. */
    expected_courses: expected,
    course_load: courseLoad(expected, picked),
    /* Re-validated here rather than trusted from the client, like everything
       else on this row: the browser normalises it for display, the server
       normalises it for storage, and only one of those two is ours. A number
       that does not parse is stored as null rather than as typed — a column of
       unusable strings is worse than a column of gaps, because gaps can be
       counted. */
    whatsapp: phone(body.whatsapp),
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
