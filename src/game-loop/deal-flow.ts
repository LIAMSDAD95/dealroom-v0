// Résolution du deal flow — product-spec §3.2. Domaine Game Loop.

import type { Stage } from './thesis'

export type DealCardStatus = 'pending' | 'dug' | 'passed' | 'invested'

// product-spec §6 : chrono 40s de base pour les cartes rapides.
export const DEAL_CARD_TIMER_SECONDS = 40

// Montant de base par stade — voir Claude/memory/decisions.md (2026-09-19) : pas de curseur
// ajustable sur une carte rapide, contrairement à la scène de dialogue développée (§3.4).
// Chaque deal généré varie ce montant de base (voir deal-generator.ts) pour éviter que
// toutes les cartes d'un même stade affichent exactement le même chiffre (voir
// Claude/memory/blockers.md, 2026-09-19 "montants identiques et trop élevés").
const BASE_TICKET_BY_STAGE: Record<Stage, number> = {
  'pre-seed': 80_000,
  seed: 180_000,
  'series-a': 400_000,
}

export function baseTicketForStage(stage: Stage): number {
  return BASE_TICKET_BY_STAGE[stage]
}
