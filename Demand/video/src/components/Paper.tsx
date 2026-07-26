import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C } from "../brand";

/* The cream page every scene sits on, with the brand grain laid over it at a
 * low opacity so flat fills don't read as digital-flat on video. */
export const Paper: React.FC<{
  children?: React.ReactNode;
  background?: string;
  grain?: number;
}> = ({ children, background = C.cream, grain = 0.16 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: background }}>
      <AbsoluteFill
        style={{
          opacity: grain,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      >
        <Img
          src={staticFile("brand/grain.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};
