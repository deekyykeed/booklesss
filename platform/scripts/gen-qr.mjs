/* Draws the "open this on your phone" QR into public/install-qr.svg.
 *
 *   npm run gen:qr
 *
 * A build-time script rather than a runtime component on purpose: the code
 * always encodes the same one URL, so generating it in the browser would ship
 * a QR library to every phone in order to draw a picture that never changes.
 * This way the desktop gate loads a static SVG and mobile downloads nothing.
 *
 * Change SITE and rerun when the reader gets a real domain. */
import QRCode from "qrcode";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SITE = "https://booklesss.vercel.app";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "install-qr.svg");

const svg = await QRCode.toString(SITE, {
  type: "svg",
  margin: 1,
  // Medium recovery: enough to survive a phone camera at an angle on a
  // reflective screen, without inflating the module count.
  errorCorrectionLevel: "M",
  color: { dark: "#0b0b0b", light: "#ffffff" },
});

writeFileSync(OUT, svg);
console.log(`gen-qr: wrote install-qr.svg for ${SITE} (${(svg.length / 1024).toFixed(1)} KB)`);
