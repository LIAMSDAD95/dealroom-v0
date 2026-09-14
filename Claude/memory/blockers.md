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
