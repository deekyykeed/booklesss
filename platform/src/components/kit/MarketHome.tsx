"use client";

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { HugeIcon } from "@/components/icons/huge";
import { COURSES as REAL } from "@/lib/courses";
import { CATEGORIES, CategoryBar, CategoryMark } from "./CategoryBar";
import { FilesCard } from "./JayWidgets";
import { Button } from "./primitives";

/* The marketplace's first page (owner, 2026-10-18: "build out the first page
 * of the marketplace — I want to see what I'm dealing with on desktop and
 * mobile"). Built from the kit and nothing else: the soft tile material, the
 * glass button, Happy Files as the course folder (a course IS a folder), the
 * category selector. Covers are simple placeholders until the videos make
 * their own (owner: "just use simple placeholders").
 *
 * THE FOLDERS ARE THE REAL COURSES (owner, 2026-10-18: "the folders are
 * supposed to be actual real courses — Corporate Finance and so on"), read
 * from lib/courses, so a course added there appears here with nothing to
 * touch. Each is the Happy Files card (JayWidgets FilesCard) with the
 * course's own name and counts. The creators row is still placeholder. */

type Course = {
  id: string;
  title: string;
  subtitle: string;
  cat: string;
  units: number;
  steps: number;
  checks: number;
  mins: number;
};

/* Which category chip each real course answers to. A course missing here
 * still shows under All. */
const CATEGORY_OF: Record<string, string> = {
  economics: "economics",
  "corporate-finance": "finance",
  "strategic-management": "business",
  "treasury-management": "finance",
};

/* A step is one concept and one checkpoint, about five minutes to read. */
const MINS_PER_STEP = 5;

const COURSES: Course[] = REAL.map((c) => ({
  id: c.slug,
  title: c.title,
  subtitle: c.subtitle,
  cat: CATEGORY_OF[c.slug] ?? "all",
  units: c.displayUnitIds.length,
  steps: c.lessonIds.length,
  checks: c.totalCheckpoints,
  mins: c.lessonIds.length * MINS_PER_STEP,
}));

const CREATORS = ["Chanda Mwila", "Kondwani Mulenga", "Natasha Phiri", "Bwalya Zulu", "Luyando Sakala", "Musonda Kabwe"];

const hueOf = (cat: string) => CATEGORIES.find((c) => c.id === cat)?.hue ?? "#5c68fe";
const catOf = (cat: string) => CATEGORIES.find((c) => c.id === cat) ?? CATEGORIES[0];
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("");

