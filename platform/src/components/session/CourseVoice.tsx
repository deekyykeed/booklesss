"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HugeIcon } from "@/components/icons/huge";
import { AskMic } from "@/components/home/ask-mic";
import { courseTone } from "@/components/home/tones";
import { BottomGlow, type GlowState } from "./BottomGlow";
import { greet, greetingText } from "@/lib/greeting";
import { useIdentity } from "@/lib/identity";
import { openMic, type MicReader, type MicStatus } from "@/lib/mic-level";
import { endMorph } from "@/lib/morph";
import { useProgress } from "@/lib/progress";
import { sessionForLesson, type SessionRef } from "@/lib/session-nav";
import { labelFor, pathForId } from "@/lib/course";

/* ------------------------------------------------------------------ *
 * A course's voice screen — the page the course card grows into.
 *
 * Owner, 2026-08-23, in one breath: the card grows into a full-screen page,
 * "that's where the voice chat experience is going to live", the student is
 * greeted with "a box at the top … asking them whether they'd like to continue
 * with what they're doing or not", and the rest is "mostly blank, especially
 * when starting. A glowing sort of effect will happen from the bottom, showing
 * that the microphone is being heard."
 *
 * So the screen is three things and nothing else: an offer at the top, a great
 * deal of nothing, and a light at the bottom that proves it is listening. The
 * nothing is not a gap waiting to be filled — it is where the pinned points
 * will land once the agent is talking, and until then it is the room the
 * student is being invited to speak into.
 *
 * ⚠️ THE SESSION RUNS HERE. IT DOES NOT NAVIGATE TO /study.
 *
 * That is the whole reason this page fetches a brief instead of linking to
 * one. Earlier on 2026-08-23 a parallel session removed BOTH doors to /study
 * (commit ca2a50f) with the right reasoning: that surface is dark with a green
 * orb where the rest of the app is cream, so the home screen's front door was
 * handing students a page that looks like a different product. Sending
 * "Continue" there would put the door straight back, one screen deeper, and
 * the student would cross from a light page to a dark one mid-thought.
 *
 * What was wrong with /study was its SURFACE, never the idea of a guided walk.
 * So the walk happens on this screen, in this palette, and /study keeps
 * building and serving its 48 prerendered pages for anyone holding a link.
 *
 * ⚠️ THE AGENT IS NOT CONNECTED YET, ON PURPOSE. Owner, same message: "in
 * another session I'll be getting the credentials … for eleven labs and every
 * other API that I need to make the AI work, but in this one, let's just work
 * on the infrastructure." Everything a conversation needs is here and proven:
 * the brief is fetched, the microphone opens, the level is real, the glow reads
 * it, and the greeting speaks the moment a key exists. `connect()` below is the
 * one seam left, and it is marked.
 *
 * ⚠️ IT IS THE APP'S OWN PALETTE. --color-canvas, ink, one --color-btn circle.
 * The owner has already rejected an imported palette on this exact kind of
 * surface once (2026-08-22, on the ask box: "that green, or whatever colour you
 * keep adding, does not match the actual UI that I already have"). The only
 * colour here is the COURSE'S own hue off lib/tones — the value the card that
 * grew into this screen was already wearing, so the card and the light at the
 * bottom match because they are one value, not because anyone remembered.
 * ------------------------------------------------------------------ */

/** What /api/session/brief hands back. The two strings at the end are what the
 *  agent is actually driven by; everything above them is for the screen. */
type Brief = {
  id: string;
  title: string;
  kicker: string | null;
  minutes: number;
  beats: number;
  prompt: string;
  firstMessage: string;
  steps: { id: string; title: string; path: string }[];
};

type Loading = { id: string } | null;

