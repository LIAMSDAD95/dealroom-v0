// Questions de la scène de pitch LP — product-spec §3.1.3. Contenu narratif par offre de LP
// (src/game-loop/lp-pool.ts), calé sur vc-techwear-lp_7.html. Domaine Signals & Content :
// ce fichier ne contient aucun calcul de confiance/montant, seulement le texte et les effets
// bruts de chaque réponse — la résolution appartient à Game Loop.

import type { PitchAngle, ResponseTone } from './types'

export interface PitchAnswerOption {
  text: string
  /** Delta de confiance brut, avant bonus/malus de cohérence d'angle. */
  confidenceDelta: number
  tone: ResponseTone | null
  /** Libellé de l'engagement créé par cette réponse, s'il y en a un (product-spec §3.1.3). */
  engagementLabel: string | null
}

export interface PitchQuestion {
  text: string
  options: PitchAnswerOption[]
}

/** Angles déjà débloqués au Fonds I (product-spec §3.1.3 : Réseau et Track record verrouillés). */
export const unlockedAnglesFundI: PitchAngle[] = ['conviction', 'discipline']

// Clé = LpOffer.id (src/game-loop/lp-pool.data.ts). Seules les offres avec un contenu ici
// ont une scène de pitch jouable pour l'instant — voir Claude/memory/decisions.md.
export const pitchQuestionsByOfferId: Record<string, PitchQuestion[]> = {
  'fund-i-northbridge': [
    {
      text: 'Que ferez-vous si un deal extrêmement prometteur dépasse votre limite de risque déclarée ?',
      options: [
        {
          text: 'Je respecterai toujours la limite, sans exception.',
          confidenceDelta: 22,
          tone: 'discipline',
          engagementLabel: 'Respect strict de la limite de risque déclarée',
        },
        {
          text: 'Je vous consulterai au cas par cas.',
          confidenceDelta: 4,
          tone: 'aucun',
          engagementLabel: null,
        },
        {
          text: 'Je prendrai le risque si la conviction est assez forte.',
          confidenceDelta: -12,
          tone: 'conviction',
          engagementLabel: null,
        },
      ],
    },
    {
      text: 'Comment vous assurez-vous de déployer vite sans sacrifier la sélectivité ?',
      options: [
        {
          text: 'Un process de due diligence cadré, appliqué à chaque deal.',
          confidenceDelta: 18,
          tone: 'discipline',
          engagementLabel: null,
        },
        {
          text: 'Je fais confiance à mon instinct pour trancher vite.',
          confidenceDelta: -15,
          tone: 'conviction',
          engagementLabel: null,
        },
        {
          text: "Honnêtement, ça reste un vrai défi à ce stade.",
          confidenceDelta: 2,
          tone: 'aucun',
          engagementLabel: null,
        },
      ],
    },
  ],
  'fund-i-yann-fontaine': [
    {
      text: "Qu'est-ce qui te fait dire que tu vaux mieux qu'un board classique pour un fondateur en galère ?",
      options: [
        {
          text: 'Je ne prétends pas être meilleur — je serai juste très présent.',
          confidenceDelta: 20,
          tone: 'aucun',
          engagementLabel: 'Disponibilité forte annoncée aux fondateurs',
        },
        {
          text: 'Mon réseau et mon expérience feront la différence.',
          confidenceDelta: 8,
          tone: 'reseau',
          engagementLabel: null,
        },
        {
          text: 'Ma capacité à sourcer les meilleurs deals avant tout le monde.',
          confidenceDelta: -15,
          tone: 'aucun',
          engagementLabel: null,
        },
      ],
    },
    {
      text: 'Tu attends quoi de moi en échange de ton bonus de deal flow ?',
      options: [
        {
          text: 'Rien en particulier — je resterai transparent sur mes décisions.',
          confidenceDelta: 16,
          tone: 'discipline',
          engagementLabel: 'Transparence sur les décisions d’investissement',
        },
        {
          text: 'Un accès prioritaire à mes meilleurs deals, en retour.',
          confidenceDelta: 6,
          tone: 'reseau',
          engagementLabel: null,
        },
        {
          text: "Je verrai au cas par cas, difficile de m'engager maintenant.",
          confidenceDelta: -10,
          tone: 'aucun',
          engagementLabel: null,
        },
      ],
    },
  ],
  'fund-i-family-office-r': [
    {
      text: "Pourquoi devrais-je accepter de partager mes meilleurs deals en co-invest plutôt qu'un autre GP ?",
      options: [
        {
          text: 'Je vous tiendrai informé en amont, avant même la décision finale.',
          confidenceDelta: 20,
          tone: 'discipline',
          engagementLabel: 'Information anticipée sur les opportunités de co-invest',
        },
        {
          text: "Ma conviction sur les deals que je choisis devrait suffire à vous convaincre.",
          confidenceDelta: -10,
          tone: 'conviction',
          engagementLabel: null,
        },
        {
          text: 'Je ne peux rien garantir tant que le deal flow ne s’est pas confirmé.',
          confidenceDelta: 2,
          tone: 'aucun',
          engagementLabel: null,
        },
      ],
    },
    {
      text: 'Vous restez comment sur ce secteur si le marché se retourne dans dix-huit mois ?',
      options: [
        {
          text: 'Je garde le cap sur ma thèse, quitte à ralentir le rythme de déploiement.',
          confidenceDelta: 18,
          tone: 'discipline',
          engagementLabel: null,
        },
        {
          text: "Je m'adapterai en fonction des signaux du marché, sans plan figé.",
          confidenceDelta: -8,
          tone: 'aucun',
          engagementLabel: null,
        },
        {
          text: 'Un bon deal reste un bon deal, quel que soit le climat.',
          confidenceDelta: -14,
          tone: 'conviction',
          engagementLabel: null,
        },
      ],
    },
  ],
  'fund-i-fonds-pension-b': [
    {
      text: 'Comment garantissez-vous concrètement le respect de la limite de 25% en deals haute variance ?',
      options: [
        {
          text: 'Un suivi documenté à chaque clôture de trimestre, partagé avec vous.',
          confidenceDelta: 22,
          tone: 'discipline',
          engagementLabel: 'Reporting trimestriel du risque de portefeuille',
        },
        {
          text: 'Je fais confiance à mon jugement pour ne pas dépasser cette limite.',
          confidenceDelta: -12,
          tone: 'conviction',
          engagementLabel: null,
        },
        {
          text: "C'est une contrainte que je découvre vraiment en marchant.",
          confidenceDelta: -5,
          tone: 'aucun',
          engagementLabel: null,
        },
      ],
    },
    {
      text: 'Un deal remarquable dépasse votre limite de risque — vous faites quoi ?',
      options: [
        {
          text: 'Je le laisse passer, la limite prime sur toute opportunité isolée.',
          confidenceDelta: 20,
          tone: 'discipline',
          engagementLabel: 'Respect strict de la limite de risque déclarée',
        },
        {
          text: 'Je vous consulte avant toute décision qui s’en approche.',
          confidenceDelta: 6,
          tone: 'aucun',
          engagementLabel: null,
        },
        {
          text: "Je négocie une exception si la conviction est suffisamment forte.",
          confidenceDelta: -15,
          tone: 'conviction',
          engagementLabel: null,
        },
      ],
    },
  ],
}
