/* Service worker AlloRécolte — permet l'installation en PWA et un accès
   hors-ligne basique aux pages déjà visitées. Démo volontairement simple :
   pas de gestion fine des mises à jour de contenu (voir README.md). */

const CACHE_NAME = "allorecolte-cache-v1";

// Fichiers essentiels ("app shell") mis en cache dès l'installation, pour
// que les pages principales s'ouvrent même hors connexion. Les images de
// produits/offres ne sont pas pré-chargées ici (ça alourdirait l'installation
// et il faudrait mettre à jour cette liste à chaque photo ajoutée) : elles
// sont mises en cache au fil de l'eau, la première fois qu'elles sont vues
// (voir le gestionnaire "fetch" plus bas).
const APP_SHELL = [
  "index.html",
  "acheteur.html",
  "appel.html",
  "mes-offres.html",
  "offres.html",
  "parametres.html",
  "sms.html",
  "css/style.css",
  "js/db.js",
  "js/icons.js",
  "js/site-i18n.js",
  "js/app.js",
  "js/offres.js",
  "js/acheteur.js",
  "js/mes-offres.js",
  "js/appel-i18n.js",
  "js/appel.js",
  "js/sms.js",
  "js/parametres.js",
  "js/pwa.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached); // hors ligne et rien en cache : la requête échoue normalement

      // Sert le cache immédiatement s'il existe (et le rafraîchit en tâche de
      // fond), sinon attend la réponse réseau.
      return cached || networkFetch;
    })
  );
});
