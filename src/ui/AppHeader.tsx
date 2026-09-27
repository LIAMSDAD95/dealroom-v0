import type { ReactNode } from 'react'
import { Icon } from './Icon'
import styles from './AppHeader.module.css'

interface AppHeaderProps {
  /** Badges affichés à droite du logo (ex. LPs engagés) — avant la barre de ressources. */
  badges?: ReactNode
  /** Barre de ressources optionnelle (capital déployé, bande passante...) — alignée à droite. */
  resources?: ReactNode
  /**
   * Nombre de lignes actives en portefeuille. Quand il est défini, le header affiche le
   * bouton d'accès au récap (product-spec §3.2) — absent avant la levée de fonds, puisqu'il
   * n'y a alors rien à consulter.
   */
  portfolioCount?: number
  onOpenPortfolio?: () => void
}

export function AppHeader({
  badges,
  resources,
  portfolioCount,
  onOpenPortfolio,
}: AppHeaderProps) {
  const showPortfolio = portfolioCount !== undefined && onOpenPortfolio !== undefined

  return (
    <header className={styles.header}>
      <span className={styles.logoMark} aria-hidden="true" />
      <span className={styles.logoText}>DEALROOM</span>
      {badges}
      {resources && <div className={styles.resources}>{resources}</div>}
      {showPortfolio && (
        <button
          type="button"
          className={styles.portfolioButton}
          // Sans barre de ressources, le bouton doit pousser lui-même vers la droite.
          data-standalone={resources ? undefined : true}
          onClick={onOpenPortfolio}
          title="Voir le portefeuille (P)"
        >
          <Icon name="bar-chart" size={13} />
          PORTEFEUILLE
          <span className={styles.portfolioCount}>{portfolioCount}</span>
        </button>
      )}
    </header>
  )
}
