/* =========================================================
   AlloRécolte — traduction de l'interface du site (FR / EN)
   -----------------------------------------------------------
   Ne concerne que l'habillage du site/app (menus, titres, champs,
   boutons). La conversation du simulateur d'appel a son propre
   sélecteur de langue (FR/EN/WO), indépendant de celui-ci — voir
   js/appel-i18n.js. Le wolof pour l'interface du site n'est pas
   encore disponible : voir README.md, section Perspectives.
   ========================================================= */

const AR_SITE_LANG_KEY = "allorecolte_site_lang";

function arGetLang() {
  try {
    return localStorage.getItem(AR_SITE_LANG_KEY) || "fr";
  } catch (e) {
    return "fr";
  }
}

function arSetLang(lang) {
  try {
    localStorage.setItem(AR_SITE_LANG_KEY, lang);
  } catch (e) {
    /* localStorage indisponible : le choix ne sera pas mémorisé, sans bloquer la page */
  }
}

// ---------------------------------------------------------------------
// Rôle de démonstration (fermier / acheteur)
// -----------------------------------------------------------------
// Ce prototype n'a pas de compte ni de connexion : un seul profil de
// démo, avec un simple bouton "Fermier / Acheteur" dans le pied de menu
// pour prévisualiser les deux expériences. Chaque lien du menu porte un
// attribut data-role ("fermier" ou "acheteur") ; les liens sans cet
// attribut (Paramètres) restent visibles pour les deux rôles. Dans une
// vraie version, ce choix se ferait à l'inscription (voir README.md).
const AR_ROLE_KEY = "allorecolte_role";

// Pages accessibles à chaque rôle : sert à savoir, quand on bascule de
// rôle depuis une page qui n'existe pas pour l'autre rôle (ex. on est sur
// le simulateur d'appel et on passe en "Acheteur"), vers quelle page
// d'accueil rediriger plutôt que de laisser un menu sans page active.
const AR_ROLE_PAGES = {
  fermier: ["mes-offres.html", "appel.html", "sms.html", "parametres.html"],
  acheteur: ["index.html", "offres.html", "acheteur.html", "parametres.html"]
};
// Page d'accueil de chaque rôle : "Mes offres" pour le fermier (c'est là
// que tout commence : publier, puis suivre ses récoltes), le catalogue
// pour l'acheteur (c'est là qu'il trouve des fermiers à contacter).
const AR_ROLE_HOME = { fermier: "mes-offres.html", acheteur: "index.html" };

function arGetRole() {
  try {
    return localStorage.getItem(AR_ROLE_KEY) || "fermier";
  } catch (e) {
    return "fermier";
  }
}

function arSetRole(role) {
  try {
    localStorage.setItem(AR_ROLE_KEY, role);
  } catch (e) {
    /* localStorage indisponible : le choix ne sera pas mémorisé, sans bloquer la page */
  }
}

function arCurrentPage() {
  const file = location.pathname.split("/").pop();
  return file || "index.html";
}

// Garde-fou appelé au chargement de CHAQUE page (pas seulement au clic sur
// le bouton de rôle) : si la page actuelle n'existe pas pour le rôle actif
// — qu'on y soit arrivé par un favori, l'historique du navigateur, ou tout
// simplement parce que le rôle par défaut (Fermier) ne correspond pas à la
// page qu'on a ouverte en premier (ex. index.html, qui est désormais la
// page du profil Acheteur) — on redirige vers la page d'accueil de ce
// rôle. C'est ce qui garantit que le menu affiché correspond toujours à la
// page affichée, plutôt que de se contenter de masquer des liens du menu
// en laissant une page "orpheline" ouverte. Retourne true si une
// redirection est en cours (le reste de l'initialisation de la page peut
// alors être ignoré, elle va être quittée immédiatement).
function arEnsureRoleHome() {
  const role = arGetRole();
  const page = arCurrentPage();
  const allowed = AR_ROLE_PAGES[role] || [];
  if (allowed.length && !allowed.includes(page)) {
    location.replace(AR_ROLE_HOME[role] || "index.html");
    return true;
  }
  return false;
}

// Affiche/masque les liens du menu selon le rôle actif, et met en
// évidence le bouton actif du sélecteur de rôle.
function arApplyRoleNav() {
  const role = arGetRole();
  document.querySelectorAll(".sidebar nav .nav-item").forEach((a) => {
    const only = a.getAttribute("data-role");
    a.style.display = (!only || only === role) ? "" : "none";
  });
  document.querySelectorAll("button[data-role]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-role") === role);
  });
}

