import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

/* Everything resolves from this file, not the shell's cwd, so the scripts run
 * the same from anywhere. */
export const SCRIPTS = path.dirname(fileURLToPath(import.meta.url));
export const MARKETING = path.resolve(SCRIPTS, "..");
export const ROOT = path.resolve(MARKETING, "..");
export const SOURCE = path.join(MARKETING, "_source");
export const SOCIAL = path.join(MARKETING, "social");

// Playwright is a devDependency of the app, so borrow it from there.
const require = createRequire(path.join(ROOT, "package.json"));
export const { chromium } = require("playwright");

export const BASE = process.env.BASE_URL || "http://localhost:3100";
export const LESSON = "/microeconomics/supply-demand/law-of-demand";

/* Fonts, straight from the app's own build — the posters set type in the same
 * faces the product does. Re-run `npm run build` and refresh these if the
 * hashed filenames ever change (list them with: ls .next/static/media). */
export const INTER = "/_next/static/media/83afe278b6a6bb3c-s.p.2bn3s6zvc0dyp.woff2";
export const FAMILJEN = "/_next/static/media/f5edcc6a132fb1ad-s.p.3ii__yurxaf4q.woff2";

export const LOGO = (s = 40) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none">
<path d="M3.46484 20.5359c1.46447 1.4645 3.82149 1.4645 8.53556 1.4645 4.714 0 7.071 0 8.5355 -1.4645 1.4645 -1.4645 1.4645 -3.8215 1.4645 -8.5355 0 -4.71407 0 -7.07109 -1.4645 -8.53556L3.46484 20.5359Z" fill="#737374"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.46447 3.46447C2 4.92893 2 7.28595 2 12c0 4.714 0 7.0711 1.46447 8.5355L20.5355 3.46447C19.0711 2 16.714 2 12 2 7.28595 2 4.92893 2 3.46447 3.46447Z" fill="#000000"/></svg>`;
