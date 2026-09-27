/* =========================================================
   AlloRécolte — emplacement photo produit
   -----------------------------------------------------------
   Chaque produit (voir js/db.js, AR_PRODUCTS) a un champ "photo",
   vide par défaut. arProductMedia() affiche cette photo dès qu'elle
   est renseignée (chemin vers un fichier ajouté dans images/, ou
   URL) ; tant qu'elle est vide, un emplacement neutre en pointillés
   s'affiche à la place, pour indiquer clairement où ajouter l'image.
   Pour ajouter une vraie photo à un produit, il suffit de renseigner
   son champ "photo" dans js/db.js (voir README.md).
   ========================================================= */

function arProductIcon(key, bg) {
  const background = bg || "#F1F4EF";
  return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="62" height="62" rx="14" fill="${background}"/>
    <rect x="8" y="8" width="48" height="48" rx="9" fill="none" stroke="#A9BFA2" stroke-width="2.4" stroke-dasharray="4.5 4.5"/>
    <circle cx="24" cy="24" r="4.6" fill="none" stroke="#8FA48A" stroke-width="2.2"/>
    <path d="M13 45l11-13 8 9 6-7 13 11" fill="none" stroke="#8FA48A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// Affiche la photo du produit/offre si elle existe (p.photo), sinon
// l'emplacement neutre ci-dessus. `entity` peut être un produit du
// catalogue (avec .key, .bg, .photo) ou une offre (avec .key, .photo).
function arProductMedia(entity, bg) {
  if (entity && entity.photo) {
    const alt = entity.culture || entity.nameEn || "";
    return `<img src="${entity.photo}" alt="${alt}" style="width:100%; height:100%; object-fit:cover;">`;
  }
  const key = entity ? entity.key : null;
  const background = bg || (entity && entity.bg) || "#F1F4EF";
  return arProductIcon(key, background);
}
