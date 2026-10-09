import React from "react";
import { ICONS } from "./pixel-art";

export { ICONS };

/* Pixel objects — drawn here as character grids, one char per pixel.
 *
 * The launch-film grammar uses pixel objects for "the stuff of your life"; for
 * a finance explainer that stuff is money, time and the institutions that
 * price them. Original drawings, so nothing is licensed. To add one: draw a
 * grid, give each character a colour, done. `.` is transparent. Rows shorter
 * than the widest are padded, so a sloppy row costs a pixel, not a crash. */


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
