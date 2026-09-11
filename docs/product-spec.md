# DEALROOM — Spécification produit

> Source originale : `dealroom-design-doc.md` (téléchargements locaux, importé le 2026-09-07).
> Ce fichier est la référence détaillée du design. Le [CLAUDE.md](../CLAUDE.md) à la racine en donne le résumé opérationnel.

---

## 1. Concept

Un roguelike où le joueur incarne un General Partner (GP) de venture capital. Chaque run = un fonds. Boucle centrale : lever un fonds auprès de LPs, instruire un deal flow de startups, décider d'investir ou non, gérer un portefeuille, encaisser des événements de marché, clôturer le fonds et repartir avec de la méta-progression.

**Message central du jeu** : le but n'est pas d'éviter le risque, mais de repérer les *fund-returners* (loi de puissance du VC). Tout le système de signaux est conçu pour récompenser la conviction informée, pas la prudence systématique.

**Rythme voulu** : deux vitesses assumées. Le deal flow classique est rapide et instinctif (chrono, décisions en quelques secondes). Les scènes développées (pitch fondateur, négociation LP, crise) cassent volontairement ce rythme — pas de chrono, le temps de réfléchir.

---

## 2. Scope retenu pour la Phase 0 (playtest fermé, 15-20 testeurs)

**Contexte** : développement solo avec Claude Code, horizon 1-2 mois, aucun budget marketing engagé à ce stade. Web desktop uniquement.

