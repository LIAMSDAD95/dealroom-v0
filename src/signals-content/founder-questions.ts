// Banque de questions pour la scène de dialogue fondateur — product-spec §3.4.
// 8-10 questions par archétype Phase 0 ; 6 sont tirées à chaque scène (voir
// Claude/memory/decisions.md, 2026-09-22) pour que revoir le même archétype au
// trimestre 5 ne repropose pas le même entretien qu'au trimestre 1.
//
// Domaine Signals & Content : uniquement du texte et le signal révélé. Le coût en
// attention/patience est une règle de ressources — elle appartient à Game Loop
// (founder-scene.ts), ce fichier ne fait que déclarer le poids relatif de la question.

import type { DealTag } from '../game-loop/deal'
import type { FounderArchetypeId } from './types'

export interface FounderQuestion {
  id: string
  /** Question posée par le joueur. */
  text: string
  /** Réponse du fondateur, affichée en bulle dans le fil de chat. */
  answer: string
  /** Coût en attention : 1 = question courante, 2 = question qui creuse vraiment (§3.4). */
  attentionCost: 1 | 2
  /** Signal révélé par la réponse, s'il y en a un. */
  revealsSignal: DealTag | null
}

/**
 * Pitch d'ouverture prononcé par le fondateur à l'arrivée du joueur dans la scène.
 * 2-3 variantes par archétype, tirées au hasard : le ton reflète l'archétype (le
 * Wunderkind vend du rêve, le Bricoleur donne des chiffres bruts). `{company}` est
 * remplacé par le nom de la startup à l'affichage.
 */
export const founderOpeningPitchesByArchetype: Record<FounderArchetypeId, string[]> = {
  'wunderkind-pedigree': [
    '{company}, c’est la solution que tout le monde attend sur ce marché. On a l’équipe, on a la techno, et franchement le timing est parfait. Je ne vois pas qui peut nous arrêter.',
    'Merci de me recevoir. {company} attaque un marché énorme avec une approche que personne n’a osé tenter. J’ai quitté un poste confortable pour ça — c’est dire si j’y crois.',
  ],
  'bricoleur-obsessionnel': [
    'Bon. {company}. J’ai quarante clients, ils paient tous, et je peux vous dire pour chacun ce qui les empêcherait de renouveler. Je n’ai pas de slides, mais j’ai des chiffres.',
    'Je vais être direct : {company} résout un problème que j’ai vu de mes yeux pendant six ans. Ce n’est pas un marché sexy. C’est un marché qui paie.',
  ],
  'surfeur-hype': [
    '{company} fait x3 tous les trimestres depuis un an. Le marché bascule, on est au bon endroit au bon moment, et on veut accélérer maintenant avant que la fenêtre se referme.',
    'On a construit quelque chose que les gens partagent spontanément. {company}, c’est 40 000 utilisateurs en huit mois sans budget sales. Imaginez avec des moyens.',
  ],
  'veterane-secteur': [
    'Quinze ans que je travaille dans ce secteur. {company}, c’est ce que j’aurais voulu avoir quand j’étais de l’autre côté. Je ne vais pas vous vendre un TAM à dix milliards.',
    '{company} est rentable sur son périmètre actuel. Je viens vous voir pour aller plus vite, pas parce que j’ai besoin d’argent pour survivre.',
  ],
  'duo-fracture': [
    '[Les deux fondateurs entrent ensemble.] {company}, c’est notre projet commun depuis quatre ans. On se complète bien — produit et commercial. [Le second sourit sans parler.]',
    'On est deux sur {company}, et c’est notre force. [Le premier fondateur prend la parole et la garde.] On a une répartition très claire des rôles.',
  ],
  rescape: [],
  'scientifique-transfuge': [],
  'vendeur-ne-sans-produit': [],
  'prophete-mission': [],
}

