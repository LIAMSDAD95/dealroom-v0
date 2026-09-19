// Banque de noms de fondateurs, indexée par zone — ADR-002. Purement cosmétique (aucun
// effet mécanique lié à la zone), juste pour donner une cohérence géographique au deal
// flow généré selon la zone de la thèse.

import type { Zone } from '../game-loop/thesis'

export const founderNamesByZone: Record<Zone, string[]> = {
  france: ['Marcus Idjeri', 'Camille Sorel', 'Théo Rambert', 'Alionne Diarra', 'Inès Kadri'],
  europe: ['Lukas Hoffmann', 'Marta Nowak', 'Sven Eriksson', 'Elena Rossi', 'Bram Verhoeven'],
  us: ['Jordan Ellis', 'Priya Nair', 'Tyler Brooks', 'Maya Whitfield', 'Derek Okafor'],
}