function greeting(h: number) {
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

/* The folder card is drawn at 346.5 wide; this scales it to its grid
 * column, whatever the column is, so the card is the same object on a phone
 * and a desktop. */
const CARD_W = 346.5;
function FitCard({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [z, setZ] = useState(0);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const set = () => setZ(el.clientWidth / CARD_W);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="kit-mk-fit">
      <div style={{ zoom: z || 1, opacity: z ? 1 : 0, width: CARD_W }}>{children}</div>
    </div>
  );
}

/* A placeholder cover: the category's hue as a soft wash and its mark. */
function Cover({ c, big }: { c: Course; big?: boolean }) {
  const cat = catOf(c.cat);
  return (
    <span className="kit-mk-cover" style={{ "--hue": cat.hue } as CSSProperties} aria-hidden>
      <span className="kit-mk-cover-mark">
        <CategoryMark c={cat} look="duotone" size={big ? 44 : 28} />
      </span>
      <span className="kit-mk-cover-play">
        <HugeIcon name="play" size={big ? 22 : 16} strokeWidth={1.75} />
      </span>
    </span>
  );
}

export function MarketHome({ onMenu, name = "Deeky" }: { onMenu?: () => void; name?: string }) {
  const router = useRouter();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const hour = useMemo(() => new Date().getHours(), []);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return COURSES.filter(
      (c) =>
        (cat === "all" || c.cat === cat) &&
        (!t || c.title.toLowerCase().includes(t) || c.subtitle.toLowerCase().includes(t)),
    );
  }, [cat, q]);
  const featured = shown[0] ?? COURSES[0];
  const catLabel = catOf(cat).label;
  const open = (id: string) => router.push(`/${id}`);

  return (
    <div className="kit-mk">
      <header className="kit-mk-top">
        {onMenu && (
          <span className="kit-mk-menu">
            <Button variant="soft" size="sm" icon="menu" iconOnly label="Open menu" onClick={onMenu} />
          </span>
        )}
        <div className="kit-mk-hello">
          <h1>
            {greeting(hour)}, {name}
          </h1>
          <p>What do you want to learn today?</p>
        </div>
        <label className="kit-mk-search">
          <HugeIcon name="search" size={18} strokeWidth={1.75} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses" aria-label="Search courses" />
        </label>
        <span className="kit-mk-me">
          <Button variant="soft" size="md" icon="user" iconOnly label="Your account" />
        </span>
      </header>

      <CategoryBar value={cat} onChange={setCat} />

      {featured && (
        <section className="kit-mk-hero" style={{ "--hue": hueOf(featured.cat) } as CSSProperties}>
          <Cover c={featured} big />
          <div className="kit-mk-hero-body">
            <span className="kit-mk-eyebrow">Featured{cat === "all" ? "" : ` in ${catLabel}`}</span>
            <h2>{featured.title}</h2>
            <p className="kit-mk-by">{featured.subtitle}</p>
            <p className="kit-mk-meta">
              {featured.units} units · {featured.steps} steps · about {Math.round(featured.mins / 60)} hours
            </p>
            <div className="kit-mk-hero-cta">
              <Button size="md" icon="play" onClick={() => open(featured.id)}>
                Start
              </Button>
              <Button
                variant="soft"
                size="md"
                icon="bookmark"
                onClick={() => setSaved((s) => ({ ...s, [featured.id]: !s[featured.id] }))}
              >
                {saved[featured.id] ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="kit-mk-section">
        <header>
          <h3>{q ? `Results for “${q}”` : cat === "all" ? "Courses" : `${catLabel} courses`}</h3>
          <span>
            {shown.length} {shown.length === 1 ? "course" : "courses"}
          </span>
        </header>
        {shown.length === 0 ? (
          <p className="kit-mk-empty">No {catLabel.toLowerCase()} course yet. Make the first one in Studio.</p>
        ) : (
          <ul className="kit-mk-grid">
            {shown.map((c) => (
              <li key={c.id}>
                <FitCard>
                  <FilesCard
                    title={c.title}
                    eyebrow={catOf(c.cat).id === "all" ? "COURSE" : catOf(c.cat).label.toUpperCase()}
                    stats={[
                      { icon: "image", n: c.units, label: "units", kind: "image" },
                      { icon: "video", n: c.steps, label: "steps", kind: "video" },
                      { icon: "file", n: c.checks, label: "quick checks", kind: "file" },
                      { icon: "video", n: Math.round(c.mins / 60), label: "hours", kind: "video" },
                    ]}
                    actions={[
                      { label: "Open", onPick: () => open(c.id) },
                      { label: saved[c.id] ? "Unsave" : "Save", onPick: () => setSaved((s) => ({ ...s, [c.id]: !s[c.id] })) },
                      { label: "Share" },
                    ]}
                    onOpen={() => open(c.id)}
                  />
                </FitCard>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="kit-mk-section">
        <header>
          <h3>Creators to follow</h3>
        </header>
        <ul className="kit-mk-rail kit-mk-creators">
          {CREATORS.map((n, i) => (
            <li key={n}>
              <span className="kit-mk-creator">
                <span className="kit-mk-avatar kit-mk-avatar--lg" style={{ "--hue": CATEGORIES[(i % 11) + 1].hue } as CSSProperties} aria-hidden>
                  {initials(n)}
                </span>
                <strong>{n}</strong>
                <small>Creator</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
