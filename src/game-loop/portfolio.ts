// Portefeuille du fonds — les lignes investies au fil des trimestres. Domaine Game Loop.
// Une ligne garde la trace du deal d'origine et des signaux équipe révélés au moment de
// l'investissement : c'est ce qui rend la prédiction de crise fiable ou non (§3.6).

import type { Deal, DealTag } from './deal'

export interface PortfolioLine {
  /** Reprend l'id du deal investi. */
  id: string
  deal: Deal
  /** Montant réellement engagé sur cette ligne. */
  investedAmount: number
  /** Trimestre auquel l'investissement a été fait. */
  investedAtQuarter: number
  /** Signaux équipe connus au moment d'investir — détermine la fiabilité de la prédiction (§3.6). */
  knownTeamSignals: DealTag[]
  /** false une fois la ligne sortie du portefeuille actif (atterrissage en douceur, §3.6). */
  isActive: boolean
}

export function createPortfolioLine(
  deal: Deal,
  investedAmount: number,
  quarter: number,
  signalsRevealed: boolean,
): PortfolioLine {
  return {
    id: deal.id,
    deal,
    investedAmount,
    investedAtQuarter: quarter,
    // Si le joueur n'a pas creusé (ni mené la scène de dialogue), il investit à l'aveugle :
    // aucun signal équipe connu, donc prédiction de crise peu fiable plus tard.
    knownTeamSignals: signalsRevealed ? deal.tags.filter((t) => t.family === 'equipe') : [],
    isActive: true,
  }
}

export function activeLines(portfolio: PortfolioLine[]): PortfolioLine[] {
  return portfolio.filter((line) => line.isActive)
}
