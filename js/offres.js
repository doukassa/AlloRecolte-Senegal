/* Page : offres.html — liste des fermiers pour un produit donné
   -------------------------------------------------------------
   Volontairement, les fermiers ne sont PAS triés par prix : l'objectif
   est que l'acheteur compare lui-même prix, quantité et localité,
   plutôt que de systématiquement mettre en avant le moins cher
   (voir la discussion sur le favoritisme entre fermiers).

   Cette page est une page de recherche de fournisseur : elle n'affiche
   donc pas le statut (Nouveau match / Contacté / Transaction convenue)
   de chaque offre, qui n'a de sens qu'une fois qu'on a effectivement
   pris contact — ce suivi-là vit sur sa propre page, "Suivi des
   commandes" (acheteur.html). Cliquer sur le nom d'un fermier ou sur
   "Contacter" fait passer l'offre correspondante à "Contacté"
   (arMarkContacted, voir js/db.js), ce qui la fait apparaître là-bas.

   Le catalogue (index.html) est la seule page qui mène ici désormais ;
   le lien "retour" en haut de page y renvoie directement. */

function offresGetCultureFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("culture");
}

function offresRenderHeader(product, lang) {
  document.getElementById("product-icon").style.background = product.bg;
  document.getElementById("product-icon").innerHTML = arProductMedia(product);
  document.getElementById("product-title").textContent = arProductName(product, lang);
  const label = lang === "en" ? "Today's reference price:" : "Prix de référence du jour :";
  document.getElementById("product-price-line").textContent = `${label} ${product.prix}`;
  document.title = `AlloRécolte — ${arProductName(product, lang)}`;
}

function offresRenderList(offers, lang) {
  const list = document.getElementById("offers-list");
  const empty = document.getElementById("offers-empty");

  if (offers.length === 0) {
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  const kLabels = lang === "en"
    ? { qty: "Quantity", price: "Price", place: "Location", channel: "Channel" }
    : { qty: "Quantité", price: "Prix", place: "Localité", channel: "Canal" };

  const phoneIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2.1z"></path></svg>`;

  list.innerHTML = offers
    .map((o) => {
      const thumb = arProductMedia(o, "#EAF3E4");
      const canal = arCanalLabel(o.canal, lang);
      const contactBtn = o.tel
        ? `<a class="contact-btn" href="tel:${o.tel.replace(/\s+/g, "")}" data-offer-id="${o.id}">${phoneIcon}${arT("offres.contact")}</a>`
        : `<span class="helper" style="margin:0;">${arT("offres.noTel")}</span>`;
      // Le nom du fermier est lui-même cliquable (appelle directement), en plus
      // du bouton "Contacter" plus visible.
      const farmerName = o.tel
        ? `<a class="farmer farmer-link" href="tel:${o.tel.replace(/\s+/g, "")}" title="${arT("offres.contact")}" data-offer-id="${o.id}">${o.fermier}</a>`
        : `<div class="farmer">${o.fermier}</div>`;
      return `
      <div class="offer-compare-card">
        <div class="thumb">${thumb}</div>
        ${farmerName}
        <div class="stats">
          <div class="stat"><div class="k">${kLabels.qty}</div><div class="v">${o.quantite}</div></div>
          <div class="stat"><div class="k">${kLabels.price}</div><div class="v price">${o.prix}</div></div>
          <div class="stat"><div class="k">${kLabels.place}</div><div class="v">${o.province}</div></div>
          <div class="stat"><div class="k">${kLabels.channel}</div><div class="v">${canal}</div></div>
        </div>
        <div class="actions">${contactBtn}</div>
      </div>`;
    })
    .join("");

  // Marque l'offre comme "Contactée" dès qu'on clique pour appeler le
  // fermier — voir js/db.js (arMarkContacted). Le clic déclenche aussi
  // normalement le lien tel:, les deux ne sont pas exclusifs.
  list.querySelectorAll("[data-offer-id]").forEach((el) => {
    el.addEventListener("click", () => arMarkContacted(el.getAttribute("data-offer-id")));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const db = arLoad();
  const lang = arGetLang();

  let key = offresGetCultureFromUrl();
  let product = db.prices.find((p) => p.key === key);
  if (!product) {
    product = db.prices[0];
    key = product.key;
  }

  offresRenderHeader(product, lang);

  const offers = db.offers.filter((o) => o.key === key);
  offresRenderList(offers, lang);
});
