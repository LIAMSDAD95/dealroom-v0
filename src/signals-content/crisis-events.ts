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
        '« Je sais ce que ce genre de deal peut coûter. On va peut-être perdre ce client si je refuse, mais je préfère ça plutôt que de creuser un trou qu’on ne rebouchera pas. » — le board a été informé dans l’heure.',
      fragile:
        '« On va accepter, évidemment. On ne peut pas se permettre de perdre un logo pareil en ce moment. » — aucun chiffrage de l’impact sur le runway avant de répondre.',
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
        '« C’est un coup dur, mais la doc est à jour et deux personnes connaissent le cœur du système. J’ai déjà réorganisé les priorités. » — l’équipe a été réunie le soir même.',
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
        '« On avait anticipé une partie du sujet. Il manque du budget, pas de la compréhension — je sais exactement ce qu’il faut faire. » — le chiffrage détaillé est déjà prêt.',
      fragile:
        '« On verra comment les autres s’organisent, il y aura sûrement des aménagements. » — le texte n’a pas encore été lu en entier.',
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
        '« Je refuse un down round, ce serait un signal désastreux. On va trouver quelqu’un qui valorise correctement. » — ce quelqu’un reste introuvable.',
    },
  },

  // --- Ajouts 2026-09-29 : au moins 6 alertes possibles par secteur, pour qu'un run
  // (5 crises au plus, Q4-Q8) ne répète jamais la même (retour utilisateur).
  {
    id: 'infra-outage',
    headline: 'Panne majeure chez un fournisseur d’infrastructure',
    affectedSectors: ['saas-b2b', 'fintech', 'marketplace'],
    situation:
      'Le fournisseur cloud de {company} subit trois jours de panne. Les clients réclament des pénalités et deux d’entre eux menacent de partir.',
    founderReaction: {
      resilient:
        '« Le plan de reprise a tenu à moitié. On indemnise tout de suite, on publie un post-mortem honnête et on double l’hébergement. » — chaque client a reçu un appel personnel.',
      fragile:
        '« Ce n’est pas notre faute, c’est le fournisseur. Les clients comprendront. » — aucun client n’a encore été contacté.',
    },
  },
  {
    id: 'key-account-churn',
    headline: 'Résiliation d’un grand compte',
    affectedSectors: ['saas-b2b', 'deeptech'],
    situation:
      'Le premier client de {company}, 30 % du chiffre d’affaires, résilie à l’échéance après un changement de direction chez lui.',
    founderReaction: {
      resilient:
        '« On savait que la concentration était notre point faible. Trois prospects sont en phase finale, on accélère et on coupe les dépenses non vitales en attendant. » — le runway a été recalculé le jour même.',
      fragile:
        '« Ils vont revenir, leur nouvelle direction n’a pas compris le produit. » — rien n’est prévu si ce n’est pas le cas.',
    },
  },
  {
    id: 'competitor-mega-round',
    headline: 'Un concurrent lève 50 M€',
    affectedSectors: null,
    situation:
      'Le principal concurrent de {company} annonce une levée géante et recrute agressivement dans son équipe.',
    founderReaction: {
      resilient:
        '« Ils vont brûler cet argent en acquisition. Nous, on reste sur notre niche, là où ils ne savent pas aller. » — la feuille de route n’a pas bougé d’une ligne.',
      fragile:
        '« Il faut qu’on lève aussi, vite, et qu’on double l’équipe. » — le plan de recrutement dépasse déjà la trésorerie disponible.',
    },
  },
  {
    id: 'banking-partner-cut',
    headline: 'Un partenaire bancaire coupe ses services',
    affectedSectors: ['fintech', 'marketplace'],
    situation:
      'La banque partenaire de {company} met fin à son contrat sous trente jours après un audit interne. Sans relais, les paiements s’arrêtent.',
    founderReaction: {
      resilient:
        '« On avait un second partenaire en veille pour ce cas précis. La bascule prend trois semaines, on prévient les clients maintenant. » — le calendrier de migration est prêt.',
      fragile:
        '« Ils ne peuvent pas nous faire ça, on va contester. » — aucune banque de remplacement n’a été approchée.',
    },
  },
  {
    id: 'consumer-demand-drop',
    headline: 'Chute de la consommation des ménages',
    affectedSectors: ['consumer', 'marketplace'],
    situation:
      'L’inflation fait plonger les dépenses non essentielles. Le panier moyen chez {company} recule de 25 % en deux mois.',
    founderReaction: {
      resilient:
        '« On repositionne l’offre sur l’essentiel et on renégocie avec les fournisseurs. Moins de marge, mais les clients restent. » — les nouveaux prix sont déjà testés.',
      fragile:
        '« C’est conjoncturel, ça va repartir au prochain trimestre. » — le budget marketing reste inchangé.',
    },
  },
  {
    id: 'patent-dispute',
    headline: 'Litige de brevet',
    affectedSectors: ['deeptech', 'saas-b2b'],
    situation:
      'Un grand groupe attaque {company} pour contrefaçon de brevet. La procédure peut geler les ventes pendant des mois.',
    founderReaction: {
      resilient:
        '« Nos avocats ont revu l’antériorité dès la création. On a de quoi répondre, et une variante technique prête si besoin. » — le dossier de défense était déjà constitué.',
      fragile:
        '« C’est de l’intimidation, on ne va pas se laisser faire. » — aucun conseil spécialisé n’a encore été consulté.',
    },
  },
  {
    id: 'data-breach',
    headline: 'Fuite de données chez une participation',
    affectedSectors: ['saas-b2b', 'fintech', 'consumer'],
    situation:
      'Une faille expose les données de milliers d’utilisateurs de {company}. La presse s’en empare et l’autorité de contrôle ouvre une enquête.',
    founderReaction: {
      resilient:
        '« On notifie tout le monde dans les 72 heures, on publie ce qu’on sait et on fait auditer le système par un tiers. » — la notification réglementaire est déjà partie.',
      fragile:
        '« Inutile d’en faire trop, ça va retomber. » — les utilisateurs concernés n’ont pas été prévenus.',
    },
  },
]
