// Renders every lesson cover in src/covers/covers.ts to out/covers/<key>.png.
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";

const src = readFileSync("src/covers/covers.ts", "utf8");
const rows = [...src.matchAll(/^\s+(\w+): (\{.*\}),$/gm)];
mkdirSync("out/covers", { recursive: true });
for (const [, key, obj] of rows) {
  const props = JSON.stringify(Function(`return (${obj})`)());
  console.log("cover", key);
  execFileSync("npx", ["remotion", "still", "Cover", `out/covers/${key}.png`, `--props=${props}`], { stdio: "inherit", shell: true });
}
