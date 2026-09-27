/* =========================================================
   AlloRécolte — textes du simulateur d'appel en 3 langues
   -----------------------------------------------------------
   Le français et l'anglais ont été relus. Les textes en khmer
   sont une traduction automatique fournie à titre de démo :
   ils doivent être relus par un locuteur khmer natif avant
   toute utilisation réelle (voir le bandeau affiché dans
   l'application quand le khmer est sélectionné, et le README).

   AR_NAMES / AR_KEYWORDS couvrent maintenant les 50 produits du
   catalogue (fr/en), pour que la reconnaissance en texte libre
   fonctionne sur tout le catalogue, pas seulement les 9 produits
   du clavier rapide (AR_QUICK_KEYS, volontairement limité à 9
   pour rester rapide au téléphone). Le khmer reste limité aux
   12 produits d'origine pour cette démo (traduction non relue —
   voir plus haut) ; les autres restent accessibles en khmer via
   le clavier numérique une fois le produit choisi autrement.
   ========================================================= */

// Message d'accueil trilingue : décomposé en 3 énoncés distincts pour que
// chacun soit lu avec la bonne voix (fr-FR / en-US / km-KH) au lieu d'un
// seul bloc mélangé lu avec un seul accent (voir js/appel.js, speakSegments).
const AR_WELCOME_SEGMENTS = [
  { text: "Bienvenue sur AlloRécolte. Pour continuer en français, tapez 1.", lang: "fr-FR" },
  { text: "To continue in English, tap 2.", lang: "en-US" },
  { text: "សម្រាប់ភាសាខ្មែរ សូមចុចលេខ 3។", lang: "km-KH" }
];
const AR_WELCOME_LANG = AR_WELCOME_SEGMENTS.map((s) => s.text).join(" ");

const AR_NAMES = {
  fr: {
    "riz": "Riz jasmin", "mais": "Maïs", "manioc": "Manioc",
    "poivre-noir": "Poivre noir", "poivre-rouge": "Poivre rouge",
    "mangue": "Mangue", "banane": "Banane", "cajou": "Noix de cajou",
    "pasteque": "Pastèque", "concombre": "Concombre", "aubergine": "Aubergine", "canne": "Canne à sucre",
    "haricot-vert": "Haricots verts", "tomate": "Tomate", "oignon": "Oignon", "ail": "Ail",
    "patate-douce": "Patate douce", "pomme-de-terre": "Pomme de terre", "courge": "Courge",
    "haricot-long": "Haricot long", "chou": "Chou", "laitue": "Laitue",
    "morning-glory": "Liseron d'eau", "gombo": "Gombo", "piment": "Piment", "citron": "Citron vert",
    "ananas": "Ananas", "papaye": "Papaye", "coco": "Noix de coco", "longane": "Longane",
    "durian": "Durian", "jacque": "Jacque", "rambutan": "Rambutan", "pomelo": "Pomelo",
    "tamarin": "Tamarin", "soja": "Soja", "arachide": "Arachide", "sesame": "Sésame",
    "haricot-mungo": "Haricot mungo", "cardamome": "Cardamome", "gingembre": "Gingembre",
    "curcuma": "Curcuma", "citronnelle": "Citronnelle", "basilic": "Basilic thaï", "menthe": "Menthe",
    "coriandre": "Coriandre", "coton": "Coton", "jute": "Jute"
  },
  en: {
    "riz": "jasmine rice", "mais": "corn", "manioc": "cassava",
    "poivre-noir": "black pepper", "poivre-rouge": "red pepper",
    "mangue": "mango", "banane": "banana", "cajou": "cashew",
    "pasteque": "watermelon", "concombre": "cucumber", "aubergine": "eggplant", "canne": "sugarcane",
    "haricot-vert": "green beans", "tomate": "tomato", "oignon": "onion", "ail": "garlic",
    "patate-douce": "sweet potato", "pomme-de-terre": "potato", "courge": "pumpkin",
    "haricot-long": "long bean", "chou": "cabbage", "laitue": "lettuce",
    "morning-glory": "water spinach", "gombo": "okra", "piment": "chili pepper", "citron": "lime",
    "ananas": "pineapple", "papaye": "papaya", "coco": "coconut", "longane": "longan",
    "durian": "durian", "jacque": "jackfruit", "rambutan": "rambutan", "pomelo": "pomelo",
    "tamarin": "tamarind", "soja": "soybean", "arachide": "peanut", "sesame": "sesame",
    "haricot-mungo": "mung bean", "cardamome": "cardamom", "gingembre": "ginger",
    "curcuma": "turmeric", "citronnelle": "lemongrass", "basilic": "thai basil", "menthe": "mint",
    "coriandre": "coriander", "coton": "cotton", "jute": "jute"
  },
  km: {
    "riz": "ស្រូវម្លិះ", "mais": "ពោត", "manioc": "ដំឡូងមី",
    "poivre-noir": "ម្រេចខ្មៅ", "poivre-rouge": "ម្រេចក្រហម",
    "mangue": "ស្វាយ", "banane": "ចេក", "cajou": "ស្វាយចន្ទី",
    "pasteque": "ឪឡឹក", "concombre": "ត្រសក់", "aubergine": "ត្រប់", "canne": "អំពៅ"
  }
};

