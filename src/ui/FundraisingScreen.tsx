import { useState } from 'react'
import { FUND_I_TARGET } from '../game-loop/fund'
import type { LpOffer } from '../game-loop/lp-pool'
import type { Thesis } from '../game-loop/thesis'
import { lpArchetypes } from '../signals-content/lps'
import { AppHeader } from './AppHeader'
import { FundProgressPanel } from './FundProgressPanel'
import { LpCard } from './LpCard'
import styles from './FundraisingScreen.module.css'
import { PitchScene } from './PitchScene'
import { ThesisSummaryPanel } from './ThesisSummaryPanel'

interface FundraisingScreenProps {
  thesis: Thesis
  offers: LpOffer[]
  onOfferCommitted: (offerId: string, amount: number) => void
}

export function FundraisingScreen({ thesis, offers, onOfferCommitted }: FundraisingScreenProps) {
  const [pitchingOfferId, setPitchingOfferId] = useState<string | null>(null)
  const pitchingOffer = offers.find((o) => o.id === pitchingOfferId) ?? null
  const pitchingArchetype = pitchingOffer
    ? lpArchetypes.find((a) => a.id === pitchingOffer.archetypeId)
    : null

  return (
    <main className={styles.screen}>
      <AppHeader />

      <div className={styles.content}>
        <p className={styles.eyebrow}>FONDATION DU FONDS</p>
        <h1 className={styles.title}>LEVÉE DE FONDS</h1>

        <p className={styles.sectionLabel}>THÈSE D'INVESTISSEMENT</p>
        <ThesisSummaryPanel thesis={thesis} />

        <p className={styles.sectionLabel}>PROGRESSION DU FONDS</p>
        <FundProgressPanel offers={offers} target={FUND_I_TARGET} />

        <p className={styles.sectionLabel}>LPS DISPONIBLES</p>
        <div className={styles.grid}>
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

      {pitchingOffer && pitchingArchetype && (
        <PitchScene
          // key : force React à monter une instance fraîche (et donc un state réinitialisé)
          // à chaque nouveau LP pitché, plutôt que de réutiliser l'instance précédente.
          key={pitchingOffer.id}
          offer={pitchingOffer}
          archetype={pitchingArchetype}
          onClose={() => setPitchingOfferId(null)}
          onComplete={(offerId, amount) => {
            onOfferCommitted(offerId, amount)
            setPitchingOfferId(null)
          }}
        />
      )}
    </main>
  )
}
