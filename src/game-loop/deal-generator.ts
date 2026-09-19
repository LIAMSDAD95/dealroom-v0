// Générateur de deal flow — ADR-002. Compose des deals à partir des banques de contenu
// (Signals & Content), filtrés strictement sur la thèse du joueur (secteur ET zone ET
// stade — pas de deal hors thèse en Phase 0, voir Claude/memory/adr.md).

import type { Deal, DealTag } from './deal'
import { baseTicketForStage } from './deal-flow'
import type { Sector } from './thesis'
import type { Thesis } from './thesis'
import { companyProfilesBySector, type CompanyProfile } from '../signals-content/company-names'
import { founderNamesByZone } from '../signals-content/founder-names'
import { structuralSignalPool, signalTagsByArchetype } from '../signals-content/signal-bank'
import { founderArchetypes } from '../signals-content/founders'
import type { FounderArchetypeId } from '../signals-content/types'

export const DEALS_PER_QUARTER = 4

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

// Pioche `count` éléments sans répétition tant que la banque le permet — ne se remet à
// répéter que si elle est plus petite que `count` (évite les doublons de carte à carte,
// voir Claude/memory/blockers.md 2026-09-19 "noms de startup dupliqués").
function pickManyNoRepeat<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5)
  const result: T[] = []
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length])
  }
  return result
}

function activePhase0ArchetypeIds(): FounderArchetypeId[] {
  return founderArchetypes.filter((a) => a.phase0).map((a) => a.id)
}

// Varie le montant recherché autour de la base du stade (±30%), arrondi à 10k€ près — évite
// que toutes les cartes d'un même stade affichent le même chiffre (voir
// Claude/memory/blockers.md, 2026-09-19 "montants identiques et trop élevés").
function generateAskAmount(stage: Parameters<typeof baseTicketForStage>[0]): number {
  const base = baseTicketForStage(stage)
  const variation = 0.7 + Math.random() * 0.6 // entre 70% et 130% de la base
  return Math.round((base * variation) / 10_000) * 10_000
}

function generateTags(archetypeId: FounderArchetypeId): DealTag[] {
  const structural: DealTag = { label: pickRandom(structuralSignalPool), family: 'structurel' }
  const archetypeTags = signalTagsByArchetype[archetypeId]
  const picked = pickManyNoRepeat(archetypeTags, 2)
  return [structural, ...picked]
}

/** Un profil de startup avec le secteur auquel il appartient, pour piocher toutes bannières confondues. */
interface SectorProfile {
  sector: Sector
  profile: CompanyProfile
}

/**
 * Compose DEALS_PER_QUARTER deals respectant strictement la thèse (secteur ET zone ET
 * stade) — voir Claude/memory/adr.md (ADR-002). Exactement 1 deal est marqué scène
 * développée par tour. Les profils de startup ne se répètent pas au sein d'un même tour
 * tant que la banque le permet.
 */
export function generateQuarterDeals(thesis: Thesis, quarterNumber: number): Deal[] {
  const archetypeIds = activePhase0ArchetypeIds()
  const developedSceneIndex = Math.floor(Math.random() * DEALS_PER_QUARTER)

  const availableProfiles: SectorProfile[] = thesis.sectors.flatMap((sector) =>
    companyProfilesBySector[sector].map((profile) => ({ sector, profile })),
  )
  const chosenProfiles = pickManyNoRepeat(availableProfiles, DEALS_PER_QUARTER)

  return chosenProfiles.map(({ sector, profile }, i) => {
    const archetypeId = pickRandom(archetypeIds)
    const founderName = pickRandom(founderNamesByZone[thesis.zone])

    return {
      id: `q${quarterNumber}-deal-${i + 1}-${profile.companyName.toLowerCase().replace(/\s+/g, '-')}`,
      founderArchetypeId: archetypeId,
      companyName: profile.companyName,
      founderName,
      pitch: profile.pitch,
      sector,
      stage: thesis.stage,
      ticker: profile.ticker,
      askAmount: generateAskAmount(thesis.stage),
      attemptNumber: 1 + Math.floor(Math.random() * 3),
      tags: generateTags(archetypeId),
      isDevelopedScene: i === developedSceneIndex,
    }
  })
}
