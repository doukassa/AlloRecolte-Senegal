/* =========================================================
   AlloRécolte — "base de données" partagée du prototype
   -----------------------------------------------------------
   Toutes les pages (catalogue et suivi acheteur, simulateur d'appel,
   SMS, formulaire fermier) lisent et écrivent dans le même objet,
   stocké dans le localStorage du navigateur.

   C'est une simulation volontairement simple : dans une vraie
   version, ceci serait remplacé par une vraie base de données
   côté serveur (voir README.md, section "Pour aller plus loin").
   Le but ici est de démontrer le concept central du projet :
   "deux canaux d'accès, une seule base de données".
   ========================================================= */

// v6 : version Sénégal — catalogue de cultures et régions adapté (voir
// README.md), prix en FCFA. Changer la clé force les navigateurs qui
// avaient encore l'ancienne démo (Cambodge, KHR) en cache à recharger le
// jeu de données de départ à jour, sans attendre que la personne clique
// sur "Réinitialiser les données de démonstration" dans Paramètres.
const AR_STORAGE_KEY = "allorecolte_prototype_db_v6_senegal";

// Chaque produit a un champ "photo" (vide par défaut) : dès qu'une image
// y est ajoutée (chemin vers un fichier dans images/, ou URL), elle
// s'affiche automatiquement à la place de l'emplacement en pointillés —
// voir js/icons.js (arProductMedia) et README.md.
//
// Le catalogue ci-dessous a été retravaillé pour le Sénégal : les cultures
// qui n'y sont pas cultivées (durian, rambutan, longane, jacque, cardamome,
// haricot mungo, poivre noir/rouge, liseron d'eau, basilic thaï, pomelo,
// haricot long...) ont été retirées, avec leur photo. Des cultures propres
// au Sénégal qui n'existaient pas dans la version d'origine ont été
// ajoutées (mil, sorgho, niébé, bissap, fonio, orange) : leur champ "photo"
// est volontairement laissé à "null", à l'équipe d'y mettre une vraie
// photo (voir section 3 du README). Les cultures conservées gardent leur
// photo de démonstration d'origine.
const AR_PRODUCTS = [
  { key: "riz", culture: "Riz", nameEn: "Rice", prix: "380 FCFA/kg", bg: "#F7ECDA", photo: "images/riz.jpg" },
  { key: "mais", culture: "Maïs", nameEn: "Corn", prix: "200 FCFA/kg", bg: "#FBF3D9", photo: "images/mais.jpg" },
  { key: "manioc", culture: "Manioc", nameEn: "Cassava", prix: "175 FCFA/kg", bg: "#F3E9DC", photo: "images/manioc.jpg" },
  { key: "mangue", culture: "Mangue", nameEn: "Mango", prix: "300 FCFA/kg", bg: "#FCEBD6", photo: "images/mangue.jpg" },
  { key: "banane", culture: "Banane", nameEn: "Banana", prix: "400 FCFA/kg", bg: "#FBF2CF", photo: "images/banane.jpg" },
  { key: "cajou", culture: "Noix de cajou (anacarde)", nameEn: "Cashew nut", prix: "900 FCFA/kg", bg: "#F2E7D3", photo: "images/noixdecajou.jpg" },
  { key: "pasteque", culture: "Pastèque", nameEn: "Watermelon", prix: "150 FCFA/kg", bg: "#EAF5E7", photo: "images/pasteque.jpg" },
  { key: "concombre", culture: "Concombre", nameEn: "Cucumber", prix: "250 FCFA/kg", bg: "#EAF3E4", photo: "images/concombre.jpg" },
  { key: "aubergine", culture: "Aubergine", nameEn: "Eggplant", prix: "300 FCFA/kg", bg: "#ECE3EE", photo: "images/aubergine.jpg" },
  { key: "canne", culture: "Canne à sucre", nameEn: "Sugarcane", prix: "100 FCFA/kg", bg: "#F1F0DE", photo: "images/canne.jpg" },
  { key: "haricot-vert", culture: "Haricots verts", nameEn: "Green beans", prix: "900 FCFA/kg", bg: "#EAF4E1", photo: "images/haricotvert.jpg" },
  { key: "tomate", culture: "Tomate", nameEn: "Tomato", prix: "350 FCFA/kg", bg: "#FBE6DE", photo: "images/tomate.jpg" },
  { key: "oignon", culture: "Oignon", nameEn: "Onion", prix: "360 FCFA/kg", bg: "#F5EBDD", photo: "images/oignon.jpg" },
  { key: "ail", culture: "Ail (Podor)", nameEn: "Garlic", prix: "2800 FCFA/kg", bg: "#F6EFE0", photo: "images/ail.jpg" },
  { key: "patate-douce", culture: "Patate douce", nameEn: "Sweet potato", prix: "250 FCFA/kg", bg: "#F5E2CE", photo: "images/patate.jpg" },
  { key: "pomme-de-terre", culture: "Pomme de terre", nameEn: "Potato", prix: "350 FCFA/kg", bg: "#F0E6D4", photo: "images/pommedeterre.jpg" },
  { key: "courge", culture: "Courge", nameEn: "Pumpkin / squash", prix: "200 FCFA/kg", bg: "#FBE9C7", photo: "images/courge.jpg" },
  { key: "chou", culture: "Chou", nameEn: "Cabbage", prix: "250 FCFA/kg", bg: "#E6F1E3", photo: "images/chou.jpg" },
  { key: "laitue", culture: "Laitue", nameEn: "Lettuce", prix: "500 FCFA/kg", bg: "#E4F0DA", photo: "images/laitue.jpg" },
  { key: "gombo", culture: "Gombo", nameEn: "Okra", prix: "400 FCFA/kg", bg: "#E3EFD9", photo: "images/gombo.jpg" },
  { key: "piment", culture: "Piment", nameEn: "Chili pepper", prix: "2000 FCFA/kg", bg: "#FBE0DC", photo: "images/piment.jpg" },
  { key: "citron", culture: "Citron vert", nameEn: "Lime", prix: "600 FCFA/kg", bg: "#EEF2D6", photo: "images/citron.jpg" },
  { key: "ananas", culture: "Ananas (Casamance)", nameEn: "Pineapple", prix: "400 FCFA/kg", bg: "#FCEFC9", photo: "images/ananas.jpg" },
  { key: "papaye", culture: "Papaye", nameEn: "Papaya", prix: "300 FCFA/kg", bg: "#FBE7CF", photo: "images/papaye.jpg" },
  { key: "coco", culture: "Noix de coco", nameEn: "Coconut", prix: "300 FCFA/kg", bg: "#F1EAD9", photo: "images/coco.jpg" },
  { key: "tamarin", culture: "Tamarin", nameEn: "Tamarind", prix: "800 FCFA/kg", bg: "#F1E4D2", photo: "images/tamarin.jpg" },
  { key: "soja", culture: "Soja", nameEn: "Soybean", prix: "250 FCFA/kg", bg: "#EFF2DE", photo: "images/soja.jpg" },
  { key: "arachide", culture: "Arachide", nameEn: "Peanut", prix: "280 FCFA/kg", bg: "#F5EAD6", photo: "images/arachide.jpg" },
  { key: "sesame", culture: "Sésame", nameEn: "Sesame", prix: "700 FCFA/kg", bg: "#F7F0DD", photo: "images/sesame.jpg" },
  { key: "gingembre", culture: "Gingembre", nameEn: "Ginger", prix: "1200 FCFA/kg", bg: "#F3E9D6", photo: "images/gingembre.jpg" },
  { key: "curcuma", culture: "Curcuma", nameEn: "Turmeric", prix: "1500 FCFA/kg", bg: "#FBE9B9", photo: "images/curcuma.jpg" },
  { key: "citronnelle", culture: "Citronnelle", nameEn: "Lemongrass", prix: "500 FCFA/kg", bg: "#E6F0DA", photo: "images/citronnelle.jpg" },
  { key: "menthe", culture: "Menthe", nameEn: "Mint", prix: "1000 FCFA/kg", bg: "#E0F0DD", photo: "images/menthe.jpg" },
  { key: "coriandre", culture: "Coriandre", nameEn: "Coriander", prix: "800 FCFA/kg", bg: "#E3F1DC", photo: "images/coriandre.jpg" },
  { key: "coton", culture: "Coton", nameEn: "Cotton", prix: "280 FCFA/kg", bg: "#F2F0E8", photo: "images/coton.jpg" },
  { key: "jute", culture: "Jute (lalo)", nameEn: "Jute mallow (lalo)", prix: "500 FCFA/kg", bg: "#ECEFD8", photo: "images/jute.jpg" },
  { key: "mil", culture: "Mil", nameEn: "Millet", prix: "220 FCFA/kg", bg: "#F6EEDA", photo: "images/mil.jpg" },
  { key: "sorgho", culture: "Sorgho", nameEn: "Sorghum", prix: "200 FCFA/kg", bg: "#F2ECD8", photo: "images/sorgho.jpg" },
  { key: "niebe", culture: "Niébé", nameEn: "Cowpea (black-eyed pea)", prix: "600 FCFA/kg", bg: "#EAF2DD", photo: "images/niebe.jpg" },
  { key: "bissap", culture: "Bissap (oseille de Guinée)", nameEn: "Hibiscus (bissap)", prix: "1400 FCFA/kg", bg: "#F8E3E6", photo: "images/bissap.jpg" },
  { key: "fonio", culture: "Fonio", nameEn: "Fonio", prix: "1000 FCFA/kg", bg: "#F3ECD9", photo: "images/fonio.jpg" },
  { key: "orange", culture: "Orange", nameEn: "Orange", prix: "350 FCFA/kg", bg: "#FBE7C9", photo: "images/orange.jpg" },
];
// Traductions EN des libellés de statut / canal (données fixes, pas de texte libre)
const AR_STATUT_EN = {
  "Nouveau match": "New match",
  "Contacté": "Contacted",
  "Transaction convenue": "Deal agreed"
};
const AR_CANAL_EN = { vocal: "Voice call", sms: "SMS", site: "Website / app" };
const AR_CANAL_FR = { vocal: "Appel vocal", sms: "SMS", site: "Site / app" };

