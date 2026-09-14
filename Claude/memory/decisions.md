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

## [2026-09-15] Valeurs de thèse (secteur / stade / zone)

**Décision** : pour l'écran de déclaration de thèse (product-spec §3.1.1), les valeurs sélectionnables sont : Secteurs — SaaS B2B, Fintech, Deeptech, Consumer, Marketplace. Stades — Pre-seed, Seed, Series A. Zones — France, Europe, US.
**Raison** : le product-spec ne liste aucune valeur concrète pour ces trois chips. Proposées par cohérence avec les exemples de startups déjà présents dans les maquettes envoyées (SaaS prévision de stock, logistique, assistant R&D pharma).
**Domaine concerné** : Signals & Content (données) / Game Loop (la thèse engage le run, §3.1.1). Ajustable librement, ce n'est pas structurant.

## [2026-09-15] Thèse : jusqu'à 3 secteurs, 1 stade, 1 zone

**Décision** : la thèse autorise jusqu'à `MAX_SECTORS = 3` secteurs sélectionnés simultanément (au 4e clic, le plus ancien est désélectionné automatiquement), contre 1 seul stade et 1 seule zone. `Thesis.sector` devient `Thesis.sectors: Sector[]`.
**Raison** : le product-spec (§3.1.1) ne précise pas si secteur/stade/zone sont mono ou multi-sélection. Un seul secteur rendrait le deal flow généré trop pauvre en diversité (5 secteurs disponibles en Phase 0) ; autoriser 3 sur 5 garde un vrai engagement de thèse (dévier coûte de la confiance LP, §3.1.1) tout en laissant assez de marge pour varier les opportunités.
**Domaine concerné** : Game Loop (`src/game-loop/thesis.ts`) / UI (`src/ui/ThesisDeclaration.tsx`).
