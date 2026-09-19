// Résolution du deal flow — product-spec §3.2. Domaine Game Loop.

import type { Stage } from './thesis'

export type DealCardStatus = 'pending' | 'dug' | 'passed' | 'invested'

// product-spec §6 : chrono 40s de base pour les cartes rapides.
export const DEAL_CARD_TIMER_SECONDS = 40

// Ticket fixe par stade — voir Claude/memory/decisions.md (2026-09-19) : pas de curseur
// ajustable sur une carte rapide, contrairement à la scène de dialogue développée (§3.4).
const FIXED_TICKET_BY_STAGE: Record<Stage, number> = {
  'pre-seed': 100_000,
  seed: 250_000,
  'series-a': 600_000,
}

export function fixedTicketForStage(stage: Stage): number {
  return FIXED_TICKET_BY_STAGE[stage]
}
