import { useState } from 'react'
import { QUARTERS_PER_RUN } from '../game-loop/fund'
import type { LpOffer } from '../game-loop/lp-pool'
import type { PortfolioLine } from '../game-loop/portfolio'
import { activeLines, fundMetrics } from '../game-loop/portfolio'
import type {
  FollowOnDecision,
  FollowOnOffer,
  QuarterEvolution,
} from '../game-loop/portfolio-evolution'
import { STARTING_BANDWIDTH } from '../game-loop/resources'
import { AppHeader } from './AppHeader'
import { FollowOnCard } from './FollowOnCard'
import { LpBadge } from './LpBadge'
import { SectionLabel } from './SectionLabel'
import styles from './PortfolioScreen.module.css'

interface PortfolioScreenProps {
  quarter: number
  portfolio: PortfolioLine[]
  evolutions: QuarterEvolution[]
  followOns: FollowOnOffer[]
  offers: LpOffer[]
  deployedCapital: number
  /** Bande passante restante ce trimestre — « Revoir DD » en coûte 1. */
  bandwidth: number
  /** false avec le perk « Discipline de réserve » (§3.7) : revoir la DD est gratuit. */
  reviewCostsBandwidth?: boolean
  portfolioCount?: number
  onOpenPortfolio?: () => void
  onReviewDd: (lineId: string) => void
  onFollowOnDecided: (offer: FollowOnOffer, decision: FollowOnDecision) => void
  /** Toutes les décisions follow-on prises : on passe à la suite du trimestre. */
  onContinue: () => void
}

