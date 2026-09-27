# Registre — Journal de session

> Consigne, à chaque session de travail significative, un résumé bref de ce qui a été fait et de l'état dans lequel le projet est laissé — pour reprendre rapidement le fil d'une session à l'autre.

---

<!-- Format suggéré :
## [AAAA-MM-JJ] Résumé de session
**Fait** : ...
**État laissé** : ...
**Prochaine étape suggérée** : ...
-->

## [2026-09-24] Scène de crise, correction du deal flow, récap de portefeuille

**Fait** :
1. **Scène de crise macro (product-spec §3.6)** — `CrisisScene` construite d'après la maquette `vc-techwear-crisis_7.html` (titre « ALERTE TRIMESTRIELLE », bandeau rouge, sidebar avec jauge « réaction attendue », fil de discussion, 4 décisions, panneau de résultat). Logique dans `crisis.ts` + contenu dans `crisis-events.ts` (5 événements). Déclenchement aléatoire à partir du Q4 uniquement, et seulement avec au moins une ligne active.
2. **Portefeuille câblé** — `portfolio.ts` : chaque investissement crée une `PortfolioLine` qui retient les signaux équipe connus au moment de décider (c'est ce qui rend la prédiction de crise fiable ou non).
3. **Bug corrigé : startup qui revenait d'un trimestre à l'autre** — mesuré à 100% des runs avant correction. Mémoire du run + banques portées à 16 profils minimum par secteur. Vérifié à 0% sur toutes les paires et triplettes de secteurs.
4. **Bug corrigé : serveur de dev qui redémarrait seul** — cause iCloud (voir learnings.md). `server.watch.ignored` par chemin absolu + `usePolling`.
5. **Récap de portefeuille** — panneau latéral ouvert depuis un bouton du header (raccourci `P`, fermeture Échap/croix/clic extérieur), visible à partir du deal flow.

**État laissé** : typecheck propre, build de production OK, serveur vérifié (HTTP 200, 0 redémarrage intempestif). **Rien n'est encore commité** — 12 fichiers modifiés et 7 nouveaux dans l'arbre de travail.

**Prochaine étape suggérée** : commiter le travail de la session, puis l'écran de clôture de run (§3.8) — en attente des 2 maquettes annoncées par l'utilisateur. Autres chantiers ouverts : cap table + curseur de ticket ajustable en scène fondateur (§3.4, reportés), mécanique d'évolution de portefeuille (§3.2 « évolutions silencieuses »), follow-on (§3.5), écran de blocage mobile et onboarding progressif (objectifs Phase 0).

## [2026-09-27] Déplacement du projet hors d'iCloud

**Fait** : le projet a été déplacé de `~/Documents/Documents - MacBook Air de Ines/JeanYvFiles/ClaudeCodeTest/VC Simulator Short` vers **`~/Developer/dealroom`**, hors du périmètre de synchronisation iCloud, et `node_modules` a été reconstruit. Le contournement iCloud dans `vite.config.ts` (`server.watch.ignored` + `usePolling`) a été retiré : il n'a plus de raison d'être, et `usePolling` ralentissait le watcher inutilement. `learnings.md` mis à jour en conséquence.

**Pourquoi** : `~/Documents` est synchronisé par iCloud sur macOS. Les 6 244 fichiers de `node_modules` étaient resynchronisés en permanence, iCloud touchait les fichiers de config (d'où les redémarrages du serveur de dev), les builds duraient 1m33s, et `.git/` risquait des fichiers en conflit — la cause commune derrière plusieurs symptômes étalés sur des sessions (`fatal: .git/index.lock: Operation timed out`, builds lents, redémarrages intempestifs).

**État laissé** : projet fonctionnel au nouveau chemin, serveur de dev démarré et vérifié. **Attention — à faire au prochain démarrage** : le retrait du contournement dans `vite.config.ts` et les mises à jour de registres ne sont **pas encore commités**, et le commit `8ee0ba9` de la session précédente n'était pas encore poussé sur GitHub au moment du déplacement — vérifier `git status` et `git log origin/main..HEAD`.

**Prochaine étape suggérée** : inchangée — écran de clôture de run (§3.8), en attente des maquettes.
