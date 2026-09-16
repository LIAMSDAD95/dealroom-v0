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
