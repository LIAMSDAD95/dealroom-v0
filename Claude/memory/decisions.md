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

## [2026-09-24] Scène de crise macro (§3.6) : cadrage V0

**Décision** :
- Déclenchement **aléatoire à partir du trimestre 4 seulement** (jamais Q1-Q3), et uniquement si le joueur a au moins une ligne en portefeuille (§3.6 : « zéro exposition = pas de scène »).
- « Soutenir en urgence » pioche dans le **capital restant** (non déployé), pas dans une réserve follow-on séparée — cohérent avec le défaut du product-spec §6 (« fondue dans le capital général »), évite d'introduire une ressource qui toucherait aussi l'écran de levée de fonds.
- **Résolution réelle** : chaque archétype porte une résilience ; « Soutenir » aide vraiment si le fondateur est résilient, et la fiabilité de la jauge « réaction attendue » dépend du nombre de signaux équipe déjà révélés sur cette ligne (§3.6, prédictibilité proportionnelle).
**Raison** : demande explicite de l'utilisateur, avec la maquette `vc-techwear-crisis_7.html` comme référence visuelle. Le Q4 minimum laisse le temps de constituer un portefeuille avant que la première crise tombe.
**Domaine concerné** : Game Loop (portefeuille, déclenchement, résolution) / Signals & Content (news + réactions par archétype) / UI (`CrisisScene`).

## [2026-09-24] Câblage du portefeuille et place de la crise dans le trimestre

**Décision** :
- La scène de crise s'intercale **avant** le deal flow du trimestre : `enterQuarter()` tire la crise au moment de la transition, puis affiche soit `crisis`, soit `deal-flow`. Le joueur traite le choc, puis continue vers les nouvelles opportunités.
- Une ligne de portefeuille est créée à **chaque investissement**, quel que soit le chemin (bouton « Investir » sur la carte ou sortie de scène fondateur). `knownTeamSignals` est rempli si le joueur avait creusé **ou** mené l'entretien — les deux révèlent des signaux équipe, donc les deux fiabilisent la prédiction de crise.
- Le coût en bande passante d'une crise est remonté à `App` (`crisisBandwidthSpent`) et entre dans la `key` de `DealFlowScreen` : sans ça, revenir de la crise au deal flow du même trimestre réutilise l'instance existante et le coût n'est jamais appliqué.
**Raison** : le portefeuille doit survivre au changement de trimestre (le state du deal flow, lui, est volontairement réinitialisé par sa `key`), donc il vit dans `App`. Marquer l'entretien à l'ouverture de la scène et non à sa sortie évite de lire un state pas encore committé dans `handleInvest`.
**Domaine concerné** : Game Loop (`portfolio.ts`, `crisis.ts`) / Technical (état applicatif dans `App.tsx`) / UI (`CrisisScene`, `DealFlowScreen`).

## [2026-09-24] Une startup ne peut plus revenir deux fois dans un run

**Décision** : `generateQuarterDeals` accepte un 3e paramètre `alreadySeen` (noms déjà croisés dans le run) et écarte ces profils en priorité. Le générateur reste stateless (ADR-002) : la mémoire est tenue par `App.tsx` dans un `useRef`. En complément, chaque banque sectorielle passe à **16 profils minimum** (17 pour saas-b2b).
**Raison** : signalé en test — la même startup (Closeeo) revenait au Q1 puis au Q3. Mesuré avant correction : **100% des runs** avaient au moins une répétition, 12,5 doublons en moyenne. `pickManyNoRepeat` ne dédoublonnait qu'à l'intérieur d'un trimestre, sans aucune mémoire d'un trimestre à l'autre. Le plancher de 16 profils est arithmétique : un run consomme 8 × 4 = 32 tirages, et la thèse impose au moins 2 secteurs — deux banques de 16 couvrent donc exactement le run. Après correction : 0% de répétition sur les 10 paires de secteurs possibles et toutes les triplettes.
**Domaine concerné** : Game Loop (`deal-generator.ts`) / Signals & Content (`company-names.ts`) / Technical (mémoire du run dans `App.tsx`).

