import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import base from "../preview.module.css";
import b from "./booklesss.module.css";

/* Shared by /preview/booklesss and /preview/booklesss/cards. The card and notch
 * geometry come from ../preview.module.css untouched, so the CRM preview and
 * this one stay the same object; only the content changes. Icons are Hugeicons
 * Free paths, stroke 1.5 on a 24 grid. */

export function I({ size = 18, children, style }: { size?: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={style}
    >
      {children}
    </svg>
  );
}

type P = { size?: number };

export const Arrow = ({ size = 16 }: P) => (
  <I size={size}><path d="M9 6.65032C9 6.65032 15.9383 6.10759 16.9154 7.08463C17.8924 8.06167 17.3496 15 17.3496 15M16.5 7.5L6.5 17.5" /></I>
);
export const Back = ({ size = 17 }: P) => (
  <I size={size}>
    <path d="M5.5 12.002H19" />
    <path d="M10.9999 18.002C10.9999 18.002 4.99998 13.583 4.99997 12.0019C4.99996 10.4208 11 6.00195 11 6.00195" />
  </I>
);
export const Bell = ({ size = 16 }: P) => (
  <I size={size}>
    <path d="M19 18V9.5C19 5.63401 15.866 2.5 12 2.5C8.13401 2.5 5 5.63401 5 9.5V18" />
    <path d="M20.5 18H3.5" />
    <path d="M13.5 20C13.5 20.8284 12.8284 21.5 12 21.5M10.5 20C10.5 20.8284 11.1716 21.5 12 21.5M12 21.5V20" />
  </I>
);
export const Search = ({ size = 16 }: P) => (
  <I size={size}>
    <path d="M17 17L21 21" />
    <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" />
  </I>
);
export const Filter = ({ size = 16 }: P) => (
  <I size={size}>
    <path d="M4 11L4 21M19 13L19 21M19 3L19 7M11.5 3L11.5 13M4 3L4 5M11.5 19L11.5 21" />
    <rect x="2" y="8" width="4" height="3" rx="1.2" />
    <rect x="17" y="10" width="4" height="3" rx="1.2" />
    <rect x="9.5" y="13" width="4" height="3" rx="1.2" />
  </I>
);
export const Fire = ({ size = 13 }: P) => (
  <span style={{ color: "#F6A86B", display: "flex" }}>
    <I size={size}>
      <path d="M13.8561 22C26.0783 19 19.2338 7 10.9227 2C9.9453 5.5 8.47838 6.5 5.54497 10C1.66121 14.6339 3.5895 20 8.96719 22C8.1524 21 6.04958 18.9008 7.5 16C8 15 9 14 8.5 12C9.47778 12.5 11.5 13 12 15.5C12.8148 14.5 13.6604 12.4 12.8783 10C19 14.5 16.5 19 13.8561 22Z" />
    </I>
  </span>
);
export const Calendar = ({ size = 15 }: P) => (
  <I size={size}>
    <path d="M16 2V6M8 2V6" />
    <path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" />
    <path d="M3 10H21" />
  </I>
);
export const Play = ({ size = 18, filled }: P & { filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" aria-hidden>
    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" />
  </svg>
);
export const Pause = ({ size = 16 }: P) => (
  <I size={size}>
    <path d="M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z" />
    <path d="M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z" />
  </I>
);
export const PlayList = ({ size = 18 }: P) => (
  <I size={size}>
    <path d="M2.50012 7.5H21.5001M17.0001 2.5L14.0001 7.5M10.0001 2.5L7.00012 7.5" />
    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" />
    <path d="M14.9531 14.8948C14.8016 15.5215 14.0857 15.9644 12.6539 16.8502C11.2697 17.7064 10.5777 18.1346 10.0199 17.9625C9.78934 17.8913 9.57925 17.7562 9.40982 17.57C9 17.1198 9 16.2465 9 14.5C9 12.7535 9 11.8802 9.40982 11.4299C9.57925 11.2438 9.78934 11.1087 10.0199 11.0375C10.5777 10.8654 11.2697 11.2936 12.6539 12.1498C14.0857 13.0356 14.8016 13.4785 14.9531 14.1052C15.0156 14.3639 15.0156 14.6361 14.9531 14.8948Z" />
  </I>
);
export const Bookmark = ({ size = 16 }: P) => (
  <I size={size}>
    <path d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z" />
  </I>
);
export const Share = ({ size = 17 }: P) => (
  <I size={size}>
    <path d="M21 6.5C21 8.15685 19.6569 9.5 18 9.5C16.3431 9.5 15 8.15685 15 6.5C15 4.84315 16.3431 3.5 18 3.5C19.6569 3.5 21 4.84315 21 6.5Z" />
    <path d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z" />
    <path d="M21 17.5C21 19.1569 19.6569 20.5 18 20.5C16.3431 20.5 15 19.1569 15 17.5C15 15.8431 16.3431 14.5 18 14.5C19.6569 14.5 21 15.8431 21 17.5Z" />
    <path d="M8.72852 10.7495L15.2285 7.75M8.72852 13.25L15.2285 16.2495" />
  </I>
);
export const Download = ({ size = 16 }: P) => (
  <I size={size}>
    <path d="M16.9504 12.1817C17.1981 12.814 16.5076 13.5726 15.1267 15.0899C13.6702 16.6902 12.9201 17.4904 12 17.5C11.0799 17.4904 10.3298 16.6902 8.87331 15.0899C7.49239 13.5726 6.80193 12.814 7.04964 12.1817C7.05868 12.1586 7.06851 12.1359 7.0791 12.1135C7.34928 11.542 8.24477 11.5029 10 11.5002V4.99998C10 4.53501 10 4.30253 10.0511 4.11179C10.1898 3.59414 10.5941 3.1898 11.1118 3.05111C11.3025 3 11.535 3 12 3C12.4649 3 12.6974 3 12.8882 3.05111C13.4058 3.1898 13.8102 3.59414 13.9489 4.11179C14 4.30253 14 4.53501 14 4.99998V11.5002C15.7552 11.5029 16.6507 11.542 16.9209 12.1135C16.9315 12.1359 16.9413 12.1586 16.9504 12.1817Z" />
    <path d="M5.00006 21H19.0001" />
  </I>
);
export const Wand = ({ size = 17 }: P) => (
  <I size={size}>
    <path d="M13.9258 12.7775L11.7775 10.6292C11.4847 10.3364 11.3383 10.19 11.1803 10.1117C10.8798 9.96277 10.527 9.96277 10.2264 10.1117C10.0685 10.19 9.92207 10.3364 9.62923 10.6292C9.33638 10.9221 9.18996 11.0685 9.11169 11.2264C8.96277 11.527 8.96277 11.8798 9.11169 12.1803C9.18996 12.3383 9.33638 12.4847 9.62923 12.7775L11.7775 14.9258M13.9258 12.7775L20.3708 19.2225C20.6636 19.5153 20.81 19.6617 20.8883 19.8197C21.0372 20.1202 21.0372 20.473 20.8883 20.7736C20.81 20.9315 20.6636 21.0779 20.3708 21.3708C20.0779 21.6636 19.9315 21.81 19.7736 21.8883C19.473 22.0372 19.1202 22.0372 18.8197 21.8883C18.6617 21.81 18.5153 21.6636 18.2225 21.3708L11.7775 14.9258M13.9258 12.7775L11.7775 14.9258" />
    <path d="M17 2L17.2948 2.7966C17.6813 3.84117 17.8746 4.36345 18.2556 4.74445C18.6366 5.12545 19.1588 5.31871 20.2034 5.70523L21 6L20.2034 6.29477C19.1588 6.68129 18.6366 6.87456 18.2556 7.25555C17.8746 7.63655 17.6813 8.15883 17.2948 9.2034L17 10L16.7052 9.2034C16.3187 8.15884 16.1254 7.63655 15.7444 7.25555C15.3634 6.87455 14.8412 6.68129 13.7966 6.29477L13 6L13.7966 5.70523C14.8412 5.31871 15.3634 5.12545 15.7444 4.74445C16.1254 4.36345 16.3187 3.84117 16.7052 2.7966L17 2Z" />
    <path d="M6 4L6.22108 4.59745C6.51097 5.38087 6.65592 5.77259 6.94167 6.05834C7.22741 6.34408 7.61913 6.48903 8.40255 6.77892L9 7L8.40255 7.22108C7.61913 7.51097 7.22741 7.65592 6.94166 7.94167C6.65592 8.22741 6.51097 8.61913 6.22108 9.40255L6 10L5.77892 9.40255C5.48903 8.61913 5.34408 8.22741 5.05833 7.94167C4.77259 7.65592 4.38087 7.51097 3.59745 7.22108L3 7L3.59745 6.77892C4.38087 6.48903 4.77259 6.34408 5.05833 6.05833C5.34408 5.77259 5.48903 5.38087 5.77892 4.59745L6 4Z" />
  </I>
);
export const Folder = ({ size = 19 }: P) => (
  <I size={size}>
    <path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" />
  </I>
);
export const Users = ({ size = 13 }: P) => (
  <I size={size}>
    <path d="M16 21C15.7668 18.0685 13.3422 15.7477 10.3085 15.5521L9.49999 15.5C9.21121 15.5076 8.94209 15.5178 8.68816 15.5298C5.68124 15.6723 3.23089 18.0974 3 21" />
    <path d="M12.75 9.75C12.75 11.5449 11.2949 13 9.5 13C7.70508 13 6.25 11.5449 6.25 9.75C6.25 7.95507 7.70508 6.5 9.5 6.5C11.2949 6.5 12.75 7.95507 12.75 9.75Z" />
    <path d="M21 17.501C20.7709 14.6314 18.4541 12.2748 15.5 11.9961" />
    <path d="M15.9877 9C16.8965 8.42434 17.5001 7.40788 17.5001 6.25C17.5001 4.45507 16.0496 3 14.2602 3C13.3811 3 12.5838 3.35121 12.0001 3.92139" />
  </I>
);
export const Clock = ({ size = 13 }: P) => (
  <I size={size}><circle cx="12" cy="12" r="10" /><path d="M12 8V12L14 14" /></I>
);
export const Tick = ({ size = 13 }: P) => (
  <I size={size}><path d="M5 14L8.5 17.5L19 6.5" /></I>
);
export const Chevron = ({ size = 14 }: P) => (
  <I size={size}><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" /></I>
);

/* ---------- the notch: same geometry as the CRM card ---------- */

export type NotchBtn = { icon: ReactNode; label: string; href?: string; solid?: boolean; dot?: boolean };

export function Notch({ buttons }: { buttons: NotchBtn[] }) {
  const width = 8 + buttons.length * 46 + (buttons.length - 1) * 8 + 10;
  return (
    <div className={base.notch} style={{ width }}>
      {buttons.map((btn, i) => {
        const cls = `${b.nb} ${btn.solid ? b.nbSolid : ""}`;
        const style = { left: 8 + i * 54 };
        const inner = (
          <>
            {btn.icon}
            {btn.dot && <span className={base.dot} style={{ left: 27, top: 11 }} />}
          </>
        );
        return btn.href ? (
          <Link key={i} href={btn.href} className={cls} style={style} aria-label={btn.label}>{inner}</Link>
        ) : (
          <button key={i} type="button" className={cls} style={style} aria-label={btn.label}>{inner}</button>
        );
      })}
      <svg className={`${base.fillet} ${base.filletTop}`} viewBox="0 0 24 24" aria-hidden>
        <path d="M0 0H24V24A24 24 0 0 0 0 0Z" />
      </svg>
      <svg className={`${base.fillet} ${base.filletRight}`} viewBox="0 0 24 24" aria-hidden>
        <path d="M0 0H24V24A24 24 0 0 0 0 0Z" />
      </svg>
    </div>
  );
}

/* ---------- a video thumbnail placeholder ---------- */

export function Thumb({
  w,
  h,
  dur,
  play = true,
  style,
}: {
  w: number;
  h: number;
  dur?: string;
  play?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span className={b.thumb} style={{ width: w, height: h, ...style }}>
      {play && <span className={b.thumbPlay}><Play size={Math.max(10, Math.round(h / 4))} filled /></span>}
      {dur && <span className={b.dur}>{dur}</span>}
    </span>
  );
}

/** One slim pill per video, the watched ones lit. Reads as "a run of videos". */
export function Segments({ total, done, width = 120 }: { total: number; done: number; width?: number }) {
  return (
    <span className={b.segs} style={{ width }}>
      {Array.from({ length: total }, (_, i) => <span key={i} className={i < done ? b.segOn : undefined} />)}
    </span>
  );
}

/* ---------- placeholder catalogue ---------- */

export type Course = {
  slug: string;
  title: string;
  videos: number;
  runtime: string;
  watched: number;
  makers: number;
  fresh: number;
  topics: [string, number][];
  next: { title: string; dur: string };
  sizeMb: number;
  saved: number;
};

/* Course names are the four live courses; every number is invented. No codes,
 * no school names (house rule for anything a student sees). */
export const COURSES: Course[] = [
  {
    slug: "corporate-finance",
    title: "Corporate Finance",
    videos: 12,
    runtime: "1h 48m",
    watched: 7,
    makers: 18,
    fresh: 3,
    topics: [["NPV", 4], ["WACC", 3], ["Capital budgeting", 5], ["Dividends", 2]],
    next: { title: "WACC for a Lusaka brewer", dur: "8:12" },
    sizeMb: 312,
    saved: 8,
  },
  {
    slug: "treasury-management",
    title: "Treasury Management",
    videos: 21,
    runtime: "3h 05m",
    watched: 4,
    makers: 9,
    fresh: 5,
    topics: [["Hedging", 6], ["Cash flow", 5], ["Interest rates", 4], ["Working capital", 3]],
    next: { title: "Hedging a kwacha payable", dur: "6:40" },
    sizeMb: 540,
    saved: 3,
  },
  {
    slug: "strategic-management",
    title: "Strategic Management",
    videos: 8,
    runtime: "58m",
    watched: 8,
    makers: 6,
    fresh: 1,
    topics: [["Five forces", 2], ["SWOT", 2], ["Value chain", 3]],
    next: { title: "Five forces at Zambeef", dur: "7:30" },
    sizeMb: 190,
    saved: 8,
  },
  {
    slug: "economics",
    title: "Economics",
    videos: 4,
    runtime: "31m",
    watched: 1,
    makers: 3,
    fresh: 2,
    topics: [["Elasticity", 2], ["Inflation", 1], ["Supply", 1]],
    next: { title: "Elasticity and the price of mealie meal", dur: "9:02" },
    sizeMb: 96,
    saved: 0,
  },
];
