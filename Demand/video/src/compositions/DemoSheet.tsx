import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ProductDemo } from "./ProductDemo";
import { bodyStack } from "../brand";

/* QA board for the 60s demo: fifteen moments of the real composition, laid out
 * as one still. Beats re-rendering fifteen separate PNGs and squinting at them
 * one at a time.
 *
 * The trick is `<Sequence from={-n}>` — a negative offset means that at sheet
 * frame 0 the child sees frame n, so each tile is the same component frozen at
 * a different point. No intermediate video file, nothing to clean up.
 *
 * Caveat: useVideoConfig() inside a tile reports the SHEET's dimensions, so the
 * ambient blobs are laid out slightly differently here than in the real render.
 * Framing, typography and shot choice are what this is for. */

const COLS = 5;
const ROWS = 3;
const TILE_W = 300;
const TILE_H = 533; // 9:16
const LABEL_H = 26;

export const SHEET_W = COLS * TILE_W + 16 * (COLS + 1);
export const SHEET_H = ROWS * (TILE_H + LABEL_H) + 16 * (ROWS + 1);

export const DemoSheet: React.FC<{ everyNFrames?: number }> = ({ everyNFrames = 120 }) => {
  const marks = Array.from({ length: COLS * ROWS }, (_, i) => i * everyNFrames);
  const scale = TILE_W / 1080;

  return (
    <AbsoluteFill style={{ background: "#101014", padding: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {marks.map((n) => (
          <div key={n} style={{ width: TILE_W }}>
            <div
              style={{
                width: TILE_W,
                height: TILE_H,
                overflow: "hidden",
                borderRadius: 6,
                position: "relative",
                background: "#000",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 1080,
                  height: 1920,
                  transform: `scale(${scale})`,
                  transformOrigin: "0 0",
                }}
              >
                <Sequence from={-n} layout="none">
                  <ProductDemo />
                </Sequence>
              </div>
            </div>
            <div
              style={{
                height: LABEL_H,
                fontFamily: bodyStack,
                fontSize: 16,
                color: "#8a8a95",
                paddingTop: 6,
              }}
            >
              {n}f · {(n / 30).toFixed(1)}s
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
