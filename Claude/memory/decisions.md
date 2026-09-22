# Registre — Décisions

> Consigne les choix de conception ou d'implémentation tranchés au fil du projet, quand ils ne relèvent pas d'une décision d'architecture formelle (voir [adr.md](./adr.md) pour celles-là). Une ligne par décision : quoi, pourquoi, quand.

---

<!-- Format suggéré :
## [AAAA-MM-JJ] Titre court de la décision
**Décision** : ...
**Raison** : ...
**Domaine concerné** : (voir docs/architecture.md)
-->

## [2026-09-15] Sélection provisoire des archétypes actifs en Phase 0

**Décision** : parmi les 9 archétypes fondateurs documentés (product-spec §4), les 5 premiers dans l'ordre du document sont marqués `phase0: true` dans `src/signals-content/founders.ts` : Wunderkind du pedigree, Bricoleur obsessionnel, Surfeur de hype, Vétérante du secteur, Duo fondateur fracturé. Parmi les 6 archétypes de LP (§5), les 2 premiers sont actifs : Business angel réseauté, Family Office patient.
**Raison** : le PRD (§5) fixe une fourchette ("4-5 fondateurs", "2-3 LPs") sans trancher lesquels précisément. Un choix arbitraire était nécessaire pour poser les données ; celui-ci prend les premiers de chaque liste plutôt que d'inventer un critère de sélection non demandé.
**Domaine concerné** : Signals & Content. À révisiter si un critère de sélection réel (diversité des signaux couverts, facilité d'écriture des dialogues...) doit primer sur l'ordre du document — voir `src/signals-content/founders.ts` et `lps.ts`.

## [2026-09-15] Valeurs de thèse (secteur / stade / zone)

**Décision** : pour l'écran de déclaration de thèse (product-spec §3.1.1), les valeurs sélectionnables sont : Secteurs — SaaS B2B, Fintech, Deeptech, Consumer, Marketplace. Stades — Pre-seed, Seed, Series A. Zones — France, Europe, US.
**Raison** : le product-spec ne liste aucune valeur concrète pour ces trois chips. Proposées par cohérence avec les exemples de startups déjà présents dans les maquettes envoyées (SaaS prévision de stock, logistique, assistant R&D pharma).
**Domaine concerné** : Signals & Content (données) / Game Loop (la thèse engage le run, §3.1.1). Ajustable librement, ce n'est pas structurant.

## [2026-09-15] Thèse : jusqu'à 3 secteurs, 1 stade, 1 zone

**Décision** : la thèse autorise jusqu'à `MAX_SECTORS = 3` secteurs sélectionnés simultanément (au 4e clic, le plus ancien est désélectionné automatiquement), contre 1 seul stade et 1 seule zone. `Thesis.sector` devient `Thesis.sectors: Sector[]`.
**Raison** : le product-spec (§3.1.1) ne précise pas si secteur/stade/zone sont mono ou multi-sélection. Un seul secteur rendrait le deal flow généré trop pauvre en diversité (5 secteurs disponibles en Phase 0) ; autoriser 3 sur 5 garde un vrai engagement de thèse (dévier coûte de la confiance LP, §3.1.1) tout en laissant assez de marge pour varier les opportunités.
**Domaine concerné** : Game Loop (`src/game-loop/thesis.ts`) / UI (`src/ui/ThesisDeclaration.tsx`).

## [2026-09-15] Montants et contraintes du pool de LPs Fonds I (superseded)

**Statut** : remplacé le même jour par l'entrée suivante ("Pool de LPs Fonds I calé sur maquette"), une fois la maquette `vc-techwear-lp_2.html` reçue.
**Décision initiale** : Business angel réseauté 200k-500k€ (bonus deal flow), Family Office patient 800k-1,5M€ (accès co-invest exigé) — deux offres seulement, montants inventés faute de maquette.

## [2026-09-15] Pool de LPs Fonds I calé sur maquette (vc-techwear-lp_2.html)

**Décision** : le pool Fonds I (`src/game-loop/lp-pool.data.ts`) reprend exactement les 6 LPs de la maquette envoyée : Yann Fontaine (business angel, 100k-250k€, disponible), Northbridge Partners (fonds de fonds, 500k-1,2M€, disponible), Family Office R. (300k-800k€, déjà engagé à 800k€), Fonds pension B. (1,5M-3M€, déjà engagé à 1,3M€), LP Corporate/CVC et Endowment (verrouillés, réputation "GP confirmé" requise). `LpOffer` gagne un champ `status` ('available' | 'committed' | 'locked'), `name` (nom propre), `committedAmount` et `lockedReason`.
**Raison** : la maquette donne des valeurs et un état d'exemple précis (2 LPs déjà engagés pour montrer la progression du fonds à 2,1M€/5,0M€) — plus fiable que des montants inventés.
**Domaine concerné** : Game Loop (`src/game-loop/lp-pool.ts`, `lp-pool.data.ts`).

## [2026-09-15] Progression du fonds à zéro au démarrage (correction)

**Décision** : les 4 LPs non verrouillés du Fonds I démarrent tous `status: 'available'`, aucun `committed` — contrairement à l'entrée précédente qui avait copié littéralement l'état "2 LPs déjà engagés" de la maquette.
**Raison** : correction demandée par l'utilisateur — l'état "2 LPs engagés, 2,1M€/5,0M€" affiché dans la maquette est un exemple illustratif du rendu à mi-parcours, pas l'état réel de départ du run. Au tout début du Fonds I, rien n'est encore engagé : le joueur doit pitcher chaque LP (scène de pitch, §3.1.3) pour qu'il passe à `committed`, ce qui fait alors progresser la barre.
**Domaine concerné** : Game Loop (`src/game-loop/lp-pool.data.ts`). Remplace la partie "état d'exemple" de la décision précédente.

## [2026-09-15] 2e question ajoutée pour le pitch Yann Fontaine

**Décision** : ajout d'une 2e question au pitch de Yann Fontaine dans `src/signals-content/pitch-questions.ts` ("Tu attends quoi de moi en échange de ton bonus de deal flow ?"), en plus de celle déjà présente.
**Raison** : la maquette source (vc-techwear-lp_7.html) ne scripte qu'une seule question pour ce LP, alors que le principe de "2-3 questions séquentielles" (product-spec §3.1.3, par analogie avec §3.4) suppose au moins 2 échanges. Signalé par l'utilisateur comme manquant.
**Domaine concerné** : Signals & Content (`src/signals-content/pitch-questions.ts`). Contenu inventé pour compléter la maquette, à ajuster librement.

## [2026-09-16] Contenu de pitch écrit pour Family Office R. et Fonds pension B.

**Décision** : ajout de 2 questions chacune pour `fund-i-family-office-r` et `fund-i-fonds-pension-b` dans `pitch-questions.ts` — les 4 LPs disponibles du Fonds I ont maintenant une scène de pitch jouable avec conversation (plus de fallback "direct au résultat").
**Raison** : la maquette ne scriptait que Northbridge et Yann Fontaine ; demande explicite de compléter les 2 LPs restants plutôt que de laisser le fallback en place.
**Domaine concerné** : Signals & Content. Contenu cohérent avec les contraintes déjà définies dans `lp-pool.data.ts` (Family Office : accès co-invest exigé ; Fonds pension : limite de risque 25%).

## [2026-09-19] Transition vers Trimestre 1 bloquée tant qu'aucun LP n'est engagé

**Décision** : le CTA de fin de levée de fonds ("Lancer le premier trimestre") reste désactivé tant que `offers.some(o => o.status === 'committed')` est faux — au moins un LP doit être engagé pour avancer.
**Raison** : le product-spec §3.1.4 dit littéralement que le joueur "peut rester sous la cible visée", ce qui autoriserait techniquement à avancer avec 0€ levé. Choix produit explicite de l'utilisateur d'imposer un minimum d'au moins 1 LP engagé, plus sécurisant pour la suite du run (démarrer un fonds à 0€ n'aurait pas de sens jouable).
**Domaine concerné** : Game Loop (condition de transition) / UI (état du bouton). L'écran suivant est un placeholder minimal "Trimestre 1" en attendant la construction du deal flow.

