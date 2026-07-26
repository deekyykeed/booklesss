/* Social safe areas for a 1080x1920 post.
 *
 * The platform draws its own furniture over the video: the account header sits
 * across the top, the like / comment / share rail runs down the right, and the
 * caption plus the progress bar eat the bottom. Anything that lands there is
 * either covered or ignored, so every caption and every piece of UI in these
 * compositions is laid out inside STAGE — centred, and clear of all three.
 *
 * Numbers are deliberately generous: TikTok's rail is the widest and its
 * caption block the tallest, so a layout that clears TikTok clears Reels and
 * Shorts too. */
export const FRAME_W = 1080;
export const FRAME_H = 1920;

export const SAFE = {
  top: 300, // account header / "Following | For You"
  bottom: 470, // caption, music ticker, progress bar
  right: 210, // like / comment / share / avatar rail
  left: 90,
} as const;

export const STAGE = {
  x: SAFE.left,
  y: SAFE.top,
  w: FRAME_W - SAFE.left - SAFE.right,
  h: FRAME_H - SAFE.top - SAFE.bottom,
} as const;

/** Middle of the usable area — not the middle of the frame. */
export const STAGE_CX = STAGE.x + STAGE.w / 2;
export const STAGE_CY = STAGE.y + STAGE.h / 2;

/* A box that is genuinely centred in the FRAME while still clearing the right
 * rail — necessarily narrower than STAGE, because STAGE is centred on the
 * usable area, not on the frame. Interactive UI goes here so it reads as
 * middle-of-screen; left-aligned type can use the wider STAGE. */
export const CENTERED_W = 2 * (FRAME_W / 2 - SAFE.right);
export const CENTERED_X = (FRAME_W - CENTERED_W) / 2;

/** Caption block sits at the top of the stage; the action gets the rest. */
export const CAPTION_H = 250;
export const ACTION = {
  x: STAGE.x,
  y: STAGE.y + CAPTION_H,
  w: STAGE.w,
  h: STAGE.h - CAPTION_H,
} as const;
