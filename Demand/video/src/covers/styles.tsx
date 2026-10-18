import React from "react";
import { AbsoluteFill } from "remotion";
import { sat, serif } from "../explainer/look";

/* Twenty animation styles, each drawn as one still frame of a lesson video.
 * They exist to test the course and video cards against real variety: a
 * cover is a frame of its video, and a creator picks one of these styles when
 * they make a course. Every frame is 1600x1000 and drawn entirely in code. */

export const STYLE_W = 1600;
export const STYLE_H = 1000;

const W = STYLE_W;
const H = STYLE_H;

const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const BLACK = `"Arial Black", "Satoshi", sans-serif`;
const MONO = `Consolas, "Courier New", monospace`;
const BAHN = `Bahnschrift, "Satoshi", sans-serif`;

type P = { title: string; eyebrow: string };

const Eyebrow: React.FC<{ text: string; color: string; font?: string; style?: React.CSSProperties }> = ({
  text,
  color,
  font = sat,
  style,
}) => (
  <div style={{ position: "absolute", left: 96, top: 84, fontFamily: font, fontWeight: 500, fontSize: 30, color, ...style }}>
    {text}
  </div>
);

/* 1 — Particles: cash as a stream of dots pouring into a jar. */
const Particles: React.FC<P> = ({ title, eyebrow }) => {
  const r = rng(11);
  const dots = Array.from({ length: 900 }, () => {
    const t = r();
    const x = 760 + t * 640 + Math.sin(t * 12) * 60 + (r() - 0.5) * 80 * (1 - t);
    const y = 120 + t * 640 + Math.cos(t * 9) * 40 + (r() - 0.5) * 60;
    return { x, y, s: 2 + r() * 5, o: 0.3 + r() * 0.7, warm: r() > 0.85 };
  });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 40%, #0E2A22 0%, #050B09 70%)" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.s} fill={d.warm ? "#F5C451" : "#7CF5C0"} opacity={d.o} />
        ))}
        <rect x={1240} y={640} width={220} height={260} rx={40} fill="none" stroke="#7CF5C0" strokeWidth={4} opacity={0.6} />
      </svg>
      <Eyebrow text={eyebrow} color="#7CF5C0" />
      <div style={{ position: "absolute", left: 96, bottom: 96, fontFamily: sat, fontWeight: 700, fontSize: 132, letterSpacing: "-0.04em", color: "#EFFFF8", lineHeight: "120px", maxWidth: 800 }}>
        {title}
      </div>
    </AbsoluteFill>
  );
};

/* 2 — Liquid morph: blobs melting into each other. */
const Liquid: React.FC<P> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: "#120A2A" }}>
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <filter id="goo">
          <feGaussianBlur stdDeviation="40" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -18" />
        </filter>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF6AD5" />
          <stop offset="0.5" stopColor="#8B5CFF" />
          <stop offset="1" stopColor="#3DE0FF" />
        </linearGradient>
      </defs>
      <g filter="url(#goo)" fill="url(#lg)">
        <circle cx={1050} cy={420} r={220} />
        <circle cx={1300} cy={560} r={170} />
        <circle cx={1180} cy={300} r={120} />
        <circle cx={900} cy={640} r={110} />
        <circle cx={1420} cy={330} r={80} />
      </g>
    </svg>
    <Eyebrow text={eyebrow} color="#C8B8FF" />
    <div style={{ position: "absolute", left: 96, bottom: 96, fontFamily: serif, fontStyle: "italic", fontSize: 168, color: "#FFFFFF", lineHeight: "150px" }}>
      {title}
    </div>
  </AbsoluteFill>
);

