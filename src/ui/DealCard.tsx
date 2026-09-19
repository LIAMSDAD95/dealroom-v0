import { useEffect, useRef, useState } from 'react'
import type { Deal, DealTag } from '../game-loop/deal'
import type { DealCardStatus } from '../game-loop/deal-flow'
import { DEAL_CARD_TIMER_SECONDS, fixedTicketForStage } from '../game-loop/deal-flow'
import { Icon } from './Icon'
import styles from './DealCard.module.css'

interface DealCardProps {
  index: number
  deal: Deal
  status: DealCardStatus
  /** true une fois que le joueur a creusé — révèle les tags équipe/trompeur de cette carte. */
  signalsRevealed: boolean
  /** Capital encore disponible sur le fonds levé — plafonne Investir et l'accès au pitch. */
  remainingCapital: number
  onDig: () => void
  onPass: () => void
  onInvest: () => void
  onJoinPitch: () => void
}

function formatCapital(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M€`
  }
  return `${Math.round(amount / 1_000)}K€`
}

// product-spec §3.3 : structurel toujours visible d'office, équipe/trompeur masqués tant
// que le joueur n'a pas creusé cette carte précise.
function isTagRevealed(tag: DealTag, signalsRevealed: boolean): boolean {
  return tag.family === 'structurel' || signalsRevealed
}

function DealTags({ tags, signalsRevealed }: { tags: DealTag[]; signalsRevealed: boolean }) {
  return (
    <div className={styles.tags}>
      {tags.map((tag) => {
        const revealed = isTagRevealed(tag, signalsRevealed)
        return (
          <span
            key={tag.label}
            className={styles.tag}
            data-family={revealed ? tag.family : undefined}
          >
            {!revealed && <Icon name="lock" size={12} />}
            {revealed ? tag.label : '???'}
          </span>
        )
      })}
    </div>
  )
}

export function DealCard({
  index,
  deal,
  status,
  signalsRevealed,
  remainingCapital,
  onDig,
  onPass,
  onInvest,
  onJoinPitch,
}: DealCardProps) {
  const [secondsLeft, setSecondsLeft] = useState(DEAL_CARD_TIMER_SECONDS)
  const onPassRef = useRef(onPass)
  onPassRef.current = onPass

  const ticket = fixedTicketForStage(deal.stage)
  const capitalExhausted = remainingCapital <= 0
  const ticketTooExpensive = ticket > remainingCapital

  // Chrono actif uniquement sur les cartes rapides pas encore décidées (product-spec §3.2).
  // Au timeout : auto-pass, jamais de pénalité.
  useEffect(() => {
    if (deal.isDevelopedScene || status === 'passed' || status === 'invested') return
    if (secondsLeft <= 0) {
      onPassRef.current()
      return
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [secondsLeft, deal.isDevelopedScene, status])

  const urgency = secondsLeft <= 10 ? 'danger' : secondsLeft <= 20 ? 'warning' : 'normal'

  if (deal.isDevelopedScene) {
    return (
      <article className={styles.card} data-pitch="true">
        <span className={styles.pitchRibbon}>PITCH</span>
        <span className={styles.catalogIndex}>{String(index).padStart(2, '0')}</span>
        <h3 className={styles.name}>{deal.companyName}</h3>
        <p className={styles.subtitle}>
          {deal.founderName} · {deal.pitch}
        </p>

        <div className={styles.specs}>
          <div className={styles.spec}>
            <span className={styles.specLabel}>STADE</span>
            <span className={styles.specValue}>{deal.stage.toUpperCase()}</span>
          </div>
          <div className={styles.spec}>
            <span className={styles.specLabel}>TICKER</span>
            <span className={styles.specValue}>{deal.ticker}</span>
          </div>
          <div className={styles.spec}>
            <span className={styles.specLabel}>MONTANT</span>
            <span className={styles.specValue}>{formatCapital(ticket)}</span>
          </div>
        </div>

        <DealTags tags={deal.tags} signalsRevealed={false} />

        <button
          type="button"
          className={styles.pitchButton}
          disabled={capitalExhausted}
          onClick={onJoinPitch}
        >
          {capitalExhausted ? 'Capital épuisé' : 'Rejoindre le pitch →'}
        </button>
      </article>
    )
  }

  const isPassed = status === 'passed'

  return (
    <article className={styles.card}>
      <div className={styles.timerBar} data-urgency={urgency}>
        <div
          className={styles.timerFill}
          style={{ width: `${(secondsLeft / DEAL_CARD_TIMER_SECONDS) * 100}%` }}
        />
      </div>

      <div className={styles.top}>
        <span className={styles.catalogIndex}>{String(index).padStart(2, '0')}</span>
        <span className={styles.timerLabel} data-urgency={urgency}>
          {secondsLeft}s
        </span>
      </div>

      <h3 className={styles.name}>{deal.companyName}</h3>
      <p className={styles.subtitle}>{deal.pitch}</p>
      <p className={styles.askAmount}>Recherche {formatCapital(ticket)}</p>

      <DealTags tags={deal.tags} signalsRevealed={signalsRevealed} />

      <div className={styles.actions}>
        {isPassed ? (
          <button type="button" className={styles.passedButton} disabled>
            Opportunité écartée
          </button>
        ) : (
          <>
            <button type="button" className={styles.passButton} onClick={onPass}>
              Passer
            </button>
            {status === 'dug' ? (
              <button
                type="button"
                className={styles.investButton}
                disabled={ticketTooExpensive}
                onClick={onInvest}
              >
                {ticketTooExpensive
                  ? 'Capital insuffisant'
                  : `Investir (${formatCapital(ticket)})`}
              </button>
            ) : (
              <button type="button" className={styles.digButton} onClick={onDig}>
                Creuser (-1)
              </button>
            )}
          </>
        )}
      </div>
    </article>
  )
}
