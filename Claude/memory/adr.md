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
