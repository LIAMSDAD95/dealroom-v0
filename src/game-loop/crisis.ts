// Crise macro — product-spec §3.6. Domaine Game Loop : déclenchement, ciblage d'une
// ligne du portefeuille, prédictibilité proportionnelle aux signaux équipe connus, et
// résolution des 4 options. Le texte vit dans Signals & Content (crisis-events.ts).

import type { CrisisEvent } from '../signals-content/crisis-events'
import { crisisEvents } from '../signals-content/crisis-events'
import { founderArchetypes } from '../signals-content/founders'
import type { FounderResilience } from '../signals-content/types'
import type { PortfolioLine } from './portfolio'
import type { CrisisLineEffect } from './portfolio-evolution'
import { activeLines } from './portfolio'

/**
 * Version de playtest (décision utilisateur 2026-10-03) : la première alerte tombe
 * toujours à ce trimestre, pour que chaque testeur rencontre la mécanique de crise.
 * Aucune crise avant.
 */
export const FORCED_CRISIS_QUARTER = 3

/** À partir de ce trimestre, les crises sont tirées au hasard. */
export const FIRST_RANDOM_CRISIS_QUARTER = 4

/** Probabilité qu'une crise se déclenche à un trimestre éligible. */
const CRISIS_PROBABILITY = 0.5

/** Coût en capital de "Soutenir en urgence" — pioché dans le capital restant. */
export const SUPPORT_COST = 120_000

/** Part du ticket récupérée en sortie anticipée ("Atterrissage doux"). */
const SOFT_LANDING_RECOVERY_RATE = 0.4

export type CrisisDecision = 'soutenir' | 'laisser' | 'atterrissage' | 'reseau'

export interface Crisis {
  event: CrisisEvent
  /** Ligne du portefeuille touchée. */
  line: PortfolioLine
}

/**
 * Tire une crise pour ce trimestre, ou null si aucune ne se déclenche.
 * Jamais avant FORCED_CRISIS_QUARTER, garantie à ce trimestre, puis aléatoire à partir de
 * FIRST_RANDOM_CRISIS_QUARTER. Jamais si le portefeuille actif est vide (product-spec §3.6 :
 * "zéro exposition = pas de scène") — y compris au trimestre forcé.
 *
 * `alreadySeen` : événements déjà tombés dans ce run, écartés tant qu'il en reste d'autres
 * pour ce secteur (retour utilisateur 2026-09-29 : trois fois la même alerte). La mémoire
 * est tenue par l'appelant, comme pour le deal flow (ADR-002).
 */
export function maybeTriggerCrisis(
  portfolio: PortfolioLine[],
  quarter: number,
  alreadySeen: ReadonlySet<string> = new Set(),
): Crisis | null {
  if (quarter < FORCED_CRISIS_QUARTER) return null

  const lines = activeLines(portfolio)
  if (lines.length === 0) return null
  const forced = quarter === FORCED_CRISIS_QUARTER
  if (!forced && quarter < FIRST_RANDOM_CRISIS_QUARTER) return null
  if (!forced && Math.random() >= CRISIS_PROBABILITY) return null

  const line = lines[Math.floor(Math.random() * lines.length)]
  // Seuls les événements qui touchent le secteur de la ligne ciblée sont éligibles.
  const eligible = crisisEvents.filter(
    (e) => e.affectedSectors === null || e.affectedSectors.includes(line.deal.sector),
  )
  if (eligible.length === 0) return null
  const fresh = eligible.filter((e) => !alreadySeen.has(e.id))
  const pool = fresh.length > 0 ? fresh : eligible

  return { event: pool[Math.floor(Math.random() * pool.length)], line }
}

export function resilienceOf(line: PortfolioLine): FounderResilience {
  const archetype = founderArchetypes.find((a) => a.id === line.deal.founderArchetypeId)
  return archetype?.resilience ?? 'fragile'
}

export type PredictionReliability = 'blind' | 'partial' | 'reliable'

export interface CrisisPrediction {
  reliability: PredictionReliability
  /** Ce que le joueur croit savoir — faux quand la prédiction n'est pas fiable. */
  predictedResilience: FounderResilience
  note: string
}

/**
 * product-spec §3.6 — prédictibilité proportionnelle : la fiabilité de la "réaction
 * attendue" dépend du nombre de signaux équipe révélés en due diligence. Sans signal,
 * la prédiction affichée est un pur pari (et peut être fausse).
 */
export function predictReaction(line: PortfolioLine, reliabilityBonus = 0): CrisisPrediction {
  // Perk « Sang-froid » (§3.7) : l'expérience vaut un signal équipe de plus.
  const known = line.knownTeamSignals.length
  const signalCount = known + reliabilityBonus
  const actual = resilienceOf(line)
  const perkNote = reliabilityBonus > 0 ? ' Ton sang-froid affine la lecture.' : ''
  const basis =
    known === 0
      ? 'Aucun signal équipe révélé en due diligence.'
      : `Basée sur ${known} signal${known > 1 ? 'aux' : ''} équipe révélé${known > 1 ? 's' : ''}.`

  if (signalCount === 0) {
    // À l'aveugle : la prédiction affichée est tirée au hasard, elle vaut ce qu'elle vaut.
    return {
      reliability: 'blind',
      predictedResilience: Math.random() < 0.5 ? 'resilient' : 'fragile',
      note: 'Aucun signal équipe révélé en due diligence. Cette prédiction est un pari.',
    }
  }

  if (signalCount === 1) {
    // Partiel : juste la plupart du temps, mais pas toujours.
    const correct = Math.random() < 0.7
    return {
      reliability: 'partial',
      predictedResilience: correct ? actual : actual === 'resilient' ? 'fragile' : 'resilient',
      note: `${basis} Prédiction incertaine.${perkNote}`,
    }
  }

  return {
    reliability: 'reliable',
    predictedResilience: actual,
    note: `${basis} Prédiction fiable.${perkNote}`,
  }
}

