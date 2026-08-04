// Regenerates src/lib/programme-index.json — every university's programmes, and
// each programme's courses by year.
//   npm run gen:programmes
//
// THE POINT OF IT (owner, 2026-08-04): onboarding should be predictive, not a
// questionnaire. "The moment they say I'm at ZCAS doing accounting and finance
// in year four, I'll display the year four courses, and below that the other
// years' courses." Which means the app has to already know the curriculum, and
// this is where that knowledge is baked in.
//
// SERVICE ROLE, NOT ANON, and this is the only generator that needs it. The
// pipeline_* tables are internal: RLS on with no policies, service-role only,
// because they carry course codes and faculty names that must never reach a
// student. Reading them at BUILD with the service key keeps that intact — the
// key never leaves this machine, and what ships is the JSON below.
//
// WHAT IS DELIBERATELY NOT IN THE OUTPUT: course codes (BAC4301), the awarding
// body, and the faculty names. The view this reads (onboarding_curriculum)
// does not select them, so they cannot leak into the file by accident.
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "programme-index.json");

async function generate() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  const sb = createClient(url, key, { auth: { persistSession: false } });

  /* .range() because PostgREST caps a select at 1000 rows by default and the
     join table is 979 — close enough that a quiet truncation would look like a
     scraping gap rather than a paging bug. */
  const res = await sb.from("onboarding_curriculum").select("*").range(0, 9999);
  if (res.error) throw res.error;
  if (!res.data.length) throw new Error("onboarding_curriculum returned nothing");

  /* Dissertations, industrial attachment and progress reports are on a
     student's timetable but are not something anyone reads notes for, so they
     are not offered as courses to pick. The owner's "show them literally all
     the courses" is about not hiding the ones we HAVEN'T BUILT — a milestone we
     will never build is a different thing, and a tick against it is a demand
     signal we could not act on. 8 rows across the whole set. */
  const rows = res.data.filter((r) => r.course_kind !== "project");

  const byUni = {};
  for (const r of rows) {
    const uni = (byUni[r.university_id] ??= {});
    const prog = (uni[r.programme_slug] ??= {
      slug: r.programme_slug,
      name: r.programme_name,
      level: r.programme_level ?? null,
      courses: [],
    });
    prog.courses.push({
      slug: r.course_slug,
      title: r.course_title,
      year: r.year ?? null,
      // Which half of the year it is taught in. Shown under the title so a
      // student scanning their own year can tell what is on now from what is
      // coming after Christmas.
      semester: r.semester ?? null,
      // The built course this maps to, where one exists. Absent is the normal
      // case. Nothing in the UI marks it any more — see CurriculumPicker — but
      // it is what turns a pick into an enrolment the dashboard can render.
      ...(r.live_slug ? { live: r.live_slug } : {}),
    });
  }

  const out = {};
  for (const [uni, progs] of Object.entries(byUni)) {
    out[uni] = Object.values(progs)
      .map((p) => {
        // One row per course per programme: the same course can appear in two
        // semesters of a year, and a student should see it once.
        const seen = new Set();
        const courses = p.courses
          .filter((c) => !seen.has(c.slug) && seen.add(c.slug))
          .sort((a, b) => (a.year ?? 99) - (b.year ?? 99) || a.title.localeCompare(b.title));
        return { ...p, courses, years: [...new Set(courses.map((c) => c.year).filter(Boolean))].sort() };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /* NO COURSE CODES, CHECKED RATHER THAN ASSUMED.
     Excluding the code COLUMN is not enough: ZCAS types its own tables by hand
     and one row arrived with the code inside the title cell — "Doctoral Thesis
     (Word Limit: 65,000 words) DBA330 – Defense" — which would have shipped a
     course code to every student on the strength of a view that carefully did
     not select `code`. The standing rule is that codes never reach a student,
     so this fails the build rather than warning: a warning in a generator
     nobody watches is how it gets through a second time. Fix the row in
     Supabase, don't loosen the pattern. */
  const leaked = [];
  for (const progs of Object.values(out))
    for (const p of progs) {
      if (/[A-Z]{2,4}[ -]?\d{3,4}/.test(p.name)) leaked.push(`programme: ${p.name}`);
      for (const c of p.courses)
        if (/[A-Z]{2,4}[ -]?\d{3,4}/.test(c.title)) leaked.push(`course: ${c.title} (${p.name})`);
    }
  if (leaked.length) {
    throw new Error(
      `gen-programmes: course code(s) in titles — these must never reach a student:\n  ${leaked.join("\n  ")}`,
    );
  }

  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");

  const progs = Object.values(out).flat();
  const live = new Set(progs.flatMap((p) => p.courses.filter((c) => c.live).map((c) => c.live)));
  console.log(
    `gen-programmes: wrote programme-index.json — ${Object.keys(out).length} universit(ies), ` +
      `${progs.length} programmes, ${progs.reduce((n, p) => n + p.courses.length, 0)} course rows, ` +
      `${live.size} of them built. ${(JSON.stringify(out).length / 1024).toFixed(0)}KB.`,
  );
  const empty = progs.filter((p) => !p.courses.length).length;
  if (empty) console.log(`gen-programmes: ${empty} programme(s) publish no curriculum and will not be offered.`);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