function arInitRoleSwitch() {
  document.querySelectorAll("button[data-role]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const role = btn.getAttribute("data-role");
      if (role === arGetRole()) return;
      arSetRole(role);
      // Un simple rechargement suffit : arEnsureRoleHome(), appelé au
      // chargement de la page, redirigera lui-même si la page actuelle
      // n'existe pas pour le nouveau rôle — pas besoin de dupliquer cette
      // logique ici.
      location.reload();
    });
  });
}

const SITE_I18N = {
  fr: {
    "sidebar.tag": "Prototype de démonstration",
    "nav.catalogue": "Catalogue",
    "nav.appel": "Simulateur d'appel",
    "nav.sms": "SMS",
    "nav.mesOffres": "Mes offres",
    "nav.acheteur": "Suivi des commandes",
    "nav.parametres": "Paramètres",
    "sidebar.hello": "Bonjour, Sokhna",
    "sidebar.province": "Région de Thiès",
    "lang.label": "Langue de l'interface",
    "role.label": "Mode de démonstration",
    "role.fermier": "Fermier",
    "role.acheteur": "Acheteur",

    "hero.eyebrow": "Site & application acheteur",
    "hero.title": "Trouvez vos fournisseurs, en un coup d'œil",
    "hero.text": "Parcourez les cultures disponibles, comparez les fermiers qui les proposent (prix, quantité, localité), et contactez-les directement. Le suivi de vos échanges se fait ensuite dans « Suivi des commandes ».",
    "catalog.title": "Catalogue des cultures",
    "catalog.subtitle": "Données de démonstration, à connecter à un vrai flux de prix de marché.",
    "catalog.hint": "Cliquez sur un produit pour voir les fermiers qui le proposent et les contacter.",
    "catalog.searchPlaceholder": "Rechercher un produit…",
    "catalog.noResults": "Aucun produit ne correspond à votre recherche.",
    "myoffers.title": "Mes offres",
    "myoffers.empty": "Vous n'avez pas encore publié d'offre.",
    "mesoffres.subtitle": "Les récoltes que vous avez publiées depuis ce navigateur, par le site, l'appel vocal ou le SMS.",
    "btn.publish": "+ Publier une récolte",

    "offre.title": "Publier une récolte",
    "offre.subtitle": "Les acheteurs correspondant à votre offre seront notifiés automatiquement, quel que soit leur canal.",
    "field.culture": "Culture",
    "field.quantite": "Quantité disponible (kg)",
    "field.prix": "Prix souhaité (FCFA / kg)",
    "field.province": "Région",
    "field.photo": "Photo de la récolte (optionnel)",
    "upload.label": "Cliquez pour ajouter une photo depuis votre appareil",
    "upload.remove": "Retirer la photo",
    "offre.helper": "Les acheteurs correspondant à votre offre seront notifiés automatiquement.",
    "btn.submitOffer": "Publier l'offre",
    "btn.cancel": "Annuler",
    "confirm.title": "Offre publiée !",
    "confirm.textInline": "Elle vient d'être ajoutée à la liste ci-dessus, et les acheteurs pourront désormais la trouver dans le catalogue.",

    "appel.title": "Simulateur d'appel vocal",
    "appel.subtitle": "Cette page simule, dans le navigateur, l'expérience du canal vocal (IVR + assistant conversationnel), avec un vrai clavier de téléphone. La version réelle fonctionnerait par un vrai numéro de téléphone — voir le README pour le détail de ce qui est simulé.",
    "appel.idleText": "Depuis n'importe quel téléphone, le fermier compose ce numéro.",
    "appel.start": "Composer le numéro AlloRécolte",
    "appel.end": "Raccrocher",
    "appel.send": "Envoyer",
    "appel.inputPlaceholder": "Tapez votre question ou votre réponse…",

    "sms.title": "Simulateur SMS",
    "sms.subtitle": "Ce fil simule le canal SMS d'AlloRécolte : les messages « reçus » sont générés automatiquement par vos appels sur le simulateur vocal, et vous pouvez aussi taper et « envoyer » votre propre SMS ci-dessous, comme un vrai fermier le ferait sur un téléphone basique.",
    "sms.empty": "Aucun SMS pour l'instant — passez un appel sur le simulateur, ou écrivez le premier message ci-dessous.",
    "sms.inputPlaceholder": "Écrivez votre SMS… ex. prix manioc",
    "sms.send": "Envoyer",
    "sms.helper": "Exemples : « prix manioc », « vendre riz 200kg 380 », ou une question sur votre culture — cette démo répond par mots-clés, pas par un vrai opérateur télécom.",

    "suivi.title": "Suivi des commandes",
    "suivi.subtitle": "Les fermiers que vous avez contactés — depuis le catalogue, quel que soit leur canal (appel, SMS ou site/app) — et où en est chaque échange.",
    "suivi.empty": "Vous n'avez contacté aucun fermier pour l'instant.",
    "suivi.browseCatalog": "Parcourir le catalogue",
    "stat.total": "Offres suivies",
    "stat.deals": "Transactions convenues",
    "stat.inProgress": "En discussion",
    "suivi.cappedNotice": "Les 20 échanges les plus récents sont affichés ici.",

    "offres.subtitle": "Comparez les fermiers qui proposent ce produit : prix, quantité et localité.",
    "offres.backCatalog": "← Retour au catalogue",
    "offres.empty": "Aucune offre pour ce produit pour l'instant.",
    "offres.today": "Prix de référence du jour :",
    "offres.contact": "Contacter",
    "offres.noTel": "Numéro non renseigné",

    "canal.publishedVia": "publiée via",

    "parametres.title": "Paramètres",
    "parametres.subtitle": "Langue de l'interface, informations du compte et préférences de démonstration.",
    "parametres.langTitle": "Langue de l'interface",
    "parametres.langHelper": "Choisissez la langue d'affichage du site et de l'application. Le simulateur d'appel a son propre choix de langue (français, anglais, wolof), indépendant de celui-ci.",
    "parametres.langSoon": "Bientôt disponible",
    "parametres.langActive": "Actif",
    "parametres.userTitle": "Informations utilisateur",
    "parametres.userHelper": "Données de démonstration, modifiables — elles ne sont pas envoyées à un serveur, seulement enregistrées dans ce navigateur.",
    "field.nom": "Nom",
    "field.telephone": "Téléphone",
    "field.canalPref": "Canal de contact préféré",
    "canalPref.vocal": "Appel vocal",
    "canalPref.sms": "SMS",
    "canalPref.site": "Site / app",
    "parametres.notifTitle": "Notifications",
    "parametres.notifHelper": "Être notifié quand une offre correspond à mes recherches, via :",
    "notif.vocal": "Appel vocal",
    "notif.sms": "SMS",
    "notif.site": "Site / app",
    "parametres.save": "Enregistrer",
    "parametres.saved": "Enregistré !",
    "parametres.demoTitle": "Données de démonstration",
    "parametres.demoHelper": "Réinitialise le catalogue et les offres à leur état de départ — utile avant une nouvelle démonstration.",
    "parametres.reset": "Réinitialiser les données de démonstration",
    "parametres.resetConfirm": "Données de démonstration réinitialisées."
  },
  en: {
    "sidebar.tag": "Demonstration prototype",
    "nav.catalogue": "Catalog",
    "nav.appel": "Call simulator",
    "nav.sms": "SMS",
    "nav.mesOffres": "My offers",
    "nav.acheteur": "Order tracking",
    "nav.parametres": "Settings",
    "sidebar.hello": "Hello, Sokhna",
    "sidebar.province": "Thiès Region",
    "lang.label": "Interface language",
    "role.label": "Demo view",
    "role.fermier": "Farmer",
    "role.acheteur": "Buyer",

    "hero.eyebrow": "Buyer website & app",
    "hero.title": "Find your suppliers, at a glance",
    "hero.text": "Browse the available crops, compare the farmers offering them (price, quantity, location), and contact them directly. Track your exchanges afterwards in “Order tracking”.",
    "catalog.title": "Crop catalog",
    "catalog.subtitle": "Demo data — to be connected to a real market price feed.",
    "catalog.hint": "Click a product to see the farmers offering it and contact them.",
    "catalog.searchPlaceholder": "Search a product…",
    "catalog.noResults": "No product matches your search.",
    "myoffers.title": "My offers",
    "myoffers.empty": "You haven't posted an offer yet.",
    "mesoffres.subtitle": "The harvests you have posted from this browser, via the website, the voice simulator or SMS.",
    "btn.publish": "+ Post a harvest",

    "offre.title": "Post a harvest",
    "offre.subtitle": "Matching buyers will be notified automatically, whatever their channel.",
    "field.culture": "Crop",
    "field.quantite": "Available quantity (kg)",
    "field.prix": "Desired price (FCFA / kg)",
    "field.province": "Region",
    "field.photo": "Harvest photo (optional)",
    "upload.label": "Click to add a photo from your device",
    "upload.remove": "Remove photo",
    "offre.helper": "Matching buyers will be notified automatically.",
    "btn.submitOffer": "Post the offer",
    "btn.cancel": "Cancel",
    "confirm.title": "Offer posted!",
    "confirm.textInline": "It was just added to the list above, and buyers can now find it in the catalog.",

    "appel.title": "Voice call simulator",
    "appel.subtitle": "This page simulates, in the browser, the experience of the voice channel (IVR + conversational assistant), with a real phone keypad. The real version would work over an actual phone number — see the README for what exactly is simulated.",
    "appel.idleText": "From any phone, the farmer dials this number.",
    "appel.start": "Dial the AlloRécolte number",
    "appel.end": "Hang up",
    "appel.send": "Send",
    "appel.inputPlaceholder": "Type your question or your answer…",

    "sms.title": "SMS simulator",
    "sms.subtitle": "This thread simulates AlloRécolte's SMS channel: “received” messages are generated automatically by your calls on the voice simulator, and you can also type and “send” your own SMS below, just like a real farmer would on a basic phone.",
    "sms.empty": "No SMS yet — make a call on the simulator, or write the first message below.",
    "sms.inputPlaceholder": "Write your SMS… e.g. rice price",
    "sms.send": "Send",
    "sms.helper": "Examples: “price cassava”, “sell rice 200kg 380”, or a question about your crop — this demo replies by keyword matching, not a real telecom operator.",

    "suivi.title": "Order tracking",
    "suivi.subtitle": "The farmers you've contacted — from the catalog, whatever their channel (call, SMS or website/app) — and where each exchange stands.",
    "suivi.empty": "You haven't contacted any farmer yet.",
    "suivi.browseCatalog": "Browse the catalog",
    "stat.total": "Tracked offers",
    "stat.deals": "Deals agreed",
    "stat.inProgress": "In discussion",
    "suivi.cappedNotice": "The 20 most recent exchanges are shown here.",

    "offres.subtitle": "Compare the farmers offering this product: price, quantity and location.",
    "offres.backCatalog": "← Back to catalog",
    "offres.empty": "No offers for this product yet.",
    "offres.today": "Today's reference price:",
    "offres.contact": "Contact",
    "offres.noTel": "No phone number on file",

    "canal.publishedVia": "posted via",

    "parametres.title": "Settings",
    "parametres.subtitle": "Interface language, account information and demo preferences.",
    "parametres.langTitle": "Interface language",
    "parametres.langHelper": "Choose the display language of the website and app. The call simulator has its own language choice (French, English, Wolof), independent of this one.",
    "parametres.langSoon": "Coming soon",
    "parametres.langActive": "Active",
    "parametres.userTitle": "User information",
    "parametres.userHelper": "Demo data, editable — it is not sent to any server, only saved in this browser.",
    "field.nom": "Name",
    "field.telephone": "Phone",
    "field.canalPref": "Preferred contact channel",
    "canalPref.vocal": "Voice call",
    "canalPref.sms": "SMS",
    "canalPref.site": "Website / app",
    "parametres.notifTitle": "Notifications",
    "parametres.notifHelper": "Get notified when an offer matches my searches, via:",
    "notif.vocal": "Voice call",
    "notif.sms": "SMS",
    "notif.site": "Website / app",
    "parametres.save": "Save",
    "parametres.saved": "Saved!",
    "parametres.demoTitle": "Demo data",
    "parametres.demoHelper": "Resets the catalog and offers back to their starting state — useful before a fresh demo.",
    "parametres.reset": "Reset demo data",
    "parametres.resetConfirm": "Demo data has been reset."
  }
};

