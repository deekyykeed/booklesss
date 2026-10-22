"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import type { Course } from "./_types";

/* What every card set shares: the courses, the save control, the verified
   badge, the stat marks and two formatters. A set imports from here and from
   nowhere else in the app, so the page stays a self-contained scratch route. */

/* ── saving ──────────────────────────────────────────────────── */

export const SavedContext = createContext<{ saved: Set<string>; toggle: (slug: string) => void }>({
  saved: new Set(),
  toggle: () => {},
});

export function useSaved(slug: string): [boolean, () => void] {
  const { saved, toggle } = useContext(SavedContext);
  return [saved.has(slug), () => toggle(slug)];
}

/** The bookmark on a card. It really saves: the page keeps the set in
 *  localStorage and "Saved only" in the filters reads it back. The set only
 *  styles it (size, colour, background) through className/style; the icon
 *  follows `color` and swaps to the filled mark when saved. */
export function SaveButton({
  course,
  className,
  style,
  size = 20,
  children,
}: {
  course: Course;
  className?: string;
  style?: CSSProperties;
  size?: number;
  /** optional text beside the mark, e.g. "Save" / "Saved" */
  children?: (saved: boolean) => ReactNode;
}) {
  const [saved, toggle] = useSaved(course.slug);
  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${course.title} from saved` : `Save ${course.title}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
    >
      <Bookmark filled={saved} size={size} />
      {children?.(saved)}
    </button>
  );
}

/* ── marks (Solar, 480 Design, CC BY 4.0) ───────────────────── */

type IconProps = { size?: number; className?: string; style?: CSSProperties };
const svg = (p: IconProps, body: string) => (
  <svg viewBox="0 0 24 24" width={p.size ?? 20} height={p.size ?? 20} className={p.className} style={{ display: "block", flexShrink: 0, ...p.style }} aria-hidden dangerouslySetInnerHTML={{ __html: body }} />
);

export const Bookmark = ({ filled, ...p }: IconProps & { filled?: boolean }) =>
  svg(
    p,
    filled
      ? '<path fill="currentColor" fill-rule="evenodd" d="M21 11.098v4.993c0 3.096 0 4.645-.734 5.321c-.35.323-.792.526-1.263.58c-.987.113-2.14-.907-4.445-2.946c-1.02-.901-1.529-1.352-2.118-1.47a2.2 2.2 0 0 0-.88 0c-.59.118-1.099.569-2.118 1.47c-2.305 2.039-3.458 3.059-4.445 2.945a2.24 2.24 0 0 1-1.263-.579C3 20.736 3 19.188 3 16.091v-4.994C3 6.81 3 4.666 4.318 3.333S7.758 2 12 2s6.364 0 7.682 1.332S21 6.81 21 11.098M8.25 6A.75.75 0 0 1 9 5.25h6a.75.75 0 0 1 0 1.5H9A.75.75 0 0 1 8.25 6" clip-rule="evenodd"/>'
      : '<g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16.09v-4.992c0-4.29 0-6.433-1.318-7.766C18.364 2 16.242 2 12 2S5.636 2 4.318 3.332S3 6.81 3 11.098v4.993c0 3.096 0 4.645.734 5.321c.35.323.792.526 1.263.58c.987.113 2.14-.907 4.445-2.946c1.02-.901 1.529-1.352 2.118-1.47c.29-.06.59-.06.88 0c.59.118 1.099.569 2.118 1.47c2.305 2.039 3.458 3.059 4.445 2.945c.47-.053.913-.256 1.263-.579c.734-.676.734-2.224.734-5.321Z"/><path stroke-linecap="round" d="M15 6H9"/></g>',
  );

export const Star = (p: IconProps) =>
  svg(p, '<path fill="currentColor" d="M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z"/>');

export const Play = (p: IconProps) =>
  svg(p, '<path fill="currentColor" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z"/>');

export const Clock = (p: IconProps) =>
  svg(p, '<path fill="currentColor" fill-rule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10M12 7.25a.75.75 0 0 1 .75.75v3.69l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V8a.75.75 0 0 1 .75-.75" clip-rule="evenodd"/>');

export const Tuning = (p: IconProps) =>
  svg(p, '<g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.5 14a3 3 0 1 1 0 6a3 3 0 0 1 0-6Zm5-10a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"/><path stroke-linecap="round" d="M15 16.959h7m-13-10H2m0 10h2m18-10h-2"/></g>');

export const ArrowRight = (p: IconProps) =>
  svg(p, '<path d="M18.5 12L4.99997 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>');

