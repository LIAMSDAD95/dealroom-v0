import { useEffect, useRef, useState } from 'react'
import type { Deal, DealTag } from '../game-loop/deal'
import type { FounderSceneState } from '../game-loop/founder-scene'
import {
  applyQuestionCost,
  canAskQuestion,
  createFounderSceneState,
  drawOpeningPitch,
  drawSceneQuestions,
  hasFounderWalkedOut,
  isOutOfAttention,
  STARTING_ATTENTION,
  STARTING_PATIENCE,
} from '../game-loop/founder-scene'
import type { FounderQuestion } from '../signals-content/founder-questions'
import { Icon } from './Icon'
import styles from './FounderScene.module.css'

interface FounderSceneProps {
  deal: Deal
  /** Capital encore disponible — plafonne l'investissement en sortie de scène. */
  remainingCapital: number
  onClose: () => void
  onInvest: (dealId: string) => void
}

interface ChatEntry {
  from: 'founder' | 'player'
  text: string
}

const THINKING_DELAY_MS = 3000

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatCapital(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M€`
  }
  return `${Math.round(amount / 1_000)}K€`
}

export function FounderScene({ deal, remainingCapital, onClose, onInvest }: FounderSceneProps) {
  const [questions] = useState<FounderQuestion[]>(() => drawSceneQuestions(deal.founderArchetypeId))
  const [state, setState] = useState<FounderSceneState>(createFounderSceneState)
  // Le fondateur ouvre l'entretien par son pitch (voir decisions.md, 2026-09-22).
  const [thread, setThread] = useState<ChatEntry[]>(() => {
    const opening = drawOpeningPitch(deal.founderArchetypeId, deal.companyName)
    return opening ? [{ from: 'founder', text: opening }] : []
  })
  const [thinking, setThinking] = useState(false)
  const [revealedSignals, setRevealedSignals] = useState<DealTag[]>([])

  // Annule tout timer en vol au démontage — sans ça un setTimeout orphelin peut modifier
  // l'état d'une instance démontée (voir Claude/memory/learnings.md, 2026-09-15).
  const pendingTimer = useRef<number | null>(null)
  useEffect(() => {
    return () => {
      if (pendingTimer.current !== null) {
        window.clearTimeout(pendingTimer.current)
      }
    }
  }, [])

  // L'archétype n'est jamais affiché au joueur : c'est à lui d'assembler le jugement à
  // partir des signaux révélés (product-spec §3.3, jamais de score agrégé).
  const outOfAttention = isOutOfAttention(state)
  const walkedOut = hasFounderWalkedOut(state)
  const interviewOver = outOfAttention || walkedOut
  const ticketTooExpensive = deal.askAmount > remainingCapital

  function askQuestion(question: FounderQuestion) {
    if (thinking || interviewOver || !canAskQuestion(state, question)) return

    setThread((t) => [...t, { from: 'player', text: question.text }])
    setState((s) => applyQuestionCost(s, question))
    setThinking(true)

    pendingTimer.current = window.setTimeout(() => {
      pendingTimer.current = null
      setThinking(false)
      setThread((t) => [...t, { from: 'founder', text: question.answer }])
      if (question.revealsSignal) {
        const signal = question.revealsSignal
        setRevealedSignals((current) =>
          current.some((s) => s.label === signal.label) ? current : [...current, signal],
        )
      }
    }, THINKING_DELAY_MS)
  }

  const availableQuestions = questions.filter((q) => !state.askedQuestionIds.includes(q.id))

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <aside className={styles.side}>
          <div className={styles.avatar}>{initials(deal.founderName)}</div>
          <div>
            <p className={styles.founderName}>{deal.founderName}</p>
            <p className={styles.founderRole}>
              {deal.companyName.toUpperCase()} · {deal.stage.toUpperCase()}
            </p>
          </div>
          <p className={styles.founderDesc}>{deal.pitch}</p>

          <div className={styles.gauge}>
            <div className={styles.gaugeLabel}>
              <span>Attention</span>
              <span>
                {state.attention}/{STARTING_ATTENTION}
              </span>
            </div>
            <div className={styles.segments}>
              {Array.from({ length: STARTING_ATTENTION }, (_, i) => (
                <span key={i} className={styles.segment} data-filled={i < state.attention} />
              ))}
            </div>
          </div>

          <div className={styles.gauge}>
            <div className={styles.gaugeLabel}>
              <span>Patience</span>
              <span>
                {state.patience}/{STARTING_PATIENCE}
              </span>
            </div>
            <div className={styles.segments}>
              {Array.from({ length: STARTING_PATIENCE }, (_, i) => (
                <span
                  key={i}
                  className={styles.segment}
                  data-filled={i < state.patience}
                  data-low={state.patience <= 1 || undefined}
                />
              ))}
            </div>
          </div>

          <p className={styles.logTitle}>Signaux révélés</p>
          {revealedSignals.length === 0 ? (
            <p className={styles.logEmpty}>Aucun signal révélé pour l’instant.</p>
          ) : (
            revealedSignals.map((signal) => (
              <p key={signal.label} className={styles.logTag} data-family={signal.family}>
                {signal.label}
              </p>
            ))
          )}
        </aside>

        <div className={styles.main}>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fermer">
            ✕
          </button>

          <div className={styles.chatThread}>
            {thread.length === 0 && !thinking && (
              <p className={styles.chatHint}>
                Posez vos questions. Chaque question consomme de l’attention et entame la
                patience du fondateur.
              </p>
            )}
            {thread.map((entry, i) => (
              <div key={i} className={styles.msg} data-from={entry.from}>
                <div className={styles.msgAvatar}>
                  {entry.from === 'founder' ? initials(deal.founderName) : 'GP'}
                </div>
                <div className={styles.msgBubble}>{entry.text}</div>
              </div>
            ))}
            {thinking && (
              <div className={styles.msg} data-from="founder">
                <div className={styles.msgAvatar}>{initials(deal.founderName)}</div>
                <div className={styles.thinkingBubble}>Réfléchit…</div>
              </div>
            )}
          </div>

          {interviewOver ? (
            <div className={styles.endCard}>
              <p className={styles.endTitle}>
                {walkedOut ? 'Le fondateur écourte l’entretien' : 'Entretien terminé'}
              </p>
              <p className={styles.endText}>
                {walkedOut
                  ? 'Vous avez épuisé sa patience. À vous de décider avec ce que vous avez appris.'
                  : 'Vous n’avez plus d’attention à consacrer à ce rendez-vous.'}
              </p>
              <div className={styles.endActions}>
                <button type="button" className={styles.declineButton} onClick={onClose}>
                  Ne pas investir
                </button>
                <button
                  type="button"
                  className={styles.investButton}
                  disabled={ticketTooExpensive}
                  onClick={() => onInvest(deal.id)}
                >
                  {ticketTooExpensive
                    ? 'Capital insuffisant'
                    : `Investir (${formatCapital(deal.askAmount)})`}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.questionBlock}>
              <p className={styles.questionTitle}>
                Questions disponibles — {state.attention} attention restante
              </p>
              <div className={styles.qList}>
                {availableQuestions.map((question) => {
                  const tooExpensive = !canAskQuestion(state, question)
                  return (
                    <button
                      key={question.id}
                      type="button"
                      className={styles.qItem}
                      disabled={thinking || tooExpensive}
                      onClick={() => askQuestion(question)}
                    >
                      <span className={styles.qText}>{question.text}</span>
                      <span className={styles.qCost}>
                        <Icon name="zap" size={12} />
                        {question.attentionCost}
                      </span>
                    </button>
                  )
                })}
              </div>
              <button type="button" className={styles.stopButton} onClick={onClose}>
                Mettre fin à l’entretien
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
