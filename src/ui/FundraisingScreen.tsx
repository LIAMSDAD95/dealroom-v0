import { useState } from 'react'
import { FUND_I_TARGET } from '../game-loop/fund'
import type { LpOffer, LpPitchRecord } from '../game-loop/lp-pool'
import type { Thesis } from '../game-loop/thesis'
import { lpArchetypes } from '../signals-content/lps'
import type { PitchAngle } from '../signals-content/types'
import { AppHeader } from './AppHeader'
import { FundProgressPanel } from './FundProgressPanel'
import { LpCard } from './LpCard'
import styles from './FundraisingScreen.module.css'
import { PitchScene } from './PitchScene'
import { SectionLabel } from './SectionLabel'
import { useTour } from './onboarding/onboarding-context'
import { ThesisSummaryPanel } from './ThesisSummaryPanel'

interface FundraisingScreenProps {
  thesis: Thesis
  offers: LpOffer[]
  onOfferCommitted: (offerId: string, amount: number, record: LpPitchRecord) => void
  onProceedToQuarterOne: () => void
  /** Angles de pitch ouverts par la réputation (§3.7). */
  unlockedAngles: PitchAngle[]
  /** Perk « Premier fonds bouclé ». */
  confidenceBonus: number
  /** Numéro du fonds levé (« Fonds II »…). */
  fundLabel: string
}

export function FundraisingScreen({
  thesis,
  offers,
  onOfferCommitted,
  onProceedToQuarterOne,
  unlockedAngles,
  confidenceBonus,
  fundLabel,
}: FundraisingScreenProps) {
  useTour('fundraising')
  const [pitchingOfferId, setPitchingOfferId] = useState<string | null>(null)
  const pitchingOffer = offers.find((o) => o.id === pitchingOfferId) ?? null
  const pitchingArchetype = pitchingOffer
    ? lpArchetypes.find((a) => a.id === pitchingOffer.archetypeId)
    : null
  // product-spec §3.1.4 autorise techniquement d'avancer sous la cible, mais décision produit
  // (Claude/memory/decisions.md 2026-09-19) : au moins 1 LP engagé requis pour continuer.
  const hasCommittedOffer = offers.some((o) => o.status === 'committed')

  return (
    <main className={styles.screen}>
      <AppHeader />

      <div className={styles.content}>
        <p className={styles.eyebrow}>FONDATION DU FONDS {fundLabel}</p>
        <h1 className={styles.title}>LEVÉE DE FONDS</h1>

        <div className={styles.sectionSpacer}>
          <SectionLabel icon="bar-chart">THÈSE D'INVESTISSEMENT</SectionLabel>
          <ThesisSummaryPanel thesis={thesis} />
        </div>

        <div className={styles.sectionSpacer} data-onboarding="fund-progress">
          <SectionLabel icon="zap">PROGRESSION DU FONDS</SectionLabel>
          <FundProgressPanel offers={offers} target={FUND_I_TARGET} />
        </div>

        <div className={styles.sectionSpacer}>
          <SectionLabel icon="users">LPS DISPONIBLES</SectionLabel>
          <div className={styles.grid} data-onboarding="lp-grid">
            {offers.map((offer, i) => {
              const archetype = lpArchetypes.find((a) => a.id === offer.archetypeId)
              if (!archetype) return null
              return (
                <LpCard
                  key={offer.id}
                  index={i + 1}
                  archetype={archetype}
                  offer={offer}
                  tone="stone"
                  onPitch={() => setPitchingOfferId(offer.id)}
                />
              )
            })}
          </div>
        </div>

        <button
          type="button"
          className={styles.proceedButton}
          data-onboarding="fundraising-proceed"
          disabled={!hasCommittedOffer}
          onClick={onProceedToQuarterOne}
        >
          Lancer le premier trimestre →
        </button>
      </div>

      {pitchingOffer && pitchingArchetype && (
        <PitchScene
          // key : force React à monter une instance fraîche (et donc un state réinitialisé)
          // à chaque nouveau LP pitché, plutôt que de réutiliser l'instance précédente.
          key={pitchingOffer.id}
          offer={pitchingOffer}
          archetype={pitchingArchetype}
          onClose={() => setPitchingOfferId(null)}
          unlockedAngles={unlockedAngles}
          confidenceBonus={confidenceBonus}
          onComplete={(offerId, amount, record) => {
            onOfferCommitted(offerId, amount, record)
            setPitchingOfferId(null)
          }}
        />
      )}
    </main>
  )
}
