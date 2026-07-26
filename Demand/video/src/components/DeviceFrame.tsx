import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import { C, bodyStack } from "../brand";

const VIDEO_EXT = /\.(mp4|mov|webm|mkv|m4v)$/i;

/* Screen recordings and stills both drop into public/recordings/.
 * `src` is the path relative to public/ — e.g. "recordings/reader.mp4".
 * Anything missing renders a labelled placeholder instead of crashing the
 * render, so the compositions are previewable before any footage exists. */
export const Screen: React.FC<{ src?: string; muted?: boolean }> = ({ src, muted = true }) => {
  if (!src) {
    return (
      <AbsoluteFill
        style={{
          background: "#EFEBD8",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 48,
        }}
      >
        <p
          style={{
            fontFamily: bodyStack,
            fontSize: 26,
            lineHeight: 1.5,
            color: C.muted,
            maxWidth: 460,
          }}
        >
          Drop a screen recording into
          <br />
          <strong style={{ color: C.ink }}>public/recordings/</strong>
          <br />
          then set <strong style={{ color: C.ink }}>screenSrc</strong> in the Studio props panel.
        </p>
      </AbsoluteFill>
    );
  }

  const file = staticFile(src);
  const style: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

  return VIDEO_EXT.test(src) ? (
    <OffthreadVideo src={file} muted={muted} style={style} />
  ) : (
    <Img src={file} style={style} />
  );
};

/* A phone body (vertical posts) or a browser chrome bar (wide demos).
 * Sized by its parent — pass width/height through `style`. */
export const DeviceFrame: React.FC<{
  variant?: "phone" | "browser";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ variant = "phone", children, style }) => {
  if (variant === "browser") {
    return (
      <div
        style={{
          overflow: "hidden",
          borderRadius: 18,
          border: `1px solid ${C.rule}`,
          background: "#fff",
          boxShadow: "0 40px 90px rgba(18,18,18,0.18)",
          display: "flex",
          flexDirection: "column",
          ...style,
        }}
      >
        <div
          style={{
            height: 44,
            flexShrink: 0,
            background: "#F4F1E4",
            borderBottom: `1px solid ${C.rule}`,
            display: "flex",
            alignItems: "center",
            gap: 9,
            paddingLeft: 18,
          }}
        >
          {["#E5E1D2", "#E5E1D2", "#E5E1D2"].map((c, i) => (
            <span
              key={i}
              style={{ width: 11, height: 11, borderRadius: 999, background: c }}
            />
          ))}
        </div>
        <div style={{ position: "relative", flex: 1 }}>{children}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 56,
        background: C.ink,
        boxShadow: "0 50px 110px rgba(18,18,18,0.28)",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 44,
          background: "#fff",
        }}
      >
        {children}
      </div>
    </div>
  );
};
