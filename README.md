# AlloRécolte — Prototype de démonstration

Ce dossier contient le code complet du prototype fonctionnel d'AlloRécolte, prêt à être ouvert, testé, modifié et amélioré par l'équipe. Aucune compétence en programmation n'est requise pour l'ouvrir ; des bases en HTML/CSS/JavaScript suffisent pour le modifier.

## 1. Comment le lancer

Aucune installation n'est nécessaire (pas de Node.js, pas de base de données, pas de compte à créer).

**Option la plus simple :** double-cliquer sur `index.html` pour l'ouvrir directement dans un navigateur (Chrome, Firefox, Edge...). Le prototype démarre par défaut en vue **Fermier** : comme `index.html` est désormais la page du profil **Acheteur** (le catalogue, voir section 2), l'ouverture vous redirige automatiquement vers « Mes offres », la page d'accueil du rôle actif — ce n'est pas une erreur, c'est le garde-fou qui garde le menu et la page toujours cohérents entre eux (voir `arEnsureRoleHome` dans `js/site-i18n.js`). Pour voir directement le catalogue, basculez sur « Acheteur » avec le bouton en bas de la barre latérale.

**Option recommandée (pour que tout fonctionne à 100 %, y compris le micro et la reconnaissance vocale) :** lancer un petit serveur local depuis ce dossier, puis ouvrir l'adresse indiquée — certains navigateurs bloquent le micro sur un fichier ouvert directement (`file://`).

- Avec Python (déjà installé sur la plupart des ordinateurs) :
  ```
  python3 -m http.server 8000
  ```
  puis ouvrir `http://localhost:8000/index.html`

- Avec VS Code : l'extension gratuite « Live Server » fait la même chose en un clic droit sur `index.html`.

## 2. Ce qui est réellement fonctionnel (pas juste des images)

Ceci est un **vrai site qui fonctionne**, pas une maquette statique :

