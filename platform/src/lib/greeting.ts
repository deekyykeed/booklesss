/* ------------------------------------------------------------------ *
 * The sound the course makes when you walk into it.
 *
 * Owner, 2026-08-23: "maybe even if I can get a sound in after the course card
 * is clicked and it opens, you get a sound where I say … 'let's continue from
 * where we started'."
 *
 * TWO SOUNDS, AND THE ORDER MATTERS. A short chime plays immediately, and the
 * spoken line follows it if the account can synthesise one. They are separate
 * because they fail separately:
 *
 *   THE CHIME is WebAudio — two notes, generated in the browser. No file, no
 *   fetch, no account, ~40 lines. It plays on a dead network on a first visit
 *   and it plays today, with no ElevenLabs credentials configured at all. That
 *   is the point: the screen has a voice from the day it ships, so nobody is
 *   waiting on a key to know whether the arrival feels right.
 *
 *   THE VOICE is /api/agent/greet. It starts working the moment
 *   ELEVENLABS_API_KEY is set and needs no change here — which is what the
 *   owner asked for ("in another session I'll be getting the credentials …
 *   in this one, let's just work on the infrastructure").
 *
 * ⚠️ AUTOPLAY WILL REFUSE, AND THAT IS NOT AN ERROR. A browser only lets audio
 * start from a user gesture. The gesture here is the tap on the course card,
 * and it is spent on a NAVIGATION — by the time this page mounts, Safari in
 * particular may no longer count it. So every path swallows its rejection and
 * the screen never reports a failure the student cannot act on. What it does
 * instead is show the greeting as TEXT regardless, which is the half that
 * always works.
 *
 * ⚠️ NEVER MORE THAN ONE AT A TIME. React 19 StrictMode double-mounts effects
 * in development, and two overlapping greetings sound like a fault. The module
 * holds the live one and stops it before starting another — the same shape as
 * the `started` ref in ask-engine, and with the same trap noted there: the
 * cleanup must actually clear the handle, or the second mount finds a stale
 * one and stays silent forever.
 * ------------------------------------------------------------------ */

export type GreetKind = "resume" | "fresh";

let live: { stop: () => void } | null = null;

function stopLive() {
  const l = live;
  live = null;
  l?.stop();
}

/** The words, matching what /api/agent/greet synthesises for the same kind.
 *
 *  Duplicated between here and the route on purpose: the route composes the
 *  sentence server-side so the endpoint cannot be used as an open synthesiser,
 *  and the screen needs the same words to show as text when there is no audio.
 *  If one changes, change both — they are two renderings of one line, and a
 *  caption that disagrees with the audio is worse than no caption. */
export function greetingText(kind: GreetKind, name?: string | null): string {
  const who = name ? `, ${name}` : "";
  return kind === "resume"
    ? `Welcome back${who}. Let's carry on from where we stopped.`
    : `Hi${who}. Ready when you are — where would you like to start?`;
}

/* Two notes a fifth apart, the second a beat behind the first.
 *
 * Deliberately not a chord: two notes struck together read as a notification,
 * which is the register of an alert. Struck in sequence they read as an
 * opening — the same reason a doorbell has two tones and a smoke alarm has
 * one. Sine waves, because anything with harmonics on a phone speaker at this
 * length is a click. */
const CHIME: { hz: number; at: number; len: number; gain: number }[] = [
  { hz: 523.25, at: 0, len: 0.42, gain: 0.055 },
  { hz: 783.99, at: 0.11, len: 0.55, gain: 0.045 },
];

function playChime(): (() => void) | null {
  const Ctx =
    typeof window !== "undefined"
      ? window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      : undefined;
  if (!Ctx) return null;

  let ctx: AudioContext;
  try {
    ctx = new Ctx();
  } catch {
    return null;
  }

  const now = ctx.currentTime + 0.02;
  for (const n of CHIME) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = n.hz;

    /* An envelope, not a switch. A gain that jumps to its value and back
       produces a click at both ends — the discontinuity is a step function,
       which is broadband noise. 12ms in, exponential out. */
    gain.gain.setValueAtTime(0.0001, now + n.at);
    gain.gain.exponentialRampToValueAtTime(n.gain, now + n.at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + n.at + n.len);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now + n.at);
    osc.stop(now + n.at + n.len + 0.05);
  }

  const done = window.setTimeout(() => void ctx.close().catch(() => {}), 1400);
  return () => {
    window.clearTimeout(done);
    void ctx.close().catch(() => {});
  };
}

/**
 * Fetch and play the spoken line, if the account can make one.
 *
 * Resolves `true` when a voice actually played. Everything else — no key, a
 * dead upstream, a browser that refused to autoplay — resolves `false` without
 * throwing, because none of them is a thing to tell a student about.
 */
async function speak(kind: GreetKind, name: string | null, signal: AbortSignal): Promise<boolean> {
  let res: Response;
  try {
    const q = new URLSearchParams({ kind });
    if (name) q.set("name", name);
    res = await fetch(`/api/agent/greet?${q}`, { signal, cache: "no-store" });
  } catch {
    return false;
  }

  /* The route answers audio on success and JSON on every failure — see its
     header. Branching on the content type rather than on `res.ok` is what
     makes a 200-with-ok:false read as "no voice configured" rather than as a
     corrupt MP3. */
  if (!res.ok || !res.headers.get("content-type")?.startsWith("audio/")) return false;

  const blob = await res.blob().catch(() => null);
  if (!blob || signal.aborted) return false;

  const url = URL.createObjectURL(blob);
  const el = new Audio(url);
  el.preload = "auto";

  try {
    await el.play();
  } catch {
    /* Autoplay refused. Expected on iOS after a navigation — see the header. */
    URL.revokeObjectURL(url);
    return false;
  }

  const cleanup = () => URL.revokeObjectURL(url);
  el.addEventListener("ended", cleanup, { once: true });
  signal.addEventListener(
    "abort",
    () => {
      el.pause();
      cleanup();
    },
    { once: true },
  );
  return true;
}

/**
 * Greet the student. Returns a stop function.
 *
 * Fire-and-forget: nothing about the screen depends on it, and the caller is
 * expected to render `greetingText` regardless of whether a voice arrives.
 */
export function greet(kind: GreetKind, name?: string | null): () => void {
  stopLive();

  const ac = new AbortController();
  const stopChime = playChime();

  const handle = {
    stop() {
      ac.abort();
      stopChime?.();
    },
  };
  live = handle;

  /* The voice comes in behind the chime rather than over it. 420ms is the
     first note's length plus a breath — enough that they read as one arrival
     and not as two sounds fighting. */
  const t = window.setTimeout(() => {
    if (!ac.signal.aborted) void speak(kind, name ?? null, ac.signal);
  }, 420);

  const stop = () => {
    window.clearTimeout(t);
    if (live === handle) live = null;
    handle.stop();
  };
  return stop;
}