export const founderQuestionsByArchetype: Record<FounderArchetypeId, FounderQuestion[]> = {
  'wunderkind-pedigree': [
    {
      id: 'wk-1',
      text: 'Qu’est-ce qui vous rend légitime sur ce problème précis ?',
      answer:
        'J’ai passé trois ans chez DeepMind sur des sujets adjacents. L’équipe là-bas savait reconnaître un problème qui vaut le coup.',
      attentionCost: 1,
      revealsSignal: { label: 'Ex-DeepMind', family: 'trompeur' },
    },
    {
      id: 'wk-2',
      text: 'Montrez-moi où en est le produit aujourd’hui.',
      answer:
        'On a une démo interne très convaincante. Les tests en conditions réelles, c’est la prochaine étape — on voulait d’abord valider l’appétence marché.',
      attentionCost: 2,
      revealsSignal: { label: 'Aucun proto testé en labo tiers', family: 'equipe' },
    },
    {
      id: 'wk-3',
      text: 'Quelle est votre roadmap sur les 12 prochains mois ?',
      answer:
        'On va itérer vite, écouter le marché, et scaler dès que le signal est là. Je préfère rester flexible que m’enfermer dans un plan rigide.',
      attentionCost: 1,
      revealsSignal: { label: 'Réponses vagues sur la roadmap produit', family: 'equipe' },
    },
    {
      id: 'wk-4',
      text: 'Expliquez-moi techniquement comment ça marche.',
      answer:
        'C’est une architecture assez élégante… Le cœur, c’est notre approche du problème. Je peux vous mettre en relation avec mon CTO pour les détails.',
      attentionCost: 2,
      revealsSignal: { label: 'Charisme média fort, pitch technique évasif', family: 'trompeur' },
    },
    {
      id: 'wk-5',
      text: 'Qui sont vos trois premiers clients et que paient-ils ?',
      answer:
        'On est en discussion avancée avec plusieurs grands comptes. Rien de signé encore, mais l’intérêt est très fort.',
      attentionCost: 1,
      revealsSignal: null,
    },
    {
      id: 'wk-6',
      text: 'Qu’est-ce qui vous ferait arrêter ce projet ?',
      answer:
        'Honnêtement ? Rien. Je suis convaincu qu’on tient quelque chose d’énorme. C’est une question de temps.',
      attentionCost: 1,
      revealsSignal: null,
    },
    {
      id: 'wk-7',
      text: 'Parlez-moi d’une fois où vous vous êtes trompé.',
      answer:
        'J’ai sous-estimé le temps du recrutement au début. Mais on a corrigé vite, on a un super réseau.',
      attentionCost: 2,
      revealsSignal: null,
    },
    {
      id: 'wk-8',
      text: 'Comment répartissez-vous le temps entre produit et levée ?',
      answer:
        'En ce moment, beaucoup sur la levée — c’est le moment. L’équipe tient le produit pendant ce temps.',
      attentionCost: 1,
      revealsSignal: { label: 'Réponses vagues sur la roadmap produit', family: 'equipe' },
    },
  ],

  'bricoleur-obsessionnel': [
    {
      id: 'br-1',
      text: 'Parlez-moi de vos clients actuels.',
      answer:
        'Alors — Durand, 14 postes, churn zéro depuis 18 mois. Mercier, 6 postes, a failli partir en mars à cause d’un bug d’export que j’ai corrigé le week-end. Je peux tous vous les faire.',
      attentionCost: 2,
      revealsSignal: { label: '40 clients par cœur', family: 'equipe' },
    },
    {
      id: 'br-2',
      text: 'Quel est votre taux de churn exact ?',
      answer:
        '2,3% mensuel sur les douze derniers mois. 1,8% si on exclut les deux comptes qu’on a nous-mêmes résiliés pour usage non conforme.',
      attentionCost: 1,
      revealsSignal: { label: 'Connaît le taux de churn au client près', family: 'equipe' },
    },
    {
      id: 'br-3',
      text: 'Avez-vous déjà envisagé de pivoter ?',
      answer:
        'Non. Le problème que je résous existe, je le vois tous les jours chez mes clients. Tant qu’on n’a pas 3 millions d’ARR, pivoter serait une fuite.',
      attentionCost: 2,
      revealsSignal: { label: 'Pas de pivot < 3M€ ARR passé', family: 'equipe' },
    },
    {
      id: 'br-4',
      text: 'Comment voyez-vous le marché dans cinq ans ?',
      answer:
        'Je… franchement, je suis meilleur sur les douze prochains mois. Cinq ans, je ne sais pas. Ce que je sais, c’est ce que mes clients demandent maintenant.',
      attentionCost: 1,
      revealsSignal: { label: 'Présentation hésitante, notes manuscrites', family: 'trompeur' },
    },
    {
      id: 'br-5',
      text: 'Qu’est-ce que vous feriez avec notre argent ?',
      answer:
        'Deux développeurs et un support. Pas de marketing pour l’instant — on n’a pas fini d’absorber la demande entrante.',
      attentionCost: 1,
      revealsSignal: null,
    },
    {
      id: 'br-6',
      text: 'Votre plus gros échec produit ?',
      answer:
        'La v2 de l’interface. Six mois de travail, les clients l’ont détestée. J’ai tout rollback et refait en partant de leurs sessions enregistrées.',
      attentionCost: 2,
      revealsSignal: null,
    },
    {
      id: 'br-7',
      text: 'Qui d’autre pourrait faire ce que vous faites ?',
      answer:
        'Techniquement, beaucoup de monde. Mais il faudrait passer deux ans chez les clients pour comprendre pourquoi les solutions évidentes ne marchent pas.',
      attentionCost: 1,
      revealsSignal: null,
    },
    {
      id: 'br-8',
      text: 'Comment recrutez-vous ?',
      answer:
        'Mal, pour l’instant. Je n’ai pas le réflexe de déléguer. C’est probablement mon principal frein.',
      attentionCost: 1,
      revealsSignal: null,
    },
  ],

  'surfeur-hype': [
    {
      id: 'sh-1',
      text: 'D’où vient votre croissance exactement ?',
      answer:
        'Acquisition payante principalement. On a trouvé des canaux qui convertissent très bien, on met du budget dessus et ça scale.',
      attentionCost: 2,
      revealsSignal: { label: 'Croissance payée à 90% par ads', family: 'equipe' },
    },
    {
      id: 'sh-2',
      text: 'Quelle est votre rétention à 60 jours ?',
      answer:
        'On regarde surtout la croissance du top of funnel pour l’instant. La rétention, c’est un chantier du prochain trimestre.',
      attentionCost: 1,
      revealsSignal: { label: 'Rétention à 60 jours non communiquée', family: 'equipe' },
    },
    {
      id: 'sh-3',
      text: 'Quel est votre coût d’acquisition ?',
      answer:
        'Il monte, je ne vais pas mentir. Mais avec le volume on négocie mieux nos placements, ça devrait se stabiliser.',
      attentionCost: 2,
      revealsSignal: { label: 'Croissance payée à 90% par ads', family: 'equipe' },
    },
    {
      id: 'sh-4',
      text: 'Comment vous faites-vous connaître ?',
      answer:
        'On a une vraie communauté. 40 000 abonnés, des posts qui tournent, des créateurs qui parlent de nous spontanément.',
      attentionCost: 1,
      revealsSignal: { label: 'Forte présence sur les réseaux', family: 'trompeur' },
    },
    {
      id: 'sh-5',
      text: 'Que se passe-t-il si vous coupez le budget pub demain ?',
      answer:
        'Ça ralentirait, évidemment. Mais on a une base installée qui continue de tourner. On ne repart pas de zéro.',
      attentionCost: 2,
      revealsSignal: { label: 'Rétention à 60 jours non communiquée', family: 'equipe' },
    },
    {
      id: 'sh-6',
      text: 'Qui utilise votre produit toutes les semaines ?',
      answer:
        'On a un noyau très engagé. Je n’ai pas le chiffre exact en tête, mais l’équipe growth suit ça de près.',
      attentionCost: 1,
      revealsSignal: null,
    },
    {
      id: 'sh-7',
      text: 'Pourquoi lever maintenant ?',
      answer:
        'La fenêtre est ouverte. Le marché nous regarde, les concurrents lèvent. Attendre six mois serait une erreur.',
      attentionCost: 1,
      revealsSignal: null,
    },
    {
      id: 'sh-8',
      text: 'Quelle part de vos utilisateurs paient ?',
      answer:
        'On est encore beaucoup sur du freemium. La conversion s’améliore, c’est un des axes du plan.',
      attentionCost: 2,
      revealsSignal: null,
    },
  ],

  'veterane-secteur': [
    {
      id: 'vs-1',
      text: 'Quelle est la taille de votre marché ?',
      answer:
        'Plus petit que ce que diront les slides des autres. Mais je sais exactement qui sont les 400 acheteurs qui comptent, et j’en connais la moitié personnellement.',
      attentionCost: 2,
      revealsSignal: { label: 'TAM de niche jamais chiffré publiquement', family: 'equipe' },
    },
    {
      id: 'vs-2',
      text: 'Pourquoi vous, sur ce marché ?',
      answer:
        'Quinze ans dedans. J’ai vu trois vagues d’entrants échouer parce qu’ils ne comprenaient pas les cycles d’achat.',
      attentionCost: 1,
      revealsSignal: { label: '15 ans dans le secteur, réseau dormant', family: 'equipe' },
    },
    {
      id: 'vs-3',
      text: 'Avez-vous déjà levé des fonds ?',
      answer:
        'Jamais. J’ai financé les deux premières années sur mes économies et le chiffre d’affaires. C’est la première fois que j’ouvre le capital.',
      attentionCost: 1,
      revealsSignal: { label: 'Aucune levée précédente', family: 'equipe' },
    },
    {
      id: 'vs-4',
      text: 'Vendez-moi votre vision en une phrase.',
      answer:
        'Je n’ai pas de formule. Je résous un problème coûteux pour des gens qui paient déjà cher pour le contourner.',
      attentionCost: 1,
      revealsSignal: { label: 'Discours sobre, peu de storytelling', family: 'trompeur' },
    },
    {
      id: 'vs-5',
      text: 'Comment comptez-vous activer votre réseau ?',
      answer:
        'Doucement. Ces gens-là ne répondent pas à une séquence d’emails. Il faut du temps, et je préfère arriver avec un produit qui tient.',
      attentionCost: 2,
      revealsSignal: { label: '15 ans dans le secteur, réseau dormant', family: 'equipe' },
    },
    {
      id: 'vs-6',
      text: 'Qu’est-ce qui vous empêche de dormir ?',
      answer:
        'Le rythme. Je sais faire durer une boîte, je ne sais pas encore la faire aller vite.',
      attentionCost: 1,
      revealsSignal: null,
    },
    {
      id: 'vs-7',
      text: 'Qui sont vos concurrents ?',
      answer:
        'Deux acteurs historiques qui vendent cher et mal, et Excel. Surtout Excel, en vrai.',
      attentionCost: 1,
      revealsSignal: null,
    },
    {
      id: 'vs-8',
      text: 'Que ferez-vous si on ne finance pas ?',
      answer:
        'Je continue. Plus lentement, avec moins de monde, mais je continue. La boîte est rentable sur son périmètre actuel.',
      attentionCost: 2,
      revealsSignal: null,
    },
  ],

  'duo-fracture': [
    {
      id: 'df-1',
      text: 'Comment vous répartissez-vous les rôles ?',
      answer:
        '[Le premier fondateur répond] Moi le produit et la tech, lui le commercial. C’est très clair depuis le début. [Le second acquiesce sans ajouter.]',
      attentionCost: 1,
      revealsSignal: { label: 'Duo complémentaire sur le papier', family: 'trompeur' },
    },
    {
      id: 'df-2',
      text: 'Comment est structurée votre architecture technique ?',
      answer:
        '[Le premier fondateur répond immédiatement, en détail. Le second regarde son téléphone pendant toute la réponse.]',
      attentionCost: 2,
      revealsSignal: {
        label: 'Un seul fondateur répond aux questions techniques',
        family: 'equipe',
      },
    },
    {
      id: 'df-3',
      text: 'Comment le capital est-il réparti entre vous ?',
      answer:
        '[Silence court.] On a ajusté récemment. 60/40. C’était… le sujet d’une discussion longue, mais c’est réglé maintenant.',
      attentionCost: 2,
      revealsSignal: { label: 'Tension visible sur la répartition des parts', family: 'equipe' },
    },
    {
      id: 'df-4',
      text: 'Avez-vous un pacte d’actionnaires ?',
      answer:
        'Signé le mois dernier. Notre avocat nous a poussés à le faire avant de parler aux investisseurs.',
      attentionCost: 1,
      revealsSignal: { label: 'Pacte d’actionnaires signé récemment', family: 'equipe' },
    },
    {
      id: 'df-5',
      text: 'Racontez-moi votre dernier désaccord sérieux.',
      answer:
        '[Ils se regardent.] Sur le pricing. On a tranché. [Aucun des deux ne précise qui a tranché.]',
      attentionCost: 2,
      revealsSignal: { label: 'Tension visible sur la répartition des parts', family: 'equipe' },
    },
    {
      id: 'df-6',
      text: 'Depuis combien de temps travaillez-vous ensemble ?',
      answer:
        'Quatre ans. On s’est rencontrés sur un projet client, on a monté la boîte dans la foulée.',
      attentionCost: 1,
      revealsSignal: null,
    },
    {
      id: 'df-7',
      text: 'Qui décide en dernier recours ?',
      answer:
        'On décide ensemble. On n’a jamais eu besoin de trancher unilatéralement.',
      attentionCost: 1,
      revealsSignal: { label: 'Duo complémentaire sur le papier', family: 'trompeur' },
    },
    {
      id: 'df-8',
      text: 'Que se passe-t-il si l’un de vous part ?',
      answer:
        '[Long silence.] Ce n’est pas un scénario qu’on envisage.',
      attentionCost: 2,
      revealsSignal: null,
    },
  ],

  // Archétypes hors Phase 0 — voir founders.ts (phase0: false). Le générateur ne les
  // propose jamais, donc aucune question écrite pour l'instant.
  rescape: [],
  'scientifique-transfuge': [],
  'vendeur-ne-sans-produit': [],
  'prophete-mission': [],
}
