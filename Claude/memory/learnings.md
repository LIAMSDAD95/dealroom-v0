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

## [2026-09-15] key React sur composant à état réutilisé (lié à blockers.md#2e-scene-pitch)

**Cause racine** : sans `key` unique, React considère `<PitchScene>` comme la « même » instance d'un rendu à l'autre tant que sa position dans l'arbre ne change pas — même si les `props` (`offer`, `archetype`) changent. Les `useState` internes (session, questions déjà répondues, résultat déjà affiché) ne se réinitialisent donc pas : la scène rouverte reste bloquée dans l'état final du LP précédent (ex. déjà "terminé"), ce qui empêche toute nouvelle interaction visible.
**Solution** : ajouter `key={pitchingOffer.id}` sur `<PitchScene>` dans `FundraisingScreen.tsx` — la clé change à chaque nouveau LP, donc React démonte l'ancienne instance et en monte une neuve avec un état vierge.
**À retenir pour la suite** : tout composant à état interne rendu conditionnellement pour représenter « une session sur une entité différente » (ici : une session de pitch par LP) doit recevoir une `key` dérivée de l'identité de cette entité — pas seulement quand il est dans une liste `.map()`, la règle s'applique aussi à un rendu conditionnel unique.

## [2026-09-15] Crash silencieux sur tableau vide non gardé (lié à blockers.md#ecran-noir-2e-lp)

**Cause racine** : `pitchQuestionsByOfferId[offer.id] ?? []` retourne un tableau vide pour les LPs sans contenu scripté (Family Office R., Fonds pension B.), mais `askQuestion(0)` faisait `questions[0].text` sans vérifier que l'élément existe — `questions[0]` vaut `undefined` sur un tableau vide, donc `.text` lève une `TypeError` non catchée. Sans error boundary React, l'erreur fait planter tout l'arbre de rendu → page qui devient noire (le fond `--bg` sombre reste visible, rien d'autre).
**Solution** : `askQuestion` retourne tôt si `questions[index]` est `undefined` ; `chooseAngle` détecte `questions.length === 0` et va directement au résultat avec la confiance de départ, au lieu d'essayer de poser une question inexistante.
**À retenir pour la suite** : toute donnée de contenu indexée par id (ici `pitchQuestionsByOfferId`) doit être traitée comme potentiellement absente pour certaines clés tant que le contenu n'est pas complet à 100% — garder l'accès (`questions[i]`) plutôt que supposer sa présence, surtout dans un `setTimeout` où TypeScript ne peut pas prévenir à la compilation.

## [2026-09-15] État dérivé fragile vs état explicite (lié à blockers.md#conversation-disparait)

**Cause racine** : deux bugs cumulés dans `PitchScene.tsx`. (1) `answer()` mettait à jour `qIndex` vers la question suivante mais n'appelait jamais `askQuestion(nextIndex)` pour réellement poser cette question suivante (déclencher le thinking, l'ajouter au thread) — seul le cas "dernière question" relançait un timer, vers le résultat. (2) La condition d'affichage des options (`thread.length > qIndex`) dérivait un état ("la question courante a-t-elle été posée") d'un tableau qui mélange messages LP et joueur, donc dont la longueur ne correspond pas de façon fiable à l'étape de la conversation.
**Solution** : `answer()` appelle maintenant explicitement `askQuestion(nextIndex)` quand il reste des questions. Un state dédié `currentQuestionAsked` (mis à `true` seulement quand la bulle LP de la question courante est effectivement ajoutée au thread) remplace la condition dérivée `thread.length > qIndex` pour décider d'afficher les options de réponse.
**À retenir pour la suite** : pour une séquence "poser question → attendre réponse → poser suivante", préférer un state booléen explicite nommé pour l'état d'avancement plutôt que de le déduire d'un autre state dont la sémantique est différente (ici : compter *tous* les messages d'un chat pour en déduire l'étape d'une boucle de questions). Une dérivation qui marche par coïncidence sur le premier cas (première question) casse dès que la boucle continue.
