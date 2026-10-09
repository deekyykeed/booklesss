import React from "react";

/* Pixel objects — drawn here as character grids, one char per pixel.
 *
 * The launch-film grammar uses pixel objects for "the stuff of your life"; for
 * a finance explainer that stuff is money, time and the institutions that
 * price them. Original drawings, so nothing is licensed. To add one: draw a
 * grid, give each character a colour, done. `.` is transparent. Rows shorter
 * than the widest are padded, so a sloppy row costs a pixel, not a crash. */

type Art = { rows: string[]; pal: Record<string, string> };

const OUT = "#1E1A16";

export const ICONS: Record<string, Art> = {
  coin: {
    pal: { o: "#3B2600", y: "#F2C230", Y: "#FFF0A0", d: "#C08A10", k: "#6B4300" },
    rows: [
      ".....oooooo.....",
      "...ooyyyyyyoo...",
      "..oyYYyyyyyyyo..",
      ".oyYyyyyyyyyydo.",
      ".oYyykkyyykkydo.",
      "oyYyykkyykkyyydo",
      "oyYyykkykkyyyydo",
      "oyyyykkkkyyyyydo",
      "oyyyykkkkyyyyydo",
      "oyyyykkykkyyyydo",
      "oyyyykkyykkyyydo",
      ".oyyykkyyykkydo.",
      ".oyyyyyyyyyyddo.",
      "..oyyyyyyyyddo..",
      "...ooddddddoo...",
      ".....oooooo.....",
    ],
  },
  note: {
    pal: { o: "#1D3B1A", G: "#3F8A35", g: "#62B04F", l: "#A8DD8C", w: "#E4F3D6", k: "#1D3B1A" },
    rows: [
      "oooooooooooooooooooooo",
      "oGGGGGGGGGGGGGGGGGGGGo",
      "oGllgggggwwwwgggggllGo",
      "oGlgggggwwwwwwgggggglGo".slice(0, 22),
      "oGgggggwwkkwwwwggggggGo".slice(0, 22),
      "oGgkkggwwkwkwwwggkkggGo".slice(0, 22),
      "oGgkkggwwkkwwwwggkkggGo".slice(0, 22),
      "oGgggggwwkwkwwwggggggGo".slice(0, 22),
      "oGlgggggwwwwwwgggggglGo".slice(0, 22),
      "oGllgggggwwwwgggggllGo",
      "oGGGGGGGGGGGGGGGGGGGGo",
      "oooooooooooooooooooooo",
    ],
  },
  calculator: {
    pal: { o: OUT, d: "#3A3A40", s: "#B9E3A8", K: "#22401C", w: "#ECEAE4", r: "#D7261E" },
    rows: [
      "oooooooooooo",
      "oddddddddddo",
      "odssssssssdo",
      "odsKKsKKsKdo",
      "odssssssssdo",
      "oddddddddddo",
      "odwwdwwdrrdo",
      "odwwdwwdrrdo",
      "oddddddddddo",
      "odwwdwwdwwdo",
      "odwwdwwdwwdo",
      "oddddddddddo",
      "odwwdwwdwwdo",
      "odwwdwwdwwdo",
      "oddddddddddo",
      "oooooooooooo",
    ],
  },
  hourglass: {
    pal: { o: OUT, b: "#8A5A2B", B: "#B57A3C", c: "#DDEFF7", s: "#F2C230" },
    rows: [
      "oooooooooooo",
      "oBBBBBBBBBBo",
      "oooooooooooo",
      ".occccccccco",
      ".ocssssssco.",
      "..ocssssco..",
      "...ocsscо...".replace("о", "o"),
      "....occo....",
      "....ocso....",
      "...occsco...",
      "..occcssco..",
      ".occcsssscо.".replace("о", "o"),
      ".ocsssssssco",
      "oooooooooooo",
      "obbbbbbbbbbo",
      "oooooooooooo",
    ],
  },
  bank: {
    pal: { o: OUT, w: "#EFE9DC", g: "#C9C1AD", r: "#D7261E" },
    rows: [
      ".......oo.......",
      ".....oowwoo.....",
      "...oowwrrwwoo...",
      ".oowwwwwwwwwwoo.",
      "oooooooooooooooo",
      "owwwwwwwwwwwwwwo",
      "oooooooooooooooo",
      ".owg.owg.owg.owg",
      ".owg.owg.owg.owg",
      ".owg.owg.owg.owg",
      ".owg.owg.owg.owg",
      ".owg.owg.owg.owg",
      "oooooooooooooooo",
      "owwwwwwwwwwwwwwo",
      "oooooooooooooooo",
    ],
  },
  chart: {
    pal: { o: OUT, w: "#F6F4EE", b: "#2A2826", r: "#D7261E", l: "#CFCAC0" },
    rows: [
      "oooooooooooooooo",
      "owwwwwwwwwwwwwwo",
      "owwwwwwwwwwrrrwo",
      "owwwwwwwwwwwrrwo",
      "owwwwwwwwwwrwrwo",
      "owwwwwwwwwrwwwwo",
      "owwwwwwwbrwwbbwo",
      "owwwwwwrbwwwbbwo",
      "owwwbbrwbwbbbbwo",
      "owwrbbwwbwbbbbwo",
      "owbbbbwwbwbbbbwo",
      "owbbbbwbbwbbbbwo",
      "owlllllllllllllo",
      "oooooooooooooooo",
    ],
  },
  bond: {
    pal: { o: OUT, p: "#F3EAD2", l: "#B9A985", r: "#D7261E", R: "#9E1712" },
    rows: [
      "oooooooooooooooo",
      "oppppppppppppppo",
      "opllllllllllllpo",
      "oppppppppppppppo",
      "opllllllllpppppo",
      "oppppppppppppppo",
      "opllllllppppppo",
      "oppppppppprrrrpo",
      "oplllllppprRRrpo",
      "oppppppppprRRrpo",
      "oppppppppprrrrpo",
      "oppppppppppRpRpo",
      "oooooooooooooooo",
    ],
  },
};

export const Pixel: React.FC<{
  name: string;
  px: number;
  style?: React.CSSProperties;
}> = ({ name, px, style }) => {
  const art = ICONS[name];
  if (!art) throw new Error(`No pixel icon "${name}"`);
  const w = Math.max(...art.rows.map((r) => r.length));
  const h = art.rows.length;
  const rects: React.ReactNode[] = [];
  art.rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = art.pal[row[x]];
      if (c) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={c} />);
    }
  });
  return (
    <svg width={w * px} height={h * px} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" style={style}>
      {rects}
    </svg>
  );
};

export const pixelSize = (name: string) => {
  const art = ICONS[name];
  return { w: Math.max(...art.rows.map((r) => r.length)), h: art.rows.length };
};