// Mots-clés de reconnaissance en texte libre (français / anglais uniquement —
// le khmer s'utilise principalement via le clavier, voir appel.js)
const AR_KEYWORDS = {
  fr: {
    "riz": ["riz"], "mais": ["mais", "maïs"], "manioc": ["manioc"],
    "poivre-noir": ["poivre noir"], "poivre-rouge": ["poivre rouge"],
    "mangue": ["mangue"], "banane": ["banane"], "cajou": ["cajou"],
    "pasteque": ["pasteque", "pastèque"], "concombre": ["concombre"],
    "aubergine": ["aubergine"], "canne": ["canne"],
    "haricot-vert": ["haricot vert", "haricots verts"], "tomate": ["tomate"],
    "oignon": ["oignon"], "ail": ["ail"],
    "patate-douce": ["patate douce"], "pomme-de-terre": ["pomme de terre"],
    "courge": ["courge"], "haricot-long": ["haricot long"], "chou": ["chou"], "laitue": ["laitue"],
    "morning-glory": ["liseron", "morning glory"], "gombo": ["gombo"], "piment": ["piment"],
    "citron": ["citron"], "ananas": ["ananas"], "papaye": ["papaye"], "coco": ["noix de coco", "coco"],
    "longane": ["longane"], "durian": ["durian"], "jacque": ["jacque", "jacquier"],
    "rambutan": ["rambutan"], "pomelo": ["pomelo"], "tamarin": ["tamarin"], "soja": ["soja"],
    "arachide": ["arachide", "cacahuète"], "sesame": ["sesame", "sésame"],
    "haricot-mungo": ["haricot mungo"], "cardamome": ["cardamome"], "gingembre": ["gingembre"],
    "curcuma": ["curcuma"], "citronnelle": ["citronnelle"], "basilic": ["basilic"],
    "menthe": ["menthe"], "coriandre": ["coriandre"], "coton": ["coton"],
    "jute": ["jute"],
    sell: ["vendre", "publier"]
  },
  en: {
    "riz": ["rice"], "mais": ["corn", "maize"], "manioc": ["cassava"],
    "poivre-noir": ["black pepper"], "poivre-rouge": ["red pepper"],
    "mangue": ["mango"], "banane": ["banana"], "cajou": ["cashew"],
    "pasteque": ["watermelon"], "concombre": ["cucumber"],
    "aubergine": ["eggplant"], "canne": ["sugarcane"],
    "haricot-vert": ["green bean"], "tomate": ["tomato"], "oignon": ["onion"], "ail": ["garlic"],
    "patate-douce": ["sweet potato"], "pomme-de-terre": ["potato"], "courge": ["pumpkin", "squash"],
    "haricot-long": ["long bean"], "chou": ["cabbage"], "laitue": ["lettuce"],
    "morning-glory": ["water spinach", "morning glory"], "gombo": ["okra"], "piment": ["chili", "chilli"],
    "citron": ["lime"], "ananas": ["pineapple"], "papaye": ["papaya"], "coco": ["coconut"],
    "longane": ["longan"], "durian": ["durian"], "jacque": ["jackfruit"], "rambutan": ["rambutan"],
    "pomelo": ["pomelo"], "tamarin": ["tamarind"], "soja": ["soybean", "soy"],
    "arachide": ["peanut"], "sesame": ["sesame"], "haricot-mungo": ["mung bean"],
    "cardamome": ["cardamom"], "gingembre": ["ginger"], "curcuma": ["turmeric"],
    "citronnelle": ["lemongrass"], "basilic": ["thai basil", "basil"], "menthe": ["mint"],
    "coriandre": ["coriander"], "coton": ["cotton"], "jute": ["jute"],
    sell: ["sell", "publish"]
  }
};

