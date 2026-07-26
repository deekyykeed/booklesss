import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

/* H.264 in an .mp4 — what Instagram, TikTok and WhatsApp all take without
 * re-encoding. Quality over file size: these are short clips. */
Config.setCodec("h264");
Config.setCrf(18);

/* Windows + OneDrive: concurrency above ~half the cores makes the file writes
 * fight the sync client. Leave it to Remotion unless a render stalls. */
// Config.setConcurrency(4);
