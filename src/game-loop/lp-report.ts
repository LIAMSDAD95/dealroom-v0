// Rapport aux LPs — product-spec §3.8 : chaque LP juge le fonds sur sa performance ET sur
// les engagements pris au closing (réponses de pitch §3.1.3, contraintes dures de carte).
// Domaine Game Loop : vérification des engagements et verdict. Les citations viennent de
// Signals & Content (closing-content.ts).

import type { EngagementId } from '../signals-content/types'
import type { CrisisRecord, ReturningLp } from './meta'
import type { LpOffer } from './lp-pool'
import type { PortfolioLine } from './portfolio'
import type { ClosingMetrics } from './run-closing'

/**
 * - kept / broken : engagement mesurable, tenu ou trahi.
 * - untested : rien dans le run ne permettait de le tenir ou de le trahir (ex. aucune crise
 *   pour la disponibilité, pas encore de mécanique de co-invest en Phase 0).
 */
export type EngagementStatus = 'kept' | 'broken' | 'untested'

export interface EngagementCheck {
  id: EngagementId
  status: EngagementStatus
}

export interface RunFacts {
  portfolio: PortfolioLine[]
  metrics: ClosingMetrics
  crises: CrisisRecord[]
  totalRaised: number
}

/** « Haute variance » = ticket engagé sans due diligence (pari à l'aveugle). */
const MAX_BLIND_SHARE = 0.25
/** « Rythme de déploiement rapide » = la moitié du fonds engagée à mi-parcours. */
const FAST_DEPLOYMENT_QUARTER = 4
const FAST_DEPLOYMENT_SHARE = 0.5

function checkEngagement(id: EngagementId, facts: RunFacts): EngagementStatus {
  const lines = facts.portfolio
  const totalTickets = lines.reduce((sum, l) => sum + l.initialTicket, 0)

  switch (id) {
    case 'risk-limit': {
      if (totalTickets === 0) return 'untested'
      const blind = lines.filter((l) => l.investedBlind).reduce((sum, l) => sum + l.initialTicket, 0)
      return blind / totalTickets <= MAX_BLIND_SHARE ? 'kept' : 'broken'
    }
    case 'fast-deployment': {
      if (facts.totalRaised === 0) return 'untested'
      const early = lines
        .filter((l) => l.investedAtQuarter <= FAST_DEPLOYMENT_QUARTER)
        .reduce((sum, l) => sum + l.initialTicket, 0)
      return early / facts.totalRaised >= FAST_DEPLOYMENT_SHARE ? 'kept' : 'broken'
    }
    case 'founder-availability': {
      if (facts.crises.length === 0) return 'untested'
      // Promettre d'être disponible puis laisser un fondateur seul face à une crise.
      return facts.crises.some((c) => c.decision === 'laisser') ? 'broken' : 'kept'
    }
    // Pas de mécanique correspondante en Phase 0 — voir decisions.md (2026-09-27).
    case 'co-invest':
    case 'transparency':
    case 'risk-reporting':
      return 'untested'
  }
}

export type LpVerdict = 'follows' | 'pending' | 'declines'

export type LpQuoteReason =
  | { kind: 'broken'; engagement: EngagementId }
  | { kind: 'incoherent' }
  | { kind: 'kept'; engagement: EngagementId }
  | { kind: 'performance'; tier: 'strong' | 'fair' | 'poor' }

export interface LpReport {
  offer: LpOffer
  engagements: EngagementCheck[]
  finalConfidence: number
  verdict: LpVerdict
  /** Motif principal de la citation affichée. */
  reason: LpQuoteReason
}

/** Confiance d'un LP qui revient sans pitch : il connaît déjà le GP. */
const RETURNING_LP_CONFIDENCE = 65

function performanceTier(tvpi: number): 'strong' | 'fair' | 'poor' {
  if (tvpi >= 2) return 'strong'
  if (tvpi >= 1.2) return 'fair'
  return 'poor'
}

function performanceDelta(tvpi: number): number {
  if (tvpi >= 3) return 25
  if (tvpi >= 2) return 15
  if (tvpi >= 1.3) return 5
  if (tvpi >= 1) return -5
  return -20
}

export function buildLpReport(offer: LpOffer, facts: RunFacts): LpReport {
  const ids = new Set<EngagementId>([
    ...(offer.pitchRecord?.engagementIds ?? []),
    ...offer.constraints.flatMap((c) => (c.engagementId ? [c.engagementId] : [])),
  ])
  const engagements = [...ids].map((id) => ({ id, status: checkEngagement(id, facts) }))
  const kept = engagements.filter((e) => e.status === 'kept')
  const broken = engagements.filter((e) => e.status === 'broken')
  const incoherent = offer.pitchRecord?.incoherentAnswers ?? 0

  const start = offer.pitchRecord?.finalConfidence ?? RETURNING_LP_CONFIDENCE
  const finalConfidence = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        start +
          performanceDelta(facts.metrics.tvpi) +
          10 * kept.length -
          20 * broken.length -
          5 * incoherent,
      ),
    ),
  )
  const verdict: LpVerdict =
    finalConfidence >= 65 ? 'follows' : finalConfidence >= 40 ? 'pending' : 'declines'

  // Un engagement trahi domine tout le reste : c'est ce qu'un LP retient (§3.8).
  const reason: LpQuoteReason =
    broken.length > 0
      ? { kind: 'broken', engagement: broken[0].id }
      : incoherent > 0 && verdict !== 'follows'
        ? { kind: 'incoherent' }
        : kept.length > 0
          ? { kind: 'kept', engagement: kept[0].id }
          : { kind: 'performance', tier: performanceTier(facts.metrics.tvpi) }

  return { offer, engagements, finalConfidence, verdict, reason }
}

/** LPs qui reconduisent : engagés d'office, au même montant, à la levée suivante. */
export function returningLpsFrom(reports: LpReport[]): ReturningLp[] {
  return reports
    .filter((r) => r.verdict === 'follows')
    .map((r) => ({ offerId: r.offer.id, amount: r.offer.committedAmount ?? 0 }))
}
