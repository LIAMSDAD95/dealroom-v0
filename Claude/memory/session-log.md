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

## [2026-09-27] Évolutions silencieuses + follow-on (lot 1 avant la clôture)

**Fait** : cadrage avec l'utilisateur à partir des maquettes `vc-techwear-endrun_1.html` et `vc-techwear-portfolio_3.html` (arbitrages dans decisions.md, même date). Construit : modèle de valorisation à destinée cachée, tick trimestriel (évolutions, fermetures, tours), cartes follow-on (suivre / refuser = dilution / revoir DD), écran `PortfolioScreen` en ouverture de trimestre, effet des crises sur la trajectoire des lignes, valeur estimée dans le panneau `P`.
**Vérifié** : typecheck + build OK ; 4 runs complets Q1→Q8 joués dans Chrome headless (script Puppeteer hors repo) — rapport sauté au Q2 si portefeuille vide, follow-on suivis/refusés/DD, crises (dont atterrissage → 0,4× réalisé), fermetures à 0×, clôture atteinte, 0 erreur console. Lint : 1 erreur préexistante dans `DealCard.tsx` (ref mise à jour pendant le render), non touchée.
**État laissé** : non commité.
**Prochaine étape suggérée** : lot 2 — dénouement accéléré au Q8, écran de clôture (§3.8), suivi des engagements LP pour les citations, persistance locale de la méta-progression (réputation + perks).

**Retours de test utilisateur (même session)** — corrigés et vérifiés en navigateur :
1. Pitch d'ouverture fondateur quasi identique d'un trimestre à l'autre : seulement 2 variantes par archétype. Passé à 4, et mémoire du run (`heardOpenings` dans `App`, même principe que `seenCompanyNames`) — 0 doublon sur 8 scènes, dont 3 fois le même archétype.
2. Carte follow-on : « révélés ci-dessous » → « ci-dessus » (les signaux sont au-dessus de la note).
3. Scène fondateur : l'encart « Entretien terminé » apparaissait pendant « Réfléchit… », dès que la dernière question vidait l'attention. Il attend maintenant la réponse (`interviewOver` exige `!thinking`).

## [2026-09-27] Lot 2 — écran de clôture et méta-progression

