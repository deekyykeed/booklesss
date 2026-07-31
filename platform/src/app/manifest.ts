import type { MetadataRoute } from "next";

/* Served at /manifest.webmanifest; Next links it from every page on its own.
 *
 * This is what turns the reader into something a student can install from the
 * browser's "Add to home screen" — an icon on the phone, opening without
 * browser chrome. Paired with public/sw.js, an installed reader opens and
 * shows already-read steps with no connection at all. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Booklesss",
    short_name: "Booklesss",
    description: "Learn without the textbook — courses, lessons, and steps.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f5", // --color-canvas, so the splash matches the app
    theme_color: "#f5f5f5",
    orientation: "portrait",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      /* Android crops this one to the launcher's shape. Without a maskable
       * icon it shrinks the "any" icon inside a white blob instead. */
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
