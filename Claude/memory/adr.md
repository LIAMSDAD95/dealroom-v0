# Registre — ADR (Architecture Decision Records)

> Consigne les décisions d'architecture structurantes et difficiles à revenir en arrière (choix de stack, découpage de domaines, format de sauvegarde, etc.). Plus formel que [decisions.md](./decisions.md), réservé aux choix qui engagent durablement la structure du code.

---

<!-- Format suggéré :
## ADR-001 — Titre
**Statut** : proposé / accepté / remplacé par ADR-XXX
**Contexte** : ...
**Décision** : ...
**Conséquences** : ...
-->

## ADR-001 — Stack technique : React + Vite + TypeScript + CSS Modules

**Statut** : accepté (2026-09-11), révisé le même jour (Tailwind → CSS Modules, voir "Révision" ci-dessous)

**Contexte** : DEALROOM a besoin d'un stack pour un jeu web desktop avec beaucoup de composants visuels réutilisables (cartes, boutons, panneaux, scènes de dialogue en modale) et un état de jeu complexe (ressources, run, portefeuille, cap table). Développeur de niveau intermédiaire en JS/HTML/CSS, développement solo avec Claude Code.

**Décision** :
- **React** comme framework de composants (plutôt que Vue ou vanilla JS) — écosystème le plus large, le plus de ressources d'apprentissage, et le mieux couvert par l'assistance Claude Code.
- **Vite** comme outil de build/dev server — démarrage rapide, hot reload, configuration minimale.
- **TypeScript** — utile dès que l'état de jeu se complexifie (ressources, signaux, archétypes), attrape des erreurs tôt.
- **CSS Modules + variables CSS natives** pour le système de design — un fichier `tokens.css` global déclare les custom properties (couleurs, tailles de bordure, etc. du product-spec §7), et chaque composant a son `.module.css` scopé avec ses classes (`.card`, `.btn`...).

**Conséquences** :
- Le squelette de code doit suivre les 5 domaines de [architecture.md](../../docs/architecture.md) : `src/game-loop/`, `src/signals-content/`, `src/ui/`, `src/persistence/`, `src/app/` (ou noms équivalents à stabiliser au premier commit de code).
- Nécessite Node.js installé en local pour lancer le projet (`npm install`, `npm run dev`).
- Les tokens visuels du product-spec (§7 : `--bg`, `--stone`, `--mustard`, etc., et les constantes de bordure/ombre) sont déclarés une fois dans `src/ui/tokens.css`, importé globalement — jamais redéfinis en dur dans un composant.
- Chaque composant partagé (carte, bouton, panneau, chrono) vit dans `src/ui/` avec son propre `.module.css` qui consomme les variables de `tokens.css`.

**Révision (2026-09-11)** : la décision initiale proposait Tailwind CSS. Remis en question par l'utilisateur : le système visuel de DEALROOM n'est pas fait de nombreux ajustements de spacing/layout variés (le terrain naturel de Tailwind) mais d'un petit nombre de patterns très spécifiques et récurrents à reproduire à l'identique (ombre portée franche non-floue à décalage fixe, bordure noire à 2.5px, triptyque de grille à hauteur égale, animation de flash en `text-stroke` à 8 pulsations, texture de grain SVG globale). Ces valeurs, exprimées en utilitaires Tailwind, nécessiteraient des valeurs arbitraires répétées à chaque usage — exactement la duplication que le design system cherche à éviter. Des variables CSS + classes composants centralisent ces patterns une seule fois. **À retenir** : pour un design system très normé avec peu de composants mais des règles pixel-perfect strictes, préférer CSS natif/Modules à un framework utilitaire.

## ADR-002 — Génération procédurale du deal flow à partir de banques de contenu

**Statut** : accepté (2026-09-19)

**Contexte** : `deal-flow.data.ts` ne contenait que 4 deals écrits en dur pour le Trimestre 1 — aucun mécanisme pour produire le deal flow des 7 trimestres suivants. Le product-spec §3.2 ne précise pas comment les deals sont produits à chaque tour, seulement leur nombre (3-6) et leur structure.

**Décision** :
- Remplacer les deals figés par des **banques de contenu réutilisables** : une banque de noms de startups/fondateurs par secteur+zone, et une banque de tags de signaux (structurel/équipe/trompeur) **par archétype fondateur** — chaque archétype garde sa cohérence narrative propre (product-spec §4), le générateur pioche dedans plutôt que d'inventer.
- Un **générateur** (Game Loop) compose 4 deals à chaque trimestre, en filtrant strictement sur la thèse du joueur (secteur(s) ET zone ET stade) — jamais de deal hors thèse en Phase 0 ; la mécanique de "déviation" (deal hors thèse, tension avec la confiance LP) reste une extension V2 possible.
- Exactement **1 des 4 deals** est marqué scène développée (`isDevelopedScene: true`) à chaque tour — pas de variabilité 0/2 pour l'instant.
- Nombre de deals par tour fixé à **4** (dans la fourchette 3-6 du spec) plutôt que variable, pour rester cohérent avec la bande passante de départ (4 points).

**Conséquences** :
- `src/signals-content/` gagne des banques de contenu (noms, pitchs, tags par archétype × famille de signal) — domaine Signals & Content, pur contenu sans logique de ressources.
- `src/game-loop/` gagne une fonction de génération (ex. `generateQuarterDeals(thesis, quarterNumber)`) qui compose ces banques selon la thèse — domaine Game Loop, dépend de l'état du run.
- `deal-flow.data.ts` (les 4 deals figés du Trimestre 1) devient soit un cas particulier du générateur, soit est remplacé entièrement — à trancher à l'implémentation.
- Le filtrage strict sur la thèse suppose une banque de contenu suffisamment fournie par combinaison secteur×zone pour ne jamais tomber à court de deals — à surveiller à mesure que le contenu grandit.
