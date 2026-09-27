// Clôture de run — product-spec §3.8. Domaine Game Loop : dénouement accéléré du
// portefeuille (option A, decisions.md 2026-09-27), mesures finales du fonds.
// Les textes de sortie viennent de Signals & Content (closing-content.ts).
//
// Au Q8, un fonds réel n'a presque rien réalisé. Le dénouement projette donc chaque ligne
// encore active jusqu'à sa sortie, selon sa destinée cachée : c'est là que la loi de
// puissance se révèle et que le DPI devient significatif.

import type { LineDestiny, PortfolioLine } from './portfolio'

export type ExitKind =
  | 'ipo'
  | 'acquisition'
  | 'acquihire'
  /** Toujours en portefeuille à la clôture — valeur latente, non réalisée. */
  | 'held'
  | 'shutdown'
  /** Sortie anticipée pendant le run (atterrissage en douceur, §3.6). */
  | 'soft-landing'

export interface LineOutcome {
  line: PortfolioLine
  kind: ExitKind
  /** Valeur finale revenant au fonds. */
  value: number
  multiple: number
  realized: boolean
}

function between(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/**
 * Multiple appliqué à la valorisation actuelle jusqu'à la sortie, et dilution des tours
 * futurs d'ici là. Calibrage : voir la simulation consignée dans decisions.md.
 */
const EXIT_GROWTH: Record<LineDestiny, [number, number]> = {
  'fund-returner': [4, 9],
  winner: [1.6, 3],
  zombie: [0.3, 1],
  wipeout: [0, 0],
}

/** Part conservée après les tours levés entre la clôture et la sortie. */
const FUTURE_DILUTION: Record<LineDestiny, number> = {
  'fund-returner': 0.65,
  winner: 0.8,
  zombie: 1,
  wipeout: 1,
}

/** Une ligne zombie sur deux est encore en portefeuille à la clôture. */
const ZOMBIE_HELD_PROBABILITY = 0.5
/** Décote d'une ligne zombie restée en portefeuille (marque prudente). */
const ZOMBIE_HELD_MARK = 0.8

function projectActiveLine(line: PortfolioLine): LineOutcome {
  const { destiny } = line
  const currentValue = line.ownership * line.valuation

  if (destiny === 'wipeout') {
    return { line, kind: 'shutdown', value: 0, multiple: 0, realized: true }
  }

  if (destiny === 'zombie' && Math.random() < ZOMBIE_HELD_PROBABILITY) {
    const value = currentValue * ZOMBIE_HELD_MARK
    return { line, kind: 'held', value, multiple: value / line.investedAmount, realized: false }
  }

  const value = currentValue * between(...EXIT_GROWTH[destiny]) * FUTURE_DILUTION[destiny]
  const kind: ExitKind =
    destiny === 'fund-returner'
      ? Math.random() < 0.4
        ? 'ipo'
        : 'acquisition'
      : destiny === 'winner'
        ? 'acquisition'
        : 'acquihire'
  return { line, kind, value, multiple: value / line.investedAmount, realized: true }
}

/** Dénouement : chaque ligne reçoit son issue finale. Les lignes déjà sorties gardent la leur. */
export function resolveRunClose(portfolio: PortfolioLine[]): LineOutcome[] {
  return portfolio.map((line) => {
    if (!line.isActive) {
      const kind: ExitKind = line.exitKind === 'soft-landing' ? 'soft-landing' : 'shutdown'
      return {
        line,
        kind,
        value: line.realizedValue,
        multiple: line.investedAmount > 0 ? line.realizedValue / line.investedAmount : 0,
        realized: true,
      }
    }
    return projectActiveLine(line)
  })
}

/** Seuil de multiple à partir duquel une ligne « rembourse le fonds » à elle seule (§1). */
export function isFundReturner(outcome: LineOutcome, invested: number): boolean {
  return invested > 0 && outcome.value >= invested
}

export interface ClosingMetrics {
  invested: number
  totalValue: number
  realizedValue: number
  tvpi: number
  dpi: number
  fundReturners: number
}

export function closingMetrics(outcomes: LineOutcome[]): ClosingMetrics {
  const invested = outcomes.reduce((sum, o) => sum + o.line.investedAmount, 0)
  const totalValue = outcomes.reduce((sum, o) => sum + o.value, 0)
  const realizedValue = outcomes.filter((o) => o.realized).reduce((sum, o) => sum + o.value, 0)
  return {
    invested,
    totalValue,
    realizedValue,
    tvpi: invested > 0 ? totalValue / invested : 0,
    dpi: invested > 0 ? realizedValue / invested : 0,
    fundReturners: outcomes.filter((o) => isFundReturner(o, invested)).length,
  }
}
