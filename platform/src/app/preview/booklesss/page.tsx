import type { Metadata } from "next";
import Link from "next/link";
import { Urbanist } from "next/font/google";
import base from "../preview.module.css";
import b from "./booklesss.module.css";
import { ProgressCard } from "./_cards";
import {
  Arrow,
  Back,
  Bell,
  Bookmark,
  Calendar,
  Chevron,
  COURSES,
  Filter,
  Fire,
  Folder,
  Pause,
  Play,
  Search,
  Share,
  Thumb,
  Tick,
  Wand,
  Notch,
} from "./_ui";

/* THE CRM PREVIEW, CONVERTED TO BOOKLESSS (owner, 2026-10-20).
 *
 * Same screen, same structure as /preview, which is left exactly as it was:
 * the client folders are now COURSE folders, and what is inside them is
 * VIDEOS other students generated. Every piece was re-pointed rather than
 * redesigned: the schedule is today's watch list, the stats count videos and
 * time watched, leads are courses, tasks are videos to watch.
 *
 * ⚠️ Placeholder data throughout (see COURSES in _ui.tsx). Course names are
 * the four live ones; numbers, people and video titles are invented. No
 * course codes or school names, per the house rule. Not indexed. The seven
 * card versions live at /preview/booklesss/cards. */

