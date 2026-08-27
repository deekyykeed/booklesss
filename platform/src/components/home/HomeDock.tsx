"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlumpIcon, type PlumpIconName } from "@/components/icons/plump";
import { AskMic } from "./ask-mic";
import { askFirstMessage, askPrompt, type AskContext } from "@/lib/ask";
import { labelFor } from "@/lib/course";
import { hapticTap } from "@/lib/haptics";
import { authEnabled } from "@/lib/auth";
import { onboardingComplete, useIdentity } from "@/lib/identity";
import { daysStudiedIn, useProgress } from "@/lib/progress";
import type { AskControls, AskItem, AskPhase, NewAskItem } from "./ask-types";

/* ------------------------------------------------------------------ *
 * The bottom of the home screen: four small marks, one big button.
 *
 * Owner's sketch, 2026-08-27 — a row across the foot of the phone with a
 * noticeably larger circle in the middle of it, and, in his words, "a big
 * button which is the main call to action for a student to then interface with
 * a voice agent".
 *
 * ⚠️ THE CALL HAPPENS IN PLACE. THAT IS THE WHOLE BRIEF, AND IT IS WHY THIS IS
 * NOT AskDock. The dock this replaces (now in `archive/`) morphed a 52px disc
 * into the entire viewport: a scrim, a dialog, a scroll lock, a history entry.
 * The owner asked for the opposite — "I don't want too many changes to happen
 * on screen when a user goes from the normal to a chat mode, just that
 * necessary minimal changes happen like the button having audio waves or bars."
 *
 * So going into a call changes exactly three things and nothing else moves:
 *   1. the microphone in the big button becomes a LEVEL METER;
 *   2. a line of text appears under the row saying where the call is;
 *   3. anything the agent decides is worth keeping pins above the row.
 * The sessions list stays exactly where it was, at the scroll position it was
 * at, and the nav underneath still works — you can walk to the courses tab
 * mid-call and keep talking, which is a thing the full-screen panel made
 * impossible.
 *
 * ⚠️ IT MUST BE RENDERED IN `dashboard/layout.tsx`, OUTSIDE `<main>`. This is
 * `position: fixed`, and `#content-surface` is both the scroller and (on every
 * surface but this one) a `backdrop-filter` element, which makes it a
 * containing block for fixed descendants exactly as a transform would. A
 * "fixed" element inside it rides the page. AskDock paid for that on
 * 2026-08-22 — "when I scroll up or down it moves with the screen instead of
 * being fixed" — and the home surface turning its blur off does not make the
 * mistake safe, only invisible until somebody turns it back on.
 *
 * NOTHING CONNECTS UNTIL THE BUTTON IS PRESSED. The ElevenLabs engine is a
 * dynamic import: it carries a WebRTC stack that has no business in the
 * dashboard's first load on Zambian mobile data, and a conversation opened
 * because somebody looked at the button is one the account is billed for.
 * `ask-types.ts` exists so this file can never import it as a value.
 *
 * VOICE ONLY. AskDock also had a typed transport — a signed WebSocket, billed
 * per message rather than per minute — and the sketch has no text box and no
 * panel to put one in. The engine still supports both; see `archive/README.md`.
 * ------------------------------------------------------------------ */

const AskEngine = dynamic(() => import("./ask-engine").then((m) => m.AskEngine), {
  ssr: false,
});

/* The four small marks, in the order they are drawn — two, the button, two.
 *
 * FOUR, NOT FIVE, and the button is not one of them: the sketch puts two
 * circles either side of a bigger one, and the big one is an ACTION where these
 * are places. Nothing here is a placeholder; every row goes somewhere that
 * exists today, which is the rule that kept the parked home rail's four "soon"
 * rows off this screen (see the layout note).
 *
 * NO LABELS UNDER THEM, which the sketch is explicit about — plain circles.
 * That is only allowed because these four marks survive being read cold: a
 * house, a mortarboard, a bookmark, a cog. Every one still carries an
 * `aria-label` and a `title`, and a fifth destination whose picture is less
 * obvious than these needs the words back. */
type Row = { href: string; icon: PlumpIconName; label: string; match: (path: string) => boolean };

const NAV: Row[] = [
  { href: "/dashboard", icon: "home-1", label: "Home", match: (p) => p === "/dashboard" },
  {
    href: "/dashboard/courses",
    icon: "graduation-cap",
    label: "Courses",
    match: (p) => p.startsWith("/dashboard/courses"),
  },
  {
    href: "/dashboard/saved",
    icon: "bookmark",
    label: "Saved",
    match: (p) => p.startsWith("/dashboard/saved"),
  },
  { href: "/settings", icon: "cog", label: "You", match: (p) => p.startsWith("/settings") },
];