## [2026-09-19] 4 deals pour le Trimestre 1, contenu inspiré du screenshot deal flow

**Décision** : `src/game-loop/deal-flow.data.ts` contient 4 deals (ReSurge, NRJ Logistics, Solvix AI, Vaeli), reprenant les noms/pitchs du screenshot deal flow envoyé en tout début de projet, chacun relié à un archétype fondateur Phase 0 différent. ReSurge est marqué `isDevelopedScene: true` (la seule scène développée du tour, §3.2 "~1 par tour").
**Raison** : le product-spec ne fournit pas de deals concrets, seulement la mécanique. Le screenshot original donne des noms/pitchs réels déjà vus par l'utilisateur, plus cohérent que d'inventer des données from scratch.
**Domaine concerné** : Game Loop (`src/game-loop/deal.ts`, `deal-flow.data.ts`). Contenu ajustable librement, pas structurant.

## [2026-09-19] Carte deal flow rapide : bouton Investir après Creuser, ticket fixe

**Décision** : sur une carte deal flow rapide, cliquer « Creuser » révèle les signaux ET fait apparaître un 3e bouton « Investir » (le bouton Passer reste disponible). Cliquer Investir engage un montant fixe (pas de curseur ajustable) — le ticket ajustable min/max (§3.4) reste réservé à la scène de dialogue développée.
**Raison** : le product-spec §3.2 liste "passer / creuser / investir" comme les 3 actions d'une carte rapide sans préciser le flux exact ; ajouter le ticket ajustable ici alourdirait une interaction censée rester rapide sous chrono.
**Domaine concerné** : Game Loop (résolution de decision) / UI (composant carte). Montants retenus dans `src/game-loop/deal-flow.ts` : 100k€ (pre-seed), 250k€ (seed), 600k€ (series-a) — arbitraires, à ajuster pour l'équilibrage.

