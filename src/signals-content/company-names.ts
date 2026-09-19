// Banque de noms de startups et pitchs, indexée par secteur — ADR-002. Le générateur de
// deal flow (src/game-loop/deal-generator.ts) pioche un profil par secteur retenu dans la
// thèse du joueur, puis lui assigne un fondateur (founder-names.ts) et un archétype.
// Au moins 5 profils par secteur : avec un seul secteur choisi à la thèse, il faut pouvoir
// générer DEALS_PER_QUARTER (4) deals sans répétition (voir Claude/memory/blockers.md,
// 2026-09-19 "noms de startup dupliqués").

import type { Sector } from '../game-loop/thesis'

export interface CompanyProfile {
  companyName: string
  pitch: string
  ticker: string
}

export const companyProfilesBySector: Record<Sector, CompanyProfile[]> = {
  'saas-b2b': [
    { companyName: 'ReSurge', pitch: 'SaaS prévision de stock', ticker: '$RESURGE' },
    { companyName: 'Cadence', pitch: 'SaaS planification RH', ticker: '$CADNC' },
    { companyName: 'Ledgerly', pitch: 'SaaS facturation PME', ticker: '$LEDGR' },
    { companyName: 'Fluxio', pitch: 'SaaS automatisation support client', ticker: '$FLUX' },
    { companyName: 'Trackwell', pitch: 'SaaS suivi de conformité fournisseurs', ticker: '$TRKW' },
    { companyName: 'Pipely', pitch: 'SaaS gestion de pipeline commercial', ticker: '$PIPLY' },
  ],
  fintech: [
    { companyName: 'Paivo', pitch: 'Paiements fractionnés B2B', ticker: '$PAIVO' },
    { companyName: 'Ledgerbase', pitch: 'Compliance comptable automatisée', ticker: '$LDGB' },
    { companyName: 'Northcoin', pitch: 'Trésorerie multi-devises PME', ticker: '$NCOIN' },
    { companyName: 'Fairsplit', pitch: 'Répartition automatisée de revenus créateurs', ticker: '$FSPL' },
    { companyName: 'Vaultry', pitch: 'Coffre-fort numérique pour PME', ticker: '$VLTR' },
  ],
  deeptech: [
    { companyName: 'Solvix AI', pitch: 'Assistant R&D pharma', ticker: '$SOLVX' },
    { companyName: 'Quantera', pitch: 'Optimisation matériaux par simulation', ticker: '$QNTR' },
    { companyName: 'Photonyx', pitch: 'Capteurs optiques industriels', ticker: '$PHTX' },
    { companyName: 'Cryoforge', pitch: 'Stockage cryogénique longue durée', ticker: '$CRYF' },
    { companyName: 'Nectarion', pitch: 'Biocapteurs agricoles de précision', ticker: '$NCTR' },
  ],
  consumer: [
    { companyName: 'Verdance', pitch: 'Marque de snacks fonctionnels', ticker: '$VRDN' },
    { companyName: 'Loomly Home', pitch: 'Mobilier modulaire direct-to-consumer', ticker: '$LOOM' },
    { companyName: 'Wandr', pitch: 'App de micro-aventures locales', ticker: '$WNDR' },
    { companyName: 'Cinderwool', pitch: 'Vêtements techniques éco-responsables', ticker: '$CNDW' },
    { companyName: 'Peckish', pitch: 'Box repas pour foyers monoparentaux', ticker: '$PECK' },
  ],
  marketplace: [
    { companyName: 'NRJ Logistics', pitch: 'Tournées PME', ticker: '$NRJL' },
    { companyName: 'Vaeli', pitch: 'Marketplace BTP — urgence closing', ticker: '$VAELI' },
    { companyName: 'Craftmarket', pitch: 'Marketplace artisans certifiés', ticker: '$CRFT' },
    { companyName: 'Sparegrid', pitch: 'Marketplace de pièces détachées industrielles', ticker: '$SPRG' },
    { companyName: 'Localis', pitch: 'Marketplace de services de proximité', ticker: '$LOCL' },
  ],
}
