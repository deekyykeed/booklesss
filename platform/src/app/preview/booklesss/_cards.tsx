import type { CSSProperties, ReactNode } from "react";
import base from "../preview.module.css";
import b from "./booklesss.module.css";
import {
  Arrow,
  Bell,
  Download,
  Folder,
  Notch,
  PlayList,
  Play,
  Search,
  Segments,
  Thumb,
  Tick,
  Wand,
  type Course,
} from "./_ui";

/* Seven versions of ONE card. Every version keeps the CRM card's structure:
 * a notched top-right corner holding one or two 46px actions, an identity slot
 * top-left, a large title, a line under it, and a two-column footer. What
 * changes is what the card says and what its buttons do, each for one job. */

type Size = { width?: number | string; height: number };

const abs = (left: number | string, top: number, extra?: CSSProperties): CSSProperties => ({
  position: "absolute",
  left,
  top,
  ...extra,
});

function Shell({ size, lime, children }: { size: Size; lime?: boolean; children: ReactNode }) {
  return (
    <article
      className={`${base.card} ${lime ? `${base.taskLime} ${b.limeThumb}` : ""}`}
      style={{ width: size.width ?? "100%", height: size.height, color: lime ? "#000" : undefined }}
    >
      {children}
    </article>
  );
}

const Title = ({ children, top = 82 }: { children: ReactNode; top?: number }) => (
  <div className={base.name} style={abs(20, top, { maxWidth: "calc(100% - 40px)", overflow: "hidden", textOverflow: "ellipsis" })}>
    {children}
  </div>
);
const Sub = ({ children, top = 114 }: { children: ReactNode; top?: number }) => (
  <div className={base.role} style={abs(20, top)}>{children}</div>
);
const Label = ({ children, left = 20, top = 148, right }: { children: ReactNode; left?: number | string; top?: number; right?: number }) => (
  <div className={base.label} style={right !== undefined ? { position: "absolute", right, top } : abs(left, top)}>{children}</div>
);
const IdCircle = ({ children }: { children: ReactNode }) => (
  <span className={base.typeIcon} style={abs(10, 9)}>{children}</span>
);
const Fan = ({ n = 3 }: { n?: number }) => (
  <span className={b.fan}>
    {Array.from({ length: n }, (_, i) => <Thumb key={i} w={44} h={47} play={i === n - 1} />)}
  </span>
);
const open = (c: Course) => ({ icon: <Arrow />, label: `Open ${c.title}`, href: "/preview/booklesss" });

/* 1 ------------------------------------------------------------------ */
export function ProgressCard({ c, size = { width: 290, height: 206 } }: { c: Course; size?: Size }) {
  return (
    <Shell size={size}>
      <Notch buttons={[open(c)]} />
      <Fan />
      <Title>{c.title}</Title>
      <Sub>{c.videos} videos · {c.runtime}</Sub>
      <Label>Topics</Label>
      <div className={base.row} style={abs(20, 166, { gap: 6 })}>
        <span className={base.tag}>{c.topics[0][0]}</span>
        {c.topics.length > 1 && <span className={base.tag}>+{c.topics.length - 1}</span>}
      </div>
      <Label right={20}>{c.watched} of {c.videos} watched</Label>
      <span style={{ position: "absolute", right: 20, top: 162 }}>
        <Segments total={c.videos} done={c.watched} width={108} />
      </span>
    </Shell>
  );
}

/* 2 ------------------------------------------------------------------ */
export function FilmstripCard({ c }: { c: Course }) {
  const shown = 3;
  return (
    <Shell size={{ height: 252 }}>
      <Notch buttons={[{ icon: <PlayList size={17} />, label: "Play all" }, open(c)]} />
      <IdCircle><PlayList /></IdCircle>
      <Title top={74}>{c.title}</Title>
      <Sub top={106}>{c.videos} videos · {c.runtime}</Sub>
      <div style={abs(20, 140, { right: 20, display: "flex", gap: 8 })}>
        {["7:05", "8:12", "5:48"].slice(0, shown).map((d) => <Thumb key={d} w={0} h={92} dur={d} style={{ flex: 1 }} />)}
        <span className={b.dashed} style={{ flex: 1, height: 92, borderStyle: "solid" }}>
          +{c.videos - shown}
          <br />
          more
        </span>
      </div>
    </Shell>
  );
}

