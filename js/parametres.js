/* Page : parametres.html — langue de l'interface, informations
   utilisateur et données de démonstration.
   -------------------------------------------------------------
   Note : la langue choisie ici (français / anglais) ne concerne
   que l'habillage du site/app — voir js/site-i18n.js. Le wolof et
   les autres langues nationales sont affichées à titre indicatif
   ("bientôt disponible") pour montrer le potentiel multilingue du
   produit : le wolof est déjà actif dans le simulateur d'appel
   (voir js/appel-i18n.js), mais l'habillage complet du site lui-même
   reste à faire, sans complexifier la démo maintenant (voir
   README.md). */

// AR_USER_KEY, paramLoadUser() et paramSaveUser() sont définis dans
// js/db.js, pour que les pages de publication d'offre (mes-offres.js,
// sms.js, appel.js) puissent aussi lire le numéro de téléphone de
// l'utilisateur de démo sans dépendre de ce fichier.

const AR_MORE_LANGS = [
  { code: "wo", name: "Wolof" },
  { code: "ff", name: "Pulaar · Fulfulde" },
  { code: "srr", name: "Sérère" },
  { code: "mnk", name: "Mandinka" },
  { code: "dyo", name: "Joola · Diola" }
];

// Rangée par langue plutôt que grille de pastilles : la langue active est
// mise en évidence en vert avec une coche, les langues pas encore
// disponibles sont clairement grisées avec l'étiquette "bientôt disponible".
function renderLangGrid() {
  const grid = document.getElementById("lang-grid");
  const current = arGetLang();
  const soonLabel = arT("parametres.langSoon");
  const activeLabel = arT("parametres.langActive");

  const active = [
    { code: "fr", name: "Français" },
    { code: "en", name: "English" }
  ];

  const checkIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  grid.innerHTML =
    active.map((l) => `
      <button type="button" class="lang-row ${l.code === current ? "active" : ""}" data-lang="${l.code}">
        <span class="name">${l.name}</span>
        ${l.code === current ? `<span class="status active-tag">${checkIcon}${activeLabel}</span>` : ""}
      </button>`).join("") +
    AR_MORE_LANGS.map((l) => `
      <div class="lang-row soon" aria-disabled="true">
        <span class="name">${l.name}</span>
        <span class="status soon-tag">${soonLabel}</span>
      </div>`).join("");

  grid.querySelectorAll(".lang-row[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (lang === arGetLang()) return;
      arSetLang(lang);
      location.reload();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderLangGrid();

  const prefs = paramLoadUser();
  document.getElementById("user-nom").value = prefs.nom || "";
  document.getElementById("user-tel").value = prefs.tel || "";
  document.getElementById("user-province").value = prefs.province || "Thiès";
  document.getElementById("user-canal").value = prefs.canal || "site";
  document.getElementById("notif-vocal").checked = prefs.notifVocal !== false;
  document.getElementById("notif-sms").checked = prefs.notifSms !== false;
  document.getElementById("notif-site").checked = prefs.notifSite !== false;

  const form = document.getElementById("user-form");
  const confirmEl = document.getElementById("save-confirm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    paramSaveUser({
      nom: document.getElementById("user-nom").value.trim(),
      tel: document.getElementById("user-tel").value.trim(),
      province: document.getElementById("user-province").value,
      canal: document.getElementById("user-canal").value,
      notifVocal: document.getElementById("notif-vocal").checked,
      notifSms: document.getElementById("notif-sms").checked,
      notifSite: document.getElementById("notif-site").checked
    });
    confirmEl.style.display = "inline";
    window.setTimeout(() => { confirmEl.style.display = "none"; }, 2500);
  });

  const resetBtn = document.getElementById("reset-demo");
  const resetConfirm = document.getElementById("reset-confirm");
  resetBtn.addEventListener("click", () => {
    arReset();
    resetConfirm.style.display = "inline";
    window.setTimeout(() => { resetConfirm.style.display = "none"; }, 2500);
  });
});