export interface CrisisOutcome {
  title: string
  specs: { label: string; value: string }[]
  text: string
  /** Variation du capital : négative si ça coûte, positive si ça récupère. */
  capitalDelta: number
  /** Coût en bande passante (mobiliser son réseau). */
  bandwidthCost: number
  /** true si la ligne quitte le portefeuille actif (atterrissage en douceur). */
  closesLine: boolean
  /** Effet sur la trajectoire de la ligne (portfolio-evolution.ts, decisions.md 2026-09-27). */
  lineEffect: CrisisLineEffect
}

/** Résout une décision de crise — le résultat dépend de la résilience RÉELLE du fondateur. */
export function resolveCrisisDecision(
  crisis: Crisis,
  decision: CrisisDecision,
): CrisisOutcome {
  const resilience = resilienceOf(crisis.line)
  const company = crisis.line.deal.companyName
  const founder = crisis.line.deal.founderName

  if (decision === 'soutenir') {
    return resilience === 'resilient'
      ? {
          title: '✓ Bridge injecté',
          specs: [
            { label: 'Coût', value: `-${SUPPORT_COST / 1000}K€` },
            { label: 'Résultat', value: 'Ligne renforcée' },
          ],
          text: `Le bridge couvre le trou de trésorerie. ${founder} en fait exactement ce qui était prévu — ${company} traverse la crise sans perdre sa trajectoire.`,
          capitalDelta: -SUPPORT_COST,
          bandwidthCost: 0,
          closesLine: false,
          lineEffect: 'strengthen',
        }
      : {
          title: '✕ Bridge absorbé sans effet',
          specs: [
            { label: 'Coût', value: `-${SUPPORT_COST / 1000}K€` },
            { label: 'Résultat', value: 'Problème repoussé' },
          ],
          text: `L'argent part dans le trou sans corriger la cause. ${founder} gagne un trimestre, mais rien dans sa façon de piloter ne change — le même choc reviendra.`,
          capitalDelta: -SUPPORT_COST,
          bandwidthCost: 0,
          closesLine: false,
          lineEffect: 'none',
        }
  }

  if (decision === 'laisser') {
    return resilience === 'resilient'
      ? {
          title: '○ Aucune intervention',
          specs: [
            { label: 'Coût', value: 'Gratuit' },
            { label: 'Résultat', value: 'Choc absorbé' },
          ],
          text: `${founder} gère seul. Sa discipline se confirme sous pression réelle — ${company} encaisse sans aide extérieure, et tu n'as rien dépensé.`,
          capitalDelta: 0,
          bandwidthCost: 0,
          closesLine: false,
          lineEffect: 'none',
        }
      : {
          title: '✕ Aucune intervention — la ligne décroche',
          specs: [
            { label: 'Coût', value: 'Gratuit' },
            { label: 'Résultat', value: 'Ligne fragilisée' },
          ],
          text: `Sans soutien, ${founder} encaisse mal le choc. ${company} sort du trimestre nettement affaibli — le risque assumé s'est matérialisé.`,
          capitalDelta: 0,
          bandwidthCost: 0,
          closesLine: false,
          lineEffect: 'weaken',
        }
  }

  if (decision === 'reseau') {
    // Effet incertain par construction (§3.6), indépendamment de la résilience.
    const worked = Math.random() < 0.6
    return worked
      ? {
          title: '~ Réseau mobilisé — effet partiel',
          specs: [
            { label: 'Coût', value: '-1 bande passante' },
            { label: 'Résultat', value: 'Tension retombée' },
          ],
          text: `Une introduction bien placée désamorce une partie du problème. Pas une solution complète, mais ${company} gagne du temps sans que tu sortes de capital.`,
          capitalDelta: 0,
          bandwidthCost: 1,
          closesLine: false,
          lineEffect: 'none',
        }
      : {
          title: '✕ Réseau mobilisé sans effet',
          specs: [
            { label: 'Coût', value: '-1 bande passante' },
            { label: 'Résultat', value: 'Sans effet' },
          ],
          text: `Les contacts ne donnent rien d'exploitable à temps. Tu as dépensé de la bande passante pour rien — ${company} se retrouve au même point.`,
          capitalDelta: 0,
          bandwidthCost: 1,
          closesLine: false,
          lineEffect: resilience === 'fragile' ? 'weaken' : 'none',
        }
  }

  // Atterrissage en douceur : sortie anticipée, upside définitivement abandonné (§3.6).
  const recovered = Math.round(crisis.line.investedAmount * SOFT_LANDING_RECOVERY_RATE)
  return {
    title: '■ Ligne clôturée — sortie anticipée',
    specs: [
      { label: 'Capital récupéré', value: `+${Math.round(recovered / 1000)}K€` },
      { label: 'Multiple sur ce ticket', value: `${SOFT_LANDING_RECOVERY_RATE.toFixed(1)}×` },
    ],
    text: `Rachat partiel accepté. Tu coupes la perte maintenant — mais tu ne sauras jamais si ${company} s'en serait sorti. Cette ligne quitte ton portefeuille actif.`,
    capitalDelta: recovered,
    bandwidthCost: 0,
    closesLine: true,
    lineEffect: 'none',
  }
}
