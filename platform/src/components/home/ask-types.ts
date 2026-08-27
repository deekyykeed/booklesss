/* The contract between the box and the engine behind it.
 *
 * Its own file, and that is the whole point: AskDock must not import
 * ask-engine.tsx, because importing it is what would pull the ElevenLabs
 * WebRTC stack into the dashboard's first load. A `import type` from the
 * engine would be erased at build and would be safe — but only until somebody
 * adds a value to that import, at which point the dashboard silently gains a
 * few hundred kilobytes and nothing says so. A types-only module cannot be
 * broken that way.
 */

/** Where a conversation is, in the words the composer switches on. */
export type AskPhase = "idle" | "connecting" | "live" | "ended";

/**
 * One thing in the thread.
 *
 * A pin is an item like any other, sitting in arrival order between the
 * messages, rather than a separate stack down the side. That is deliberate: in
 * a typed conversation the point the agent decided was worth keeping belongs
 * exactly where it was made. In a VOICE call there are no `you`/`agent` items
 * at all — the pins are the only thing on screen, because a transcript is the
 * reading this replaces, in pieces (see study/PointStack).
 */
export type AskItem = NewAskItem & { id: number };

/**
 * The same thing before the thread gives it a number.
 *
 * Spelled out rather than written `Omit<AskItem, "id">`, because Omit over a
 * UNION does not distribute — it collapses to the keys every member shares, so
 * a pin's `kind` silently stops being a legal property and the tool call that
 * creates one stops compiling for a reason that names the wrong thing.
 */
export type NewAskItem =
  | { role: "you" | "agent"; text: string }
  | { role: "pin"; text: string; kind: PinKind };

export type PinKind = "key" | "warning" | "example" | "formula" | "point";

/** What the composer can do to a live conversation it does not own. */
export type AskControls = {
  /** A typed turn. Valid in a voice call too — the agent answers out loud. */
  send: (text: string) => void;
  hangUp: () => void;
  setMuted: (muted: boolean) => void;
  /**
   * Loudness, 0..1, right now.
   *
   * A GETTER, NOT A VALUE, and that is the whole reason it is on the controls
   * rather than being pushed up as a prop: it changes sixty times a second and
   * is written straight onto a CSS variable. Handing it up as state would
   * re-render whatever holds it on every frame, which on a mid-range Android is
   * how a call starts dropping them.
   *
   * Added 2026-08-27 for the home dock, whose big button draws the meter
   * ITSELF — the engine renders no panel there (`chrome: "none"`), so the bars
   * are no longer inside the component that owns the audio graph. Returns 0
   * before the graph exists, which is the first few frames of every call.
   */
  getLevel: () => number;
};
