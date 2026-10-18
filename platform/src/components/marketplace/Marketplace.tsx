"use client";

import Link from "next/link";
import { useId } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { avatarSrc } from "@/components/identity/avatars";
import { useIdentity } from "@/lib/identity";
import { COLLECTIONS, FEATURED, POPULAR, type MarketCollection, type MarketCourse } from "@/lib/marketplace";
import "./marketplace.css";

/* The learner marketplace. Every surface is one of the owner's widgets
 * (Paper, "BUILD — Widgets"): the soft grey shell, the orange-to-blue pill,
 * the gradient card with a white note inside it, the folder, the plus. The
 * values are copied from Paper's computed styles, scaled to this size — see
 * marketplace.css. Desktop sits the panel inside the Parrot gradient with a
 * rail; below 900px it is the phone board: one column and a tab bar. */

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "MORNING" : h < 17 ? "AFTERNOON" : "EVENING";
}

function Sun({ size = 22 }: { size?: number }) {
  const rays = ["M17.5 2.5v2.6", "M17.5 29.9v2.6", "M2.5 17.5h2.6", "M29.9 17.5h2.6", "M6.9 6.9l1.8 1.8", "M26.3 26.3l1.8 1.8", "M6.9 28.1l1.8-1.8", "M26.3 8.7l1.8-1.8"];
  return (
    <svg width={size} height={size} viewBox="0 0 35 35" aria-hidden className="mk-sun">
      <circle cx="17.5" cy="17.5" r="9" fill="#FDC201" />
      {rays.map((d) => <path key={d} d={d} fill="none" stroke="#FDC201" strokeWidth="2.6" strokeLinecap="round" />)}
    </svg>
  );
}

const FOLDER_D = "M0 40C0 17.9 17.9 0 40 0H118C131 0 138 6 146 18C154 31 160 45 176 45H246C268.1 45 286 62.9 286 85V166C286 188.1 268.1 206 246 206H40C17.9 206 0 188.1 0 166Z";

