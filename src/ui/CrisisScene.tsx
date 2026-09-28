import { useState } from 'react'
import type { Crisis, CrisisDecision, CrisisOutcome } from '../game-loop/crisis'
import { predictReaction, resilienceOf, resolveCrisisDecision, SUPPORT_COST } from '../game-loop/crisis'
import { AppHeader } from './AppHeader'
import { Icon } from './Icon'
import { useTour } from './onboarding/onboarding-context'
import styles from './CrisisScene.module.css'

interface CrisisSceneProps {
  crisis: Crisis
  quarter: number
  /** Capital encore disponible — "Soutenir en urgence" y pioche. */
  remainingCapital: number
  /** Bande passante restante — "Mobiliser son réseau" en coûte 1. */
  bandwidth: number
  /** Nombre de lignes actives — affiché sur le bouton d'accès au récap de portefeuille. */
  portfolioCount?: number
  onOpenPortfolio?: () => void
  onResolved: (decision: CrisisDecision, outcome: CrisisOutcome) => void
  /** Perk « Sang-froid » (§3.7) : +1 cran de fiabilité sur la réaction attendue. */
  predictionBonus?: number
}

interface DecisionOption {
  key: CrisisDecision
  icon: 'zap' | 'alert-circle' | 'bar-chart' | 'users'
  name: string
  desc: string
  cost: string
}

