/* ------------------------------------------------------------------ *
 * The spoken hello, synthesised server-side.
 *
 * Owner, 2026-08-23: "maybe even if I can get a sound in after the course card
 * is clicked and it opens, you get a sound where I say … 'let's continue from
 * where we started'."
 *
 * This is the one line the agent says before there is a conversation to have.
 * It deliberately does NOT go through the conversational agent: opening a
 * ConvAI session to say nine words costs a minute of conversation billing
 * (~$0.08) against a few tenths of a cent of text-to-speech, and it would put
 * a WebRTC negotiation in front of the first thing a student hears.
 *
 * SAME CONTRACT AS /api/agent/token, and for the same reasons — read that file
 * first. The key never leaves the server; a missing key answers 200 with
 * `ok: false` and a reason rather than throwing, because "voice isn't switched
 * on yet" is a product state and not an exception. The screen handles the
 * silent case on its own (see lib/greeting.ts: it still plays the arrival
 * chime, which needs no network and no account).
 *
 * ⚠️ THE TEXT IS NOT THE CALLER'S TO CHOOSE. It takes a `kind` and a name, and
 * composes the sentence here. An endpoint that synthesises arbitrary
 * client-supplied text is an open TTS proxy on someone else's bill, reachable
 * by anyone who can read the network tab. The cap below is the second half of
 * that: a name is a name, not a paragraph.
 * ------------------------------------------------------------------ */

export const dynamic = "force-dynamic";

type Reason = "no-key" | "no-voice" | "upstream" | "bad-response";

function fail(reason: Reason, detail?: string) {
  return Response.json({ ok: false, reason, detail }, { status: 200 });
}

/** ElevenLabs' cheapest current model that still sounds like a person. Cheap
 *  matters: this fires on every arrival at a course, and it is the one piece of
 *  audio a student hears whether or not they ever start a call. */
const MODEL = "eleven_turbo_v2_5";

/** Rachel — ElevenLabs' default library voice, so this works on a fresh account
 *  with nothing configured but a key. Override with ELEVENLABS_VOICE_ID, which
 *  is the same variable the session agent reads, so the greeting and the tutor
 *  are the same person by default rather than by coincidence. */
const FALLBACK_VOICE = "21m00Tcm4TlvDq8ikWAM";

/** What the greeting can say. Two states, because there are two: somebody who
 *  has been here before, and somebody who has not.
 *
 *  Kept short on purpose — it plays while the screen is still settling, and a
 *  sentence that outlasts the animation is a sentence the student is waiting
 *  through. No course name and no school name (see the standing rule): the
 *  student just tapped the course, so naming it back is the redundant-context
 *  label this project already decided against. */
function line(kind: string, name: string | null): string | null {
  const who = name ? `, ${name}` : "";
  if (kind === "resume") return `Welcome back${who}. Let's carry on from where we stopped.`;
  if (kind === "fresh") return `Hi${who}. Ready when you are — where would you like to start?`;
  return null;
}

export async function GET(req: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return fail("no-key");

  const voice = process.env.ELEVENLABS_VOICE_ID ?? FALLBACK_VOICE;
  if (!voice) return fail("no-voice");

  const params = new URL(req.url).searchParams;
  /* A first name, trimmed to something that is plausibly one. Anything longer
     is either a mistake or an attempt to use this as a synthesiser. */
  const raw = (params.get("name") ?? "").trim().slice(0, 24);
  const name = /^[\p{L}\p{M}' -]{1,24}$/u.test(raw) ? raw : null;

  const text = line(params.get("kind") ?? "fresh", name);
  if (!text) return fail("bad-response", "unknown greeting kind");

  let res: Response;
  try {
    res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_22050_32`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "content-type": "application/json" },
        body: JSON.stringify({ text, model_id: MODEL }),
        cache: "no-store",
      },
    );
  } catch (e) {
    return fail("upstream", e instanceof Error ? e.message : "fetch failed");
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return fail("upstream", res.status + " " + body.slice(0, 300));
  }

  const audio = await res.arrayBuffer().catch(() => null);
  if (!audio || audio.byteLength === 0) return fail("bad-response");

  /* The audio itself, not a JSON envelope — the caller hands this straight to
     an <audio> element. The failure paths above answer JSON, so a caller must
     branch on the content type; lib/greeting.ts does. */
  return new Response(audio, {
    status: 200,
    headers: {
      "content-type": "audio/mpeg",
      "content-length": String(audio.byteLength),
      "cache-control": "no-store",
    },
  });
}
