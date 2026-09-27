// Contenu de l'écran de clôture — product-spec §3.8 : détail des sorties par ligne et
// citations du rapport aux LPs (qui référencent les engagements tenus ou trahis).
// Domaine Signals & Content : uniquement du texte. L'issue de chaque ligne et le verdict
// des LPs sont calculés par Game Loop (run-closing.ts, lp-report.ts).
// Placeholders : {company}, {founder}.

import type { EngagementId } from './types'

/** Clés alignées sur ExitKind (game-loop/run-closing.ts). */
export const exitTexts: Record<
  'ipo' | 'acquisition' | 'acquihire' | 'held' | 'shutdown' | 'soft-landing',
  string[]
> = {
  ipo: [
    'Introduite en bourse — {company} est devenue la référence de son marché.',
    'IPO réussie : {founder} sonne la cloche, le fonds sort sur une valorisation record.',
  ],
  acquisition: [
    'Rachetée par un acteur majeur du secteur — sortie nette pour le fonds.',
    'Acquisition stratégique : un leader européen s’offre {company} et son équipe.',
    'Cession à un fonds de croissance — {founder} reste aux commandes.',
  ],
  acquihire: [
    'Rachat de l’équipe par un grand groupe — le produit est arrêté, le capital en partie sauvé.',
    'Reprise à la casse : l’acheteur veut la techno, pas la société.',
  ],
  held: [
    'Toujours en portefeuille — trajectoire plate, aucune sortie en vue à court terme.',
    'Toujours en portefeuille : {company} survit sans décoller.',
  ],
  shutdown: [
    'Cessation d’activité — le capital investi est perdu.',
    '{company} a fermé ses portes faute de relais de financement.',
  ],
  'soft-landing': ['Sortie anticipée en pleine crise — une partie du capital récupérée, l’upside abandonné.'],
}

/** Complément selon la due diligence faite avant d'investir — relie l'issue aux signaux. */
export const exitDdClauses = {
  informedWin: 'Les signaux creusés en due diligence se sont confirmés.',
  informedLoss: 'La due diligence avait été faite — les signaux étaient là.',
  blindWin: 'Pari à l’aveugle, gagné.',
  blindLoss: 'Investi sans due diligence : les signaux n’ont jamais été vérifiés.',
}

/** Citation quand un engagement a été trahi — prime sur tout le reste. */
export const lpBrokenQuotes: Record<EngagementId, string> = {
  'risk-limit':
    '« Vous vous étiez engagés sur une limite de risque stricte. Une large part du fonds est partie sur des paris à l’aveugle. »',
  'fast-deployment':
    '« Nous vous avions demandé un déploiement rapide. À mi-parcours, la moitié du capital dormait encore. »',
  'founder-availability':
    '« Vous aviez promis d’être présents aux côtés des fondateurs. Au moment de la crise, vous avez laissé courir. »',
  'co-invest':
    '« Vous nous aviez promis un accès en co-invest sur vos meilleures lignes. On n’a jamais été sollicités. »',
  transparency: '« La transparence promise sur vos décisions n’a pas été au rendez-vous. »',
  'risk-reporting': '« Le reporting de risque promis chaque trimestre n’est jamais arrivé. »',
}

/** Citation quand un engagement a été tenu. */
export const lpKeptQuotes: Record<EngagementId, string> = {
  'risk-limit':
    '« Vous avez tenu la limite de risque annoncée au closing, sans exception. C’est exactement ce qu’on attendait. »',
  'fast-deployment':
    '« Capital déployé au rythme annoncé. Vous avez fait ce que vous aviez dit. »',
  'founder-availability':
    '« Quand un de vos fondateurs a été en difficulté, vous étiez là. On l’a remarqué. »',
  'co-invest': '« Vous nous avez associés à vos meilleures lignes, comme promis. »',
  transparency: '« Vos décisions ont toujours été expliquées. Rare, et apprécié. »',
  'risk-reporting': '« Un reporting de risque sérieux, chaque trimestre. »',
}

export const lpIncoherentQuote =
  '« Le rendement se discute, mais votre angle d’ouverture ne correspondait pas à vos réponses. On veut revoir les conditions avant de reconduire. »'

export const lpPerformanceQuotes: Record<'strong' | 'fair' | 'poor', string> = {
  strong: '« Les chiffres parlent d’eux-mêmes. Comptez sur nous pour la suite. »',
  fair: '« Un rendement correct, sans plus. On attend de voir votre prochaine thèse. »',
  poor: '« Le fonds n’a pas rendu le capital. Difficile de justifier une reconduction en comité. »',
}

export const lpVerdictLabels: Record<'follows' | 'pending' | 'declines', string> = {
  follows: 'Vous suit — fonds suivant',
  pending: 'Réponse en attente',
  declines: 'Ne reconduit pas',
}