/* 3 — Neon glow: two lines on a dark grid crossing at break-even. */
const Neon: React.FC<P> = ({ title, eyebrow }) => {
  const glow = (c: string) => `drop-shadow(0 0 8px ${c}) drop-shadow(0 0 24px ${c})`;
  return (
    <AbsoluteFill style={{ background: "#07040F" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {Array.from({ length: 21 }).map((_, i) => (
          <path key={"v" + i} d={`M${i * 80} 0 V${H}`} stroke="#2A1B4A" strokeWidth={1} />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <path key={"h" + i} d={`M0 ${i * 80} H${W}`} stroke="#2A1B4A" strokeWidth={1} />
        ))}
        <path d="M720 820 L1500 160" stroke="#FF3DF2" strokeWidth={6} style={{ filter: glow("#FF3DF2") }} />
        <path d="M720 560 L1500 380" stroke="#33F0FF" strokeWidth={6} style={{ filter: glow("#33F0FF") }} />
        <circle cx={1112} cy={469} r={16} fill="#FFFFFF" style={{ filter: glow("#FFFFFF") }} />
      </svg>
      <Eyebrow text={eyebrow} color="#33F0FF" style={{ textShadow: "0 0 12px #33F0FF" }} />
      <div style={{ position: "absolute", left: 96, bottom: 96, fontFamily: BAHN, fontWeight: 700, fontSize: 150, color: "#FFE9FE", textShadow: "0 0 10px #FF3DF2, 0 0 40px #FF3DF2", lineHeight: "140px", maxWidth: 760 }}>
        {title}
      </div>
    </AbsoluteFill>
  );
};

/* 4 — Y2K chrome: liquid-metal type on a sky gradient. */
const Chrome: React.FC<P> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #9FD8FF 0%, #E8F6FF 55%, #FFD6F5 100%)" }}>
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="chr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.45" stopColor="#8A9BB0" />
          <stop offset="0.5" stopColor="#2B3442" />
          <stop offset="0.62" stopColor="#D9E4F0" />
          <stop offset="1" stopColor="#6E7F95" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={1200} cy={360} rx={300 - i * 70} ry={110 - i * 25} fill="none" stroke="url(#chr)" strokeWidth={22} transform={`rotate(${-18 + i * 18} 1200 360)`} />
      ))}
      <path d="M1200 180 L1218 342 L1380 360 L1218 378 L1200 540 L1182 378 L1020 360 L1182 342 Z" fill="#FFFFFF" />
      <text x={96} y={880} fontFamily={BLACK} fontSize={150} fill="url(#chr)" stroke="#1C2330" strokeWidth={3} letterSpacing="-4">
        {title}
      </text>
    </svg>
    <Eyebrow text={eyebrow} color="#3A4A66" />
  </AbsoluteFill>
);

/* 5 — Kinetic type: the words ARE the frame. */
const Kinetic: React.FC<P> = ({ title, eyebrow }) => {
  const words = title.toUpperCase().split(" ");
  return (
    <AbsoluteFill style={{ background: "#F2F0EA", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 80, top: 150, display: "flex", flexDirection: "column", gap: 0 }}>
        {words.map((w, i) => (
          <div
            key={i}
            style={{
              fontFamily: BLACK,
              fontSize: 230,
              lineHeight: "210px",
              letterSpacing: "-0.05em",
              color: i % 2 ? "transparent" : "#111111",
              WebkitTextStroke: i % 2 ? "4px #111111" : undefined,
              transform: `translateX(${i * 110}px)`,
            }}
          >
            {w}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 96, bottom: 84, width: 180, height: 180, borderRadius: 90, background: "#FF4A1C" }} />
      <Eyebrow text={eyebrow} color="#111111" font={MONO} />
    </AbsoluteFill>
  );
};

/* 6 — Paper cutout: layered card shapes with drop shadows. */
const Cutout: React.FC<P> = ({ title, eyebrow }) => {
  const layer = (d: string, fill: string, k: number) => (
    <path key={k} d={d} fill={fill} style={{ filter: "drop-shadow(0 10px 8px rgba(60,30,10,.28))" }} />
  );
  return (
    <AbsoluteFill style={{ background: "#F6E7CF" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {layer("M0 760 C 300 680, 600 820, 900 740 S 1400 660, 1600 720 V1000 H0 Z", "#E9A15B", 1)}
        {layer("M0 840 C 360 780, 700 900, 1100 820 S 1500 780, 1600 800 V1000 H0 Z", "#C8643B", 2)}
        {layer("M0 920 C 400 880, 800 960, 1200 900 S 1500 890, 1600 900 V1000 H0 Z", "#7A3B2A", 3)}
        <g transform="translate(980 160)">
          {layer("M0 0 H420 V300 H0 Z", "#FFFDF6", 4)}
          {layer("M30 40 H170 V260 H30 Z", "#2F5D50", 5)}
          {layer("M190 120 H290 V260 H190 Z", "#E9A15B", 6)}
          {layer("M310 180 H390 V260 H310 Z", "#C8643B", 7)}
        </g>
        <circle cx={860} cy={190} r={70} fill="#F2C94C" style={{ filter: "drop-shadow(0 8px 6px rgba(60,30,10,.25))" }} />
      </svg>
      <Eyebrow text={eyebrow} color="#7A3B2A" />
      <div style={{ position: "absolute", left: 96, top: 300, fontFamily: sat, fontWeight: 700, fontSize: 120, letterSpacing: "-0.04em", lineHeight: "112px", color: "#2B1A12", maxWidth: 760 }}>
        {title}
      </div>
    </AbsoluteFill>
  );
};

/* 7 — Holographic: iridescent foil card. */
const Holo: React.FC<P> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: "#0B0B12" }}>
    <div
      style={{
        position: "absolute",
        left: 860,
        top: 130,
        width: 560,
        height: 740,
        borderRadius: 48,
        transform: "rotate(8deg)",
        background:
          "linear-gradient(125deg, #FFB8F0 0%, #B8C8FF 22%, #A8FFE8 40%, #FFF6B0 58%, #FFB8D8 76%, #B8B0FF 100%)",
        boxShadow: "0 40px 120px rgba(160,140,255,.45)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(60deg, rgba(255,255,255,.35) 0 2px, transparent 2px 14px)" }} />
      <div style={{ position: "absolute", left: 48, bottom: 48, fontFamily: MONO, fontSize: 30, color: "#2A2440" }}>BRAND · 001</div>
      <div style={{ position: "absolute", left: 48, top: 48, width: 120, height: 90, borderRadius: 16, background: "linear-gradient(135deg,#E8E2C0,#B8A970)" }} />
    </div>
    <Eyebrow text={eyebrow} color="#B8C8FF" />
    <div style={{ position: "absolute", left: 96, bottom: 96, fontFamily: sat, fontWeight: 700, fontSize: 130, lineHeight: "120px", letterSpacing: "-0.04em", maxWidth: 720, background: "linear-gradient(90deg,#FFB8F0,#A8FFE8,#FFF6B0)", WebkitBackgroundClip: "text", color: "transparent" }}>
      {title}
    </div>
  </AbsoluteFill>
);

