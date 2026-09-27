// Contenu des évolutions silencieuses de portefeuille — product-spec §3.2 — et des notes de
// cartes follow-on (§3.5). Chaque texte est teinté par l'archétype du fondateur : au fil
// des trimestres, les évolutions confirment ou démentent ce que les signaux laissaient
// deviner, sans jamais nommer l'archétype.
//
// Domaine Signals & Content : uniquement du texte. Le sens de l'évolution, la valorisation
// et le déclenchement des tours appartiennent à Game Loop (portfolio-evolution.ts).
// Placeholders : {company}, {founder}.

import type { FounderArchetypeId } from './types'

export interface ArchetypeEvolutionTexts {
  up: string[]
  flat: string[]
  down: string[]
  /** Cessation d'activité — la ligne quitte le portefeuille à 0. */
  shutdown: string[]
}

const phase0EvolutionTexts: Partial<Record<FounderArchetypeId, ArchetypeEvolutionTexts>> = {
  'wunderkind-pedigree': {
    up: [
      'Couverture presse nationale après une keynote remarquée — les demandes de démo affluent.',
      'Recrutement d’un VP Engineering venu d’un grand labo, annoncé en grande pompe.',
      'Un grand compte signe un pilote payant, porté par la réputation du fondateur.',
    ],
    flat: [
      'Beaucoup d’apparitions publiques ce trimestre, peu d’avancées produit visibles.',
      'La roadmap annoncée au dernier board a glissé d’un trimestre, sans explication détaillée.',
      'Le pilote grand compte est prolongé, mais toujours pas converti en contrat.',
    ],
    down: [
      'Le prototype échoue au premier test indépendant — {founder} parle de « mauvaises conditions ».',
      'Deux ingénieurs seniors partent en trois semaines ; l’équipe technique s’amincit.',
      'Le pilote grand compte n’est pas renouvelé : la démo ne tenait pas en conditions réelles.',
    ],
    shutdown: [
      '{founder} rejoint un grand groupe tech — {company} est mise en sommeil, puis liquidée.',
      'Le produit n’a jamais passé la validation technique ; le board acte la fermeture.',
    ],
  },
  'bricoleur-obsessionnel': {
    up: [
      'Trois nouveaux clients payants signés sans budget marketing, tous par recommandation.',
      'Le churn mensuel passe sous 1 % — {founder} a appelé chaque client parti pour comprendre.',
      'Un concurrent mieux financé ferme ; ses clients migrent vers {company}.',
    ],
    flat: [
      'Trimestre de refonte technique, croissance volontairement mise en pause.',
      'Traction stable, aucun changement notable ce trimestre.',
      'Les reportings restent sobres et précis — rien de spectaculaire, rien d’inquiétant.',
    ],
    down: [
      'Un client historique réduit son contrat de moitié ; {founder} l’avait annoncé un mois avant.',
      'Le cycle de vente s’allonge sur les grands comptes — le pipeline glisse d’un trimestre.',
      'Une panne majeure coûte deux semaines de développement, documentée en détail au board.',
    ],
    shutdown: [
      'Le marché visé s’est révélé trop étroit ; {founder} rend le cash restant plutôt que de le brûler.',
    ],
  },
  'surfeur-hype': {
    up: [
      'Campagne virale sur les réseaux — les inscriptions triplent en un mois.',
      'Partenariat d’influence avec un créateur majeur, relayé massivement.',
      'Record de téléchargements ce trimestre, porté par une forte dépense publicitaire.',
    ],
    flat: [
      'La croissance ralentit à mesure que le budget publicitaire plafonne.',
      'Les inscriptions progressent, mais la rétention à 60 jours n’est toujours pas communiquée.',
      'Nouvelle campagne lancée pour compenser le tassement de la précédente.',
    ],
    down: [
      'La campagne d’influenceurs s’est arrêtée — la croissance ralentit fortement.',
      'Hausse des coûts d’acquisition : chaque nouvel utilisateur coûte plus qu’il ne rapporte.',
      'Les cohortes de l’an dernier ont quasiment toutes décroché.',
    ],
    shutdown: [
      'Sans budget publicitaire, l’usage s’effondre en deux mois ; {company} cesse son activité.',
      'Aucun repreneur pour une base d’utilisateurs qui ne revient pas — liquidation.',
    ],
  },
  'veterane-secteur': {
    up: [
      'Premier accord de licence signé avec un acteur régional du secteur.',
      '{founder} réactive son réseau : deux distributeurs historiques référencent l’offre.',
      'Le marché de niche s’avère plus large que prévu — un second segment s’ouvre.',
    ],
    flat: [
      'Traction stable, aucun changement notable ce trimestre.',
      'Cycle de vente long, conforme au plan présenté au board dès le départ.',
      'Recrutement prudent d’un commercial senior du secteur, pas d’autre mouvement.',
    ],
    down: [
      'Un appel d’offres clé est reporté d’un an par l’acheteur public.',
      'Le premier distributeur tarde à passer commande ; le trimestre est plus faible que prévu.',
      'Une réglementation sectorielle retarde le déploiement chez deux clients.',
    ],
    shutdown: [
      'Le principal client du secteur internalise la solution ; {company} ne s’en relève pas.',
    ],
  },
  'duo-fracture': {
    up: [
      'Belle signature commerciale portée par le cofondateur business.',
      'Lancement produit réussi, salué par les premiers clients.',
      'Nouveau recrutement clé : le CTO annoncé a finalement rejoint l’équipe à temps plein.',
    ],
    flat: [
      'Les deux cofondateurs présentent désormais séparément au board.',
      'Traction stable, mais la répartition des rôles reste floue en interne.',
      'Le pacte d’actionnaires est renégocié — rien d’autre n’avance ce trimestre.',
    ],
    down: [
      'Désaccord ouvert entre les cofondateurs sur la stratégie ; deux salariés démissionnent.',
      'L’un des cofondateurs réduit son implication « pour raisons personnelles ».',
      'Le board est convoqué en urgence pour arbitrer un conflit sur la répartition des parts.',
    ],
    shutdown: [
      'Rupture entre cofondateurs — aucun des deux ne veut reprendre seul, {company} ferme.',
      'Le conflit d’associés finit au tribunal de commerce ; la société est liquidée.',
    ],
  },
}

