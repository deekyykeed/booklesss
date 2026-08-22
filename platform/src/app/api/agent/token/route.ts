/* ------------------------------------------------------------------ *
 * The one door between the browser and ElevenLabs.
 *
 * A session is a call to a private agent, and a private agent needs a
 * short-lived credential minted with the account's API key. THE KEY NEVER
 * LEAVES THE SERVER: it is read from the environment here, exchanged for a
 * credential that expires on its own, and only that is handed down. There is
 * deliberately no NEXT_PUBLIC_ELEVENLABS_API_KEY anywhere in this repo —
 * NEXT_PUBLIC_ is inlined into the bundle at build, so naming one would publish
 * the account's billing to every visitor.
 *
 * The agent id IS public (NEXT_PUBLIC_ELEVENLABS_AGENT_ID) and that is fine —
 * it identifies which agent, and the agent is set to require authorization, so
 * an id on its own opens nothing.
 *
 * TWO CREDENTIALS, BECAUSE THERE ARE TWO TRANSPORTS (2026-08-22, when the home
 * screen grew a box you can type into as well as talk to):
 *
 *   ?mode=voice (the default) → a WebRTC conversation token. Audio both ways.
 *   ?mode=text               → a signed WebSocket URL. No audio in either
 *                              direction, and the agent is told text_only so it
 *                              does not synthesise speech nobody will hear.
 *
 * They are not interchangeable and the SDK will not convert one into the other.
 * `conversationToken` forces WebRTC (see determineConnectionType in
 * @elevenlabs/client) and a WebRTC session opens a microphone; a text
 * conversation is a WebSocket, and the only private credential a WebSocket
 * accepts is a signed URL. Asking for the wrong one fails at connect time with
 * a transport error rather than anywhere near the code that chose it, which is
 * why the mode is decided here rather than in the component.
 *
 * IT FAILS SOFT AND SAYS WHY. Same contract as /api/profile and /api/reaction:
 * a missing key, a dead upstream or a bad response answers with `ok: false` and
 * a `reason` the caller can turn into a sentence. A student who cannot start a
 * conversation should be told the voice is not set up and offered the reading —
 * never shown a stack trace, and never left watching a spinner that will not
 * resolve. The reason codes are the contract; the UI switches on them.
 * ------------------------------------------------------------------ */

/* Credentials are short-lived and per-call, so this must never be cached — a
 * cached token is one that has already expired for the second student to ask. */
export const dynamic = "force-dynamic";

type Reason = "no-key" | "no-agent" | "upstream" | "bad-response";

function fail(reason: Reason, detail?: string) {
  /* 200, not 4xx/5xx. The client always gets JSON it can read, and a failed
   * mint is a product state ("voice isn't set up yet"), not an exception. */
  return Response.json({ ok: false, reason, detail }, { status: 200 });
}

export async function GET(req: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? process.env.ELEVENLABS_AGENT_ID;

  if (!key) return fail("no-key");
  if (!agentId) return fail("no-agent");

  const text = new URL(req.url).searchParams.get("mode") === "text";
  const endpoint = text
    ? "/convai/conversation/get-signed-url?agent_id="
    : "/convai/conversation/token?agent_id=";

  let res: Response;
  try {
    res = await fetch("https://api.elevenlabs.io/v1" + endpoint + encodeURIComponent(agentId), {
      headers: { "xi-api-key": key },
      cache: "no-store",
    });
  } catch (e) {
    return fail("upstream", e instanceof Error ? e.message : "fetch failed");
  }

  if (!res.ok) {
    /* ElevenLabs puts the useful part in the body — a wrong agent id and an
     * out-of-credit account are both 4xx and mean completely different things
     * to whoever is debugging. Truncated because it is going into a log, not
     * onto a student's screen. */
    const body = await res.text().catch(() => "");
    return fail("upstream", res.status + " " + body.slice(0, 300));
  }

  const data = (await res.json().catch(() => null)) as
    | { token?: string; signed_url?: string }
    | null;

  /* One shape out, whichever way in. The caller passes `credential` to
     startSession as `conversationToken` or `signedUrl` according to the mode it
     asked for — `mode` is echoed so a response can never be read as the other
     kind by a caller that forgot what it requested. */
  const credential = text ? data?.signed_url : data?.token;
  if (!credential) return fail("bad-response");

  return Response.json(
    { ok: true, mode: text ? "text" : "voice", credential, token: credential },
    { status: 200 },
  );
}
