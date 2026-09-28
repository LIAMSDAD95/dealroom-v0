// Détection d'environnement — product-spec §8.1, docs/architecture.md#5 (Technical).
// Le jeu est desktop-only en Phase 0 : en dessous de cette largeur, ou sur un appareil
// tactile sans pointeur précis, l'écran de blocage recouvre le jeu.

import { useEffect, useState } from 'react'

/** Largeur minimale utile : header de ressources + grilles de cartes + scènes en 2 colonnes. */
export const MIN_DESKTOP_WIDTH = 1024

// Téléphone ou tablette : écran tactile, et aucun pointeur précis (souris, trackpad) branché.
const TOUCH_ONLY_QUERY = '(pointer: coarse) and (not (any-pointer: fine))'
const NARROW_QUERY = `(max-width: ${MIN_DESKTOP_WIDTH - 1}px)`

function isDesktopNow(): boolean {
  return !window.matchMedia(NARROW_QUERY).matches && !window.matchMedia(TOUCH_ONLY_QUERY).matches
}

/**
 * Réévalué au redimensionnement : un joueur desktop qui rétrécit sa fenêtre voit le
 * blocage, puis retrouve sa partie intacte en l'agrandissant (le jeu reste monté dessous).
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(isDesktopNow)

  useEffect(() => {
    const queries = [window.matchMedia(NARROW_QUERY), window.matchMedia(TOUCH_ONLY_QUERY)]
    const update = () => setIsDesktop(isDesktopNow())
    for (const q of queries) q.addEventListener('change', update)
    return () => {
      for (const q of queries) q.removeEventListener('change', update)
    }
  }, [])

  return isDesktop
}