export const Search = (p: IconProps) =>
  svg(p, '<path d="M17 17L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-width="1.5" fill="none"/>');

export const Close = (p: IconProps) =>
  svg(p, '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>');

/** The blue verified badge (owner: "a blue checkmark to show verified creator
 *  on the bottom right of the profile pic"). `ring` is the colour of the
 *  surface it sits on, drawn as a border so the badge reads as cut out. */
export function Verified({ size = 18, ring, className, style }: { size?: number; ring?: string; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={className}
      aria-label="Verified creator"
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: ring ? `0 0 0 2px ${ring}` : undefined,
        flexShrink: 0,
        ...style,
      }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: "block" }} aria-hidden>
        <path
          fill="#1D9BF0"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.592 3.2a6 6 0 0 1-.495.399c-.298.2-.633.338-.985.408c-.153.03-.313.043-.632.068c-.801.064-1.202.096-1.536.214a2.71 2.71 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a6 6 0 0 1-.068.632c-.07.352-.208.687-.408.985c-.087.13-.191.252-.399.495c-.521.612-.782.918-.935 1.238c-.353.74-.353 1.6 0 2.34c.153.32.414.626.935 1.238c.208.243.312.365.399.495c.2.298.338.633.408.985c.03.153.043.313.068.632c.064.801.096 1.202.214 1.536a2.71 2.71 0 0 0 1.655 1.655c.334.118.735.15 1.536.214c.319.025.479.038.632.068c.352.07.687.209.985.408c.13.087.252.191.495.399c.612.521.918.782 1.238.935c.74.353 1.6.353 2.34 0c.32-.153.626-.414 1.238-.935c.243-.208.365-.312.495-.399c.298-.2.633-.338.985-.408c.153-.03.313-.043.632-.068c.801-.064 1.202-.096 1.536-.214a2.71 2.71 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536c.025-.319.038-.479.068-.632c.07-.352.209-.687.408-.985c.087-.13.191-.252.399-.495c.521-.612.782-.918.935-1.238c.353-.74.353-1.6 0-2.34c-.153-.32-.414-.626-.935-1.238a6 6 0 0 1-.399-.495a2.7 2.7 0 0 1-.408-.985a6 6 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.71 2.71 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a6 6 0 0 1-.632-.068a2.7 2.7 0 0 1-.985-.408a6 6 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.71 2.71 0 0 0-2.34 0c-.32.153-.626.414-1.238.935m6.781 6.663a.814.814 0 0 0-1.15-1.15l-4.85 4.85l-1.596-1.595a.814.814 0 0 0-1.15 1.15l2.17 2.17a.814.814 0 0 0 1.15 0z"
        />
      </svg>
    </span>
  );
}

/** A creator's picture: their portrait, falling back to the Kameleon badge
 *  if the file is missing. `size` is only the intrinsic hint; the set sizes
 *  it in CSS. */
export function Avatar({ course, size = 56, className, style }: { course: Course; size?: number; className?: string; style?: CSSProperties }) {
  return (
    <img
      src={course.creator.photo}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ display: "block", borderRadius: "50%", objectFit: "cover", ...style }}
      onError={(e) => {
        const img = e.currentTarget;
        if (!img.src.endsWith(".svg")) img.src = `/avatars/${course.creator.avatar}.svg`;
      }}
    />
  );
}

/* ── formatters ─────────────────────────────────────────────── */

export const fmtTime = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
export const fmtUpdated = (d: number) => (d < 7 ? `${d}d ago` : d < 30 ? `${Math.round(d / 7)}w ago` : `${Math.round(d / 30)}mo ago`);

/* ── the courses (placeholder creators, counts and ratings) ───── */

const c = (
  slug: string,
  title: string,
  subject: Course["subject"],
  blurb: string,
  name: string,
  avatar: string,
  videos: number,
  minutes: number,
  rating: number,
  updatedDays: number,
  level: Course["level"],
  tone: [string, string],
  verified = true,
): Course => ({
  slug,
  title,
  subject,
  blurb,
  creator: { name, handle: "@" + name.split(" ")[0].toLowerCase(), avatar, photo: `/preview/market/people/${slug}.webp`, verified },
  cover: `/preview/market/covers/${slug}.webp`,
  videos,
  minutes,
  rating,
  updatedDays,
  level,
  tone,
});

