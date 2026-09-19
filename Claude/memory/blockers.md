# Registre — Blocages

> Consigne chaque bug ou obstacle rencontré au moment où il bloque le travail. Dès que la solution est trouvée, la documenter dans [learnings.md](./learnings.md) et marquer l'entrée ici comme résolue (ne pas supprimer l'entrée — elle garde la trace du diagnostic).

---

<!-- Format suggéré :
## [AAAA-MM-JJ] Titre court du blocage
**Statut** : ouvert / résolu (voir learnings.md#lien)
**Domaine concerné** : (voir docs/architecture.md)
**Symptôme** : ...
**Contexte** : ...
-->

## [2026-09-14] Import @fontsource échoue avec extension .css

**Statut** : résolu (voir [learnings.md#2026-09-14-import-fontsource-sans-extension-css](./learnings.md))
**Domaine concerné** : UI / Visual System
**Symptôme** : Vite renvoie `[plugin:vite:import-analysis] Failed to resolve import "@fontsource/big-shoulders-display/700.css" from "src/main.tsx". Does the file exist?` alors que le fichier existe bien sur le disque dans `node_modules`.
**Contexte** : mise en place des polices du product-spec §7.1 via les packages `@fontsource/*`, importées en TypeScript dans `src/main.tsx`.

## [2026-09-15] 2e scène de pitch LP ne s'ouvre pas

**Statut** : résolu (voir [learnings.md#2026-09-15-key-react-sur-composant-a-etat-reutilise](./learnings.md))
**Domaine concerné** : UI / Visual System (`src/ui/PitchScene.tsx`, `FundraisingScreen.tsx`)
**Symptôme** : après avoir engagé un premier LP via la scène de pitch, cliquer « Pitcher » sur un second LP n'ouvre rien (aucune modale visible).
**Contexte** : `FundraisingScreen` rend `<PitchScene>` conditionnellement (`{pitchingOffer && pitchingArchetype && <PitchScene .../>}`) sans `key` distinctive par offre.

## [2026-09-15] Écran noir en pitchant un 2e LP (après le fix de key)

**Statut** : résolu (voir [learnings.md#2026-09-15-crash-silencieux-sur-tableau-vide-non-garde](./learnings.md))
**Domaine concerné** : UI / Visual System (`src/ui/PitchScene.tsx`)
**Symptôme** : après avoir ajouté la `key` sur `<PitchScene>`, choisir un angle pour un LP sans questions scriptées (Family Office R., Fonds pension B.) fait passer toute la page en écran noir.
**Contexte** : `pitchQuestionsByOfferId` n'a du contenu que pour 2 des 4 offres disponibles ; `askQuestion(0)` accédait à `questions[0].text` sans vérifier que `questions[0]` existe.

## [2026-09-15] Conversation de pitch disparaît après la 1ère réponse

**Statut** : résolu (voir [learnings.md#2026-09-15-etat-derive-fragile-vs-etat-explicite](./learnings.md))
**Domaine concerné** : UI / Visual System (`src/ui/PitchScene.tsx`)
**Symptôme** : en pitchant un LP avec plusieurs questions (Northbridge, Yann Fontaine), après avoir répondu à la 1ère question, plus aucune bulle ni option ne s'affiche — directement le bouton « Valider l'engagement » sans le reste de la conversation.
**Contexte** : `answer()` ne relançait jamais `askQuestion(nextIndex)` pour la question suivante quand il en restait, et la condition d'affichage `thread.length > qIndex` était ambiguë (thread contient les messages LP ET joueur, sa longueur ne reflète pas fidèlement l'étape courante).
**Note post-mortem** : une partie des rapports "toujours pas de conversation" qui ont suivi ce fix venait en fait de tests sur Family Office R. / Fonds pension B., qui n'ont volontairement aucun contenu de questions (voir decisions.md "2e question ajoutée pour le pitch Yann Fontaine") — pas un bug. Plusieurs allers-retours inutiles auraient été évités en précisant explicitement, à chaque demande de vérification, sur quel LP tester et pourquoi. À appliquer systématiquement pour la suite (voir CLAUDE.md, feedback utilisateur du 2026-09-16).

## [2026-09-16] Cartes LP verrouillées (5, 6) chevauchent les cartes 1, 2

**Statut** : résolu (voir [learnings.md#2026-09-16-height-100-vs-align-items-stretch-en-grid](./learnings.md))
**Domaine concerné** : UI / Visual System (`src/ui/LpCard.module.css`)
**Symptôme** : sur la grille de cartes LP (4 disponibles + 2 verrouillées, en 2 lignes), la 2e ligne (cartes verrouillées) remonte et recouvre le bas de la 1ère ligne — le bouton « Pitcher » des cartes 1 et 2 est partiellement caché sous les cartes 05/06.
**Contexte** : `.grid` avait `grid-auto-rows: 1fr`. Un premier correctif (passage à `grid-auto-rows: auto`) n'a PAS résolu le bug malgré une hypothèse initialement plausible — la vraie cause était ailleurs (voir learnings.md).

## [2026-09-19] Noms de startup dupliqués dans le deal flow généré

**Statut** : résolu (voir learnings.md)
**Domaine concerné** : Game Loop (`src/game-loop/deal-generator.ts`)
**Symptôme** : avec une thèse à un seul secteur (ex. Fintech), le deal flow généré affiche 2 cartes "LEDGERBASE" et 2 cartes "NORTHCOIN" identiques côte à côte.
**Contexte** : le générateur piochait chaque profil de startup indépendamment (`pickRandom` par carte, sans exclusion) — avec seulement 3 profils disponibles pour 4 tirages, une collision était statistiquement quasi certaine (paradoxe des anniversaires).

## [2026-09-19] Montants identiques et trop élevés sur les 4 cartes deal flow

**Statut** : résolu — voir `src/game-loop/deal.ts` (`askAmount`), `deal-generator.ts` (`generateAskAmount`).
**Domaine concerné** : Game Loop
**Symptôme** : les 4 cartes du deal flow affichaient exactement le même montant recherché, souvent supérieur au capital réellement levé — rendant l'investissement impossible sur toutes les cartes du tour.
**Contexte** : le montant venait de `fixedTicketForStage(deal.stage)`, qui ne dépend que du stade — or la thèse impose un seul stade pour tout le run (§3.1.1), donc les 4 deals générés partagent toujours le même stade. Les montants de base (100k/250k/600k) n'avaient pas non plus été vérifiés contre les fourchettes réelles des LPs Phase 0 (le plus petit LP, Yann Fontaine, ne propose que 100k-250k€).

## [2026-09-19] Creuser une carte deal flow ne révèle aucune information

**Statut** : résolu — voir `src/ui/DealFlowScreen.tsx` et `DealCard.tsx`.
**Domaine concerné** : UI / Visual System
**Symptôme** : cliquer « Creuser » sur une carte deal flow fait bien apparaître le bouton « Investir » et décrémente la bande passante, mais les tags marqués `locked` (signaux équipe/trompeurs) restent affichés comme non révélés — alors que "creuser" est censé révéler ces signaux (product-spec §3.2).
**Contexte** : `handleDig` dans `DealFlowScreen` ne mettait à jour que `statuses` (état de la carte), jamais un état de révélation des tags — `DealCard` affichait directement `deal.tags` (donnée statique) sans tenir compte du fait que le deal avait été creusé.