## [2026-09-19] DealTag porte une famille de signal, pas un statut révélé/verrouillé

**Décision** : `DealTag` (`src/game-loop/deal.ts`) remplace son champ `status: 'revealed' | 'locked'` par `family: SignalFamily` ('structurel' | 'equipe' | 'trompeur', type déjà défini dans `signals-content/types.ts`). Le statut affiché (révélé ou verrouillé) devient dérivé côté UI : structurel toujours révélé d'office, équipe/trompeur révélés seulement une fois la carte creusée — jamais stocké en dur sur la donnée.
**Raison** : précision de l'utilisateur sur la règle exacte de "Creuser" (product-spec §3.3) — les signaux structurels sont visibles d'office, seuls équipe/trompeur sont masqués derrière un cadenas puis révélés d'un coup en creusant, avec une couleur par famille (sarcelle/vert pour équipe, rose pour trompeur). L'ancien modèle (`status` figé par tag, sans notion de famille) ne permettait pas cette distinction.
**Domaine concerné** : Game Loop (type `Deal`/`DealTag`) / UI (`DealCard` dérive le statut affiché à partir de `family` + `signalsRevealed`, applique la couleur par famille).

## [2026-09-19] Couleurs de signal ajoutées aux tokens

**Décision** : `--signal-equipe: #4a8a82` (sarcelle) et `--signal-trompeur: #c98a9e` (rose doux) ajoutés à `src/ui/tokens.css`. `--forest` (déjà existant) reste réservé aux scènes de dialogue (§7.10) pour éviter toute confusion sémantique avec les tags de signal.
**Raison** : demande explicite de couleurs distinctes par famille de signal une fois révélé (sarcelle pour équipe, rose pour trompeur), le structurel restant neutre (fond `--cream`).
**Domaine concerné** : UI / Visual System. Teintes proposées cohérentes avec la palette pixel-techwear existante, ajustables librement.