- **Deux vues, fermier et acheteur** — le prototype n'a pas encore de compte ni de connexion (voir section 3) : un bouton « Fermier / Acheteur » en bas de la barre latérale simule ce que verrait chaque profil une fois l'inscription en place, avec un menu et des pages d'accueil différents pour chacun. En vue **Fermier**, le menu affiche Mes offres, Simulateur d'appel, SMS et Paramètres. En vue **Acheteur**, il affiche Catalogue, Suivi des commandes et Paramètres. Ouvrir une page qui n'existe pas pour le rôle actif (via un favori, l'historique du navigateur, ou simplement le rôle par défaut) redirige automatiquement vers la page d'accueil de ce rôle, pour que le menu affiché corresponde toujours à la page affichée — voir `js/site-i18n.js` (`arEnsureRoleHome`).
- **Catalogue** (`index.html`) — page d'accueil du profil **Acheteur** : catalogue visuel de **50 cultures**, avec une **barre de recherche** pour filtrer en direct. Cliquer sur un produit mène à la liste des fermiers qui le proposent (voir ci-dessous). Le prix n'est volontairement pas affiché sur les cartes : il apparaît seulement après avoir cliqué, pour éviter de dupliquer l'information avant que ce soit utile.
- **Liste des fermiers par produit** (`offres.html`) — en cliquant sur un produit du catalogue, l'acheteur voit tous les fermiers qui le proposent : prix, quantité **et localité**, avec un **bouton « Contacter »** qui ouvre un appel téléphonique (`tel:`) vers le fermier — y compris pour les offres publiées par l'utilisateur de démo, qui reprennent le numéro renseigné dans Paramètres. Les fermiers ne sont **pas triés par prix** — c'est volontaire, pour que l'acheteur compare selon ses propres critères (proximité, quantité...) plutôt que de systématiquement privilégier le moins cher. Cette page ne montre **pas** le statut de la relation (Contacté, Transaction convenue...) : à ce stade, l'acheteur n'a encore contacté personne, ce statut n'a donc pas encore de sens — voir « Suivi des commandes » ci-dessous. Dès qu'on clique pour contacter un fermier, l'offre correspondante passe automatiquement à « Contacté » (`arMarkContacted`, voir `js/db.js`) et rejoint le suivi. Le jeu de données de démonstration couvre les 50 produits (au moins une offre chacun, cinq pour le riz), pour qu'aucune recherche ne tombe sur un résultat vide.
- **Suivi des commandes** (`acheteur.html`) — page d'accueil secondaire du profil Acheteur : statistiques (offres suivies, transactions convenues, échanges en cours) et liste des fermiers déjà contactés, **avec** leur statut cette fois (Contacté / Transaction convenue — « Nouveau match » n'a plus sa place sur cette page, voir plus bas) et une légende qui l'explique — c'est la seule page où ce statut est affiché, une fois qu'il a un sens concret. Le statut est **modifiable directement** : la pastille colorée sur chaque carte est elle-même un menu déroulant (un seul élément affiche et change le statut, pas une pastille en lecture seule à côté d'un menu séparé), pour que l'acheteur puisse marquer une transaction convenue, ou revenir en arrière si besoin (`arSetStatut`, voir `js/db.js`). La liste est plafonnée à **20 échanges** (les plus récents), et les données de démo elles-mêmes ne comptent que 20 offres « Contacté »/« Transaction convenue » au départ. Un bouton permet de revenir au catalogue pour trouver d'autres fermiers.
- **Mes offres** (`mes-offres.html`) — page d'accueil du profil **Fermier** : liste des récoltes déjà publiées par l'utilisateur de démo, avec un bouton « + Publier une récolte » qui ouvre directement ici le formulaire de publication (**avec upload réel d'une photo**, choisie depuis l'appareil avec aperçu immédiat, et un rappel du prix de référence du jour à côté du choix de la culture). La liste se met à jour immédiatement après publication, sans recharger la page.
- **Simulateur d'appel vocal** (`appel.html`) — au décroché, un **menu de langue** (français / anglais / khmer) exactement comme un vrai serveur vocal, avec un **clavier de téléphone cliquable** à côté de la conversation ; ensuite une vraie conversation, au clavier, au texte libre, ou à la voix (si le navigateur le permet). En plus de connaître un prix ou vendre une récolte, le fermier peut aussi **poser une question générale** et recevoir un conseil assez détaillé (cause probable + plusieurs pistes concrètes, pas juste une phrase). Un petit résumé de la réponse est aussi envoyé par SMS, comme pour un prix consulté ou une offre publiée : si le fermier raccroche juste après avoir posé sa question, il la retrouve dans ses SMS (voir « SMS » ci-dessous). Volontairement, ni le menu ni les textes d'aide ne listent les questions précises reconnues (voir section 3) — pour l'équipe, la liste complète est dans `js/appel-i18n.js` (`AR_FAQ`, 11 sujets). C'est aussi ici (ou par SMS) que le fermier vérifie un prix avant de publier une offre — il n'y a plus de catalogue de prix séparé côté fermier. La reconnaissance en texte libre couvre les 50 produits en français/anglais (voir `AR_KEYWORDS`) ; le clavier rapide (touches 1 à 9) reste volontairement limité aux 9 produits les plus courants.
- **SMS** (`sms.html`) — un fil de discussion dans lequel on peut **taper et « envoyer » son propre SMS** (ex. « prix manioc », « vendre riz 150kg 1400 », ou une question de conseil agricole), avec une réponse automatique, en plus des SMS générés automatiquement par le simulateur d'appel (prix consulté, offre publiée, et maintenant aussi résumé d'une question posée à l'appel).
- **Interface en français ou en anglais** — un sélecteur de langue bascule tout le site (menus, titres, boutons, noms de produits) entre français et anglais, mémorisé pour chaque visiteur : dans le bas de la barre latérale, et de façon plus visible sur la nouvelle page **Paramètres** (`parametres.html`), qui présente les langues sous forme de **lignes pleine largeur** — la langue active est mise en évidence en vert avec une coche, les langues pas encore disponibles (khmer, thaï, vietnamien, chinois, espagnol) sont clairement grisées et étiquetées « bientôt disponible », pour montrer le potentiel multilingue du produit sans laisser croire qu'elles fonctionnent déjà. C'est différent du sélecteur de langue du simulateur d'appel (qui gère la conversation elle-même, y compris en khmer) : voir `js/site-i18n.js` vs `js/appel-i18n.js`.
- **Paramètres** (`parametres.html`) — langue de l'interface (voir ci-dessus), informations utilisateur (nom, téléphone, province, canal de contact préféré) et préférences de notification, enregistrées dans le navigateur ; et un bouton pour réinitialiser les données de démonstration avant une nouvelle présentation. Le numéro de téléphone renseigné ici est repris automatiquement sur les offres publiées ensuite par l'utilisateur de démo (site, appel ou SMS), pour que le bouton « Contacter » fonctionne aussi sur ses propres offres.
- **Menu hamburger sur petit écran** — en dessous de 860px de large, la barre latérale devient un tiroir (menu ☰ en haut à gauche) plutôt qu'une barre qui défile horizontalement, pour rester lisible sur téléphone.

