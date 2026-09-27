// Portefeuille du fonds — les lignes investies au fil des trimestres. Domaine Game Loop.
// Une ligne garde la trace du deal d'origine et des signaux équipe révélés au moment de
// l'investissement : c'est ce qui rend la prédiction de crise fiable ou non (§3.6).
//
// Depuis le 2026-09-27, une ligne porte aussi une valorisation qui évolue chaque trimestre
// (§3.2 « évolutions silencieuses », §3.5 follow-on) et une destinée cachée tirée à
// l'investissement — voir portfolio-evolution.ts et Claude/memory/decisions.md.

import type { FounderArchetypeId } from '../signals-content/types'
import type { Deal, DealTag } from './deal'
import type { Stage } from './thesis'

/**
 * Trajectoire réelle de la startup, tirée une fois pour toutes à l'investissement selon
 * l'archétype du fondateur (loi de puissance). Jamais affichée : le joueur ne peut que
 * la déduire des signaux révélés, puis la voir se confirmer au fil des évolutions.
 */
export type LineDestiny = 'fund-returner' | 'winner' | 'zombie' | 'wipeout'

/** Sens d'une évolution trimestrielle — une nouvelle, jamais un score (règle #3). */
export type EvolutionDirection = 'up' | 'flat' | 'down'

/** Comment une ligne a quitté le portefeuille actif. */
export type LineExitKind = 'soft-landing' | 'shutdown'

export interface LineEvolution {
  quarter: number
  direction: EvolutionDirection | 'shutdown'
  text: string
}

export interface PortfolioLine {
  /** Reprend l'id du deal investi. */
  id: string
  deal: Deal
  /** Montant cumulé réellement engagé sur cette ligne (ticket initial + follow-on + bridge). */
  investedAmount: number
  /** Ticket d'entrée seul — sert à mesurer le rythme de déploiement (engagement LP). */
  initialTicket: number
  /** true si le joueur a investi sans creuser ni mener l'entretien (pari à l'aveugle). */
  investedBlind: boolean
  /** Trimestre auquel l'investissement a été fait. */
  investedAtQuarter: number
  /** Signaux équipe connus — détermine la fiabilité de la prédiction de crise (§3.6). */
  knownTeamSignals: DealTag[]
  /** true une fois tous les signaux de la ligne révélés (creuser, entretien ou « Revoir DD »). */
  ddRevealed: boolean
  /** false une fois la ligne sortie du portefeuille actif (atterrissage en douceur, fermeture). */
  isActive: boolean
  exitKind?: LineExitKind
  /** Capital rendu au fonds à la sortie — entre dans le DPI. 0 tant que la ligne est active. */
  realizedValue: number
  /** Part détenue par le fonds (0-1). Baisse si le joueur refuse un follow-on (dilution). */
  ownership: number
  /** Valorisation post-money actuelle de la startup. */
  valuation: number
  /** Libellé du dernier tour levé (« Seed », « Série A », « Seed ext. »…). */
  roundLabel: string
  /** Trimestre du dernier tour levé — un nouveau tour n'arrive pas avant quelques trimestres. */
  lastRoundQuarter: number
  destiny: LineDestiny
  /** Historique des évolutions silencieuses — relu par l'écran de clôture (§3.8). */
  evolutions: LineEvolution[]
}

// --- Valorisation d'entrée --------------------------------------------------------------

/** Part prise à l'entrée : fourchette réaliste pour un ticket de seed/pre-seed. */
const ENTRY_OWNERSHIP_MIN = 0.06
const ENTRY_OWNERSHIP_MAX = 0.12

export const STAGE_ROUND_LABELS: Record<Stage, string> = {
  'pre-seed': 'Pre-seed',
  seed: 'Seed',
  'series-a': 'Série A',
}

/**
 * Probabilités de destinée par archétype — c'est ici que vit la « vérité » que les signaux
 * équipe/trompeurs permettent de deviner. Calibrage (voir decisions.md 2026-09-27) :
 * les profils sous-estimés à la surface (bricoleur, vétérante) portent l'essentiel des
 * fund-returners ; les profils flatteurs (wunderkind, surfeur, duo) meurent souvent.
 * Chaque ligne : [fund-returner, winner, zombie, wipeout], somme = 1.
 */
