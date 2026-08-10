/* Service worker : rend les deux applications utilisables sans réseau.
   Stratégie « cache d'abord », avec rafraîchissement en arrière-plan. */

const VERSION = "v2";
const CACHE = `gammes-${VERSION}`;

// Ressources du même domaine : indispensables, l'installation échoue si l'une manque.
const SHELL = [
  "./",
  "./index.html",
  "./accords.html",
  "./progressions.html",
  "./gammes.webmanifest",
  "./accords.webmanifest",
  "./progressions.webmanifest",
  "./icons/gammes-180.png",
  "./icons/gammes-192.png",
  "./icons/gammes-512.png",
  "./icons/accords-180.png",
  "./icons/accords-192.png",
  "./icons/accords-512.png",
  "./icons/progressions-180.png",
  "./icons/progressions-192.png",
  "./icons/progressions-512.png",
];

// Librairies servies par le CDN : mises en cache au mieux, une seule
// indisponible ne doit pas faire échouer toute l'installation.
const VENDOR = [
  "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js",
];

async function cacheVendor(cache) {
  await Promise.allSettled(VENDOR.map(async url => {
    // cdnjs autorise le CORS ; on retombe sur une réponse opaque si besoin.
    let res = await fetch(url, { cache: "reload" }).catch(() => null);
    if (!res || !res.ok) res = await fetch(url, { mode: "no-cors", cache: "reload" }).catch(() => null);
    if (res) await cache.put(url, res);
  }));
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    await cacheVendor(cache);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) {
      // rafraîchissement silencieux pour la prochaine ouverture
      event.waitUntil((async () => {
        try {
          const fresh = await fetch(req);
          if (fresh && (fresh.ok || fresh.type === "opaque")) {
            const cache = await caches.open(CACHE);
            await cache.put(req, fresh);
          }
        } catch (e) { /* hors ligne : on garde la version en cache */ }
      })());
      return cached;
    }

    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === "opaque")) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch (e) {
      // navigation hors ligne vers une page non encore visitée
      if (req.mode === "navigate") {
        const fallback = await caches.match("./accords.html");
        if (fallback) return fallback;
      }
      throw e;
    }
  })());
});
