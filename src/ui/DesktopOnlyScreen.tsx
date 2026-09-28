import { Icon } from './Icon'
import styles from './DesktopOnlyScreen.module.css'

/**
 * Écran de blocage mobile — product-spec §8.1. Recouvre le jeu (qui reste monté dessous)
 * tant que l'écran est trop petit ou tactile uniquement. Ce n'est pas une version mobile.
 */
export function DesktopOnlyScreen() {
  return (
    <div
      className={styles.overlay}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="desktop-only-title"
    >
      <div className={styles.card}>
        <p className={styles.brand}>
          <span className={styles.brandDot} aria-hidden="true" />
          DEALROOM
        </p>
        <span className={styles.icon}>
          <Icon name="alert-circle" size={26} />
        </span>
        <h1 id="desktop-only-title" className={styles.title}>
          À jouer sur ordinateur
        </h1>
        <p className={styles.text}>
          DEALROOM se joue sur un écran d’ordinateur : deal flow, scènes de dialogue et rapport
          de portefeuille ont besoin de place pour rester lisibles.
        </p>
        <p className={styles.text}>
          Ouvre ce lien sur ton ordinateur — ou, si tu y es déjà, agrandis la fenêtre de ton
          navigateur.
        </p>
      </div>
    </div>
  )
}