**Le point le plus important à comprendre :** toutes ces pages partagent **la même base de données** (voir section 4). Si vous publiez une offre par le simulateur d'appel ou par SMS, elle apparaît immédiatement dans le catalogue côté acheteur — c'est la démonstration concrète du concept central du projet : « deux canaux d'accès, une seule base de données ».

## 3. Ce qui est simulé, et pourquoi (à dire honnêtement au jury)

| Dans le prototype | Dans la vraie plateforme |
|---|---|
| L'appel se simule dans une page web, au clavier, au texte ou via le micro de l'ordinateur | Un vrai numéro de téléphone, accessible depuis n'importe quel téléphone, y compris basique |
| La voix est produite par la synthèse vocale du navigateur (Web Speech API), en français/anglais/khmer selon ce que le navigateur supporte | Une voix professionnelle dans chaque langue, via une vraie API de synthèse vocale |
| Les textes en **khmer** sont une traduction automatique fournie à titre de démo (bandeau d'avertissement affiché dans l'app quand le khmer est choisi) | Des textes khmers relus et validés par un locuteur natif |
| En khmer, la démo se pilote **au clavier** (le texte libre n'est reconnu qu'en français/anglais) | Une reconnaissance vocale et textuelle khmère complète |
| La « compréhension » du texte libre repose sur une recherche de mots-clés simple (si le texte contient « riz », « prix »...) | Un vrai modèle de langage (IA conversationnelle) capable de comprendre des questions libres, dans les trois langues |
| Les réponses à l'option « poser une question » (appel et SMS) viennent d'une liste de 11 sujets reconnus par mots-clés (`AR_FAQ` dans `js/appel-i18n.js`), avec des réponses assez détaillées mais préparées à l'avance | Un vrai conseiller agricole ou un assistant IA formé sur l'agriculture locale, capable de répondre à n'importe quelle question, pas seulement celles prévues |
| L'interface du site est traduisible en français/anglais ; le khmer n'est disponible que pour la conversation du simulateur d'appel, pas encore pour le reste du site | Une interface complète en français, anglais et khmer |
| Les photos produits du catalogue affichent un **emplacement neutre en pointillés** tant qu'aucune photo n'a été ajoutée ; le produit « riz » a une photo de démonstration (`images/riz.jpg`, une illustration, pas une vraie photo) pour servir d'exemple concret (voir ci-dessous pour en ajouter à d'autres produits) | De vraies photos, fournies par l'équipe ou prises par les fermiers |
| La photo d'une offre publiée via `mes-offres.html` est, elle, une **vraie photo** choisie par l'utilisateur (upload fonctionnel) | Identique — déjà le comportement réel |
| Le SMS est simulé dans le navigateur, avec un délai artificiel de réponse | Un vrai SMS envoyé et reçu via un partenaire télécom (ex. Metfone) |
| Les données (prix, offres, SMS) sont stockées dans le navigateur (`localStorage`) et remises à zéro si on vide le cache | Une vraie base de données hébergée sur un serveur, partagée entre tous les utilisateurs |
| Il n'y a pas de compte ni de connexion : un simple bouton « Fermier / Acheteur » dans la barre latérale change la vue affichée, pour prévisualiser les deux expériences (voir section 2) | Une vraie inscription (fermier ou acheteur), avec connexion et menu propre à chaque rôle |

