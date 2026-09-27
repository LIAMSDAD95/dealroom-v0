// Contenu des crises macro — product-spec §3.6. Chaque événement porte le bandeau
// d'alerte, la news qui touche la ligne ciblée, et deux réactions possibles du fondateur
// selon sa résilience réelle (jamais révélée au joueur autrement que par les signaux).
//
// Domaine Signals & Content : uniquement du texte. Le tirage de l'événement, le ciblage
// de la ligne et la résolution des décisions appartiennent à Game Loop (crisis.ts).

import type { Sector } from '../game-loop/thesis'

export interface CrisisEvent {
  id: string
  /** Titre du bandeau d'alerte rouge. */
  headline: string
  /** Secteurs touchés — la crise ne cible qu'une ligne de ces secteurs. null = tous. */
  affectedSectors: Sector[] | null
  /** La news telle qu'elle arrive au joueur (bulle système dans le fil). */
  situation: string
  /** Réaction du fondateur — la version affichée dépend de sa résilience réelle. */
  founderReaction: {
    resilient: string
    fragile: string
  }
}

export const crisisEvents: CrisisEvent[] = [
  {
    id: 'credit-crunch',
    headline: 'Resserrement du crédit interentreprises',
    affectedSectors: ['saas-b2b', 'fintech', 'marketplace'],
    situation:
      'Un des plus gros clients de {company}, en tension de trésorerie, demande à repousser son paiement de 60 jours — ou menace de partir.',
    founderReaction: {
      resilient:
        '« Je sais ce que ce genre de deal peut coûter. On va peut-être perdre ce client si je refuse, mais je préfère ça plutôt que de creuser un trou qu’on ne rebouchera pas. » — il a informé son board dans l’heure.',
      fragile:
        '« On va accepter, évidemment. On ne peut pas se permettre de perdre une logo pareille en ce moment. » — il n’a pas chiffré l’impact sur son runway avant de répondre.',
    },
  },
  {
    id: 'cac-spike',
    headline: 'Flambée des coûts d’acquisition publicitaire',
    affectedSectors: ['consumer', 'marketplace'],
    situation:
      'Les plateformes d’acquisition relèvent leurs tarifs de 40% d’un trimestre à l’autre. L’économie unitaire de {company} passe dans le rouge.',
    founderReaction: {
      resilient:
        '« On coupe le payant dès cette semaine et on assume trois mois de croissance plate. Le produit tient sans, on l’a testé. » — le plan de bascule était déjà écrit.',
      fragile:
        '« On maintient le budget, c’est le moment de prendre des parts de marché pendant que les autres reculent. » — aucune projection de trésorerie à l’appui.',
    },
  },
  {
    id: 'key-hire-leaves',
    headline: 'Départ d’un profil clé chez une participation',
    affectedSectors: null,
    situation:
      'Le profil technique le plus senior de {company} démissionne sans préavis, débauché par un concurrent mieux financé.',
    founderReaction: {
      resilient:
        '« C’est un coup dur, mais la doc est à jour et deux personnes connaissent le cœur du système. J’ai déjà réorganisé les priorités. » — il a appelé l’équipe le soir même.',
      fragile:
        '« Franchement, on ne réalise pas encore tout ce qu’il portait. » — le reste de l’équipe découvre des pans entiers du code sans documentation.',
    },
  },
  {
    id: 'regulatory-shift',
    headline: 'Durcissement réglementaire sectoriel',
    affectedSectors: ['fintech', 'deeptech'],
    situation:
      'Un nouveau cadre de conformité entre en vigueur dans six mois. {company} doit financer une mise en conformité non budgétée.',
    founderReaction: {
      resilient:
        '« On avait anticipé une partie du sujet. Il manque du budget, pas de la compréhension — je sais exactement ce qu’il faut faire. » — il arrive avec un chiffrage détaillé.',
      fragile:
        '« On verra comment les autres s’organisent, il y aura sûrement des aménagements. » — il n’a pas encore lu le texte en entier.',
    },
  },
  {
    id: 'down-round-market',
    headline: 'Correction des valorisations sur le marché privé',
    affectedSectors: null,
    situation:
      'Les comparables de {company} lèvent à des multiples divisés par deux. Le prochain tour se fera à la baisse ou pas du tout.',
    founderReaction: {
      resilient:
        '« On réduit la voilure pour tenir dix-huit mois sans lever. Je préfère une boîte plus petite et vivante. » — le plan de coupe est déjà prêt.',
      fragile:
        '« Je refuse un down round, ce serait un signal désastreux. On va trouver quelqu’un qui valorise correctement. » — il cherche toujours ce quelqu’un.',
    },
  },
]
