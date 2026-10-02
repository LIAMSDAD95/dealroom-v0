import type { MetaProgress } from '../game-loop/meta'
import { PLAYTEST_LAST_FUND, reputationTier } from '../game-loop/meta'
import { perkTexts, reputationTierLabels } from '../signals-content/meta-content'
import { AppHeader } from './AppHeader'
import { Icon } from './Icon'
import styles from './PlaytestCompleteScreen.module.css'

interface PlaytestCompleteScreenProps {
  meta: MetaProgress
  pseudo: string
}

/**
 * Fin du playtest — décision utilisateur 2026-10-03 : le jeu s'arrête après le Fonds II.
 * Affiché après la clôture du dernier fonds, et à chaque rechargement ensuite.
 */
export function PlaytestCompleteScreen({ meta, pseudo }: PlaytestCompleteScreenProps) {
  const tier = reputationTier(meta.reputation)

  return (
    <main className={styles.screen}>
      <AppHeader />

      <div className={styles.content}>
        <p className={styles.eyebrow}>FIN DU PLAYTEST</p>
        <h1 className={styles.title}>Merci{pseudo ? `, ${pseudo}` : ''} !</h1>
        <p className={styles.lead}>
          Tu as mené {PLAYTEST_LAST_FUND} fonds jusqu’à leur clôture. Le playtest s’arrête ici.
        </p>

        <section className={styles.card}>
          <p className={styles.cardLabel}>CE QUE TU REPARS AVEC</p>
          <p className={styles.tier}>{reputationTierLabels[tier.id]}</p>
          <p className={styles.meta}>Réputation {meta.reputation} / 100</p>
          {meta.perks.length > 0 && (
            <ul className={styles.perks}>
              {meta.perks.map((perk) => (
                <li key={perk} className={styles.perk}>
                  <Icon name="zap" size={14} />
                  {perkTexts[perk].name}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.card} data-tone="ask">
          <p className={styles.cardLabel}>TON AVIS COMPTE</p>
          <p className={styles.text}>
            Raconte ce qui t’a surpris, frustré ou donné envie de rejouer : à quel moment tu as
            compris (ou pas) ce que les signaux t’apprenaient, ce qui t’a paru trop long, trop
            facile ou injuste. Tes retours comptent autant que tes chiffres.
          </p>
        </section>
      </div>
    </main>
  )
}
