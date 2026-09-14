// Données des archétypes de LP — product-spec §5.
// Les 4 premiers sont actifs en Phase 0 (docs/PRD.md §5 : "2-3 archétypes").
// LP corporate/CVC et Endowment sont explicitement hors Phase 0 (débloqués à
// réputation "GP confirmé", product-spec §5).

import type { LpArchetype } from './types'

export const lpArchetypes: LpArchetype[] = [
  {
    id: 'business-angel-reseaute',
    label: 'Business angel réseauté',
    description:
      'Ex-fondateur exité — petit ticket, bonus deal flow, challenge la compréhension du métier.',
    phase0: true,
  },
  {
    id: 'family-office-patient',
    label: 'Family Office patient',
    description: 'Capital moyen, tolérant au risque, exige un accès en co-invest privilégié.',
    phase0: true,
  },
  {
    id: 'fonds-pension-conservateur',
    label: 'Fonds de pension conservateur',
    description: 'Gros ticket, limite stricte de risque (max % en deals haute variance).',
    phase0: false,
  },
  {
    id: 'fonds-de-fonds-opportuniste',
    label: 'Fonds de fonds opportuniste',
    description: 'Capital moyen, exige un rythme de déploiement rapide.',
    phase0: false,
  },
  {
    id: 'lp-corporate-cvc',
    label: 'LP corporate / CVC',
    description: 'Débloqué à réputation "GP confirmé", hors Phase 0.',
    phase0: false,
  },
  {
    id: 'endowment',
    label: 'Endowment',
    description: 'Débloqué à réputation "GP confirmé", hors Phase 0.',
    phase0: false,
  },
]
