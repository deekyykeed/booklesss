// Writes every profile picture to public/avatars/<id>.svg and regenerates the
// index that names them.
//   npm run gen:avatars
//
// FILES, NOT INLINE SVG — the whole point of this rewrite. The old version
// inlined twelve icons into avatars.tsx as markup strings and carried its own
// warning about why it could never be more than twelve: at ~2KB of path data
// each, a hundred is ~250KB shipped to every reader in a client component, for
// one picture. The school crests hit the same wall this morning and were solved
// the same way — the browser fetches and caches the artwork, the bundle carries
// only ids.
//
// So the ceiling is gone: all 200 ship, and a reader who never opens the picker
// downloads none of them.
//
// The set is Streamline "Kameleon Colors" free (CC BY 4.0, attribution owed
// with the rest). Each icon is a finished badge — a full-bleed 48px disc in one
// of the set's flat colours with its subject on it — so nothing is recoloured
// and nothing needs a shell drawn round it. The package carries 400: 200
// Colors and their 200 `-duo` twins, which are the same subjects in two tones
// and would fill the picker with near-duplicates, so they are excluded.
import { getIconData, iconToSVG } from "@iconify/utils";
import kameleon from "@iconify-json/streamline-kameleon-color/icons.json" with { type: "json" };
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "..", "public", "avatars");
const INDEX_OUT = join(HERE, "..", "src", "components", "identity", "avatar-index.json");

/* The twelve that shipped before this, keyed by the id already written into
 * people's records. Those ids were hand-picked and do not all match the icon
 * name — "smiley" is the icon "love-smiley" — so without this map every
 * existing student's stored avatar would resolve to nothing and they would
 * silently lose their face. Aliases rather than renames: a stored id is a
 * promise. */
const LEGACY = {
  astronaut: "astronaut",
  robot: "robot",
  smiley: "love-smiley",
  peace: "peace",
  ladybug: "ladybug",
  butterfly: "butterfly",
  ufo: "ufo",
  party: "party-poppers",
  rainbow: "rainbow",
  strawberry: "strawberry",
  dice: "dices",
  skate: "skate",
};

/** "party-poppers" -> "Party poppers". What a screen reader says and what the
 *  picker shows; it names the thing, never the colour. */
function label(name) {
  const words = name.replace(/-/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const names = Object.keys(kameleon.icons)
  .filter((n) => !n.endsWith("-duo"))
  .sort();

const missing = Object.entries(LEGACY).filter(([, icon]) => !names.includes(icon));
if (missing.length) {
  throw new Error(
    `gen-avatars: legacy avatars point at icons no longer in the set — a student's stored face would vanish:\n  ${missing
      .map(([id, icon]) => `${id} -> ${icon}`)
      .join("\n  ")}`,
  );
}

mkdirSync(OUT_DIR, { recursive: true });
// Cleared first, so an icon dropped upstream does not linger as a file the
// index no longer lists.
for (const f of readdirSync(OUT_DIR)) if (f.endsWith(".svg")) rmSync(join(OUT_DIR, f));

const index = [];
let bytes = 0;
for (const name of names) {
  const data = getIconData(kameleon, name);
  if (!data) continue;
  const built = iconToSVG(data, { height: 48, width: 48 });
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${built.attributes.viewBox}" ` +
    `width="48" height="48">${built.body}</svg>`;
  writeFileSync(join(OUT_DIR, `${name}.svg`), svg);
  bytes += svg.length;
  index.push({ id: name, label: label(name) });
}

/* The aliases ride along in the index so lib/identity can resolve an old id
   without a second file to load. */
writeFileSync(INDEX_OUT, JSON.stringify({ avatars: index, legacy: LEGACY }, null, 2) + "\n");

console.log(
  `gen-avatars: wrote ${index.length} avatars to public/avatars ` +
    `(${(bytes / 1024).toFixed(0)}KB on disk, ~0KB in the JS bundle), ` +
    `index ${(JSON.stringify(index).length / 1024).toFixed(1)}KB.`,
);