// Ordre des 9 premiers produits accessibles par une simple touche (1 à 9) au clavier
const AR_QUICK_KEYS = ["riz", "mais", "manioc", "poivre-noir", "poivre-rouge", "mangue", "banane", "cajou", "pasteque"];

function arQuickList(lang) {
  return AR_QUICK_KEYS.map((k, i) => `${i + 1} ${AR_NAMES[lang][k]}`).join(", ");
}

// Petite base de réponses par mots-clés pour l'option "poser une question"
// (conseil agricole général, hors prix/vente) — démo, pas un vrai système
// expert agronomique. Non disponible en khmer pour cette démo (voir
// questionKmNotice ci-dessous), comme la reconnaissance de texte libre.
const AR_FAQ = {
  fr: [
    { keywords: ["jaun"], answer: "Des feuilles qui jaunissent peuvent avoir plusieurs causes. Le plus souvent, c'est un excès d'eau qui asphyxie les racines, ou au contraire un manque d'eau qui stresse la plante — regardez d'abord l'état du sol : s'il est détrempé, espacez les arrosages ; s'il est sec en profondeur, arrosez plus régulièrement mais en petites quantités. Si le sol est correctement humide, le jaunissement vient souvent d'un manque d'azote : un engrais organique riche en azote, comme du compost bien décomposé ou du fumier, redonne en général une belle couleur verte en une à deux semaines. Si seules les feuilles du bas jaunissent et tombent une à une, c'est normal, c'est le vieillissement naturel de la plante. Si le jaunissement touche toute la plante rapidement, avec des taches ou un flétrissement, ce peut aussi être une maladie — dans ce cas, mieux vaut consulter un agent agricole de votre région.", summary: "Feuilles jaunes : vérifiez d'abord l'arrosage, puis un engrais riche en azote si ça persiste." },
    { keywords: ["insecte", "ravageur", "chenille", "puceron", "parasite"], answer: "Pour les insectes ravageurs, commencez par identifier le problème : retournez quelques feuilles et regardez le dessous, où se cachent souvent pucerons et chenilles. Retirez et détruisez à la main les feuilles très abîmées pour limiter la propagation. Un mélange simple d'eau savonneuse pulvérisé sur les feuilles élimine efficacement pucerons et petites larves, sans produit chimique. Pour les chenilles et gros insectes, ramassez-les à la main tôt le matin, quand ils sont moins actifs. Si l'invasion touche une grande partie de la parcelle malgré ces gestes, contactez un agent agricole de votre région : certains ravageurs demandent un traitement ciblé.", summary: "Insectes : inspectez le dessous des feuilles, retirez les parties atteintes, eau savonneuse en traitement léger." },
    { keywords: ["eau", "sécheresse", "secheresse", "arrosage", "sec"], answer: "En période sèche, la clé est de limiter l'évaporation plutôt que d'arroser davantage. Arrosez tôt le matin ou tard le soir, jamais en pleine chaleur, pour que l'eau pénètre bien dans le sol au lieu de s'évaporer aussitôt. Un paillage — paille, feuilles sèches, ou résidus de récolte — étalé autour des plants garde l'humidité plus longtemps et réduit nettement le besoin d'arrosage. Arrosez aussi profondément mais moins souvent plutôt que peu et souvent : les racines descendent plus profondément et la plante résiste mieux au manque d'eau suivant. Si possible, privilégiez l'arrosage au pied de la plante plutôt qu'en pluie sur les feuilles, pour limiter les pertes.", summary: "Sécheresse : arrosez tôt le matin ou tard le soir, et paillez le sol pour garder l'humidité." },
    { keywords: ["sol", "terre", "engrais", "fertilis"], answer: "Un sol fatigué se reconnaît à une croissance de plus en plus faible d'une saison à l'autre, même avec les mêmes soins. La cause la plus fréquente est de cultiver toujours la même plante au même endroit, ce qui épuise certains nutriments du sol. La solution la plus efficace est la rotation des cultures : alternez par exemple une légumineuse (haricot, soja) qui enrichit le sol en azote, avec votre culture principale la saison suivante. En complément, l'ajout régulier de compost naturel ou de fumier bien décomposé restaure la matière organique et la vie du sol. Évitez aussi de laisser le sol nu trop longtemps entre deux cultures : une culture de couverture ou un paillage le protège et limite l'érosion.", summary: "Sol fatigué : alternez vos cultures (rotation) et ajoutez du compost naturel régulièrement." },
    { keywords: ["maladie", "champignon", "tache", "pourri"], answer: "Les taches sur les feuilles, la pourriture ou le duvet blanchâtre viennent presque toujours d'un excès d'humidité combiné à un manque d'aération. Retirez et détruisez les parties atteintes dès que vous les repérez, pour éviter que la maladie ne se propage aux plants voisins — ne les mettez pas au compost. Espacez un peu plus vos plants à la prochaine plantation pour que l'air circule mieux et sèche le feuillage plus vite après la pluie. Arrosez au pied de la plante plutôt que sur les feuilles, et si possible le matin, pour que le feuillage sèche pendant la journée. Si la maladie continue à se propager malgré ces gestes, un traitement biologique adapté ou l'avis d'un agent agricole de votre région sera plus efficace.", summary: "Taches / pourriture : retirez les parties atteintes, espacez les plants, arrosez au pied plutôt que sur les feuilles." },
    { keywords: ["pluie", "inondation", "eau stagnante", "trop d'eau", "trop deau"], answer: "Face à des pluies fortes ou à de l'eau qui stagne, le plus urgent est d'évacuer l'excès d'eau : creusez de petits sillons ou canaux autour des plants pour qu'elle s'écoule plutôt que de stagner. Des racines qui restent immergées plus de 24 à 48 heures manquent d'oxygène et commencent à pourrir, ce qui peut tuer la plante même après le retrait de l'eau. Si vos plants sont en pot ou en bac, surélevez-les temporairement. Après la décrue, inspectez les racines et retirez les parties molles ou noircies. Pour les prochaines plantations sur une parcelle sujette aux inondations, pensez à créer de petites buttes surélevées qui drainent mieux.", summary: "Eau stagnante / inondation : creusez de petits sillons pour évacuer l'excès d'eau autour des plants." },
    { keywords: ["quand récolter", "quand recolter", "moment de récolter", "prêt à récolter", "pret a recolter"], answer: "Le bon moment de récolte dépend beaucoup de la culture, mais quelques signes généraux aident à en juger : la couleur qui devient plus soutenue ou change franchement, la fermeté du produit qui se stabilise, et parfois une légère odeur ou un détachement facile de la tige. Récolter trop tôt donne souvent un produit moins savoureux et qui se conserve moins bien ; récolter trop tard peut le rendre trop mûr ou plus fragile au transport. Le meilleur repère reste l'observation régulière de vos plants au fil des jours, combinée aux conseils d'autres fermiers de votre région qui cultivent la même chose — les conditions locales influencent beaucoup le bon moment. Un agent agricole de votre région peut aussi vous donner des repères précis pour votre culture.", summary: "Moment de récolte : observez la couleur et la fermeté du produit, et demandez conseil localement." },
    { keywords: ["vent", "typhon", "tempête", "tempete"], answer: "Avant une tempête annoncée, la priorité est de protéger les plants les plus vulnérables : tuteurez solidement les jeunes plants et les cultures hautes, et si possible récoltez en avance les produits déjà proches de la maturité pour ne pas les perdre. Après le passage du vent, inspectez la parcelle : redressez délicatement les plants penchés tant que la terre est encore meuble autour des racines, et retirez rapidement les branches et feuilles cassées, qui sont des portes d'entrée pour les maladies. Vérifiez aussi le drainage, car les tempêtes s'accompagnent souvent de fortes pluies. Laissez ensuite un peu de temps aux plants pour récupérer avant de reprendre les traitements ou la fertilisation.", summary: "Vent / typhon : tuteurez avant la tempête, redressez et retirez les branches cassées après." },
    { keywords: ["rat", "oiseau", "sanglier", "animal", "vache"], answer: "Contre les animaux qui abîment les cultures — rats, oiseaux, sangliers ou même bétail — la première ligne de défense est une clôture simple mais bien entretenue autour de la parcelle, sans trou ni passage évident. Un épouvantail, des rubans qui bougent au vent, ou de petits bruits peuvent faire fuir les oiseaux, mais leur efficacité baisse avec le temps si vous ne les déplacez pas régulièrement. Récoltez les produits mûrs le plus tôt possible : c'est souvent le produit déjà mûr, au sol ou sur pied, qui attire le plus les animaux. Pour les rongeurs, garder la parcelle propre, sans tas de débris ou de résidus de récolte, réduit les cachettes disponibles. Pour une attaque importante et récurrente, un agent agricole de votre région peut conseiller des solutions plus adaptées à l'animal en cause.", summary: "Animaux nuisibles : une clôture bien entretenue ou un épouvantail, et récoltez dès que c'est mûr." },
    { keywords: ["conserver", "conservation", "stockage", "stocker"], answer: "Après la récolte, la qualité de conservation dépend surtout de trois choses : la sécheresse, l'aération et la protection de la lumière directe. Stockez dans un endroit sec et bien ventilé — l'humidité est la première cause de moisissure et de pourriture en stockage. Surélevez si possible les sacs ou caisses du sol, sur des palettes ou des planches, pour limiter le contact avec l'humidité et les rongeurs. Contrôlez régulièrement le stock, surtout dans les deux premières semaines : à la moindre trace de moisissure, retirez immédiatement les produits touchés pour éviter que ça ne se propage au reste. Enfin, évitez d'entasser trop densément : un peu de circulation d'air entre les sacs ou les caisses prolonge nettement la durée de conservation.", summary: "Conservation après récolte : stockez au sec, bien ventilé, à l'abri de la lumière directe." },
    { keywords: ["variété", "variete", "semence", "quelle graine"], answer: "Le choix de la variété a un impact énorme sur la réussite d'une culture, souvent plus que les soins apportés ensuite. Privilégiez d'abord une variété reconnue pour bien pousser dans le climat et le type de sol de votre région — une variété qui réussit ailleurs ne donnera pas forcément le même résultat chez vous. Renseignez-vous auprès d'une coopérative agricole locale, d'un fournisseur de semences de confiance, ou tout simplement d'autres fermiers de votre zone qui cultivent déjà la même chose : leur expérience directe vaut souvent plus que n'importe quelle fiche technique générale. Pensez aussi à varier les variétés d'une saison à l'autre si possible, ce qui limite les risques si une maladie ou un ravageur touche particulièrement une variété donnée.", summary: "Choix de variété : privilégiez une variété adaptée au climat et au sol de votre région." }
  ],
  en: [
    { keywords: ["yellow"], answer: "Yellowing leaves can have several causes. Most often it's too much water suffocating the roots, or the opposite — too little water stressing the plant — so start by checking the soil: if it's waterlogged, water less often; if it's dry deep down, water more regularly but in smaller amounts. If soil moisture seems right, yellowing often points to a lack of nitrogen: a nitrogen-rich organic fertilizer, like well-decomposed compost or manure, usually restores a healthy green color within one to two weeks. If only the lower leaves are yellowing and dropping one by one, that's normal natural aging. If yellowing spreads quickly across the whole plant along with spots or wilting, it could also be a disease — in that case, it's best to consult an agricultural extension officer in your area.", summary: "Yellow leaves: check watering first, then a nitrogen-rich fertilizer if it continues." },
    { keywords: ["insect", "pest", "aphid", "caterpillar"], answer: "For pest insects, start by identifying the problem: turn a few leaves over and check the underside, where aphids and caterpillars often hide. Remove and destroy badly affected leaves by hand to limit the spread. A simple soapy water spray applied to the leaves effectively kills aphids and small larvae without chemicals. For caterpillars and larger insects, hand-pick them early in the morning when they're less active. If the infestation covers a large part of the plot despite these steps, contact an agricultural extension officer in your area — some pests need a targeted treatment.", summary: "Insects: check under the leaves, remove affected parts, a light soapy water treatment helps." },
    { keywords: ["water", "drought", "dry"], answer: "During dry periods, the key is limiting evaporation rather than watering more. Water early morning or late evening, never in full heat, so the water soaks into the soil instead of evaporating right away. Mulching — straw, dry leaves, or crop residue — spread around the plants keeps moisture in much longer and noticeably reduces how often you need to water. Water deeply but less often rather than lightly and frequently: roots grow deeper and the plant handles the next dry spell better. Where possible, water at the base of the plant rather than over the leaves, to reduce loss.", summary: "Drought: water early morning or evening, and mulch the soil to keep moisture in." },
    { keywords: ["soil", "fertil"], answer: "Tired soil shows up as weaker growth season after season, even with the same care. The most common cause is growing the same crop in the same spot repeatedly, which depletes certain soil nutrients. The most effective fix is crop rotation: alternate, for example, a legume (beans, soy) that enriches the soil with nitrogen, with your main crop the following season. Adding natural compost or well-decomposed manure regularly also restores organic matter and soil life. Also avoid leaving soil bare for too long between crops — a cover crop or mulch protects the soil and limits erosion.", summary: "Tired soil: rotate your crops and add natural compost regularly." },
    { keywords: ["disease", "fungus", "fungal", "spot", "rot"], answer: "Leaf spots, rot, or a whitish fuzz almost always come from too much moisture combined with poor airflow. Remove and destroy affected parts as soon as you spot them, to stop the disease spreading to neighboring plants — don't compost them. Space your plants out a bit more next planting so air circulates better and foliage dries faster after rain. Water at the base of the plant rather than over the leaves, and in the morning if possible, so foliage dries during the day. If the disease keeps spreading despite these steps, a suitable biological treatment or advice from an agricultural extension officer in your area will be more effective.", summary: "Spots / rot: remove affected parts, space plants out, water at the base rather than the leaves." },
    { keywords: ["rain", "flood", "waterlogged", "too much water"], answer: "With heavy rain or standing water, the most urgent thing is to drain the excess: dig small channels around the plants so water flows away instead of pooling. Roots left submerged for more than 24 to 48 hours run short of oxygen and start to rot, which can kill the plant even after the water recedes. If your plants are in pots or containers, raise them temporarily. Once the water goes down, check the roots and remove any soft or blackened parts. For future planting on flood-prone ground, consider raised beds that drain better.", summary: "Standing water / flooding: dig small channels around the plants to drain the excess water." },
    { keywords: ["when to harvest", "ready to harvest"], answer: "The right harvest time depends a lot on the crop, but a few general signs help: color becoming deeper or changing clearly, firmness settling, and sometimes a slight smell or the produce detaching easily from the stem. Harvesting too early often gives a less flavorful product that keeps less well; harvesting too late can make it overripe or more fragile to transport. Your best guide is regularly watching your plants over the days, combined with advice from other farmers in your area growing the same crop — local conditions strongly affect the right timing. An agricultural extension officer in your area can also give you precise benchmarks for your crop.", summary: "Harvest timing: watch the color and firmness of the product, and ask locally for benchmarks." },
    { keywords: ["wind", "typhoon", "storm"], answer: "Before an announced storm, the priority is protecting the most vulnerable plants: firmly stake young plants and tall crops, and if possible harvest produce that's already close to ripe early so you don't lose it. After the wind passes, inspect the plot: gently straighten leaning plants while the soil around the roots is still loose, and quickly remove broken branches and leaves, which are entry points for disease. Also check drainage, since storms often bring heavy rain too. Give the plants a little time to recover before resuming treatments or fertilizing.", summary: "Wind / storm: stake plants before it hits, straighten and remove broken branches afterward." },
    { keywords: ["rat", "bird", "wild boar", "animal", "cow"], answer: "Against animals damaging crops — rats, birds, wild boar, or even livestock — the first line of defense is a simple but well-maintained fence around the plot, with no gaps or obvious openings. A scarecrow, ribbons that move in the wind, or small noises can scare off birds, but their effect fades over time if you don't move them around regularly. Harvest ripe produce as soon as possible: it's often the already-ripe produce, on the ground or on the plant, that attracts animals the most. For rodents, keeping the plot clean, without piles of debris or crop residue, reduces available hiding spots. For a serious, recurring problem, an agricultural extension officer in your area can advise solutions suited to the specific animal involved.", summary: "Pest animals: a well-maintained fence or scarecrow, and harvest as soon as it's ripe." },
    { keywords: ["store", "storage", "keep after harvest"], answer: "After harvest, how well produce keeps mostly depends on three things: dryness, airflow, and protection from direct light. Store in a dry, well-ventilated place — moisture is the leading cause of mold and rot in storage. Where possible, raise sacks or crates off the ground, on pallets or boards, to limit contact with moisture and rodents. Check the stock regularly, especially in the first two weeks: at the first sign of mold, remove the affected produce immediately so it doesn't spread to the rest. Finally, avoid packing too densely — some airflow between sacks or crates meaningfully extends how long produce keeps.", summary: "Storage after harvest: keep it dry, well-ventilated, and away from direct light." },
    { keywords: ["variety", "seed", "which seed"], answer: "The choice of variety has a huge impact on how well a crop does, often more than the care given afterward. Start by favoring a variety known to grow well in your region's climate and soil type — a variety that does well elsewhere won't necessarily give the same result for you. Ask a local agricultural cooperative, a trusted seed supplier, or simply other farmers in your area already growing the same crop: their direct experience is often worth more than any general technical sheet. Also consider varying which variety you plant from season to season if possible, which reduces the risk if a disease or pest particularly affects one given variety.", summary: "Choosing a variety: favor one suited to your region's climate and soil." }
  ]
};

