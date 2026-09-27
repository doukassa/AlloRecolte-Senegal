/* Enregistrement du service worker : rend le site "installable" (PWA) sur
   un téléphone ou un ordinateur, et permet de rouvrir les pages déjà
   visitées même sans connexion. Sans effet si le navigateur ne supporte
   pas les service workers (le site continue de fonctionner normalement). */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      /* installation impossible (navigateur trop ancien, ou site ouvert
         directement depuis un fichier local plutôt qu'en https://) */
    });
  });
}
