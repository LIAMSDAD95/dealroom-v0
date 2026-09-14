# Registre — Apprentissages

> Consigne la solution une fois qu'un blocage listé dans [blockers.md](./blockers.md) est résolu — le "comment on l'a réglé" et surtout "pourquoi ça a marché", pour ne pas retomber dans le même piège.

---

<!-- Format suggéré :
## [AAAA-MM-JJ] Titre court (lié à blockers.md#titre)
**Cause racine** : ...
**Solution** : ...
**À retenir pour la suite** : ...
-->

## [2026-09-14] Import @fontsource sans extension .css (lié à blockers.md#import-fontsource)

**Cause racine** : le `package.json` des packages `@fontsource/*` déclare un champ `"exports"` du type `"./*": {"default": "./*.css"}` — le `.css` final est déjà ajouté par le mapping. Importer `@fontsource/pkg/700.css` fait donc chercher le fichier `700.css.css`, qui n'existe pas.
**Solution** : importer le sous-chemin **sans** l'extension : `import '@fontsource/big-shoulders-display/700'` (pas `/700.css`). Vérifié avec `node -e "require.resolve('@fontsource/.../700')"` avant de corriger `src/main.tsx`.
**À retenir pour la suite** : pour tout nouveau package avec des sous-exports (`"./*"` dans `exports`), vérifier le mapping exact dans son `package.json` plutôt que de deviner le chemin d'import par analogie avec le nom de fichier réel sur disque.
