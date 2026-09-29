// Onboarding progressif — product-spec §8.2 : une visite guidée par écran, affichée la
// première fois que le joueur y arrive. Domaine Signals & Content : uniquement le texte et
// la cible de chaque bulle. L'affichage est dans ui/onboarding/.
//
// `target` = valeur de l'attribut data-onboarding de l'élément à mettre en lumière.
// Sans cible, la bulle s'affiche au centre. Une étape dont la cible est absente de l'écran
// (ex. aucune carte follow-on ce trimestre) est sautée.

export interface OnboardingStep {
  target?: string
  title: string
  text: string
}

export type TourId =
  | 'thesis'
  | 'fundraising'
  | 'lp-pitch'
  | 'deal-flow'
  | 'founder-scene'
  | 'founder-ticket'
  | 'portfolio-report'
  | 'follow-on'
  | 'crisis'
  | 'run-closing'

export const onboardingTours: Record<TourId, OnboardingStep[]> = {
  thesis: [
    {
      title: 'Bienvenue dans DEALROOM',
      text: 'Tu es General Partner d’un fonds de venture capital. En 8 trimestres, tu lèves, tu investis, tu accompagnes tes startups, puis tu rends des comptes à tes investisseurs.',
    },
    {
      title: 'Le vrai objectif',
      text: 'Éviter les échecs ne sert à rien : la plupart des startups échouent. Ce qui compte, c’est de trouver celle qui rembourse tout le fonds à elle seule — le « fund-returner ».',
    },
    {
      target: 'thesis-sectors',
      title: 'Ta thèse',
      text: 'Choisis 2 à 3 secteurs. Tu ne verras que des startups de ta thèse, et elle t’engage auprès de tes LPs pour tout le run.',
    },
    {
      target: 'thesis-stage-zone',
      title: 'Stade et zone',
      text: 'Le stade fixe la taille des tickets, la zone le profil des fondateurs que tu croiseras.',
    },
    {
      target: 'thesis-confirm',
      title: 'C’est parti',
      text: 'Valide ta thèse pour passer à la levée de fonds.',
    },
  ],
  fundraising: [
    {
      target: 'lp-grid',
      title: 'Tes LPs',
      text: 'Les LPs sont les investisseurs de ton fonds. Chacun propose une fourchette de capital et impose des contraintes — les contraintes dures te suivent tout le run.',
    },
    {
      target: 'lp-pitch-button',
      title: 'Pitcher un LP',
      text: 'Un pitch est un entretien : tu choisis un angle, puis tu réponds à ses questions. Plus il est convaincu, plus il engage de capital.',
    },
    {
      target: 'fund-progress',
      title: 'Ton capital',
      text: 'Le total levé est tout ce que tu pourras investir pendant les 8 trimestres. Il n’y en aura pas d’autre.',
    },
    {
      target: 'fundraising-proceed',
      title: 'Lancer le fonds',
      text: 'Un LP engagé suffit pour démarrer. Tu peux en convaincre plusieurs avant.',
    },
  ],
  'lp-pitch': [
    {
      target: 'pitch-angles',
      title: 'Choisis ton angle',
      text: 'L’angle est ta promesse d’ouverture. Ensuite, chaque réponse cohérente avec lui rassure le LP ; chaque contradiction coûte plus cher qu’une réponse neutre.',
    },
    {
      target: 'pitch-engagements',
      title: 'Tes engagements',
      text: 'Certaines réponses créent un engagement. Le LP s’en souviendra à la clôture du fonds et vérifiera que tu l’as tenu.',
    },
  ],
  'deal-flow': [
    {
      target: 'header-resources',
      title: 'Tes ressources',
      text: 'Capital déployé sur capital levé, bande passante (tes points d’attention du trimestre) et trimestre en cours.',
    },
    {
      target: 'deal-card',
      title: 'Une carte rapide',
      text: 'Chaque carte a un chrono de 40 secondes. À zéro, le deal passe tout seul — sans pénalité. Le chrono est en pause pendant cette aide.',
    },
    {
      target: 'deal-tags',
      title: 'Les signaux',
      text: 'Les signaux visibles (marché, traction) filtrent mais prédisent peu. Les signaux cadenassés — équipe et trompeurs — sont ceux qui trahissent un futur fund-returner… ou un piège.',
    },
    {
      target: 'deal-actions',
      title: 'Passer, creuser, investir',
      text: 'Creuser coûte 1 bande passante et révèle les signaux cadenassés. Tu peux aussi investir directement, à l’aveugle.',
    },
    {
      target: 'deal-pitch-card',
      title: 'L’entretien du trimestre',
      text: 'Un fondateur par trimestre accepte un vrai entretien : pas de chrono, tu poses tes questions et tu lis ses réponses.',
    },
    {
      target: 'portfolio-button',
      title: 'Ton portefeuille',
      text: 'Tes lignes investies, consultables à tout moment — ici ou avec la touche P.',
    },
    {
      target: 'deal-flow-advance',
      title: 'Fin du trimestre',
      text: 'Quand tu as fini, passe au trimestre suivant : nouveaux deals, bande passante rechargée.',
    },
  ],
  'founder-scene': [
    {
      target: 'founder-gauges',
      title: 'Attention et patience',
      text: 'Chaque question consomme ton attention et entame la patience du fondateur. Quand l’une des deux est vide, l’entretien s’arrête.',
    },
    {
      target: 'founder-questions',
      title: 'Choisis tes questions',
      text: 'Les questions les plus coûteuses creusent plus profond. Tu n’auras pas le temps de tout demander.',
    },
    {
      target: 'founder-signals',
      title: 'Ce que tu apprends',
      text: 'Les signaux révélés par ses réponses s’affichent ici. C’est à toi d’en tirer une conviction — le jeu ne te donne jamais de note.',
    },
  ],
  // Visite à part : le curseur n'apparaît qu'en fin d'entretien.
  'founder-ticket': [
    {
      target: 'founder-ticket',
      title: 'Dose ta conviction',
      text: 'Choisis combien tu mets : plus ton ticket est gros, plus ta part l’est. Au-delà de 15 % du capital, le fondateur refuse. Un gros ticket sur le bon fondateur, c’est ce qui fait un fund-returner.',
    },
  ],
  'portfolio-report': [
    {
      title: 'Le rapport de portefeuille',
      text: 'Chaque trimestre s’ouvre sur l’état de tes lignes : ce qui a bougé, et les décisions à prendre.',
    },
    {
      target: 'portfolio-stats',
      title: 'Le bilan',
      text: 'Le TVPI compare la valeur estimée de tes lignes au capital investi. En début de vie d’un fonds, il descend souvent sous 1× : c’est normal.',
    },
    {
      target: 'portfolio-evolutions',
      title: 'Les évolutions',
      text: 'Ce qui s’est passé chez tes startups. Aucune action requise, mais elles confirment — ou démentent — ce que tes signaux laissaient deviner.',
    },
  ],
  // Visite à part, déclenchée par la première carte follow-on : le premier rapport de
  // portefeuille n'en a presque jamais, l'étape y serait sautée puis jamais revue.
  'follow-on': [
    {
      target: 'portfolio-follow-ons',
      title: 'Un follow-on',
      text: 'Une de tes lignes lève un nouveau tour. Suivre maintient ta part ; refuser la dilue. Revoir la DD révèle les signaux que tu n’avais pas creusés.',
    },
    {
      target: 'portfolio-continue',
      title: 'Décide avant de continuer',
      text: 'Chaque follow-on attend une réponse explicite : tu ne passes au deal flow qu’une fois toutes les cartes tranchées.',
    },
  ],
  crisis: [
    {
      target: 'crisis-prediction',
      title: 'La réaction attendue',
      text: 'Ta lecture du fondateur sous pression. Sa fiabilité dépend des signaux équipe révélés avant d’investir : sans eux, c’est un pari.',
    },
    {
      target: 'crisis-decisions',
      title: 'Aucune option sans risque',
      text: 'Soutenir coûte du capital, laisser courir est gratuit mais risqué, l’atterrissage récupère une partie de la mise, le réseau coûte de la bande passante.',
    },
  ],
  'run-closing': [
    {
      target: 'closing-hero',
      title: 'Le verdict',
      text: 'Au Q8, tes lignes sont projetées jusqu’à leur sortie. Le TVPI final mesure ce que ton fonds a rendu pour chaque euro investi.',
    },
    {
      target: 'closing-lps',
      title: 'Tes LPs jugent',
      text: 'Chaque LP relit tes engagements et ta performance. Ceux qui te suivent seront déjà engagés dans ton prochain fonds.',
    },
    {
      target: 'closing-progression',
      title: 'Ce que tu emportes',
      text: 'La réputation débloque du contenu, les leçons débloquent des avantages pour les fonds suivants.',
    },
  ],
}
