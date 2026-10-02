// Identité du testeur — product-spec §8.4 (collecte des données de playtest). Domaine
// Persistence : un identifiant aléatoire propre au navigateur, et le pseudo facultatif
// saisi sur l'écran de thèse. Sert à relier un run à un testeur et à suivre sa progression
// d'un fonds à l'autre (décision utilisateur 2026-09-29). Aucune autre donnée personnelle.

const STORAGE_KEY = 'dealroom.player.v1'

/** Longueur maximale du pseudo — assez pour un prénom ou un handle. */
export const MAX_PSEUDO_LENGTH = 24

export interface PlayerIdentity {
  /** Identifiant aléatoire, créé au premier lancement, stable tant que le stockage l'est. */
  id: string
  /** Pseudo facultatif ; chaîne vide si le testeur n'en donne pas. */
  pseudo: string
}

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function save(identity: PlayerIdentity): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(identity))
  } catch {
    // Stockage bloqué : l'identité ne vit que le temps de la session.
  }
}

/** Relit l'identité ; la crée (et la sauvegarde) au premier lancement. */
export function loadPlayer(): PlayerIdentity {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const data = raw ? (JSON.parse(raw) as Partial<PlayerIdentity> | null) : null
    if (data && typeof data.id === 'string' && data.id.length > 0) {
      return { id: data.id, pseudo: typeof data.pseudo === 'string' ? data.pseudo : '' }
    }
  } catch {
    // Sauvegarde illisible : on repart d'une identité neuve.
  }
  const identity = { id: newId(), pseudo: '' }
  save(identity)
  return identity
}

export function savePseudo(identity: PlayerIdentity, pseudo: string): PlayerIdentity {
  const next = { ...identity, pseudo: pseudo.trim().slice(0, MAX_PSEUDO_LENGTH) }
  save(next)
  return next
}
