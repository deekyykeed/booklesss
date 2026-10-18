"use client";

import type { Scene, StyleId } from "@/lib/studio";

/** One screen of a video, drawn in a style preset. The same component is the
 *  player's picture, a card's thumbnail and the style picker's preview, so a
 *  preset can never look one way in the picker and another in the video. */
export function Stage({
  scene,
  style,
  eyebrow,
  foot,
  animate = false,
}: {
  scene: Pick<Scene, "heading" | "lines"> | null;
  style: StyleId;
  eyebrow?: string;
  foot?: [string, string];
  animate?: boolean;
}) {
  return (
    <div className="st-stage-box">
    <div className={`st-stage st-style-${style}`}>
      {eyebrow && <span className="st-stage-eyebrow">{eyebrow}</span>}
      <span className="st-stage-mark">Booklesss</span>
      {scene && (
        <div className={animate ? "st-stage-in" : undefined} key={scene.heading + scene.lines[0]}>
          <div className="st-stage-h">{scene.heading}</div>
          <div className="st-stage-rule" />
          {scene.lines.map((l) => (
            <p className="st-stage-line" key={l}>{l}</p>
          ))}
        </div>
      )}
      {foot && (
        <span className="st-stage-foot">
          <span>{foot[0]}</span>
          <span>{foot[1]}</span>
        </span>
      )}
    </div>
    </div>
  );
}
