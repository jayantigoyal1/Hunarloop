/* Public app shell only. Student answers and localStorage are never cached here. */
const CACHE = "hunarloop-shell-v2";
const ROUTES = ["/", "/onboarding", "/passport", "/games", "/games/results", "/comfort", "/careers", "/roadmap", "/opportunities", "/rewards", "/circles", "/parent", "/teacher"];
const PUBLIC_FILES = ["/manifest.json", "/icons/hunarloop.svg", "/icons/hunarloop-192.png", "/icons/hunarloop-512.png", "/offline.html"];
const ALLOWED = new Set(ROUTES);

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const responses = await Promise.allSettled([...ROUTES, ...PUBLIC_FILES].map(async (path) => {
      const response = await fetch(path, { cache: "reload" });
      if (!response.ok) throw new Error(path);
      await cache.put(path, response.clone());
      if (response.headers.get("content-type")?.includes("text/html")) {
        const html = await response.text();
        return [...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"?]+)(?:\?[^"]*)?"/g)].map((match) => match[1]);
      }
      return [];
    }));
    const assets = [...new Set(responses.flatMap((result) => result.status === "fulfilled" ? result.value : []))];
    await Promise.allSettled(assets.map(async (path) => {
      const response = await fetch(path, { cache: "reload" });
      if (response.ok) await cache.put(path, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith("hunarloop-shell-") && name !== CACHE).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/_next/static/") || PUBLIC_FILES.includes(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(url.pathname);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) { const cache = await caches.open(CACHE); await cache.put(url.pathname, response.clone()); }
      return response;
    })());
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok && ALLOWED.has(url.pathname)) { const cache = await caches.open(CACHE); await cache.put(url.pathname, response.clone()); }
        return response;
      } catch {
        return await caches.match(url.pathname) || await caches.match("/offline.html") || Response.error();
      }
    })());
  }
});
