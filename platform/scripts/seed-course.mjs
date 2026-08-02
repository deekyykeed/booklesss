/* Publishes a locally-authored course into Supabase — the other half of
 * gen-course.mjs.
 *
 *   gen-course.mjs   Supabase ──► src/lib/course-data.json   (what the app reads)
 *   seed-course.mjs  local files ──► Supabase                (what authors edit)
 *
 * Course content is authored as plain .mjs beside the lesson it belongs to (see
 * Schools/ZCAS/Corporate Finance/reader/course.mjs) rather than by hand-editing
 * JSONB in the Supabase dashboard. Supabase stays the source of truth the app
 * generates from; these files are the source of truth authors edit.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-course.mjs <path-to-course.mjs>
 *   node --env-file=.env.local scripts/seed-course.mjs <path> --dry-run
 *
 * The course's nav tree is replaced wholesale on every run: its nav_nodes are
 * deleted (lessons cascade) and rewritten from the file. Other courses are
 * never touched.
 */
import { createClient } from "@supabase/supabase-js";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const SLUG_RE = /^[a-z0-9-]{1,80}$/;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const target = args.find((a) => !a.startsWith("--"));
if (!target) {
  console.error("usage: seed-course.mjs <path-to-course.mjs> [--dry-run]");
  process.exit(1);
}

const manifest = (await import(pathToFileURL(resolve(target)).href)).default;

/* ---- validate before touching anything ------------------------------ *
 * A bad tree written half-way leaves the course broken in production, so
 * everything that can be checked offline is checked first. */

const problems = []; // block the write
const warnings = []; // reported, never block
const seen = new Map(); // slug -> where it was found

/* The inline marks a step's prose can carry (RULES.md W-8, E-8, C-7):
 *   **bold**  [[term|definition]]  [label](url)
 * They do NOT nest, and the renderer's parser walks the string once, so a link
 * written inside bold is simply not seen: the words render, the source silently
 * never appears in the section's strip. That failed twice before this check
 * existed, both times found by grepping built HTML rather than by anything
 * saying so. An em dash is checked here too (W-11) for the same reason: it is
 * invisible in review and countable in a script. */
const EM_DASH = "—";

/* Every string a block can carry, wherever it lives on the block. A block type
 * whose prose is not reachable from here is invisible to the mark and em-dash
 * checks below — it looks clean because nothing looked at it. `cards` was
 * exactly that on the day it was added, so this is now the one place that
 * knows where text hides. */
function blockTexts(b) {
  const texts = [];
  if (typeof b?.text === "string") texts.push(b.text);
  if (Array.isArray(b?.items)) texts.push(...b.items.filter((i) => typeof i === "string"));
  for (const c of b?.cards ?? []) {
    for (const v of [c?.title, c?.lead, c?.text]) if (typeof v === "string") texts.push(v);
  }
  return texts;
}

/* The glyph names reader/card-glyphs.tsx actually draws. A `cards` block names
 * its mark as a string, so a typo renders no icon and says nothing — caught
 * here instead, where it blocks the write. Keep in step with CARD_GLYPHS. */
const CARD_GLYPHS = ["chess", "calendar", "checklist"];

/* The callout kinds the reader can draw. Same reason as CARD_GLYPHS above: the
 * kind is a bare string in the .mjs, so a typo would quietly fall back to the
 * default and label a warning "Key point". Keep in step with CALLOUT_KINDS in
 * src/lib/course.ts. */
const CALLOUT_KINDS = ["key", "warning", "example", "exam"];

