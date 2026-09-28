// Contexte de l'onboarding — product-spec §8.2. Les écrans demandent leur visite guidée
// (useTour) ; le provider les enchaîne une par une et affiche les bulles par-dessus tout.

import { createContext, useContext, useEffect } from 'react'
import type { TourId } from '../../signals-content/onboarding-content'

export interface OnboardingContextValue {
  /** Visite en cours d'affichage, ou null. */
  activeTour: TourId | null
  requestTour: (id: TourId) => void
  /** Retire une visite demandée par un écran qui disparaît avant qu'elle soit vue. */
  cancelTour: (id: TourId) => void
  /** Signale qu'un écran portant cette visite est affiché — pour le bouton Aide. */
  registerTour: (id: TourId) => () => void
}

export const OnboardingContext = createContext<OnboardingContextValue>({
  activeTour: null,
  requestTour: () => {},
  cancelTour: () => {},
  registerTour: () => () => {},
})

/** Demande la visite guidée de cet écran — affichée seulement si le joueur ne l'a jamais vue. */
export function useTour(id: TourId): void {
  const { requestTour, cancelTour, registerTour } = useContext(OnboardingContext)
  // Enregistrée même si déjà vue : le bouton Aide doit pouvoir la rejouer.
  useEffect(() => registerTour(id), [id, registerTour])
  useEffect(() => {
    requestTour(id)
    return () => cancelTour(id)
  }, [id, requestTour, cancelTour])
}

/** true pendant une visite : les chronos des cartes rapides se mettent en pause. */
export function useOnboardingActive(): boolean {
  return useContext(OnboardingContext).activeTour !== null
}
