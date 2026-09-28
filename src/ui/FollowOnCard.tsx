import type { FollowOnDecision, FollowOnOffer } from '../game-loop/portfolio-evolution'
import type { PortfolioLine } from '../game-loop/portfolio'
import { followOnDdNotes } from '../signals-content/portfolio-evolutions'
import { Icon } from './Icon'
import { useTour } from './onboarding/onboarding-context'
import styles from './FollowOnCard.module.css'

interface FollowOnCardProps {
  line: PortfolioLine
  offer: FollowOnOffer
  /** Décision déjà prise sur cette carte ce trimestre, ou undefined tant qu'elle est ouverte. */
  decision?: FollowOnDecision
  remainingCapital: number
  bandwidth: number
  /** false avec le perk « Discipline de réserve » (§3.7). */
  reviewCostsBandwidth?: boolean
  onReviewDd: () => void
  onDecide: (decision: FollowOnDecision) => void
}

function formatCapital(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M€`
  }
  return `${Math.round(amount / 1_000)}K€`
}

function formatOwnership(share: number): string {
  return `${(share * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}%`
}

/**
 * Carte follow-on — product-spec §3.5, maquette vc-techwear-portfolio_3.html. Même grammaire
 * que les cartes du deal flow (gris, bordure noire, ombre franche) : c'est une décision
 * active. La 4e colonne « Fenêtre » de la maquette est remplacée par la part détenue et sa
 * dilution en cas de refus (decisions.md, 2026-09-27).
 */
export function FollowOnCard({
  line,
  offer,
  decision,
  remainingCapital,
  bandwidth,
  reviewCostsBandwidth = true,
  onReviewDd,
  onDecide,
}: FollowOnCardProps) {
  // Demandée par chaque carte, dédoublonnée par le provider (§8.2).
  useTour('follow-on')
  const { deal } = line
  const isDownRound = offer.newValuation < offer.previousValuation
  const canFollow = offer.ticket <= remainingCapital
  // Structurels toujours visibles ; équipe/trompeurs seulement si la DD a été faite (§3.3).
  const visibleTags = line.ddRevealed ? deal.tags : deal.tags.filter((t) => t.family === 'structurel')
  const hiddenCount = deal.tags.length - visibleTags.length

  return (
    <article className={styles.card} data-decided={decision ?? undefined}>
      <span className={styles.ticker}>{deal.ticker}</span>
      <h3 className={styles.name}>{deal.companyName}</h3>
      <p className={styles.sub}>
        {deal.founderName} · {offer.fromRound} → {offer.toRound}
      </p>

      <div className={styles.specRow}>
        <div className={styles.spec}>
          <span className={styles.specLabel}>Valo. précédente</span>
          <span className={styles.specValue}>{formatCapital(offer.previousValuation)}</span>
        </div>
        <div className={styles.spec}>
          <span className={styles.specLabel}>Nouvelle valo.</span>
          <span className={styles.specValue} data-warn={isDownRound || undefined}>
            {formatCapital(offer.newValuation)}
          </span>
        </div>
        <div className={styles.spec}>
          <span className={styles.specLabel}>Ticket requis</span>
          <span className={styles.specValue}>{formatCapital(offer.ticket)}</span>
        </div>
        <div className={styles.spec}>
          <span className={styles.specLabel}>Capital restant</span>
          <span className={styles.specValue} data-warn={!canFollow || undefined}>
            {formatCapital(remainingCapital)}
          </span>
        </div>
        <div className={styles.spec}>
          <span className={styles.specLabel}>Ta part si refus</span>
          <span className={styles.specValue}>
            {formatOwnership(offer.ownershipBefore)} → {formatOwnership(offer.ownershipIfDeclined)}
          </span>
        </div>
      </div>

      <div className={styles.tags}>
        {visibleTags.map((tag) => (
          <span key={tag.label} className={styles.tag} data-family={tag.family}>
            {tag.label}
          </span>
        ))}
        {hiddenCount > 0 && (
          <span className={styles.tag}>
            <Icon name="lock" size={14} />
            {hiddenCount} signaux non creusés
          </span>
        )}
      </div>

      <p className={styles.note}>
        {offer.note} {line.ddRevealed ? followOnDdNotes.known : followOnDdNotes.blind}
      </p>

      <div className={styles.actions}>
        {decision === 'follow' && (
          <p className={styles.outcome} data-kind="follow">
            <Icon name="check" size={14} />
            Suivi — {formatCapital(offer.ticket)} investis, part maintenue à{' '}
            {formatOwnership(offer.ownershipBefore)}
          </p>
        )}
        {decision === 'decline' && (
          <p className={styles.outcome} data-kind="decline">
            Refusé — part diluée à {formatOwnership(offer.ownershipIfDeclined)}
          </p>
        )}
        {decision === undefined && (
          <>
            <button type="button" className={styles.declineButton} onClick={() => onDecide('decline')}>
              Refuser
            </button>
            <button
              type="button"
              className={styles.reviewButton}
              onClick={onReviewDd}
              disabled={line.ddRevealed || (reviewCostsBandwidth && bandwidth <= 0)}
              title={
                line.ddRevealed
                  ? 'Tous les signaux sont déjà révélés'
                  : reviewCostsBandwidth
                    ? 'Coûte 1 bande passante'
                    : 'Gratuit (Discipline de réserve)'
              }
            >
              {line.ddRevealed
                ? 'DD complète'
                : reviewCostsBandwidth
                  ? 'Revoir DD (-1)'
                  : 'Revoir DD (gratuit)'}
            </button>
            <button
              type="button"
              className={styles.followButton}
              onClick={() => onDecide('follow')}
              disabled={!canFollow}
            >
              {canFollow ? `Suivre — ${formatCapital(offer.ticket)} →` : 'Capital insuffisant'}
            </button>
          </>
        )}
      </div>
    </article>
  )
}