/* 3 ------------------------------------------------------------------ */
export function UpNextCard({ c }: { c: Course }) {
  return (
    <Shell size={{ height: 214 }} lime>
      <Notch buttons={[{ icon: <Play size={18} filled />, label: `Play ${c.next.title}`, solid: true }]} />
      <div className={base.label} style={abs(20, 20, { color: "#3c5a1a" })}>Up next in</div>
      <div className={base.who} style={abs(20, 36, { fontSize: 18 })}>{c.title}</div>
      <Thumb w={128} h={100} dur={c.next.dur} style={abs(12, 102)} />
      <div style={abs(154, 106, { right: 18, display: "flex", flexDirection: "column", gap: 8 })}>
        <div style={{ fontSize: 17, fontWeight: 500, lineHeight: "22px" }}>{c.next.title}</div>
        <div style={{ fontSize: 11, color: "#3c5a1a" }}>Video {c.watched + 1} of {c.videos}</div>
        <Segments total={c.videos} done={c.watched} width={150} />
      </div>
    </Shell>
  );
}

/* 4 ------------------------------------------------------------------ */
export function CommunityCard({ c }: { c: Course }) {
  return (
    <Shell size={{ height: 210 }}>
      <Notch buttons={[{ icon: <Bell />, label: "Tell me when a video is added", dot: c.fresh > 0 }, open(c)]} />
      <span className={b.faces} style={abs(12, 17)}><span /><span /><span /></span>
      <div className={base.whoRole} style={abs(84, 19, { fontSize: 11 })}>Made by</div>
      <div className={base.who} style={abs(84, 32)}>{c.makers} students</div>
      <Title>{c.title}</Title>
      <Sub>{c.videos} videos · newest 2 days ago</Sub>
      <Label>This week</Label>
      <span className={b.badge} style={abs(20, 167)}>+{c.fresh} new videos</span>
      <Label right={20}>Most watched</Label>
      <span className={base.tag} style={{ position: "absolute", right: 20, top: 166 }}>{c.next.title.split(" ").slice(0, 3).join(" ")}…</span>
    </Shell>
  );
}

/* 5 ------------------------------------------------------------------ */
export function TopicsCard({ c }: { c: Course }) {
  return (
    <Shell size={{ height: 238 }}>
      <Notch buttons={[{ icon: <Search />, label: "Find a topic" }, open(c)]} />
      <IdCircle><Folder size={18} /></IdCircle>
      <Title>{c.title}</Title>
      <Sub>{c.topics.length} topics · {c.videos} videos</Sub>
      <Label>Jump to a topic</Label>
      <div style={abs(20, 166, { right: 20, display: "flex", flexWrap: "wrap", gap: 6 })}>
        {c.topics.map(([t, n]) => (
          <span key={t} className={base.tag} style={{ gap: 6 }}>
            {t} <b style={{ fontWeight: 600, color: "var(--ink)" }}>{n}</b>
          </span>
        ))}
      </div>
    </Shell>
  );
}

/* 6 ------------------------------------------------------------------ */
export function GapsCard({ c }: { c: Course }) {
  const missing = Math.max(1, 6 - c.videos);
  return (
    <Shell size={{ height: 236 }}>
      <Notch buttons={[{ icon: <Wand />, label: "Make a video for this course", solid: true }, open(c)]} />
      <Fan n={2} />
      <Title>{c.title}</Title>
      <Sub>{c.videos} videos · {missing} topics have none yet</Sub>
      <div style={abs(20, 150, { right: 20, display: "flex", gap: 8 })}>
        <Thumb w={0} h={66} dur="9:02" style={{ flex: 1 }} />
        <Thumb w={0} h={66} dur="6:15" style={{ flex: 1 }} />
        <span className={b.dashed} style={{ flex: 1, height: 66 }}>
          <Wand size={15} />
          Make the
          <br />
          next one
        </span>
      </div>
    </Shell>
  );
}

