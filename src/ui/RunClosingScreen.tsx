import type { LpReport } from '../game-loop/lp-report'
import type { RunGains } from '../game-loop/meta'
import { nextReputationTier, reputationTier } from '../game-loop/meta'
import type { ClosingMetrics, LineOutcome } from '../game-loop/run-closing'
import { isFundReturner } from '../game-loop/run-closing'
import { formatFundNumber, QUARTERS_PER_RUN } from '../game-loop/fund'
import {
  exitDdClauses,
  exitTexts,
  lpBrokenQuotes,
  lpIncoherentQuote,
  lpKeptQuotes,
  lpPerformanceQuotes,
  lpVerdictLabels,
} from '../signals-content/closing-content'
import { angleUnlockTexts, perkTexts, reputationTierLabels } from '../signals-content/meta-content'
import { AppHeader } from './AppHeader'
import { Icon } from './Icon'
import { SectionLabel } from './SectionLabel'
import { useTour } from './onboarding/onboarding-context'
import styles from './RunClosingScreen.module.css'

interface RunClosingScreenProps {
  fundNumber: number
  outcomes: LineOutcome[]
  metrics: ClosingMetrics
  lpReports: LpReport[]
  gains: RunGains
  totalRaised: number
  /** Dernier fonds du playtest : le bouton termine le playtest au lieu d'ouvrir le suivant. */
  isLastFund: boolean
  onStartNextFund: () => void
}