const DESTINY_WEIGHTS: Record<FounderArchetypeId, [number, number, number, number]> = {
  'bricoleur-obsessionnel': [0.14, 0.3, 0.3, 0.26],
  'veterane-secteur': [0.1, 0.35, 0.33, 0.22],
  'wunderkind-pedigree': [0.03, 0.15, 0.32, 0.5],
  'surfeur-hype': [0.02, 0.12, 0.26, 0.6],
  'duo-fracture': [0.01, 0.12, 0.3, 0.57],
  // Archétypes hors Phase 0 — jamais tirés par le générateur, valeurs neutres par sécurité.
  rescape: [0.06, 0.22, 0.32, 0.4],
  'scientifique-transfuge': [0.06, 0.22, 0.32, 0.4],
  'vendeur-ne-sans-produit': [0.06, 0.22, 0.32, 0.4],
  'prophete-mission': [0.06, 0.22, 0.32, 0.4],
}

const DESTINIES: LineDestiny[] = ['fund-returner', 'winner', 'zombie', 'wipeout']

export function drawDestiny(archetypeId: FounderArchetypeId): LineDestiny {
  const weights = DESTINY_WEIGHTS[archetypeId]
  let roll = Math.random()
  for (let i = 0; i < DESTINIES.length; i++) {
    roll -= weights[i]
    if (roll < 0) return DESTINIES[i]
  }
  return 'wipeout'
}

export function createPortfolioLine(
  deal: Deal,
  investedAmount: number,
  quarter: number,
  signalsRevealed: boolean,
): PortfolioLine {
  const ownership =
    ENTRY_OWNERSHIP_MIN + Math.random() * (ENTRY_OWNERSHIP_MAX - ENTRY_OWNERSHIP_MIN)
  return {
    id: deal.id,
    deal,
    investedAmount,
    initialTicket: investedAmount,
    investedBlind: !signalsRevealed,
    investedAtQuarter: quarter,
    // Si le joueur n'a pas creusé (ni mené la scène de dialogue), il investit à l'aveugle :
    // aucun signal équipe connu, donc prédiction de crise peu fiable plus tard.
    knownTeamSignals: signalsRevealed ? deal.tags.filter((t) => t.family === 'equipe') : [],
    ddRevealed: signalsRevealed,
    isActive: true,
    realizedValue: 0,
    ownership,
    // Arrondi à 100k€ : une valo « propre », comme sur un term sheet.
    valuation: Math.round(investedAmount / ownership / 100_000) * 100_000,
    roundLabel: STAGE_ROUND_LABELS[deal.stage],
    lastRoundQuarter: quarter,
    destiny: drawDestiny(deal.founderArchetypeId),
    evolutions: [],
  }
}

export function activeLines(portfolio: PortfolioLine[]): PortfolioLine[] {
  return portfolio.filter((line) => line.isActive)
}

// --- Mesures du fonds -------------------------------------------------------------------

/** Valeur actuelle de la part du fonds dans une ligne (latente si active, réalisée sinon). */
export function lineValue(line: PortfolioLine): number {
  return line.isActive ? line.ownership * line.valuation : line.realizedValue
}

/** Multiple sur le capital investi dans cette ligne. */
export function lineMultiple(line: PortfolioLine): number {
  return line.investedAmount > 0 ? lineValue(line) / line.investedAmount : 0
}

export interface FundMetrics {
  invested: number
  /** Valeur latente des lignes actives. */
  residualValue: number
  /** Capital rendu par les lignes sorties. */
  realizedValue: number
  /** (réalisé + latent) / investi. */
  tvpi: number
  /** réalisé / investi. */
  dpi: number
  /** Lignes actives dont la dernière évolution est négative. */
  linesUnderStrain: number
}

export function fundMetrics(portfolio: PortfolioLine[]): FundMetrics {
  const invested = portfolio.reduce((sum, l) => sum + l.investedAmount, 0)
  const residualValue = activeLines(portfolio).reduce((sum, l) => sum + lineValue(l), 0)
  const realizedValue = portfolio
    .filter((l) => !l.isActive)
    .reduce((sum, l) => sum + l.realizedValue, 0)
  return {
    invested,
    residualValue,
    realizedValue,
    tvpi: invested > 0 ? (residualValue + realizedValue) / invested : 0,
    dpi: invested > 0 ? realizedValue / invested : 0,
    linesUnderStrain: activeLines(portfolio).filter(
      (l) => l.evolutions.at(-1)?.direction === 'down',
    ).length,
  }
}
