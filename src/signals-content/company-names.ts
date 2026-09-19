// Banque de noms de startups et pitchs, indexée par secteur — ADR-002. Le générateur de
// deal flow (src/game-loop/deal-generator.ts) pioche un profil par secteur retenu dans la
// thèse du joueur, puis lui assigne un fondateur (founder-names.ts) et un archétype.
// 15-18 profils par secteur : le run dure 8 trimestres × 4 deals = 32 tirages, et la thèse
// impose désormais au moins 2 secteurs (MIN_SECTORS, voir thesis.ts) — avec 2 secteurs
// combinés ça fait 30-36 profils disponibles pour tout le run, la répétition redevient rare
// sans logique de mémoire inter-trimestres (voir Claude/memory/decisions.md, 2026-09-20).

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
    { companyName: 'Rosterly', pitch: 'SaaS gestion de plannings terrain', ticker: '$ROST' },
    { companyName: 'Clauseo', pitch: 'SaaS rédaction de contrats types', ticker: '$CLAU' },
    { companyName: 'Deskmap', pitch: 'SaaS gestion de bureaux hybrides', ticker: '$DSKM' },
    { companyName: 'Onboardly', pitch: 'SaaS onboarding collaborateurs', ticker: '$ONBD' },
    { companyName: 'Queuely', pitch: 'SaaS gestion de files d’attente retail', ticker: '$QUEL' },
    { companyName: 'Reconly', pitch: 'SaaS réconciliation de paiements', ticker: '$RECN' },
    { companyName: 'Statusly', pitch: 'SaaS pages de statut pour SaaS', ticker: '$STAT' },
    { companyName: 'Vendorly', pitch: 'SaaS gestion de fournisseurs', ticker: '$VNDR' },
    { companyName: 'Auditcraft', pitch: 'SaaS préparation d’audits qualité', ticker: '$AUDC' },
  ],
  fintech: [
    { companyName: 'Paivo', pitch: 'Paiements fractionnés B2B', ticker: '$PAIVO' },
    { companyName: 'Ledgerbase', pitch: 'Compliance comptable automatisée', ticker: '$LDGB' },
    { companyName: 'Northcoin', pitch: 'Trésorerie multi-devises PME', ticker: '$NCOIN' },
    { companyName: 'Fairsplit', pitch: 'Répartition automatisée de revenus créateurs', ticker: '$FSPL' },
    { companyName: 'Vaultry', pitch: 'Coffre-fort numérique pour PME', ticker: '$VLTR' },
    { companyName: 'Creditlane', pitch: 'Scoring crédit PME alternatif', ticker: '$CRDL' },
    { companyName: 'Payflux', pitch: 'Orchestration de paiements multi-fournisseurs', ticker: '$PYFX' },
    { companyName: 'Ratebridge', pitch: 'Comparateur de financement PME', ticker: '$RTBR' },
    { companyName: 'Wagely', pitch: 'Avance sur salaire à la demande', ticker: '$WAGE' },
    { companyName: 'Custodian', pitch: 'Garde d’actifs numériques réglementée', ticker: '$CUST' },
    { companyName: 'Expensea', pitch: 'Notes de frais automatisées', ticker: '$EXPS' },
    { companyName: 'Bondline', pitch: 'Émission d’obligations PME simplifiée', ticker: '$BNDL' },
    { companyName: 'Riskward', pitch: 'Détection de fraude transactionnelle', ticker: '$RSKW' },
  ],
  deeptech: [
    { companyName: 'Solvix AI', pitch: 'Assistant R&D pharma', ticker: '$SOLVX' },
    { companyName: 'Quantera', pitch: 'Optimisation matériaux par simulation', ticker: '$QNTR' },
    { companyName: 'Photonyx', pitch: 'Capteurs optiques industriels', ticker: '$PHTX' },
    { companyName: 'Cryoforge', pitch: 'Stockage cryogénique longue durée', ticker: '$CRYF' },
    { companyName: 'Nectarion', pitch: 'Biocapteurs agricoles de précision', ticker: '$NCTR' },
    { companyName: 'Fusionna', pitch: 'Modules de fusion thermique compacts', ticker: '$FUSN' },
    { companyName: 'Reactively', pitch: 'Catalyseurs pour chimie verte', ticker: '$RCTV' },
    { companyName: 'Membrion', pitch: 'Filtration membranaire nouvelle génération', ticker: '$MMBR' },
    { companyName: 'Orbitalis', pitch: 'Propulsion satellite miniaturisée', ticker: '$ORBT' },
    { companyName: 'Neurograft', pitch: 'Interfaces neuronales médicales', ticker: '$NRGR' },
    { companyName: 'Alloycore', pitch: 'Alliages métalliques imprimés en 3D', ticker: '$ALCR' },
    { companyName: 'Spectrala', pitch: 'Spectrométrie portable industrielle', ticker: '$SPCT' },
  ],
  consumer: [
    { companyName: 'Verdance', pitch: 'Marque de snacks fonctionnels', ticker: '$VRDN' },
    { companyName: 'Loomly Home', pitch: 'Mobilier modulaire direct-to-consumer', ticker: '$LOOM' },
    { companyName: 'Wandr', pitch: 'App de micro-aventures locales', ticker: '$WNDR' },
    { companyName: 'Cinderwool', pitch: 'Vêtements techniques éco-responsables', ticker: '$CNDW' },
    { companyName: 'Peckish', pitch: 'Box repas pour foyers monoparentaux', ticker: '$PECK' },
    { companyName: 'Glowbrew', pitch: 'Cosmétiques fermentés maison', ticker: '$GLBR' },
    { companyName: 'Nestcraft', pitch: 'Kits de rénovation locative', ticker: '$NSTC' },
    { companyName: 'Pawtrail', pitch: 'Abonnement bien-être animaux', ticker: '$PWTR' },
    { companyName: 'Slowfare', pitch: 'Marque de plats longue conservation sans additifs', ticker: '$SLFR' },
    { companyName: 'Kinfolk Goods', pitch: 'Marketplace de cadeaux personnalisés', ticker: '$KNFK' },
    { companyName: 'Driftwear', pitch: 'Mode seconde main premium', ticker: '$DRFT' },
    { companyName: 'Homebrew Club', pitch: 'Kits de brassage à domicile', ticker: '$HMBC' },
  ],
  marketplace: [
    { companyName: 'NRJ Logistics', pitch: 'Tournées PME', ticker: '$NRJL' },
    { companyName: 'Vaeli', pitch: 'Marketplace BTP — urgence closing', ticker: '$VAELI' },
    { companyName: 'Craftmarket', pitch: 'Marketplace artisans certifiés', ticker: '$CRFT' },
    { companyName: 'Sparegrid', pitch: 'Marketplace de pièces détachées industrielles', ticker: '$SPRG' },
    { companyName: 'Localis', pitch: 'Marketplace de services de proximité', ticker: '$LOCL' },
    { companyName: 'Farmlink', pitch: 'Marketplace producteurs-restaurateurs', ticker: '$FRML' },
    { companyName: 'Shiftpool', pitch: 'Marketplace de remplacement de personnel', ticker: '$SHFT' },
    { companyName: 'Renterra', pitch: 'Marketplace de location de matériel BTP', ticker: '$RNTR' },
    { companyName: 'Studiomatch', pitch: 'Marketplace de studios créatifs', ticker: '$STDM' },
    { companyName: 'Fleetshare', pitch: 'Marketplace de flottes utilitaires partagées', ticker: '$FLTS' },
    { companyName: 'Wardrobe Loop', pitch: 'Marketplace de location de vêtements événementiels', ticker: '$WRDL' },
    { companyName: 'Toolbench', pitch: 'Marketplace d’outillage professionnel d’occasion', ticker: '$TLBN' },
  ],
}