/** Fallback générique — archétypes hors Phase 0 (jamais tirés aujourd'hui). */
const genericEvolutionTexts: ArchetypeEvolutionTexts = {
  up: ['Trimestre solide : nouveaux clients et chiffre d’affaires en hausse.'],
  flat: ['Traction stable, aucun changement notable ce trimestre.'],
  down: ['Trimestre difficile : les objectifs commerciaux ne sont pas atteints.'],
  shutdown: ['{company} cesse son activité faute de financement.'],
}

export function evolutionTextsFor(archetypeId: FounderArchetypeId): ArchetypeEvolutionTexts {
  return phase0EvolutionTexts[archetypeId] ?? genericEvolutionTexts
}

/** Nature d'un tour levé par une ligne — détermine la note de la carte follow-on. */
export type RoundKind = 'up-round' | 'flat-round' | 'down-round'

export const followOnRoundNotes: Record<RoundKind, string[]> = {
  'up-round': [
    'Tour en forte hausse, mené par un fonds de stade suivant.',
    'Tour sursouscrit — l’investisseur lead réserve une part aux investisseurs existants.',
  ],
  'flat-round': [
    'Extension de tour à valorisation quasi identique, pour allonger le runway.',
    'Tour de prolongation : pas de nouvel investisseur lead, les existants sont sollicités.',
  ],
  'down-round': [
    'Tour à la baisse (down round) : la valorisation recule, les conditions se durcissent.',
    'Tour de sauvetage à valorisation réduite — sans les existants, le runway ne passe pas l’année.',
  ],
}

/** Complément de note selon ce que le joueur sait de la ligne — la DD faite ou non. */
export const followOnDdNotes = {
  known: 'Due diligence complète : tous les signaux de la ligne sont révélés ci-dessus.',
  blind:
    'Aucun signal équipe creusé avant d’investir — décision à l’aveugle, sauf à revoir la due diligence.',
}