## [2026-09-19] Capital déployé affiché à côté de la bande passante (Deal Flow)

**Décision** : `DealFlowScreen` suit un state `deployedCapital` (somme des tickets fixes des deals investis) affiché dans la barre de ressources, à côté de la bande passante.
**Raison** : demande explicite de visibilité sur le capital investi pendant le deal flow.
**Domaine concerné** : UI (`DealFlowScreen.tsx`). Suite au retour utilisateur, affiché sous forme "déployé / levé" avec une jauge mustard — `totalRaised` calculé dans `App.tsx` à partir de `offers` et transmis en prop (relie le capital du deal flow au montant réellement levé en Phase 0.1).

## [2026-09-19] Bouton "Opportunité écartée" après Passer

**Décision** : cliquer « Passer » sur une carte deal flow remplace les boutons Passer/Creuser/Investir par un bouton unique désactivé « Opportunité écartée », visuellement grisé (opacité réduite, `cursor: not-allowed`).
**Raison** : demande explicite — une carte passée ne doit plus permettre aucune action, avec un retour visuel clair.
**Domaine concerné** : UI (`DealCard.tsx`/`.module.css`). Libellé du bouton choisi librement (l'utilisateur a laissé le nommage ouvert).

## [2026-09-19] Investissement plafonné au capital réellement levé

**Décision** : `DealFlowScreen` calcule `remainingCapital = totalRaised - deployedCapital` et l'utilise pour (1) refuser silencieusement `handleInvest` si le ticket dépasse le capital restant, (2) désactiver le bouton Investir sur une carte creusée dont le ticket dépasse le capital restant (libellé "Capital insuffisant"), (3) désactiver le bouton "Rejoindre le pitch" dès que `remainingCapital <= 0` (libellé "Capital épuisé").
**Raison** : demande explicite — le joueur ne doit jamais pouvoir déployer plus que ce qu'il a levé auprès des LPs pendant la Phase 0.1, y compris via la scène de pitch fondateur (pas encore construite, mais l'accès est déjà bloqué en amont).
**Domaine concerné** : Game Loop (calcul du capital restant) / UI (`DealCard.tsx` désactive Investir/pitch selon `remainingCapital`). Le blocage du pitch est conservateur : dès que le capital restant est à 0, même si un futur ticket de pitch pourrait être plus petit qu'un ticket de carte rapide — à affiner quand la scène de pitch fondateur existera et connaîtra son propre montant.

## [2026-09-19] Header Deal Flow unifié : logo, badges LP, ressources

**Décision** : `AppHeader` accepte deux props optionnelles `badges` et `resources` (en plus du logo toujours affiché). Sur `DealFlowScreen`, `badges` affiche un `LpBadge` par LP engagé (nom + initiales, juste après le logo) et `resources` regroupe capital déployé (avec jauge mustard) + bande passante, poussés à droite via `margin-left:auto`. Fond du header explicite (`--bg`) + bordure basse + `position:sticky`, cohérent avec `.topbar` de la maquette `vc-techwear-proposal_11.html`. `DealFlowScreen` reçoit désormais `offers: LpOffer[]` (au lieu de `totalRaised: number`) pour pouvoir lister les LPs engagés.
**Raison** : demande explicite — logo/badges LP à gauche, ressources à droite, fond sombre visible, cohérent avec le screenshot deal flow original envoyé en tout début de projet.
**Domaine concerné** : UI (`AppHeader.tsx`, nouveau composant `LpBadge.tsx`, `DealFlowScreen.tsx`).

## [2026-09-19] Montant recherché visible dès le début sur chaque carte deal flow

