// Sauvegarde locale de l'onboarding — product-spec §8.2/§8.3. Domaine Persistence : quelles
// visites guidées le joueur a déjà vues, et s'il a désactivé l'aide. Aucune règle de jeu.

const STORAGE_KEY = 'dealroom.onboarding.v1'

export interface OnboardingProgress {
  seenTours: string[]
  /** true si le joueur a choisi « Ne plus afficher l'aide ». */
  disabled: boolean
}

const EMPTY: OnboardingProgress = { seenTours: [], disabled: false }

export function loadOnboarding(): OnboardingProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const data = JSON.parse(raw) as Partial<OnboardingProgress> | null
    return {
      seenTours: Array.isArray(data?.seenTours)
        ? data.seenTours.filter((t): t is string => typeof t === 'string')
        : [],
      disabled: data?.disabled === true,
    }
  } catch {
    // Stockage bloqué ou corrompu : l'aide s'affiche comme pour un nouveau joueur.
    return EMPTY
  }
}

export function saveOnboarding(progress: OnboardingProgress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Sans stockage, l'aide réapparaîtra au prochain chargement — sans gravité.
  }
}