function arT(key) {
  const lang = arGetLang();
  const dict = SITE_I18N[lang] || SITE_I18N.fr;
  return dict[key] || SITE_I18N.fr[key] || key;
}

function arApplySiteI18n() {
  const lang = arGetLang();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = arT(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", arT(key));
  });
  document.documentElement.setAttribute("lang", lang);
  document.querySelectorAll(".lang-switch [data-lang]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

function arInitLangSwitch() {
  document.querySelectorAll(".lang-switch [data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (lang === arGetLang()) return;
      arSetLang(lang);
      location.reload();
    });
  });
}

// Menu hamburger (petit écran) : la sidebar devient un tiroir qui glisse
// depuis la gauche, avec un fond assombri derrière — remplace l'ancienne
// barre horizontale défilante. Logique partagée, commune à toutes les
// pages (voir le bouton #hamburger-btn et #nav-overlay dans chaque .html).
function arInitMobileNav() {
  const app = document.querySelector(".app");
  const btn = document.getElementById("hamburger-btn");
  const overlay = document.getElementById("nav-overlay");
  if (!app || !btn) return;

  function closeNav() {
    app.classList.remove("nav-open");
    btn.setAttribute("aria-expanded", "false");
  }
  function toggleNav() {
    const open = app.classList.toggle("nav-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  btn.addEventListener("click", toggleNav);
  if (overlay) overlay.addEventListener("click", closeNav);
  document.querySelectorAll(".sidebar nav a").forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (arEnsureRoleHome()) return; // redirection en cours, inutile d'initialiser cette page
  arApplySiteI18n();
  arInitLangSwitch();
  arApplyRoleNav();
  arInitRoleSwitch();
  arInitMobileNav();
});