**Décision** : le montant recherché par chaque startup (= `fixedTicketForStage(deal.stage)`) s'affiche directement sur la carte, sans attendre de Creuser — "Recherche {montant}" sur les cartes rapides, colonne "MONTANT" (remplace "TENTATIVE") sur la carte pitch.
**Raison** : demande explicite — le montant cible d'une levée de fonds est une information publique par nature, cohérent avec le fait qu'elle n'est pas un signal équipe/trompeur (§3.3).
**Domaine concerné** : UI (`DealCard.tsx`/`.module.css`).

## [2026-09-19] ReSurge/Marcus Idjeri réassigné à l'archétype "Bricoleur obsessionnel"

**Décision** : le deal ReSurge, précédemment assigné à `rescape` ("Le Rescapé"), est réassigné à `bricoleur-obsessionnel` dans les banques de contenu Signals & Content.
**Raison** : `rescape` n'est pas dans les 5 archétypes actifs en Phase 0 (`phase0: true` dans `founders.ts`) — incohérence introduite lors de l'écriture initiale de `deal-flow.data.ts`. "Bricoleur obsessionnel" ("présentation maladroite, précision chirurgicale une fois creusé") correspond mieux au ton factuel/sans posture déjà écrit dans le pitch de Marcus Idjeri (scène de pitch LP Yann Fontaine).
**Domaine concerné** : Signals & Content. Corrige la source de vérité pour le générateur de deal flow (ADR-002).

## [2026-09-19] Banques de contenu pour le générateur de deal flow (ADR-002)

**Décision** : trois nouvelles banques dans `src/signals-content/` : `company-names.ts` (profils startup — nom/pitch/ticker — indexés par secteur, 3-4 par secteur), `founder-names.ts` (noms de fondateurs indexés par zone, purement cosmétique), `signal-bank.ts` (tags structurel génériques + 4 tags équipe/trompeur par archétype Phase 0, pour varier les combinaisons d'un tour à l'autre).
**Raison** : contenu nécessaire pour que le générateur (ADR-002) puisse composer des deals variés respectant la thèse (secteur+zone+stade) sans tout écrire à la main par trimestre.
**Domaine concerné** : Signals & Content. Volume de contenu délibérément modeste pour la Phase 0 (assez pour plusieurs trimestres sans répétition immédiate) — à étoffer si le run de 8 trimestres montre trop de répétitions en playtest.

## [2026-09-20] Minimum 2 secteurs à la thèse + banques élargies à 12-15 profils/secteur

**Décision** : `MIN_SECTORS = 2` ajouté dans `thesis.ts` (en plus de `MAX_SECTORS = 3` déjà existant) — le bouton de validation de thèse reste désactivé tant que le joueur n'a pas sélectionné au moins 2 secteurs. En parallèle, `company-names.ts` passe de 5-6 à 12-15 profils par secteur.
**Raison** : sur un run de 8 trimestres × 4 deals = 32 tirages, une thèse à un seul secteur (5-6 profils) fait revenir chaque nom de startup ~6 fois sur le run — la répétition inter-trimestres cassait la variété que le générateur (ADR-002) est censé apporter. Le tirage sans remise (`pickManyNoRepeat`) ne garantit l'absence de doublon qu'à l'intérieur d'un même trimestre, pas d'un trimestre à l'autre (le générateur reste sans état, ADR-002). Avec 2 secteurs minimum et des banques élargies, ~24-30 profils sont disponibles pour tout le run — la répétition redevient rare sans avoir à faire transiter un historique entre trimestres.
**Domaine concerné** : Game Loop (`thesis.ts`, contrainte de validation) / UI (`ThesisDeclaration.tsx`, label et condition du bouton) / Signals & Content (`company-names.ts`, volume de contenu). Le problème n'est pas éliminé à 100% (répétition encore possible sur un run très long ou si le joueur ne varie jamais), seulement rendu rare — à surveiller en playtest.

## [2026-09-20] Investir directement sans creuser (pari à l'aveugle)

