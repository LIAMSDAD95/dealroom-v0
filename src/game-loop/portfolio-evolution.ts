// Évolutions silencieuses du portefeuille (product-spec §3.2) et follow-on (§3.5).
// Domaine Game Loop : sens des évolutions, valorisation, tours, dilution. Les textes
// viennent de Signals & Content (portfolio-evolutions.ts).
//
// À chaque entrée de trimestre, chaque ligne active investie avant ce trimestre avance
// d'un cran, selon sa destinée cachée : soit elle lève un tour (→ carte follow-on), soit
// elle évolue (▲ / — / ▼), soit elle ferme. Voir Claude/memory/decisions.md (2026-09-27).

import type { RoundKind } from '../signals-content/portfolio-evolutions'
import { evolutionTextsFor, followOnRoundNotes } from '../signals-content/portfolio-evolutions'
import type { EvolutionDirection, LineDestiny, LineEvolution, PortfolioLine } from './portfolio'

function between(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function fillPlaceholders(text: string, line: PortfolioLine): string {
  return text.replaceAll('{company}', line.deal.companyName).replaceAll('{founder}', line.deal.founderName)
}

// --- Évolutions --------------------------------------------------------------------------

/** Probabilités [up, flat, down] d'une évolution trimestrielle selon la destinée. */
const DIRECTION_WEIGHTS: Record<LineDestiny, [number, number, number]> = {
  'fund-returner': [0.55, 0.35, 0.1],
  winner: [0.4, 0.45, 0.15],
  zombie: [0.15, 0.6, 0.25],
  wipeout: [0.15, 0.35, 0.5],
}

/** Effet d'une évolution sur la valorisation — les vrais sauts se font aux tours. */
const DIRECTION_MARKS: Record<EvolutionDirection, [number, number]> = {
  up: [1.08, 1.25],
  flat: [1, 1],
  down: [0.75, 0.9],
}

function drawDirection(destiny: LineDestiny): EvolutionDirection {
  const [up, flat] = DIRECTION_WEIGHTS[destiny]
  const roll = Math.random()
  if (roll < up) return 'up'
  if (roll < up + flat) return 'flat'
  return 'down'
}

/** Pioche un texte que la ligne n'a pas encore affiché, tant que la banque le permet. */
function pickEvolutionText(line: PortfolioLine, direction: LineEvolution['direction']): string {
  const bank = evolutionTextsFor(line.deal.founderArchetypeId)[direction]
  const alreadyShown = new Set(line.evolutions.map((e) => e.text))
  const fresh = bank.map((t) => fillPlaceholders(t, line)).filter((t) => !alreadyShown.has(t))
  return fresh.length > 0 ? pickRandom(fresh) : fillPlaceholders(pickRandom(bank), line)
}

// --- Fermetures --------------------------------------------------------------------------

/** Pas de fermeture avant ce nombre de trimestres en portefeuille : une seed ne meurt pas en 3 mois. */
const MIN_QUARTERS_BEFORE_SHUTDOWN = 3

/** Probabilité de fermeture d'une ligne déjà en difficulté (dernière évolution ▼). */
const SHUTDOWN_PROBABILITY: Record<LineDestiny, number> = {
  'fund-returner': 0,
  winner: 0,
  zombie: 0.05,
  wipeout: 0.35,
}

// --- Tours et follow-on ------------------------------------------------------------------

/** Délai minimal entre deux tours (trimestres). */
const MIN_QUARTERS_BETWEEN_ROUNDS = 3

/** Probabilité, une fois le délai passé, qu'une ligne lève ce trimestre. */
const ROUND_PROBABILITY: Record<LineDestiny, number> = {
  'fund-returner': 0.6,
  winner: 0.5,
  zombie: 0.35,
  wipeout: 0.3,
}

/** Multiple de valorisation d'un tour (nouvelle post-money / valo actuelle). */
const ROUND_STEP_UP: Record<LineDestiny, [number, number]> = {
  'fund-returner': [2.4, 3.6],
  winner: [1.6, 2.4],
  zombie: [0.9, 1.25],
  wipeout: [0.6, 0.85],
}

/** Part de la nouvelle post-money levée à chaque tour — c'est aussi la dilution si on ne suit pas. */
const ROUND_DILUTION = 0.2

const NEXT_ROUND_LABEL: Record<string, string> = {
  'Pre-seed': 'Seed',
  Seed: 'Série A',
  'Série A': 'Série B',
  'Série B': 'Série C',
  'Série C': 'Série D',
}

function roundKindFor(stepUp: number): RoundKind {
  if (stepUp >= 1.3) return 'up-round'
  if (stepUp >= 0.95) return 'flat-round'
  return 'down-round'
}

function nextRoundLabel(current: string, kind: RoundKind): string {
  const base = current.replace(/ ext\.$/, '')
  // Un tour qui ne monte pas franchement n'ouvre pas le stade suivant : c'est une extension.
  if (kind !== 'up-round') return `${base} ext.`
  return NEXT_ROUND_LABEL[base] ?? base
}

export interface FollowOnOffer {
  lineId: string
  kind: RoundKind
  fromRound: string
  toRound: string
  previousValuation: number
  newValuation: number
  /** Ticket pro-rata : ce qu'il faut remettre pour garder sa part. */
  ticket: number
  ownershipBefore: number
  /** Part après le tour si le joueur ne suit pas. */
  ownershipIfDeclined: number
  note: string
}

// --- Tick trimestriel --------------------------------------------------------------------

export interface QuarterEvolution {
  lineId: string
  direction: LineEvolution['direction']
  text: string
}

export interface PortfolioQuarterReport {
  portfolio: PortfolioLine[]
  evolutions: QuarterEvolution[]
  followOns: FollowOnOffer[]
}

/**
 * Fait avancer chaque ligne active investie AVANT `quarter`. Une ligne qui lève un tour
 * n'a pas d'évolution ce trimestre : sa carte follow-on est la nouvelle.
 * La valorisation du tour est appliquée tout de suite ; la part détenue ne change qu'à la
 * décision du joueur (resolveFollowOn).
 */
export function advancePortfolio(portfolio: PortfolioLine[], quarter: number): PortfolioQuarterReport {
  const evolutions: QuarterEvolution[] = []
  const followOns: FollowOnOffer[] = []

  const next = portfolio.map((line): PortfolioLine => {
    if (!line.isActive || line.investedAtQuarter >= quarter) return line

    const quartersHeld = quarter - line.investedAtQuarter
    const lastDirection = line.evolutions.at(-1)?.direction

    // 1. Fermeture — seulement pour une ligne déjà en difficulté, jamais trop tôt.
    if (
      quartersHeld >= MIN_QUARTERS_BEFORE_SHUTDOWN &&
      lastDirection === 'down' &&
      Math.random() < SHUTDOWN_PROBABILITY[line.destiny]
    ) {
      const text = pickEvolutionText(line, 'shutdown')
      evolutions.push({ lineId: line.id, direction: 'shutdown', text })
      return {
        ...line,
        isActive: false,
        exitKind: 'shutdown',
        realizedValue: 0,
        evolutions: [...line.evolutions, { quarter, direction: 'shutdown', text }],
      }
    }

    // 2. Nouveau tour → carte follow-on.
    if (
      quarter - line.lastRoundQuarter >= MIN_QUARTERS_BETWEEN_ROUNDS &&
      Math.random() < ROUND_PROBABILITY[line.destiny]
    ) {
      const stepUp = between(...ROUND_STEP_UP[line.destiny])
      const kind = roundKindFor(stepUp)
      // Arrondi à 10k€ : à 100k€, un tour à la baisse sur une petite valo tombait trop bas.
      const newValuation = Math.round((line.valuation * stepUp) / 10_000) * 10_000
      const roundSize = newValuation * ROUND_DILUTION
      followOns.push({
        lineId: line.id,
        kind,
        fromRound: line.roundLabel,
        toRound: nextRoundLabel(line.roundLabel, kind),
        previousValuation: line.valuation,
        newValuation,
        ticket: Math.max(10_000, Math.round((line.ownership * roundSize) / 10_000) * 10_000),
        ownershipBefore: line.ownership,
        ownershipIfDeclined: line.ownership * (1 - ROUND_DILUTION),
        note: pickRandom(followOnRoundNotes[kind]),
      })
      return {
        ...line,
        valuation: newValuation,
        roundLabel: nextRoundLabel(line.roundLabel, kind),
        lastRoundQuarter: quarter,
      }
    }

    // 3. Évolution silencieuse.
    const direction = drawDirection(line.destiny)
    const text = pickEvolutionText(line, direction)
    evolutions.push({ lineId: line.id, direction, text })
    return {
      ...line,
      valuation: Math.round(line.valuation * between(...DIRECTION_MARKS[direction])),
      evolutions: [...line.evolutions, { quarter, direction, text }],
    }
  })

  return { portfolio: next, evolutions, followOns }
}

export type FollowOnDecision = 'follow' | 'decline'

/**
 * Suivre : le ticket s'ajoute au capital investi, la part est préservée.
 * Refuser : la part est diluée par le tour (décision utilisateur 2026-09-27 — dilution
 * seule, pas d'autre pénalité).
 */
export function resolveFollowOn(
  line: PortfolioLine,
  offer: FollowOnOffer,
  decision: FollowOnDecision,
): PortfolioLine {
  if (decision === 'follow') {
    return { ...line, investedAmount: line.investedAmount + offer.ticket }
  }
  return { ...line, ownership: offer.ownershipIfDeclined }
}

/** « Revoir DD » (§3.5) : révèle tous les signaux de la ligne, équipe comme trompeurs. */
export function reviewDueDiligence(line: PortfolioLine): PortfolioLine {
  return {
    ...line,
    ddRevealed: true,
    knownTeamSignals: line.deal.tags.filter((t) => t.family === 'equipe'),
  }
}

// --- Effet d'une crise sur la trajectoire (§3.6) -----------------------------------------

export type CrisisLineEffect = 'strengthen' | 'weaken' | 'none'

const DESTINY_LADDER: LineDestiny[] = ['wipeout', 'zombie', 'winner', 'fund-returner']

function shiftDestiny(destiny: LineDestiny, step: 1 | -1): LineDestiny {
  const index = DESTINY_LADDER.indexOf(destiny) + step
  return DESTINY_LADDER[Math.max(0, Math.min(DESTINY_LADDER.length - 1, index))]
}

/**
 * Une crise bien gérée consolide la ligne ; mal gérée, elle la fait décrocher d'un cran
 * de destinée — c'est ce qui donne un poids réel aux décisions de crise sur le TVPI final.
 */
export function applyCrisisEffect(line: PortfolioLine, effect: CrisisLineEffect): PortfolioLine {
  if (effect === 'none') return line
  if (effect === 'strengthen') {
    return {
      ...line,
      valuation: Math.round(line.valuation * 1.1),
      // Un soutien bien placé sauve une ligne condamnée, sans en faire un fund-returner.
      destiny: line.destiny === 'wipeout' ? 'zombie' : line.destiny,
    }
  }
  return {
    ...line,
    valuation: Math.round(line.valuation * 0.7),
    destiny: shiftDestiny(line.destiny, -1),
  }
}