**Dans le scope :**
- Run de **8 trimestres, structure à plat** (pas d'actes, pas de trimestres creux)
- **4-5 archétypes de fondateurs**, **2-3 LPs**
- Toutes les mécaniques cœur : bande passante, chrono, ticket ajustable + cap table, scène de dialogue fondateur avec cohérence de signaux, scène LP avec angle + cohérence, follow-on, crise macro avec 4 options et vraies conséquences, méta-progression minimale
- Événements macro : **version simple**, un seul type de choc par occurrence, sans catégorisation par source
- Événements non-macro : **inclus** — "un talent rejoint une ligne" et "presse sur une ligne"
- Sauvegarde locale du run (reprise sur le même appareil, navigateur)
- Fil d'événements niveau 2 : log des actions du joueur envoyé automatiquement à la clôture du run (ou via bouton si abandon)
- **Écran de blocage mobile** : détection de l'accès mobile, message d'invitation à repasser sur desktop (le jeu reste desktop-only, ce n'est pas une version mobile jouable)
- **Onboarding progressif** : reconstruit sur le template visuel pixel/gris actuel, à partir de la démo existante (voir §8.2)

**Hors scope pour cette phase (repoussé) :**
- Structure en 3 actes, trimestres creux
- Système d'actualités à 3 sources (réseaux sociaux / VC concurrent / État)
- Version mobile jouable (web ou native) — seul l'écran de blocage mobile est dans le scope Phase 0
- Remontée d'erreurs techniques automatique (niveau 3)

---

## 3. Boucle de jeu

### 3.1 Phase 0 — Levée de fonds
1. **Déclaration de thèse** : secteur, stade, zone (chips sélectionnables). Engagement moral pour tout le run — dévier de la thèse coûte de la confiance LP.
2. **Pool de LPs** disponible selon la réputation du GP. Cartes avec capital, contraintes (dures = engagement mécanique, bonus = avantage).
3. **Scène de pitch LP** : le joueur choisit un **angle** (Conviction / Discipline ; Réseau et Track record verrouillés au Fonds I, débloqués par la réputation). Le LP pose 2-3 questions séquentielles ; réponses à choix multiples uniquement.
   - **Mécanique de cohérence** : chaque réponse a un "ton" (discipline/conviction/réseau/aucun). Ton qui matche l'angle → bonus de confiance. Contradiction → pénalité plus lourde qu'une réponse neutre.
   - Certaines réponses créent un **engagement** (contrainte mécanique verrouillée pour tout le run).
   - Résultat : montant proposé (interpolé selon la confiance finale), confiance finale, condition attachée. Jamais un simple oui/non.
4. Le joueur assemble son tour de table jusqu'à validation (peut rester sous la cible visée).

### 3.2 Boucle de tour (trimestre)
1. **Rapport de portefeuille** : évolutions silencieuses (informatif) + opportunités de follow-on (action réelle, §3.5).
2. **Deal flow** : 3-6 opportunités.
   - **Cartes rapides** : passer / creuser (–1 bande passante, révèle signaux équipe/trompeurs) / investir. Chrono actif (40s de base) — au timeout, auto-pass, jamais de pénalité.
   - **Scènes développées** (~1 par tour) : pas de chrono, dialogue en plusieurs questions (§3.4).
3. **Événement macro** (probabilité par tour) : effet diffus, ou scène de crise si ciblé sur une ligne du portefeuille (§3.6).
4. **Événement non-macro** (probabilité par tour, indépendant du macro) : greffé sur les évolutions de portefeuille.

### 3.3 Système de signaux
Trois familles, toujours **fiables à 100% une fois révélées** (pas de mensonge actif en V1) :
- **Structurel** : fiable mais faible pouvoir prédictif (marché, traction brute, valo). Filtre d'entrée.
- **Équipe** : le vrai signal. Lu dans le dialogue, jamais un chiffre affiché d'office.
- **Trompeur** : heuristiques qui marchent souvent mais piègent parfois (pedigree, charisme, croissance payée). Réservées à certains archétypes.

**Affichage** : tags explicites par signal une fois révélé, **jamais de score agrégé**. Le joueur assemble le jugement lui-même.

**Système anti-par-cœur** : signaux partagés entre archétypes, "tell" jamais au même endroit, densité variable du bluff (mélange 70/30 possible entre deux archétypes), 15-20% de contre-exemples volontaires.

### 3.4 Scène de dialogue (fondateur)
- Ressources : **Attention de la scène** (3 par défaut), **Patience du fondateur** (4 par défaut). Chaque question coûte de l'attention (1-2) et fait descendre la patience d'autant.
- Menu de **questions pré-écrites** (5-7 disponibles, jusqu'à 3 choisies) — jamais de champ libre en V1.
- Format **conversation en chat** : bulles fondateur à gauche, joueur à droite. Popup de chargement avant ouverture. Indicateur de frappe (~3s) avant chaque nouvelle réponse.
- Attention à 0 → plus de questions. Patience basse → le fondateur peut écourter l'entretien.
- **Cap table** : taille du tour, pre/post-money visibles d'office. Part fondateurs/co-investisseur verrouillée, révélée en consommant de l'attention.
- **Ticket ajustable** : curseur min ("pris au sérieux") / max (capital dispo / limite LP). Affiche montant, % de part, indicateur de dilution (seuil ~15%).

### 3.5 Follow-on
Quand une ligne relève un tour : nouvelle carte (ancienne/nouvelle valo, ticket requis, réserve restante). Les signaux déjà révélés en due diligence s'affichent sur la carte. Actions : refuser / revoir la due diligence / suivre au ticket proposé. Refuser envoie un signal négatif au marché.

### 3.6 Crise macro
- Bandeau d'alerte, ciblage sur une ligne précise (zéro exposition = pas de scène, juste effet diffus).
- **Prédictibilité proportionnelle** : fiabilité de la "réaction attendue" dépend du nombre de signaux **équipe** déjà révélés.
- **4 options**, jamais de choix "sûr" :
  - *Soutenir en urgence* : coûte du capital de réserve, aide réellement si le fondateur est résilient.
  - *Laisser courir* : gratuit, risque assumé.
  - *Atterrissage en douceur* : sortie anticipée, capital partiellement récupéré, upside abandonné.
  - *Mobiliser son réseau* : coûte 1 bande passante, effet incertain.
- Après confirmation : panneau de résultat, puis bouton explicite pour continuer (jamais d'enchaînement automatique).

### 3.7 Méta-progression
Deux monnaies séparées :
- **Réputation** (lente, performance globale) → débloque du **contenu** (LPs, stades, archétypes rares).
- **Leçons apprises** (ponctuelles, exploits précis) → débloquent des **perks passifs**.
Chaque run débloque au moins une petite leçon ; la réputation avance proportionnellement à la vraie performance.

### 3.8 Clôture de run
TVPI/DPI final, détail des sorties par ligne, rapport aux LPs (citations référençant les engagements tenus/trahis), gains de méta-progression, bouton pour lancer le fonds suivant.

---

## 4. Archétypes de fondateurs (pôles, pas des cases fixes)

1. **Wunderkind du pedigree** — charisme + pedigree masquant un manque de conviction profonde.
2. **Bricoleur obsessionnel** — présentation maladroite, précision chirurgicale une fois creusé.
3. **Surfeur de hype** — croissance payée par ads, jamais de rétention prouvée.
4. **Vétérante du secteur** — sobre, marché de niche à TAM caché.
5. **Duo fondateur fracturé** — tout semble parfait, la fracture n'apparaît qu'à une question de friction précise.
6. **Le Rescapé** — second-time founder ; le twist se lit dans la réaction à une situation actuelle similaire à l'échec passé.
7. **Scientifique transfuge** — technique irréprochable, flou business ; signal clé = lucidité vs déni.
8. **Vendeur-né sans produit** — aplomb total, suspect par absence de doute légitime.
9. **Prophète de mission** — conviction personnelle confondue avec conviction business ; signal clé = alignement mission/modèle économique.

*Scope Phase 0 : 4-5 de ces archétypes.*

---

## 5. LPs (archétypes)

- **Business angel réseauté** (ex-fondateur exité) — petit ticket, bonus deal flow, challenge la compréhension du métier.
- **Family Office patient** — capital moyen, tolérant au risque, exige un accès en co-invest privilégié.
- **Fonds de pension conservateur** — gros ticket, limite stricte de risque.
- **Fonds de fonds opportuniste** — capital moyen, exige un rythme de déploiement rapide.
- **LP corporate/CVC** et **Endowment** — débloqués à réputation "GP confirmé", hors Phase 0.

*Scope Phase 0 : 2-3 de ces archétypes.*

---

## 6. Ressources et contraintes du joueur

- **Bande passante** : ressource par tour, limite le nombre de deals creusés en profondeur.
- **Capital** : contrainte dure sur ce qui peut être réellement signé.
- **Réserve follow-on** : mécanique non tranchée — fondue dans le capital général par défaut (voir §8.5).
- **Chrono** (cartes rapides uniquement) : 40s de base. Auto-pass au timeout.
- **Bande passante de scène** (attention) et **patience du fondateur** : ressources locales à une scène de dialogue.

---

## 7. Système visuel retenu

**Direction** : pixel/techwear industriel, fond gris sombre, cartes exclusivement grises, boutons rétro.

### 7.1 Typographies
- **Big Shoulders Display** (700/800/900) — titres, noms de startups/LPs, gros chiffres. Toujours en majuscules.
- **Press Start 2P** — petits accents pixel-art (logo, numéros de catalogue, labels de section). Jamais pour du texte long.
- **IBM Plex Mono** (400-700) — corps de texte, données, dialogue, labels de champs.

### 7.2 Couleurs
```
--bg:        #232320   (fond principal, gris sombre)
--grid-line: rgba(255,255,255,0.045)  (quadrillage discret en fond)
--stone:     #C7C4BA   (fond des cartes — SEULE couleur de carte)
--ink:       #141210   (texte sur fond clair)
--cream:     #F2EEE6   (texte sur fond sombre, fond des panneaux contrastés)
--mustard:   #EAAE47   (accent : boutons d'action principale, chrono)
--coral:     #E2694B   (accent bulletin — source réseaux sociaux)
--forest:    #465E49   (réservé aux bulles "joueur" en conversation)
--danger:    #C0392B   (alertes, crise, braconnage)
```
Texture : grain léger (SVG feTurbulence, opacité ~0.06, mix-blend overlay) + scanlines horizontales très fines (opacité ~0.35). Quadrillage de fond intégré au `body`.

### 7.3 Cartes
- Fond gris uniquement (`--stone`), coins arrondis (16px), bordure noire épaisse (2.5px), ombre portée franche décalée (`box-shadow: 6px 6px 0 rgba(0,0,0,0.45)`).
- Grille à hauteur égale obligatoire : `grid-auto-rows:1fr; align-items:stretch;` + `.card{height:100%; display:flex; flex-direction:column;}` + actions ancrées via `margin-top:auto`.
- Structure interne : catalogue index → nom → sous-titre → ligne de specs → tags de signaux → (code-barres optionnel) → actions.
- Carte de scène (pitch) : distinguée par un ruban diagonal "PITCH", pas par une couleur différente.

### 7.4 Boutons — un seul standard partout
```css
.btn{
  border-radius:10px;
  border:2.5px solid #0A0A09;
  box-shadow:4px 4px 0 rgba(0,0,0,0.4);
  transition:transform .08s ease, box-shadow .08s ease;
}
.btn:hover, .btn:active{ transform:translate(2px,2px); box-shadow:2px 2px 0 rgba(0,0,0,0.4); }
```
- Primaire : fond `--ink`, texte crème.
- Accent jaune (action mise en avant) : fond `--mustard`, bordure toujours noire, texte `--ink`.
- Ghost/secondaire : fond clair neutre, même bordure/ombre.
- Le CTA de fin de run ("Lancer le Fonds II") est le gabarit de référence.

### 7.5 Panneaux contrastés
Blocs d'information groupée (thèse, progression du fonds, bilan trimestre, actualités). Fond `--cream` ou `#EFC292` (actualités), même traitement bordure/ombre. Toujours précédés d'un label Press Start 2P + icône.

### 7.6 Icônes
Trait fin (stroke-width 2-2.4), taille généreuse (16-21px, jamais < 14px).

### 7.7 Chrono (cartes rapides)
Barre épaisse (8px) en haut de carte, noire par défaut, orange puis rouge selon le temps restant, légère lueur sur états d'alerte.

### 7.8 Braconnage (urgence perçue)
Aucun changement réel du temps restant. Effet visuel uniquement : bandeau rouge + bordure pulsante + secousse (0.4s). Le chrono continue à vitesse normale.

### 7.9 Bulletin "Actualités du trimestre"
*Retiré du scope Phase 0* mais design conservé si réintroduit : bandeau orangé, 3 items côte à côte, effet dépliable au clic.

### 7.10 Scènes de dialogue (fondateur et LP)
Modale à deux colonnes : sidebar `--forest`/crème (avatar, jauges, journal de signaux/engagements) + zone principale (fil de chat + menu). Bulles fondateur/LP en gris, joueur en vert.

### 7.11 Flash de valeur
Changement de ressource numérique : animation de contour des lettres (`-webkit-text-stroke` + `text-shadow`), rouge si baisse, vert si hausse, 8 pulsations de 0.5s.

---

## 8. Notes techniques non résolues (à trancher en codant)

1. **Écran de blocage mobile** : détection de largeur d'écran, message d'invitation desktop. Non implémenté.
2. **Onboarding progressif** : démo existante (coachmarks, spotlight) à reconstruire sur le template actuel.
3. **Persistance** : sauvegarde locale navigateur uniquement, pas de comptes, pas de multi-appareil.
4. **Collecte de données de test** : fil d'événements niveau 2 envoyé à la clôture ou via bouton d'abandon. Mécanisme d'envoi (destination, format) à définir.
5. **Réserve follow-on** : décider entre mise de côté explicite en phase LP ou fonte dans le capital général (option retenue par défaut faute de décision explicite).

---

## 9. Repoussé explicitement (V2 / extensions futures)

1. Champ libre pour interroger les fondateurs.
2. Signaux qui peuvent mentir activement (fraude découverte a posteriori).
3. Rumeurs / signaux avant-coureurs des chocs macro.
4. Conditions LP négociables.
5. IA générative pour les réactions du LP.
6. Type d'investissement / structure d'equity (preferred stocks, SAFE, liquidation preference).
7. Structure en actes, trimestres creux, système d'actualités à 3 sources.
8. Version mobile.

---

## 10. Stratégie de test

15-20 testeurs (réseau personnel + indie gamedev, fintwit francophone). Retours qualitatifs en direct + fil d'événements niveau 2. Aucune monétisation à ce stade — vient après validation (achat unique premium visé, 8-15€, pas de pub ni de micro-transactions).