export function HomeDock() {
  const { identity, hydrated: idHydrated } = useIdentity();
  const { hydrated, days, last } = useProgress();
  const path = usePathname() ?? "/dashboard";

  const [engaged, setEngaged] = useState(false);
  const [phase, setPhase] = useState<AskPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AskItem[]>([]);

  const controls = useRef<AskControls | null>(null);
  const nextId = useRef(1);

  /* ---- who the agent is talking to ------------------------------- */

  /* The CHOSEN name only. `identity.name` is never empty — it is the assigned
     avatar's name until somebody types their own — so reading it without
     `nameChosen` is how a student ends up being greeted as "Astronaut". */
  const ctx: AskContext = useMemo(
    () => ({
      name: identity?.nameChosen ? identity.name.trim().split(/\s+/)[0] : undefined,
      courses: identity?.courses ?? [],
      last: hydrated && last ? labelFor(last.id) : null,
      studyDays: hydrated ? daysStudiedIn(days, 7) : undefined,
    }),
    [identity, hydrated, last, days],
  );

  /* Built per conversation rather than per render: the prompt is a few
     kilobytes of concatenation over the whole course nav. */
  const brief = useMemo(
    () => ({ prompt: askPrompt(ctx, "voice"), firstMessage: askFirstMessage(ctx) }),
    [ctx],
  );

  /* ---- the call -------------------------------------------------- */

  const push = useCallback((item: NewAskItem) => {
    setItems((prev) => [...prev, { ...item, id: nextId.current++ } as AskItem]);
  }, []);

  const start = useCallback(() => {
    hapticTap();
    setError(null);
    setItems([]);
    setEngaged(true);
  }, []);

  const hangUp = useCallback(() => {
    hapticTap();
    controls.current?.hangUp();
    controls.current = null;
    setEngaged(false);
    setPhase("idle");
    /* The pins go with the call. They are what the agent decided was worth
       keeping DURING it, and leaving them stacked over the sessions list after
       it ends turns a transient into furniture nobody asked for. Anything a
       student wants to keep is in the step it came from. */
    setItems([]);
  }, []);

  /* Leaving the dashboard entirely must hang up. The dock unmounts when the
     student navigates into the reader or a session, and without this the
     connection survives it — billed, and still audible. */
  useEffect(() => {
    return () => {
      controls.current?.hangUp();
      controls.current = null;
    };
  }, []);

  /* A call that ends on its own — the agent finished, or the socket dropped —
     must put the button back. Without this the meter keeps drawing silence and
     the only way out is a reload. */
  useEffect(() => {
    if (phase !== "ended") return;
    const t = setTimeout(() => {
      setEngaged(false);
      setPhase("idle");
      setItems([]);
    }, 1400);
    return () => clearTimeout(t);
  }, [phase]);

  const inCall = engaged && (phase === "connecting" || phase === "live");
  const pins = items.filter((i) => i.role === "pin").slice(-3);

  /* ⚠️ IT GATES ON EXACTLY WHAT THE PAGE GATES ON, INCLUDING `authEnabled`.
     This dock lives in the layout, so it cannot rely on the page's own
     <RequireOnboarding> to decide whether it belongs — it has to make the same
     decision independently, and "the same decision" has two halves.

     AskDock copied only the first half (`onboardingComplete`), which was fine
     for a floating microphone: on a build with no Supabase keys there is no
     account to talk to anyway, so a missing button cost nothing. It is not fine
     here. This dock is the screen's whole navigation, and RequireOnboarding
     answers `if (!authEnabled) return children` — so a keyless build (every
     local run, every preview without env) drew the sessions list with no nav
     under it and no way to reach the courses tab. Copying half a gate produced
     a page whose only exit was the browser's back button.

     Still nothing until the device has been read, so it cannot flash up and
     disappear. */
  if (!idHydrated) return null;
  if (authEnabled && !onboardingComplete(identity)) return null;

  return (
    <div className="home-dock-layer" data-live={inCall || undefined}>
      {/* ---- WHAT THE CALL PUT ON SCREEN, AND ONLY DURING ONE ----
          ⚠️ It is stacked ABOVE the row and taken OUT OF FLOW, which is the
          difference between "minimal changes" and "almost none". In flow, in a
          column pinned to the bottom of the viewport, every one of these — a
          pin, an error, the state line — pushes the whole row up as it appears
          and drops it back as it goes. Measured: the state line alone moved the
          four marks and the call button 26px the instant a call opened, which
          is the button jumping out from under the thumb that just pressed it.
          Absolutely positioned, the row never moves at all and these arrive in
          the space above it, over content the fade has already dimmed. */}
      <div className="dock-above" aria-live="polite">
        {pins.length ? (
          <ul className="dock-pins">
            {pins.map((p) => (
              <li key={p.id} className="dock-pin">
                {p.text}
              </li>
            ))}
          </ul>
        ) : null}

        {error ? <p className="dock-error">{error}</p> : null}

        {/* One line, and it exists only while a call does. */}
        {engaged ? (
          <p className="dock-state">
            {phase === "connecting"
              ? "Connecting…"
              : phase === "live"
                ? "Listening — tap to end"
                : "Call over"}
          </p>
        ) : null}
      </div>

      <nav className="home-dock" aria-label="Booklesss">
        {NAV.slice(0, 2).map((r) => (
          <DockLink key={r.href} row={r} current={r.match(path)} />
        ))}

        {/* ---- THE BUTTON ----
            One control, two states, like the primary circle in the dock this
            replaces: press it to start talking, press it again to stop. The
            glyph is what says which — the Plump microphone at rest, the meter
            during a call — and the caption under the row says it in words,
            because a bar chart is not self-evidently a stop button. */}
        <button
          type="button"
          className="dock-call"
          onClick={inCall ? hangUp : start}
          aria-label={inCall ? "End the call" : "Talk to Booklesss"}
          title={inCall ? "End the call" : "Talk to Booklesss"}
        >
          {inCall ? <Meter controls={controls} live={phase === "live"} /> : <AskMic size={30} />}
        </button>

        {NAV.slice(2).map((r) => (
          <DockLink key={r.href} row={r} current={r.match(path)} />
        ))}
      </nav>

      {engaged ? (
        <AskEngine
          chrome="none"
          mode="voice"
          prompt={brief.prompt}
          firstMessage={brief.firstMessage}
          initialMessage={null}
          items={items}
          muted={false}
          onItem={push}
          onPhase={setPhase}
          onError={setError}
          onReady={(c) => {
            controls.current = c;
          }}
        />
      ) : null}
    </div>
  );
}