function Folder() {
  const id = useId().replace(/:/g, "");
  return (
    <div className="mk-folder" aria-hidden>
      <div className="mk-folder-glow" />
      <div className="mk-folder-ledge" />
      <svg viewBox="0 0 286 206" className="mk-folder-face">
        <defs>
          <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
            {[["0", "#FEC08E"], ["0.2", "#FEB385"], ["0.3", "#FBAA8E"], ["0.37", "#F0A0A2"], ["0.45", "#D48FB8"], ["0.53", "#A57CD8"], ["0.61", "#8670E6"], ["0.75", "#6664F6"], ["1", "#5A68FD"]].map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
          </linearGradient>
          <radialGradient id={`${id}b`} cx="1" cy="0.5" r="0.5"><stop offset="0" stopColor="#FF9BA2" stopOpacity="0.95" /><stop offset="1" stopColor="#FF9BA2" stopOpacity="0" /></radialGradient>
          <radialGradient id={`${id}c`} cx="1" cy="0.95" r="0.42"><stop offset="0" stopColor="#C9A6E8" stopOpacity="0.9" /><stop offset="1" stopColor="#C9A6E8" stopOpacity="0" /></radialGradient>
        </defs>
        <path d={FOLDER_D} fill={`url(#${id}a)`} />
        <path d={FOLDER_D} fill={`url(#${id}b)`} />
        <path d={FOLDER_D} fill={`url(#${id}c)`} />
        <path d={FOLDER_D} fill="none" stroke="#FFFFFF59" strokeWidth="5" />
      </svg>
    </div>
  );
}

function Plus({ size }: { size: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className="mk-plus" style={{ width: size, height: size }} aria-hidden>
      <span className="mk-plus-glow" />
      <svg viewBox="0 0 124 119" width={size} height={size * 119 / 124}>
        <defs>
          <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
            {[["0", "#FDD3C4"], ["0.1", "#FCAC8D"], ["0.25", "#F5A19F"], ["0.38", "#C886C6"], ["0.5", "#7D6DE8"], ["0.62", "#6666F6"], ["1", "#5470FA"]].map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
          </linearGradient>
          <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
            {[["0", "#B9A6EC"], ["0.12", "#9A87E7"], ["0.3", "#877CEF"], ["0.5", "#6D68F2"], ["0.68", "#9382EF"], ["0.86", "#DB9ED5"], ["1", "#F6CFDD"]].map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
          </linearGradient>
        </defs>
        <rect x="42" y="0" width="40" height="119" rx="20" fill={`url(#${id}a)`} />
        <rect x="0" y="39" width="124" height="40" rx="20" fill={`url(#${id}b)`} />
        <rect x="42" y="39" width="40" height="40" fill="#6D68F28C" />
      </svg>
    </span>
  );
}

function VideoMark() {
  return (
    <svg viewBox="0 0 36 28" className="mk-stat-mark" aria-hidden>
      <rect x="0" y="0" width="26" height="28" rx="8" fill="#C0C0C0" />
      <path d="M24 9.5L33 4.2C34.3 3.4 36 4.4 36 5.9V22.1C36 23.6 34.3 24.6 33 23.8L24 18.5Z" fill="#C0C0C0" />
      <circle cx="12.5" cy="14" r="4.6" fill="#EDEDED" />
    </svg>
  );
}

function DocMark() {
  return (
    <svg viewBox="0 0 29 34" className="mk-stat-mark mk-stat-doc" aria-hidden>
      <path d="M6 0H17L29 12V28C29 31.3 26.3 34 23 34H6C2.7 34 0 31.3 0 28V6C0 2.7 2.7 0 6 0Z" fill="#C0C0C0" />
      <path d="M18 0.5L28.5 11H21C19.3 11 18 9.7 18 8Z" fill="#E4E4E4" />
    </svg>
  );
}

function CollectionCard({ c }: { c: MarketCollection }) {
  return (
    <Link href="#popular" className="mk-shell mk-collection">
      <Folder />
      <span className="mk-dots" aria-hidden><i /><i /><i /></span>
      <span className="mk-collection-tag">{c.tag}</span>
      <span className="mk-collection-name">{c.name}</span>
      <span className="mk-collection-sub">{c.courses} courses · {c.free} free</span>
      <span className="mk-stats">
        <span title="Videos"><VideoMark />{c.videos}</span>
        <span title="Quick checks"><DocMark />{c.quizzes}</span>
      </span>
    </Link>
  );
}

function CourseCard({ c }: { c: MarketCourse }) {
  return (
    <article className="mk-shell mk-course">
      {/* eslint-disable-next-line @next/next/no-img-element -- four small local JPEGs; next/image would add nothing here */}
      <img src={c.image} alt="" className="mk-course-img" />
      <span className={c.access === "free" ? "mk-tag" : "mk-tag mk-tag-dark"}>{c.access === "free" ? "FREE" : "MEMBERS"}</span>
      <h3 className="mk-course-title">{c.title}</h3>
      <p className="mk-course-meta">by {c.creator} · {c.lessons} lessons · {c.minutes} min</p>
      <div className="mk-course-foot">
        <button type="button" className="mk-pill mk-pill-sm">
          <HugeIcon name="play" size={13} className="mk-fill" />
          Watch
        </button>
        <span className="mk-rating">
          <HugeIcon name="star" size={15} className="mk-fill mk-star" />
          {c.rating.toFixed(1)}
        </span>
      </div>
    </article>
  );
}

export function Marketplace() {
  const { identity } = useIdentity();
  const name = (identity?.name ?? "").toUpperCase();
  const face = identity ? avatarSrc(identity.avatar) : null;

  return (
    <div className="mk">
      <div className="mk-frame">
        <nav className="mk-rail" aria-label="Main">
          <span className="mk-rail-logo">B</span>
          <div className="mk-rail-nav">
            <Link href="/marketplace" className="mk-rail-btn is-on" aria-label="Marketplace"><HugeIcon name="home" size={20} /></Link>
            <Link href="/dashboard/courses" className="mk-rail-btn" aria-label="My courses"><HugeIcon name="book-open" size={20} /></Link>
            <Link href="/dashboard/saved" className="mk-rail-btn" aria-label="Saved"><HugeIcon name="bookmark" size={20} /></Link>
          </div>
          <div className="mk-rail-foot">
            <button type="button" className="mk-rail-btn" aria-label="Notifications"><HugeIcon name="bell" size={20} /></button>
            <Link href="/settings" className="mk-rail-me" aria-label="Settings">
              {face && <img src={face} alt="" />}
            </Link>
          </div>
        </nav>

        <main className="mk-panel">
          <section className="mk-top">
            <div className="mk-shell mk-greet">
              <p className="mk-greet-head"><Sun size={22} />{greeting()}{name ? ` ${name}` : ""}</p>
              <p className="mk-greet-line">
                <span>You should</span> <b>try a free course</b> <span>today, what do you think?</span>
              </p>
            </div>
            <label className="mk-shell mk-search">
              <HugeIcon name="search" size={22} className="mk-search-icon" />
              <input type="search" placeholder="Search" aria-label="Search courses" />
              <button type="button" className="mk-pill mk-pill-search">Explore</button>
            </label>
            <button type="button" className="mk-shell mk-square mk-create" aria-label="Create a course">
              <Plus size={42} />
            </button>
            <Link href="/settings" className="mk-shell mk-square mk-me" aria-label="Your account">
              <span className="mk-me-ring">{face && <img src={face} alt="" />}</span>
            </Link>
          </section>

          <section className="mk-row">
            <article className="mk-featured">
              <div className="mk-featured-glow" />
              <p className="mk-featured-eyebrow">FEATURED · FREE · {FEATURED.lessons} LESSONS</p>
              <h1 className="mk-featured-title">{FEATURED.title}</h1>
              <button type="button" className="mk-featured-play" aria-label={`Play ${FEATURED.title}`}>
                <HugeIcon name="play" size={22} className="mk-fill" />
              </button>
              <div className="mk-featured-ghost" />
              <div className="mk-note">
                <p className="mk-note-head">
                  <Sun size={22} />
                  <span style={{ color: "#DEDAC6" }}>T</span><span style={{ color: "#D3D1C6" }}>O</span>
                  <span>DAY&apos;S PICK · {FEATURED.creator.toUpperCase()}</span>
                </p>
                <p className="mk-note-line">
                  <span>Seven short videos on</span> <b>where money goes,</b> <span>with</span> <b>quick checks</b> <span>inside each one :)</span>
                </p>
              </div>
            </article>
            {COLLECTIONS.map((c) => <CollectionCard key={c.name} c={c} />)}
          </section>

          <div className="mk-head" id="popular">
            <h2>Popular this week</h2>
            <a href="#popular">See all</a>
          </div>
          <section className="mk-courses">
            {POPULAR.map((c) => <CourseCard key={c.slug} c={c} />)}
          </section>
        </main>
      </div>

      <nav className="mk-shell mk-tabs" aria-label="Main">
        <Link href="/marketplace" className="mk-tab is-on" aria-label="Marketplace"><HugeIcon name="home" size={22} /></Link>
        <Link href="/dashboard/courses" className="mk-tab" aria-label="My courses"><HugeIcon name="book-open" size={22} /></Link>
        <button type="button" className="mk-tab" aria-label="Create a course"><Plus size={32} /></button>
        <Link href="/dashboard/saved" className="mk-tab" aria-label="Saved"><HugeIcon name="bookmark" size={22} /></Link>
        <button type="button" className="mk-tab mk-tab-bell" aria-label="Notifications"><HugeIcon name="bell" size={22} /></button>
      </nav>
    </div>
  );
}
