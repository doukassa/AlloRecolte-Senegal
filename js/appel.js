/* Page : appel.html — simulateur du canal vocal (IVR + assistant conversationnel)
   -----------------------------------------------------------------------------
   Démo simplifiée : la "compréhension" du langage se fait par recherche de
   mots-clés / numéros de touche (voir AR_KEYWORDS et AR_QUICK_KEYS dans
   appel-i18n.js), pas par un vrai modèle de langage. C'est amplement
   suffisant pour démontrer le concept devant un jury, mais ce n'est pas le
   moteur conversationnel réel décrit dans le dossier de projet. */

let soundOn = true;
let recognition = null;
let micStream = null;

let lang = null;      // "fr" | "en" | "km"
let stage = "idle";   // "lang" | "menu" | "price-pick" | "sell-culture" | "sell-qty" | "sell-price"
let sellData = {};
let keypadBuffer = "";

function speak(text, langCode) {
  if (!soundOn || !("speechSynthesis" in window)) return;
  try {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode || "fr-FR";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch (e) {
    /* synthèse vocale indisponible : on continue en silence */
  }
}

// Lit plusieurs segments à la suite, chacun avec sa propre langue (utilisé
// pour le message d'accueil trilingue) au lieu d'un seul bloc de texte lu
// avec un seul accent. window.speechSynthesis met naturellement les
// utterances en file : on ne "cancel" qu'une fois, avant le premier.
function speakSegments(segments) {
  if (!soundOn || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    segments.forEach((seg) => {
      const utter = new SpeechSynthesisUtterance(seg.text);
      utter.lang = seg.lang;
      window.speechSynthesis.speak(utter);
    });
  } catch (e) {
    /* synthèse vocale indisponible : on continue en silence */
  }
}

function addBubble(role, text, tag) {
  const transcript = document.getElementById("transcript");
  const div = document.createElement("div");
  div.className = "bubble " + role;
  div.innerHTML = (tag ? `<span class="tag">${tag}</span>` : "") + text;
  transcript.appendChild(div);
  transcript.scrollTop = transcript.scrollHeight;
}

function systemSay(text, tag) {
  addBubble("system", text, tag || (lang ? AR_I18N[lang].langTag : ""));
  speak(text, lang ? AR_I18N[lang].speechLang : "fr-FR");
}

function notifySms() {
  const transcript = document.getElementById("transcript");
  const div = document.createElement("div");
  div.className = "helper";
  div.style.textAlign = "center";
  div.innerHTML = AR_I18N[lang].smsNotice;
  transcript.appendChild(div);
  transcript.scrollTop = transcript.scrollHeight;
}

function updateKeypadScreen() {
  document.getElementById("keypad-screen").textContent = keypadBuffer || " ";
}

/* ---------- résolution du langage / des produits à partir du texte ---------- */

function resolveLang(raw) {
  const t = raw.trim().toLowerCase();
  if (t === "1" || t.includes("franc") || t.includes("french")) return "fr";
  if (t === "2" || t.includes("english") || t.includes("anglais")) return "en";
  if (t === "3" || t.includes("khmer") || raw.includes("ខ្មែរ")) return "km";
  return null;
}

function resolveProductFromText(raw, curLang) {
  const trimmed = raw.trim();
  if (/^[1-9]$/.test(trimmed)) {
    const idx = parseInt(trimmed, 10) - 1;
    if (AR_QUICK_KEYS[idx]) return AR_QUICK_KEYS[idx];
  }
  const lower = trimmed.toLowerCase();
  if (curLang === "km") {
    const entry = Object.entries(AR_NAMES.km).find(([, name]) => raw.includes(name));
    return entry ? entry[0] : null;
  }
  const kw = AR_KEYWORDS[curLang];
  for (const key of Object.keys(kw)) {
    if (key === "sell") continue;
    if (kw[key].some((k2) => lower.includes(k2))) return key;
  }
  return null;
}

function isSellIntent(raw, curLang) {
  if (curLang === "km") return false; // le khmer s'utilise via le clavier pour cette démo
  const lower = raw.trim().toLowerCase();
  return AR_KEYWORDS[curLang].sell.some((k) => lower.includes(k));
}

// Option "poser une question" (conseil agricole, hors prix/vente) : réponse
// par mots-clés sur une petite base de démo (voir AR_FAQ, appel-i18n.js).
// resolveFaqEntry() renvoie l'entrée complète (réponse + résumé pour le
// SMS récapitulatif), pas seulement le texte de la réponse, pour que
// handleUserInput() puisse aussi envoyer le petit résumé par SMS.
function resolveFaqEntry(raw, curLang) {
  const faq = AR_FAQ[curLang];
  if (!faq) return null;
  const lower = raw.trim().toLowerCase();
  return faq.find((entry) => entry.keywords.some((k) => lower.includes(k))) || null;
}

function parseNumber(raw) {
  const m = raw.match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

/* ---------- déroulé de l'appel ---------- */

async function ensureMic() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (e) {
    return false; // refusé ou indisponible : on continue au clavier/texte
  }
}

function setupRecognition(micOk) {
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn = document.getElementById("mic-btn");

  if (!micOk || !SpeechRecognitionAPI) {
    micBtn.style.display = "none";
    return;
  }

  micBtn.style.display = "inline-flex";
  recognition = new SpeechRecognitionAPI();
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.lang = lang ? AR_I18N[lang].speechLang : "fr-FR";

  recognition.onresult = (event) => {
    handleUserInput(event.results[0][0].transcript);
  };
  recognition.onerror = () => {
    /* échec ponctuel de la reconnaissance : le clavier et le texte restent utilisables */
  };
}

async function startCall() {
  document.getElementById("call-idle").style.display = "none";
  document.getElementById("call-active").style.display = "grid";
  document.getElementById("transcript").innerHTML = "";
  document.getElementById("lang-warning").style.display = "none";
  document.getElementById("call-hint").textContent = "Exemples à essayer : « prix du riz », « je veux vendre ma récolte », ou une question sur votre culture.";

  lang = null;
  stage = "lang";
  sellData = {};
  keypadBuffer = "";
  updateKeypadScreen();

  addBubble("system", AR_WELCOME_LANG, "FR · EN · KM");
  speakSegments(AR_WELCOME_SEGMENTS);

  const micOk = await ensureMic();
  setupRecognition(micOk);
}

function endCall() {
  document.getElementById("call-idle").style.display = "block";
  document.getElementById("call-active").style.display = "none";

  if (recognition) {
    try { recognition.stop(); } catch (e) { /* déjà arrêté */ }
    recognition = null;
  }
  if (micStream) {
    micStream.getTracks().forEach((t) => t.stop());
    micStream = null;
  }
  window.speechSynthesis && window.speechSynthesis.cancel();

  lang = null;
  stage = "idle";
  sellData = {};
  keypadBuffer = "";
}

function handleUserInput(raw) {
  const text = String(raw).trim();
  if (!text) return;
  addBubble("user", text);

  // ---- Étape 0 : choix de la langue ----
  if (stage === "lang") {
    const chosen = resolveLang(text);
    if (!chosen) {
      systemSay(AR_WELCOME_LANG, "FR · EN · KM");
      return;
    }
    lang = chosen;
    stage = "menu";
    if (recognition) recognition.lang = AR_I18N[lang].speechLang;
    document.getElementById("lang-warning").style.display = lang === "km" ? "block" : "none";
    document.getElementById("call-hint").textContent = AR_I18N[lang].hint;
    systemSay(AR_I18N[lang].menu(), AR_I18N[lang].langTag);
    return;
  }

  const t = AR_I18N[lang];

  // ---- Étape : menu principal ----
  if (stage === "menu") {
    if (text === "1") { stage = "price-pick"; systemSay(t.askPriceProduct(arQuickList(lang))); return; }
    if (text === "2") { stage = "sell-culture"; systemSay(t.askSellProduct(arQuickList(lang))); return; }
    if (text === "3") {
      if (lang === "km") { systemSay(t.questionKmNotice); return; } // texte libre non disponible en khmer pour cette démo
      stage = "question";
      systemSay(t.askQuestion());
      return;
    }
    if (text === "4") { systemSay(t.menu()); return; }

    if (isSellIntent(text, lang)) { stage = "sell-culture"; systemSay(t.askSellProduct(arQuickList(lang))); return; }

    const key = resolveProductFromText(text, lang);
    if (key) {
      const p = arFindPriceByKey(key);
      systemSay(t.priceAnswer(AR_NAMES[lang][key], p.prix));
      arAddSms(t.smsPrice(AR_NAMES.fr[key], p.prix));
      notifySms();
      return;
    }
    systemSay(t.fallback());
    return;
  }

  // ---- Étape : question libre (conseil agricole, hors prix/vente) ----
  if (stage === "question") {
    const entry = resolveFaqEntry(text, lang);
    systemSay(entry ? entry.answer : t.questionFallback);
    // Un petit résumé est aussi envoyé par SMS, comme pour un prix ou une
    // offre publiée : si la personne raccroche juste après avoir posé sa
    // question, elle retrouve quand même l'essentiel dans ses SMS.
    if (entry) {
      arAddSms(t.smsQuestion(entry.summary));
      notifySms();
    }
    stage = "menu";
    return;
  }

  // ---- Étape : sélection d'un produit pour connaître son prix ----
  if (stage === "price-pick") {
    const key = resolveProductFromText(text, lang);
    if (!key) { systemSay(t.invalidNumber); return; }
    const p = arFindPriceByKey(key);
    systemSay(t.priceAnswer(AR_NAMES[lang][key], p.prix));
    arAddSms(t.smsPrice(AR_NAMES.fr[key], p.prix));
    notifySms();
    stage = "menu";
    return;
  }

  // ---- Étape : sélection d'un produit à vendre ----
  if (stage === "sell-culture") {
    const key = resolveProductFromText(text, lang);
    if (!key) { systemSay(t.invalidNumber); return; }
    sellData = { key, culture: AR_NAMES[lang][key] };
    stage = "sell-qty";
    systemSay(t.askQty(sellData.culture));
    return;
  }

  // ---- Étape : quantité ----
  if (stage === "sell-qty") {
    const n = parseNumber(text);
    if (n === null) { systemSay(t.invalidNumber); return; }
    sellData.quantite = n;
    stage = "sell-price";
    systemSay(t.askPrice);
    return;
  }

  // ---- Étape : prix, puis publication de l'offre ----
  if (stage === "sell-price") {
    const n = parseNumber(text);
    if (n === null) { systemSay(t.invalidNumber); return; }
    sellData.prix = n;

    const offer = arAddOffer({
      fermier: "Vous (démo)",
      culture: AR_NAMES.fr[sellData.key],
      key: sellData.key,
      quantite: `${sellData.quantite} kg`,
      prix: `${sellData.prix.toLocaleString("fr-FR")} KHR/kg`,
      province: "Kampot",
      canal: "vocal",
      statut: "Nouveau match",
      photo: null
    });

    systemSay(t.offerConfirm(sellData.culture, sellData.quantite, sellData.prix.toLocaleString("fr-FR")));
    arAddSms(t.smsOffer(AR_NAMES.fr[sellData.key], offer.quantite, offer.prix));
    notifySms();

    sellData = {};
    stage = "menu";
    return;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-call").addEventListener("click", startCall);
  document.getElementById("end-call").addEventListener("click", endCall);

  const input = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  sendBtn.addEventListener("click", () => {
    handleUserInput(input.value);
    input.value = "";
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleUserInput(input.value);
      input.value = "";
    }
  });

  const soundBtn = document.getElementById("sound-toggle");
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    soundBtn.textContent = "Son : " + (soundOn ? "activé" : "désactivé");
    if (!soundOn && "speechSynthesis" in window) window.speechSynthesis.cancel();
  });

  document.getElementById("mic-btn").addEventListener("click", () => {
    if (!recognition) return;
    try { recognition.start(); } catch (e) { /* déjà en cours d'écoute */ }
  });

  // ---- Clavier de téléphone ----
  document.querySelectorAll(".keypad-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.key;
      const bufferedStage = stage === "sell-qty" || stage === "sell-price";

      if (bufferedStage) {
        if (k === "#") {
          if (keypadBuffer) { handleUserInput(keypadBuffer); keypadBuffer = ""; updateKeypadScreen(); }
        } else if (k === "*") {
          keypadBuffer = ""; updateKeypadScreen();
        } else {
          keypadBuffer += k; updateKeypadScreen();
        }
      } else {
        if (k === "*" || k === "#") return;
        handleUserInput(k);
      }
    });
  });
});