/* 8 — Isometric: a town of shops, one supermarket among stalls. */
const Iso: React.FC<P> = ({ title, eyebrow }) => {
  const box = (x: number, y: number, w: number, d: number, h: number, top: string, l: string, r: string, k: number) => {
    const c = 0.866;
    const p = (a: number, b: number, z: number) => `${x + (a - b) * c},${y + (a + b) * 0.5 - z}`;
    return (
      <g key={k}>
        <polygon points={[p(0, 0, h), p(w, 0, h), p(w, d, h), p(0, d, h)].join(" ")} fill={top} />
        <polygon points={[p(0, d, h), p(w, d, h), p(w, d, 0), p(0, d, 0)].join(" ")} fill={l} />
        <polygon points={[p(w, 0, h), p(w, d, h), p(w, d, 0), p(w, 0, 0)].join(" ")} fill={r} />
      </g>
    );
  };
  const stalls = [
    [0, 260], [70, 260], [140, 260], [210, 260], [0, 330], [70, 330], [140, 330], [210, 330],
  ];
  return (
    <AbsoluteFill style={{ background: "#EAF2EE" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {box(1100, 260, 220, 180, 160, "#FF7A59", "#D9573A", "#B8432C", 0)}
        {stalls.map(([a, b], i) =>
          box(1100 + (a - b) * 0.866 + 180, 260 + (a + b) * 0.5 + 40, 54, 54, 40 + (i % 3) * 14, "#7CC4A4", "#4E9C7C", "#3B7E63", i + 1),
        )}
      </svg>
      <Eyebrow text={eyebrow} color="#3B7E63" />
      <div style={{ position: "absolute", left: 96, bottom: 96, fontFamily: sat, fontWeight: 700, fontSize: 120, lineHeight: "112px", letterSpacing: "-0.04em", color: "#123326", maxWidth: 700 }}>
        {title}
      </div>
    </AbsoluteFill>
  );
};

/* 9 — ASCII art: a bar chart typed out in characters. */
const Ascii: React.FC<P> = ({ title, eyebrow }) => {
  const bars = [4, 6, 5, 14, 5, 6];
  const rows: string[] = [];
  for (let y = 15; y >= 1; y--) {
    let s = "";
    bars.forEach((b) => (s += (b >= y ? "███ " : "    ")));
    rows.push((y === 7 ? "-- " : "   ") + s + (y === 7 ? "-- mean" : ""));
  }
  rows.push("   " + "+---".repeat(6) + "+");
  return (
    <AbsoluteFill style={{ background: "#0A0F0A", color: "#5CFF7A", fontFamily: MONO }}>
      <pre style={{ position: "absolute", left: 820, top: 160, fontSize: 28, lineHeight: "32px", margin: 0, textShadow: "0 0 6px #5CFF7A" }}>
        {rows.join("\n")}
      </pre>
      <Eyebrow text={"> " + eyebrow} color="#5CFF7A" font={MONO} />
      <div style={{ position: "absolute", left: 96, bottom: 96, fontSize: 96, lineHeight: "104px", maxWidth: 680, textShadow: "0 0 10px #5CFF7A" }}>
        {title}
        <span style={{ background: "#5CFF7A", color: "#0A0F0A" }}>_</span>
      </div>
    </AbsoluteFill>
  );
};

/* 10 — Clay 3D: soft rounded loaves with clay shading. */
const Clay: React.FC<P> = ({ title, eyebrow }) => {
  const blob = (cx: number, cy: number, rx: number, ry: number, c: string, k: number) => (
    <g key={k}>
      <ellipse cx={cx} cy={cy + ry * 0.9} rx={rx * 0.9} ry={ry * 0.25} fill="rgba(80,50,30,.18)" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#clay${k})`} />
      <defs>
        <radialGradient id={`clay${k}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="0.25" stopColor={c} />
          <stop offset="1" stopColor={c} stopOpacity="0.75" />
        </radialGradient>
      </defs>
    </g>
  );
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 60% 30%, #FFE9D6, #F4C9A8)" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <rect x={880} y={560} width={600} height={60} rx={30} fill="#D99A6C" />
        {blob(980, 500, 110, 70, "#E8A15F", 1)}
        {blob(1180, 480, 130, 90, "#D9844A", 2)}
        {blob(1380, 505, 100, 65, "#F0B877", 3)}
        {blob(1180, 260, 70, 70, "#7DBF9A", 4)}
      </svg>
      <Eyebrow text={eyebrow} color="#8A4B28" />
      <div style={{ position: "absolute", left: 96, bottom: 96, fontFamily: sat, fontWeight: 700, fontSize: 120, lineHeight: "112px", letterSpacing: "-0.04em", color: "#4A2412", maxWidth: 720 }}>
        {title}
      </div>
    </AbsoluteFill>
  );
};

/* 11 — Retro VHS: scanlines, chroma split, timecode. */
const Vhs: React.FC<P> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#2B1640 0%, #C2426B 60%, #F7A35C 100%)" }}>
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <circle cx={1180} cy={560} r={260} fill="#FFD36E" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={900} y={560 + i * 30} width={560} height={6 + i * 2} fill="#C2426B" />
      ))}
    </svg>
    <div style={{ position: "absolute", left: 96, bottom: 110, fontFamily: BLACK, fontSize: 150, lineHeight: "140px", color: "#FFF4E0", textShadow: "-6px 0 #00E5FF, 6px 0 #FF2E63", maxWidth: 820 }}>
      {title.toUpperCase()}
    </div>
    <div style={{ position: "absolute", right: 96, top: 84, fontFamily: MONO, fontSize: 40, color: "#FFFFFF" }}>PLAY ▶ 00:04:12</div>
    <Eyebrow text={eyebrow.toUpperCase()} color="#FFFFFF" font={MONO} />
    <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 5px)" }} />
  </AbsoluteFill>
);

/* 12 — Comic book: halftone, speech bubble, burst. */
const Comic: React.FC<P> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: "#FFE14D" }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(#F05A28 22%, transparent 24%)", backgroundSize: "28px 28px", opacity: 0.55 }} />
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <polygon
        points={Array.from({ length: 28 }, (_, i) => {
          const a = (i / 28) * Math.PI * 2;
          const r = i % 2 ? 210 : 320;
          return `${1180 + Math.cos(a) * r},${430 + Math.sin(a) * r}`;
        }).join(" ")}
        fill="#FFFFFF"
        stroke="#111"
        strokeWidth={8}
      />
      <text x={1180} y={460} textAnchor="middle" fontFamily={BLACK} fontSize={96} fill="#E8262B" stroke="#111" strokeWidth={4}>
        WHO?!
      </text>
    </svg>
    <div style={{ position: "absolute", left: 80, bottom: 80, padding: "36px 48px", background: "#FFFFFF", border: "8px solid #111", borderRadius: 28, boxShadow: "14px 14px 0 #111", maxWidth: 760 }}>
      <div style={{ fontFamily: BLACK, fontSize: 104, lineHeight: "104px", color: "#111", textTransform: "uppercase" }}>{title}</div>
    </div>
    <Eyebrow text={eyebrow.toUpperCase()} color="#111" font={BLACK} style={{ fontSize: 28 }} />
  </AbsoluteFill>
);

/* 13 — Split-flap: an airport board quoting ZMW. */
const Flap: React.FC<P> = ({ title, eyebrow }) => {
  const row = (s: string, y: number, c = "#F4F1E8") => (
    <div style={{ position: "absolute", left: 96, top: y, display: "flex", gap: 8 }}>
      {s.split("").map((ch, i) => (
        <div key={i} style={{ width: 76, height: 110, borderRadius: 8, background: "#1C1C1C", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BAHN, fontWeight: 700, fontSize: 80, color: c, boxShadow: "inset 0 -2px 0 #000" }}>
          {ch === " " ? "" : ch}
          <div style={{ position: "absolute", left: 0, right: 0, top: 54, height: 3, background: "#000" }} />
        </div>
      ))}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#0B0B0B" }}>
      <Eyebrow text={eyebrow.toUpperCase()} color="#F5B800" font={BAHN} />
      {row("USD  ZMW 26.40", 220)}
      {row("GBP  ZMW 34.95", 350)}
      {row("ZAR  ZMW  1.45", 480, "#F5B800")}
      <div style={{ position: "absolute", left: 96, bottom: 96, fontFamily: BAHN, fontWeight: 700, fontSize: 120, color: "#F4F1E8", letterSpacing: "-0.02em" }}>{title}</div>
    </AbsoluteFill>
  );
};

/* 14 — Hand-drawn: marker on notebook paper. */
const Hand: React.FC<P> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: "#FBFAF5" }}>
    <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 47px, #CFE0F2 47px 49px)" }} />
    <div style={{ position: "absolute", left: 150, top: 0, bottom: 0, width: 3, background: "#F2A7A7" }} />
    <svg width={W} height={H} style={{ position: "absolute" }} fill="none" stroke="#1F3B8A" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M940 300 q 70 -30 140 -2 q 60 30 2 80 q -70 40 -140 0 q -50 -40 -2 -78" />
      <text x={968} y={360} fontFamily={serif} fontStyle="italic" fontSize={56} fill="#1F3B8A" stroke="none">study</text>
      <path d="M1250 300 q 70 -30 140 -2 q 60 30 2 80 q -70 40 -140 0 q -50 -40 -2 -78" />
      <text x={1268} y={360} fontFamily={serif} fontStyle="italic" fontSize={56} fill="#1F3B8A" stroke="none">work</text>
      <path d="M1130 340 h90 m-20 -18 l20 18 l-20 18" />
      <path d="M1290 420 q 10 120 -90 180" stroke="#E0442B" />
      <text x={1000} y={660} fontFamily={serif} fontStyle="italic" fontSize={60} fill="#E0442B" stroke="none">ZMW 3,500 a month</text>
    </svg>
    <Eyebrow text={eyebrow} color="#1F3B8A" font={serif} style={{ fontStyle: "italic", fontSize: 40, left: 190 }} />
    <div style={{ position: "absolute", left: 190, bottom: 120, fontFamily: serif, fontStyle: "italic", fontSize: 150, lineHeight: "140px", color: "#1F3B8A", maxWidth: 720 }}>{title}</div>
  </AbsoluteFill>
);

/* 15 — Blueprint: technical drawing of a project's cash flows. */
const Blueprint: React.FC<P> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: "#1B4F9C" }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    <svg width={W} height={H} style={{ position: "absolute" }} stroke="#DDEBFF" fill="none" strokeWidth={3}>
      <path d="M860 520 H1500" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <path d={i === 0 ? `M${900 + i * 110} 520 V700` : `M${900 + i * 110} 520 V${520 - 60 - i * 22}`} strokeWidth={i === 0 ? 6 : 4} />
          <text x={900 + i * 110 - 14} y={760} fill="#DDEBFF" stroke="none" fontFamily={MONO} fontSize={26}>t{i}</text>
        </g>
      ))}
      <path d="M860 420 H880 M860 420 V620" strokeDasharray="8 8" />
      <circle cx={900} cy={700} r={10} fill="#DDEBFF" />
      <text x={930} y={712} fill="#DDEBFF" stroke="none" fontFamily={MONO} fontSize={26}>-ZMW 400k</text>
      <rect x={1240} y={180} width={260} height={110} />
      <text x={1260} y={225} fill="#DDEBFF" stroke="none" fontFamily={MONO} fontSize={22}>NPV @ 12%</text>
      <text x={1260} y={268} fill="#FFFFFF" stroke="none" fontFamily={MONO} fontSize={34}>+ZMW 86,200</text>
    </svg>
    <Eyebrow text={"DWG 15 / " + eyebrow.toUpperCase()} color="#DDEBFF" font={MONO} style={{ fontSize: 26 }} />
    <div style={{ position: "absolute", left: 96, bottom: 96, fontFamily: MONO, fontSize: 96, lineHeight: "104px", color: "#FFFFFF", maxWidth: 700 }}>{title}</div>
  </AbsoluteFill>
);

/* 16 — Physics: price tags falling and piling, one bouncing. */
const Physics: React.FC<P> = ({ title, eyebrow }) => {
  const items = [
    [920, 760, -12, "#FF5A5F"], [1060, 770, 6, "#2EC4B6"], [1200, 762, -4, "#FFBF00"], [1340, 768, 14, "#3D5AFE"],
    [990, 650, 22, "#FFBF00"], [1130, 655, -8, "#FF5A5F"], [1270, 650, 4, "#2EC4B6"], [1060, 540, -18, "#3D5AFE"], [1200, 545, 10, "#FF5A5F"],
  ] as const;
  return (
    <AbsoluteFill style={{ background: "#F3F1FF" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <rect x={820} y={830} width={680} height={14} rx={7} fill="#1B1B3A" />
        {items.map(([x, y, a, c], i) => (
          <rect key={i} x={x - 60} y={y - 50} width={120} height={100} rx={22} fill={c} transform={`rotate(${a} ${x} ${y})`} />
        ))}
        <circle cx={1440} cy={260} r={60} fill="#1B1B3A" />
        <path d="M1440 340 v40 M1440 400 v20" stroke="#1B1B3A" strokeWidth={6} strokeLinecap="round" opacity={0.4} />
        <ellipse cx={1440} cy={826} rx={50} ry={8} fill="#1B1B3A" opacity={0.25} />
      </svg>
      <Eyebrow text={eyebrow} color="#3D5AFE" />
      <div style={{ position: "absolute", left: 96, top: 200, fontFamily: sat, fontWeight: 700, fontSize: 130, lineHeight: "120px", letterSpacing: "-0.04em", color: "#1B1B3A", maxWidth: 660 }}>{title}</div>
    </AbsoluteFill>
  );
};

/* 17 — Pixel art: a savings jar filling, 8-bit. */
const Pixel: React.FC<P> = ({ title, eyebrow }) => {
  const S = 24;
  const jar = [
    "....XXXXXXXX....",
    "....X......X....",
    "...XX......XX...",
    "..X..........X..",
    ".X............X.",
    ".X............X.",
    ".X.CCCCCCCCCC.X.",
    ".X.CCCCCCCCCC.X.",
    ".X.CCCCCCCCCC.X.",
    ".X.CCCCCCCCCC.X.",
    ".X.CCCCCCCCCC.X.",
    "..X.CCCCCCCC.X..",
    "...XXXXXXXXXX...",
  ];
  const coin = ["..YYYY..", ".Y####Y.", "Y##YY##Y", "Y#Y##Y#Y", "Y##YY##Y", ".Y####Y.", "..YYYY.."];
  const draw = (m: string[], ox: number, oy: number, map: Record<string, string>) =>
    m.flatMap((r, y) => r.split("").map((ch, x) => (map[ch] ? <rect key={`${ox}-${x}-${y}`} x={ox + x * S} y={oy + y * S} width={S} height={S} fill={map[ch]} /> : null)));
  return (
    <AbsoluteFill style={{ background: "#1A1C2C" }}>
      <svg width={W} height={H} style={{ position: "absolute" }} shapeRendering="crispEdges">
        {draw(jar, 1000, 380, { X: "#F4F4F4", C: "#38B764" })}
        {draw(coin, 1110, 140, { Y: "#FFCD75", "#": "#EF7D57" })}
        {draw(coin, 1290, 240, { Y: "#FFCD75", "#": "#EF7D57" })}
      </svg>
      <Eyebrow text={eyebrow.toUpperCase()} color="#73EFF7" font={MONO} />
      <div style={{ position: "absolute", left: 96, bottom: 96, fontFamily: MONO, fontWeight: 700, fontSize: 100, lineHeight: "108px", color: "#FFCD75", textShadow: "6px 6px 0 #B13E53", maxWidth: 760 }}>{title.toUpperCase()}</div>
    </AbsoluteFill>
  );
};

/* 18 — Bauhaus: primary shapes as a portfolio split. */
const Bauhaus: React.FC<P> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: "#EFE8D8" }}>
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <rect x={840} y={120} width={360} height={360} fill="#1D4E9E" />
      <path d="M1200 120 A 360 360 0 0 1 1560 480 H1200 Z" fill="#E63B2E" />
      <circle cx={1020} cy={660} r={180} fill="#F2B705" />
      <polygon points="1200,840 1380,480 1560,840" fill="#111111" />
    </svg>
    <Eyebrow text={eyebrow.toUpperCase()} color="#111" font={BAHN} />
    <div style={{ position: "absolute", left: 96, bottom: 96, fontFamily: BAHN, fontWeight: 700, fontSize: 130, lineHeight: "120px", color: "#111", maxWidth: 640, textTransform: "lowercase" }}>{title}</div>
  </AbsoluteFill>
);

/* 19 — Art deco: gold fan and symmetric frame. */
const Deco: React.FC<P> = ({ title, eyebrow }) => (
  <AbsoluteFill style={{ background: "#0E1A17" }}>
    <svg width={W} height={H} style={{ position: "absolute" }} stroke="#D4AF6A" fill="none">
      <rect x={40} y={40} width={1520} height={920} strokeWidth={3} />
      <rect x={60} y={60} width={1480} height={880} strokeWidth={1} />
      {Array.from({ length: 13 }).map((_, i) => {
        const a = Math.PI + (i / 12) * Math.PI;
        return <path key={i} d={`M800 560 L${800 + Math.cos(a) * 420} ${560 + Math.sin(a) * 420}`} strokeWidth={2} />;
      })}
      {[420, 340, 260].map((r) => (
        <path key={r} d={`M${800 - r} 560 A ${r} ${r} 0 0 1 ${800 + r} 560`} strokeWidth={3} />
      ))}
      <path d="M380 560 H1220" strokeWidth={3} />
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontFamily: serif, fontSize: 150, letterSpacing: "0.12em", color: "#E9CF96", textTransform: "uppercase" }}>{title}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", fontFamily: sat, fontWeight: 500, fontSize: 28, letterSpacing: "0.5em", color: "#D4AF6A", textTransform: "uppercase" }}>{eyebrow}</div>
  </AbsoluteFill>
);

/* 20 — Neo-brutalism: hard shadows, thick borders, loud tag. */
const Brutal: React.FC<P> = ({ title, eyebrow }) => {
  const box: React.CSSProperties = { position: "absolute", border: "8px solid #111", boxShadow: "16px 16px 0 #111" };
  return (
    <AbsoluteFill style={{ background: "#FF9FE6" }}>
      <div style={{ ...box, left: 80, top: 160, width: 820, padding: "40px 48px", background: "#FFFFFF" }}>
        <div style={{ fontFamily: BLACK, fontSize: 112, lineHeight: "112px", color: "#111", textTransform: "uppercase" }}>{title}</div>
        <div style={{ height: 20, width: 520, background: "#111", marginTop: 28 }} />
      </div>
      <div style={{ ...box, left: 1000, top: 160, width: 500, height: 300, background: "#4CC9F0", display: "flex", flexDirection: "column", justifyContent: "center", padding: 40 }}>
        <div style={{ fontFamily: BLACK, fontSize: 92, lineHeight: "100px", color: "#111", whiteSpace: "nowrap" }}>ZMW 25</div>
        <div style={{ fontFamily: BLACK, fontSize: 34, color: "#111" }}>ONE LOAF</div>
      </div>
      <div style={{ ...box, left: 1000, top: 540, width: 220, height: 220, background: "#FFD23F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BLACK, fontSize: 140 }}>★</div>
      <div style={{ ...box, left: 80, top: 640, padding: "18px 36px", background: "#FFD23F", fontFamily: BLACK, fontSize: 48, color: "#111" }}>PRICED ✓</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: "#111", color: "#FFD23F", fontFamily: BLACK, fontSize: 40, display: "flex", alignItems: "center", paddingLeft: 40, whiteSpace: "nowrap", overflow: "hidden" }}>
        {(eyebrow.toUpperCase() + "  ✦  ").repeat(6)}
      </div>
    </AbsoluteFill>
  );
};

export const STYLES = {
  particles: Particles,
  liquid: Liquid,
  neon: Neon,
  chrome: Chrome,
  kinetic: Kinetic,
  cutout: Cutout,
  holo: Holo,
  iso: Iso,
  ascii: Ascii,
  clay: Clay,
  vhs: Vhs,
  comic: Comic,
  flap: Flap,
  hand: Hand,
  blueprint: Blueprint,
  physics: Physics,
  pixel: Pixel,
  bauhaus: Bauhaus,
  deco: Deco,
  brutal: Brutal,
} as const;

export type StyleId = keyof typeof STYLES;

/* The test set: one lesson per style, across the five sample courses. */
export const STYLE_COVERS: Record<StyleId, P & { label: string }> = {
  particles: { label: "Particles", title: "Where the cash goes", eyebrow: "treasury · lesson 2" },
  liquid: { label: "Liquid morph", title: "Liquidity", eyebrow: "treasury · lesson 3" },
  neon: { label: "Neon glow", title: "Break-even", eyebrow: "budgets · lesson 3" },
  chrome: { label: "Y2K chrome", title: "Interest", eyebrow: "finance · lesson 1" },
  kinetic: { label: "Kinetic type", title: "Supply and demand", eyebrow: "microeconomics · lesson 1" },
  cutout: { label: "Paper cutout", title: "What a budget is for", eyebrow: "budgets · lesson 1" },
  holo: { label: "Holographic", title: "What a brand is worth", eyebrow: "marketing · lesson 3" },
  iso: { label: "Isometric", title: "Market structures", eyebrow: "microeconomics · lesson 3" },
  ascii: { label: "ASCII art", title: "Averages that lie", eyebrow: "statistics · lesson 1" },
  clay: { label: "Clay 3D", title: "Fixed and variable costs", eyebrow: "budgets · lesson 2" },
  vhs: { label: "Retro VHS", title: "Inflation", eyebrow: "macroeconomics · lesson 1" },
  comic: { label: "Comic book", title: "Know your customer", eyebrow: "marketing · lesson 1" },
  flap: { label: "Split-flap", title: "Exchange rates", eyebrow: "finance · lesson 4" },
  hand: { label: "Hand-drawn", title: "Opportunity cost", eyebrow: "microeconomics · lesson 4" },
  blueprint: { label: "Blueprint", title: "Capital budgeting", eyebrow: "corporate finance · lesson 5" },
  physics: { label: "Physics", title: "Price elasticity", eyebrow: "microeconomics · lesson 2" },
  pixel: { label: "Pixel art", title: "Saving up", eyebrow: "budgets · lesson 4" },
  bauhaus: { label: "Bauhaus", title: "Portfolio mix", eyebrow: "finance · lesson 6" },
  deco: { label: "Art deco", title: "Present value", eyebrow: "finance · lesson 2" },
  brutal: { label: "Neo-brutalism", title: "Setting a price", eyebrow: "marketing · lesson 2" },
};

export const StyleCover: React.FC<{ look: StyleId }> = ({ look }) => {
  const C = STYLES[look];
  const { title, eyebrow } = STYLE_COVERS[look];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <C title={title} eyebrow={eyebrow} />
    </AbsoluteFill>
  );
};
