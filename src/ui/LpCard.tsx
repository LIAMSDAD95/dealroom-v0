import type { LpArchetype } from '../signals-content/types'
import type { LpOffer } from '../game-loop/lp-pool'
import { Icon } from './Icon'
import styles from './LpCard.module.css'

interface LpCardProps {
  index: number
  archetype: LpArchetype
  offer: LpOffer
  /** Alterne le fond stone/forest en damier sur la grille (pas lié au statut). */
  tone: 'stone' | 'forest'
  onPitch: () => void
}

function formatCapital(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M€`
  }
  return `${Math.round(amount / 1_000)}K€`
}

export function LpCard({ index, archetype, offer, tone, onPitch }: LpCardProps) {
  if (offer.status === 'locked') {
    return (
      <article className={styles.card} data-tone="locked">
        <span className={styles.catalogIndex}>{String(index).padStart(2, '0')}</span>
        <h3 className={styles.name}>{offer.name}</h3>
        <p className={styles.subtitle}>{archetype.label}</p>
        <p className={styles.lockNote}>
          <Icon name="lock" size={18} />
          {offer.lockedReason}
        </p>
        <button type="button" className={styles.actionButton} disabled>
          Indisponible
        </button>
      </article>
    )
  }

  return (
    <article className={styles.card} data-tone={tone}>
      <span className={styles.catalogIndex}>{String(index).padStart(2, '0')}</span>
      <h3 className={styles.name}>{offer.name}</h3>
      <p className={styles.subtitle}>{archetype.label}</p>
      <p className={styles.capital}>
        {formatCapital(offer.capitalMin)} – {formatCapital(offer.capitalMax)}
      </p>

      <div className={styles.constraints}>
        {offer.constraints.map((constraint) => (
          <p key={constraint.label} className={styles.constraint}>
            <Icon name={constraint.kind === 'bonus' ? 'network' : 'alert-circle'} size={17} />
            {constraint.label}
          </p>
        ))}
      </div>

      {offer.status === 'committed' ? (
        <button type="button" className={styles.actionButton} disabled>
          Déjà engagé — {formatCapital(offer.committedAmount ?? 0)}
        </button>
      ) : (
        <button type="button" className={`${styles.actionButton} ${styles.primary}`} onClick={onPitch}>
          Pitcher →
        </button>
      )}
    </article>
  )
}
