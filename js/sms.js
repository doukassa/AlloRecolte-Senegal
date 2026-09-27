/* Page : sms.html — simulateur du canal SMS
   -------------------------------------------------------------
   Deux sources de messages dans le fil :
   1) les SMS générés automatiquement par le simulateur d'appel
      (arAddSms appelé depuis js/appel.js) ;
   2) les SMS que le fermier tape et "envoie" lui-même ici, avec
      une réponse automatique par mots-clés (même logique simplifiée
      que le simulateur d'appel — pas un vrai opérateur télécom). */

function smsRender() {
  const db = arLoad();
  const list = document.getElementById("sms-list");
  const empty = document.getElementById("sms-empty");

  if (!db.smsLog || db.smsLog.length === 0) {
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  // smsLog est stocké du plus récent au plus ancien (unshift) ;
  // on l'affiche du plus ancien au plus récent, comme un vrai fil de discussion.
  const chrono = db.smsLog.slice().reverse();

  list.innerHTML = chrono
    .map((s) => {
      const out = s.direction === "out";
      return `
      <div class="sms-row ${out ? "out" : ""}">
        <div class="sms-bubble ${out ? "out" : ""}">${s.text}</div>
        <div class="sms-time">${s.time}</div>
      </div>`;
    })
    .join("");

  list.scrollTop = list.scrollHeight;
}

/* ---- réponse automatique par mots-clés (français, démo simplifiée) ---- */

function smsResolveProduct(raw) {
  const trimmed = raw.trim().toLowerCase();
  const kw = AR_KEYWORDS.fr;
  for (const key of Object.keys(kw)) {
    if (key === "sell") continue;
    if (kw[key].some((k) => trimmed.includes(k))) return key;
  }
  return null;
}

function smsIsSellIntent(raw) {
  const trimmed = raw.trim().toLowerCase();
  return AR_KEYWORDS.fr.sell.some((k) => trimmed.includes(k));
}

// Petites questions de conseil agricole (mêmes réponses que le simulateur
// d'appel — voir AR_FAQ dans js/appel-i18n.js), reconnues par mots-clés
// dans le texte du SMS. Démo simplifiée, pas un vrai assistant agricole.
function smsResolveFaqAnswer(raw) {
  const trimmed = raw.trim().toLowerCase();
  const faq = AR_FAQ.fr;
  const hit = faq.find((entry) => entry.keywords.some((k) => trimmed.includes(k)));
  return hit ? hit.answer : null;
}

function smsExtractNumbers(raw) {
  const matches = raw.match(/\d+/g);
  return matches ? matches.map((n) => parseInt(n, 10)) : [];
}

function smsAutoReply(raw) {
  const key = smsResolveProduct(raw);

  if (smsIsSellIntent(raw)) {
    if (!key) {
      return "AlloRécolte — Pour publier une offre par SMS, écrivez : vendre [produit] [quantité]kg [prix]KHR. Ex. : vendre riz 200kg 1300.";
    }
    const nums = smsExtractNumbers(raw);
    const quantite = nums[0] || null;
    const prix = nums[1] || null;
    if (!quantite || !prix) {
      return `AlloRécolte — Presque ! Précisez la quantité (kg) et le prix (KHR/kg). Ex. : vendre ${AR_NAMES.fr[key].toLowerCase()} 200kg 1300.`;
    }
    const offer = arAddOffer({
      fermier: "Vous (démo)",
      culture: AR_NAMES.fr[key],
      key,
      quantite: `${quantite} kg`,
      prix: `${prix.toLocaleString("fr-FR")} KHR/kg`,
      province: "Kampot",
      canal: "sms",
      statut: "Nouveau match",
      photo: null
    });
    return `AlloRécolte — Votre offre a été publiée : ${offer.culture}, ${offer.quantite} à ${offer.prix}. Les acheteurs correspondants seront notifiés.`;
  }

  if (key) {
    const p = arFindPriceByKey(key);
    return `AlloRécolte — Le prix du jour pour le ${AR_NAMES.fr[key].toLowerCase()} est de ${p.prix} à Kampot. Pour vendre, écrivez : vendre ${AR_NAMES.fr[key].toLowerCase()} [quantité]kg [prix]KHR.`;
  }

  const faqAnswer = smsResolveFaqAnswer(raw);
  if (faqAnswer) {
    return `AlloRécolte — ${faqAnswer}`;
  }

  return "AlloRécolte — Message non reconnu (démo par mots-clés). Essayez : « prix riz », « vendre manioc 100kg 620 » ou une question comme « pourquoi mes feuilles jaunissent ».";
}

document.addEventListener("DOMContentLoaded", () => {
  smsRender();

  const input = document.getElementById("sms-input");
  const sendBtn = document.getElementById("sms-send");

  function send() {
    const text = input.value.trim();
    if (!text) return;

    arAddSms(text, "out");
    smsRender();
    input.value = "";

    // léger délai pour simuler l'aller-retour réseau d'un vrai SMS
    window.setTimeout(() => {
      arAddSms(smsAutoReply(text), "in");
      smsRender();
    }, 500);
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
});