function formatCapital(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M€`
  }
  return `${Math.round(amount / 1_000)}K€`
}

const DIRECTION_BADGES: Record<QuarterEvolution['direction'], string> = {
  up: '▲ POSITIF',
  flat: '— STABLE',
  down: '▼ NÉGATIF',
  shutdown: '✕ FERMÉE',
}

/**
 * Rapport de portefeuille en début de trimestre — product-spec §3.2.1, maquette
 * vc-techwear-portfolio_3.html. Trois étages : bilan chiffré (panneau clair), évolutions
 * silencieuses (panneau sourd, informatif) et cartes follow-on (seules décisions de l'écran).
 */
export function PortfolioScreen({
  quarter,
  portfolio,
  evolutions,
  followOns,
  offers,
  deployedCapital,
  bandwidth,
  reviewCostsBandwidth = true,
  portfolioCount,
  onOpenPortfolio,
  onReviewDd,
  onFollowOnDecided,
  onContinue,
}: PortfolioScreenProps) {
  const [decisions, setDecisions] = useState<Record<string, FollowOnDecision>>({})

  const committedOffers = offers.filter((o) => o.status === 'committed')
  const totalRaised = committedOffers.reduce((sum, o) => sum + (o.committedAmount ?? 0), 0)
  const remainingCapital = totalRaised - deployedCapital
  const metrics = fundMetrics(portfolio)
  const lineById = new Map(portfolio.map((line) => [line.id, line]))
  const pendingCount = followOns.filter((o) => decisions[o.lineId] === undefined).length

  function decide(offer: FollowOnOffer, decision: FollowOnDecision) {
    if (decisions[offer.lineId] !== undefined) return
    if (decision === 'follow' && offer.ticket > remainingCapital) return
    setDecisions((d) => ({ ...d, [offer.lineId]: decision }))
    onFollowOnDecided(offer, decision)
  }

  return (
    <main className={styles.screen}>
      <AppHeader
        portfolioCount={portfolioCount}
        onOpenPortfolio={onOpenPortfolio}
        badges={
          <div className={styles.lpBadges}>
            {committedOffers.map((offer) => (
              <LpBadge key={offer.id} name={offer.name} />
            ))}
          </div>
        }
        resources={
          <>
            <div className={styles.resource}>
              <span className={styles.resourceLabel}>CAPITAL DÉPLOYÉ</span>
              <span className={styles.resourceValue}>
                {formatCapital(deployedCapital)} / {formatCapital(totalRaised)}
              </span>
            </div>
            <div className={styles.resource}>
              <span className={styles.resourceLabel}>BANDE PASSANTE</span>
              <div className={styles.bandwidthDots}>
                {Array.from({ length: STARTING_BANDWIDTH }, (_, i) => (
                  <span key={i} className={styles.dot} data-filled={i < bandwidth} />
                ))}
              </div>
            </div>
            <div className={styles.resource}>
              <span className={styles.resourceLabel}>TRIMESTRE</span>
              <span className={styles.resourceValue}>
                Q{quarter} <span className={styles.resourceTotal}>/ {QUARTERS_PER_RUN}</span>
              </span>
            </div>
          </>
        }
      />

      <div className={styles.content}>
        <p className={styles.eyebrow}>TRIMESTRE {quarter}</p>
        <h1 className={styles.title}>PORTEFEUILLE</h1>
        <p className={styles.subtitle}>{activeLines(portfolio).length} LIGNES ACTIVES</p>

        <section className={styles.section}>
          <SectionLabel icon="bar-chart">BILAN DU TRIMESTRE</SectionLabel>
          <div className={styles.statsPanel}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>TVPI estimé</span>
              <span className={styles.statValue}>
                {metrics.tvpi.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                <span className={styles.statUnit}>×</span>
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Capital investi</span>
              <span className={styles.statValue}>{formatCapital(metrics.invested)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Valeur estimée</span>
              <span className={styles.statValue}>
                {formatCapital(metrics.residualValue + metrics.realizedValue)}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Lignes en tension</span>
              <span className={styles.statValue}>{metrics.linesUnderStrain}</span>
            </div>
          </div>
        </section>

        {evolutions.length > 0 && (
          <section className={styles.section}>
            <SectionLabel icon="activity">ÉVOLUTIONS SILENCIEUSES</SectionLabel>
            <div className={styles.evoPanel}>
              {evolutions.map((evolution) => {
                const line = lineById.get(evolution.lineId)
                if (!line) return null
                return (
                  <div key={evolution.lineId} className={styles.evoRow}>
                    <span className={styles.evoTicker}>{line.deal.ticker}</span>
                    <span className={styles.evoName}>{line.deal.companyName}</span>
                    <span className={styles.evoNote}>{evolution.text}</span>
                    <span className={styles.delta} data-direction={evolution.direction}>
                      {DIRECTION_BADGES[evolution.direction]}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {followOns.length > 0 && (
          <section className={styles.section}>
            <SectionLabel icon="layers">
              {`OPPORTUNITÉS DE FOLLOW-ON — ${followOns.length} DÉCISION${followOns.length > 1 ? 'S' : ''}`}
            </SectionLabel>
            <div className={styles.foGrid}>
              {followOns.map((offer) => {
                const line = lineById.get(offer.lineId)
                if (!line) return null
                return (
                  <FollowOnCard
                    key={offer.lineId}
                    line={line}
                    offer={offer}
                    decision={decisions[offer.lineId]}
                    remainingCapital={remainingCapital}
                    bandwidth={bandwidth}
                    reviewCostsBandwidth={reviewCostsBandwidth}
                    onReviewDd={() => {
                      if ((reviewCostsBandwidth && bandwidth <= 0) || line.ddRevealed) return
                      onReviewDd(line.id)
                    }}
                    onDecide={(decision) => decide(offer, decision)}
                  />
                )
              })}
            </div>
          </section>
        )}

        <button
          type="button"
          className={styles.continueButton}
          onClick={onContinue}
          // Jamais d'enchaînement implicite : chaque follow-on attend une décision explicite.
          disabled={pendingCount > 0}
        >
          {pendingCount > 0
            ? `Décide ${pendingCount > 1 ? `des ${pendingCount} follow-on` : 'du follow-on'} pour continuer`
            : 'Passer au deal flow →'}
        </button>
      </div>
    </main>
  )
}
