// Résolution de la scène de pitch LP — product-spec §3.1.3. Domaine Game Loop : calcule
// la confiance et le montant proposé à partir du contenu défini dans Signals & Content
// (src/signals-content/pitch-questions.ts).

import type { PitchAngle, ResponseTone } from '../signals-content/types'
import type { PitchAnswerOption } from '../signals-content/pitch-questions'

export const STARTING_CONFIDENCE = 40

export interface PitchSessionState {
  offerId: string
  angle: PitchAngle | null
  answeredCount: number
  confidence: number
}

export function createPitchSession(offerId: string): PitchSessionState {
  return { offerId, angle: null, answeredCount: 0, confidence: STARTING_CONFIDENCE }
}

/** product-spec §3.1.3 — ton qui matche l'angle → bonus ; contradiction → pénalité plus lourde. */
const COHERENCE_BONUS = 6
const COHERENCE_PENALTY = -10

export interface AnswerResolution {
  nextConfidence: number
  coherenceNote: string | null
}

export function resolveAnswer(
  angle: PitchAngle | null,
  option: PitchAnswerOption,
  currentConfidence: number,
): AnswerResolution {
  let delta = option.confidenceDelta
  let coherenceNote: string | null = null

  if (angle && option.tone && option.tone !== 'aucun') {
    if (toneMatchesAngle(option.tone, angle)) {
      delta += COHERENCE_BONUS
      coherenceNote = 'Cohérence avec votre angle (+)'
    } else {
      delta += COHERENCE_PENALTY
      coherenceNote = 'Incohérence avec votre angle (–)'
    }
  }

  const nextConfidence = Math.max(0, Math.min(100, currentConfidence + delta))
  return { nextConfidence, coherenceNote }
}

function toneMatchesAngle(tone: ResponseTone, angle: PitchAngle): boolean {
  return tone === angle
}

export function confidenceLabel(confidence: number): 'Convaincu' | 'Neutre' | 'Sceptique' {
  if (confidence >= 65) return 'Convaincu'
  if (confidence >= 30) return 'Neutre'
  return 'Sceptique'
}

/** product-spec §3.1.3 — montant interpolé entre min et max selon la confiance finale. */
export function proposedAmount(confidence: number, capitalMin: number, capitalMax: number): number {
  const ratio = Math.max(0, Math.min(1, confidence / 100))
  return capitalMin + (capitalMax - capitalMin) * ratio
}
