// Méta-progression — product-spec §3.7. Domaine Game Loop : paliers de réputation, leçons
// (perks passifs) et leurs conditions d'obtention, calcul des gains d'un run. Les libellés
// affichés vivent dans Signals & Content (meta-content.ts) ; la sauvegarde dans Persistence.
//
// Deux monnaies séparées (§3.7) : la réputation avance avec la performance globale et
// débloque du contenu ; les leçons récompensent un exploit précis et débloquent un perk.

import type { PitchAngle } from '../signals-content/types'
import type { CrisisDecision } from './crisis'
import type { CrisisLineEffect } from './portfolio-evolution'
import type { ClosingMetrics, LineOutcome } from './run-closing'

export type PerkId = 'premier-fonds' | 'instinct-chasseur' | 'sang-froid' | 'discipline-reserve'

export interface ReturningLp {
  offerId: string
  amount: number
}

export interface MetaProgress {
  /** Numéro du fonds en cours (1 = Fonds I). */
  fundNumber: number
  /** 0-100. */
  reputation: number
  perks: PerkId[]
  /** LPs qui ont annoncé suivre au fonds suivant : engagés d'office à la prochaine levée. */
  returningLps: ReturningLp[]
}

/**
 * Version de playtest (décision utilisateur 2026-10-03) : le jeu s'arrête après ce fonds.
 * Deux fonds suffisent à mesurer l'apprentissage (Fonds I → Fonds II) sans user le contenu.
 */
export const PLAYTEST_LAST_FUND = 2

/** true une fois le dernier fonds du playtest clôturé. */
export function isPlaytestComplete(meta: MetaProgress): boolean {
  return meta.fundNumber > PLAYTEST_LAST_FUND
}

export const INITIAL_META: MetaProgress = {
  fundNumber: 1,
  reputation: 0,
  perks: [],
  returningLps: [],
}

// --- Paliers de réputation ---------------------------------------------------------------

export type ReputationTierId = 'emergent' | 'developpement' | 'confirme'

export interface ReputationTier {
  id: ReputationTierId
  /** Réputation minimale pour atteindre ce palier. */
  min: number
  /** Angles de pitch LP ouverts à ce palier (§3.1.3). */
  angles: PitchAngle[]
}

export const REPUTATION_TIERS: ReputationTier[] = [
  { id: 'emergent', min: 0, angles: ['conviction', 'discipline'] },
  { id: 'developpement', min: 20, angles: ['conviction', 'discipline', 'reseau'] },
  { id: 'confirme', min: 60, angles: ['conviction', 'discipline', 'reseau', 'track-record'] },
]

export function reputationTier(reputation: number): ReputationTier {
  return [...REPUTATION_TIERS].reverse().find((t) => reputation >= t.min) ?? REPUTATION_TIERS[0]
}

export function nextReputationTier(reputation: number): ReputationTier | null {
  return REPUTATION_TIERS.find((t) => t.min > reputation) ?? null
}

export function unlockedAngles(reputation: number): PitchAngle[] {
  return reputationTier(reputation).angles
}

// --- Effets des perks (lus par les écrans concernés) ------------------------------------

/** « Premier fonds bouclé » : confiance de départ en pitch LP. */
export const PREMIER_FONDS_CONFIDENCE_BONUS = 10

export function hasPerk(meta: MetaProgress, perk: PerkId): boolean {
  return meta.perks.includes(perk)
}

// --- Gains d'un run ----------------------------------------------------------------------

export interface CrisisRecord {
  decision: CrisisDecision
  lineEffect: CrisisLineEffect
}

export interface RunRecord {
  outcomes: LineOutcome[]
  metrics: ClosingMetrics
  crises: CrisisRecord[]
  /** Lignes sur lesquelles le joueur a suivi au moins un follow-on. */
  followedLineIds: string[]
  /** Nombre de LPs qui suivent au fonds suivant. */
  followingLpCount: number
}

function reputationFromTvpi(tvpi: number): number {
  if (tvpi >= 4) return 20
  if (tvpi >= 2.5) return 16
  if (tvpi >= 1.5) return 12
  if (tvpi >= 1) return 8
  return 4
}

/** Réputation gagnée — proportionnelle à la vraie performance (§3.7). */
export function reputationGain(run: RunRecord): number {
  return (
    reputationFromTvpi(run.metrics.tvpi) + 4 * run.metrics.fundReturners + 2 * run.followingLpCount
  )
}

/** Multiple à partir duquel une ligne compte comme un gros gain pour les leçons. */
const BIG_WIN_MULTIPLE = 10
const FOLLOW_ON_WIN_MULTIPLE = 3

/** Conditions d'obtention des leçons — chacune un exploit précis (§3.7). */
const PERK_CONDITIONS: Record<Exclude<PerkId, 'premier-fonds'>, (run: RunRecord) => boolean> = {
  // Repérer un gros gagnant en ayant fait le travail : le signal, pas la chance.
  'instinct-chasseur': (run) =>
    run.outcomes.some((o) => o.multiple >= BIG_WIN_MULTIPLE && !o.line.investedBlind),
  // Bien lire un fondateur sous pression : soutien utile, ou laisser courir un résilient.
  'sang-froid': (run) =>
    run.crises.some(
      (c) => c.lineEffect === 'strengthen' || (c.decision === 'laisser' && c.lineEffect === 'none'),
    ),
  // Renforcer une ligne qui finit bien : le follow-on comme arme, pas comme réflexe.
  'discipline-reserve': (run) =>
    run.outcomes.some(
      (o) => o.multiple >= FOLLOW_ON_WIN_MULTIPLE && run.followedLineIds.includes(o.line.id),
    ),
}

/**
 * Leçons débloquées par ce run. « Premier fonds bouclé » sert de leçon plancher : §3.7
 * garantit au moins une petite leçon par run tant qu'il en reste à gagner.
 */
export function newPerks(meta: MetaProgress, run: RunRecord): PerkId[] {
  const earned = (Object.keys(PERK_CONDITIONS) as Exclude<PerkId, 'premier-fonds'>[]).filter(
    (perk) => !meta.perks.includes(perk) && PERK_CONDITIONS[perk](run),
  )
  if (earned.length === 0 && !meta.perks.includes('premier-fonds')) return ['premier-fonds']
  return earned
}

export interface RunGains {
  reputationBefore: number
  reputationAfter: number
  perks: PerkId[]
  /** Angles de pitch nouvellement ouverts par un changement de palier. */
  unlockedAngles: PitchAngle[]
}

export function computeRunGains(meta: MetaProgress, run: RunRecord): RunGains {
  const reputationAfter = Math.min(100, meta.reputation + reputationGain(run))
  const before = unlockedAngles(meta.reputation)
  return {
    reputationBefore: meta.reputation,
    reputationAfter,
    perks: newPerks(meta, run),
    unlockedAngles: unlockedAngles(reputationAfter).filter((a) => !before.includes(a)),
  }
}

/** État de méta-progression à emporter au fonds suivant. */
export function nextMeta(meta: MetaProgress, gains: RunGains, returningLps: ReturningLp[]): MetaProgress {
  return {
    fundNumber: meta.fundNumber + 1,
    reputation: gains.reputationAfter,
    perks: [...meta.perks, ...gains.perks],
    returningLps,
  }
}
