import type { Deal } from '../game-loop/deal'
import type { TicketRange } from '../game-loop/founder-scene'
import { MAX_FUND_OWNERSHIP, ownershipForTicket, TICKET_STEP } from '../game-loop/founder-scene'
import { useTour } from './onboarding/onboarding-context'
import styles from './TicketSlider.module.css'

interface TicketSliderProps {
  deal: Deal
  range: TicketRange
  value: number
  onChange: (amount: number) => void
}

function formatCapital(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}M€`
  }
  return `${Math.round(amount / 1_000)}K€`
}

function formatShare(share: number): string {
  return `${(share * 100).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`
}

/**
 * Ticket ajustable en sortie de scène fondateur — product-spec §3.4 : curseur entre le
 * minimum « pris au sérieux » et le maximum (capital restant ou seuil de dilution),
 * avec le montant, la part obtenue et un indicateur de dilution.
 */
export function TicketSlider({ deal, range, value, onChange }: TicketSliderProps) {
  useTour('founder-ticket')
  const share = ownershipForTicket(deal, value)
  // Jauge de dilution : 100 % = seuil au-delà duquel le fondateur refuse.
  const dilutionFill = Math.min(100, (share / MAX_FUND_OWNERSHIP) * 100)
  const nearCeiling = dilutionFill >= 85

  return (
    <div className={styles.slider} data-onboarding="founder-ticket">
      <div className={styles.readout}>
        <div className={styles.item}>
          <span className={styles.label}>Ton ticket</span>
          <span className={styles.amount}>{formatCapital(value)}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Part obtenue</span>
          <span className={styles.amount}>{formatShare(share)}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Demandé</span>
          <span className={styles.muted}>{formatCapital(deal.askAmount)}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Valo post-money</span>
          <span className={styles.muted}>{formatCapital(deal.postMoney)}</span>
        </div>
      </div>

      <input
        type="range"
        className={styles.range}
        min={range.min}
        max={range.max}
        step={TICKET_STEP}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Montant du ticket"
      />
      <div className={styles.bounds}>
        <span>{formatCapital(range.min)} · minimum pris au sérieux</span>
        <span>
          {formatCapital(range.max)} ·{' '}
          {range.cappedByDilution ? 'seuil de dilution' : 'capital restant'}
        </span>
      </div>

      <div className={styles.dilution}>
        <div className={styles.dilutionHead}>
          <span className={styles.label}>Dilution du fondateur</span>
          <span className={styles.dilutionValue} data-near={nearCeiling || undefined}>
            {formatShare(share)} / {formatShare(MAX_FUND_OWNERSHIP)} max
          </span>
        </div>
        <div className={styles.dilutionTrack}>
          <div
            className={styles.dilutionFill}
            data-near={nearCeiling || undefined}
            style={{ width: `${dilutionFill}%` }}
          />
        </div>
        <p className={styles.dilutionNote}>
          Au-delà de {formatShare(MAX_FUND_OWNERSHIP)} du capital, le fondateur refuse : il veut
          garder la main sur sa société.
        </p>
      </div>
    </div>
  )
}
