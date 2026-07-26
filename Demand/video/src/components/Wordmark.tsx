import React from "react";
import { C, displayStack } from "../brand";

/* The diamond mark + wordmark, drawn as SVG so it stays crisp at any
 * composition size and follows `color` (never a CDN image). Same two paths the
 * social capture scripts use. */
export const Mark: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3.46484 20.5359c1.46447 1.4645 3.82149 1.4645 8.53556 1.4645 4.714 0 7.071 0 8.5355 -1.4645 1.4645 -1.4645 1.4645 -3.8215 1.4645 -8.5355 0 -4.71407 0 -7.07109 -1.4645 -8.53556L3.46484 20.5359Z"
      fill={C.muted}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.46447 3.46447C2 4.92893 2 7.28595 2 12c0 4.714 0 7.0711 1.46447 8.5355L20.5355 3.46447C19.0711 2 16.714 2 12 2 7.28595 2 4.92893 2 3.46447 3.46447Z"
      fill={C.ink}
    />
  </svg>
);

export const Wordmark: React.FC<{ size?: number; showMark?: boolean }> = ({
  size = 40,
  showMark = true,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.34 }}>
    {showMark ? <Mark size={size} /> : null}
    <span
      style={{
        fontFamily: displayStack,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: -size * 0.02,
        color: C.ink,
      }}
    >
      Booklesss
    </span>
  </div>
);
