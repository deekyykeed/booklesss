/* ------------------------------------------------------------------ *
 * Referrals — who shared the link that brought this reader in.
 *
 * DELIBERATELY NOT a "use client" module: lib/site imports it for shareUrl,
 * and lib/site is also imported by server metadata code. Everything here is
 * plain state and pure functions; the browser-only parts guard themselves,
 * and nothing server-side ever calls them.
 *
 * The design was decided 2026-08-02 and parked until accounts landed, so a
 * referral could point at a person rather than a device. They are live, so
 * this is now the whole loop:
 *
 *   1. A signed-in student's share links carry their code — `?r=deeky-7fq`,
 *      appended in shareUrl() so every share surface emits it at once.
 *   2. The arriving device stores the code (below). FIRST REFERRER WINS:
 *      the person whose link opened this app first is the one who brought
 *      the reader in, and a later link must not quietly take that over.
 *   3. Sign-up copies it onto the new account as `referred_by` in the auth
 *      user's metadata (see components/auth/AuthForm), and profile-sync writes
 *      it to the student's row — so every account permanently records who sent
 *      them, in a table that can be GROUPed BY.
 *
 * Counting and rewarding stays HUMAN for now, which is the right size for a
 * business currently rewarding people over WhatsApp and mobile money: the
 * owner reads `referred_by` off the students table and pays the star sharers.
 * A leaderboard is a view over that column when it is worth building.
 *
 * The code is name-based and derived, not stored: a slug of what the person
 * is called, then a short stable tail off their user id so two Deekys don't
 * collide. Readable in the URL, readable in the stats without a lookup table.
 * ------------------------------------------------------------------ */

const KEY = "booklesss:referrer:v1";

/** The signed-in student's own share code, published by AccountSignal (the
 *  one component that reads the session) and read by shareUrl(). Module
 *  state rather than a hook because shareUrl is a plain function; always
 *  null on the server, which is fine — server-built URLs carry no referral. */
let myCode: string | null = null;

export function setMyReferralCode(code: string | null): void {
  myCode = code;
}

export function getMyReferralCode(): string | null {
  return myCode;
}

/** `?r=` values are stranger input — cap them to slug characters and a sane
 *  length before storing or forwarding to account metadata. */
function sanitize(raw: string): string | null {
  const v = raw.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 32);
  return v.length >= 2 ? v : null;
}

/** Called once per page load (IdentityAssignment's effect — the root client
 *  mount every arrival passes through). Reads `?r=` off the URL and keeps it
 *  if this device doesn't already owe its arrival to someone. */
export function captureReferrer(): void {
  try {
    const raw = new URLSearchParams(window.location.search).get("r");
    if (!raw) return;
    const code = sanitize(raw);
    if (code && !window.localStorage.getItem(KEY)) window.localStorage.setItem(KEY, code);
  } catch {
    /* storage blocked — the referral is the one thing here that can be lost */
  }
}

/** The code this device arrived under, or null. */
export function referrer(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/**
 * A person's own share code — `deeky-7fq`.
 *
 * Derived fresh every time from what the account already knows, so there is
 * nothing to store, migrate or keep unique: the tail is a base-36 hash of the
 * user id, stable for life, and the name part is only there so a human can
 * read who a link came from.
 */
export function referralCode(name: string | null | undefined, userId: string): string {
  const slug =
    (name ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 16) || "reader";
  let h = 0;
  for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) >>> 0;
  return `${slug}-${h.toString(36).slice(0, 3)}`;
}
