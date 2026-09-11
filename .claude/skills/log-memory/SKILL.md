---
name: log-memory
description: Consigne un blocage, un apprentissage, une décision ou un ADR dans les registres Claude/memory/*.md du projet DEALROOM, au bon format et dans le bon fichier. À utiliser dès qu'un bug bloquant apparaît, qu'une solution est trouvée, ou qu'un choix de conception/architecture est tranché (règle de travail #5 du CLAUDE.md).
---

# Log Memory

Consigne une entrée dans les registres persistants du projet, en respectant le format déjà établi dans chaque fichier.

## Quand l'utiliser

- Un bug ou obstacle bloque le travail → `Claude/memory/blockers.md`
- Un blocage listé est résolu → documenter dans `Claude/memory/learnings.md`, puis marquer l'entrée correspondante dans `blockers.md` comme résolue (ne jamais supprimer l'entrée)
- Un choix de conception ou d'implémentation non trivial est tranché → `Claude/memory/decisions.md`
- Un choix d'architecture structurant et difficile à revenir en arrière (stack, découpage de domaines, format de sauvegarde...) → `Claude/memory/adr.md`

Si le point à trancher a peut-être déjà été arbitré, vérifier d'abord `Claude/memory/decisions.md` avant d'ajouter une nouvelle entrée (règle #7 du CLAUDE.md).

## Formats

**blockers.md**
```
## [AAAA-MM-JJ] Titre court du blocage
**Statut** : ouvert / résolu (voir learnings.md#lien)
**Domaine concerné** : (voir docs/architecture.md)
**Symptôme** : ...
**Contexte** : ...
```

**learnings.md**
```
## [AAAA-MM-JJ] Titre court (lié à blockers.md#titre)
**Cause racine** : ...
**Solution** : ...
**À retenir pour la suite** : ...
```

**decisions.md**
```
## [AAAA-MM-JJ] Titre court de la décision
**Décision** : ...
**Raison** : ...
**Domaine concerné** : (voir docs/architecture.md)
```

**adr.md**
```
## ADR-XXX — Titre
**Statut** : proposé / accepté / remplacé par ADR-XXX
**Contexte** : ...
**Décision** : ...
**Conséquences** : ...
```

## Étapes

1. Identifier le bon registre selon la nature de l'entrée (voir "Quand l'utiliser").
2. Pour un ADR, vérifier le dernier numéro utilisé dans `adr.md` et incrémenter.
3. Ajouter l'entrée à la fin du fichier, au format ci-dessus, avec la date du jour.
4. Si l'entrée résout un blocage existant, éditer aussi l'entrée correspondante dans `blockers.md` pour passer son statut à "résolu (voir learnings.md#...)".
5. Rester concis : une entrée doit tenir en quelques lignes, pas un rapport.
