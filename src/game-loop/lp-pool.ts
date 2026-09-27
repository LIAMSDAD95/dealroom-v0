// Pool de LPs — product-spec §3.1.2. Instances concrètes proposées au joueur pour ce run,
// distinctes des archétypes génériques de Signals & Content (src/signals-content/lps.ts) :
// deux runs peuvent proposer le même archétype de LP avec des montants différents.
// Domaine Game Loop (docs/architecture.md#1) : le pool dépend de la réputation du GP.

import type { EngagementId, LpArchetypeId, PitchAngle } from '../signals-content/types'

export type LpConstraintKind = 'dure' | 'bonus'

export interface LpConstraint {
  kind: LpConstraintKind
  label: string
  /** Engagement vérifié à la clôture (§3.8), si la contrainte est mesurable. */
  engagementId?: EngagementId
}

/** Ce que la scène de pitch a produit — relu par le rapport aux LPs à la clôture (§3.8). */
export interface LpPitchRecord {
  angle: PitchAngle
  /** Confiance en fin de pitch, 0-100. */
  finalConfidence: number
  /** Engagements pris par les réponses du joueur. */
  engagementIds: EngagementId[]
  /** Réponses dont le ton contredisait l'angle déclaré. */
  incoherentAnswers: number
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
  /** Renseigné quand l'engagement vient d'une scène de pitch (absent pour un LP qui revient). */
  pitchRecord?: LpPitchRecord
  /** true si ce LP a reconduit depuis le fonds précédent (engagé d'office, sans pitch). */
  returning?: boolean
}

/**
 * LPs qui reconduisent depuis le fonds précédent (§3.8 « Vous suit ») : engagés d'office
 * au même montant, sans nouveau pitch.
 */
export function withReturningLps(
  offers: LpOffer[],
  returning: { offerId: string; amount: number }[],
): LpOffer[] {
  return offers.map((offer) => {
    const back = returning.find((r) => r.offerId === offer.id)
    return back && offer.status === 'available'
      ? { ...offer, status: 'committed', committedAmount: back.amount, returning: true }
      : offer
  })
}
