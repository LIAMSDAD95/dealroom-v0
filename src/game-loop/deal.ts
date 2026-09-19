// Deal flow — product-spec §3.2. Instance concrète de startup proposée au joueur pour ce
// tour, distincte de l'archétype générique de Signals & Content (founders.ts) : deux runs
// peuvent proposer le même archétype avec un nom/secteur/signaux différents.
// Domaine Game Loop (docs/architecture.md#1) : dépend du tour, de la thèse, de la réputation.

import type { FounderArchetypeId, SignalFamily } from '../signals-content/types'
import type { Sector, Stage } from './thesis'

// product-spec §3.3 : structurel visible d'office, équipe/trompeur masqués tant que le
// joueur n'a pas creusé. La famille détermine aussi la couleur du tag une fois révélé.
export interface DealTag {
  label: string
  family: SignalFamily
}

export interface Deal {
  id: string
  founderArchetypeId: FounderArchetypeId
  companyName: string
  founderName: string
  pitch: string
  sector: Sector
  stage: Stage
  ticker: string
  /** Montant recherché par la startup — varie par carte autour de la base du stade, voir deal-generator.ts. */
  askAmount: number
  /** N-ième tentative de levée pour cette startup — affiché sur la carte (product-spec, screenshot). */
  attemptNumber: number
  tags: DealTag[]
  /** true si cette carte ouvre la scène de dialogue développée plutôt qu'une décision rapide (§3.2). */
  isDevelopedScene: boolean
}
