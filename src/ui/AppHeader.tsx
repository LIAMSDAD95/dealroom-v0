import styles from './AppHeader.module.css'

/** Header minimal (logo seul) — utilisé tant que l'écran n'a pas de ressources de run à afficher. */
export function AppHeader() {
  return (
    <header className={styles.header}>
      <span className={styles.logoMark} aria-hidden="true" />
      <span className={styles.logoText}>DEALROOM</span>
    </header>
  )
}
