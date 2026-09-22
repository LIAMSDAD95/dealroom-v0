// État du fonds pendant la levée — product-spec §3.1.4 ("le joueur assemble son tour de
// table jusqu'à validation, peut rester sous la cible visée"). Domaine Game Loop.

// Cible Fonds I — cohérente avec le "5,0M€" déjà vu dans le screenshot deal flow envoyé.
export const FUND_I_TARGET = 5_000_000

// product-spec §2 — run de 8 trimestres, structure à plat (pas d'actes en Phase 0).
export const QUARTERS_PER_RUN = 8
