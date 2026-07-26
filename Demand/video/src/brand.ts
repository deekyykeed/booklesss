import { loadFont } from "@remotion/fonts";
import { continueRender, delayRender, staticFile } from "remotion";

/* The Booklesss palette — same values the PDFs and the reader app use.
 * Cream paper, black type, warm rule. Red is an eyebrow accent only. */
export const C = {
  cream: "#FFFDE8",
  ink: "#121212",
  rule: "#E0DACB",
  muted: "#737374",
  accent: "#DC2626",
} as const;

export const DISPLAY = "Familjen Grotesk";
export const BODY = "Inter";

/* Fonts are vendored in public/fonts (same woff2 files the social capture
 * scripts embed), so a render never depends on a network fetch. */
const handle = delayRender("Loading Booklesss fonts");

Promise.all([
  loadFont({
    family: DISPLAY,
    url: staticFile("fonts/familjen-grotesk.woff2"),
    weight: "400 700",
    format: "woff2",
  }),
  loadFont({
    family: BODY,
    url: staticFile("fonts/inter.woff2"),
    weight: "400 700",
    format: "woff2",
  }),
])
  .then(() => continueRender(handle))
  .catch((err) => {
    // Never hard-fail a render on a font — fall back to the system stack.
    console.warn("Font load failed, falling back to system fonts:", err);
    continueRender(handle);
  });

export const displayStack = `"${DISPLAY}", "Familjen Grotesk", Georgia, serif`;
export const bodyStack = `"${BODY}", Inter, -apple-system, "Segoe UI", sans-serif`;