**Fait** : dénouement accéléré au Q8, écran de clôture d'après `vc-techwear-endrun_1.html` (TVPI/DPI, sorties par ligne reliées à la DD, rapport aux LPs avec citations sur engagements tenus/trahis, progression du GP), suivi des engagements LP, réputation + 4 leçons avec effets réels au fonds suivant, sauvegarde locale, bouton « Lancer le Fonds II » (LPs qui suivent engagés d'office). Arbitrages dans decisions.md.
**Vérifié** : typecheck + build OK ; 2 runs complets Q1→clôture→Fonds II dans Chrome headless (sauvegarde écrite, « FONDS II » affiché, LP qui suit engagé d'office) ; Fonds II avec sauvegarde préparée (angle Réseau ouvert, jauge de confiance à 50 %, signal équipe offert sur les cartes, LP qui revient engagé) ; 0 erreur console. Effets *Sang-froid* et *Discipline de réserve* vérifiés au typecheck et à la lecture, pas déclenchés en navigateur.
**État laissé** : lots 1 et 2 non commités.
**Prochaine étape suggérée** : playtest de la clôture ; mécanique de co-invest (sinon l'engagement du Family Office reste inévaluable) ; commit.

## [2026-09-27] Écran de blocage mobile + onboarding

**Fait** : lots 1-2 commités et poussés sur `main` (`ebbe603`). Puis écran de blocage mobile et onboarding par bulles (voir decisions.md, même date).
**Vérifié** : build OK. Chrome headless : téléphone et tablette tactile bloqués, desktop 1400 px non bloqué, fenêtre rétrécie puis ré-agrandie → partie conservée. Onboarding : 10 visites parcourues sur un run complet, toutes les bulles entièrement dans l'écran, chrono figé à 40 s pendant l'aide puis reprise, aide non réaffichée après rechargement, « Ne plus afficher » coupe tout ; 0 erreur console. Corrigé en route : bulle qui débordait (box-sizing), étape follow-on jamais vue (visite séparée).
**État laissé** : non commité.
**Ajout (2026-09-28)** : bouton « ? AIDE » flottant qui rejoue la visite de l'écran en cours (voir decisions.md). Vérifié en navigateur sur thèse, levée, pitch LP, deal flow (chrono figé) et entretien fondateur, y compris après « Ne plus afficher l'aide » ; 0 erreur console.

## [2026-09-29] Logo pixel + curseur de ticket

**Fait** : réponses VO anglaise / mode clair (écartés, voir decisions.md) ; logo en police pixel sur tous les écrans ; curseur de ticket en fin d'entretien fondateur avec part et jauge de dilution.
**Vérifié** : build OK ; en navigateur, curseur 80K→240K (15,0 % au max), montant choisi repris sur la carte, le header et le panneau P ; run complet jusqu'au Fonds II sans erreur.
**Chronos en pause pendant l'entretien fondateur** (décision utilisateur) : vérifié en navigateur — 39 s figées pendant 4 s d'entretien, reprise à la fermeture.
**État laissé** : non commité.
**Prochaine étape** : collecte des données de playtest (§8.4) puis mécanique de co-invest.
**Retour de playtest (2026-09-29)** : 3 alertes identiques dans un run → 7 alertes ajoutées + mémoire du run (voir decisions.md). 0 répétition sur 20 000 runs simulés ; 2 runs complets en navigateur sans erreur.

## [2026-09-29] Fin de session — collecte des données de playtest (§8.4) en cours de cadrage

**État** : tout est commité et poussé (`e4447c5` sur `main`), sauf cette entrée de journal.
**En discussion, rien de codé** :
- Destination retenue en principe : **Supabase** (l'utilisateur a déjà un compte), plutôt que Google Sheets (confirmation d'envoi non garantie). Pause des projets gratuits après 7 jours d'inactivité → prévu : file d'attente locale des runs non envoyés + renvoi à la visite suivante, relance manuelle avant chaque vague de testeurs ou ping hebdo via GitHub Actions, et bouton « Copier mon rapport de run » en dernier recours.
- Sécurité : seule la clé `anon` dans le jeu, règles « ajout seulement » ; jamais la clé `service_role`.
- Contenu : fil d'événements niveau 2 = décisions de jeu (creuser, investir + montant/part, follow-on, crises, abandon, clôture), pas de tracking de clics.
**Tranché** : **oui** au pseudo facultatif (demandé une fois au lancement) + identifiant aléatoire par navigateur, pour relier un run à un testeur et suivre Fonds I → Fonds II.
**Hébergement** : probablement **Vercel**.
**À faire** : proposer la phrase qui prévient les testeurs de l'enregistrement — Claude la propose (placement suggéré : sur l'écran du pseudo, au lancement).
**Prochaine étape** : préparer le script SQL (table + RLS insert-only), l'utilisateur crée le projet et fournit URL + clé anon ; puis coder l'enregistrement. Ensuite : mécanique de co-invest.

## [2026-10-03] Pseudo + mention de collecte

**Fait** : champ pseudo facultatif sur l'écran de thèse, identifiant aléatoire par navigateur, mention de collecte en fin de page. Vérifié en navigateur (identifiant créé au lancement, pseudo nettoyé et sauvegardé à la validation, prérempli et même identifiant après rechargement ; visite guidée de la thèse intacte) ; build OK. Non commité.
**Attention** : la mention annonce un enregistrement qui n'est pas encore branché — à finir (Supabase) avant d'envoyer le jeu aux testeurs.
**Ajout (2026-10-03)** : carte PITCH en orange, première alerte forcée au Q3 puis aléatoire, « VOTRE DÉCISION » agrandi (voir decisions.md). Vérifié : 3 runs sur 3 avec une alerte au Q3, 2 sur 3 au Q4 ; captures OK ; build OK. Non commité (avec le pseudo).
**Ajout (2026-10-03)** : bandeau PITCH seul en couleur (carte au contour standard) ; playtest limité à deux fonds avec écran de fin (voir decisions.md). Vérifié : Fonds I → « LANCER LE FONDS II », Fonds II → « TERMINER LE PLAYTEST » → écran de fin, qui reste affiché après rechargement ; 0 erreur. Non commité.
