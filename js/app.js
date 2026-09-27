/* Page : index.html — catalogue, page d'accueil du profil Acheteur
   -------------------------------------------------------------
   Le prix n'est volontairement pas affiché sur les cartes : il n'y a
   pas d'intérêt à le montrer avant de cliquer, puisque la page suivante
   (offres.html) l'affiche clairement ("Prix de référence du jour"),
   avec en plus la liste des fermiers à contacter pour ce produit. Une
   barre de recherche filtre le catalogue en direct, utile maintenant
   qu'il compte 50 produits. */

document.addEventListener("DOMContentLoaded", () => {
  const db = arLoad();
  const lang = arGetLang();

  const catalogEl = document.getElementById("catalog");
  const emptyEl = document.getElementById("catalog-empty");
  const searchInput = document.getElementById("catalog-search");

  function renderCatalog(query) {
    const q = (query || "").trim().toLowerCase();
    const filtered = q
      ? db.prices.filter((p) => arProductName(p, lang).toLowerCase().includes(q))
      : db.prices;

    if (filtered.length === 0) {
      catalogEl.innerHTML = "";
      emptyEl.style.display = "block";
      return;
    }
    emptyEl.style.display = "none";
    catalogEl.innerHTML = filtered
      .map(
        (p) => `
      <a class="product-link" href="offres.html?culture=${encodeURIComponent(p.key)}">
        <div class="product-card">
          <div class="product-photo" style="background:${p.bg};">${arProductMedia(p)}</div>
          <div class="product-body">
            <div class="product-name">${arProductName(p, lang)}</div>
          </div>
        </div>
      </a>`
      )
      .join("");
  }

  renderCatalog("");
  if (searchInput) {
    searchInput.addEventListener("input", () => renderCatalog(searchInput.value));
  }
});
