"use client";

import { useEffect } from "react";

/* Registers public/sw.js, which is what makes an already-read step readable
 * with no connection.
 *
 * Production only, deliberately. A service worker caches by URL, and in dev
 * every save rewrites the chunks behind those URLs — you end up debugging
 * yesterday's bundle. So on localhost this does the opposite job: it tears
 * down any worker still installed from a production visit, which is otherwise
 * a genuinely confusing thing to inherit on the same origin.
 *
 * Registration waits for `load`. The worker's whole value is on the *next*
 * visit, so competing with the first paint for bandwidth buys nothing. */
export function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
      return;
    }

    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // A failed registration costs nothing — the site works online as
        // it always has, so this must never surface to a reader.
      });
    };

    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
