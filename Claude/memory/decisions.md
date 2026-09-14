# Registre — Décisions

> Consigne les choix de conception ou d'implémentation tranchés au fil du projet, quand ils ne relèvent pas d'une décision d'architecture formelle (voir [adr.md](./adr.md) pour celles-là). Une ligne par décision : quoi, pourquoi, quand.

---

<!-- Format suggéré :
## [AAAA-MM-JJ] Titre court de la décision
**Décision** : ...
**Raison** : ...
**Domaine concerné** : (voir docs/architecture.md)
-->

## [2026-09-15] Sélection provisoire des archétypes actifs en Phase 0

**Décision** : parmi les 9 archétypes fondateurs documentés (product-spec §4), les 5 premiers dans l'ordre du document sont marqués `phase0: true` dans `src/signals-content/founders.ts` : Wunderkind du pedigree, Bricoleur obsessionnel, Surfeur de hype, Vétérante du secteur, Duo fondateur fracturé. Parmi les 6 archétypes de LP (§5), les 2 premiers sont actifs : Business angel réseauté, Family Office patient.
**Raison** : le PRD (§5) fixe une fourchette ("4-5 fondateurs", "2-3 LPs") sans trancher lesquels précisément. Un choix arbitraire était nécessaire pour poser les données ; celui-ci prend les premiers de chaque liste plutôt que d'inventer un critère de sélection non demandé.
**Domaine concerné** : Signals & Content. À révisiter si un critère de sélection réel (diversité des signaux couverts, facilité d'écriture des dialogues...) doit primer sur l'ordre du document — voir `src/signals-content/founders.ts` et `lps.ts`.