function DockLink({ row, current }: { row: Row; current: boolean }) {
  return (
    <Link
      href={row.href}
      className="dock-link"
      aria-label={row.label}
      title={row.label}
      aria-current={current ? "page" : undefined}
      data-current={current || undefined}
    >
      <PlumpIcon
        name={row.icon}
        size={24}
        /* Two signals, not one: the mark takes the accent AND the disc behind it
           fills. The design system's note on selected states applies directly —
           one colour pair that reads clearly at rest stops reading once the
           thing beside it is heavier or larger, and these marks are drawn with
           3-unit strokes on a 48 grid, which is heavy. */
        light={current ? "var(--color-home-raise)" : "var(--color-home-sunk)"}
        dark={current ? "var(--color-accent)" : "var(--color-muted)"}
      />
    </Link>
  );
}

/**
 * Five white bars inside the big button, following the voice.
 *
 * THE LEVEL IS POLLED ON AN ANIMATION FRAME AND WRITTEN TO A CSS VARIABLE, so
 * it never touches React. This is the same construction as the ask panel's
 * meter and it is deliberate: re-rendering a component sixty times a second to
 * move five bars is how a call starts dropping frames on a mid-range Android.
 *
 * It reads through the controls REF rather than a prop, because the engine
 * mounts a moment after this does — the button flips to the meter the instant
 * the student presses it, and `onReady` lands once the SDK has a session. A
 * prop would have to be threaded through a re-render to arrive; polling a ref
 * simply starts returning real numbers when there are some.
 */
function Meter({ controls, live }: { controls: React.RefObject<AskControls | null>; live: boolean }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let smoothed = 0;
    const tick = () => {
      /* Eased towards the reading rather than set to it. Raw frequency data is
         spiky enough that bars bound directly to it flicker instead of moving. */
      const next = Math.max(0, Math.min(1, controls.current?.getLevel() ?? 0));
      smoothed += (next - smoothed) * 0.22;
      el.style.setProperty("--lvl", smoothed.toFixed(3));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [controls]);

  /* Tallest in the middle, so the shape reads as a voice rather than a chart. */
  const weights = [0.4, 0.7, 1, 0.7, 0.4];
  return (
    <span ref={ref} className="dock-meter" data-live={live || undefined} aria-hidden>
      {weights.map((w, i) => (
        <span key={i} style={{ ["--w" as string]: w }} />
      ))}
    </span>
  );
}
