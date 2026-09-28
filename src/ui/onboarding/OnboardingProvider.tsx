import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { OnboardingProgress } from '../../persistence/onboarding-storage'
import { loadOnboarding, saveOnboarding } from '../../persistence/onboarding-storage'
import type { TourId } from '../../signals-content/onboarding-content'
import { onboardingTours } from '../../signals-content/onboarding-content'
import { Coachmark } from './Coachmark'
import styles from './Coachmark.module.css'
import { OnboardingContext } from './onboarding-context'

/** Ordre de lecture quand plusieurs visites sont rejouées ensemble (ex. rapport + follow-on). */
const TOUR_ORDER = Object.keys(onboardingTours) as TourId[]
const SCENE_TOURS: TourId[] = ['lp-pitch', 'founder-scene']

/**
 * Enchaîne les visites guidées demandées par les écrans, une seule à la fois, et retient
 * celles déjà vues (Persistence). Une visite n'est marquée vue qu'une fois terminée ou
 * passée : si l'écran disparaît avant, elle reviendra la prochaine fois.
 */
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<OnboardingProgress>(loadOnboarding)
  const [queue, setQueue] = useState<TourId[]>([])
  // Visites portées par les écrans actuellement affichés (une entrée par composant monté).
  const [mounted, setMounted] = useState<TourId[]>([])

  const registerTour = useCallback((id: TourId) => {
    setMounted((m) => [...m, id])
    return () =>
      setMounted((m) => {
        const i = m.indexOf(id)
        return i === -1 ? m : [...m.slice(0, i), ...m.slice(i + 1)]
      })
  }, [])

  const requestTour = useCallback(
    (id: TourId) => {
      if (progress.disabled || progress.seenTours.includes(id)) return
      setQueue((q) => (q.includes(id) ? q : [...q, id]))
    },
    [progress],
  )

  const cancelTour = useCallback((id: TourId) => {
    setQueue((q) => q.filter((t) => t !== id))
  }, [])

  const activeTour = queue[0] ?? null

  function update(next: OnboardingProgress) {
    setProgress(next)
    saveOnboarding(next)
  }

  function finishTour() {
    if (!activeTour) return
    if (!progress.seenTours.includes(activeTour)) {
      update({ ...progress, seenTours: [...progress.seenTours, activeTour] })
    }
    setQueue((q) => q.slice(1))
  }

  /**
   * Bouton Aide : rejoue les visites de l'écran affiché, même déjà vues ou désactivées.
   * Une scène en modale (pitch LP, entretien fondateur) prime sur l'écran qu'elle recouvre.
   */
  function replay() {
    const present = TOUR_ORDER.filter((t) => mounted.includes(t))
    const scenes = present.filter((t) => SCENE_TOURS.includes(t))
    setQueue(scenes.length > 0 ? scenes : present)
  }

  function disableAll() {
    update({ ...progress, disabled: true })
    setQueue([])
  }

  const value = useMemo(
    () => ({ activeTour, requestTour, cancelTour, registerTour }),
    [activeTour, requestTour, cancelTour, registerTour],
  )

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      {!activeTour && mounted.length > 0 && (
        <button
          type="button"
          className={styles.helpButton}
          onClick={replay}
          title="Revoir l’aide de cet écran"
        >
          <span className={styles.helpMark} aria-hidden="true">
            ?
          </span>
          AIDE
        </button>
      )}
      {activeTour && (
        <Coachmark
          // key : chaque visite repart de sa première étape.
          key={activeTour}
          steps={onboardingTours[activeTour]}
          onFinish={finishTour}
          onDisableAll={disableAll}
        />
      )}
    </OnboardingContext.Provider>
  )
}