const AR_I18N = {
  fr: {
    speechLang: "fr-FR",
    langTag: "Audio — français",
    menu: () => "Tapez ou dites 1 pour connaître un prix, 2 pour vendre une récolte, 3 pour poser une question, 4 pour réentendre ce menu.",
    askPriceProduct: (list) => `Quel produit vous intéresse ? Dites son nom, ou tapez son numéro : ${list}. Pour un autre produit, dites simplement son nom.`,
    priceAnswer: (culture, prix) => `Le prix du jour pour le ${culture.toLowerCase()} est de ${prix} à Kampot.`,
    askSellProduct: (list) => `Très bien. Quelle culture souhaitez-vous vendre ? Dites son nom, ou tapez son numéro : ${list}.`,
    askQty: (culture) => `Combien de kilos de ${culture.toLowerCase()} avez-vous à vendre ? Tapez le nombre puis dièse.`,
    askPrice: "Et à quel prix souhaité, en KHR par kilo ? Tapez le nombre puis dièse.",
    offerConfirm: (culture, qty, prix) => `Votre offre est publiée : ${culture}, ${qty} kg, ${prix} KHR/kg. Les acheteurs correspondants seront notifiés.`,
    askQuestion: () => "Quelle est votre question ? Décrivez votre problème ou votre besoin en quelques mots.",
    questionFallback: "Je n'ai pas de réponse précise pour cette question dans cette démo. Dans la vraie plateforme, un conseiller agricole ou un assistant formé sur l'agriculture locale pourrait vous répondre.",
    questionKmNotice: "សូមទោស មុខងារនេះមិនទាន់មានជាភាសាខ្មែរនៅឡើយទេ។ សូមសាកល្បងជាភាសាបារាំង ឬអង់គ្លេស។",
    fallback: "Je n'ai pas compris. Tapez 1 pour un prix, 2 pour vendre une récolte, 3 pour poser une question.",
    smsPrice: (culture, prix) => `AlloRécolte — Récap de votre appel : ${culture} à ${prix}.`,
    smsOffer: (culture, qty, prix) => `AlloRécolte — Votre offre a été publiée : ${culture}, ${qty} kg à ${prix} KHR/kg.`,
    smsQuestion: (summary) => `AlloRécolte — Récap de votre appel : ${summary}`,
    smsNotice: 'Un SMS récapitulatif vient d\'être envoyé — <a href="sms.html">voir le SMS</a>.',
    hint: 'Exemples : « prix du riz », « je veux vendre ma récolte », ou une question sur votre culture — ou utilisez le clavier à droite.',
    invalidNumber: "Numéro non reconnu. Réessayez, ou dites le nom du produit."
  },
  en: {
    speechLang: "en-US",
    langTag: "Audio — English",
    menu: () => "Type or say 1 for a price, 2 to sell a harvest, 3 to ask a question, 4 to hear this menu again.",
    askPriceProduct: (list) => `Which product? Say its name, or type its number: ${list}. For another product, just say its name.`,
    priceAnswer: (culture, prix) => `Today's price for ${culture.toLowerCase()} is ${prix} in Kampot.`,
    askSellProduct: (list) => `Great. Which crop would you like to sell? Say its name, or type its number: ${list}.`,
    askQty: (culture) => `How many kilos of ${culture.toLowerCase()} do you have to sell? Type the number then press hash.`,
    askPrice: "And at what price, in KHR per kilo? Type the number then press hash.",
    offerConfirm: (culture, qty, prix) => `Your offer is published: ${culture}, ${qty} kg, ${prix} KHR/kg. Matching buyers will be notified.`,
    askQuestion: () => "What's your question? Describe your problem or need in a few words.",
    questionFallback: "I don't have a precise answer for this in the demo. In the real platform, an agricultural advisor or an assistant trained on local farming could answer you.",
    questionKmNotice: "សូមទោស មុខងារនេះមិនទាន់មានជាភាសាខ្មែរនៅឡើយទេ។ សូមសាកល្បងជាភាសាបារាំង ឬអង់គ្លេស។",
    fallback: "I didn't understand. Type 1 for a price, 2 to sell a harvest, 3 to ask a question.",
    smsPrice: (culture, prix) => `AlloRécolte — Call summary: ${culture} at ${prix}.`,
    smsOffer: (culture, qty, prix) => `AlloRécolte — Your offer has been published: ${culture}, ${qty} kg at ${prix} KHR/kg.`,
    smsQuestion: (summary) => `AlloRécolte — Call summary: ${summary}`,
    smsNotice: 'A summary SMS was just sent — <a href="sms.html">view the SMS</a>.',
    hint: 'Examples: "rice price", "I want to sell my harvest", or a question about your crop — or use the keypad on the right.',
    invalidNumber: "Number not recognized. Try again, or say the product's name."
  },
  km: {
    speechLang: "km-KH",
    langTag: "សំឡេង — ខ្មែរ",
    menu: () => "ចុច ១ ដើម្បីដឹងថ្លៃ, ចុច ២ ដើម្បីលក់ដំណាំ, ចុច ៣ ដើម្បីសួរសំណួរ, ឬចុច ៤ ដើម្បីស្តាប់ម៉ឺនុយនេះម្តងទៀត។",
    askPriceProduct: (list) => `តើអ្នកចង់ដឹងថ្លៃដំណាំមួយណា? សូមនិយាយឈ្មោះ ឬចុចលេខ៖ ${list}។`,
    priceAnswer: (culture, prix) => `ថ្លៃថ្ងៃនេះសម្រាប់ ${culture} គឺ ${prix} នៅខេត្តកំពត។`,
    askSellProduct: (list) => `តើអ្នកចង់លក់ដំណាំមួយណា? សូមនិយាយឈ្មោះ ឬចុចលេខ៖ ${list}។`,
    askQty: (culture) => `តើអ្នកមាន ${culture} ប៉ុន្មានគីឡូក្រាមសម្រាប់លក់? ចុចលេខរួចចុច #។`,
    askPrice: "ហើយតម្លៃប៉ុន្មានក្នុងមួយគីឡូក្រាម គិតជារៀល? ចុចលេខរួចចុច #។",
    offerConfirm: (culture, qty, prix) => `ការផ្តល់ជូនរបស់អ្នកត្រូវបានផ្សព្វផ្សាយ៖ ${culture}, ${qty} គីឡូ, ${prix} រៀល/គីឡូ។`,
    askQuestion: () => "",
    questionFallback: "",
    questionKmNotice: "សូមទោស មុខងារនេះមិនទាន់មានជាភាសាខ្មែរនៅឡើយទេ។ សូមសាកល្បងជាភាសាបារាំង ឬអង់គ្លេស។",
    fallback: "សូមទោស ខ្ញុំមិនយល់ទេ។ ចុច ១ សម្រាប់ថ្លៃ ឬចុច ២ ដើម្បីលក់។",
    smsPrice: (culture, prix) => `AlloRécolte — សង្ខេបការហៅ៖ ${culture} ថ្លៃ ${prix}។`,
    smsOffer: (culture, qty, prix) => `AlloRécolte — ការផ្តល់ជូនត្រូវបានផ្សព្វផ្សាយ៖ ${culture}, ${qty} គីឡូ ក្នុងតម្លៃ ${prix}។`,
    smsNotice: 'សារសង្ខេបត្រូវបានផ្ញើ — <a href="sms.html">មើលសារ</a>។',
    hint: "ឧទាហរណ៍៖ ប្រើក្តារចុចលេខខាងស្តាំដើម្បីជ្រើសរើស។",
    invalidNumber: "លេខមិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។"
  }
};
