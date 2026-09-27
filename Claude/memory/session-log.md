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
