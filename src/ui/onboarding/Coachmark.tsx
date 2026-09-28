import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { OnboardingStep } from '../../signals-content/onboarding-content'
import styles from './Coachmark.module.css'

interface CoachmarkProps {
  steps: OnboardingStep[]
  /** Visite terminée ou passée : elle ne sera plus proposée. */
  onFinish: () => void
  onDisableAll: () => void
}

interface Placement {
  top: number
  left: number
  width: number
}

const MARGIN = 16
const GAP = 14
const BUBBLE_WIDTH = 360
const SPOT_PADDING = 6

function findTarget(target: string | undefined): HTMLElement | null {
  return target ? document.querySelector<HTMLElement>(`[data-onboarding="${target}"]`) : null
}

/** Sous la cible si ça tient, sinon au-dessus, sinon en bas de l'écran ; centrée sans cible. */
function placeBubble(rect: DOMRect | null, bubbleHeight: number): Placement {
  const width = Math.min(BUBBLE_WIDTH, window.innerWidth - 2 * MARGIN)
  const maxTop = window.innerHeight - bubbleHeight - MARGIN
  if (!rect) {
    return {
      top: Math.max(MARGIN, (window.innerHeight - bubbleHeight) / 2),
      left: (window.innerWidth - width) / 2,
      width,
    }
  }
  const below = rect.bottom + GAP
  const above = rect.top - GAP - bubbleHeight
  const top = below <= maxTop ? below : above >= MARGIN ? above : Math.max(MARGIN, maxTop)
  const centered = rect.left + rect.width / 2 - width / 2
  const left = Math.min(Math.max(centered, MARGIN), window.innerWidth - width - MARGIN)
  return { top, left, width }
}

/**
 * Bulle d'onboarding + mise en lumière de l'élément ciblé (product-spec §8.2 : coachmarks,
 * spotlight). Recouvre tout l'écran : pendant la visite, le jeu n'est pas cliquable.
 */
export function Coachmark({ steps, onFinish, onDisableAll }: CoachmarkProps) {
  // Étapes dont la cible est présente, figées au montage : l'écran ne bouge pas pendant
  // la visite (ex. pas de carte follow-on ce trimestre → étape sautée).
  const [visibleSteps] = useState(() => steps.filter((s) => !s.target || findTarget(s.target)))
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [placement, setPlacement] = useState<Placement | null>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)

  const step = visibleSteps[index]
  const isLast = index >= visibleSteps.length - 1

  useEffect(() => {
    if (visibleSteps.length === 0) onFinish()
  }, [visibleSteps, onFinish])

  useLayoutEffect(() => {
    if (!step) return
    const element = findTarget(step.target)
    element?.scrollIntoView({ block: 'center', inline: 'nearest' })

    let frame = 0
    function measure() {
      const r = element ? element.getBoundingClientRect() : null
      setRect(r)
      setPlacement(placeBubble(r, bubbleRef.current?.offsetHeight ?? 200))
    }
    measure()
    // Seconde mesure une fois la bulle rendue avec le texte de cette étape.
    frame = window.requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [step])

  function next() {
    if (isLast) onFinish()
    else setIndex((i) => i + 1)
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter' || event.key === 'ArrowRight') {
        event.preventDefault()
        if (isLast) onFinish()
        else setIndex((i) => i + 1)
      } else if (event.key === 'Escape') {
        onFinish()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isLast, onFinish])

  if (!step) return null

  return (
    <div className={styles.layer} role="dialog" aria-modal="true" aria-labelledby="coachmark-title">
      {rect ? (
        <div
          className={styles.spotlight}
          style={{
            top: rect.top - SPOT_PADDING,
            left: rect.left - SPOT_PADDING,
            width: rect.width + 2 * SPOT_PADDING,
            height: rect.height + 2 * SPOT_PADDING,
          }}
        />
      ) : (
        <div className={styles.dim} />
      )}

      <div
        ref={bubbleRef}
        className={styles.bubble}
        style={
          placement
            ? { top: placement.top, left: placement.left, width: placement.width }
            : { visibility: 'hidden' }
        }
      >
        <p className={styles.counter}>
          AIDE · {index + 1} / {visibleSteps.length}
        </p>
        <p id="coachmark-title" className={styles.title}>
          {step.title}
        </p>
        <p className={styles.text}>{step.text}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.disableButton} onClick={onDisableAll}>
            Ne plus afficher l’aide
          </button>
          {!isLast && (
            <button type="button" className={styles.skipButton} onClick={onFinish}>
              Passer
            </button>
          )}
          <button type="button" className={styles.nextButton} onClick={next} autoFocus>
            {isLast ? 'Compris' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  )
}
