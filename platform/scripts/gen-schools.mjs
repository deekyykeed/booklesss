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
    .select("id, name, full_name, aka, course_slugs, tone, position, active")
    .eq("active", true)
    .order("position");
  if (res.error) throw res.error;
  if (!res.data.length) throw new Error("no universities in the database");

  /* Written in the app's own shape rather than the table's, so lib/schools.ts
     keeps the type it always had and nothing downstream knows this moved.
     Empty `aka` is dropped rather than written as [] — the field is optional in
     the type, and a file full of empty arrays is a file that reads as broken. */
  const schools = res.data.map((r) => ({
    id: r.id,
    name: r.name,
    full: r.full_name,
    ...(r.aka?.length ? { aka: r.aka } : {}),
    courseSlugs: r.course_slugs ?? [],
    tone: r.tone,
  }));

  writeFileSync(OUT, JSON.stringify(schools, null, 2) + "\n");

  const withCourses = schools.filter((s) => s.courseSlugs.length);
  console.log(
    `gen-schools: wrote school-index.json — ${schools.length} universities, ` +
      `${withCourses.length} with courses (${withCourses.map((s) => s.name).join(", ")}). ` +
      `The other ${schools.length - withCourses.length} are offered the whole library.`,
  );
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
