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

// v5 : réduction du nombre d'offres "Contacté"/"Transaction convenue" dans
// les données de démo (pour que "Suivi des commandes" reste à 20 offres
// maximum, voir plus bas). Changer la clé force les navigateurs qui avaient
// déjà des données en cache (avec l'ancienne répartition des statuts) à
// recharger le jeu de données de départ à jour, sans attendre que la
// personne clique sur "Réinitialiser les données de démonstration" dans
// Paramètres.
const AR_STORAGE_KEY = "allorecolte_prototype_db_v5";

// Chaque produit a un champ "photo" (vide par défaut) : dès qu'une image
// y est ajoutée (chemin vers un fichier dans images/, ou URL), elle
// s'affiche automatiquement à la place de l'emplacement en pointillés —
// voir js/icons.js (arProductMedia) et README.md. Le produit "riz" a
// maintenant une image de démonstration (images/riz.jpg, une illustration,
// pas une vraie photo) pour servir d'exemple concret du fonctionnement :
// pour vos propres produits, remplacez simplement "null" par le chemin
// vers votre image (ajoutée dans le dossier images/) ou par son URL.
const AR_PRODUCTS = [
  { key: "riz", culture: "Riz jasmin", nameEn: "Jasmine rice", prix: "1 250 KHR/kg", bg: "#F7ECDA", photo: "images/riz.jpg" },
  { key: "mais", culture: "Maïs", nameEn: "Corn", prix: "800 KHR/kg", bg: "#FBF3D9", photo: "images/mais.jpg" },
  { key: "manioc", culture: "Manioc", nameEn: "Cassava", prix: "620 KHR/kg", bg: "#F3E9DC", photo: "images/manioc.jpg" },
  { key: "poivre-noir", culture: "Poivre noir", nameEn: "Black pepper", prix: "18 000 KHR/kg", bg: "#EDE7DE", photo: "images/poivrenoir.jpg" },
  { key: "poivre-rouge", culture: "Poivre rouge", nameEn: "Red pepper", prix: "21 000 KHR/kg", bg: "#F7E3DD", photo: "images/poivrerouge.jpg" },
  { key: "mangue", culture: "Mangue", nameEn: "Mango", prix: "2 500 KHR/kg", bg: "#FCEBD6", photo: "images/mangue.jpg" },
  { key: "banane", culture: "Banane", nameEn: "Banana", prix: "1 800 KHR/kg", bg: "#FBF2CF", photo: "images/banane.jpg" },
  { key: "cajou", culture: "Noix de cajou", nameEn: "Cashew nut", prix: "9 500 KHR/kg", bg: "#F2E7D3", photo: "images/noixdecajou.jpg" },
  { key: "pasteque", culture: "Pastèque", nameEn: "Watermelon", prix: "1 100 KHR/kg", bg: "#EAF5E7", photo: "images/pasteque.jpg" },
  { key: "concombre", culture: "Concombre", nameEn: "Cucumber", prix: "900 KHR/kg", bg: "#EAF3E4", photo: "images/concombre.jpg" },
  { key: "aubergine", culture: "Aubergine", nameEn: "Eggplant", prix: "1 400 KHR/kg", bg: "#ECE3EE", photo: "images/aubergine.jpg" },
  { key: "canne", culture: "Canne à sucre", nameEn: "Sugarcane", prix: "500 KHR/kg", bg: "#F1F0DE", photo: "images/canne.jpg" },
  { key: "haricot-vert", culture: "Haricots verts", nameEn: "Green beans", prix: "1 600 KHR/kg", bg: "#EAF4E1", photo: "images/haricotvert.jpg" },
  { key: "tomate", culture: "Tomate", nameEn: "Tomato", prix: "1 700 KHR/kg", bg: "#FBE6DE", photo: "images/tomate.jpg" },
  { key: "oignon", culture: "Oignon", nameEn: "Onion", prix: "2 200 KHR/kg", bg: "#F5EBDD", photo: "images/oignon.jpg" },
  { key: "ail", culture: "Ail", nameEn: "Garlic", prix: "7 500 KHR/kg", bg: "#F6EFE0", photo: "images/ail.jpg" },
  { key: "patate-douce", culture: "Patate douce", nameEn: "Sweet potato", prix: "1 300 KHR/kg", bg: "#F5E2CE", photo: "images/patate.jpg" },
  { key: "pomme-de-terre", culture: "Pomme de terre", nameEn: "Potato", prix: "1 900 KHR/kg", bg: "#F0E6D4", photo: "images/pommedeterre.jpg" },
  { key: "courge", culture: "Courge", nameEn: "Pumpkin / squash", prix: "1 200 KHR/kg", bg: "#FBE9C7", photo: "images/courge.jpg" },
  { key: "haricot-long", culture: "Haricot long", nameEn: "Long bean", prix: "1 500 KHR/kg", bg: "#E9F1DD", photo: "images/haricotlong.jpg" },
  { key: "chou", culture: "Chou", nameEn: "Cabbage", prix: "1 350 KHR/kg", bg: "#E6F1E3", photo: "images/chou.jpg" },
  { key: "laitue", culture: "Laitue", nameEn: "Lettuce", prix: "1 800 KHR/kg", bg: "#E4F0DA", photo: "images/laitue.jpg" },
  { key: "morning-glory", culture: "Liseron d'eau", nameEn: "Water spinach", prix: "1 100 KHR/kg", bg: "#DFEED8", photo: "images/morning.jpg" },
  { key: "gombo", culture: "Gombo", nameEn: "Okra", prix: "1 450 KHR/kg", bg: "#E3EFD9", photo: "images/gombo.jpg" },
  { key: "piment", culture: "Piment", nameEn: "Chili pepper", prix: "6 000 KHR/kg", bg: "#FBE0DC", photo: "images/piment.jpg" },
  { key: "citron", culture: "Citron vert", nameEn: "Lime", prix: "3 200 KHR/kg", bg: "#EEF2D6", photo: "images/citron.jpg" },
  { key: "ananas", culture: "Ananas", nameEn: "Pineapple", prix: "1 600 KHR/kg", bg: "#FCEFC9", photo: "images/ananas.jpg" },
  { key: "papaye", culture: "Papaye", nameEn: "Papaya", prix: "1 900 KHR/kg", bg: "#FBE7CF", photo: "images/papaye.jpg" },
  { key: "coco", culture: "Noix de coco", nameEn: "Coconut", prix: "2 000 KHR/kg", bg: "#F1EAD9", photo: "images/coco.jpg" },
  { key: "longane", culture: "Longane", nameEn: "Longan", prix: "5 500 KHR/kg", bg: "#F3E9D9", photo: "images/longane.jpg" },
  { key: "durian", culture: "Durian", nameEn: "Durian", prix: "12 000 KHR/kg", bg: "#F6EAD0", photo: "images/durian.jpg" },
  { key: "jacque", culture: "Jacque", nameEn: "Jackfruit", prix: "2 800 KHR/kg", bg: "#FBF0D2", photo: "images/jacque.jpg" },
  { key: "rambutan", culture: "Rambutan", nameEn: "Rambutan", prix: "4 200 KHR/kg", bg: "#FBE2DE", photo: "images/rambutan.jpg" },
  { key: "pomelo", culture: "Pomelo", nameEn: "Pomelo", prix: "3 000 KHR/kg", bg: "#F1F3DB", photo: "images/pomelo.jpg" },
  { key: "tamarin", culture: "Tamarin", nameEn: "Tamarind", prix: "4 800 KHR/kg", bg: "#F1E4D2", photo: "images/tamarin.jpg" },
  { key: "soja", culture: "Soja", nameEn: "Soybean", prix: "2 900 KHR/kg", bg: "#EFF2DE", photo: "images/soja.jpg" },
  { key: "arachide", culture: "Arachide", nameEn: "Peanut", prix: "4 500 KHR/kg", bg: "#F5EAD6", photo: "images/arachide.jpg" },
  { key: "sesame", culture: "Sésame", nameEn: "Sesame", prix: "10 500 KHR/kg", bg: "#F7F0DD", photo: "images/sesame.jpg" },
  { key: "haricot-mungo", culture: "Haricot mungo", nameEn: "Mung bean", prix: "5 200 KHR/kg", bg: "#EBF2DD", photo: "images/haricotmungo.jpg" },
  { key: "cardamome", culture: "Cardamome", nameEn: "Cardamom", prix: "32 000 KHR/kg", bg: "#EDE9DD", photo: "images/cardamome.jpg" },
  { key: "gingembre", culture: "Gingembre", nameEn: "Ginger", prix: "3 600 KHR/kg", bg: "#F3E9D6", photo: "images/gingembre.jpg" },
  { key: "curcuma", culture: "Curcuma", nameEn: "Turmeric", prix: "4 000 KHR/kg", bg: "#FBE9B9", photo: "images/curcuma.jpg" },
  { key: "citronnelle", culture: "Citronnelle", nameEn: "Lemongrass", prix: "2 100 KHR/kg", bg: "#E6F0DA", photo: "images/citronnelle.jpg" },
  { key: "basilic", culture: "Basilic thaï", nameEn: "Thai basil", prix: "2 400 KHR/kg", bg: "#E1EFD9", photo: "images/basilic.jpg" },
  { key: "menthe", culture: "Menthe", nameEn: "Mint", prix: "2 600 KHR/kg", bg: "#E0F0DD", photo: "images/menthe.jpg" },
  { key: "coriandre", culture: "Coriandre", nameEn: "Coriander", prix: "2 300 KHR/kg", bg: "#E3F1DC", photo: "images/coriandre.jpg" },
  { key: "coton", culture: "Coton", nameEn: "Cotton", prix: "3 400 KHR/kg", bg: "#F2F0E8", photo: "images/coton.jpg" },
  { key: "jute", culture: "Jute", nameEn: "Jute", prix: "1 950 KHR/kg", bg: "#ECEFD8", photo: "images/jute.jpg" },
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
  // 80 offres de démonstration réparties sur les 50 produits (au moins une
  // par produit, cinq pour le riz) pour qu'aucune recherche ne tombe sur
  // un résultat vide dans le simulateur d'appel, le SMS ou le catalogue.
  offers: [
  { id: "o1", fermier: "Vanna Kim", culture: "Riz jasmin", key: "riz", quantite: "100 kg", prix: "1 220 KHR/kg", province: "Battambang", canal: "sms", statut: "Nouveau match", date: "2026-09-16", tel: "078 670 739", photo: "images/o1.jpg" },
  { id: "o2", fermier: "Chariya Nuon", culture: "Riz jasmin", key: "riz", quantite: "25 kg", prix: "1 290 KHR/kg", province: "Svay Rieng", canal: "site", statut: "Transaction convenue", date: "2026-09-16", tel: "085 955 958", photo: "images/o2.jpg" },
  { id: "o3", fermier: "Sambath Im", culture: "Oignon", key: "oignon", quantite: "700 kg", prix: "2 320 KHR/kg", province: "Oddar Meanchey", canal: "site", statut: "Nouveau match", date: "2026-09-16", tel: "081 808 703", photo: null },
  { id: "o4", fermier: "Sok Leang", culture: "Pomme de terre", key: "pomme-de-terre", quantite: "50 kg", prix: "2 110 KHR/kg", province: "Kampot", canal: "sms", statut: "Contacté", date: "2026-09-16", tel: "088 383 769", photo: null },
  { id: "o5", fermier: "Maly Ouk", culture: "Haricot long", key: "haricot-long", quantite: "25 kg", prix: "1 510 KHR/kg", province: "Kandal", canal: "vocal", statut: "Contacté", date: "2026-09-16", tel: "078 581 066", photo: null },
  { id: "o6", fermier: "Dara Heng", culture: "Laitue", key: "laitue", quantite: "500 kg", prix: "1 880 KHR/kg", province: "Pursat", canal: "site", statut: "Contacté", date: "2026-09-16", tel: "098 396 900", photo: null },
  { id: "o7", fermier: "Malis Roeun", culture: "Curcuma", key: "curcuma", quantite: "300 kg", prix: "4 270 KHR/kg", province: "Kandal", canal: "vocal", statut: "Transaction convenue", date: "2026-09-16", tel: "099 134 233", photo: null },
  { id: "o8", fermier: "Bopha Meas", culture: "Poivre noir", key: "poivre-noir", quantite: "20 kg", prix: "18 240 KHR/kg", province: "Siem Reap", canal: "site", statut: "Nouveau match", date: "2026-09-15", tel: "015 834 045", photo: "images/o8.jpg" },
  { id: "o9", fermier: "Chenda Rith", culture: "Poivre rouge", key: "poivre-rouge", quantite: "15 kg", prix: "23 360 KHR/kg", province: "Pursat", canal: "sms", statut: "Transaction convenue", date: "2026-09-15", tel: "092 265 058", photo: null },
  { id: "o10", fermier: "Sok Leang", culture: "Banane", key: "banane", quantite: "400 kg", prix: "1 630 KHR/kg", province: "Siem Reap", canal: "site", statut: "Transaction convenue", date: "2026-09-15", tel: "088 383 769", photo: "images/o10.jpg" },
  { id: "o11", fermier: "Kosal Prum", culture: "Haricots verts", key: "haricot-vert", quantite: "30 kg", prix: "1 580 KHR/kg", province: "Pursat", canal: "vocal", statut: "Nouveau match", date: "2026-09-15", tel: "017 000 410", photo: null },
  { id: "o12", fermier: "Veasna Chey", culture: "Tomate", key: "tomate", quantite: "20 kg", prix: "1 890 KHR/kg", province: "Kandal", canal: "sms", statut: "Nouveau match", date: "2026-09-15", tel: "086 040 491", photo: null },
  { id: "o13", fermier: "Pisey Sok", culture: "Piment", key: "piment", quantite: "20 kg", prix: "6 070 KHR/kg", province: "Svay Rieng", canal: "site", statut: "Nouveau match", date: "2026-09-15", tel: "093 615 145", photo: null },
  { id: "o14", fermier: "Dara Heng", culture: "Ananas", key: "ananas", quantite: "30 kg", prix: "1 650 KHR/kg", province: "Kratie", canal: "sms", statut: "Contacté", date: "2026-09-15", tel: "098 396 900", photo: null },
  { id: "o15", fermier: "Lina Sok", culture: "Rambutan", key: "rambutan", quantite: "15 kg", prix: "4 300 KHR/kg", province: "Kampong Thom", canal: "sms", statut: "Transaction convenue", date: "2026-09-15", tel: "081 816 201", photo: null },
  { id: "o16", fermier: "Sovann Ly", culture: "Pomelo", key: "pomelo", quantite: "500 kg", prix: "3 130 KHR/kg", province: "Prey Veng", canal: "site", statut: "Nouveau match", date: "2026-09-15", tel: "012 963 267", photo: null },
  { id: "o17", fermier: "Veasna Chey", culture: "Tamarin", key: "tamarin", quantite: "250 kg", prix: "4 480 KHR/kg", province: "Kratie", canal: "site", statut: "Contacté", date: "2026-09-15", tel: "086 040 491", photo: null },
  { id: "o18", fermier: "Narith Vong", culture: "Gingembre", key: "gingembre", quantite: "15 kg", prix: "3 310 KHR/kg", province: "Kratie", canal: "sms", statut: "Nouveau match", date: "2026-09-15", tel: "016 107 535", photo: null },
  { id: "o20", fermier: "Narith Vong", culture: "Maïs", key: "mais", quantite: "80 kg", prix: "740 KHR/kg", province: "Svay Rieng", canal: "site", statut: "Contacté", date: "2026-09-14", tel: "016 107 535", photo: "images/o20.jpg" },
  { id: "o21", fermier: "Lina Sok", culture: "Manioc", key: "manioc", quantite: "100 kg", prix: "620 KHR/kg", province: "Pursat", canal: "sms", statut: "Transaction convenue", date: "2026-09-14", tel: "081 816 201", photo: null },
  { id: "o22", fermier: "Dara Heng", culture: "Mangue", key: "mangue", quantite: "500 kg", prix: "2 690 KHR/kg", province: "Pursat", canal: "vocal", statut: "Contacté", date: "2026-09-14", tel: "098 396 900", photo: null },
  { id: "o23", fermier: "Sreymom Chhun", culture: "Mangue", key: "mangue", quantite: "60 kg", prix: "2 630 KHR/kg", province: "Battambang", canal: "site", statut: "Nouveau match", date: "2026-09-14", tel: "016 969 077", photo: "images/o23.jpg" },
  { id: "o24", fermier: "Malis Roeun", culture: "Noix de cajou", key: "cajou", quantite: "700 kg", prix: "9 580 KHR/kg", province: "Kampong Thom", canal: "site", statut: "Nouveau match", date: "2026-09-14", tel: "099 134 233", photo: "images/o24.jpg" },
  { id: "o25", fermier: "Sovann Ly", culture: "Patate douce", key: "patate-douce", quantite: "400 kg", prix: "1 340 KHR/kg", province: "Kratie", canal: "site", statut: "Transaction convenue", date: "2026-09-14", tel: "012 963 267", photo: null },
  { id: "o26", fermier: "Lina Sok", culture: "Sésame", key: "sesame", quantite: "400 kg", prix: "9 850 KHR/kg", province: "Prey Veng", canal: "sms", statut: "Nouveau match", date: "2026-09-14", tel: "081 816 201", photo: null },
  { id: "o27", fermier: "Maly Ouk", culture: "Manioc", key: "manioc", quantite: "150 kg", prix: "690 KHR/kg", province: "Battambang", canal: "vocal", statut: "Transaction convenue", date: "2026-09-13", tel: "078 581 066", photo: null },
  { id: "o28", fermier: "Channary Yos", culture: "Banane", key: "banane", quantite: "120 kg", prix: "2 010 KHR/kg", province: "Pursat", canal: "vocal", statut: "Transaction convenue", date: "2026-09-13", tel: "070 251 089", photo: null },
  { id: "o29", fermier: "Maly Ouk", culture: "Pastèque", key: "pasteque", quantite: "700 kg", prix: "1 030 KHR/kg", province: "Kampong Thom", canal: "site", statut: "Nouveau match", date: "2026-09-13", tel: "078 581 066", photo: null },
  { id: "o30", fermier: "Sok Leang", culture: "Tomate", key: "tomate", quantite: "60 kg", prix: "1 550 KHR/kg", province: "Kandal", canal: "site", statut: "Transaction convenue", date: "2026-09-13", tel: "088 383 769", photo: null },
  { id: "o31", fermier: "Kosal Prum", culture: "Courge", key: "courge", quantite: "150 kg", prix: "1 270 KHR/kg", province: "Kampong Thom", canal: "vocal", statut: "Nouveau match", date: "2026-09-13", tel: "017 000 410", photo: null },
  { id: "o32", fermier: "Dara Heng", culture: "Durian", key: "durian", quantite: "400 kg", prix: "10 690 KHR/kg", province: "Kampong Speu", canal: "site", statut: "Nouveau match", date: "2026-09-13", tel: "098 396 900", photo: null },
  { id: "o33", fermier: "Pisey Sok", culture: "Durian", key: "durian", quantite: "80 kg", prix: "13 220 KHR/kg", province: "Oddar Meanchey", canal: "site", statut: "Nouveau match", date: "2026-09-13", tel: "093 615 145", photo: null },
  { id: "o34", fermier: "Rithy Pen", culture: "Soja", key: "soja", quantite: "40 kg", prix: "2 780 KHR/kg", province: "Svay Rieng", canal: "sms", statut: "Nouveau match", date: "2026-09-13", tel: "092 614 718", photo: null },
  { id: "o35", fermier: "Veasna Chey", culture: "Haricot mungo", key: "haricot-mungo", quantite: "25 kg", prix: "5 450 KHR/kg", province: "Battambang", canal: "vocal", statut: "Contacté", date: "2026-09-13", tel: "086 040 491", photo: null },
  { id: "o36", fermier: "Chenda Rith", culture: "Cardamome", key: "cardamome", quantite: "1000 kg", prix: "35 820 KHR/kg", province: "Oddar Meanchey", canal: "site", statut: "Nouveau match", date: "2026-09-13", tel: "092 265 058", photo: null },
  { id: "o37", fermier: "Malis Roeun", culture: "Menthe", key: "menthe", quantite: "400 kg", prix: "2 830 KHR/kg", province: "Siem Reap", canal: "site", statut: "Nouveau match", date: "2026-09-13", tel: "099 134 233", photo: null },
  { id: "o38", fermier: "Sina Khan", culture: "Riz jasmin", key: "riz", quantite: "700 kg", prix: "1 230 KHR/kg", province: "Pursat", canal: "sms", statut: "Transaction convenue", date: "2026-09-12", tel: "098 572 560", photo: null },
  { id: "o39", fermier: "Maly Ouk", culture: "Riz jasmin", key: "riz", quantite: "60 kg", prix: "1 220 KHR/kg", province: "Pursat", canal: "site", statut: "Nouveau match", date: "2026-09-12", tel: "078 581 066", photo: "images/o3.jpg" },
  { id: "o40", fermier: "Sreynich Pheng", culture: "Ail", key: "ail", quantite: "300 kg", prix: "7 390 KHR/kg", province: "Kampot", canal: "vocal", statut: "Nouveau match", date: "2026-09-12", tel: "016 998 606", photo: null },
  { id: "o41", fermier: "Maly Ouk", culture: "Chou", key: "chou", quantite: "180 kg", prix: "1 510 KHR/kg", province: "Kampong Cham", canal: "site", statut: "Transaction convenue", date: "2026-09-12", tel: "078 581 066", photo: null },
  { id: "o42", fermier: "Veasna Chey", culture: "Liseron d'eau", key: "morning-glory", quantite: "40 kg", prix: "1 000 KHR/kg", province: "Oddar Meanchey", canal: "sms", statut: "Nouveau match", date: "2026-09-12", tel: "086 040 491", photo: null },
  { id: "o43", fermier: "Lina Sok", culture: "Citron vert", key: "citron", quantite: "40 kg", prix: "3 100 KHR/kg", province: "Kandal", canal: "site", statut: "Nouveau match", date: "2026-09-12", tel: "081 816 201", photo: null },
  { id: "o44", fermier: "Chan Dara", culture: "Longane", key: "longane", quantite: "80 kg", prix: "6 220 KHR/kg", province: "Kampong Cham", canal: "site", statut: "Nouveau match", date: "2026-09-12", tel: "070 480 333", photo: null },
  { id: "o45", fermier: "Sovann Ly", culture: "Soja", key: "soja", quantite: "1000 kg", prix: "3 260 KHR/kg", province: "Svay Rieng", canal: "site", statut: "Nouveau match", date: "2026-09-12", tel: "012 963 267", photo: null },
  { id: "o46", fermier: "Chariya Nuon", culture: "Basilic thaï", key: "basilic", quantite: "300 kg", prix: "2 670 KHR/kg", province: "Kampong Thom", canal: "sms", statut: "Nouveau match", date: "2026-09-12", tel: "085 955 958", photo: null },
  { id: "o47", fermier: "Kanha Tep", culture: "Maïs", key: "mais", quantite: "80 kg", prix: "850 KHR/kg", province: "Kandal", canal: "vocal", statut: "Nouveau match", date: "2026-09-11", tel: "096 640 606", photo: null },
  { id: "o48", fermier: "Vibol Chan", culture: "Aubergine", key: "aubergine", quantite: "20 kg", prix: "1 320 KHR/kg", province: "Kampot", canal: "vocal", statut: "Nouveau match", date: "2026-09-11", tel: "098 828 278", photo: null },
  { id: "o49", fermier: "Pisey Sok", culture: "Patate douce", key: "patate-douce", quantite: "20 kg", prix: "1 400 KHR/kg", province: "Takeo", canal: "vocal", statut: "Nouveau match", date: "2026-09-11", tel: "093 615 145", photo: null },
  { id: "o50", fermier: "Vanna Kim", culture: "Gombo", key: "gombo", quantite: "60 kg", prix: "1 390 KHR/kg", province: "Battambang", canal: "site", statut: "Nouveau match", date: "2026-09-11", tel: "078 670 739", photo: null },
  { id: "o51", fermier: "Sophea Long", culture: "Papaye", key: "papaye", quantite: "20 kg", prix: "2 130 KHR/kg", province: "Kandal", canal: "vocal", statut: "Nouveau match", date: "2026-09-11", tel: "070 016 972", photo: null },
  { id: "o52", fermier: "Chan Dara", culture: "Jacque", key: "jacque", quantite: "100 kg", prix: "3 120 KHR/kg", province: "Svay Rieng", canal: "vocal", statut: "Nouveau match", date: "2026-09-11", tel: "070 480 333", photo: null },
  { id: "o53", fermier: "Veasna Chey", culture: "Riz jasmin", key: "riz", quantite: "30 kg", prix: "1 390 KHR/kg", province: "Siem Reap", canal: "site", statut: "Nouveau match", date: "2026-09-10", tel: "086 040 491", photo: "images/o53.jpg" },
  { id: "o54", fermier: "Chariya Nuon", culture: "Maïs", key: "mais", quantite: "150 kg", prix: "710 KHR/kg", province: "Kampong Speu", canal: "site", statut: "Nouveau match", date: "2026-09-10", tel: "085 955 958", photo: "images/o54.jpg" },
  { id: "o55", fermier: "Vibol Chan", culture: "Poivre noir", key: "poivre-noir", quantite: "1000 kg", prix: "18 680 KHR/kg", province: "Kratie", canal: "sms", statut: "Nouveau match", date: "2026-09-10", tel: "098 828 278", photo: null },
  { id: "o56", fermier: "Sophea Long", culture: "Poivre noir", key: "poivre-noir", quantite: "200 kg", prix: "18 740 KHR/kg", province: "Svay Rieng", canal: "vocal", statut: "Nouveau match", date: "2026-09-10", tel: "070 016 972", photo: null },
  { id: "o57", fermier: "Veasna Chey", culture: "Mangue", key: "mangue", quantite: "120 kg", prix: "2 430 KHR/kg", province: "Kampong Thom", canal: "site", statut: "Nouveau match", date: "2026-09-10", tel: "086 040 491", photo: "images/o57.jpg" },
  { id: "o58", fermier: "Ratana Chea", culture: "Oignon", key: "oignon", quantite: "60 kg", prix: "2 220 KHR/kg", province: "Kampong Speu", canal: "site", statut: "Nouveau match", date: "2026-09-10", tel: "077 797 652", photo: null },
  { id: "o59", fermier: "Sreymom Chhun", culture: "Pomme de terre", key: "pomme-de-terre", quantite: "80 kg", prix: "1 710 KHR/kg", province: "Battambang", canal: "site", statut: "Nouveau match", date: "2026-09-10", tel: "016 969 077", photo: null },
  { id: "o60", fermier: "Sina Khan", culture: "Noix de coco", key: "coco", quantite: "50 kg", prix: "1 850 KHR/kg", province: "Kampong Cham", canal: "site", statut: "Nouveau match", date: "2026-09-10", tel: "098 572 560", photo: "images/o60.jpg" },
  { id: "o61", fermier: "Vandy Hor", culture: "Basilic thaï", key: "basilic", quantite: "500 kg", prix: "2 400 KHR/kg", province: "Banteay Meanchey", canal: "vocal", statut: "Nouveau match", date: "2026-09-10", tel: "071 489 386", photo: null },
  { id: "o62", fermier: "Sovann Ly", culture: "Coton", key: "coton", quantite: "250 kg", prix: "3 050 KHR/kg", province: "Kandal", canal: "vocal", statut: "Nouveau match", date: "2026-09-10", tel: "012 963 267", photo: null },
  { id: "o63", fermier: "Sreynich Pheng", culture: "Jute", key: "jute", quantite: "1000 kg", prix: "2 170 KHR/kg", province: "Kampong Speu", canal: "sms", statut: "Nouveau match", date: "2026-09-10", tel: "016 998 606", photo: null },
  { id: "o64", fermier: "Narith Vong", culture: "Pastèque", key: "pasteque", quantite: "500 kg", prix: "1 080 KHR/kg", province: "Takeo", canal: "sms", statut: "Nouveau match", date: "2026-09-09", tel: "016 107 535", photo: null },
  { id: "o65", fermier: "Vandy Hor", culture: "Tomate", key: "tomate", quantite: "25 kg", prix: "1 710 KHR/kg", province: "Pursat", canal: "vocal", statut: "Nouveau match", date: "2026-09-09", tel: "071 489 386", photo: null },
  { id: "o66", fermier: "Veasna Chey", culture: "Cardamome", key: "cardamome", quantite: "80 kg", prix: "28 370 KHR/kg", province: "Takeo", canal: "vocal", statut: "Nouveau match", date: "2026-09-09", tel: "086 040 491", photo: null },
  { id: "o67", fermier: "Kanha Tep", culture: "Chou", key: "chou", quantite: "60 kg", prix: "1 210 KHR/kg", province: "Banteay Meanchey", canal: "site", statut: "Nouveau match", date: "2026-09-08", tel: "096 640 606", photo: null },
  { id: "o68", fermier: "Sreynich Pheng", culture: "Papaye", key: "papaye", quantite: "1000 kg", prix: "2 100 KHR/kg", province: "Kratie", canal: "site", statut: "Nouveau match", date: "2026-09-08", tel: "016 998 606", photo: null },
  { id: "o69", fermier: "Thida Nov", culture: "Pomelo", key: "pomelo", quantite: "500 kg", prix: "2 990 KHR/kg", province: "Banteay Meanchey", canal: "vocal", statut: "Nouveau match", date: "2026-09-08", tel: "088 865 206", photo: null },
  { id: "o70", fermier: "Veasna Chey", culture: "Tamarin", key: "tamarin", quantite: "120 kg", prix: "4 390 KHR/kg", province: "Prey Veng", canal: "site", statut: "Nouveau match", date: "2026-09-08", tel: "086 040 491", photo: null },
  { id: "o71", fermier: "Vandy Hor", culture: "Citronnelle", key: "citronnelle", quantite: "300 kg", prix: "1 920 KHR/kg", province: "Siem Reap", canal: "site", statut: "Nouveau match", date: "2026-09-08", tel: "071 489 386", photo: null },
  { id: "o72", fermier: "Maly Ouk", culture: "Coriandre", key: "coriandre", quantite: "150 kg", prix: "2 190 KHR/kg", province: "Pursat", canal: "vocal", statut: "Nouveau match", date: "2026-09-08", tel: "078 581 066", photo: null },
  { id: "o74", fermier: "Bopha Meas", culture: "Banane", key: "banane", quantite: "15 kg", prix: "2 030 KHR/kg", province: "Kampong Speu", canal: "vocal", statut: "Nouveau match", date: "2026-09-07", tel: "015 834 045", photo: null },
  { id: "o75", fermier: "Vanna Kim", culture: "Concombre", key: "concombre", quantite: "80 kg", prix: "930 KHR/kg", province: "Siem Reap", canal: "vocal", statut: "Nouveau match", date: "2026-09-07", tel: "078 670 739", photo: null },
  { id: "o76", fermier: "Ratana Chea", culture: "Canne à sucre", key: "canne", quantite: "40 kg", prix: "470 KHR/kg", province: "Kampong Thom", canal: "vocal", statut: "Nouveau match", date: "2026-09-07", tel: "077 797 652", photo: null },
  { id: "o77", fermier: "Vanna Kim", culture: "Courge", key: "courge", quantite: "250 kg", prix: "1 260 KHR/kg", province: "Banteay Meanchey", canal: "vocal", statut: "Nouveau match", date: "2026-09-07", tel: "078 670 739", photo: null },
  { id: "o78", fermier: "Pisey Sok", culture: "Noix de coco", key: "coco", quantite: "250 kg", prix: "2 180 KHR/kg", province: "Svay Rieng", canal: "vocal", statut: "Nouveau match", date: "2026-09-07", tel: "093 615 145", photo: null },
  { id: "o79", fermier: "Sreynich Pheng", culture: "Rambutan", key: "rambutan", quantite: "30 kg", prix: "4 000 KHR/kg", province: "Takeo", canal: "vocal", statut: "Nouveau match", date: "2026-09-07", tel: "016 998 606", photo: null },
  { id: "o80", fermier: "Thida Nov", culture: "Arachide", key: "arachide", quantite: "1000 kg", prix: "4 220 KHR/kg", province: "Kampong Thom", canal: "site", statut: "Nouveau match", date: "2026-09-07", tel: "088 865 206", photo: null }
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
// téléphone, province, canal préféré, notifications. Centralisées ici
// (plutôt que dans js/parametres.js) pour que toute page qui publie une
// offre au nom de "Vous (démo)" (mes-offres.js, sms.js, appel.js) puisse
// récupérer le numéro de téléphone à associer à l'offre.
const AR_USER_KEY = "allorecolte_user_prefs";

function paramLoadUser() {
  try {
    const raw = localStorage.getItem(AR_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* localStorage indisponible ou donnée corrompue : on repart des valeurs par défaut */ }
  return { nom: "Sopheak", tel: "012 345 678", province: "Kampot", canal: "site", notifVocal: true, notifSms: true, notifSite: true };
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