function arProductName(p, lang) {
  return lang === "en" ? p.nameEn : p.culture;
}
function arStatutLabel(statut, lang) {
  return lang === "en" ? (AR_STATUT_EN[statut] || statut) : statut;
}

// Petite phrase d'explication par statut, utilisée par la légende affichée
// sur acheteur.html et offres.html.
const AR_STATUT_HELP_FR = {
  "Nouveau match": "L'offre vient d'être publiée, personne n'a encore pris contact.",
  "Contacté": "Un acheteur a pris contact avec le fermier ; la discussion est en cours.",
  "Transaction convenue": "Acheteur et fermier se sont mis d'accord sur les conditions."
};
const AR_STATUT_HELP_EN = {
  "Nouveau match": "The offer was just posted, no one has reached out yet.",
  "Contacté": "A buyer has contacted the farmer ; the conversation is ongoing.",
  "Transaction convenue": "Buyer and farmer have agreed on the terms."
};
function arStatutHelp(statut, lang) {
  const dict = lang === "en" ? AR_STATUT_HELP_EN : AR_STATUT_HELP_FR;
  return dict[statut] || "";
}
// Classe de pastille associée à chaque statut (voir .pill / .pill.neutral / .pill.green en CSS).
function arStatutPillClass(statut) {
  if (statut === "Transaction convenue") return "pill green";
  if (statut === "Contacté") return "pill neutral";
  return "pill"; // "Nouveau match"
}
// Liste ordonnée des statuts existants, pour générer la légende.
const AR_STATUTS = ["Nouveau match", "Contacté", "Transaction convenue"];
// "statuts" est optionnel : par défaut la légende montre les 3 statuts,
// mais "Suivi des commandes" (acheteur.html) n'affiche jamais d'offre au
// statut "Nouveau match" — pour cette page on ne passe donc que les deux
// statuts pertinents, afin de ne pas mentionner un statut qui n'a pas sa
// place dans ce contexte.
function arStatutLegendHtml(lang, statuts) {
  const list = statuts || AR_STATUTS;
  const title = lang === "en" ? "What the status badges mean:" : "Ce que signifient les statuts :";
  const items = list.map((s) => `
    <div class="legend-item">
      <span class="${arStatutPillClass(s)}">${arStatutLabel(s, lang)}</span>
      <span class="legend-text">${arStatutHelp(s, lang)}</span>
    </div>`).join("");
  return `<div class="status-legend"><div class="legend-title">${title}</div><div class="legend-items">${items}</div></div>`;
}
function arCanalLabel(canal, lang) {
  const dict = lang === "en" ? AR_CANAL_EN : AR_CANAL_FR;
  return dict[canal] || canal;
}

