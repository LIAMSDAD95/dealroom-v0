// Pool de LPs pour le Fonds I (premier run) — reflète la maquette "Levée de fonds"
// (vc-techwear-lp_7.html), avec l'état initial réel du run : tous les LPs disponibles
// commencent 'available' (aucun engagement au début, voir Claude/memory/decisions.md
// 2026-09-15 "Progression du fonds à zéro au démarrage"), 2 verrouillés (réputation
// "GP confirmé" requise, product-spec §5).

import type { LpOffer } from './lp-pool'

export const fundIOffers: LpOffer[] = [
  {
    id: 'fund-i-yann-fontaine',
    archetypeId: 'business-angel-reseaute',
    name: 'Yann Fontaine',
    capitalMin: 100_000,
    capitalMax: 250_000,
    status: 'available',
    constraints: [
      { kind: 'bonus', label: 'Deal flow bonus (réseau tech)' },
      { kind: 'dure', label: 'Challenge fort sur ta compréhension du métier' },
    ],
  },
  {
    id: 'fund-i-northbridge',
    archetypeId: 'fonds-de-fonds-opportuniste',
    name: 'Northbridge Partners',
    capitalMin: 500_000,
    capitalMax: 1_200_000,
    status: 'available',
    constraints: [{ kind: 'dure', label: 'Exige un rythme de déploiement rapide' }],
  },
  {
    id: 'fund-i-family-office-r',
    archetypeId: 'family-office-patient',
    name: 'Family Office R.',
    capitalMin: 300_000,
    capitalMax: 800_000,
    status: 'available',
    constraints: [{ kind: 'dure', label: 'Exige un accès en co-invest privilégié' }],
  },
  {
    id: 'fund-i-fonds-pension-b',
    archetypeId: 'fonds-pension-conservateur',
    name: 'Fonds pension B.',
    capitalMin: 1_500_000,
    capitalMax: 3_000_000,
    status: 'available',
    constraints: [{ kind: 'dure', label: 'Limite stricte : max 25% en deals haute variance' }],
  },
  {
    id: 'fund-i-corporate-cvc',
    archetypeId: 'lp-corporate-cvc',
    name: '— Verrouillé —',
    capitalMin: 0,
    capitalMax: 0,
    status: 'locked',
    lockedReason: 'Réputation « GP confirmé » requise',
    constraints: [],
  },
  {
    id: 'fund-i-endowment',
    archetypeId: 'endowment',
    name: '— Verrouillé —',
    capitalMin: 0,
    capitalMax: 0,
    status: 'locked',
    lockedReason: 'Réputation « GP confirmé » requise',
    constraints: [],
  },
]
