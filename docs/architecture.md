# Architecture — DEALROOM

> Découpe le projet en domaines séparés. Chaque domaine est un espace de responsabilité, pas nécessairement un dossier unique — à faire correspondre à la structure de code réelle au fur et à mesure qu'elle se stabilise.

---

## Vue d'ensemble

Le jeu tourne intégralement côté client (web desktop, sauvegarde locale navigateur, pas de backend serveur en Phase 0), sur une stack **React + Vite + TypeScript + CSS Modules** (voir [ADR-001](../Claude/memory/adr.md)). Cinq domaines se partagent la logique et l'état :

```
┌─────────────────────┐     ┌──────────────────────┐
│   Game Loop &        │◄───►│  Signals & Content    │
│   State Machine       │     │  (archétypes, dialogue)│
└──────────┬───────────┘     └──────────┬────────────┘
           │                            │
           ▼                            ▼
┌─────────────────────┐     ┌──────────────────────┐
│   UI / Visual System  │     │  Persistence & Test   │
│   (composants, thème) │     │  Data (save, télémétrie)│
└──────────┬───────────┘     └──────────────────────┘
           │
           ▼
┌─────────────────────┐
│  Technical / App State │
│  (routing, config, build)│
└─────────────────────┘
```

---

## 1. Game Loop & State Machine

**Responsabilité** : orchestrer la boucle centrale — phase de levée de fonds, boucle de tour (trimestre), transitions entre deal flow / scènes développées / événements macro / non-macro, clôture de run, méta-progression entre runs.

**Contient** :
- La machine à états du run (8 trimestres, structure à plat).
- Les règles de ressources : bande passante, capital, réserve follow-on, chrono.
- Les règles de résolution : follow-on (§3.5 du product-spec), crise macro (§3.6), clôture (§3.8).

**Ne contient pas** : le contenu des dialogues ni les archétypes eux-mêmes (délégué à Signals & Content), ni le rendu visuel (délégué à UI/Visual).

**Interfaces** : consomme les définitions d'archétypes/LPs et les arbres de dialogue depuis Signals & Content ; expose l'état du run à UI/Visual ; émet les événements de jeu vers Persistence & Test Data (fil d'événements niveau 2).

---

## 2. Signals & Content

**Responsabilité** : tout ce qui définit le contenu narratif et le système de signaux — archétypes de fondateurs, archétypes de LPs, questions pré-écrites, tons de réponses, mapping signal → archétype, règles anti-par-cœur (densité de bluff, contre-exemples).

**Contient** :
- Les données des 9 archétypes fondateurs et 6 archétypes LPs (product-spec §4-5), avec sélection du sous-ensemble actif en Phase 0 (4-5 fondateurs, 2-3 LPs).
- Les arbres de questions/réponses pour les scènes de dialogue (fondateur et LP).
- La logique de classification des signaux (structurel / équipe / trompeur) et leur affichage (tags, jamais de score agrégé).

**Ne contient pas** : la mécanique de ressources (attention/patience) qui consomme ce contenu — c'est Game Loop qui gère le coût, Signals & Content ne fait que définir quelle question révèle quel signal.

**Interfaces** : fournit à Game Loop les définitions consultables par la machine à états ; fournit à UI/Visual les textes et tags à afficher.

---

## 3. UI / Visual System

**Responsabilité** : le système de design pixel/techwear (product-spec §7) — typographies, couleurs, composants (cartes, boutons, panneaux contrastés), animations (chrono, braconnage, flash de valeur), scènes de dialogue en deux colonnes.

**Contient** :
- Les tokens visuels (couleurs, typographies) comme source unique de vérité.
- Les composants réutilisables : carte à hauteur égale, bouton standard, panneau contrasté, barre de chrono.
- Les animations spécifiées (braconnage, flash de valeur, indicateur de frappe).

**Ne contient pas** : la logique métier — un composant carte ne décide pas si un deal est valide, il affiche l'état qu'on lui passe.

**Interfaces** : consomme l'état exposé par Game Loop et le contenu de Signals & Content ; ne modifie jamais l'état directement (remonte les actions joueur vers Game Loop).

---

## 4. Persistence & Test Data

**Responsabilité** : sauvegarde locale du run (reprise sur le même appareil/navigateur) et fil d'événements niveau 2 (télémétrie qualitative de playtest).

**Contient** :
- Sérialisation/désérialisation de l'état de run pour le stockage navigateur.
- Le journal d'actions joueur, envoyé à la clôture du run ou via bouton d'abandon.
- Le mécanisme d'envoi (destination et format restent à trancher, voir product-spec §8.4).

**Ne contient pas** : de compte joueur ni de sync multi-appareil (hors scope Phase 0).

**Interfaces** : écoute les événements émis par Game Loop ; expose une fonction de restauration d'état au démarrage.

---

## 5. Technical / App State

**Responsabilité** : tout ce qui n'est pas spécifique au jeu lui-même — bootstrap de l'application, configuration de build, détection d'environnement (ex. largeur d'écran pour un futur écran de blocage mobile), gestion des assets (polices, textures).

**Contient** :
- Point d'entrée de l'application.
- Configuration de build/dev.
- Chargement des assets (grain SVG, scanlines, polices Big Shoulders / Press Start 2P / IBM Plex Mono).

**Interfaces** : initialise les quatre autres domaines au démarrage ; ne porte aucune règle de jeu.

---

## Notes d'évolution

Ce découpage en 5 domaines correspond à la Phase 0. Si un domaine grossit significativement (ex. Signals & Content avec l'ajout d'archétypes en V2, ou l'introduction d'un vrai backend pour la télémétrie), envisager de le splitter à ce moment — pas avant, pour éviter la sur-architecture prématurée.
