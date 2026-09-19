import { useState } from 'react'
import type { Sector, Stage, Thesis, Zone } from '../game-loop/thesis'
import { MAX_SECTORS, MIN_SECTORS, sectorOptions, stageOptions, zoneOptions } from '../game-loop/thesis'
import { AppHeader } from './AppHeader'
import { Chip } from './Chip'
import styles from './ThesisDeclaration.module.css'

interface ThesisDeclarationProps {
  onConfirm: (thesis: Thesis) => void
}

export function ThesisDeclaration({ onConfirm }: ThesisDeclarationProps) {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [stage, setStage] = useState<Stage | null>(null)
  const [zone, setZone] = useState<Zone | null>(null)

  const isComplete = sectors.length >= MIN_SECTORS && stage !== null && zone !== null

  function toggleSector(id: Sector) {
    setSectors((current) => {
      if (current.includes(id)) {
        return current.filter((s) => s !== id)
      }
      if (current.length < MAX_SECTORS) {
        return [...current, id]
      }
      // Limite atteinte : le 4e choix remplace le plus ancien (voir Claude/memory/decisions.md)
      return [...current.slice(1), id]
    })
  }

  function handleConfirm() {
    if (sectors.length >= MIN_SECTORS && stage && zone) {
      onConfirm({ sectors, stage, zone })
    }
  }

  return (
    <main className={styles.screen}>
      <AppHeader />

      <div className={styles.content}>
        <p className={styles.pixelLabel}>FONDS I · AVANT LE PREMIER TRIMESTRE</p>
        <h1 className={styles.title}>DÉCLAREZ VOTRE THÈSE</h1>
        <p className={styles.subtitle}>
          Un engagement pour tout le run. Dévier de votre thèse coûte de la confiance de vos LPs.
        </p>

        <section className={styles.group}>
          <p className={styles.groupLabel}>
            SECTEUR — {MIN_SECTORS} À {MAX_SECTORS}
          </p>
          <div className={styles.chips}>
            {sectorOptions.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                selected={sectors.includes(option.id)}
                onClick={() => toggleSector(option.id)}
              />
            ))}
          </div>
        </section>

        <section className={styles.group}>
          <p className={styles.groupLabel}>STADE</p>
          <div className={styles.chips}>
            {stageOptions.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                selected={stage === option.id}
                onClick={() => setStage(option.id)}
              />
            ))}
          </div>
        </section>

        <section className={styles.group}>
          <p className={styles.groupLabel}>ZONE</p>
          <div className={styles.chips}>
            {zoneOptions.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                selected={zone === option.id}
                onClick={() => setZone(option.id)}
              />
            ))}
          </div>
        </section>

        <button
          type="button"
          className={styles.confirmButton}
          disabled={!isComplete}
          onClick={handleConfirm}
        >
          VALIDER LA THÈSE →
        </button>
      </div>
    </main>
  )
}