export function CourseVoice({
  slug,
  title,
  lessonIds,
}: {
  slug: string;
  title: string;
  lessonIds: string[];
}) {
  const tone = courseTone(slug);
  const { identity } = useIdentity();
  const { hydrated, doneCount, isComplete, last } = useProgress();

  const [picking, setPicking] = useState(false);
  const [mic, setMic] = useState<MicStatus>("idle");
  const [talking, setTalking] = useState(false);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState<Loading>(null);
  const [failed, setFailed] = useState(false);

  /* The reader is held in a ref rather than in state because the glow reads it
     sixty times a second — see BottomGlow on keeping that loop off the React
     tree. `level` is stable so the glow's effect never has to restart. */
  const reader = useRef<MicReader | null>(null);
  const level = useCallback(() => reader.current?.level() ?? 0, []);

  /* THE CLONE COMES DOWN WHEN THIS MOUNTS. Until this fires the morph overlay
     is still covering the screen — that is its job, to hold the frame while the
     route swaps underneath. MorphSurface has a safety net that drops it anyway
     if a destination ever forgets, but forgetting would mean a visible stall. */
  useEffect(() => {
    endMorph();
  }, []);

  /* Every session in this course, in course order, deduplicated. A session is
     one lesson group, so several of a course's steps map to the same one. */
  const sessions = useMemo<SessionRef[]>(() => {
    const seen = new Set<string>();
    const out: SessionRef[] = [];
    for (const id of lessonIds) {
      const s = sessionForLesson(id);
      if (s && !seen.has(s.id)) {
        seen.add(s.id);
        out.push(s);
      }
    }
    return out;
  }, [lessonIds]);

  /* WHAT THEY WERE DOING. Two sources, and the order between them is the
     question this screen opens with.

     `last` is the step most recently OPEN — the truest answer, because it is a
     record of the student rather than an inference about the course. It is
     checked against this course's steps rather than trusted, since it is global.

     Falling back to the same rule the course card uses (the first unfinished
     step that has been started, else the first unfinished) keeps the two
     surfaces agreeing: a card that says "Resume · Cost of Capital" must not
     grow into a screen offering something else. */
  const resume = useMemo(() => {
    if (!hydrated) return null;

    const mine = new Set(lessonIds);
    if (last && mine.has(last.id)) {
      const s = sessionForLesson(last.id);
      if (s) return { session: s, step: last.id, seen: true };
    }

    const unfinished = lessonIds.filter((id) => !isComplete(id));
    const started = unfinished.find((id) => doneCount(id) > 0);
    const step = started ?? unfinished[0] ?? lessonIds[0];
    if (!step) return null;
    const s = sessionForLesson(step);
    return s ? { session: s, step, seen: Boolean(started) } : null;
  }, [hydrated, lessonIds, last, isComplete, doneCount]);

  /* Whether this is a return or a first arrival. Drives the greeting's words
     and the offer's heading, and it turns on `seen` rather than on "is there
     anything to resume" — every course has a first step to point at, so the
     other test would greet a brand-new student with "welcome back". */
  const returning = Boolean(resume?.seen);

  /* THE GREETING. Once, on arrival, and never again — including across the
     StrictMode double-mount that would otherwise play it twice. It waits for
     `hydrated` because the words depend on whether they have been here before,
     and reading that too early greets a returning student as a new one. */
  const greeted = useRef(false);
  useEffect(() => {
    if (!hydrated || greeted.current) return;
    greeted.current = true;
    const stop = greet(returning ? "resume" : "fresh", identity?.name ?? null);
    return () => {
      /* Clearing the latch matters as much as calling stop. A cleanup that
         stops the sound without releasing it means the second StrictMode mount
         returns early and the student hears nothing — the same shape as the
         `started` ref trap that cost an afternoon on 2026-08-22. */
      greeted.current = false;
      stop();
    };
  }, [hydrated, returning, identity?.name]);

  /* THE MICROPHONE. Opened on a tap and never on load — a page that grabs the
     mic because somebody looked at it is a page whose permission gets revoked.

     ⚠️ If this fails with `denied` in production but works in development,
     check `Permissions-Policy` BEFORE touching this code. An empty allowlist
     (`microphone=()`) denies the capability to this origin too, so the browser
     rejects AFTER the student has already said yes — see lib/mic-level. */
  const startListening = useCallback(async () => {
    if (reader.current) return;
    setMic("asking");
    try {
      reader.current = await openMic();
      setMic("listening");
    } catch (why) {
      setMic(typeof why === "string" ? (why as MicStatus) : "error");
    }
  }, []);

  const stopListening = useCallback(() => {
    reader.current?.stop();
    reader.current = null;
    setTalking(false);
    setMic("idle");
  }, []);

  /* The microphone outlives a re-render and must not outlive the page. */
  useEffect(
    () => () => {
      reader.current?.stop();
      reader.current = null;
    },
    [],
  );

  /**
   * Choose a session and load what the agent needs to teach it.
   *
   * ⚠️ THE MICROPHONE IS OPENED FROM INSIDE THIS TAP, not after the fetch
   * resolves. A browser only grants capture from a user gesture, and awaiting a
   * network round trip first spends it — the request would then be made outside
   * any gesture and Safari answers that by refusing without a prompt. So the
   * two happen in parallel: the tap buys the microphone, the fetch fills in
   * what to say.
   */
  const choose = useCallback(
    (ref: SessionRef) => {
      setFailed(false);
      setPicking(false);
      setLoading({ id: ref.id });
      void startListening();

      const ac = new AbortController();
      fetch(`/api/session/brief/${encodeURIComponent(ref.id)}`, { signal: ac.signal })
        .then((r) => r.json())
        .then((data: { ok: boolean } & Brief) => {
          if (!data?.ok) {
            setFailed(true);
            setLoading(null);
            return;
          }
          setBrief(data);
          setLoading(null);
          /* ⚠️ THE ONE SEAM LEFT. `data.prompt` and `data.firstMessage` are the
             per-call client override that lets ONE ElevenLabs agent serve every
             session in every course. When the key lands, this is where the
             conversation starts — mint a token at /api/agent/token, start the
             session with these two strings, and set `talking` off its
             onModeChange so the glow already knows whose turn it is.

             ⚠️ `platform_settings.client_overrides` MUST be enabled on the
             agent or every session silently gets the placeholder prompt — it
             looks like an agent that does not know the material, not like a
             settings problem. See CLAUDE.md → Sessions. */
        })
        .catch(() => {
          setFailed(true);
          setLoading(null);
        });
      return () => ac.abort();
    },
    [startListening],
  );

  const glow: GlowState = talking ? "speaking" : mic === "listening" ? "listening" : "dormant";

  /* What the screen is currently claiming, in one sentence. It sits under the
     button rather than on it, because the button's job is to be pressed and a
     control that also reports status is a control whose label moves under the
     thumb. */
  const status =
    mic === "asking"
      ? "Asking for your microphone…"
      : mic === "denied"
        ? "Microphone blocked. Allow it in your browser settings, then tap again."
        : mic === "unsupported"
          ? "This browser can't open a microphone."
          : mic === "error"
            ? "Couldn't open your microphone. Try again."
            : mic === "listening"
              ? "Listening — say what's on your mind."
              : "Tap to talk it through.";

  /* The reading, for whichever step this screen is currently about. Always one
     tap away from every voice surface: the call replaces sitting and reading,
     it does not remove it. */
  const readHref = resume ? pathForId(resume.step) : `/${slug}`;

  return (
    <main className="vox-screen" style={{ ["--voice-tone" as string]: tone }}>
      {/* The way out. A course's voice space is a place you are IN, so the exit
          is an arrow back to the app rather than a nav bar — anything more
          would be the chrome this route left the dashboard group to escape. */}
      <header className="vox-top">
        <Link href="/dashboard" className="vox-back" aria-label="Back to your courses">
          <HugeIcon name="chevron-left" size={19} />
        </Link>
        {/* The course, quietly. Not a heading — the student just tapped this
            course and knows what they tapped. It is here so a reloaded or
            shared URL says where it landed. */}
        <span className="vox-course">{title}</span>
        <span className="vox-back-spacer" aria-hidden="true" />
      </header>

      {/* ---- THE OFFER AT THE TOP ----------------------------------- *
          Owner: "add a box at the top, or some container at the top, asking
          them whether they'd like to continue with what they're doing or not."

          A QUESTION WITH TWO ANSWERS, not a button with an escape hatch.
          Continue and "Something else" are the same height for that reason — a
          student who does not want to carry on should not have to find the
          small grey way out of a screen that has already decided for them.

          It says what it is doing before hydration rather than rendering
          nothing: the box arriving a beat after everything else is exactly the
          "jumped onto the screen" feeling being fixed elsewhere today. */}
      <section className="vox-offer app-enter" style={{ ["--enter-i" as string]: 1 }}>
        {!hydrated ? (
          <p className="vox-offer-line vox-offer-wait">Finding your place…</p>
        ) : brief ? (
          /* Chosen. The box shrinks to a receipt — what this is now about — so
             the blank below it gets the room back. */
          <>
            <p className="vox-offer-line vox-offer-now">{brief.title}</p>
            <p className="vox-offer-meta">
              {brief.kicker ? `${brief.kicker} · ` : ""}
              {brief.beats} point{brief.beats === 1 ? "" : "s"} · ~{brief.minutes} min
            </p>
            <div className="vox-offer-actions">
              <button
                type="button"
                className="vox-alt"
                onClick={() => {
                  setBrief(null);
                  setPicking(true);
                }}
              >
                Change
              </button>
            </div>
          </>
        ) : loading ? (
          <p className="vox-offer-line vox-offer-wait">Getting it ready…</p>
        ) : picking ? (
          <>
            <p className="vox-offer-line">Where would you like to start?</p>
            <ul className="vox-pick">
              {sessions.map((s) => (
                <li key={s.id}>
                  <button type="button" className="vox-pick-row" onClick={() => choose(s)}>
                    <span className="vox-pick-title">{s.title}</span>
                    <span className="vox-pick-meta">~{s.minutes} min</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="vox-alt" onClick={() => setPicking(false)}>
              Back
            </button>
          </>
        ) : resume ? (
          <>
            <p className="vox-offer-line">
              {returning ? "Carry on where you stopped?" : "Ready to start?"}
            </p>
            <p className="vox-offer-what">{resume.session.title}</p>
            <p className="vox-offer-meta">
              {resume.session.kicker ? `${resume.session.kicker} · ` : ""}~
              {resume.session.minutes} min
              {resume.seen ? ` · last on ${labelFor(resume.step)}` : ""}
            </p>
            {failed && (
              <p className="vox-offer-meta vox-offer-failed">
                Couldn&apos;t load that one. Try again, or read it instead.
              </p>
            )}
            <div className="vox-offer-actions">
              <button type="button" className="vox-go" onClick={() => choose(resume.session)}>
                {returning ? "Continue" : "Start"}
              </button>
              {sessions.length > 1 && (
                <button type="button" className="vox-alt" onClick={() => setPicking(true)}>
                  Something else
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="vox-offer-line">Nothing here yet.</p>
        )}
      </section>

      {/* ---- THE BLANK ---------------------------------------------- *
          Deliberately empty, and the largest thing on the screen. It is where a
          pinned point lands once the agent has something to say; until then it
          holds the greeting — the words the voice is speaking, which is also
          the whole greeting for anyone whose browser refused to autoplay it
          (the normal case on iOS after a navigation, see lib/greeting). */}
      <div className="vox-stage">
        {hydrated && (
          <p className="vox-said app-enter" style={{ ["--enter-i" as string]: 3 }}>
            {brief
              ? brief.firstMessage
              : greetingText(returning ? "resume" : "fresh", identity?.name ?? null)}
          </p>
        )}
      </div>

      {/* ---- THE LIGHT ---------------------------------------------- */}
      <BottomGlow read={level} state={glow} tone={tone} />

      <footer className="vox-foot">
        <button
          type="button"
          className="vox-mic app-enter-pop"
          style={{ ["--enter-i" as string]: 4 }}
          onClick={mic === "listening" ? stopListening : startListening}
          aria-pressed={mic === "listening"}
          aria-label={mic === "listening" ? "Stop listening" : "Talk"}
        >
          {mic === "listening" ? (
            <HugeIcon name="microphone-off" size={22} />
          ) : (
            <AskMic size={22} />
          )}
        </button>
        <p className="vox-status" role="status">
          {status}
        </p>
        <Link href={readHref} className="vox-read">
          Read it instead
        </Link>
      </footer>

      {/* Development only — previews the "agent is talking" light with no agent
          to talk. `talking` is the flag the glow's speaking state reads, so
          when the conversation lands its onModeChange sets this same flag and
          the light already knows what to do with it. */}
      {process.env.NODE_ENV === "development" && (
        <button
          type="button"
          className="vox-devtoggle"
          onClick={() => setTalking((v) => !v)}
          aria-label="Preview the speaking glow"
        >
          {talking ? "stop" : "speak"}
        </button>
      )}
    </main>
  );
}
