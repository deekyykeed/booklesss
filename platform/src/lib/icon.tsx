import { getIconData, iconToSVG, replaceIDs } from "@iconify/utils";
import solarIcons from "@iconify-json/solar/icons.json";
import type { CSSProperties } from "react";

/*
 * Solar (by 480 Design) — the same icon family Streamline serves.
 * Icons are resolved from the local set and inlined as SVG entirely on the
 * server: zero client JS, zero network requests, perfectly tree-shaken.
 *
 * Use "-linear" for Solar Line and "-bold" for Solar Bold, e.g.
 *   <Icon name="magnifer-linear" />
 *   <Icon name="book-2-bold" />
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const solar = solarIcons as any;

type IconProps = {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
};

export function Icon({ name, size = 20, className, style, strokeWidth }: IconProps) {
  const data = getIconData(solar, name);
  if (!data) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Icon] Unknown Solar icon: "${name}"`);
    }
    return null;
  }

  const rendered = iconToSVG(data, { height: size, width: size });
  const body = strokeWidth
    ? rendered.body.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`)
    : rendered.body;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...rendered.attributes}
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: replaceIDs(body) }}
    />
  );
}
