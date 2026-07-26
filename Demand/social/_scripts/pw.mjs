/* Thin shim so the capture scripts can `import { chromium } from "./pw.mjs"`.
 * Playwright resolution + all shared paths live in paths.mjs. */
export { chromium } from "./paths.mjs";