function formatCapital(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M€`
  }
  return `${Math.round(amount / 1_000)}K€`
}

function formatMultiple(multiple: number): string {
  return `${multiple.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}×`
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Texte de sortie stable pour une ligne donnée (pas de tirage pendant le render). */
function exitDetail(outcome: LineOutcome): string {
  const { line, kind } = outcome
  const bank = exitTexts[kind]
  // Indice dérivé de l'id : même texte à chaque render, variété d'une ligne à l'autre.
  const hash = [...line.id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
  const base = bank[hash % bank.length]
    .replaceAll('{company}', line.deal.companyName)
    .replaceAll('{founder}', line.deal.founderName)
  if (kind === 'held') return base
  const won = outcome.multiple >= 1
  const clause = line.investedBlind
    ? won
      ? exitDdClauses.blindWin
      : exitDdClauses.blindLoss
    : won
      ? exitDdClauses.informedWin
      : exitDdClauses.informedLoss
  return `${base} ${clause}`
}

function badgeKind(outcome: LineOutcome): 'big' | 'win' | 'hold' | 'loss' {
  if (outcome.kind === 'held') return 'hold'
  if (outcome.multiple >= 5) return 'big'
  if (outcome.multiple >= 1) return 'win'
  return 'loss'
}

function lpQuote(report: LpReport): string {
  const { reason } = report
  if (reason.kind === 'broken') return lpBrokenQuotes[reason.engagement]
  if (reason.kind === 'kept') return lpKeptQuotes[reason.engagement]
  if (reason.kind === 'incoherent') return lpIncoherentQuote
  return lpPerformanceQuotes[reason.tier]
}

/**
 * Clôture de run — product-spec §3.8, maquette vc-techwear-endrun_1.html. Aucune décision
 * sur cet écran hors du bouton final : c'est le bilan. Écarts assumés avec la maquette
 * (decisions.md, 2026-09-27) : 8 trimestres, et la rangée de stats ne répète pas le TVPI
 * déjà affiché en très grand.
 */
export function RunClosingScreen({
  fundNumber,
  outcomes,
  metrics,
  lpReports,
  gains,
  totalRaised,
  isLastFund,
  onStartNextFund,
}: RunClosingScreenProps) {
  useTour('run-closing')
  const fund = formatFundNumber(fundNumber)
  // Meilleurs multiples en tête : la loi de puissance se lit de haut en bas.
  const sorted = [...outcomes].sort((a, b) => b.multiple - a.multiple)
  const tierAfter = reputationTier(gains.reputationAfter)
  const nextTier = nextReputationTier(gains.reputationAfter)
  const gain = gains.reputationAfter - gains.reputationBefore
  const hasUnlocks = gains.perks.length > 0 || gains.unlockedAngles.length > 0

  return (
    <main className={styles.screen}>
      <AppHeader
        resources={
          <span className={styles.step}>
            Q{QUARTERS_PER_RUN} / {QUARTERS_PER_RUN} · FIN DE RUN
          </span>
        }
      />

      <div className={styles.content}>
        <div className={styles.hero} data-onboarding="closing-hero">
          <p className={styles.heroEyebrow}>FONDS {fund} — RAPPORT FINAL</p>
          <p className={styles.heroTvpi}>{formatMultiple(metrics.tvpi)} TVPI</p>
          <p className={styles.heroSub}>
            {formatCapital(totalRaised)} LEVÉS · {QUARTERS_PER_RUN} TRIMESTRES · {outcomes.length}{' '}
            LIGNES INVESTIES
          </p>

          <div className={styles.statRow}>
            <div className={styles.stat}>
              <span className={styles.statValue} data-accent>
                {formatMultiple(metrics.dpi)}
              </span>
              <span className={styles.statLabel}>DPI réalisé</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{formatCapital(metrics.totalValue)}</span>
              <span className={styles.statLabel}>Valeur totale</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{formatCapital(metrics.invested)}</span>
              <span className={styles.statLabel}>Capital investi</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{metrics.fundReturners}</span>
              <span className={styles.statLabel}>Fund-returner</span>
            </div>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.secHead}>
            <SectionLabel icon="layers">SORTIES DU PORTEFEUILLE</SectionLabel>
            <span className={styles.secSub}>{outcomes.length} LIGNES</span>
          </div>
          {outcomes.length === 0 ? (
            <p className={styles.empty}>Aucune ligne investie pendant ce fonds.</p>
          ) : (
            <div className={styles.outcomePanel}>
              {sorted.map((outcome) => (
                <div key={outcome.line.id} className={styles.outRow}>
                  <span className={styles.outTicker}>{outcome.line.deal.ticker}</span>
                  <span className={styles.outName}>
                    {outcome.line.deal.companyName}
                    {isFundReturner(outcome, metrics.invested) && (
                      <span className={styles.frTag}>FUND-RETURNER</span>
                    )}
                  </span>
                  <span className={styles.outDetail}>{exitDetail(outcome)}</span>
                  <span className={styles.outBadge} data-kind={badgeKind(outcome)}>
                    {formatMultiple(outcome.multiple)}
                    {outcome.realized ? '' : ' (non réalisé)'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.secHead}>
            <SectionLabel icon="users">RAPPORT AUX LPS</SectionLabel>
            <span className={styles.secSub}>{lpReports.length} LPS</span>
          </div>
          <div className={styles.lpGrid} data-onboarding="closing-lps">
            {lpReports.map((report) => (
              <article key={report.offer.id} className={styles.lpCard} data-verdict={report.verdict}>
                <div className={styles.lpTop}>
                  <span className={styles.lpAvatar}>{initials(report.offer.name)}</span>
                  <div>
                    <p className={styles.lpName}>{report.offer.name}</p>
                    <p className={styles.lpMeta}>
                      {formatCapital(report.offer.committedAmount ?? 0)} engagés · confiance
                      finale {report.finalConfidence}%
                    </p>
                  </div>
                  <span className={styles.lpFollow}>{lpVerdictLabels[report.verdict]}</span>
                </div>
                <p className={styles.lpQuote}>{lpQuote(report)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} data-onboarding="closing-progression">
          <SectionLabel icon="zap">PROGRESSION DU GP</SectionLabel>
          <div className={styles.metaSummary}>
            <div className={styles.repLabel}>
              <span className={styles.repValue}>{reputationTierLabels[tierAfter.id]}</span>
              <span className={styles.repGain}>+{gain} de réputation ce run</span>
            </div>
            <div
              className={styles.repBar}
              role="img"
              aria-label={`Réputation ${gains.reputationAfter} sur 100`}
            >
              <div className={styles.repFill} style={{ width: `${gains.reputationBefore}%` }} />
              <div
                className={styles.repGainFill}
                style={{ left: `${gains.reputationBefore}%`, width: `${gain}%` }}
              />
            </div>
          </div>

          <div className={styles.unlockGrid}>
            {gains.perks.map((perk) => (
              <article key={perk} className={styles.unlockCard}>
                <span className={styles.unlockKind}>
                  <Icon name="zap" size={14} />
                  LEÇON APPRISE — PERK DÉBLOQUÉ
                </span>
                <span className={styles.unlockName}>{perkTexts[perk].name}</span>
                <span className={styles.unlockDesc}>{perkTexts[perk].effect}</span>
                <span className={styles.unlockWhy}>{perkTexts[perk].unlockedBy}</span>
              </article>
            ))}
            {gains.unlockedAngles.map((angle) => (
              <article key={angle} className={styles.unlockCard}>
                <span className={styles.unlockKind}>
                  <Icon name="lock" size={14} />
                  CONTENU DÉBLOQUÉ
                </span>
                <span className={styles.unlockName}>{angleUnlockTexts[angle].name}</span>
                <span className={styles.unlockDesc}>{angleUnlockTexts[angle].effect}</span>
              </article>
            ))}
            {nextTier && (
              <article className={styles.unlockCard} data-upcoming>
                <span className={styles.unlockKind}>
                  <Icon name="lock" size={14} />
                  PROCHAIN PALIER — {nextTier.min} DE RÉPUTATION
                </span>
                <span className={styles.unlockName}>{reputationTierLabels[nextTier.id]}</span>
                <span className={styles.unlockDesc}>
                  Débloque :{' '}
                  {nextTier.angles
                    .filter((a) => !tierAfter.angles.includes(a))
                    .map((a) => angleUnlockTexts[a].name)
                    .join(', ')}
                  .
                </span>
              </article>
            )}
            {!hasUnlocks && !nextTier && (
              <p className={styles.empty}>Aucun nouveau déblocage ce run.</p>
            )}
          </div>
        </section>

        <div className={styles.ctaRow}>
          <button type="button" className={styles.ctaButton} onClick={onStartNextFund}>
            {isLastFund
              ? 'TERMINER LE PLAYTEST →'
              : `LANCER LE FONDS ${formatFundNumber(fundNumber + 1)} →`}
          </button>
        </div>
      </div>
    </main>
  )
}