**Décision** : sur une carte deal flow rapide, "Investir" devient toujours visible à côté de "Passer"/"Creuser" (au lieu de n'apparaître qu'après avoir creusé). Cliquer Investir sans avoir creusé engage le ticket sans jamais révéler les signaux équipe/trompeur — seuls les signaux structurels (déjà visibles d'office, §3.3) sont connus du joueur. Une carte investie affiche un état visuel dédié (contour vert) plutôt que de disparaître.
**Raison** : demande explicite — permettre d'investir "d'un coup d'œil" sans consommer de bande passante ni creuser, comme un vrai pari. Cohérent avec le message central du jeu (product-spec : "le but n'est pas d'éviter le risque mais de repérer les fund-returners").
**Domaine concerné** : UI (`DealCard.tsx`/`.module.css`). Écarte l'ancienne règle "Investir n'apparaît qu'après Creuser" — l'ancien comportement (Investir après Creuser, signaux déjà révélés) reste disponible en parallèle, c'est juste que Creuser n'est plus un prérequis obligatoire.

## [2026-09-21] Braconnage : 0 ou 1 carte par tour, purement visuel, aléatoire

**Décision** : implémentation du "braconnage" (product-spec §7.8, oublié à l'écriture initiale du deal flow). Au plus 1 carte du trimestre est marquée braconnée à la fois (jamais 2 simultanément), tirée aléatoirement parmi toutes les cartes du tour — carte PITCH incluse. Déclenchement indépendant des actions du joueur (pas lié à Creuser). Effet purement visuel (bandeau rouge + bordure pulsante + secousse 0.4s) : aucun changement réel du chrono, aucun effet mécanique.
**Raison** : demande explicite de l'utilisateur, avec la maquette `vc-techwear-proposal_11.html` comme référence visuelle exacte (bandeau "⚠ UN CONCURRENT S'INTÉRESSE À CE DEAL" + bordure rouge sur la carte 02). Le but est un sentiment d'urgence, pas une nouvelle couche de complexité mécanique — d'où le choix de l'inclure sur la carte PITCH aussi, malgré l'absence de chrono sur cette carte.
**Domaine concerné** : Game Loop (tirage de la carte braconnée) / UI (rendu visuel sur `DealCard.tsx`).

## [2026-09-22] Scène de dialogue fondateur : périmètre V1 et structure des questions

**Décision** : première version de la scène fondateur (§3.4) limitée au dialogue + révélation de signaux : attention (3) / patience (4), menu de questions au choix, révélation des signaux équipe/trompeur via les réponses, sortie sur un investissement à montant fixe. La cap table révélable et le curseur de ticket ajustable (aussi décrits au §3.4) sont reportés à un chantier séparé.
Contenu : chaque archétype Phase 0 a une banque de 8-10 questions écrites (question + réponse du fondateur + signal révélé) ; 6 sont tirées aléatoirement à chaque scène.
**Raison** : le §3.4 décrit une scène très riche — la découper permet de tester le dialogue avant d'ajouter la couche financière. La banque par archétype (plutôt que des questions génériques) garantit que revoir le même archétype au trimestre 5 propose des questions largement différentes, sur un run de 8 trimestres.
**Domaine concerné** : Signals & Content (banque de questions fondateur) / Game Loop (résolution attention/patience) / UI (`FounderScene`).

## [2026-09-22] Palette de la scène fondateur : orange au lieu du vert forest

**Décision** : la scène de dialogue fondateur reprend la structure visuelle de la scène LP (modale 2 colonnes, sidebar + fil de chat) mais remplace `--forest` par un orange dédié pour la sidebar et les bulles du joueur.
**Raison** : demande explicite — distinguer visuellement la scène fondateur de la scène LP, qui garde le vert (product-spec §7.10).
**Domaine concerné** : UI (`tokens.css` gagne une variable dédiée, `FounderScene.module.css`).
