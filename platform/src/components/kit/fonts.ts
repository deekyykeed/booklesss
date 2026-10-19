import { DM_Mono } from "next/font/google";

/* INTER IS THE KIT'S MAIN FACE (owner, 2026-10-19: "pull in the font that is
 * used on the Booklesss dashboard in Paper, not Rubik" — that board's text is
 * Inter). It is the root layout's own Inter instance (`--font-inter`, the
 * full variable family), so the kit registers nothing for it; `--kit-sans`
 * in kit.css reads the root variable. Rubik was the main face from
 * 2026-10-18 and loaded here as `--font-kit-main` — gone with the swap, so a
 * face nothing draws is not paid for. DM Mono stays for the wordmark and the
 * small uppercase hints. One module so /components and the app load the same
 * instances. */
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-dm-mono", display: "swap" });

export const kitFonts = dmMono.variable;
