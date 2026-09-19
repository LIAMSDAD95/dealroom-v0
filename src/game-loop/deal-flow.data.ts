// Deal flow du Trimestre 1 — 4 opportunités (dans la fourchette 3-6 du product-spec §3.2).
// Noms/pitchs inspirés du screenshot deal flow envoyé par l'utilisateur (RESURGE, NRJ
// LOGISTICS, SOLVIX AI...). Une seule scène développée par tour (§3.2 : "~1 par tour").
//
// Signaux (product-spec §3.3) : structurel toujours visible d'office, équipe/trompeur
// masqués tant que le joueur n'a pas creusé — voir Claude/memory/decisions.md (2026-09-19).

import type { Deal } from './deal'

export const quarterOneDeals: Deal[] = [
  {
    id: 'q1-deal-resurge',
    founderArchetypeId: 'rescape',
    companyName: 'ReSurge',
    founderName: 'Marcus Idjeri',
    pitch: 'SaaS prévision de stock',
    sector: 'saas-b2b',
    stage: 'seed',
    ticker: '$RESURGE',
    attemptNumber: 2,
    isDevelopedScene: true,
    tags: [
      { label: '12 clients bêta', family: 'structurel' },
      { label: '40 clients par cœur', family: 'equipe' },
      { label: 'Pas de pivot < 3M€ ARR passé', family: 'equipe' },
    ],
  },
  {
    id: 'q1-deal-nrj-logistics',
    founderArchetypeId: 'veterane-secteur',
    companyName: 'NRJ Logistics',
    founderName: 'Alionne Diarra',
    pitch: 'Tournées PME',
    sector: 'marketplace',
    stage: 'seed',
    ticker: '$NRJL',
    attemptNumber: 1,
    isDevelopedScene: false,
    tags: [
      { label: 'MRR linéaire', family: 'structurel' },
      { label: 'TAM de niche jamais chiffré publiquement', family: 'equipe' },
    ],
  },
  {
    id: 'q1-deal-solvix-ai',
    founderArchetypeId: 'wunderkind-pedigree',
    companyName: 'Solvix AI',
    founderName: 'Théo Rambert',
    pitch: 'Assistant R&D pharma',
    sector: 'deeptech',
    stage: 'pre-seed',
    ticker: '$SOLVX',
    attemptNumber: 1,
    isDevelopedScene: false,
    tags: [
      { label: 'Ex-DeepMind', family: 'trompeur' },
      { label: 'Aucun proto testé en labo tiers', family: 'equipe' },
      { label: "Charisme média fort, pitch technique évasif", family: 'trompeur' },
    ],
  },
  {
    id: 'q1-deal-vaeli',
    founderArchetypeId: 'surfeur-hype',
    companyName: 'Vaeli',
    founderName: 'Camille Sorel',
    pitch: 'Marketplace BTP — urgence closing',
    sector: 'marketplace',
    stage: 'seed',
    ticker: '$VAELI',
    attemptNumber: 3,
    isDevelopedScene: false,
    tags: [
      { label: 'Croissance +40%/mo', family: 'trompeur' },
      { label: 'Croissance payée à 90% par ads', family: 'equipe' },
      { label: 'Rétention à 60 jours non communiquée', family: 'equipe' },
    ],
  },
]
