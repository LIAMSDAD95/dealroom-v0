// Pool de LPs — product-spec §3.1.2. Instances concrètes proposées au joueur pour ce run,
// distinctes des archétypes génériques de Signals & Content (src/signals-content/lps.ts) :
// deux runs peuvent proposer le même archétype de LP avec des montants différents.
// Domaine Game Loop (docs/architecture.md#1) : le pool dépend de la réputation du GP.

import type { LpArchetypeId } from '../signals-content/types'

export type LpConstraintKind = 'dure' | 'bonus'

export interface LpConstraint {
  kind: LpConstraintKind
  label: string
}

export type LpOfferStatus = 'available' | 'committed' | 'locked'

export interface LpOffer {
  id: string
  archetypeId: LpArchetypeId
  /** Nom propre affiché sur la carte (ex. "Yann Fontaine", "Northbridge Partners"). */
  name: string
  /** Fourchette de capital proposé, en euros. */
  capitalMin: number
  capitalMax: number
  constraints: LpConstraint[]
  status: LpOfferStatus
  /** Montant réellement engagé — renseigné seulement si status === 'committed'. */
  committedAmount?: number
  /** Raison de verrouillage affichée sur la carte — renseignée seulement si status === 'locked'. */
  lockedReason?: string
}
