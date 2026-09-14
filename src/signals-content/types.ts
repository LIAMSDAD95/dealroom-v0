// Types de contenu — archétypes, signaux, LPs.
// Domaine Signals & Content (docs/architecture.md#2). Ne contient aucune règle de
// ressources (bande passante, capital, attention/patience) : ça appartient à Game Loop.

/** product-spec §3.3 — trois familles de signaux, toujours fiables à 100% une fois révélées. */
export type SignalFamily = 'structurel' | 'equipe' | 'trompeur'

export interface Signal {
  id: string
  family: SignalFamily
  label: string
  /** Texte affiché une fois le signal révélé — jamais un score agrégé (product-spec §3.3). */
  description: string
}

/** product-spec §4 — 9 archétypes documentés, 4-5 actifs en Phase 0 (voir `phase0`). */
export type FounderArchetypeId =
  | 'wunderkind-pedigree'
  | 'bricoleur-obsessionnel'
  | 'surfeur-hype'
  | 'veterane-secteur'
  | 'duo-fracture'
  | 'rescape'
  | 'scientifique-transfuge'
  | 'vendeur-ne-sans-produit'
  | 'prophete-mission'

export interface FounderArchetype {
  id: FounderArchetypeId
  label: string
  description: string
  /** Inclus dans le scope de build Phase 0 (docs/PRD.md §5). */
  phase0: boolean
}

/** product-spec §5 — 6 archétypes de LP documentés, 2-3 actifs en Phase 0. */
export type LpArchetypeId =
  | 'business-angel-reseaute'
  | 'family-office-patient'
  | 'fonds-pension-conservateur'
  | 'fonds-de-fonds-opportuniste'
  | 'lp-corporate-cvc'
  | 'endowment'

export interface LpArchetype {
  id: LpArchetypeId
  label: string
  description: string
  phase0: boolean
}

/** product-spec §3.1 — angle choisi par le joueur en scène de pitch LP. */
export type PitchAngle = 'conviction' | 'discipline' | 'reseau' | 'track-record'

/** product-spec §3.1 — ton d'une réponse, comparé à l'angle déclaré pour la cohérence. */
export type ResponseTone = 'discipline' | 'conviction' | 'reseau' | 'aucun'
