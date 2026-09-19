import type { ReactNode } from 'react'
import styles from './AppHeader.module.css'

interface AppHeaderProps {
  /** Badges affichés à droite du logo (ex. LPs engagés) — avant la barre de ressources. */
  badges?: ReactNode
  /** Barre de ressources optionnelle (capital déployé, bande passante...) — alignée à droite. */
  resources?: ReactNode
}

export function AppHeader({ badges, resources }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.logoMark} aria-hidden="true" />
      <span className={styles.logoText}>DEALROOM</span>
      {badges}
      {resources && <div className={styles.resources}>{resources}</div>}
    </header>
  )
}
