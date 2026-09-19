// Banque de signaux — ADR-002. Signaux structurels génériques (indépendants de
// l'archétype), et signaux équipe/trompeur spécifiques à chaque archétype fondateur
// Phase 0 (product-spec §4), pour garder la cohérence narrative de chaque profil tout en
// permettant au générateur de varier les combinaisons d'un tour à l'autre.

import type { DealTag } from '../game-loop/deal'
import type { FounderArchetypeId } from './types'

// product-spec §3.3 : structurel = marché/traction/valo, filtre d'entrée sans pouvoir
// prédictif fort. Générique, pas lié à un archétype précis.
export const structuralSignalPool: string[] = [
  '12 clients bêta',
  'MRR linéaire',
  'Croissance +8%/mo',
  '3 lettres d’intention signées',
  'Valorisation alignée sur le marché',
]

// Au moins 2 tags équipe + 1 tag trompeur par archétype, pour varier les cartes générées
// d'un tour à l'autre sans épuiser le contenu en quelques trimestres.
export const signalTagsByArchetype: Record<FounderArchetypeId, DealTag[]> = {
  'wunderkind-pedigree': [
    { label: 'Ex-DeepMind', family: 'trompeur' },
    { label: 'Charisme média fort, pitch technique évasif', family: 'trompeur' },
    { label: 'Aucun proto testé en labo tiers', family: 'equipe' },
    { label: 'Réponses vagues sur la roadmap produit', family: 'equipe' },
  ],
  'bricoleur-obsessionnel': [
    { label: '40 clients par cœur', family: 'equipe' },
    { label: 'Pas de pivot < 3M€ ARR passé', family: 'equipe' },
    { label: 'Présentation hésitante, notes manuscrites', family: 'trompeur' },
    { label: 'Connaît le taux de churn au client près', family: 'equipe' },
  ],
  'surfeur-hype': [
    { label: 'Croissance +40%/mo', family: 'trompeur' },
    { label: 'Croissance payée à 90% par ads', family: 'equipe' },
    { label: 'Rétention à 60 jours non communiquée', family: 'equipe' },
    { label: 'Forte présence sur les réseaux', family: 'trompeur' },
  ],
  'veterane-secteur': [
    { label: 'TAM de niche jamais chiffré publiquement', family: 'equipe' },
    { label: '15 ans dans le secteur, réseau dormant', family: 'equipe' },
    { label: 'Discours sobre, peu de storytelling', family: 'trompeur' },
    { label: 'Aucune levée précédente', family: 'equipe' },
  ],
  'duo-fracture': [
    { label: 'Duo complémentaire sur le papier', family: 'trompeur' },
    { label: 'Un seul fondateur répond aux questions techniques', family: 'equipe' },
    { label: 'Tension visible sur la répartition des parts', family: 'equipe' },
    { label: 'Pacte d’actionnaires signé récemment', family: 'equipe' },
  ],
  // Archétypes hors Phase 0 (phase0: false dans founders.ts) — tableaux vides en attendant
  // leur activation ; le générateur ne pioche que parmi les archétypes phase0: true.
  rescape: [],
  'scientifique-transfuge': [],
  'vendeur-ne-sans-produit': [],
  'prophete-mission': [],
}
