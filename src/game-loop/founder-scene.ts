// Résolution de la scène de dialogue fondateur — product-spec §3.4. Domaine Game Loop :
// règles de ressources (attention/patience) et tirage des questions proposées. Le texte
// des questions/réponses vit dans Signals & Content (founder-questions.ts).

import type { FounderQuestion } from '../signals-content/founder-questions'
import {
  founderOpeningPitchesByArchetype,
  founderQuestionsByArchetype,
} from '../signals-content/founder-questions'
import type { FounderArchetypeId } from '../signals-content/types'

// product-spec §3.4 — valeurs par défaut.
export const STARTING_ATTENTION = 3
export const STARTING_PATIENCE = 4

/** Nombre de questions proposées au joueur parmi la banque de l'archétype (§3.4 : 5-7). */
export const QUESTIONS_OFFERED = 6

/** Seuil en dessous duquel le fondateur peut écourter l'entretien (§3.4). */
export const LOW_PATIENCE_THRESHOLD = 1

export interface FounderSceneState {
  attention: number
  patience: number
  askedQuestionIds: string[]
}

export function createFounderSceneState(): FounderSceneState {
  return {
    attention: STARTING_ATTENTION,
    patience: STARTING_PATIENCE,
    askedQuestionIds: [],
  }
}

/**
 * Tire les questions proposées pour une scène — voir Claude/memory/decisions.md
 * (2026-09-22) : banque de 8-10 par archétype, 6 tirées, pour que revoir le même
 * archétype plus tard ne repropose pas le même entretien.
 */
export function drawSceneQuestions(archetypeId: FounderArchetypeId): FounderQuestion[] {
  const bank = founderQuestionsByArchetype[archetypeId] ?? []
  const shuffled = [...bank].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, QUESTIONS_OFFERED)
}

/**
 * Tire le pitch d'ouverture du fondateur, avec le nom de la startup substitué.
 * Retourne null si l'archétype n'a pas encore de contenu écrit (hors Phase 0).
 */
export function drawOpeningPitch(
  archetypeId: FounderArchetypeId,
  companyName: string,
): string | null {
  const pitches = founderOpeningPitchesByArchetype[archetypeId] ?? []
  if (pitches.length === 0) return null
  const picked = pitches[Math.floor(Math.random() * pitches.length)]
  return picked.replaceAll('{company}', companyName)
}

/** Une question est posable si l'attention restante couvre son coût (§3.4). */
export function canAskQuestion(state: FounderSceneState, question: FounderQuestion): boolean {
  return state.attention >= question.attentionCost
}

/**
 * Applique le coût d'une question : chaque question coûte de l'attention et fait
 * descendre la patience d'autant (§3.4).
 */
export function applyQuestionCost(
  state: FounderSceneState,
  question: FounderQuestion,
): FounderSceneState {
  return {
    attention: Math.max(0, state.attention - question.attentionCost),
    patience: Math.max(0, state.patience - question.attentionCost),
    askedQuestionIds: [...state.askedQuestionIds, question.id],
  }
}

/** Vrai quand le joueur ne peut plus poser aucune question : attention épuisée. */
export function isOutOfAttention(state: FounderSceneState): boolean {
  return state.attention <= 0
}

/** Vrai quand le fondateur écourte l'entretien parce que sa patience est au plus bas (§3.4). */
export function hasFounderWalkedOut(state: FounderSceneState): boolean {
  return state.patience <= 0
}
