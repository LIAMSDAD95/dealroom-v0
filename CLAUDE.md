# DEALROOM

## Quoi

Jeu roguelike de simulation de venture capital. Le joueur incarne un General Partner : chaque run est un fonds — lever auprès de LPs, instruire un deal flow de startups, investir ou passer, gérer un portefeuille, encaisser des événements de marché, clôturer et repartir avec de la méta-progression. Run à plat de 8 trimestres en Phase 0.

## Pourquoi

Faire vivre au joueur la logique contre-intuitive du VC : le but n'est pas d'éviter le risque mais de repérer les *fund-returners* (loi de puissance). Le système de signaux récompense la conviction informée, jamais la prudence systématique.

## Pour qui

Phase 0 : 15-20 playtesteurs (réseau personnel, indie gamedev, fintwit francophone). Web desktop uniquement, pas de version mobile. Pas de monétisation avant validation.

## Comment

Développement solo avec Claude Code, horizon 1-2 mois, sans budget. Stack : **React + Vite + TypeScript + CSS Modules** (variables CSS pour les tokens visuels, voir [ADR-001](Claude/memory/adr.md)). Le projet se découpe en 5 domaines séparés — voir [docs/architecture.md](docs/architecture.md) :

1. **Game Loop & State Machine** — boucle de run, ressources, résolutions.
2. **Signals & Content** — archétypes fondateurs/LPs, dialogues, signaux.
3. **UI / Visual System** — design pixel/techwear, composants, animations.
4. **Persistence & Test Data** — sauvegarde locale, fil d'événements niveau 2.
5. **Technical / App State** — bootstrap, build, assets.

## Documentation

- [docs/product-spec.md](docs/product-spec.md) — spécification produit complète (boucle de jeu, mécaniques, système visuel).
- [docs/PRD.md](docs/PRD.md) — objectifs, cible, scope Phase 0, critères de succès.
- [docs/architecture.md](docs/architecture.md) — les 5 domaines détaillés, responsabilités et interfaces.
- [Claude/agent/orchestrator.md](Claude/agent/orchestrator.md) — agent de planification pour les tâches multi-domaines.
- [Claude/memory/](Claude/memory/) — registres persistants (décisions, ADR, blocages, apprentissages, journal de session).

## Règles de travail

1. **Non-négociable — jamais de tâche terminée sans vérification de non-régression.** Ne jamais déclarer une tâche accomplie sans avoir vérifié que rien d'autre n'a été cassé (autre domaine, autre mécanique, autre écran). En l'absence de suite de tests automatisée, cela veut dire : relancer le jeu et parcourir manuellement le chemin nominal affecté + au moins un chemin adjacent avant de conclure.
2. **Respecter les frontières de domaines** (docs/architecture.md). Une modification dans Signals & Content ne doit pas coder de logique de ressources qui appartient à Game Loop, et inversement.
3. **Pas de score agrégé côté joueur** pour les signaux (§3.3 product-spec) — c'est une contrainte de design, pas un détail technique : ne jamais l'introduire "pour simplifier" l'UI.
4. **Jamais de champ libre côté joueur** dans les dialogues fondateur/LP en V1 (risque de contournement du système de signaux) — toujours des choix pré-écrits.
5. **Consigner au fil de l'eau** : un bug bloquant va dans [Claude/memory/blockers.md](Claude/memory/blockers.md) ; une fois résolu, la solution et le "pourquoi ça a marché" vont dans [Claude/memory/learnings.md](Claude/memory/learnings.md). Une décision de design/archi non triviale va dans [decisions.md](Claude/memory/decisions.md) ou [adr.md](Claude/memory/adr.md) selon sa portée.
6. **Pour toute tâche touchant ≥2 domaines**, passer par une décomposition façon [orchestrator.md](Claude/agent/orchestrator.md) avant d'exécuter.
7. Avant d'ajouter un point non tranché (voir §8 product-spec), vérifier s'il a déjà été arbitré dans [Claude/memory/decisions.md](Claude/memory/decisions.md) — ne pas re-trancher deux fois la même question.
8. **Demander une vérification = dire précisément quoi tester.** Quand une fonctionnalité n'est codée que pour un sous-ensemble (ex. contenu écrit pour 2 LPs sur 4), le dire explicitement avant de demander à l'utilisateur de tester — sinon il risque de tester le mauvais périmètre et de rapporter un faux bug, ce qui coûte des itérations inutiles (voir Claude/memory/blockers.md, 2026-09-15/16).
