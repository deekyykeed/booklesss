// Regenerates src/lib/school-index.json from Supabase — the source of truth for
// the universities a student picks at sign-up. Run locally after editing the
// list in Supabase:
//   npm run gen:schools
//
// SAME PATTERN AS gen-course.mjs, AND FOR THE SAME REASON. The owner's call
// (2026-08-04) was that the onboarding options come off Supabase rather than a
// hardcoded array — but "off Supabase" does not have to mean a network call in
// front of a student on a Zambian connection. This reads the table at BUILD and
// commits the answer, so the picker is still instant, still works offline, and
// still ships no Supabase client to the browser. Editing the list is now a row
// in a table instead of a pull request.
//
// The table is `universities`, NOT `schools`: pipeline_schools already exists
// and holds ZCAS's four faculties.
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "school-index.json");

async function generate() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const res = await sb
    .from("universities")
    .select(
      "id, name, full_name, aka, course_slugs, tone, position, active, " +
        "calendar_label, term_starts, term_ends, exams_start, exams_end",
    )
    .eq("active", true)
    .order("position");
  if (res.error) throw res.error;
  if (!res.data.length) throw new Error("no universities in the database");

  /* Written in the app's own shape rather than the table's, so lib/schools.ts
     keeps the type it always had and nothing downstream knows this moved.
     Empty `aka` is dropped rather than written as [] — the field is optional in
     the type, and a file full of empty arrays is a file that reads as broken. */
  /* THE CALENDAR RIDES ALONG, and it is omitted rather than written as nulls.
     Nine of the ten campuses have no dates on file, and a file full of
     "examsStart": null reads as a broken generator rather than as an honest
     gap — the same call `aka` already makes below. Anything reading `calendar`
     treats its absence as "we don't know when their exams are" and draws no
     countdown, which is the only safe reading: a wrong deadline is worse than
     no deadline. */
  const schools = res.data.map((r) => {
    const cal = {
      ...(r.calendar_label ? { label: r.calendar_label } : {}),
      ...(r.term_starts ? { termStarts: r.term_starts } : {}),
      ...(r.term_ends ? { termEnds: r.term_ends } : {}),
      ...(r.exams_start ? { examsStart: r.exams_start } : {}),
      ...(r.exams_end ? { examsEnd: r.exams_end } : {}),
    };
    return {
      id: r.id,
      name: r.name,
      full: r.full_name,
      ...(r.aka?.length ? { aka: r.aka } : {}),
      courseSlugs: r.course_slugs ?? [],
      tone: r.tone,
      ...(Object.keys(cal).length ? { calendar: cal } : {}),
    };
  });

  writeFileSync(OUT, JSON.stringify(schools, null, 2) + "\n");

  const withCourses = schools.filter((s) => s.courseSlugs.length);
  const withExams = schools.filter((s) => s.calendar?.examsStart);
  console.log(
    `gen-schools: wrote school-index.json — ${schools.length} universities, ` +
      `${withCourses.length} with courses (${withCourses.map((s) => s.name).join(", ")}). ` +
      `The other ${schools.length - withCourses.length} are offered the whole library.`,
  );
  /* Said out loud every run, because a missing exam date is invisible in the
     app by design — the countdown simply does not draw — and a silence that
     looks identical to "no exams this term" is one worth reporting. */
  console.log(
    withExams.length
      ? `gen-schools: exam dates on file for ${withExams.length} — ` +
          withExams.map((s) => `${s.name} (${s.calendar.examsStart})`).join(", ")
      : "gen-schools: NO exam dates on file for any campus — no countdowns will draw.",
  );
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
