// Regenerates src/lib/course-data.json from Supabase — the source of truth for
// course content. Run locally after editing content in Supabase:
//   npm run gen:course
// The reader consumes the committed JSON, so the site stays fully static (no
// Supabase at runtime); this step is the only thing that touches the DB.
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "course-data.json");
const COURSE_SLUG = "economics";

async function generate() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const course = await sb.from("courses").select("id").eq("slug", COURSE_SLUG).single();
  if (course.error) throw course.error;
  const courseId = course.data.id;

  const nodesRes = await sb
    .from("nav_nodes")
    .select("id, parent_id, slug, label, position, default_open")
    .eq("course_id", courseId);
  if (nodesRes.error) throw nodesRes.error;

  const lessonsRes = await sb
    .from("lessons")
    .select("node_id, title, kicker, sections")
    .eq("course_id", courseId);
  if (lessonsRes.error) throw lessonsRes.error;

  const lessonByNode = new Map(lessonsRes.data.map((l) => [l.node_id, l]));
  const childrenOf = new Map();
  for (const n of nodesRes.data) {
    const k = n.parent_id ?? "__root__";
    if (!childrenOf.has(k)) childrenOf.set(k, []);
    childrenOf.get(k).push(n);
  }
  for (const arr of childrenOf.values()) arr.sort((a, b) => a.position - b.position);

  // Rebuild the exact NavNode[] shape the reader expects.
  function build(parentKey) {
    return (childrenOf.get(parentKey) ?? []).map((n) => {
      const node = { id: n.slug, label: n.label };
      if (n.default_open) node.defaultOpen = true;
      const lesson = lessonByNode.get(n.id);
      if (lesson) {
        node.lesson = {
          title: lesson.title,
          ...(lesson.kicker ? { kicker: lesson.kicker } : {}),
          sections: lesson.sections,
        };
      }
      const children = build(n.id);
      if (children.length) node.children = children;
      return node;
    });
  }

  const tree = build("__root__");
  const carried = carryOverChecks(tree);
  writeFileSync(OUT, JSON.stringify(tree, null, 2) + "\n");
  console.log(
    `gen-course: wrote course-data.json — ${nodesRes.data.length} nodes, ${lessonsRes.data.length} lessons` +
      (carried ? `, ${carried} comprehension check(s) carried over from the previous snapshot` : ""),
  );
}

/* Section comprehension checks (`section.check`) drive the checkpoints — a
 * reader ticks a checkpoint by answering one, so losing them silently would
 * turn every checkpoint back into a self-marked "done".
 *
 * They live in the `sections` JSONB, so once they're authored in Supabase they
 * come through here on their own and this is a no-op. Until then they exist
 * only in the committed snapshot, and a regenerate would wipe them — so any
 * check missing from the incoming data is carried across from the previous
 * file. Supabase always wins where it has one; this only fills gaps, and says
 * how many it filled rather than doing it quietly.
 *
 * Deleting a check therefore means deleting it in Supabase AND in the JSON. */
function carryOverChecks(tree) {
  if (!existsSync(OUT)) return 0;

  let previous;
  try {
    previous = JSON.parse(readFileSync(OUT, "utf8"));
  } catch {
    return 0; // unreadable snapshot — nothing to carry, and not worth failing over
  }

  const byKey = new Map();
  const index = (nodes) => {
    for (const n of nodes ?? []) {
      for (const s of n.lesson?.sections ?? []) {
        if (s.check) byKey.set(`${n.id}/${s.id}`, s.check);
      }
      index(n.children);
    }
  };
  index(previous);
  if (!byKey.size) return 0;

  let carried = 0;
  const apply = (nodes) => {
    for (const n of nodes ?? []) {
      for (const s of n.lesson?.sections ?? []) {
        if (!s.check) {
          const prev = byKey.get(`${n.id}/${s.id}`);
          if (prev) {
            s.check = prev;
            carried++;
          }
        }
      }
      apply(n.children);
    }
  };
  apply(tree);
  return carried;
}

generate().catch((err) => {
  // Build-safe: if Supabase can't be reached (no env, network, etc.) keep the
  // committed snapshot so a deploy never fails over content generation. Only
  // hard-fail when there is nothing to fall back to.
  if (existsSync(OUT)) {
    console.warn(`gen-course: ${err.message} — keeping the existing course-data.json snapshot`);
    process.exit(0);
  }
  console.error(`gen-course: ${err.message} — and no snapshot to fall back to`);
  process.exit(1);
});
