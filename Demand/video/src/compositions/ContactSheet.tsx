import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SHOTS } from "../shots";
import { bodyStack } from "../brand";

/* A QA-only board: every capture in public/app at thumbnail size, labelled.
 * One still of this answers "what do I actually have to cut with", instead of
 * opening fourteen files. Not part of any deliverable. */
export const ContactSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#111", padding: 24 }}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignContent: "flex-start" }}>
      {Object.entries(SHOTS).map(([key, { file }]) => (
        <div key={key} style={{ width: 300 }}>
          <div
            style={{
              height: 620,
              background: "#222",
              overflow: "hidden",
              borderRadius: 8,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Img
              src={staticFile(file)}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          </div>
          <div style={{ fontFamily: bodyStack, fontSize: 20, color: "#fff", paddingTop: 8 }}>
            {key}
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