C'est exactement l'esprit annoncé dans le dossier de projet (section « Plan de prototype ») : un prototype de démonstration honnête, pas le système de production final.

### Ajouter de vraies photos produits

Chaque produit de `AR_PRODUCTS` (`js/db.js`) a un champ `photo`, vide (`null`) par défaut. Tant qu'il est vide, le catalogue, les pastilles et la comparaison d'offres affichent un emplacement neutre en pointillés (`js/icons.js`, fonction `arProductIcon`) plutôt qu'une vraie photo — volontairement, pour que l'équipe puisse ajouter ses propres photos sans avoir à toucher au code.

Le produit « riz » sert déjà d'exemple concret : son champ `photo` pointe vers `images/riz.jpg` (une illustration générée pour la démo, pas une vraie photo). Pour ajouter une vraie photo à un autre produit, faites la même chose :

1. Ajouter le fichier image dans le dossier `images/` (ex. `images/manioc.jpg`).
2. Dans `js/db.js`, renseigner le champ `photo` du produit correspondant dans `AR_PRODUCTS`, ex. `photo: "images/manioc.jpg"`.
3. C'est tout — `arProductMedia()` (`js/icons.js`) affiche automatiquement cette photo partout où le produit apparaît (catalogue, liste des fermiers par produit, suivi des commandes) dès qu'elle est renseignée, sans autre modification de code.

Les photos **uploadées par les fermiers** via `mes-offres.html` fonctionnent déjà en vrai (voir section 2) et utilisent le même mécanisme (`arProductMedia`) : elles s'affichent automatiquement à la place de l'emplacement neutre pour cette offre-là.

## 4. Comment c'est construit (pour modifier/étendre)

### Technologies utilisées

- **HTML / CSS / JavaScript « vanilla »** — aucun framework (pas de React, Vue, etc.), aucune étape de compilation. Tout fichier peut être ouvert et modifié directement dans un éditeur de texte (VS Code recommandé, gratuit).
- **Web Speech API** (native au navigateur) pour la synthèse vocale (`speechSynthesis`) et, quand le navigateur le permet, la reconnaissance vocale (`SpeechRecognition`), dans les trois langues. Aucune clé d'API, aucun compte, aucun coût.
- **`getUserMedia` demandé une seule fois par appel** (au décroché, avant même le choix de la langue) : l'utilisateur autorise le micro une fois, puis peut parler librement jusqu'à raccrocher, sans être réinterrompu par des demandes d'autorisation répétées.
- **`FileReader` / upload de fichier** pour la photo dans `mes-offres.html` : la photo choisie est lue directement dans le navigateur (aucun envoi à un serveur) et stockée comme image encodée (« data URL ») dans l'offre.
- **`localStorage`** du navigateur comme « base de données » du prototype (voir `js/db.js`). C'est un choix délibéré pour que le prototype fonctionne sans serveur ni installation — voir la section 5 pour la faire évoluer vers une vraie base de données.
- **Emplacement photo neutre en SVG** (`js/icons.js`, `arProductMedia`) tant qu'aucune vraie photo n'est renseignée sur un produit (voir ci-dessus).

### Structure des fichiers

