// Regenerates src/lib/course-data.json from Supabase — the source of truth for
// course content. Run locally after editing content in Supabase:
//   npm run gen:course
// The reader consumes the committed JSON, so the site stays fully static (no
// Supabase at runtime); this step is the only thing that touches the DB.
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const COURSE_SLUG = "economics";

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
const out = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "course-data.json");
writeFileSync(out, JSON.stringify(tree, null, 2) + "\n");
console.log(`Wrote course-data.json — ${nodesRes.data.length} nodes, ${lessonsRes.data.length} lessons`);