const AR_SEED = {
  prices: AR_PRODUCTS,
  // Offres de démonstration réparties sur les cultures ci-dessus (au moins
  // une par culture, plusieurs pour le riz, l'oignon et l'arachide, les
  // plus centrales au projet), pour qu'aucune recherche ne tombe sur un
  // résultat vide dans le simulateur d'appel, le SMS ou le catalogue.
  // Régions et numéros de téléphone au format sénégalais.
  offers: [
  { id: "o1", fermier: "Bineta Sy", culture: "Riz", key: "riz", quantite: "15 kg", prix: "375 FCFA/kg", province: "Thiès", canal: "site", statut: "Nouveau match", date: "2026-09-24", tel: "75 189 85 64", photo: "images/o1.jpg" },
  { id: "o2", fermier: "Astou Sy", culture: "Riz", key: "riz", quantite: "15 kg", prix: "373 FCFA/kg", province: "Matam", canal: "site", statut: "Nouveau match", date: "2026-09-24", tel: "75 303 93 99", photo: "images/o2.jpg" },
  { id: "o3", fermier: "Malick Seck", culture: "Banane", key: "banane", quantite: "80 kg", prix: "405 FCFA/kg", province: "Saint-Louis", canal: "vocal", statut: "Contacté", date: "2026-09-17", tel: "76 448 45 29", photo: "images/o10.jpg" },
  { id: "o4", fermier: "Aminata Sow", culture: "Maïs", key: "mais", quantite: "150 kg", prix: "198 FCFA/kg", province: "Louga", canal: "sms", statut: "Nouveau match", date: "2026-09-22", tel: "75 370 15 68", photo: "images/o20.jpg" },
  { id: "o5", fermier: "Tidiane Faye", culture: "Mangue", key: "mangue", quantite: "200 kg", prix: "295 FCFA/kg", province: "Richard-Toll", canal: "sms", statut: "Nouveau match", date: "2026-09-19", tel: "78 821 18 15", photo: "images/o23.jpg" },
  { id: "o6", fermier: "Alioune Niang", culture: "Noix de cajou (anacarde)", key: "cajou", quantite: "120 kg", prix: "899 FCFA/kg", province: "Louga", canal: "sms", statut: "Nouveau match", date: "2026-09-22", tel: "76 750 56 30", photo: "images/o24.jpg" },
  { id: "o7", fermier: "Coumba Senghor", culture: "Riz", key: "riz", quantite: "180 kg", prix: "383 FCFA/kg", province: "Dagana", canal: "site", statut: "Nouveau match", date: "2026-09-18", tel: "78 646 41 30", photo: "images/o53.jpg" },
  { id: "o8", fermier: "Tidiane Sy", culture: "Maïs", key: "mais", quantite: "200 kg", prix: "206 FCFA/kg", province: "Tambacounda", canal: "vocal", statut: "Nouveau match", date: "2026-09-23", tel: "77 924 50 61", photo: "images/o54.jpg" },
  { id: "o9", fermier: "Fatoumata Wade", culture: "Mangue", key: "mangue", quantite: "25 kg", prix: "300 FCFA/kg", province: "Tambacounda", canal: "vocal", statut: "Nouveau match", date: "2026-09-18", tel: "76 505 92 68", photo: "images/o57.jpg" },
  { id: "o10", fermier: "Bineta Camara", culture: "Noix de coco", key: "coco", quantite: "100 kg", prix: "296 FCFA/kg", province: "Bakel", canal: "site", statut: "Nouveau match", date: "2026-09-22", tel: "75 538 84 61", photo: "images/o60.jpg" },
  { id: "o11", fermier: "Absa Cisse", culture: "Riz", key: "riz", quantite: "80 kg", prix: "383 FCFA/kg", province: "Dagana", canal: "vocal", statut: "Nouveau match", date: "2026-09-24", tel: "78 742 30 97", photo: "images/o3.jpg" },
  { id: "o12", fermier: "Yacine Diedhiou", culture: "Riz", key: "riz", quantite: "25 kg", prix: "385 FCFA/kg", province: "Ziguinchor", canal: "site", statut: "Contacté", date: "2026-09-22", tel: "75 981 11 97", photo: null },
  { id: "o13", fermier: "Aissatou Gueye", culture: "Riz", key: "riz", quantite: "700 kg", prix: "375 FCFA/kg", province: "Diourbel", canal: "sms", statut: "Nouveau match", date: "2026-09-23", tel: "76 103 43 74", photo: null },
  { id: "o14", fermier: "Rokhaya Lo", culture: "Oignon", key: "oignon", quantite: "500 kg", prix: "357 FCFA/kg", province: "Matam", canal: "site", statut: "Nouveau match", date: "2026-09-23", tel: "78 482 30 79", photo: null },
  { id: "o15", fermier: "Babacar Cisse", culture: "Oignon", key: "oignon", quantite: "15 kg", prix: "368 FCFA/kg", province: "Saint-Louis", canal: "vocal", statut: "Transaction convenue", date: "2026-09-22", tel: "70 345 17 40", photo: null },
  { id: "o16", fermier: "Moussa Toure", culture: "Oignon", key: "oignon", quantite: "25 kg", prix: "354 FCFA/kg", province: "Bakel", canal: "vocal", statut: "Contacté", date: "2026-09-23", tel: "76 662 31 43", photo: null },
  { id: "o17", fermier: "Ndella Toure", culture: "Oignon", key: "oignon", quantite: "250 kg", prix: "368 FCFA/kg", province: "Kaolack", canal: "site", statut: "Nouveau match", date: "2026-09-22", tel: "76 787 93 57", photo: null },
  { id: "o18", fermier: "Khady Sy", culture: "Arachide", key: "arachide", quantite: "500 kg", prix: "286 FCFA/kg", province: "Fatick", canal: "vocal", statut: "Contacté", date: "2026-09-22", tel: "77 702 80 39", photo: null },
  { id: "o19", fermier: "Awa Sy", culture: "Arachide", key: "arachide", quantite: "15 kg", prix: "279 FCFA/kg", province: "Dagana", canal: "vocal", statut: "Nouveau match", date: "2026-09-22", tel: "77 626 40 45", photo: null },
  { id: "o20", fermier: "Ousmane Camara", culture: "Arachide", key: "arachide", quantite: "60 kg", prix: "287 FCFA/kg", province: "Mbour", canal: "site", statut: "Transaction convenue", date: "2026-09-21", tel: "78 903 70 62", photo: null },
  { id: "o21", fermier: "Mballo Ba", culture: "Manioc", key: "manioc", quantite: "30 kg", prix: "173 FCFA/kg", province: "Sédhiou", canal: "sms", statut: "Nouveau match", date: "2026-09-21", tel: "77 789 93 92", photo: null },
  { id: "o22", fermier: "Aissatou Sonko", culture: "Pastèque", key: "pasteque", quantite: "20 kg", prix: "145 FCFA/kg", province: "Louga", canal: "vocal", statut: "Contacté", date: "2026-09-23", tel: "78 649 67 27", photo: null },
  { id: "o23", fermier: "Souleymane Sy", culture: "Concombre", key: "concombre", quantite: "50 kg", prix: "255 FCFA/kg", province: "Dagana", canal: "sms", statut: "Nouveau match", date: "2026-09-20", tel: "77 151 93 79", photo: null },
  { id: "o24", fermier: "Abdoulaye Balde", culture: "Aubergine", key: "aubergine", quantite: "25 kg", prix: "292 FCFA/kg", province: "Vélingara", canal: "sms", statut: "Nouveau match", date: "2026-09-23", tel: "76 160 31 58", photo: null },
  { id: "o25", fermier: "Souleymane Faye", culture: "Canne à sucre", key: "canne", quantite: "200 kg", prix: "92 FCFA/kg", province: "Sédhiou", canal: "site", statut: "Nouveau match", date: "2026-09-17", tel: "75 777 72 29", photo: null },
  { id: "o26", fermier: "Awa Sagna", culture: "Haricots verts", key: "haricot-vert", quantite: "120 kg", prix: "898 FCFA/kg", province: "Bakel", canal: "vocal", statut: "Nouveau match", date: "2026-09-17", tel: "70 158 16 84", photo: null },
  { id: "o27", fermier: "Abdoulaye Diop", culture: "Tomate", key: "tomate", quantite: "500 kg", prix: "357 FCFA/kg", province: "Matam", canal: "vocal", statut: "Transaction convenue", date: "2026-09-23", tel: "77 709 18 96", photo: null },
  { id: "o28", fermier: "Fatoumata Sy", culture: "Ail (Podor)", key: "ail", quantite: "200 kg", prix: "2799 FCFA/kg", province: "Mbour", canal: "site", statut: "Nouveau match", date: "2026-09-24", tel: "75 183 63 94", photo: null },
  { id: "o29", fermier: "Astou Ndour", culture: "Patate douce", key: "patate-douce", quantite: "150 kg", prix: "258 FCFA/kg", province: "Tambacounda", canal: "vocal", statut: "Nouveau match", date: "2026-09-22", tel: "76 234 95 92", photo: null },
  { id: "o30", fermier: "Moussa Ndiaye", culture: "Pomme de terre", key: "pomme-de-terre", quantite: "300 kg", prix: "351 FCFA/kg", province: "Ziguinchor", canal: "site", statut: "Nouveau match", date: "2026-09-19", tel: "77 175 78 37", photo: null },
  { id: "o31", fermier: "Idrissa Wade", culture: "Courge", key: "courge", quantite: "100 kg", prix: "208 FCFA/kg", province: "Dagana", canal: "vocal", statut: "Nouveau match", date: "2026-09-22", tel: "70 261 66 79", photo: null },
  { id: "o32", fermier: "Tidiane Faye", culture: "Chou", key: "chou", quantite: "500 kg", prix: "251 FCFA/kg", province: "Louga", canal: "vocal", statut: "Nouveau match", date: "2026-09-22", tel: "77 209 80 29", photo: null },
  { id: "o33", fermier: "Astou Senghor", culture: "Laitue", key: "laitue", quantite: "120 kg", prix: "500 FCFA/kg", province: "Tambacounda", canal: "vocal", statut: "Transaction convenue", date: "2026-09-18", tel: "70 617 72 42", photo: null },
  { id: "o34", fermier: "Coumba Diop", culture: "Gombo", key: "gombo", quantite: "25 kg", prix: "393 FCFA/kg", province: "Saint-Louis", canal: "sms", statut: "Contacté", date: "2026-09-23", tel: "70 265 66 80", photo: null },
  { id: "o35", fermier: "Khady Fall", culture: "Piment", key: "piment", quantite: "700 kg", prix: "2005 FCFA/kg", province: "Thiès", canal: "site", statut: "Nouveau match", date: "2026-09-24", tel: "70 696 80 28", photo: null },
  { id: "o36", fermier: "Rokhaya Ba", culture: "Citron vert", key: "citron", quantite: "40 kg", prix: "605 FCFA/kg", province: "Podor", canal: "sms", statut: "Nouveau match", date: "2026-09-23", tel: "78 782 23 55", photo: null },
  { id: "o37", fermier: "Abdoulaye Sonko", culture: "Ananas (Casamance)", key: "ananas", quantite: "40 kg", prix: "405 FCFA/kg", province: "Niayes", canal: "sms", statut: "Nouveau match", date: "2026-09-24", tel: "78 854 52 62", photo: null },
  { id: "o38", fermier: "Modou Sow", culture: "Papaye", key: "papaye", quantite: "100 kg", prix: "299 FCFA/kg", province: "Podor", canal: "sms", statut: "Nouveau match", date: "2026-09-23", tel: "78 936 68 54", photo: null },
  { id: "o39", fermier: "Fatou Ndour", culture: "Tamarin", key: "tamarin", quantite: "80 kg", prix: "801 FCFA/kg", province: "Kaolack", canal: "sms", statut: "Nouveau match", date: "2026-09-22", tel: "70 985 18 45", photo: null },
  { id: "o40", fermier: "Ndella Diallo", culture: "Soja", key: "soja", quantite: "500 kg", prix: "253 FCFA/kg", province: "Saint-Louis", canal: "vocal", statut: "Contacté", date: "2026-09-22", tel: "78 694 43 14", photo: null },
  { id: "o41", fermier: "Babacar Balde", culture: "Sésame", key: "sesame", quantite: "250 kg", prix: "695 FCFA/kg", province: "Richard-Toll", canal: "site", statut: "Nouveau match", date: "2026-09-24", tel: "76 690 34 42", photo: null },
  { id: "o42", fermier: "Assane Thiam", culture: "Gingembre", key: "gingembre", quantite: "250 kg", prix: "1193 FCFA/kg", province: "Bakel", canal: "site", statut: "Nouveau match", date: "2026-09-17", tel: "78 472 65 18", photo: null },
  { id: "o43", fermier: "Rokhaya Sane", culture: "Curcuma", key: "curcuma", quantite: "150 kg", prix: "1502 FCFA/kg", province: "Diourbel", canal: "site", statut: "Nouveau match", date: "2026-09-21", tel: "70 512 99 47", photo: null },
  { id: "o44", fermier: "Yacine Ndour", culture: "Citronnelle", key: "citronnelle", quantite: "60 kg", prix: "496 FCFA/kg", province: "Niayes", canal: "site", statut: "Contacté", date: "2026-09-19", tel: "70 515 80 10", photo: null },
  { id: "o45", fermier: "Mballo Sonko", culture: "Menthe", key: "menthe", quantite: "120 kg", prix: "1001 FCFA/kg", province: "Mbour", canal: "site", statut: "Nouveau match", date: "2026-09-18", tel: "70 576 66 66", photo: null },
  { id: "o46", fermier: "Abdoulaye Ndour", culture: "Coriandre", key: "coriandre", quantite: "500 kg", prix: "798 FCFA/kg", province: "Dagana", canal: "sms", statut: "Contacté", date: "2026-09-20", tel: "75 443 21 40", photo: null },
  { id: "o47", fermier: "Mariama Ndiaye", culture: "Coton", key: "coton", quantite: "80 kg", prix: "281 FCFA/kg", province: "Podor", canal: "vocal", statut: "Nouveau match", date: "2026-09-21", tel: "75 970 19 68", photo: null },
  { id: "o48", fermier: "Yacine Cisse", culture: "Jute (lalo)", key: "jute", quantite: "1000 kg", prix: "505 FCFA/kg", province: "Kolda", canal: "vocal", statut: "Nouveau match", date: "2026-09-23", tel: "77 868 23 64", photo: null },
  { id: "o49", fermier: "Souleymane Diop", culture: "Mil", key: "mil", quantite: "50 kg", prix: "219 FCFA/kg", province: "Bakel", canal: "vocal", statut: "Transaction convenue", date: "2026-09-24", tel: "76 236 69 95", photo: null },
  { id: "o50", fermier: "Babacar Toure", culture: "Sorgho", key: "sorgho", quantite: "700 kg", prix: "208 FCFA/kg", province: "Ziguinchor", canal: "site", statut: "Transaction convenue", date: "2026-09-17", tel: "75 536 80 67", photo: null },
  { id: "o51", fermier: "Mamadou Toure", culture: "Niébé", key: "niebe", quantite: "400 kg", prix: "597 FCFA/kg", province: "Fatick", canal: "site", statut: "Contacté", date: "2026-09-22", tel: "75 596 90 40", photo: null },
  { id: "o52", fermier: "Pape Sy", culture: "Bissap (oseille de Guinée)", key: "bissap", quantite: "300 kg", prix: "1400 FCFA/kg", province: "Kaffrine", canal: "sms", statut: "Nouveau match", date: "2026-09-22", tel: "75 182 27 29", photo: null },
  { id: "o53", fermier: "Astou Fall", culture: "Fonio", key: "fonio", quantite: "200 kg", prix: "999 FCFA/kg", province: "Sédhiou", canal: "sms", statut: "Nouveau match", date: "2026-09-22", tel: "75 577 63 17", photo: null },
  { id: "o54", fermier: "Malick Senghor", culture: "Orange", key: "orange", quantite: "250 kg", prix: "348 FCFA/kg", province: "Saint-Louis", canal: "site", statut: "Contacté", date: "2026-09-21", tel: "76 106 55 48", photo: null },
  { id: "o55", fermier: "Ramatoulaye Wade", culture: "Pastèque", key: "pasteque", quantite: "700 kg", prix: "155 FCFA/kg", province: "Fatick", canal: "sms", statut: "Transaction convenue", date: "2026-09-23", tel: "70 546 72 13", photo: null },
  { id: "o56", fermier: "Souleymane Thiam", culture: "Pastèque", key: "pasteque", quantite: "200 kg", prix: "152 FCFA/kg", province: "Thiès", canal: "site", statut: "Nouveau match", date: "2026-09-20", tel: "77 503 85 82", photo: null },
  { id: "o57", fermier: "Ousmane Niang", culture: "Fonio", key: "fonio", quantite: "25 kg", prix: "992 FCFA/kg", province: "Ziguinchor", canal: "vocal", statut: "Contacté", date: "2026-09-24", tel: "70 488 51 37", photo: null },
  { id: "o58", fermier: "Coumba Toure", culture: "Haricots verts", key: "haricot-vert", quantite: "150 kg", prix: "902 FCFA/kg", province: "Sédhiou", canal: "sms", statut: "Contacté", date: "2026-09-24", tel: "76 119 79 16", photo: null },
  { id: "o59", fermier: "Fatou Sy", culture: "Piment", key: "piment", quantite: "25 kg", prix: "1999 FCFA/kg", province: "Kaolack", canal: "vocal", statut: "Nouveau match", date: "2026-09-19", tel: "78 344 26 70", photo: null },
  { id: "o60", fermier: "Souleymane Senghor", culture: "Fonio", key: "fonio", quantite: "1000 kg", prix: "995 FCFA/kg", province: "Kaffrine", canal: "sms", statut: "Nouveau match", date: "2026-09-23", tel: "75 721 24 30", photo: null },
  { id: "o61", fermier: "Rokhaya Sagna", culture: "Sorgho", key: "sorgho", quantite: "1000 kg", prix: "195 FCFA/kg", province: "Kolda", canal: "sms", statut: "Nouveau match", date: "2026-09-17", tel: "78 177 85 98", photo: null },
  { id: "o62", fermier: "Ramatoulaye Sonko", culture: "Bissap (oseille de Guinée)", key: "bissap", quantite: "30 kg", prix: "1399 FCFA/kg", province: "Louga", canal: "site", statut: "Nouveau match", date: "2026-09-24", tel: "70 645 64 94", photo: null },
  { id: "o63", fermier: "Ibrahima Niang", culture: "Piment", key: "piment", quantite: "500 kg", prix: "1994 FCFA/kg", province: "Sédhiou", canal: "sms", statut: "Nouveau match", date: "2026-09-24", tel: "76 470 91 68", photo: null },
  { id: "o64", fermier: "Coumba Diedhiou", culture: "Banane", key: "banane", quantite: "50 kg", prix: "405 FCFA/kg", province: "Bakel", canal: "sms", statut: "Transaction convenue", date: "2026-09-21", tel: "76 945 85 44", photo: null },
  { id: "o65", fermier: "Adama Sy", culture: "Gombo", key: "gombo", quantite: "25 kg", prix: "399 FCFA/kg", province: "Ziguinchor", canal: "site", statut: "Nouveau match", date: "2026-09-19", tel: "76 444 13 73", photo: null },
  { id: "o66", fermier: "Idrissa Sonko", culture: "Gombo", key: "gombo", quantite: "400 kg", prix: "397 FCFA/kg", province: "Kaffrine", canal: "sms", statut: "Nouveau match", date: "2026-09-22", tel: "75 818 45 81", photo: null },
  { id: "o67", fermier: "Bineta Camara", culture: "Tomate", key: "tomate", quantite: "60 kg", prix: "358 FCFA/kg", province: "Sédhiou", canal: "sms", statut: "Nouveau match", date: "2026-09-20", tel: "78 807 70 92", photo: null },
  { id: "o68", fermier: "Pape Sy", culture: "Pomme de terre", key: "pomme-de-terre", quantite: "15 kg", prix: "356 FCFA/kg", province: "Kolda", canal: "site", statut: "Nouveau match", date: "2026-09-23", tel: "70 779 84 57", photo: null },
  { id: "o69", fermier: "Tidiane Diallo", culture: "Pomme de terre", key: "pomme-de-terre", quantite: "180 kg", prix: "358 FCFA/kg", province: "Kédougou", canal: "site", statut: "Contacté", date: "2026-09-21", tel: "70 413 42 39", photo: null },
  { id: "o70", fermier: "Ndella Toure", culture: "Mangue", key: "mangue", quantite: "150 kg", prix: "298 FCFA/kg", province: "Niayes", canal: "vocal", statut: "Nouveau match", date: "2026-09-23", tel: "76 383 85 77", photo: null },
  { id: "o71", fermier: "Pape Sy", culture: "Coton", key: "coton", quantite: "30 kg", prix: "281 FCFA/kg", province: "Kédougou", canal: "vocal", statut: "Nouveau match", date: "2026-09-22", tel: "77 825 78 26", photo: null },
  { id: "o72", fermier: "Pape Senghor", culture: "Mil", key: "mil", quantite: "20 kg", prix: "213 FCFA/kg", province: "Thiès", canal: "site", statut: "Transaction convenue", date: "2026-09-21", tel: "77 993 11 83", photo: null },
  { id: "o73", fermier: "Aissatou Sarr", culture: "Sorgho", key: "sorgho", quantite: "400 kg", prix: "207 FCFA/kg", province: "Podor", canal: "sms", statut: "Contacté", date: "2026-09-21", tel: "77 941 18 61", photo: null },
  { id: "o74", fermier: "Mariama Diouf", culture: "Pomme de terre", key: "pomme-de-terre", quantite: "1000 kg", prix: "344 FCFA/kg", province: "Mbour", canal: "sms", statut: "Nouveau match", date: "2026-09-24", tel: "78 221 81 63", photo: null },
  { id: "o75", fermier: "Adama Thiam", culture: "Coton", key: "coton", quantite: "500 kg", prix: "279 FCFA/kg", province: "Ziguinchor", canal: "sms", statut: "Contacté", date: "2026-09-19", tel: "76 412 82 89", photo: null },
  { id: "o76", fermier: "Mamadou Ndour", culture: "Maïs", key: "mais", quantite: "60 kg", prix: "195 FCFA/kg", province: "Dagana", canal: "vocal", statut: "Nouveau match", date: "2026-09-23", tel: "78 665 19 30", photo: null },
  { id: "o77", fermier: "Marieme Faye", culture: "Tomate", key: "tomate", quantite: "300 kg", prix: "355 FCFA/kg", province: "Podor", canal: "vocal", statut: "Transaction convenue", date: "2026-09-22", tel: "70 819 68 19", photo: null },
  { id: "o78", fermier: "Seydou Balde", culture: "Fonio", key: "fonio", quantite: "100 kg", prix: "999 FCFA/kg", province: "Louga", canal: "site", statut: "Transaction convenue", date: "2026-09-23", tel: "78 372 28 19", photo: null }
  ],
  buyerRequests: [],
  smsLog: []
};

function arHashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}
const AR_SEED_FINGERPRINT_KEY = "allorecolte_prototype_seed_fingerprint";

function arLoad() {
  const currentFingerprint = arHashString(JSON.stringify(AR_SEED));
  const raw = localStorage.getItem(AR_STORAGE_KEY);
  const storedFingerprint = localStorage.getItem(AR_SEED_FINGERPRINT_KEY);

  if (!raw || storedFingerprint !== currentFingerprint) {
    localStorage.setItem(AR_STORAGE_KEY, JSON.stringify(AR_SEED));
    localStorage.setItem(AR_SEED_FINGERPRINT_KEY, currentFingerprint);
    return JSON.parse(JSON.stringify(AR_SEED));
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    localStorage.setItem(AR_STORAGE_KEY, JSON.stringify(AR_SEED));
    localStorage.setItem(AR_SEED_FINGERPRINT_KEY, currentFingerprint);
    return JSON.parse(JSON.stringify(AR_SEED));
  }
}

function arSave(db) {
  localStorage.setItem(AR_STORAGE_KEY, JSON.stringify(db));
}

// Préférences de l'utilisateur de démo (voir parametres.html) : nom,
// téléphone, région, canal préféré, notifications. Centralisées ici
// (plutôt que dans js/parametres.js) pour que toute page qui publie une
// offre au nom de "Vous (démo)" (mes-offres.js, sms.js, appel.js) puisse
// récupérer le numéro de téléphone à associer à l'offre.
const AR_USER_KEY = "allorecolte_user_prefs";