## [2026-09-24] Récap de portefeuille consultable à tout moment

**Décision** : bouton « PORTEFEUILLE (n) » dans le header, qui ouvre un **panneau latéral** glissant depuis la droite (fermable par Échap, par la croix ou par un clic sur le fond). Affiché à partir du deal flow uniquement — pas sur la déclaration de thèse ni sur la levée de fonds, où le portefeuille est forcément vide. Contenu limité aux **faits bruts** : startup, fondateur, secteur/stade, montant investi, trimestre d'entrée, signaux équipe connus, statut actif/sorti, plus une synthèse (lignes actives, sorties, capital déployé / levé).
**Raison** : demande utilisateur d'un accès permanent sans altérer l'expérience. Le panneau latéral a été préféré à la modale centrée (qui masque tout l'écran, donc « quitte » le deal flow) et à l'encart permanent (qui mange de la largeur dont les cartes ont besoin, et n'existerait que sur un écran). Le compteur sur le bouton donne l'information principale sans même ouvrir. Aucun score de santé ni valorisation : règle #3 du CLAUDE.md (pas de score agrégé) — et le jeu ne dispose de toute façon pas encore de mécanique d'évolution de portefeuille (§3.2 « évolutions silencieuses » reste à concevoir).
**Conséquence technique** : `App.tsx` compose désormais l'écran courant dans une variable (`currentScreen`) au lieu d'enchaîner les `return`, pour que le panneau soit monté une seule fois au-dessus de n'importe quel écran.
**Domaine concerné** : UI (`PortfolioPanel`, `AppHeader`) / Technical (état d'ouverture dans `App.tsx`).

## [2026-09-27] Évolutions silencieuses, follow-on et place du rapport de portefeuille

**Décision** :
- **Horizon de run maintenu à 8 trimestres, sans actes** — les maquettes `vc-techwear-portfolio_3.html` et `vc-techwear-endrun_1.html` affichent « Q7 / 18 », « Q18 / 18 » et « Acte II » : ce sont des restes d'une version antérieure, non repris.
- **Ordre d'un trimestre** : rapport de portefeuille (évolutions + follow-on) → crise éventuelle → deal flow. Le rapport est sauté tant qu'aucune ligne n'est active (donc jamais au Q1). La clôture n'est jamais le lieu des évolutions ni du follow-on : aucune décision n'y est possible.
- **Modèle de valorisation** (`portfolio.ts`, `portfolio-evolution.ts`) : chaque ligne tire à l'investissement une **destinée cachée** (fund-returner / winner / zombie / wipeout) selon l'archétype du fondateur — les profils sous-estimés en surface (bricoleur, vétérante) portent l'essentiel des fund-returners. Chaque trimestre, une ligne soit lève un tour (≥ 3 trimestres après le précédent → carte follow-on), soit évolue (▲ / — / ▼), soit ferme (seulement si déjà ▼ et ≥ 3 trimestres en portefeuille). Part d'entrée 6-12 %.
- **Follow-on** : ticket = pro-rata (part × 20 % de la nouvelle post-money). **Refuser = dilution seule** (part × 0,8), pas d'autre pénalité (choix utilisateur). **Revoir DD** = −1 bande passante, révèle tous les signaux de la ligne (et fiabilise donc aussi la prédiction de crise). Chaque carte exige une décision explicite avant de continuer ; les offres ne survivent pas au trimestre.
- **Colonne « Fenêtre » de la maquette remplacée** par « Ta part si refus » (x % → y %), plus « Capital restant » à la place de « Réserve restante » (pas de réserve séparée, cf. 2026-09-24).
- **Les crises agissent sur la trajectoire** : `CrisisOutcome.lineEffect` — soutien utile = +10 % de valo et un wipeout remonte en zombie ; ligne qui décroche = −30 % et descend d'un cran de destinée. Le bridge s'ajoute au capital investi de la ligne ; l'atterrissage en douceur devient un retour réalisé (DPI).
- **Clôture (lot 2, à venir)** : option A — dénouement accéléré au Q8 qui projette chaque ligne jusqu'à sa sortie selon sa destinée. Perk « Instinct de chasseur » remplacé par un perk d'information sans verdict (ex. un signal équipe révélé gratuitement par deal) — règle #3.
**Raison** : sans valorisation qui évolue, l'écran de clôture aurait dû inventer ses multiples au dernier moment, sans lien avec les signaux vus en jeu. Calibrage mesuré sur 4 000 runs simulés (2 lignes/trimestre) : TVPI médian au Q8 de 0,98× en jouant au hasard, 1,16× en privilégiant les bons profils (courbe en J réaliste à 2 ans) ; ~7 offres de follow-on et 1-2 fermetures par run. L'écart entre stratégies est volontairement amplifié par le dénouement du lot 2, pas pendant le run.
**Domaine concerné** : Game Loop (`portfolio.ts`, `portfolio-evolution.ts`, `crisis.ts`) / Signals & Content (`portfolio-evolutions.ts`) / UI (`PortfolioScreen`, `FollowOnCard`, `PortfolioPanel`) / Technical (`App.tsx` : écran `portfolio-report`, `quarterBandwidthSpent` remplace `crisisBandwidthSpent`).

## [2026-09-27] Clôture de run (§3.8) et méta-progression (§3.7) — cadrage V0

**Décision** :
- **Dénouement accéléré au Q8** (`run-closing.ts`) : chaque ligne active est projetée jusqu'à sa sortie selon sa destinée — fund-returner ×4-9 sur la valo actuelle (dilution future ×0,65, IPO ou rachat), winner ×1,6-3 (×0,8), zombie : 1 sur 2 reste en portefeuille (non réalisé, marque ×0,8), l'autre est rachetée à la casse (×0,3-1), wipeout ferme à 0. Les lignes sorties pendant le run gardent leur issue. Calibrage sur 4 000 runs : TVPI final médian 1,3× au hasard (p10 0,6 / p90 3,0), 2,1× en jouant informé (p10 1,1 / p90 4,4) ; au moins une ligne qui rembourse le fonds dans 22 % vs 37 % des runs.
- **Écarts avec `vc-techwear-endrun_1.html`** : 8 trimestres ; la rangée de stats remplace le TVPI (déjà en très grand) par le capital investi ; sorties triées par multiple.
- **Rapport aux LPs** (`lp-report.ts`) : les engagements portent un identifiant (`EngagementId`) — sur les réponses de pitch et sur les contraintes dures de carte. Vérifiés à la clôture : `risk-limit` = ≤ 25 % des tickets d'entrée investis à l'aveugle ; `fast-deployment` = ≥ 50 % du levé engagé en tickets d'entrée à la fin du Q4 ; `founder-availability` = aucune crise laissée courir (non testé si aucune crise). `co-invest`, `transparency`, `risk-reporting` restent **non testés** : aucune mécanique correspondante en Phase 0 (le Family Office ne peut donc pas être déçu sur le co-invest, contrairement à la maquette). Confiance finale = confiance de fin de pitch + performance (−20 à +25) + 10 par engagement tenu − 20 par engagement trahi − 5 par réponse incohérente avec l'angle. ≥ 65 : suit au fonds suivant (engagé d'office, même montant) ; 40-64 : en attente ; < 40 : ne reconduit pas. Citation : un engagement trahi prime, puis l'incohérence d'angle, puis un engagement tenu, puis la performance.
- **Réputation** : paliers 0 « GP émergent », 20 « GP en développement » (angle Réseau), 60 « GP confirmé » (angle Track record). Gain par run : 4 à 20 selon le TVPI, +4 par ligne qui rembourse le fonds, +2 par LP qui suit. Les LPs CVC/Endowment restent verrouillés (pas de contenu Phase 0).
- **Leçons (perks)**, chacune liée à un exploit : *Instinct de chasseur* (une ligne ≥ 10× avec DD faite → 1 signal équipe visible d'office par carte ; remplace le perk « nuance visuelle » de la maquette, règle #3), *Sang-froid* (crise bien lue → prédiction de crise +1 cran), *Discipline de réserve* (follow-on sur une ligne sortie ≥ 3× → « Revoir DD » gratuit), *Premier fonds bouclé* (leçon plancher si aucune autre → +10 de confiance de départ en pitch LP).
- **Persistance** : `localStorage`, clé `dealroom.meta.v1`, sauvegardée dès la transition vers la clôture. « Lancer le Fonds II » remonte le run (`<Run key={fundNumber}>`) : tout l'état de partie repart à zéro, seule la méta-progression passe.
**Raison** : demande utilisateur (écran de clôture d'après maquette, option A, perk de remplacement). Les seuils des engagements, les paliers et les perks ne sont pas tranchés par le product-spec : valeurs de départ à ajuster en playtest, regroupées en constantes en tête de `lp-report.ts` et `meta.ts`.
**Domaine concerné** : Game Loop (`run-closing.ts`, `lp-report.ts`, `meta.ts`, `pitch-session.ts`, `crisis.ts`, `lp-pool.ts`) / Signals & Content (`closing-content.ts`, `meta-content.ts`, `EngagementId` sur `pitch-questions.ts`) / Persistence (`meta-storage.ts`) / UI (`RunClosingScreen`, effets de perks dans `DealCard`, `CrisisScene`, `PitchScene`, `FollowOnCard`) / Technical (`App.tsx` : `Run` + wrapper de méta-progression).

## [2026-09-27] Écran de blocage mobile (§8.1) et onboarding progressif (§8.2)

**Décision** :
- **Blocage, pas simple avertissement** (choix utilisateur) : écran plein « À jouer sur ordinateur » sous 1024 px de large, ou sur un appareil tactile sans pointeur précis (`(pointer: coarse) and (not (any-pointer: fine))` — bloque aussi les tablettes). Il **recouvre** le jeu sans le démonter : un joueur desktop qui rétrécit sa fenêtre retrouve sa partie intacte en l'agrandissant. Détection dans `src/app/useIsDesktop.ts` (Technical), écran dans `ui/DesktopOnlyScreen`.
- **Onboarding sans maquette** (choix utilisateur) : une visite guidée par écran (thèse, levée, pitch LP, deal flow, entretien fondateur, rapport de portefeuille, follow-on, crise, clôture), affichée la première fois que le joueur y arrive. Bulle crème à bordure noire + mise en lumière de l'élément ciblé (attribut `data-onboarding`), boutons Suivant / Passer / « Ne plus afficher l'aide », clavier Entrée/→/Échap. Le jeu n'est pas cliquable pendant une visite et **les chronos des cartes rapides sont en pause**. Visites vues et désactivation mémorisées dans `localStorage` (`dealroom.onboarding.v1`).
- Une étape dont la cible est absente est sautée ; pour cette raison, le follow-on a **sa propre visite**, déclenchée par la première carte follow-on (le premier rapport de portefeuille n'en a presque jamais : l'étape aurait été sautée puis marquée vue).
**Raison** : objectifs Phase 0 du PRD §3. Textes en tutoiement, comme les écrans récents.
**Domaine concerné** : Technical (`useIsDesktop`, montage dans `App`) / UI (`DesktopOnlyScreen`, `ui/onboarding/`, cibles sur les écrans, pause du chrono dans `DealCard`) / Signals & Content (`onboarding-content.ts`) / Persistence (`onboarding-storage.ts`).

## [2026-09-28] Bouton « Aide » pour rejouer l'onboarding

**Décision** : bouton flottant « ? AIDE » en bas à droite, sur tous les écrans, qui rejoue la visite de l'écran affiché — même déjà vue, et même si le joueur a choisi « Ne plus afficher l'aide » (demande explicite). Flottant plutôt que dans le header, parce que les scènes en modale (pitch LP, entretien fondateur) recouvrent le header : il est placé au-dessus d'elles (z-index 250), et si une scène est ouverte c'est sa visite qui est rejouée, pas celle de l'écran dessous. Masqué pendant une visite.
**Raison** : demande utilisateur, pour permettre aux testeurs de revoir une explication sans vider leur stockage.
**Domaine concerné** : UI (`ui/onboarding/`).

## [2026-09-29] Nom du jeu en police pixel, ticket ajustable en scène fondateur, VO anglaise et mode clair écartés

**Décision** :
- **Version anglaise : pas en Phase 0.** Testeurs francophones ; ~9 600 mots de contenu à traduire (dont des signaux dont l'ambiguïté doit survivre à la traduction) et des libellés d'interface répartis dans 22 composants. À reconsidérer après validation si public international.
- **Mode clair : écarté.** Le sombre est la direction artistique (§7), pas un réglage ; 155 couleurs en dur dans les CSS modules.
- **Logo « DEALROOM »** en police pixel (Press Start 2P, celle des titres de section), 1,15rem, carré corail sans arrondi — dans `AppHeader`, donc sur tous les écrans ; aussi sur l'écran mobile.
- **Ticket ajustable (§3.4)** en fin d'entretien fondateur : curseur par pas de 10k€ entre 50 % du montant demandé (« pris au sérieux ») et le plus petit de capital restant / 15 % du capital (au-delà, le fondateur refuse d'être dilué). Affiche ticket, part obtenue, montant demandé, post-money et une jauge de dilution vers le seuil de 15 %. Pas de limite LP par ticket (aucune contrainte LP ne porte sur la taille d'un ticket). Visite d'aide dédiée (« Dose ta conviction »).
- **Conséquence modèle** : chaque deal porte désormais sa `postMoney` (tirée à la génération pour que le montant demandé = 6-12 % du capital) ; la part d'une ligne = ticket / post-money. Les cartes rapides gardent exactement la même distribution de part qu'avant.
**Raison** : questions et demandes utilisateur. Le curseur rend la conviction dosable : c'est la taille du ticket sur le bon fondateur qui fait un fund-returner.
**Domaine concerné** : UI (`AppHeader`, `TicketSlider`, `FounderScene`, `DealCard`) / Game Loop (`deal.ts`, `deal-generator.ts`, `portfolio.ts`, `founder-scene.ts`) / Signals & Content (`onboarding-content.ts`) / Technical (`App.tsx`).

## [2026-09-29] Alertes trimestrielles : plus de variété, aucune répétition dans un run

**Décision** : 7 alertes ajoutées (panne d'infrastructure, résiliation d'un grand compte, concurrent qui lève 50 M€, partenaire bancaire qui coupe, chute de la consommation, litige de brevet, fuite de données) — 12 au total, au moins 6 possibles par secteur (SaaS 8, fintech 8, marketplace 8, deeptech 6, consumer 6). `maybeTriggerCrisis` reçoit les événements déjà vécus dans le run (mémoire dans `App`, comme les noms de startup) et les écarte tant qu'il en reste. Réactions de fondateur réécrites sans pronom (« — le board a été informé dans l'heure ») : les fondateurs ne sont pas tous des hommes.
**Raison** : retour de playtest — 3 alertes sur 3 étaient la démission du profil senior. Cause : aucune mémoire entre trimestres, et seulement 3 alertes possibles pour une ligne SaaS. Mesuré après correction : 0 run avec répétition sur 20 000 simulés (5 crises max par run, Q4-Q8).
**Domaine concerné** : Signals & Content (`crisis-events.ts`) / Game Loop (`crisis.ts`) / Technical (`App.tsx`).

## [2026-10-03] Pseudo du testeur et mention de collecte sur l'écran de thèse

**Décision** : champ « TON PSEUDO — FACULTATIF » en haut de l'écran de thèse (24 caractères max, prérempli au run suivant), et identifiant aléatoire créé au premier lancement (`dealroom.player.v1`, `persistence/player-identity.ts`). Mention de collecte en fin de page : « Pendant ce playtest, tes décisions de jeu (deals creusés, investissements, choix en crise, résultat final) sont enregistrées avec ton pseudo pour améliorer DEALROOM. Rien d'autre n'est collecté : ni email, ni données de navigation. Sans pseudo, ton run est enregistré de façon anonyme. » Hébergement prévu : Vercel. Destination des données : Supabase (à brancher).
**Raison** : décisions utilisateur (pseudo + identifiant le 2026-09-29, placement le 2026-10-03). Le pseudo n'est pas un champ libre de dialogue (règle #4) : il ne touche pas au système de signaux.
**Domaine concerné** : Persistence (`player-identity.ts`) / UI (`ThesisDeclaration`) / Technical (`App.tsx`).

## [2026-10-03] Carte PITCH en orange, première alerte forcée au Q3, « Votre décision » agrandi

**Décision** :
- **Carte PITCH** : ruban PITCH dans l'orange du carré du logo (`--coral`), texte blanc, contour du ruban noir uniquement (lignes du dessus et du dessous), police agrandie. **La carte elle-même garde son contour noir standard** : seul le ruban est en couleur (précisé par l'utilisateur, après deux essais avec un contour de carte orange). Remplace la règle « pas de couleur différente » du §7.3. Une carte PITCH investie reprend le contour vert.
- **Crises, version de playtest** : la première alerte tombe **toujours au Q3** (`FORCED_CRISIS_QUARTER`), puis tirage aléatoire (50 %) à partir du Q4. Remplace « aléatoire à partir du Q4 » (2026-09-24). La règle « zéro exposition = pas de scène » prime : sans ligne active au Q3, pas d'alerte forcée (et elle n'est pas reportée).
- **Écran de crise** : titre « VOTRE DÉCISION » passé de 0,85rem à 1,5rem.
**Raison** : demandes utilisateur — que la scène d'entretien se repère d'un coup d'œil, que chaque testeur rencontre la mécanique de crise, et que le moment de décision ressorte.
**Domaine concerné** : UI (`DealCard.module.css`, `CrisisScene.module.css`) / Game Loop (`crisis.ts`).

## [2026-10-03] Playtest limité à deux fonds

**Décision** : le playtest s'arrête après la clôture du Fonds II (`PLAYTEST_LAST_FUND = 2`, `meta.ts`). À la clôture du Fonds II, le bouton devient « TERMINER LE PLAYTEST » et mène à un écran de fin (`PlaytestCompleteScreen`) : remerciement avec le pseudo, palier de réputation et leçons gagnées, invitation à donner son avis. Cet écran s'affiche aussi à chaque rechargement ensuite (méta-progression à fundNumber 3). Il n'y a pas de bouton pour recommencer : pour retester, vider le localStorage (`dealroom.meta.v1`).
**Raison** : choix utilisateur entre trois options (illimité / arrêt après le Fonds I / arrêt après le Fonds II). Deux fonds permettent de mesurer l'apprentissage du Fonds I au Fonds II (objectif PRD §3 sur les signaux) sans que le testeur épuise le contenu (mêmes LPs, mêmes banques de startups et de questions). Aucune décision antérieure ne limitait le jeu au Fonds I.
**Domaine concerné** : Game Loop (`meta.ts`) / UI (`RunClosingScreen`, `PlaytestCompleteScreen`) / Technical (`App.tsx`).