```
prototype/
├── index.html          Accueil du profil Acheteur : catalogue (50 produits, cliquables, avec recherche)
├── offres.html            Fermiers proposant un produit donné, à contacter (?culture=riz)
├── acheteur.html          Suivi des commandes : fermiers déjà contactés, stats + statuts + légende
├── mes-offres.html       Accueil du profil Fermier : récoltes déjà publiées + formulaire de publication intégré (upload de photo)
├── appel.html             Simulateur d'appel vocal (choix de langue + clavier + IVR + FAQ)
├── sms.html               Simulateur SMS (fil de discussion + saisie libre)
├── parametres.html        Paramètres (langue de l'interface, infos utilisateur, reset démo)
├── css/
│   └── style.css          Feuille de style unique, partagée par toutes les pages
│                            (palette, mise en page "app" avec menu latéral / tiroir mobile, composants)
└── js/
    ├── db.js               La "base de données" partagée (localStorage) + données de départ (50 produits, 80 offres avec téléphone) + préférences utilisateur (paramLoadUser/paramSaveUser) + arMarkContacted
    ├── icons.js             Emplacement photo neutre + affichage des vraies photos (arProductMedia)
    ├── site-i18n.js          Traduction FR/EN de l'interface du site + sélecteur de langue + sélecteur de rôle (fermier/acheteur, avec arEnsureRoleHome) + menu hamburger
    ├── app.js                Logique de index.html (catalogue + recherche)
    ├── offres.js              Logique de offres.html (liste des fermiers par produit + suivi automatique au clic sur Contacter)
    ├── acheteur.js            Logique de acheteur.html (Suivi des commandes)
    ├── mes-offres.js          Logique de mes-offres.html (liste des offres + formulaire de publication intégré, dont l'upload de photo)
    ├── appel-i18n.js         Textes/dictionnaires FR/EN/KM + FAQ du simulateur d'appel
    ├── appel.js               Logique de appel.html (langue, clavier, micro, conversation, FAQ)
    ├── sms.js                 Logique de sms.html (fil + réponse automatique)
    └── parametres.js          Logique de parametres.html
```

Chaque page HTML est indépendante et charge son propre fichier JavaScript, plus `db.js` (et `icons.js`/`site-i18n.js` quand ils sont utilisés) qui sont partagés par plusieurs pages.

### Où toucher pour...

- **Changer les couleurs / la police** → tout est centralisé en haut de `css/style.css`, dans le bloc `:root { ... }` (`--accent`, `--gold`, etc.).
- **Changer les prix de départ, les offres de démonstration, ou ajouter une culture** → `js/db.js`, tableau `AR_PRODUCTS` (50 produits actuellement ; le `<select>` de `mes-offres.html`, le catalogue de `index.html` et la liste de fermiers de `offres.html` se remplissent automatiquement depuis ce tableau). Chaque produit y a un champ `nameEn` pour sa traduction anglaise, et un champ `photo` pour y ajouter une vraie image (voir section 3).
  - Pour qu'une nouvelle culture soit reconnue aussi dans le simulateur d'appel et par SMS (texte libre, en français/anglais), ajouter son nom dans `AR_NAMES` et ses mots-clés dans `AR_KEYWORDS` (`js/appel-i18n.js`), et éventuellement dans `AR_QUICK_KEYS` si elle doit être accessible par une simple touche (1 à 9 — volontairement limité à 9 produits pour rester rapide au téléphone).
  - Pour ajouter des offres de démonstration sur ce nouveau produit (pour que `offres.html` ne montre pas une liste vide), ajouter des entrées dans `AR_SEED.offers` (`js/db.js`).