function paramLoadUser() {
  try {
    const raw = localStorage.getItem(AR_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* localStorage indisponible ou donnée corrompue : on repart des valeurs par défaut */ }
  return { nom: "Sokhna", tel: "77 123 45 67", province: "Thiès", canal: "site", notifVocal: true, notifSms: true, notifSite: true };
}

function paramSaveUser(prefs) {
  try {
    localStorage.setItem(AR_USER_KEY, JSON.stringify(prefs));
  } catch (e) { /* localStorage indisponible : les préférences ne seront pas mémorisées, sans bloquer la page */ }
}

function arAddOffer(offer) {
  const db = arLoad();
  offer.id = "o" + Date.now();
  offer.date = new Date().toISOString().slice(0, 10);
  if (!offer.statut) offer.statut = "Nouveau match";
  if (offer.photo === undefined) offer.photo = null;
  // Les offres publiées par l'utilisateur de démo héritent du numéro de
  // téléphone renseigné dans Paramètres, pour que le bouton "Contacter"
  // fonctionne aussi sur ses propres offres.
  if (!offer.tel) {
    offer.tel = offer.fermier === "Vous (démo)" ? (paramLoadUser().tel || "") : "";
  }
  db.offers.unshift(offer);
  arSave(db);
  return offer;
}

function arAddSms(text, direction) {
  const db = arLoad();
  db.smsLog.unshift({
    id: "s" + Date.now(),
    text,
    direction: direction || "in", // "in" = reçu (AlloRécolte -> fermier), "out" = envoyé par le fermier
    time: new Date().toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })
  });
  arSave(db);
}

