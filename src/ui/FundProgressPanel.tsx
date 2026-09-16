import type { LpOffer } from '../game-loop/lp-pool'
import styles from './FundProgressPanel.module.css'

interface FundProgressPanelProps {
  offers: LpOffer[]
  target: number
}

function formatMillions(amount: number): string {
  return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M€`
}

export function FundProgressPanel({ offers, target }: FundProgressPanelProps) {
  const committed = offers.filter((offer) => offer.status === 'committed')
  const totalCommitted = committed.reduce((sum, offer) => sum + (offer.committedAmount ?? 0), 0)
  const progressPercent = Math.min(100, Math.round((totalCommitted / target) * 100))

  return (
    <div className={styles.panel}>
      <div className={styles.top}>
        <span className={styles.value}>
          {formatMillions(totalCommitted)} / {formatMillions(target)}
        </span>
        <span className={styles.sub}>
          visés · {committed.length} LP{committed.length > 1 ? 's' : ''} engagé
          {committed.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${progressPercent}%` }} />
      </div>

      <div className={styles.committedChips}>
        {committed.map((offer) => (
          <span key={offer.id} className={styles.committedChip}>
            ✓ {offer.name} — {formatMillions(offer.committedAmount ?? 0)}
          </span>
        ))}
      </div>
    </div>
  )
}
