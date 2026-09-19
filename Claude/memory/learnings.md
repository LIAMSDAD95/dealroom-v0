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

## [2026-09-16] height:100% vs align-items:stretch en grid (lié à blockers.md#cartes-lp-verrouillees-chevauchent)

**Cause racine** : `.card` avait `height: 100%` en plus du `align-items: stretch` déjà posé sur `.grid` (parent). Avec `grid-auto-rows: auto` et des cartes de hauteur de contenu naturelle différente entre les deux lignes (4 cartes actives avec bouton + contraintes, 2 cartes verrouillées plus courtes), la combinaison `height:100%` + `align-items:stretch` crée une dépendance circulaire dans le calcul de hauteur de ligne côté navigateur — la ligne 2 (verrouillées) se voit allouer une hauteur qui empiète sur la ligne 1. **Premier correctif tenté et insuffisant** : passer `grid-auto-rows` de `1fr` à `auto` n'a rien changé — vérifié en confirmant via `curl` que le CSS corrigé était bien servi par Vite, puis en reproduisant le bug dans un fichier HTML statique isolé (sans React) avec exactement les mêmes règles CSS : le chevauchement persistait avec `height:100%`, et disparaissait dès sa suppression.
**Solution** : retirer `height: 100%` de `.card` dans `LpCard.module.css`. `align-items: stretch` sur le `.grid` parent suffit seul à étirer chaque carte à la hauteur de la ligne — le `height:100%` explicite sur l'enfant était redondant et cassait le calcul.
**À retenir pour la suite** : ne jamais poser `height: 100%` sur un enfant direct d'une grille qui utilise déjà `align-items: stretch` (le comportement stretch par défaut de CSS Grid fait déjà le travail). Quand un correctif CSS plausible ne change rien à l'observable, ne pas empiler d'hypothèses successives sur le même fichier — reproduire le bug dans un fichier HTML minimal isolé (sans framework) permet de confirmer si la cause est vraiment dans le CSS incriminé avant de continuer à deviner.

## [2026-09-16] grid-auto-rows: 1fr vs auto (lié à blockers.md#cartes-lp-verrouillees-chevauchent)

**Cause racine** : `grid-auto-rows: 1fr` répartit la hauteur du conteneur de grille en fractions égales entre les lignes générées automatiquement — au lieu de laisser chaque ligne prendre la hauteur de son propre contenu. Avec 6 cartes sur 4 colonnes (donc 2 lignes), et des cartes de hauteurs naturelles différentes (verrouillées plus courtes, actives avec bouton en bas), la 2e ligne se voyait allouer une hauteur calculée à partir du conteneur entier plutôt que de son propre contenu, ce qui la faisait remonter dans l'espace de la 1ère ligne.
**Solution** : remplacer par `grid-auto-rows: auto` dans `.grid` (`src/ui/FundraisingScreen.module.css`) — chaque ligne de la grille prend sa hauteur naturelle, `gap` sépare correctement les lignes.
**À retenir pour la suite** : `grid-auto-rows: 1fr` est utile seulement quand on veut délibérément forcer toutes les lignes générées à occuper une part égale de la hauteur totale du conteneur (rare, et seulement si le conteneur a une hauteur contrainte). Pour une grille de cartes de contenu variable, `auto` est le choix par défaut sûr — le triptyque "hauteur égale" du product-spec (§7.3 : `align-items:stretch` + `.card{height:100%}` + `margin-top:auto` sur le CTA) suffit déjà à uniformiser la hauteur *à l'intérieur* d'une même ligne, sans qu'il soit nécessaire de forcer les lignes elles-mêmes en fractions égales du conteneur.

## [2026-09-19] Piocher sans répétition plutôt que sans exclusion (lié à blockers.md#noms-dupliques)

**Cause racine** : `pickRandom` était appelé indépendamment pour chaque carte du deal flow, sans retirer le profil déjà choisi de la banque disponible — statistiquement, avec 4 tirages indépendants parmi seulement 3 profils (secteur unique dans la thèse), une collision est presque garantie.
**Solution** : deux changements complémentaires. (1) `pickManyNoRepeat` remplace les tirages indépendants — mélange la banque une fois, distribue sans répétition tant qu'il y a assez d'éléments, ne recommence à répéter qu'en dernier recours si la banque est plus petite que le nombre demandé. (2) Chaque banque `company-names.ts` par secteur est passée à 5-6 profils (au lieu de 3-4), pour que même une thèse à un seul secteur puisse générer 4 deals sans jamais recourir à la répétition.
**À retenir pour la suite** : pour toute génération procédurale de N éléments visibles simultanément (cartes, options, tirages), ne jamais piocher chaque élément indépendamment dans la même banque — utiliser un tirage sans remise, et dimensionner la banque source à au moins N éléments pour le cas d'usage le plus contraint (ici : thèse à un seul secteur).

## [2026-09-19] Séparer l'état "révélé" de la donnée statique du deal (lié à blockers.md#creuser-ne-revele-rien)

**Cause racine** : `DealCard` affichait `deal.tags` directement — une donnée statique venant de `deal-flow.data.ts`, jamais mise à jour par les actions du joueur. Cliquer « Creuser » changeait bien le `status` de la carte (`pending` → `dug`) dans `DealFlowScreen`, mais rien ne reliait cette action à l'affichage des tags eux-mêmes.
**Solution** : `DealFlowScreen` garde un `Set<string>` des ids de deals creusés (`digDealIds`), passé à `DealCard` via une prop `signalsRevealed`. `DealCard` calcule `displayedTags` en dérivant une copie de `deal.tags` avec tous les statuts forcés à `'revealed'` si `signalsRevealed` est vrai, sans jamais muter `deal.tags` lui-même.
**À retenir pour la suite** : une donnée de contenu statique (deal, archétype, offre LP) ne doit jamais être affichée telle quelle quand elle a des champs qui doivent changer selon l'action du joueur — toujours dériver un état d'affichage séparé à partir d'un state géré par l'écran parent, jamais muter ou étendre silencieusement la donnée source.