- **Modifier les textes, ajouter une langue, ou enrichir les réponses à « poser une question »** → tout est centralisé dans `js/appel-i18n.js` (dictionnaire `AR_I18N`, un bloc par langue ; liste `AR_FAQ` pour les réponses de conseil agricole par mots-clés).
- **Traduire l'interface du site dans une nouvelle langue, ou corriger un texte traduit** → `js/site-i18n.js`, objet `SITE_I18N` (un bloc par langue, une clé par texte). Ajouter un bloc `km: {...}` active le khmer pour le site ; pour le proposer dans la page Paramètres, le déplacer de `AR_MORE_LANGS` (« bientôt disponible ») vers la liste des langues actives dans `renderLangGrid()` (`js/parametres.js`).
- **Améliorer la compréhension de l'assistant vocal/SMS** → `js/appel.js` (fonctions `resolveProductFromText`, `isSellIntent`, `resolveFaqAnswer`) et `js/sms.js` (fonctions `smsResolveProduct`, `smsIsSellIntent`) — c'est ici qu'il faudra brancher un vrai modèle de langage plus tard.
- **Changer les informations utilisateur, les préférences de notification ou réinitialiser les données de démo** → `parametres.html` / `js/parametres.js` (les fonctions `paramLoadUser`/`paramSaveUser` vivent dans `js/db.js` pour être accessibles depuis les pages de publication d'offre).
- **Modifier le texte de la légende des statuts, ajouter un nouveau statut, ou changer la couleur d'une pastille** → `js/db.js` (`AR_STATUT_HELP_FR`/`AR_STATUT_HELP_EN`, `arStatutPillClass`, `AR_STATUTS`) et `css/style.css` (`.pill`, `.pill.neutral`, `.pill.green`).
- **Changer le numéro de téléphone associé aux offres de démonstration** → champ `tel` de chaque offre dans `AR_SEED.offers` (`js/db.js`).
- **Changer la mise en page générale (menu latéral, menu hamburger mobile, largeur du contenu, cartes)** → `css/style.css`, blocs `.app`, `.sidebar`, `.hamburger-btn`/`.nav-overlay` (tiroir mobile), `.main-inner`, `.product-card`, `.offer-compare-card`.

## 5. Pour aller plus loin (après le prototype de démonstration)

Quand l'équipe voudra dépasser le stade du prototype, voici les remplacements naturels, dans l'ordre de priorité suggéré :

1. **Remplacer `localStorage` par une vraie base de données** partagée sur un serveur (ex. Firebase, Supabase, ou un backend Node.js/PostgreSQL classique), pour que les données soient partagées entre tous les utilisateurs réels et pas seulement dans un navigateur.
2. **Remplacer les illustrations SVG par de vraies photos produits** (voir section 3, « Illustrations vs. vraies photos »), et stocker les photos uploadées par les fermiers sur un vrai service de stockage de fichiers plutôt qu'en `localStorage`.
3. **Remplacer la synthèse/reconnaissance vocale du navigateur** par de vraies API de synthèse et reconnaissance vocale, avec un khmer relu et validé par un locuteur natif (ex. Google Cloud Speech-to-Text/Text-to-Speech, qui supportent le khmer).
4. **Remplacer la recherche de mots-clés** par un vrai modèle de langage (API d'un fournisseur d'IA conversationnelle), pour comprendre des questions vraiment libres, y compris en khmer parlé ou tapé.
5. **Brancher un vrai numéro de téléphone** via un partenaire télécom (Metfone ou équivalent) ou un service de téléphonie cloud (ex. Twilio), pour que le canal vocal soit accessible depuis un vrai téléphone.
6. **Envoyer de vrais SMS** via ce même partenaire télécom.

Aucune de ces étapes n'oblige à tout reconstruire : la structure du prototype (une page par fonction, une couche de données séparée dans `db.js`, les textes multilingues séparés dans `appel-i18n.js`) est justement pensée pour que chaque brique puisse être remplacée une par une.

## 6. Tests automatisés

Ce prototype a été testé de bout en bout avec Playwright, notamment : catalogue de 50 produits cliquables avec barre de recherche (2 colonnes sur mobile, photo en plein cadre façon fiche produit) ; séparation des rôles Fermier/Acheteur avec redirection automatique vers la bonne page d'accueil dès qu'on ouvre une page qui n'existe pas pour le rôle actif, y compris au premier chargement ; formulaire de publication intégré à « Mes offres », avec mise à jour immédiate de la liste après publication et rappel du prix de référence à côté du choix de la culture ; liste des fermiers par produit sans statut affiché, avec passage automatique en « Contacté » au clic sur « Contacter » ; page « Suivi des commandes » reflétant bien ce changement de statut (statuts plafonnés à 20, menu déroulant de changement de statut sur chaque carte) ; upload de photo ; photo de démonstration sur le produit « riz » ; appel dans les trois langues avec la voix multilingue et reconnaissance étendue aux 50 produits, clavier, option « poser une question » (11 sujets, avec résumé envoyé par SMS) ; SMS, y compris la réponse aux mêmes questions de conseil agricole ; page Paramètres (langue en lignes pleine largeur, informations utilisateur, réinitialisation des données de démo) ; menu hamburger sur petit écran ; sélecteur de langue FR/EN. Les scripts de test ne sont pas inclus dans ce zip (ils font partie de l'environnement de développement, pas du livrable), mais l'équipe peut en écrire de nouveaux librement : chaque page se comporte comme une page web classique, sans dépendance cachée.
