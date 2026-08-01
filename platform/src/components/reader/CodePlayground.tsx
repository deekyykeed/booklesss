"use client";

import { useEffect, useRef, useState } from "react";

/*
 * A runnable code playground. JavaScript runs in a throwaway Web Worker;
 * Python runs in a persistent Pyodide (CPython → WASM) worker loaded from
 * /py-worker.js. Both are isolated from the page and force-terminable, so an
 * infinite loop can't freeze the app. console.log / print() are captured.
 */

type Lang = "javascript" | "python";
type Line = { type: "log" | "warn" | "error" | "muted"; text: string };

const PY_DEFAULT = `# Economics in code — revenue = price × quantity
price = 4        # $ per coffee
quantity = 100   # cups sold today

revenue = price * quantity
print("Revenue: $" + str(revenue))

# Opportunity cost: the value of the best thing you gave up
wage_from_shift = 80
value_of_resting = 60
print("Opportunity cost of resting: $" + str(wage_from_shift - value_of_resting))`;

// JS runs in a fresh blob worker each time (no importScripts needed).
const JS_WORKER_SRC = `
  const logs = [];
  const fmt = (v) => {
    if (typeof v === "string") return v;
    if (v instanceof Error) return v.name + ": " + v.message;
    try { return typeof v === "object" ? JSON.stringify(v) : String(v); }
    catch { return String(v); }
  };
  const push = (type) => (...a) => logs.push({ type, text: a.map(fmt).join(" ") });
  self.console = { log: push("log"), info: push("log"), debug: push("log"), warn: push("warn"), error: push("error") };
  self.onmessage = (e) => {
    try { (0, eval)(e.data); self.postMessage({ ok: true, logs }); }
    catch (err) {
      logs.push({ type: "error", text: (err && err.message) ? (err.name + ": " + err.message) : String(err) });
      self.postMessage({ ok: false, logs });
    }
  };
`;