function formatCapital(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M€`
  }
  return `${Math.round(amount / 1_000)}K€`
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

export function CrisisScene({
  crisis,
  quarter,
  remainingCapital,
  bandwidth,
  portfolioCount,
  onOpenPortfolio,
  onResolved,
  predictionBonus = 0,
}: CrisisSceneProps) {
  useTour('crisis')
  const [selected, setSelected] = useState<CrisisDecision | null>(null)
  const [outcome, setOutcome] = useState<CrisisOutcome | null>(null)
  // La prédiction est tirée une seule fois : elle ne doit pas changer à chaque render.
  const [prediction] = useState(() => predictReaction(crisis.line, predictionBonus))

  const { line, event } = crisis
  const company = line.deal.companyName
  const situation = event.situation.replaceAll('{company}', company)
  const founderReaction = event.founderReaction[resilienceOf(line)]

  const supportUnaffordable = SUPPORT_COST > remainingCapital
  const networkUnavailable = bandwidth <= 0

  const options: DecisionOption[] = [
    {
      key: 'soutenir',
      icon: 'zap',
      name: 'Soutenir en urgence',
      desc: 'Injecter un bridge court terme depuis ton capital non déployé.',
      cost: supportUnaffordable
        ? 'Capital insuffisant'
        : `Coûte ${formatCapital(SUPPORT_COST)}`,
    },
    {
      key: 'laisser',
      icon: 'alert-circle',
      name: 'Laisser courir',
      desc: `Ne rien faire — ${line.deal.founderName} gère avec ses moyens actuels.`,
      cost: 'Gratuit — risque assumé',
    },
    {
      key: 'atterrissage',
      icon: 'bar-chart',
      name: 'Atterrissage doux',
      desc: 'Pousser vers un rachat partiel — coupe la perte maintenant.',
      cost: 'Abandonne tout upside',
    },
    {
      key: 'reseau',
      icon: 'users',
      name: 'Mobiliser ton réseau',
      desc: 'Connecter le fondateur à un partenaire qui peut débloquer la situation.',
      cost: networkUnavailable
        ? 'Bande passante épuisée'
        : '1 bande passante — effet incertain',
    },
  ]

  function isDisabled(key: CrisisDecision): boolean {
    if (key === 'soutenir') return supportUnaffordable
    if (key === 'reseau') return networkUnavailable
    return false
  }

  function confirm() {
    if (!selected || outcome) return
    setOutcome(resolveCrisisDecision(crisis, selected))
  }

  const predictionWidth =
    prediction.reliability === 'reliable' ? 85 : prediction.reliability === 'partial' ? 50 : 20

  return (
    <main className={styles.screen}>
      <AppHeader
        portfolioCount={portfolioCount}
        onOpenPortfolio={onOpenPortfolio}
        resources={
          <>
            <div className={styles.resource}>
              <span className={styles.resourceLabel}>CAPITAL DISPONIBLE</span>
              <span className={styles.resourceValue}>{formatCapital(remainingCapital)}</span>
            </div>
            <div className={styles.resource}>
              <span className={styles.resourceLabel}>TRIMESTRE</span>
              <span className={styles.resourceValue}>Q{quarter}</span>
            </div>
          </>
        }
      />

      <div className={styles.content}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>CHOC DE PORTEFEUILLE</p>
          <h1 className={styles.title}>ALERTE TRIMESTRIELLE</h1>
        </div>

        <div className={styles.alertBanner}>
          <span className={styles.alertIcon}>
            <Icon name="alert-circle" size={22} />
          </span>
          <div>
            <p className={styles.alertTitle}>{event.headline}</p>
            <p className={styles.alertSub}>
              1 ligne de portefeuille directement touchée · décision requise ce trimestre
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          <aside className={styles.side} data-exited={outcome?.closesLine || undefined}>
            {outcome?.closesLine && <span className={styles.exitRibbon}>SORTIE</span>}
            <div>
              <div className={styles.sideAvatar}>{initials(line.deal.founderName)}</div>
              <p className={styles.sideName}>{line.deal.founderName}</p>
              <p className={styles.sideRole}>
                {company.toUpperCase()} · {line.deal.stage.toUpperCase()} · DEPUIS Q
                {line.investedAtQuarter}
              </p>
            </div>

            <div data-onboarding="crisis-prediction">
              <p className={styles.predictLabel}>
                <Icon name="alert-circle" size={14} />
                Réaction attendue
              </p>
              <div className={styles.predictBar}>
                <div className={styles.predictFill} style={{ width: `${predictionWidth}%` }} />
              </div>
              <p className={styles.predictVerdict}>
                {prediction.predictedResilience === 'resilient' ? 'Résiliente' : 'Fragile'}
              </p>
              <p className={styles.predictNote}>{prediction.note}</p>
            </div>

            <div>
              <p className={styles.knownTitle}>Signaux équipe connus</p>
              {line.knownTeamSignals.length === 0 ? (
                <p className={styles.knownEmpty}>
                  Aucun — cette ligne a été prise sans due diligence approfondie.
                </p>
              ) : (
                <div className={styles.knownList}>
                  {line.knownTeamSignals.map((signal) => (
                    <p key={signal.label} className={styles.knownSignal}>
                      {signal.label}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <div className={styles.main}>
            <div className={styles.chatThread}>
              <div className={styles.msg} data-from="system">
                <div className={styles.msgAvatar}>
                  <Icon name="alert-circle" size={13} />
                </div>
                <div className={styles.msgBubble}>{situation}</div>
              </div>
              <div className={styles.msg} data-from="founder">
                <div className={styles.msgAvatar}>{initials(line.deal.founderName)}</div>
                <div className={styles.msgBubble}>{founderReaction}</div>
              </div>
            </div>

            <div>
              <div className={styles.decisionHead}>
                <span className={styles.decisionTitle}>VOTRE DÉCISION</span>
                <span className={styles.decisionSub}>AUCUNE OPTION SANS RISQUE</span>
              </div>

              <div
                className={styles.decisionGrid}
                data-locked={outcome !== null || undefined}
                data-onboarding="crisis-decisions"
              >
                {options.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={styles.dcard}
                    data-selected={selected === option.key || undefined}
                    disabled={outcome !== null || isDisabled(option.key)}
                    onClick={() => setSelected(option.key)}
                  >
                    <span className={styles.dIcon}>
                      <Icon name={option.icon} size={17} />
                    </span>
                    <span className={styles.dName}>{option.name}</span>
                    <span className={styles.dDesc}>{option.desc}</span>
                    <span className={styles.dCost}>{option.cost}</span>
                  </button>
                ))}
              </div>

              {selected && !outcome && (
                <button type="button" className={styles.confirmButton} onClick={confirm}>
                  Confirmer — {options.find((o) => o.key === selected)?.name} →
                </button>
              )}

              {outcome && (
                <>
                  <div className={styles.outcomePanel}>
                    <p className={styles.outcomeTitle}>{outcome.title}</p>
                    <div className={styles.outcomeSpecs}>
                      {outcome.specs.map((spec) => (
                        <div key={spec.label} className={styles.outcomeItem}>
                          <span className={styles.outcomeLabel}>{spec.label}</span>
                          <span className={styles.outcomeValue}>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                    <p className={styles.outcomeText}>{outcome.text}</p>
                  </div>

                  <button
                    type="button"
                    className={styles.continueButton}
                    onClick={() => onResolved(selected!, outcome)}
                  >
                    Continuer vers le deal flow →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
