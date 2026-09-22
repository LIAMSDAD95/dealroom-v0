import { useState } from 'react'
import type { Deal } from '../game-loop/deal'
import type { DealCardStatus } from '../game-loop/deal-flow'
import { QUARTERS_PER_RUN } from '../game-loop/fund'
import type { LpOffer } from '../game-loop/lp-pool'
import { STARTING_BANDWIDTH } from '../game-loop/resources'
import { AppHeader } from './AppHeader'
import { DealCard } from './DealCard'
import { FounderScene } from './FounderScene'
import styles from './DealFlowScreen.module.css'
import { LpBadge } from './LpBadge'
import { SectionLabel } from './SectionLabel'

interface DealFlowScreenProps {
  deals: Deal[]
  offers: LpOffer[]
  /** Numéro du trimestre en cours, de 1 à QUARTERS_PER_RUN (product-spec §2). */
  quarter: number
  /** Capital déjà déployé sur les trimestres précédents — cumulé sur tout le run. */
  deployedCapital: number
  /** Remonte chaque investissement pour que le cumul survive au changement de trimestre. */
  onCapitalDeployed: (amount: number) => void
  /** Clôture le trimestre : nouveau deal flow, bande passante réinitialisée. */
  onAdvanceQuarter: () => void
  /** Clôture le fonds au dernier trimestre. */
  onCloseFund: () => void
}

function formatCapital(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M€`
  }
  return `${Math.round(amount / 1_000)}K€`
}

export function DealFlowScreen({
  deals,
  offers,
  quarter,
  deployedCapital,
  onCapitalDeployed,
  onAdvanceQuarter,
  onCloseFund,
}: DealFlowScreenProps) {
  const [statuses, setStatuses] = useState<Record<string, DealCardStatus>>(() =>
    Object.fromEntries(deals.map((d) => [d.id, 'pending'])),
  )
  // Creuser (-1 bande passante) révèle les signaux équipe/trompeurs (product-spec §3.2) —
  // suivi séparément de `deals` (donnée statique) pour ne pas muter la source de vérité.
  const [digDealIds, setDigDealIds] = useState<Set<string>>(new Set())
  const [bandwidth, setBandwidth] = useState(STARTING_BANDWIDTH)
  const [pitchingDealId, setPitchingDealId] = useState<string | null>(null)

  const committedOffers = offers.filter((o) => o.status === 'committed')
  const totalRaised = committedOffers.reduce((sum, o) => sum + (o.committedAmount ?? 0), 0)

  function handleDig(dealId: string) {
    if (bandwidth <= 0) return
    setBandwidth((b) => b - 1)
    setStatuses((s) => ({ ...s, [dealId]: 'dug' }))
    setDigDealIds((ids) => new Set(ids).add(dealId))
  }

  function handlePass(dealId: string) {
    setStatuses((s) => (s[dealId] === 'pending' || s[dealId] === 'dug' ? { ...s, [dealId]: 'passed' } : s))
  }

  const remainingCapital = totalRaised - deployedCapital
  const pitchingDeal = deals.find((d) => d.id === pitchingDealId) ?? null
  const isLastQuarter = quarter >= QUARTERS_PER_RUN

  function handleInvest(dealId: string) {
    const deal = deals.find((d) => d.id === dealId)
    if (!deal) return
    // Ne jamais dépasser le capital réellement levé auprès des LPs (retour utilisateur 2026-09-19).
    if (deal.askAmount > remainingCapital) return
    onCapitalDeployed(deal.askAmount)
    setStatuses((s) => ({ ...s, [dealId]: 'invested' }))
  }

  return (
    <main className={styles.screen}>
      <AppHeader
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
              <span className={styles.capitalValue}>
                {formatCapital(deployedCapital)} / {formatCapital(totalRaised)}
              </span>
              <div className={styles.capitalTrack}>
                <div
                  className={styles.capitalFill}
                  style={{
                    width: `${totalRaised > 0 ? Math.min(100, (deployedCapital / totalRaised) * 100) : 0}%`,
                  }}
                />
              </div>
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
              <span className={styles.quarterValue}>
                Q{quarter} <span className={styles.quarterTotal}>/ {QUARTERS_PER_RUN}</span>
              </span>
            </div>
          </>
        }
      />

      <div className={styles.content}>
        <p className={styles.eyebrow}>TRIMESTRE {quarter}</p>
        <h1 className={styles.title}>DEAL FLOW</h1>
        <p className={styles.subtitle}>{deals.length} opportunités à l'étude</p>

        <div className={styles.sectionSpacer}>
          <SectionLabel icon="bar-chart">STARTUPS À L'ÉTUDE</SectionLabel>
          <div className={styles.grid}>
            {deals.map((deal, i) => (
              <DealCard
                key={deal.id}
                index={i + 1}
                deal={deal}
                status={statuses[deal.id]}
                signalsRevealed={digDealIds.has(deal.id)}
                remainingCapital={remainingCapital}
                onDig={() => handleDig(deal.id)}
                onPass={() => handlePass(deal.id)}
                onInvest={() => handleInvest(deal.id)}
                onJoinPitch={() => {
                  if (remainingCapital <= 0) return
                  setPitchingDealId(deal.id)
                }}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className={styles.advanceButton}
          onClick={isLastQuarter ? onCloseFund : onAdvanceQuarter}
        >
          {isLastQuarter ? 'Clôturer le fonds →' : `Passer au trimestre ${quarter + 1} →`}
        </button>
      </div>

      {pitchingDeal && (
        <FounderScene
          // key : instance fraîche à chaque nouveau fondateur pitché, sinon l'état de la
          // scène précédente persiste (voir Claude/memory/learnings.md, 2026-09-15).
          key={pitchingDeal.id}
          deal={pitchingDeal}
          remainingCapital={remainingCapital}
          onClose={() => setPitchingDealId(null)}
          onInvest={(dealId) => {
            handleInvest(dealId)
            setPitchingDealId(null)
          }}
        />
      )}
    </main>
  )
}