function markProblems(blocks) {
  const out = [];
  const texts = [];
  for (const b of blocks) {
    texts.push(...blockTexts(b));
    if (b?.type === "callout" && b.kind !== undefined && !CALLOUT_KINDS.includes(b.kind))
      out.push(`a callout names an unknown kind "${b.kind}" (have: ${CALLOUT_KINDS.join(", ")})`);
    for (const c of b?.cards ?? []) {
      if (!CARD_GLYPHS.includes(c?.icon))
        out.push(`a card names an unknown icon "${c?.icon}" (have: ${CARD_GLYPHS.join(", ")})`);
      if (typeof c?.title !== "string" || !c.title.trim())
        out.push("a card has no title");
    }
    // Table cells are plain text in the reader, so a mark in one shows as syntax.
    for (const row of b?.rows ?? []) for (const cell of row ?? []) {
      if (typeof cell === "string" && /\*\*|\]\(https?:|\[\[/.test(cell))
        out.push(`a table cell carries an inline mark, which renders as raw text: "${cell.slice(0, 50)}"`);
    }
  }
  for (const t of texts) {
    const bolds = t.match(/\*\*(.+?)\*\*/g) ?? [];
    for (const b of bolds)
      if (/\]\(https?:/.test(b) || /\[\[/.test(b))
        out.push(`a link or term sits inside bold and will not render: "${b.slice(0, 60)}"`);
    const terms = t.match(/\[\[([^\]|]+)\|([^\]]+)\]\]/g) ?? [];
    for (const d of terms)
      if (/\]\(https?:/.test(d)) out.push(`a link sits inside a term definition: "${d.slice(0, 60)}"`);
  }
  return out;
}

/* W-11, reported but not enforced. Every step written before 2026-08-01 is full
 * of em dashes and that is tracked as debt (DEBT.md D-3), paid on contact
 * rather than in one sweep. Blocking the seed on it would mean no course could
 * be published until all 44 steps were rewritten. */
function emDashWarnings(blocks) {
  const out = [];
  for (const b of blocks) {
    const texts = blockTexts(b);
    for (const row of b?.rows ?? []) for (const cell of row ?? []) if (typeof cell === "string") texts.push(cell);
    for (const t of texts) if (t.includes(EM_DASH)) out.push(`em dash: "${t.slice(0, 55)}…"`);
  }
  return out;
}

/** Depth-first walk yielding { node, parentSlug, position }. Parents come
 *  before their children, which is also the order they must be inserted in. */
function* walk(nodes, parentSlug = null) {
  for (const [i, node] of nodes.entries()) {
    yield { node, parentSlug, position: i };
    if (node.children?.length) yield* walk(node.children, node.slug);
  }
}

const flat = [...walk(manifest.tree ?? [])];

if (!SLUG_RE.test(manifest.slug ?? "")) problems.push(`course slug "${manifest.slug}" is not a valid slug`);
if (!flat.length) problems.push("the manifest has an empty tree");

for (const { node } of flat) {
  const where = node.title ? `step "${node.title}"` : `node "${node.label}"`;
  if (!SLUG_RE.test(node.slug ?? "")) problems.push(`${where}: invalid slug "${node.slug}"`);
  if (!node.label) problems.push(`${where}: missing label`);
  if (seen.has(node.slug)) problems.push(`duplicate slug "${node.slug}" (${where} and ${seen.get(node.slug)})`);
  else seen.set(node.slug, where);

  if (node.sections) {
    if (!node.title) problems.push(`${where}: a step needs a title`);
    const ids = new Set();
    node.sections.forEach((s, i) => {
      if (!s.id) problems.push(`${node.slug}: section ${i + 1} has no id`);
      else if (ids.has(s.id)) problems.push(`${node.slug}: duplicate section id "${s.id}"`);
      else ids.add(s.id);
      if (!s.heading) problems.push(`${node.slug}/${s.id}: no heading`);
      if (!s.blocks?.length) problems.push(`${node.slug}/${s.id}: no blocks`);
      for (const p of markProblems(s.blocks ?? [])) problems.push(`${node.slug}/${s.id}: ${p}`);
      for (const w of emDashWarnings(s.blocks ?? [])) warnings.push(`${node.slug}/${s.id}: ${w}`);
      // A check that points at a missing option would silently mark every
      // answer wrong, so the reader could never clear the checkpoint.
      if (s.check) {
        const n = s.check.options?.length ?? 0;
        if (n < 2) problems.push(`${node.slug}/${s.id}: a check needs at least two options`);
        if (!Number.isInteger(s.check.answer) || s.check.answer < 0 || s.check.answer >= n)
          problems.push(`${node.slug}/${s.id}: check answer ${s.check.answer} is out of range`);
        if (!s.check.explain) problems.push(`${node.slug}/${s.id}: check has no explanation`);
      }
    });
  }
}

if (problems.length) {
  console.error(`seed-course: ${problems.length} problem(s) — nothing was written\n`);
  for (const p of problems) console.error("  • " + p);
  process.exit(1);
}

/* Reported every run, never blocking: this is the shape of the outstanding
 * house-style debt, and watching the count shrink is how progress on it shows.
 * Blocking here would mean no course could be published until all 44 steps had
 * been rewritten, which is the opposite of paying debt on contact. */
if (warnings.length) {
  console.warn(`seed-course: ${warnings.length} house-style warning(s), not blocking (DEBT.md D-3):`);
  for (const w of warnings.slice(0, 6)) console.warn("  · " + w);
  if (warnings.length > 6) console.warn(`  · …and ${warnings.length - 6} more`);
  console.warn("");
}

const steps = flat.filter((f) => f.node.sections).length;
const withChecks = flat.filter((f) => f.node.sections?.every((s) => s.check)).length;
console.log(
  `seed-course: ${manifest.slug} — ${flat.length} nodes, ${steps} steps ` +
    `(${withChecks} with a check on every section)`,
);

if (dryRun) {
  console.log("seed-course: --dry-run, stopping before any write");
  process.exit(0);
}

/* ---- write ---------------------------------------------------------- */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE key");
const sb = createClient(url, key, { auth: { persistSession: false } });

const die = (label, error) => {
  if (!error) return;
  console.error(`seed-course: ${label} — ${error.message}`);
  if (error.code === "42501" || /row-level security/i.test(error.message))
    console.error(
      "  RLS blocked the write. Either set SUPABASE_SERVICE_ROLE_KEY in .env.local,\n" +
        "  or add a temporary write policy for anon on courses/nav_nodes/lessons.",
    );
  process.exit(1);
};

// Course row (idempotent — re-running never duplicates it).
const up = await sb
  .from("courses")
  .upsert(
    {
      slug: manifest.slug,
      title: manifest.title,
      subtitle: manifest.subtitle ?? null,
      position: manifest.position ?? 0,
    },
    { onConflict: "slug" },
  )
  .select("id")
  .single();
die("upserting the course", up.error);
const courseId = up.data.id;

/* Slugs are only unique within the reader as a whole because this script
 * enforces it per course — so check across the others too, since two courses
 * can each be internally consistent and still collide. */
const others = await sb.from("nav_nodes").select("slug, course_id").neq("course_id", courseId);
die("checking for slug collisions", others.error);
const clash = others.data.filter((n) => seen.has(n.slug)).map((n) => n.slug);
if (clash.length) {
  console.error(
    `seed-course: ${clash.length} slug(s) already used by another course — nothing was written\n  ` +
      clash.join(", "),
  );
  process.exit(1);
}

// Replace the tree wholesale. lessons cascade off nav_nodes.
const cleared = await sb.from("nav_nodes").delete().eq("course_id", courseId);
die("clearing the old tree", cleared.error);

// Insert parents before children so every parent_id already exists.
const idBySlug = new Map();
for (const { node, parentSlug, position } of flat) {
  const row = await sb
    .from("nav_nodes")
    .insert({
      course_id: courseId,
      parent_id: parentSlug ? idBySlug.get(parentSlug) : null,
      slug: node.slug,
      label: node.label,
      position,
      default_open: !!node.defaultOpen,
    })
    .select("id")
    .single();
  die(`inserting node "${node.slug}"`, row.error);
  idBySlug.set(node.slug, row.data.id);
}

const lessons = flat
  .filter((f) => f.node.sections)
  .map(({ node }) => ({
    node_id: idBySlug.get(node.slug),
    course_id: courseId,
    title: node.title,
    kicker: node.kicker ?? null,
    sections: node.sections,
  }));

if (lessons.length) {
  const ins = await sb.from("lessons").insert(lessons);
  die("inserting lessons", ins.error);
}

console.log(
  `seed-course: wrote ${flat.length} nodes and ${lessons.length} lessons for "${manifest.slug}".\n` +
    `             run \`npm run gen:course\` to mirror it into the app.`,
);
