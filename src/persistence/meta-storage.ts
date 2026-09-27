// Sauvegarde locale de la méta-progression — product-spec §8.3 : stockage navigateur
// uniquement, pas de compte. Domaine Persistence : lecture/écriture et validation du
// format, aucune règle de jeu (celles-ci sont dans game-loop/meta.ts).

import type { MetaProgress, PerkId } from '../game-loop/meta'
import { INITIAL_META } from '../game-loop/meta'

const STORAGE_KEY = 'dealroom.meta.v1'

const KNOWN_PERKS: PerkId[] = ['premier-fonds', 'instinct-chasseur', 'sang-froid', 'discipline-reserve']

/** Relit la sauvegarde ; retombe sur un départ neuf si elle est absente, illisible ou corrompue. */
export function loadMeta(): MetaProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_META
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null) return INITIAL_META
    const d = data as Partial<MetaProgress>
    return {
      fundNumber: Number.isInteger(d.fundNumber) && d.fundNumber! >= 1 ? d.fundNumber! : 1,
      reputation:
        typeof d.reputation === 'number' ? Math.max(0, Math.min(100, d.reputation)) : 0,
      perks: Array.isArray(d.perks) ? d.perks.filter((p) => KNOWN_PERKS.includes(p)) : [],
      returningLps: Array.isArray(d.returningLps)
        ? d.returningLps.filter(
            (lp) => typeof lp?.offerId === 'string' && typeof lp?.amount === 'number',
          )
        : [],
    }
  } catch {
    // Stockage bloqué (navigation privée, quota) : on joue sans sauvegarde.
    return INITIAL_META
  }
}

export function saveMeta(meta: MetaProgress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meta))
  } catch {
    // Même cas : la partie continue, seule la persistance est perdue.
  }
}
