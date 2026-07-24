/* Python runtime for the code playground.
 * Real CPython compiled to WebAssembly (Pyodide), running in a Web Worker.
 * Served same-origin so importScripts() can pull Pyodide from the CDN. */

let py = null;

self.onmessage = async (e) => {
  const m = e.data;

  if (m.cmd === "init") {
    try {
      if (!py) {
        importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
        py = await loadPyodide();
      }
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({
        type: "result",
        ok: false,
        logs: [{ type: "error", text: "Failed to load the Python runtime: " + String((err && err.message) || err) }],
      });
    }
    return;
  }

  if (m.cmd === "run") {
    const logs = [];
    py.setStdout({ batched: (s) => logs.push({ type: "log", text: s }) });
    py.setStderr({ batched: (s) => logs.push({ type: "error", text: s }) });
    try {
      await py.runPythonAsync(m.code);
      self.postMessage({ type: "result", ok: true, logs });
    } catch (err) {
      logs.push({ type: "error", text: String((err && err.message) || err) });
      self.postMessage({ type: "result", ok: false, logs });
    }
  }
};
