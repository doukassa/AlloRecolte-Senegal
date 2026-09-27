/* Page : acheteur.html — "Suivi des commandes"
   -------------------------------------------------------------
   Ce n'est plus un tableau de bord avec sa propre recherche produit :
   trouver un fermier se fait maintenant depuis le catalogue (index.html,
   voir js/app.js), qui est la page d'accueil du profil Acheteur. Cette
   page-ci ne montre que les fermiers déjà contactés (statut différent
   de "Nouveau match") — c'est-à-dire soit les offres de démonstration
   déjà avancées au départ, soit celles que l'acheteur vient de
   contacter lui-même depuis offres.html (voir arMarkContacted dans
   js/db.js). Les offres jamais contactées n'ont rien à faire ici.

   Statut manuel : sur chaque carte, un seul élément affiche le statut ET
   permet de le changer — un <select> stylé comme la pastille de statut
   (.pill-select, voir css/style.css), plutôt qu'une pastille en lecture
   seule à côté d'un menu séparé qui répétait la même information. Options
   : "Contacté" / "Transaction convenue" (voir arSetStatut dans js/db.js).
   "Nouveau match" n'est volontairement jamais une option ici, cette page
   ne concernant que des fermiers déjà contactés.

   Limite d'affichage : au plus 20 échanges, les plus récents en premier
   (triés par date). Les données de démo elles-mêmes ont aussi été
   réduites pour ne compter que 20 offres "Contacté"/"Transaction
   convenue" au départ (voir js/db.js) ; cette limite d'affichage reste
   là comme filet de sécurité si l'acheteur contacte encore plus de
   fermiers pendant la démo. */

const SUIVI_MAX = 20;

function suiviRenderStats(tracked) {
  document.getElementById("stat-total").textContent = tracked.length;
  document.getElementById("stat-deals").textContent = tracked.filter((o) => o.statut === "Transaction convenue").length;
  document.getElementById("stat-inprogress").textContent = tracked.filter((o) => o.statut === "Contacté").length;
}

function suiviRenderList(tracked, lang) {
  const list = document.getElementById("offers-list");
  const empty = document.getElementById("offers-empty");
  const cappedNotice = document.getElementById("suivi-capped-notice");

  if (tracked.length === 0) {
    list.innerHTML = "";
    empty.style.display = "block";
    if (cappedNotice) cappedNotice.style.display = "none";
    return;
  }
  empty.style.display = "none";

  const shown = tracked.slice(0, SUIVI_MAX);
  if (cappedNotice) cappedNotice.style.display = tracked.length > SUIVI_MAX ? "block" : "none";

  // Même carte que la comparaison par produit (offres.html), avec en plus
  // un statut modifiable directement : ici, contrairement à offres.html,
  // ça a du sens puisqu'on a déjà pris contact.
  list.innerHTML = shown
    .map((o) => {
      const thumb = arProductMedia(o, "#EAF3E4");
      const pillModifier = o.statut === "Transaction convenue" ? "green" : "neutral";
      const farmerName = o.tel
        ? `<a class="farmer farmer-link" href="tel:${o.tel.replace(/\s+/g, "")}" title="${arT("offres.contact")}">${o.fermier}</a>`
        : `<div class="farmer">${o.fermier}</div>`;
      const href = `offres.html?culture=${encodeURIComponent(o.key)}`;
      const statusSelect = `
        <select class="pill-select ${pillModifier} status-action-select" data-offer-id="${o.id}">
          <option value="Contacté" ${o.statut === "Contacté" ? "selected" : ""}>${arStatutLabel("Contacté", lang)}</option>
          <option value="Transaction convenue" ${o.statut === "Transaction convenue" ? "selected" : ""}>${arStatutLabel("Transaction convenue", lang)}</option>
        </select>`;
      return `
      <div class="offer-compare-card" style="cursor:pointer;" data-href="${href}">
        <div class="thumb">${thumb}</div>
        ${farmerName}
        <div class="stats">
          <div class="stat"><div class="k">${arT("field.culture")}</div><div class="v">${o.culture}</div></div>
          <div class="stat"><div class="k">${lang === "en" ? "Quantity" : "Quantité"}</div><div class="v">${o.quantite}</div></div>
          <div class="stat"><div class="k">${lang === "en" ? "Location" : "Localité"}</div><div class="v">${o.province}</div></div>
        </div>
        <div style="margin-top:4px;">
          ${statusSelect}
        </div>
      </div>`;
    })
    .join("");

  list.querySelectorAll(".offer-compare-card[data-href]").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a") || e.target.closest(".status-action-select")) return; // laisse le lien "tel:" et le menu de statut fonctionner normalement
      window.location.href = card.getAttribute("data-href");
    });
  });

  list.querySelectorAll(".status-action-select").forEach((select) => {
    select.addEventListener("click", (e) => e.stopPropagation());
    select.addEventListener("change", (e) => {
      arSetStatut(select.getAttribute("data-offer-id"), select.value);
      suiviRenderAll();
    });
  });
}

function suiviRenderAll() {
  const db = arLoad();
  const lang = arGetLang();

  const tracked = db.offers
    .filter((o) => o.statut !== "Nouveau match")
    .sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));

  suiviRenderStats(tracked);
  suiviRenderList(tracked, lang);
}

document.addEventListener("DOMContentLoaded", () => {
  suiviRenderAll();

  const lang = arGetLang();
  const legendEl = document.getElementById("status-legend-wrap");
  // "Nouveau match" n'apparaît jamais sur cette page, donc on ne le montre
  // pas dans la légende non plus (voir arSetStatut dans js/db.js).
  if (legendEl) legendEl.innerHTML = arStatutLegendHtml(lang, ["Contacté", "Transaction convenue"]);
});
