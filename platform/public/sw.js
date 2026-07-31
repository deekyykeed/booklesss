/* Booklesss service worker — makes a step you've already opened readable with
 * no connection, and lets the reader be installed to a phone's home screen.
 *
 * Nothing is precached. A precache manifest would have to name every hashed
 * chunk of a build, which means generating it at build time and regenerating it
 * on every deploy. Instead this caches what a reader actually touches, which
 * for a course reader is the right set anyway: the steps they're studying.
 *
 * Three strategies, by what the thing is:
 *
 *   /_next/static/* and fonts   cache-first    filenames carry a content hash,
 *                                              so a cached copy can never be
 *                                              stale — only unused.
 *   page + RSC navigations      network-first   always show live content when
 *                                              online; fall back to the last
 *                                              copy seen when offline.
 *   everything else same-origin network-first   same reasoning, no fallback page.
 *
 * Bump VERSION to evict every cache on the next visit. */
const VERSION = "v1";
const ASSETS = `booklesss-assets-${VERSION}`;
const PAGES = `booklesss-pages-${VERSION}`;
const DATA = `booklesss-rsc-${VERSION}`;
const KEEP = new Set([ASSETS, PAGES, DATA]);

const OFFLINE_URL = "/offline";

/* Immutable by construction: Next fingerprints these filenames, so a changed
 * file is a changed URL and a cached hit is always correct. */
const isHashedAsset = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  /\.(woff2?|ttf|otf|png|jpe?g|svg|webp|avif|ico)$/i.test(url.pathname);

/* Next's client router fetches these instead of HTML when you tap a link in the
 * sidebar. They must be cached separately from pages: same route, different
 * body, and handing one back in place of the other renders nothing. */
const isRscRequest = (request) =>
  request.headers.get("RSC") === "1" || new URL(request.url).searchParams.has("_rsc");

self.addEventListener("install", (event) => {
  // The offline page is the one thing worth having before it's needed — by
  // definition it can't be fetched at the moment it's wanted.
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: "reload" })))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !KEEP.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Serve from cache, and refresh the entry in the background for next time. */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;

  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

/** Prefer the network; fall back to whatever was last stored. */
async function networkFirst(request, cacheName, fallback) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    // Opaque and error responses are not worth keeping — caching a 404 would
    // pin it in place until the version bumps.
    if (response.ok && response.type === "basic") cache.put(request, response.clone());
    return response;
  } catch {
    const hit = await cache.match(request);
    if (hit) return hit;
    if (fallback) {
      const offline = await cache.match(fallback);
      if (offline) return offline;
    }
    throw new Error("offline and nothing cached");
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only GETs are cacheable, and only this origin is ours to serve.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Let Next's own dev/build endpoints and any API route go straight through.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/webpack")) return;

  if (isHashedAsset(url)) {
    event.respondWith(cacheFirst(request, ASSETS));
    return;
  }

  if (isRscRequest(request)) {
    // No fallback: when this fails, Next gives up on the client-side
    // navigation and does a full page load, which lands on the handler below
    // and gets the cached page. A wrong body here would render a blank screen.
    event.respondWith(networkFirst(request, DATA));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, PAGES, OFFLINE_URL));
    return;
  }

  event.respondWith(networkFirst(request, PAGES));
});

/* Lets the page activate a waiting worker without a second reload. */
self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});
