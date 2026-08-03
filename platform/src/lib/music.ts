/* ------------------------------------------------------------------ *
 * The study playlist that sits at the bottom of the reader's sidebar.
 *
 * Changing what plays is the one line below. Paste either form — a full
 * Spotify link copied from the app's "Share → Copy link", or the bare id:
 *
 *   https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ?si=abc123
 *   37i9dQZF1DWZeKCadgRdKQ
 *
 * Why the plain embed and not the Web Playback SDK: the SDK needs a Spotify
 * OAuth login per reader AND a Premium account, and this app deliberately has
 * no accounts at all — a reader arriving from a WhatsApp link is anonymous by
 * design. The embed needs neither, so it works for everybody on first tap.
 *
 * What that costs, and it is worth knowing before anyone reports it as a bug:
 * a listener who is **not** signed in to Spotify in the same browser hears
 * 30-second previews, not whole tracks. Signed in — free or Premium — they get
 * the full thing. There is no way to change that from our side; it is Spotify's
 * rule for embedded playback, and the alternative (the SDK) is Premium-only,
 * which is strictly worse.
 *
 * Nothing autoplays. Browsers block sound without a user gesture and Spotify
 * honours that, so the reader presses play once. Deliberate anyway: audio
 * starting by itself in a library is the wrong first impression.
 * ------------------------------------------------------------------ */

/** Deep Focus — Spotify's own editorial playlist. Verified live 2026-08-03. */
export const PLAYLIST = "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ";

/** Shown beside the player while Spotify's iframe is still loading. */
export const PLAYLIST_NAME = "Deep Focus";

/** A Spotify id is always 22 base62 characters. */
const ID = /[A-Za-z0-9]{22}/;

/**
 * Pull the playlist id out of whatever was pasted above. Returns null rather
 * than guessing, so a mistyped link renders no player instead of an iframe
 * pointing at nothing.
 */
export function playlistIdFrom(urlOrId: string): string | null {
  const s = urlOrId.trim();
  if (new RegExp(`^${ID.source}$`).test(s)) return s;
  const m = s.match(new RegExp(`playlist[/:](${ID.source})`));
  return m ? m[1] : null;
}

/** The iframe src, or null if the constant above isn't a playlist. */
export function embedSrc(urlOrId: string = PLAYLIST): string | null {
  const id = playlistIdFrom(urlOrId);
  return id ? `https://open.spotify.com/embed/playlist/${id}?utm_source=generator` : null;
}