const urbanist = Urbanist({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-urbanist" });

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

type Video = {
  by: string;
  when: string;
  title: string;
  course: string;
  dur: string;
  state: string;
  played: number;
  lime?: boolean;
  fresh?: boolean;
  done?: boolean;
};

const VIDEOS: Video[] = [
  { by: "Mwila Banda", when: "Made 2 days ago", title: "NPV, step by step", course: "Corporate Finance", dur: "7:05", state: "Resume at 4:12", played: 58, lime: true, fresh: true },
  { by: "Chanda Phiri", when: "Made yesterday", title: "Hedging a kwacha payable", course: "Treasury Management", dur: "6:40", state: "Not started", played: 0 },
  { by: "Natasha Mwale", when: "Made last week", title: "Five forces at Zambeef", course: "Strategic Management", dur: "7:30", state: "Watched", played: 100, done: true },
];

function VideoCard({ v }: { v: Video }) {
  return (
    <article className={`${base.card} ${base.task} ${v.lime ? `${base.taskLime} ${b.limeThumb}` : ""}`}>
      <Notch
        buttons={[
          { icon: <Bookmark />, label: "Save for later", dot: v.fresh },
          { icon: <Arrow />, label: "Open video" },
        ]}
      />
      <span className={base.avatar} style={{ position: "absolute", left: 10, top: 9, width: 47, height: 47 }} />
      <div className={base.who} style={{ position: "absolute", left: 76, top: 15 }}>{v.by}</div>
      <div className={base.whoRole} style={{ position: "absolute", left: 76, top: 34 }}>{v.when}</div>
      <Thumb w={47} h={47} style={{ position: "absolute", left: 12, top: 100 }} />
      <div
        className={base.name}
        style={{ position: "absolute", left: 76, top: 100, maxWidth: "calc(100% - 86px)", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {v.title}
      </div>
      <div className={base.meta} style={{ position: "absolute", left: 78, top: 136 }}>
        {v.course} <i>·</i> {v.dur}
      </div>
      <div className={base.label} style={{ position: "absolute", left: 12, top: 175, color: "var(--muted-2)" }}>Where you are</div>
      <div className={base.status} style={{ position: "absolute" }}>
        <Thumb w={30} h={30} play={false} style={{ borderRadius: 10 }} />
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {v.done && <Tick size={13} />}
          {v.state}
        </span>
        <Chevron />
        <span className={b.played}><span style={{ width: `${v.played}%` }} /></span>
      </div>
      <button type="button" className={`${base.circle} ${base.ghost}`} aria-label="Share video"><Share /></button>
      <button type="button" className={`${base.circle} ${base.solid}`} aria-label={v.done ? "Watch again" : "Play"}>
        <Play size={18} filled />
      </button>
    </article>
  );
}

export default async function BooklesssPreview({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const light = (await searchParams).theme === "light";
  const q = light ? "?theme=light" : "";
  const theme = light ? "light" : "dark";
  const watched = COURSES.reduce((n, c) => n + c.watched, 0);
  const total = COURSES.reduce((n, c) => n + c.videos, 0);

  return (
    <main className={`${urbanist.variable} ${base.page} ${b.root}`} data-theme={theme}>
      <div className={base.col}>
        <header className={`${base.between} ${base.top}`}>
          <Link href={light ? "/preview/booklesss" : "/preview/booklesss?theme=light"} className={b.wordmark} aria-label="Switch theme">
            Bklsss
          </Link>
          <div className={base.row} style={{ gap: 8 }}>
            <button type="button" className={base.circle} style={{ width: 44, height: 44, position: "relative", background: light ? "#fff" : undefined }} aria-label="New videos">
              <Bell size={18} />
              <span className={base.dot} style={{ left: 26, top: 10 }} />
            </button>
            <span className={base.avatar} style={{ width: 44, height: 44, border: "2px solid #fff" }} />
          </div>
        </header>

        {/* today's watch list: videos, so square thumbnails where the CRM had faces */}
        <section className={base.schedule} aria-label="Today's videos">
          <div className={base.between} style={{ paddingLeft: 14 }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>Today’s videos</span>
            <div className={base.row} style={{ gap: 6 }}>
              <span className={`${base.row} ${base.dateChip}`}>
                <span><Calendar /></span>
                <span>20 October</span>
              </span>
              <span className={base.openBtn}><Arrow /></span>
            </div>
          </div>
          <div className={`${base.timeline} ${b.limeThumb}`}>
            <Thumb w={36} h={36} play={false} style={{ borderRadius: 11 }} />
            <span style={{ fontSize: 10, fontWeight: 500, color: "#5C7F30", padding: "0 10px" }}>7 min</span>
            <span className={base.tlDivider} />
            <span className={base.tlTime}>2:00 pm</span>
            <span className={base.tlPair} style={{ gap: 4 }}>
              <Thumb w={30} h={30} play={false} style={{ borderRadius: 10, background: "#d9d9d9" }} />
              <Thumb w={30} h={30} play={false} style={{ borderRadius: 10, background: "#c9c9c9" }} />
            </span>
            <span className={base.tlRun}>
              <span className={base.now} />
              <span className={base.nowTag}>2:15 pm</span>
            </span>
            <span className={base.tlDivider} />
            <span className={base.tlTime}>3:00 pm</span>
            <span className={base.tlPair} style={{ gap: 4, marginRight: 6 }}>
              <Thumb w={30} h={30} play={false} style={{ borderRadius: 10, background: "#d9d9d9" }} />
              <Thumb w={30} h={30} play={false} style={{ borderRadius: 10, background: "#c9c9c9" }} />
            </span>
          </div>
        </section>

        <div className={`${base.between} ${base.ws}`}>
          <div className={base.row} style={{ gap: 10 }}>
            <Link href={`/preview${q}`} className={base.circle} style={{ width: 44, height: 44 }} aria-label="Back to the CRM preview">
              <Back />
            </Link>
            <h1 className={base.wordmark} style={{ margin: 0 }}>
              C
              <svg width={30} height={30} viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="9.5" stroke="var(--ink)" strokeWidth={1.8} />
                <path d="M16.2 12.6c-.3 1-1.5 1.7-3.9 3.1-2.3 1.3-3.5 2-4.4 1.7a2.3 2.3 0 0 1-1-.6C6.2 16.1 6.2 14.8 6.2 12s0-4.1.7-4.8c.3-.3.6-.5 1-.6.9-.3 2.1.4 4.4 1.7 2.4 1.4 3.6 2.1 3.9 3.1.1.4.1.8 0 1.2Z" fill="var(--lime)" transform="translate(1.6 -0.4)" />
              </svg>
              URSES
            </h1>
          </div>
          <button type="button" className={base.circle} style={{ width: 47, height: 47, background: "var(--inv)", color: "var(--inv-ink)" }} aria-label="Make a video">
            <Wand size={19} />
          </button>
        </div>

        <div className={base.stats}>
          {[
            { n: String(total), l: "videos", d: "↑ 11" },
            { n: String(watched), l: "watched", d: "↑ 4" },
            { n: "6h", l: "this week", d: "↑ 2h" },
          ].map((x) => (
            <div key={x.l} className={base.stat}>
              <b>{x.n}</b>
              <div>
                <span className={`${base.delta} ${base.up}`}>{x.d}</span>
                <em>{x.l}</em>
              </div>
            </div>
          ))}
        </div>

        <div className={`${base.between} ${base.section}`}>
          <div className={base.title}>
            <h2>Your Courses</h2>
            <span className={base.count}><b>{COURSES.length}</b> Courses</span>
          </div>
          <div className={base.row} style={{ gap: 6 }}>
            <button type="button" className={base.circle} style={{ width: 42, height: 42 }} aria-label="Search courses"><Search /></button>
            <button type="button" className={base.circle} style={{ width: 42, height: 42 }} aria-label="Filter"><Filter /></button>
          </div>
        </div>
        <div className={base.scroller}>
          <button type="button" className={`${base.chip} ${base.chipOn}`}>All</button>
          <button type="button" className={base.chip}><Fire />In progress</button>
          {["New videos", "Saved", "Finished"].map((c) => <button key={c} type="button" className={base.chip}>{c}</button>)}
        </div>
        <div className={`${base.scroller} ${base.carousel}`}>
          {COURSES.map((c) => <ProgressCard key={c.slug} c={c} />)}
        </div>
        <Link href={`/preview/booklesss/cards${q}`} className={b.linkPill}>
          See 7 versions of this card <Arrow size={15} />
        </Link>

        <div className={`${base.between} ${base.section}`}>
          <div className={base.title}>
            <h2>Keep Watching</h2>
            <span className={base.count}><b>{VIDEOS.length}</b> Videos</span>
          </div>
          <div className={base.row} style={{ gap: 6 }}>
            <button type="button" className={base.circle} style={{ width: 42, height: 42 }} aria-label="Search videos"><Search /></button>
            <button type="button" className={base.circle} style={{ width: 42, height: 42 }} aria-label="Filter"><Filter /></button>
          </div>
        </div>
        <div className={base.scroller}>
          <button type="button" className={`${base.chip} ${base.chipOn}`}>All</button>
          <button type="button" className={base.chip}><Fire />New</button>
          {["Started", "Saved", "Watched"].map((c) => <button key={c} type="button" className={base.chip}>{c}</button>)}
        </div>
        <div className={base.stack}>
          {VIDEOS.map((v) => <VideoCard key={v.title} v={v} />)}
        </div>
      </div>

      <nav className={base.nav} aria-label="Sections">
        <button type="button" className={`${base.circle} ${base.navOn}`} aria-label="Courses"><Folder /></button>
        <button type="button" className={base.circle} aria-label="Search"><Search size={19} /></button>
        <button type="button" className={base.circle} aria-label="Make a video"><Wand size={19} /></button>
        <button type="button" className={base.circle} aria-label="Saved"><Bookmark size={19} /></button>
        <div className={`${base.row} ${base.call}`}>
          <Thumb w={40} h={40} play={false} style={{ borderRadius: 13, background: "rgba(0,0,0,0.16)" }} />
          <span>4:12</span>
          <button type="button" className={base.circle} style={{ background: "#000" }} aria-label="Pause">
            <Pause size={15} />
          </button>
        </div>
      </nav>
    </main>
  );
}
