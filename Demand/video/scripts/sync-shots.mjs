/* Copy the app captures into public/ so Remotion's staticFile() can reach them.
 *
 * The captures are produced by Demand/social/_scripts/cap-feature.mjs and are
 * committed once, there. public/app is gitignored so the same PNGs aren't
 * carried twice in the repo — run this after a fresh clone, or after
 * re-shooting the app. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, "..", "..", "social", "_source", "feature-capture");
const DEST = path.resolve(HERE, "..", "public", "app");

if (!fs.existsSync(SRC)) {
  console.error(`No captures at ${SRC}\nRun Demand/social/_scripts/cap-feature.mjs first.`);
  process.exit(1);
}

fs.mkdirSync(DEST, { recursive: true });
const shots = fs.readdirSync(SRC).filter((f) => f.endsWith(".png"));
for (const f of shots) fs.copyFileSync(path.join(SRC, f), path.join(DEST, f));

console.log(`${shots.length} shots -> ${path.relative(process.cwd(), DEST)}`);