const PANEL_SHADOW =
  "0 1px 1px -0.5px rgba(0,0,0,0.05), 0 3px 3px -1.5px rgba(0,0,0,0.05), 0 6px 6px -3px rgba(0,0,0,0.06), 0 12px 12px -6px rgba(0,0,0,0.07), 0 24px 24px -12px rgba(0,0,0,0.06)";

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function CodePlayground({ code: initialJs }: { code: string }) {
  const [language, setLanguage] = useState<Lang>("javascript");
  const [codes, setCodes] = useState<Record<Lang, string>>({ javascript: initialJs, python: PY_DEFAULT });
  const [output, setOutput] = useState<Line[] | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Ready");

  const code = codes[language];
  const setCode = (v: string) => setCodes((c) => ({ ...c, [language]: v }));

  // persistent Python worker (Pyodide is expensive to load, so reuse it)
  const pyWorker = useRef<Worker | null>(null);
  const pyReady = useRef(false);
  useEffect(() => () => pyWorker.current?.terminate(), []);

  const finish = (logs: Line[], ok: boolean, ms: number, emptyHint: string) => {
    setOutput(logs.length ? logs : [{ type: "muted", text: emptyHint }]);
    setStatus(ok ? `Ran in ${ms} ms` : "Finished with an error");
    setRunning(false);
  };

  const runJs = () => {
    const url = URL.createObjectURL(new Blob([JS_WORKER_SRC], { type: "application/javascript" }));
    const worker = new Worker(url);
    const done = () => { worker.terminate(); URL.revokeObjectURL(url); };
    const t0 = performance.now();
    const timer = setTimeout(() => {
      done();
      setOutput([{ type: "error", text: "Execution timed out (possible infinite loop)." }]);
      setStatus("Timed out");
      setRunning(false);
    }, 3000);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      done();
      finish(e.data?.logs ?? [], !!e.data?.ok, Math.max(1, Math.round(performance.now() - t0)), "(no output — add a console.log)");
    };
    worker.onerror = () => { clearTimeout(timer); done(); setOutput([{ type: "error", text: "Couldn't run this code." }]); setStatus("Error"); setRunning(false); };
    worker.postMessage(code);
  };

  const runPython = () => {
    const firstLoad = !pyReady.current;
    setStatus(firstLoad ? "Loading Python… (first run only)" : "Running…");
    if (!pyWorker.current) pyWorker.current = new Worker("/py-worker.js");
    const worker = pyWorker.current;

    let runTimer: ReturnType<typeof setTimeout> | null = null;
    const t0Ref = { t: 0 };
    const loadGuard = setTimeout(() => {
      worker.removeEventListener("message", onMsg);
      setOutput([{ type: "error", text: "The Python runtime took too long to load. Check your connection and try again." }]);
      setStatus("Error");
      setRunning(false);
    }, 45000);

    const onMsg = (e: MessageEvent) => {
      const m = e.data;
      if (m.type === "ready") {
        clearTimeout(loadGuard);
        pyReady.current = true;
        setStatus("Running…");
        t0Ref.t = performance.now();
        runTimer = setTimeout(() => {
          worker.terminate();
          pyWorker.current = null;
          pyReady.current = false;
          worker.removeEventListener("message", onMsg);
          setOutput([{ type: "error", text: "Execution timed out (possible infinite loop)." }]);
          setStatus("Timed out");
          setRunning(false);
        }, 8000);
        worker.postMessage({ cmd: "run", code });
      } else if (m.type === "result") {
        clearTimeout(loadGuard);
        if (runTimer) clearTimeout(runTimer);
        worker.removeEventListener("message", onMsg);
        finish(m.logs ?? [], !!m.ok, Math.max(1, Math.round(performance.now() - t0Ref.t)), "(no output — try print())");
      }
    };
    worker.addEventListener("message", onMsg);
    worker.onerror = () => {
      clearTimeout(loadGuard);
      worker.removeEventListener("message", onMsg);
      pyWorker.current = null;
      pyReady.current = false;
      setOutput([{ type: "error", text: "Couldn't start Python." }]);
      setStatus("Error");
      setRunning(false);
    };
    worker.postMessage({ cmd: "init" });
  };

  const run = () => {
    if (running) return;
    setRunning(true);
    setStatus("Running…");
    if (language === "python") runPython();
    else runJs();
  };

  const reset = () => {
    setCode(language === "python" ? PY_DEFAULT : initialJs);
    setOutput(null);
    setStatus("Ready");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const next = code.slice(0, s) + "  " + code.slice(ta.selectionEnd);
      setCode(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2; });
    } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
  };

  const lineColor = (t: Line["type"]) =>
    t === "error" ? "text-[#c0392b]" : t === "warn" ? "text-[#b7791f]" : t === "muted" ? "text-placeholder" : "text-[#2b2b2b]";

  return (
    <div className="squircle overflow-hidden rounded-[32px] bg-white/85" style={{ boxShadow: PANEL_SHADOW }}>
      {/* toolbar */}
      <div className="flex items-center gap-2 border-b border-[#f0f0f0] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </span>
        <span className="ml-1 font-mono text-[12px] text-muted">
          {language === "python" ? "playground.py" : "playground.js"}
        </span>
        <div className="squircle ml-auto flex items-center gap-0.5 rounded-lg bg-[#f2f2f2] p-0.5 text-[11px] font-medium">
          {(["javascript", "python"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => { setLanguage(l); setOutput(null); setStatus("Ready"); }}
              className={"squircle rounded-md px-2 py-1 transition-colors " + (language === l ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink")}
            >
              {l === "javascript" ? "JavaScript" : "Python"}
            </button>
          ))}
        </div>
      </div>

      {/* editor */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        rows={code.split("\n").length + 1}
        style={{ tabSize: 2 }}
        className="block max-h-[440px] min-h-[150px] w-full resize-y bg-white px-4 py-3.5 font-mono text-[13px] leading-6 text-ink caret-[#0b0b0b] outline-none"
        aria-label="Code editor"
      />

      {/* output */}
      <div className="min-h-[72px] border-t border-[#f0f0f0] bg-[#fbfbfb] px-4 py-3 font-mono text-[12.5px] leading-6">
        {output ? (
          output.map((l, i) => (
            <div key={i} className={lineColor(l.type)}>
              <span className="mr-2 select-none text-[#cfcfcf]">›</span>
              <span className="whitespace-pre-wrap break-words">{l.text}</span>
            </div>
          ))
        ) : (
          <div className="text-placeholder">
            <span className="mr-2 select-none">›</span>Run the code to see its output.
          </div>
        )}
      </div>

      {/* controls */}
      <div className="flex items-center justify-between gap-3 border-t border-[#f0f0f0] px-4 py-3">
        <span className="text-[12px] text-muted">{status}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="squircle rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted transition-colors hover:bg-active hover:text-ink"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="squircle inline-flex items-center gap-1.5 rounded-lg bg-[#0b0b0b] px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {running ? <Spinner /> : <PlayIcon />}
            {running ? "Running…" : "Run"}
          </button>
        </div>
      </div>
    </div>
  );
}
