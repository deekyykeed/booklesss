"use client";

import { avatarSrc, resolveAvatar } from "./avatars";

/* ------------------------------------------------------------------ *
 * The chosen face, as a file Clerk will accept.
 *
 * Owner, 2026-08-04: "during the onboarding can the icon i picked not be put in
 * clerk as the profile pic?"
 *
 * WHY IT IS NOT JUST THE SVG. The artwork lives at /avatars/<id>.svg and every
 * other surface points straight at it — an <img> in the picker, a CSS
 * background behind Clerk's user button. Clerk's own upload will not take it:
 * `setProfileImage` accepts jpeg, png, gif and webp, and rejects
 * image/svg+xml, which is the correct call on their side (an SVG is a document
 * that can carry script, and it would be served back under their domain). So
 * the vector is rasterised here, in the browser, and a PNG goes up.
 *
 * WHAT THIS BUYS OVER identity/ClerkAvatarSkin, which already paints the face
 * behind Clerk's button. The skin is a costume and it only fits inside this
 * app: it cannot reach Clerk's own account modal, the Users table in the Clerk
 * dashboard, or anywhere else Clerk draws this person. Uploading makes the face
 * the account's ACTUAL image, and `user.hasImage` turns true — which is the
 * exact flag the skin reads to decide it is not needed, so the two hand over to
 * each other with nothing to change.
 *
 * 256px, not the file's own 48. It is a vector, so the size is free, and 48
 * would be upscaled by whatever draws it next.
 * ------------------------------------------------------------------ */

const SIZE = 256;

/**
 * An avatar as a PNG file, or null if anything at all went wrong.
 *
 * NULL RATHER THAN THROWING, because of where this is called from: a
 * fire-and-forget effect during sign-up. A profile picture is the least
 * important thing happening at that moment, and there is no failure here worth
 * showing a student who is halfway through making an account — an old browser,
 * a blocked canvas, a cache miss on a bad connection. The face still shows in
 * the app either way; the skin draws it.
 */
export async function avatarPngFile(id: string): Promise<File | null> {
  if (typeof document === "undefined") return null;
  const resolved = resolveAvatar(id);

  let objectUrl: string | null = null;
  try {
    const res = await fetch(avatarSrc(resolved));
    if (!res.ok) return null;
    const svg = await res.text();

    /* The file's own width/height are overridden rather than trusted. A source
       with no intrinsic size is drawn at zero by Firefox, and one with 48 is
       rasterised at 48 by browsers that honour it and then blown up. Setting
       both makes the output the same everywhere. */
    const sized = svg.replace(
      /<svg\b([^>]*)>/,
      (_m, attrs: string) =>
        `<svg${attrs.replace(/\s(width|height)="[^"]*"/g, "")} width="${SIZE}" height="${SIZE}">`,
    );

    objectUrl = URL.createObjectURL(new Blob([sized], { type: "image/svg+xml" }));
    const img = new Image();
    /* Same-origin blob, so the canvas is never tainted and toBlob works. */
    img.src = objectUrl;
    await new Promise<void>((ok, fail) => {
      img.onload = () => ok();
      img.onerror = () => fail(new Error("decode"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, SIZE, SIZE);

    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/png"));
    return blob ? new File([blob], `${resolved}.png`, { type: "image/png" }) : null;
  } catch {
    return null;
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}
