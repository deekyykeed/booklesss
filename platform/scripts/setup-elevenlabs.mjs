/* Create the one agent every session talks to.
 *
 *   ELEVENLABS_API_KEY=sk_... node scripts/setup-elevenlabs.mjs
 *
 * ONE AGENT SERVES ALL ~48 SESSIONS, and that is the whole design. What the
 * agent teaches arrives per call as a prompt override built by lib/session.ts
 * from the course content, so this script runs ONCE and never again as courses
 * grow. The alternative — an agent per session — is forty-eight dashboard
 * objects that go stale the moment a step is rewritten, and nobody would
 * remember to update them.
 *
 * It is safe to re-run. Existing tools and agents with the same name are found
 * and reused rather than duplicated; only what is missing gets created.
 *
 * WHAT IT SETS UP
 *   1. `show_point` — the client tool that pins a line to the student's
 *      screen. Registered in SessionCall.tsx under exactly this name, which is
 *      case-sensitive on both sides.
 *   2. The agent, with client overrides for prompt and first_message ENABLED.
 *      Without that permission ElevenLabs silently ignores the override and
 *      every session in every course gets the placeholder prompt below — which
 *      would look like the agent "not knowing the material" rather than like a
 *      settings problem, so it is the first thing to check if that ever
 *      happens.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* Read .env.local when the variable is not already in the environment.
 *
 * Next loads that file for the app, but a plain `node scripts/…` run does not,
 * and the instructions in .env.local tell you to paste the key there and then
 * run `npm run setup:voice` — so without this the documented path fails with
 * "ELEVENLABS_API_KEY is not set" while the key is sitting right there in the
 * file it told you to put it in. An explicit env var still wins, so a one-off
 * `ELEVENLABS_API_KEY=sk_… npm run setup:voice` overrides the file. */
function loadEnvLocal() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const file = path.join(here, "..", ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/);
    if (!m) continue;
    const [, k, v] = m;
    if (process.env[k] === undefined || process.env[k] === "") {
      process.env[k] = v.trim().replace(/^["']|["']$/g, "");
    }
  }
}
loadEnvLocal();

const API = "https://api.elevenlabs.io/v1";
const KEY = process.env.ELEVENLABS_API_KEY;

const TOOL_NAME = "show_point";
const AGENT_NAME = "Booklesss study partner";

/* The default is the cheap one on purpose: this is read on Zambian mobile data
 * by students paying kwacha, and a session is ~12 minutes of continuous LLM
 * turns. Raise it with ELEVENLABS_LLM if the agent starts skipping beats or
 * forgetting to pin — tool-calling reliability is the thing that degrades
 * first, and it is the feature. */
const LLM = process.env.ELEVENLABS_LLM || "gpt-4o-mini";
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || null;

if (!KEY) {
  console.error(
    "\nELEVENLABS_API_KEY is not set.\n\n" +
      "  Get one at https://elevenlabs.io/app/settings/api-keys\n" +
      "  Then:  ELEVENLABS_API_KEY=sk_... node scripts/setup-elevenlabs.mjs\n",
  );
  process.exit(1);
}

