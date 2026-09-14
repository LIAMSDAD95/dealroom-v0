// Déclaration de thèse — product-spec §3.1.1. Premier écran du run : le joueur choisit
// secteur/stade/zone, engagement moral pour tout le run (dévier coûte de la confiance LP).
// Domaine Game Loop (docs/architecture.md#1) : c'est une règle qui engage la mécanique du run,
// pas juste du contenu à afficher.

export type Sector = 'saas-b2b' | 'fintech' | 'deeptech' | 'consumer' | 'marketplace'
export type Stage = 'pre-seed' | 'seed' | 'series-a'
export type Zone = 'france' | 'europe' | 'us'

export const MAX_SECTORS = 3

export interface Thesis {
  /** 1 à MAX_SECTORS secteurs — pluriel pour diversifier le deal flow généré (voir decisions.md). */
  sectors: Sector[]
  stage: Stage
  zone: Zone
}

export interface ChipOption<T extends string> {
  id: T
  label: string
}

// Valeurs Phase 0 — voir Claude/memory/decisions.md (2026-09-15), non tranchées par le product-spec.
export const sectorOptions: ChipOption<Sector>[] = [
  { id: 'saas-b2b', label: 'SaaS B2B' },
  { id: 'fintech', label: 'Fintech' },
  { id: 'deeptech', label: 'Deeptech' },
  { id: 'consumer', label: 'Consumer' },
  { id: 'marketplace', label: 'Marketplace' },
]

export const stageOptions: ChipOption<Stage>[] = [
  { id: 'pre-seed', label: 'Pre-seed' },
  { id: 'seed', label: 'Seed' },
  { id: 'series-a', label: 'Series A' },
]

export const zoneOptions: ChipOption<Zone>[] = [
  { id: 'france', label: 'France' },
  { id: 'europe', label: 'Europe' },
  { id: 'us', label: 'US' },
]