/* 7 ------------------------------------------------------------------ */
export function OfflineCard({ c }: { c: Course }) {
  const used = Math.round((c.sizeMb * c.saved) / c.videos);
  return (
    <Shell size={{ height: 206 }}>
      <Notch buttons={[{ icon: <Download />, label: "Save every video to this phone" }, open(c)]} />
      <IdCircle><Download size={18} /></IdCircle>
      <Title>{c.title}</Title>
      <Sub>{c.videos} videos · {c.sizeMb} MB in all</Sub>
      <Label>On this phone</Label>
      <span className={base.tag} style={abs(20, 166, { gap: 5 })}>
        <Tick size={12} /> {c.saved} of {c.videos} saved
      </span>
      <Label right={20}>{used} MB used</Label>
      <span className={b.meter} style={{ position: "absolute", right: 20, top: 170, width: 108 }}>
        <span style={{ width: `${Math.round((c.saved / c.videos) * 100)}%` }} />
      </span>
    </Shell>
  );
}

export const VARIANTS = [
  {
    name: "Progress",
    Card: ProgressCard,
    course: 0,
    shows: "A fan of video thumbnails, the course, how many videos and how long they run, its first topic, and one pill per video with the watched ones lit.",
    buttons: "Open the course.",
    why: "The default for a course you are already in. The fan says “videos” before a word is read, and the pill row answers the only question a returning student has: how far through am I.",
  },
  {
    name: "Filmstrip",
    Card: FilmstripCard,
    course: 0,
    shows: "The course and its runtime over a strip of the first three videos, each with its length, and a tile counting the rest.",
    buttons: "Play all, in order. Open the course.",
    why: "For a course you have not opened yet. It shows the actual videos instead of describing them, and play-all lets someone watch it like a playlist without picking.",
  },
  {
    name: "Up next",
    Card: UpNextCard,
    course: 1,
    shows: "Which course, the next unwatched video large with its length, its place in the run, and progress.",
    buttons: "One lime play button. Nothing else.",
    why: "The home screen’s first card. A student with five minutes should be one tap from watching, not two screens from a list, so the card drops everything that is not the next video.",
  },
  {
    name: "Made by students",
    Card: CommunityCard,
    course: 0,
    shows: "Faces of the people who generated the videos and how many there are, what arrived this week, and the most-watched video.",
    buttons: "A bell to be told when someone adds a video. Open the course.",
    why: "The videos are made by other students, so who made them and how lately is the reason to trust a course and come back to it. The bell turns that into a notification instead of a habit of checking.",
  },
  {
    name: "Topics",
    Card: TopicsCard,
    course: 1,
    shows: "The course split into its topics, each with how many videos cover it.",
    buttons: "Search inside the course. Open the course.",
    why: "For the moment a student needs hedging and not the whole course. The counts also show which topics are thin.",
  },
  {
    name: "Make the next one",
    Card: GapsCard,
    course: 3,
    shows: "The few videos a young course has, how many topics have none yet, and an empty slot where the next video would go.",
    buttons: "A lime wand that starts generating a video for this course. Open the course.",
    why: "New courses start thin. Instead of looking empty, the card turns the gap into the action that fills it, and generating is what the product does.",
  },
  {
    name: "On this phone",
    Card: OfflineCard,
    course: 0,
    shows: "How big the course is, how many videos are already saved to the phone, and how much space they take.",
    buttons: "Save every video for offline. Open the course.",
    why: "Data costs money here. Saving on Wi‑Fi and watching on the bus is how a student actually gets through a course, and the size up front stops a surprise bill.",
  },
] as const;
