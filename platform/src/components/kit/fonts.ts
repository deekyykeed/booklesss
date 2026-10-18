import { DM_Mono, Rubik } from "next/font/google";

/* RUBIK IS THE KIT'S MAIN FACE (owner, 2026-10-18: "make that main font
 * Rubik") — every widget, the sidebar, the app built from them. The full
 * variable family, because the kit sets 400 to 700; the root layout's Rubik
 * instance carries only 400 and 500 for the landing page. DM Mono stays for
 * the wordmark and the small uppercase hints. One module so /components and
 * the app load the same instances. */
const rubik = Rubik({ subsets: ["latin"], variable: "--font-kit-main", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-dm-mono", display: "swap" });

export const kitFonts = `${rubik.variable} ${dmMono.variable}`;