const RAW: Course[] = [
  c("corporate-finance", "Corporate Finance", "Finance", "Valuation, capital and risk, and how a firm decides.", "Mwila Banda", "money-graph", 45, 380, 4.9, 2, "Intermediate", ["#F4A63A", "#1F3A2B"]),
  c("treasury-management", "Treasury Management", "Finance", "Cash, funding and risk: keeping a firm liquid.", "Chanda Phiri", "bank", 52, 425, 4.8, 5, "Advanced", ["#E8D84A", "#2B2F3A"]),
  c("financial-accounting", "Financial Accounting", "Finance", "Records and statements, from the first entry.", "Natasha Zulu", "clipboard-2", 27, 190, 4.7, 4, "Beginner", ["#7FB3E8", "#1C3456"]),
  c("management-accounting", "Management Accounting", "Finance", "Costing, budgets and control.", "Kondwani Mwale", "chart-pie", 24, 170, 4.6, 7, "Intermediate", ["#F06A5A", "#2E2A2A"], false),
  c("business-finance", "Business Finance", "Finance", "The money decisions inside a firm.", "Towela Nyirenda", "wallet", 18, 125, 4.8, 14, "Beginner", ["#5FC9A8", "#183A35"]),
  c("taxation", "Taxation", "Finance", "How tax is worked out, for people and firms.", "Bupe Kasonde", "bank-check", 22, 160, 4.5, 3, "Intermediate", ["#B9A2E8", "#2A2340"]),

  c("strategic-management", "Strategic Management", "Business", "How firms compete, and how they win.", "Mulenga Chileshe", "dartboard", 38, 290, 4.9, 7, "Advanced", ["#F9A825", "#5E1A12"]),
  c("business-administration", "Business Administration", "Business", "How organisations are run.", "Thandiwe Sakala", "briefcase", 31, 220, 4.6, 14, "Beginner", ["#B7A3E6", "#3E2541"]),
  c("marketing", "Marketing", "Business", "Winning buyers, and keeping them.", "Luyando Hamoonga", "bullhorn", 26, 185, 4.8, 4, "Beginner", ["#8ED8C3", "#8A3B33"]),
  c("human-resource-management", "Human Resource Management", "Business", "People at work: hiring, pay and performance.", "Mutale Kapwepwe", "headset-2", 20, 150, 4.7, 6, "Intermediate", ["#8EC5FF", "#323B4A"], false),
  c("business-law", "Business Law", "Business", "Contracts, companies and what the law expects.", "Chipo Tembo", "scale-weight", 19, 135, 4.6, 7, "Intermediate", ["#E8432C", "#1C3022"]),
  c("operations-management", "Operations Management", "Business", "Making and delivering, on time.", "Mapalo Lungu", "box-open", 23, 175, 4.7, 5, "Intermediate", ["#5FC9A8", "#8A7448"]),

  c("principles-of-economics", "Principles of Economics", "Economics", "Markets, prices and policy, from the start.", "Nchimunya Moono", "education-globe", 64, 495, 4.9, 3, "Beginner", ["#F96A1F", "#3F5630"]),
  c("microeconomics", "Microeconomics", "Economics", "How firms and households choose.", "Lweendo Siame", "basket-2", 40, 310, 4.8, 5, "Intermediate", ["#DDEB5A", "#33356A"]),
  c("macroeconomics", "Macroeconomics", "Economics", "Growth, inflation and jobs.", "Kabwe Mulenga", "businessman-globe", 36, 285, 4.7, 7, "Intermediate", ["#CFE6F2", "#7A1F1C"]),
  c("development-economics", "Development Economics", "Economics", "Why some countries grow and others don't.", "Mwaka Musonda", "sprout", 21, 155, 4.6, 14, "Advanced", ["#F47C9A", "#1F4D45"], false),
  c("business-statistics", "Business Statistics", "Economics", "Numbers you can trust.", "Chileshe Daka", "graph-magnifier", 28, 210, 4.8, 4, "Beginner", ["#E8432C", "#1B2D52"]),
  c("quantitative-methods", "Quantitative Methods", "Economics", "The maths behind good decisions.", "Mubanga Chisanga", "pencil-ruler-2", 25, 180, 4.5, 6, "Intermediate", ["#F47C9A", "#7A5A22"]),
];

/* The featured courses: drawn full-bleed wherever they appear, and gathered
   in the strip at the top of the page. Spread across the three subjects so a
   featured card lands in every row. */
const FEATURED = new Set(["corporate-finance", "strategic-management", "principles-of-economics", "marketing", "microeconomics"]);

export const COURSES: Course[] = RAW.map((course) => ({ ...course, featured: FEATURED.has(course.slug) }));
