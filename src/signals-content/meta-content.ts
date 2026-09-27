// Libellés de la méta-progression — product-spec §3.7. Domaine Signals & Content :
// uniquement du texte. Les paliers, conditions et effets sont dans Game Loop (meta.ts).

import type { PitchAngle } from './types'

/** Clés alignées sur ReputationTierId (game-loop/meta.ts). */
export const reputationTierLabels: Record<'emergent' | 'developpement' | 'confirme', string> = {
  emergent: 'GP émergent',
  developpement: 'GP en développement',
  confirme: 'GP confirmé',
}

/** Clés alignées sur PerkId (game-loop/meta.ts). */
export const perkTexts: Record<
  'premier-fonds' | 'instinct-chasseur' | 'sang-froid' | 'discipline-reserve',
  { name: string; unlockedBy: string; effect: string }
> = {
  'premier-fonds': {
    name: 'Premier fonds bouclé',
    unlockedBy: 'Un fonds mené jusqu’à sa clôture.',
    effect: 'Les LPs vous prennent au sérieux : +10 de confiance au début de chaque pitch LP.',
  },
  'instinct-chasseur': {
    name: 'Instinct de chasseur',
    unlockedBy: 'Une ligne à plus de 10× repérée en ayant fait la due diligence.',
    effect: 'Un signal équipe visible d’office sur chaque carte du deal flow, sans creuser.',
  },
  'sang-froid': {
    name: 'Sang-froid',
    unlockedBy: 'Un fondateur bien lu en pleine crise.',
    effect: 'La « réaction attendue » en crise gagne un cran de fiabilité.',
  },
  'discipline-reserve': {
    name: 'Discipline de réserve',
    unlockedBy: 'Un follow-on sur une ligne sortie à plus de 3×.',
    effect: '« Revoir DD » sur une carte follow-on ne coûte plus de bande passante.',
  },
}

export const angleUnlockTexts: Record<PitchAngle, { name: string; effect: string }> = {
  conviction: { name: 'Angle Conviction', effect: '' },
  discipline: { name: 'Angle Discipline', effect: '' },
  reseau: {
    name: 'Angle de pitch « Réseau »',
    effect: 'Nouvel angle d’ouverture disponible face aux LPs à la prochaine levée.',
  },
  'track-record': {
    name: 'Angle de pitch « Track record »',
    effect: 'Votre historique devient un argument face aux LPs.',
  },
}