function arAddBuyerRequest(req) {
  const db = arLoad();
  req.id = "r" + Date.now();
  db.buyerRequests.unshift(req);
  arSave(db);
  return req;
}

function arFindPrice(culture) {
  const db = arLoad();
  const needle = culture.toLowerCase();
  return db.prices.find((p) => p.culture.toLowerCase().includes(needle));
}

function arFindPriceByKey(key) {
  const db = arLoad();
  return db.prices.find((p) => p.key === key);
}

function arReset() {
  localStorage.setItem(AR_STORAGE_KEY, JSON.stringify(AR_SEED));
  localStorage.setItem(AR_SEED_FINGERPRINT_KEY, arHashString(JSON.stringify(AR_SEED)));
}

// Appelée quand l'acheteur clique pour contacter un fermier (bouton
// "Contacter" ou nom du fermier, tous deux des liens tel:) depuis le
// catalogue (offres.html) : fait passer l'offre de "Nouveau match" à
// "Contacté", pour qu'elle apparaisse dans "Suivi des commandes"
// (acheteur.html). Ne fait rien si l'offre est déjà plus avancée
// (Contacté ou Transaction convenue), pour ne jamais faire reculer un
// statut simplement parce qu'on reclique sur le numéro.
function arMarkContacted(offerId) {
  const db = arLoad();
  const offer = db.offers.find((o) => o.id === offerId);
  if (offer && offer.statut === "Nouveau match") {
    offer.statut = "Contacté";
    arSave(db);
  }
}

// Changement de statut manuel par l'acheteur, depuis "Suivi des commandes"
// (acheteur.html) : bascule entre "Contacté" et "Transaction convenue".
// "Nouveau match" n'est volontairement pas une valeur possible ici — cette
// page ne montre que des offres déjà contactées, donc revenir à "Nouveau
// match" n'aurait pas de sens dans ce contexte.
function arSetStatut(offerId, newStatut) {
  const db = arLoad();
  const offer = db.offers.find((o) => o.id === offerId);
  if (offer && (newStatut === "Contacté" || newStatut === "Transaction convenue")) {
    offer.statut = newStatut;
    arSave(db);
  }
}
