/* Page : mes-offres.html — récoltes publiées depuis ce navigateur
   -------------------------------------------------------------
   Page dédiée, accessible directement depuis le menu, plutôt
   qu'une section en bas de la page catalogue : on n'a plus besoin
   de faire défiler tout le catalogue (50 produits) pour publier
   une récolte ou voir ses propres offres.

   Le formulaire de publication (autrefois sur sa propre page,
   offre.html) est maintenant intégré directement ici : il n'y avait
   pas de raison d'avoir deux entrées de menu séparées ("Mes offres"
   et "Publier une récolte") pour une seule et même activité côté
   fermier. Le bouton "+ Publier une récolte" ouvre/ferme le
   formulaire sur cette même page, et la liste au-dessus se
   rafraîchit tout de suite après publication. */

function mesOffresRenderList(db, lang) {
  const mine = db.offers.filter((o) => o.fermier === "Vous (démo)");
  const myOffersEl = document.getElementById("my-offers");
  const emptyEl = document.getElementById("my-offers-empty");
  const viaLabel = arT("canal.publishedVia");

  if (mine.length === 0) {
    myOffersEl.innerHTML = "";
    emptyEl.style.display = "block";
  } else {
    emptyEl.style.display = "none";
    myOffersEl.innerHTML = mine
      .map(
        (o) => `
        <div style="display:flex; justify-content:space-between; align-items:center; border:1px solid #E9EFE6; border-radius:10px; padding:12px; margin-bottom:10px; gap:12px;">
          <div style="display:flex; align-items:center; gap:12px; min-width:0;">
            <div style="width:44px; height:44px; border-radius:9px; overflow:hidden; background:${db.prices.find((p) => p.key === o.key)?.bg || "#F1F4EF"}; flex-shrink:0;">
              ${arProductMedia(o, db.prices.find((p) => p.key === o.key)?.bg)}
            </div>
            <div style="min-width:0;">
              <div style="font-size:14px; font-weight:700;">${o.culture}</div>
              <div style="font-size:12px; color:var(--soft); margin-top:3px;">${o.quantite} · ${viaLabel} ${arCanalLabel(o.canal, lang).toLowerCase()}</div>
            </div>
          </div>
          <div class="pill" style="flex-shrink:0;">${arStatutLabel(o.statut, lang)}</div>
        </div>`
      )
      .join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = arGetLang();
  mesOffresRenderList(arLoad(), lang);

  // ---- Formulaire de publication (repris de offre.js) ----
  const db = arLoad();
  const cultureSelect = document.getElementById("culture");
  cultureSelect.innerHTML = db.prices.map((p) => `<option value="${p.key}">${p.culture}</option>`).join("");

  // Petit rappel du prix de référence du jour à côté du champ Culture :
  // le fermier peut aussi le demander de vive voix au simulateur d'appel
  // ou par SMS (comme un vrai numéro AlloRécolte), ce rappel visuel n'est
  // qu'un raccourci pratique pendant qu'il remplit ce formulaire-ci.
  const priceHintEl = document.getElementById("culture-price-hint");
  const priceHintLabel = lang === "en" ? "Today's reference price:" : "Prix de référence du jour :";
  function updatePriceHint() {
    const product = arFindPriceByKey(cultureSelect.value);
    priceHintEl.textContent = product ? `${priceHintLabel} ${product.prix}` : "";
  }
  cultureSelect.addEventListener("change", updatePriceHint);
  updatePriceHint();

  const toggleBtn = document.getElementById("toggle-publish");
  const cancelBtn = document.getElementById("cancel-publish");
  const publishSection = document.getElementById("publish-section");
  const form = document.getElementById("offer-form");
  const confirmation = document.getElementById("confirmation");

  let arSelectedPhoto = null; // data URL de la photo choisie, ou null

  function resetForm() {
    form.reset();
    form.style.display = "flex";
    confirmation.style.display = "none";
    updatePriceHint();
    arSelectedPhoto = null;
    photoInput.value = "";
    previewWrap.style.display = "none";
    uploadBox.style.display = "flex";
  }

  function openPublishSection() {
    publishSection.style.display = "block";
    cultureSelect.focus();
    publishSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closePublishSection() {
    publishSection.style.display = "none";
    resetForm();
  }

  toggleBtn.addEventListener("click", () => {
    if (publishSection.style.display === "block") {
      closePublishSection();
    } else {
      openPublishSection();
    }
  });
  cancelBtn.addEventListener("click", closePublishSection);

  // ---- Upload de photo (vrai fichier, avec aperçu) ----
  const photoInput = document.getElementById("photo-input");
  const uploadBox = document.getElementById("upload-box");
  const previewWrap = document.getElementById("preview-wrap");
  const previewImg = document.getElementById("preview-img");
  const removeBtn = document.getElementById("remove-photo");

  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      arSelectedPhoto = e.target.result; // data URL
      previewImg.src = arSelectedPhoto;
      previewWrap.style.display = "block";
      uploadBox.style.display = "none";
    };
    reader.readAsDataURL(file);
  });

  removeBtn.addEventListener("click", () => {
    arSelectedPhoto = null;
    photoInput.value = "";
    previewWrap.style.display = "none";
    uploadBox.style.display = "flex";
  });

  // ---- Soumission du formulaire ----
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const key = cultureSelect.value;
    const product = db.prices.find((p) => p.key === key);
    const quantite = document.getElementById("quantite").value;
    const prix = document.getElementById("prix").value;
    const province = document.getElementById("province").value;

    arAddOffer({
      fermier: "Vous (démo)",
      culture: product ? product.culture : key,
      key,
      quantite: `${quantite} kg`,
      prix: `${Number(prix).toLocaleString("fr-FR")} KHR/kg`,
      province,
      canal: "site",
      statut: "Nouveau match",
      photo: arSelectedPhoto
    });

    form.style.display = "none";
    confirmation.style.display = "block";

    // La liste au-dessus se rafraîchit tout de suite, pas besoin de
    // recharger la page ni de retourner sur "Mes offres" : on y est déjà.
    mesOffresRenderList(arLoad(), lang);

    window.setTimeout(closePublishSection, 2200);
  });
});