async function call(path, init = {}) {
  const res = await fetch(API + path, {
    ...init,
    headers: {
      "xi-api-key": KEY,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* non-JSON error page */
  }
  return { ok: res.ok, status: res.status, json, text };
}

/* ---------------------------------------------------------------- *
 * 1. the tool
 * ---------------------------------------------------------------- */

/* The current REST docs describe `parameters` as a JSON Schema object, while
 * the SDK examples still show an array of parameter descriptors. Rather than
 * bet on one, try the documented shape and fall back — a setup script that
 * fails on an API shape change is a script that blocks the whole feature for
 * whoever runs it next. Whichever worked is printed. */
const TOOL_DESCRIPTION =
  "Pin one short line to the student's screen, where it stays for the rest of " +
  "the call. Use it when you land something worth writing down: a definition, " +
  "a rule, a formula, or a distinction people commonly get wrong. This is not " +
  "a transcript — do not call it for ordinary conversation.";

const PARAM_TEXT =
  "The line to pin. One sentence, under about twenty words, and it must make " +
  "sense on its own when read later with the call over.";
const PARAM_KIND =
  "What kind of line this is. One of: key, warning, example, formula, point. " +
  "Use 'point' if unsure.";

const toolBodies = [
  {
    label: "json-schema",
    body: {
      tool_config: {
        type: "client",
        name: TOOL_NAME,
        description: TOOL_DESCRIPTION,
        expects_response: false,
        parameters: {
          type: "object",
          properties: {
            text: { type: "string", description: PARAM_TEXT },
            kind: { type: "string", description: PARAM_KIND },
          },
          required: ["text"],
        },
      },
    },
  },
  {
    label: "parameter-array",
    body: {
      tool_config: {
        type: "client",
        name: TOOL_NAME,
        description: TOOL_DESCRIPTION,
        expects_response: false,
        parameters: [
          { id: "text", type: "string", value_type: "llm_prompt", description: PARAM_TEXT, required: true },
          { id: "kind", type: "string", value_type: "llm_prompt", description: PARAM_KIND, required: false },
        ],
      },
    },
  },
];

async function ensureTool() {
  const list = await call("/convai/tools");
  if (list.ok) {
    const tools = list.json?.tools ?? list.json ?? [];
    const found = Array.isArray(tools)
      ? tools.find((t) => (t?.tool_config?.name ?? t?.name) === TOOL_NAME)
      : null;
    if (found?.id) {
      console.log("  · tool  " + TOOL_NAME + " already exists → " + found.id);
      return found.id;
    }
  }

  for (const attempt of toolBodies) {
    const res = await call("/convai/tools", { method: "POST", body: JSON.stringify(attempt.body) });
    if (res.ok && res.json?.id) {
      console.log("  · tool  " + TOOL_NAME + " created (" + attempt.label + ") → " + res.json.id);
      return res.json.id;
    }
    console.log("    ↳ " + attempt.label + " rejected (" + res.status + "): " + res.text.slice(0, 200));
  }
  throw new Error("could not create the " + TOOL_NAME + " tool — see the responses above");
}

/* ---------------------------------------------------------------- *
 * 2. the agent
 * ---------------------------------------------------------------- */

/* Never actually used at runtime — every call overrides it. It exists so that
 * a test from the ElevenLabs dashboard does something sensible, and so that a
 * session which somehow loses its override degrades into a polite tutor rather
 * than a confused one. */
const PLACEHOLDER_PROMPT =
  "You are a study partner for a university student, on a voice call. Keep " +
  "turns to two or three sentences and let them react. Plain spoken English; " +
  "never read out punctuation or markdown. Money is kwacha. If you have not " +
  "been given material for this session, say so plainly and ask what they " +
  "want to go over. Never mention exams, marks or revision, and never name a " +
  "school or a course code.";

/* THE LOAD-BEARING PERMISSION, in one place because two things need it.
 *
 * `prompt` + `first_message` are what let one agent serve every session and
 * every question asked from the home screen — the brief travels up per call.
 * `text_only` is what lets the ask box hold a TYPED conversation without the
 * account paying to synthesise speech nobody will hear.
 *
 * Without it, an override is refused and the SOCKET IS CLOSED: code 1008,
 * "Override for field 'prompt' is not allowed by config". On WebRTC the same
 * refusal is quieter — the call runs on PLACEHOLDER_PROMPT, which looks like
 * the agent "not knowing the material" rather than like a settings problem.
 * Either way it is the first thing to check.
 *
 * ⚠️ THE FIELD IS `platform_settings.overrides.conversation_config_override`,
 * AND THE SHAPE MIRRORS THE AGENT'S OWN CONFIG. Two traps, both paid for on
 * 2026-08-22:
 *
 *   · this was written as `client_overrides.conversation_config`. A PATCH with
 *     that key returns 200 and stores NOTHING under it — the name the API reads
 *     back is the one above.
 *   · `first_message` is a SIBLING of `prompt`, not a key inside it. Written as
 *     `prompt: { prompt: true, first_message: true }` the whole `prompt` subtree
 *     is discarded, so `prompt.prompt` lands as FALSE — which is how a PATCH
 *     meant to add one permission silently removed the one that was working.
 *
 * Which is why ensureAgent reads the agent back and prints what actually
 * stuck. A 200 from this endpoint says the request parsed, not that the
 * setting exists. */
const OVERRIDES = {
  conversation_config_override: {
    agent: { prompt: { prompt: true }, first_message: true },
    conversation: { text_only: true },
  },
};

/** What the agent really has, straight from the API. `null` if it cannot say. */
async function readOverrides(agentId) {
  const res = await call("/convai/agents/" + agentId);
  const o = res.json?.platform_settings?.overrides?.conversation_config_override;
  if (!o) return null;
  return {
    prompt: o.agent?.prompt?.prompt === true,
    first_message: o.agent?.first_message === true,
    text_only: o.conversation?.text_only === true,
  };
}

/** Sets the permissions and REPORTS WHAT STUCK, never what was sent. */
async function confirmOverrides(agentId) {
  const patch = await call("/convai/agents/" + agentId, {
    method: "PATCH",
    body: JSON.stringify({ platform_settings: { overrides: OVERRIDES } }),
  });
  if (!patch.ok) {
    console.log("  ⚠ override PATCH failed (" + patch.status + "): " + patch.text.slice(0, 200));
  }
  const got = await readOverrides(agentId);
  if (!got) {
    console.log("  ⚠ could not read the agent's overrides back — check them in the dashboard");
    return;
  }
  const missing = Object.entries(got).filter(([, v]) => !v).map(([k]) => k);
  console.log(
    missing.length
      ? "  ⚠ overrides NOT set: " + missing.join(", ") + " — sessions or the ask box will not work"
      : "  · overrides confirmed (prompt, first_message, text_only)",
  );
}

async function ensureAgent(toolId) {
  const list = await call("/convai/agents?page_size=100");
  if (list.ok) {
    const agents = list.json?.agents ?? [];
    const found = agents.find((a) => a?.name === AGENT_NAME);
    if (found?.agent_id) {
      console.log("  · agent " + AGENT_NAME + " already exists → " + found.agent_id);
      /* REPAIR, don't just report. This script's contract is that re-running it
       * is safe and brings the account up to date; an agent created before
       * text_only was needed would otherwise stay half-configured forever, and
       * the symptom — a typed conversation whose socket closes on 1008 — points
       * at the app rather than at a setting. */
      await confirmOverrides(found.agent_id);
      return { id: found.agent_id, created: false };
    }
  }

  const body = {
    name: AGENT_NAME,
    conversation_config: {
      agent: {
        first_message: "",
        language: "en",
        prompt: { prompt: PLACEHOLDER_PROMPT, llm: LLM, tool_ids: [toolId], temperature: 0.4 },
      },
      /* Flash: latency is what makes a call feel like a conversation instead
       * of a walkie-talkie, and it matters more here than timbre. */
      tts: { model_id: "eleven_flash_v2", ...(VOICE_ID ? { voice_id: VOICE_ID } : {}) },
      turn: { turn_timeout: 10 },
      conversation: {
        /* Twenty minutes. A session is billed by the minute and a call left
         * open in a backgrounded tab is the expensive failure mode; the longest
         * session is ~15 minutes of material, so this is a ceiling with room,
         * not a limit anyone should reach. */
        max_duration_seconds: 1200,
      },
    },
    /* See OVERRIDES above — the permission without which every override is
       refused. Read back and reported by confirmOverrides after creation, for
       the reason documented there. */
    platform_settings: { overrides: OVERRIDES },
  };

  const res = await call("/convai/agents/create", { method: "POST", body: JSON.stringify(body) });
  if (!res.ok || !res.json?.agent_id) {
    throw new Error("agent create failed (" + res.status + "): " + res.text.slice(0, 400));
  }
  console.log("  · agent " + AGENT_NAME + " created → " + res.json.agent_id);
  await confirmOverrides(res.json.agent_id);
  return { id: res.json.agent_id, created: true };
}

/* ---------------------------------------------------------------- */

async function main() {
  console.log("\nSetting up ElevenLabs for Booklesss sessions\n");
  const toolId = await ensureTool();
  const agent = await ensureAgent(toolId);

  console.log(
    "\n" +
      "Done. Add this to platform/.env.local, and to Vercel\n" +
      "(Settings → Environment Variables, Production + Preview):\n\n" +
      "  NEXT_PUBLIC_ELEVENLABS_AGENT_ID=" +
      agent.id +
      "\n  ELEVENLABS_API_KEY=<the same key you just used>\n\n" +
      "The API key is server-only — it is read by /api/agent/token and never\n" +
      "reaches the browser. Do NOT give it a NEXT_PUBLIC_ prefix.\n",
  );

  if (!VOICE_ID) {
    console.log(
      "No ELEVENLABS_VOICE_ID was set, so the agent uses the account default.\n" +
        "Pick a voice in the dashboard, or re-run with ELEVENLABS_VOICE_ID=<id>.\n",
    );
  }
}

main().catch((e) => {
  console.error("\n" + (e?.message ?? e) + "\n");
  process.exit(1);
});
