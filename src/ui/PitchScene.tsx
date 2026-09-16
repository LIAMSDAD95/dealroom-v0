import { useEffect, useRef, useState } from 'react'
import type { LpArchetype, PitchAngle } from '../signals-content/types'
import type { LpOffer } from '../game-loop/lp-pool'
import { pitchQuestionsByOfferId, unlockedAnglesFundI } from '../signals-content/pitch-questions'
import {
  confidenceLabel,
  createPitchSession,
  proposedAmount,
  resolveAnswer,
  STARTING_CONFIDENCE,
} from '../game-loop/pitch-session'
import styles from './PitchScene.module.css'

interface PitchSceneProps {
  offer: LpOffer
  archetype: LpArchetype
  onClose: () => void
  onComplete: (offerId: string, amount: number) => void
}

interface ChatEntry {
  from: 'lp' | 'player'
  text: string
}

const ANGLE_LABELS: Record<PitchAngle, { name: string; desc: string }> = {
  conviction: { name: 'Conviction', desc: '« Je crois en ce secteur, point. »' },
  discipline: { name: 'Discipline', desc: 'Des critères stricts, jamais de déviation.' },
  reseau: { name: 'Réseau', desc: '🔒 réputation moyenne' },
  'track-record': { name: 'Track record', desc: '🔒 aucun historique' },
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function PitchScene({ offer, archetype, onClose, onComplete }: PitchSceneProps) {
  const questions = pitchQuestionsByOfferId[offer.id] ?? []
  const [session, setSession] = useState(() => createPitchSession(offer.id))
  const [qIndex, setQIndex] = useState(0)
  const [thread, setThread] = useState<ChatEntry[]>([])
  const [thinking, setThinking] = useState(false)
  const [answeredThisStep, setAnsweredThisStep] = useState(false)
  const [engagementLog, setEngagementLog] = useState<string[]>([])
  const [result, setResult] = useState<{ amount: number } | null>(null)
  // Vrai une fois que le LP a posé la question courante (bulle ajoutée au thread) — distinct
  // de thread.length, qui grandit aussi avec les réponses du joueur et ne suffit pas comme
  // condition d'affichage (voir Claude/memory/blockers.md).
  const [currentQuestionAsked, setCurrentQuestionAsked] = useState(false)

  // Annule tout timer en vol au démontage (StrictMode monte/démonte chaque composant une
  // fois en dev — sans ça, un setTimeout orphelin peut modifier l'état d'une instance qui
  // n'est plus affichée). Voir Claude/memory/blockers.md.
  const pendingTimer = useRef<number | null>(null)
  useEffect(() => {
    return () => {
      if (pendingTimer.current !== null) {
        window.clearTimeout(pendingTimer.current)
      }
    }
  }, [])

  const done = qIndex >= questions.length

  function chooseAngle(angle: PitchAngle) {
    if (session.angle) return
    setSession((s) => ({ ...s, angle }))
    if (questions.length === 0) {
      // Pas encore de contenu de questions pour cette offre — voir Claude/memory/decisions.md.
      const amount = proposedAmount(session.confidence, offer.capitalMin, offer.capitalMax)
      setResult({ amount })
      return
    }
    askQuestion(0)
  }

  function askQuestion(index: number) {
    const question = questions[index]
    if (!question) return
    setThinking(true)
    setAnsweredThisStep(false)
    setCurrentQuestionAsked(false)
    pendingTimer.current = window.setTimeout(() => {
      pendingTimer.current = null
      setThinking(false)
      setCurrentQuestionAsked(true)
      setThread((t) => [...t, { from: 'lp', text: question.text }])
    }, 3000)
  }

  function answer(optionIndex: number) {
    if (answeredThisStep) return
    setAnsweredThisStep(true)
    const option = questions[qIndex].options[optionIndex]
    setThread((t) => [...t, { from: 'player', text: option.text }])

    const { nextConfidence, coherenceNote } = resolveAnswer(
      session.angle,
      option,
      session.confidence,
    )
    setSession((s) => ({ ...s, confidence: nextConfidence, answeredCount: s.answeredCount + 1 }))

    const newLogEntries = [option.engagementLabel, coherenceNote].filter(
      (entry): entry is string => entry !== null,
    )
    if (newLogEntries.length > 0) {
      setEngagementLog((log) => [...log, ...newLogEntries])
    }

    const nextIndex = qIndex + 1
    setQIndex(nextIndex)

    if (nextIndex >= questions.length) {
      setThinking(true)
      pendingTimer.current = window.setTimeout(() => {
        pendingTimer.current = null
        setThinking(false)
        const amount = proposedAmount(nextConfidence, offer.capitalMin, offer.capitalMax)
        setResult({ amount })
      }, 3000)
    } else {
      askQuestion(nextIndex)
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <aside className={styles.side}>
          <div className={styles.avatar}>{initials(offer.name)}</div>
          <div>
            <p className={styles.lpName}>{offer.name}</p>
            <p className={styles.lpRole}>{archetype.label.toUpperCase()}</p>
          </div>
          <p className={styles.lpDesc}>{archetype.description}</p>

          <div className={styles.gauge}>
            <div className={styles.gaugeLabel}>
              <span>Confiance</span>
              <span>{qIndex === 0 && !session.angle ? '—' : confidenceLabel(session.confidence)}</span>
            </div>
            <div className={styles.gaugeTrack}>
              <div
                className={styles.gaugeFill}
                style={{ width: `${session.angle ? session.confidence : STARTING_CONFIDENCE}%` }}
              />
            </div>
          </div>

          <p className={styles.logTitle}>Engagements pris</p>
          {engagementLog.length === 0 ? (
            <p className={styles.logEmpty}>Aucun engagement encore pris.</p>
          ) : (
            engagementLog.map((entry, i) => (
              <p key={i} className={styles.logTag}>
                {entry}
              </p>
            ))
          )}
        </aside>

        <div className={styles.main}>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fermer">
            ✕
          </button>

          <div>
            <p className={styles.angleTitle}>Étape 1 — Choisissez votre angle</p>
            <div className={styles.angleGrid}>
              {(['conviction', 'discipline', 'reseau', 'track-record'] as PitchAngle[]).map(
                (angle) => {
                  const locked = !unlockedAnglesFundI.includes(angle)
                  const chosen = session.angle === angle
                  return (
                    <button
                      key={angle}
                      type="button"
                      className={styles.angleButton}
                      data-locked={locked}
                      data-chosen={chosen}
                      disabled={locked || session.angle !== null}
                      onClick={() => chooseAngle(angle)}
                    >
                      <span className={styles.angleName}>{ANGLE_LABELS[angle].name}</span>
                      <span className={styles.angleDesc}>{ANGLE_LABELS[angle].desc}</span>
                    </button>
                  )
                },
              )}
            </div>
          </div>

          {session.angle && (
            <div>
              <div className={styles.chatThread}>
                {thread.map((entry, i) => (
                  <div key={i} className={styles.msg} data-from={entry.from}>
                    <div className={styles.msgAvatar}>
                      {entry.from === 'lp' ? initials(offer.name) : 'GP'}
                    </div>
                    <div className={styles.msgBubble}>{entry.text}</div>
                  </div>
                ))}
                {thinking && (
                  <div className={styles.msg} data-from="lp">
                    <div className={styles.msgAvatar}>{initials(offer.name)}</div>
                    <div className={styles.thinkingBubble}>Réfléchit…</div>
                  </div>
                )}
              </div>

              {!done && !thinking && currentQuestionAsked && (
                <div className={styles.qList}>
                  {questions[qIndex].options.map((option, i) => (
                    <button
                      key={i}
                      type="button"
                      className={styles.qItem}
                      disabled={answeredThisStep}
                      onClick={() => answer(i)}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {result && (
            <div className={styles.resultCard}>
              <p className={styles.resultTitle}>Proposition reçue</p>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Montant</span>
                  <span className={styles.resultValue}>
                    {(result.amount / 1000).toFixed(0)}K€
                  </span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Confiance</span>
                  <span className={styles.resultValue}>{session.confidence}%</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Condition</span>
                  <span className={styles.resultValue}>
                    {engagementLog.length === 0 ? 'Standard' : 'Renforcée'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={() => onComplete(offer.id, result.amount)}
              >
                Valider l'engagement →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
