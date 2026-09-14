// Données des archétypes fondateurs — product-spec §4.
// Les 5 premiers sont actifs en Phase 0 (docs/PRD.md §5 : "4-5 archétypes").
// Le choix des 5 est arbitraire à ce stade — à ajuster via Claude/memory/decisions.md
// si un arbitrage précis est tranché plus tard.

import type { FounderArchetype } from './types'

export const founderArchetypes: FounderArchetype[] = [
  {
    id: 'wunderkind-pedigree',
    label: 'Wunderkind du pedigree',
    description: 'Charisme + pedigree masquant un manque de conviction profonde.',
    phase0: true,
  },
  {
    id: 'bricoleur-obsessionnel',
    label: 'Bricoleur obsessionnel',
    description: 'Présentation maladroite, précision chirurgicale une fois creusé.',
    phase0: true,
  },
  {
    id: 'surfeur-hype',
    label: 'Surfeur de hype',
    description: 'Croissance payée par ads, jamais de rétention prouvée.',
    phase0: true,
  },
  {
    id: 'veterane-secteur',
    label: 'Vétérante du secteur',
    description: 'Sobre, marché de niche à TAM caché.',
    phase0: true,
  },
  {
    id: 'duo-fracture',
    label: 'Duo fondateur fracturé',
    description:
      'Tout semble parfait, la fracture n’apparaît qu’à une question de friction précise.',
    phase0: true,
  },
  {
    id: 'rescape',
    label: 'Le Rescapé',
    description:
      'Second-time founder ; le twist se lit dans la réaction à une situation actuelle similaire à l’échec passé.',
    phase0: false,
  },
  {
    id: 'scientifique-transfuge',
    label: 'Scientifique transfuge',
    description:
      'Technique irréprochable, flou business ; signal clé = lucidité vs déni face à ce flou.',
    phase0: false,
  },
  {
    id: 'vendeur-ne-sans-produit',
    label: 'Vendeur-né sans produit',
    description: 'Aplomb total, suspect par absence de doute légitime.',
    phase0: false,
  },
  {
    id: 'prophete-mission',
    label: 'Prophète de mission',
    description:
      'Conviction personnelle confondue avec conviction business ; signal clé = alignement mission/modèle économique.',
    phase0: false,
  },
]
