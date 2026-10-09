import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Explainer } from "./Explainer";
import { EXPLAINERS } from "../explainers";
import { sat } from "./look";

/* QA board for an explainer: 24 moments in one still, same <Sequence from={-n}>
 * trick as DemoSheet. Each tile is labelled with its time and the word being
 * spoken at that moment, so a mistimed cut is visible as a mismatch between
 * the label and the picture.
 *
 *   npx remotion still ExplainerSheet out/_explainer-qa.png
 *   npx remotion still ExplainerSheet out/_seams.png --props='{"slug":"present-value","seams":true}' */

const COLS = 6;
const ROWS = 4;
const TILE_W = 270;
const TILE_H = 480;
const LABEL_H = 50;
export const XSHEET_W = COLS * TILE_W + 14 * (COLS + 1);
export const XSHEET_H = ROWS * (TILE_H + LABEL_H) + 14 * (ROWS + 1);

export const ExplainerSheet: React.FC<{ slug: string; marks?: number[]; seams?: boolean; footage?: string | null; faces?: number[][] | null }> = ({
  slug,
  marks,
  seams,
  footage = null,
  faces = null,
}) => {
  const { beats, duration } = EXPLAINERS[slug].timeline;
  const n = COLS * ROWS;
  /* seams: three frames around every transition (before, during, after) —
   * the place a cut goes wrong, which evenly spaced tiles mostly miss. */
  const seamMarks = beats.slice(1).flatMap((b) => [b.at - 10, b.at - 3, b.at + 5]).slice(0, n);
  const at = marks ?? (seams ? seamMarks : Array.from({ length: n }, (_, i) => Math.round(((i + 0.5) / n) * duration)));
  const allWords = beats.flatMap((b) => b.words);
  const wordAt = (f: number) => [...allWords].reverse().find((w) => w.f <= f)?.text ?? "";
  const beatAt = (f: number) => [...beats].reverse().find((b) => b.at <= f);

  return (
    <AbsoluteFill style={{ background: "#101014", padding: 14 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {at.map((f) => {
          const b = beatAt(f);
          return (
            <div key={f} style={{ width: TILE_W }}>
              <div style={{ width: TILE_W, height: TILE_H, overflow: "hidden", position: "relative", borderRadius: 4 }}>
                <div style={{ position: "absolute", width: 1080, height: 1920, transform: `scale(${TILE_W / 1080})`, transformOrigin: "0 0" }}>
                  <Sequence from={-f} layout="none">
                    <Explainer slug={slug} footage={footage} faces={faces} />
                  </Sequence>
                </div>
              </div>
              <div style={{ height: LABEL_H, fontFamily: sat, fontSize: 17, color: "#9a9aa5", paddingTop: 6, lineHeight: 1.3 }}>
                {(f / 30).toFixed(1)}s · {b?.show === "you" ? "YOU" : b?.scene} · {b?.in ?? "—"}
                <br />
                <span style={{ color: "#e6e6ea" }}>“{wordAt(f)}”</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
