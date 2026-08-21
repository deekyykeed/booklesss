/* ------------------------------------------------------------------ *
 * The one door between the browser and ElevenLabs.
 *
 * A session is a WebRTC call to a private agent, and a private agent needs a
 * short-lived token minted with the account's API key. THE KEY NEVER LEAVES
 * THE SERVER: it is read from the environment here, exchanged for a token that
 * expires on its own, and only the token is handed down. There is deliberately
 * no NEXT_PUBLIC_ELEVENLABS_API_KEY anywhere in this repo — NEXT_PUBLIC_ is
 * inlined into the bundle at build, so naming one would publish the account's
 * billing to every visitor.
 *
 * The agent id IS public (NEXT_PUBLIC_ELEVENLABS_AGENT_ID) and that is fine —
 * it identifies which agent, and the agent is set to require authorization, so
 * an id on its own opens nothing.
 *
 * IT FAILS SOFT AND SAYS WHY. Same contract as /api/profile and /api/reaction:
 * a missing key, a dead upstream or a bad response answers with `ok: false` and
 * a `reason` the call screen can turn into a sentence. A student who cannot
 * start a call should be told the voice is not set up and offered the reading —
 * never shown a stack trace, and never left watching a spinner that will not
 * resolve. The reason codes are the contract; the UI switches on them.
 * ------------------------------------------------------------------ */

/* Tokens are short-lived and per-call, so this must never be cached — a cached
 * token is one that has already expired for the second student to ask. */
export const dynamic = "force-dynamic";

type Reason = "no-key" | "no-agent" | "upstream" | "bad-response";

function fail(reason: Reason, detail?: string) {
  /* 200, not 4xx/5xx. The client always gets JSON it can read, and a failed
   * mint is a product state ("voice isn't set up yet"), not an exception. */
  return Response.json({ ok: false, reason, detail }, { status: 200 });
}

export async function GET() {
  const key = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? process.env.ELEVENLABS_AGENT_ID;

  if (!key) return fail("no-key");
  if (!agentId) return fail("no-agent");

  let res: Response;
  try {
    res = await fetch(
      "https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=" + encodeURIComponent(agentId),
      { headers: { "xi-api-key": key }, cache: "no-store" },
    );
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

  const data = (await res.json().catch(() => null)) as { token?: string } | null;
  if (!data?.token) return fail("bad-response");

  return Response.json({ ok: true, token: data.token }, { status: 200 });
}
