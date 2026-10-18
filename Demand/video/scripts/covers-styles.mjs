// Renders one test frame per animation style to out/covers/styles/<id>.png.
// Bundles once and renders every style from that bundle.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ids = [...readFileSync("src/covers/styles.tsx", "utf8").matchAll(/^  (\w+): \{ label:/gm)].map((m) => m[1]);
mkdirSync("out/covers/styles", { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const look of ids) {
  const composition = await selectComposition({ serveUrl, id: "StyleCover", inputProps: { look } });
  await renderStill({ serveUrl, composition, inputProps: { look }, output: `out/covers/styles/${look}.png` });
  console.log("style", look);
}
