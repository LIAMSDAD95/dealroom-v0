import type { Thesis } from '../game-loop/thesis'
import { sectorOptions, stageOptions, zoneOptions } from '../game-loop/thesis'
import styles from './ThesisSummaryPanel.module.css'

interface ThesisSummaryPanelProps {
  thesis: Thesis
}

export function ThesisSummaryPanel({ thesis }: ThesisSummaryPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.group}>
        <span className={styles.groupLabel}>Secteur</span>
        <div className={styles.chipRow}>
          {sectorOptions.map((option) => (
            <span
              key={option.id}
              className={styles.chip}
              data-selected={thesis.sectors.includes(option.id)}
            >
              {option.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>Stade</span>
        <div className={styles.chipRow}>
          {stageOptions.map((option) => (
            <span
              key={option.id}
              className={styles.chip}
              data-selected={thesis.stage === option.id}
            >
              {option.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>Zone</span>
        <div className={styles.chipRow}>
          {zoneOptions.map((option) => (
            <span
              key={option.id}
              className={styles.chip}
              data-selected={thesis.zone === option.id}
            >
              {option.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
