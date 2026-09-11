# PRD — DEALROOM

> Préremplit à partir de la lecture de `dealroom-design-doc.md`. À affiner au fil du développement — ce document doit rester vivant, pas figé.

---

## 1. Quoi / Pourquoi / Pour qui

**Quoi** : DEALROOM est un jeu roguelike de simulation de venture capital où le joueur incarne un General Partner (GP). Chaque run représente un fonds : levée auprès de LPs, instruction d'un deal flow de startups, gestion de portefeuille, encaissement d'événements de marché, clôture et méta-progression vers le fonds suivant.

**Pourquoi** : faire vivre au joueur la logique contre-intuitive du VC — le but n'est pas d'éviter le risque mais de repérer les *fund-returners* (loi de puissance). Le système de signaux récompense la conviction informée plutôt que la prudence systématique.

**Pour qui** : dans un premier temps, 15-20 playtesteurs recrutés via réseau personnel et communautés ciblées (indie gamedev, fintwit francophone). À terme, un public plus large intéressé par les jeux de simulation/stratégie avec une forte identité narrative et un thème startup/VC, via achat unique premium (8-15€).

---

## 2. Type de projet

Jeu web desktop (navigateur uniquement, pas de version mobile en Phase 0), développé en solo avec Claude Code, sur un horizon de 1-2 mois, sans budget marketing engagé. Statut actuel : sortie de prototype, entrée en développement du build de playtest fermé (Phase 0).

---

## 3. Objectifs de la Phase 0

- Valider que la boucle centrale (lever → instruire → décider → gérer → clôturer) est comprise et engageante sur un run de 8 trimestres.
- Valider que le système de signaux (structurel / équipe / trompeur) produit une vraie courbe d'apprentissage sans être mémorisable par cœur.
- Collecter des retours qualitatifs exploitables (échanges directs + fil d'événements niveau 2) pour prioriser la V2.
- Ne pas chercher la monétisation ni l'acquisition à ce stade.
- Détecter l'accès mobile et afficher un écran de blocage invitant à repasser sur desktop (le jeu lui-même reste desktop-only, voir §2 — il ne s'agit pas de rendre le jeu jouable sur mobile).
- Offrir un onboarding progressif aux nouveaux testeurs (reconstruit sur le template visuel pixel/gris actuel, à partir de la démo existante — voir §8 de [product-spec.md](./product-spec.md)).

## 4. Non-objectifs de la Phase 0

- Pas de version mobile jouable (web ou native) — le jeu reste desktop-only ; seul un écran de blocage détecte et redirige l'accès mobile (voir §3).
- Pas de structure en actes / trimestres creux.
- Pas de système d'actualités à 3 sources (le "Bulletin" visuel reste en prototype).
- Pas de remontée d'erreurs techniques automatisée — les bugs remontent par échange direct avec les testeurs.

---

## 5. Périmètre fonctionnel (Phase 0)

| Bloc | Contenu retenu |
|---|---|
| Run | 8 trimestres, structure à plat |
| Fondateurs | 4-5 archétypes sur les 9 documentés |
| LPs | 2-3 archétypes sur les 6 documentés |
| Mécaniques cœur | Bande passante, chrono, ticket ajustable + cap table, dialogue fondateur avec cohérence de signaux, scène LP avec angle + cohérence, follow-on, crise macro (4 options), méta-progression minimale |
| Macro-événements | Version simple, un seul type de choc par occurrence |
| Non-macro | "Talent rejoint une ligne", "presse sur une ligne" |
| Persistance | Sauvegarde locale (même appareil/navigateur) |
| Télémétrie | Fil d'événements niveau 2, envoi auto à la clôture ou via bouton d'abandon |

Détail complet des mécaniques : voir [product-spec.md](./product-spec.md).

---

## 6. Critères de succès du playtest

- Les testeurs terminent au moins un run complet (8 trimestres) sans confusion bloquante sur les mécaniques cœur.
- Les retours qualitatifs permettent de distinguer clairement ce qui doit changer avant V2 de ce qui fonctionne déjà.
- Aucun bug bloquant non résolu à la clôture d'un run pour la majorité des testeurs (voir la règle de non-régression dans [CLAUDE.md](../CLAUDE.md)).

## 7. Risques connus / points non tranchés

Voir §8 de [product-spec.md](./product-spec.md) : persistance, mécanisme d'envoi de la télémétrie, arbitrage réserve follow-on (fondue dans le capital général par défaut, faute de décision explicite). L'écran de blocage mobile et l'onboarding progressif sont désormais des objectifs de Phase 0 (§3), leur implémentation détaillée reste à trancher en codant.

## 8. Roadmap indicative (post-Phase 0, non engageante)

Repoussé volontairement en V2, voir §9 de [product-spec.md](./product-spec.md) : champ libre pour interroger les fondateurs, signaux mensongers actifs, rumeurs pré-choc macro, conditions LP négociables, IA générative pour les LPs, structures d'equity avancées, structure en actes, version mobile.
