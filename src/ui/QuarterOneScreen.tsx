import type { LpOffer } from '../game-loop/lp-pool'
import type { Thesis } from '../game-loop/thesis'
import { AppHeader } from './AppHeader'
import styles from './QuarterOneScreen.module.css'

interface QuarterOneScreenProps {
  thesis: Thesis
  offers: LpOffer[]
}

function formatMillions(amount: number): string {
  return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M€`
}

/**
 * Placeholder en attendant la construction du deal flow (product-spec §3.2).
 * Confirme que la transition depuis la levée de fonds fonctionne et affiche
 * l'état du run à ce stade (thèse + capital levé).
 */
export function QuarterOneScreen({ thesis, offers }: QuarterOneScreenProps) {
  const committed = offers.filter((o) => o.status === 'committed')
  const totalRaised = committed.reduce((sum, o) => sum + (o.committedAmount ?? 0), 0)

  return (
    <main className={styles.screen}>
      <AppHeader />
      <div className={styles.content}>
        <p className={styles.eyebrow}>FONDS I</p>
        <h1 className={styles.title}>TRIMESTRE 1</h1>
        <p className={styles.subtitle}>
          Deal flow à venir — capital levé : {formatMillions(totalRaised)} auprès de{' '}
          {committed.length} LP{committed.length > 1 ? 's' : ''}, secteurs :{' '}
          {thesis.sectors.join(', ')}.
        </p>
      </div>
    </main>
  )
}
