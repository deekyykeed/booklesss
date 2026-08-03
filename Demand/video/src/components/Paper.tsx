import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../brand";

/* The page every scene sits on. It used to carry a grain texture over the fill;
 * the grain was retired with the serif identity on 2026-08-03 (owner: "get rid
 * of the grain"), so this is now a flat colour and nothing else. */
export const Paper: React.FC<{
  children?: React.ReactNode;
  background?: string;
}> = ({ children, background = C.cream }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: background }}>{children}</AbsoluteFill>
  );
};
