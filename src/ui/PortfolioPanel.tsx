import { useEffect } from 'react'
import type { PortfolioLine } from '../game-loop/portfolio'
import { lineMultiple, lineValue } from '../game-loop/portfolio'
import { Icon } from './Icon'
import styles from './PortfolioPanel.module.css'

interface PortfolioPanelProps {
  portfolio: PortfolioLine[]
  /** Capital total levé auprès des LPs — sert de dénominateur au capital déployé. */
  totalRaised: number
  deployedCapital: number
  onClose: () => void
  /** Numéro du fonds en chiffres romains. */
  fundLabel: string
}

function formatCapital(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}M€`
  }
  return `${Math.round(amount / 1_000)}K€`
}

const SECTOR_LABELS: Record<string, string> = {
  'saas-b2b': 'SaaS B2B',
  fintech: 'Fintech',
  deeptech: 'Deeptech',
  consumer: 'Consumer',
  marketplace: 'Marketplace',
}

export function PortfolioPanel({
  portfolio,
  totalRaised,
  deployedCapital,
  onClose,
  fundLabel,
}: PortfolioPanelProps) {
  // Échap ferme le panneau — il se consulte en un coup d'œil et doit se refermer aussi vite.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const active = portfolio.filter((line) => line.isActive)
  const exited = portfolio.filter((line) => !line.isActive)
  // Les lignes les plus récentes en premier : c'est ce que le joueur vient de décider.
  const ordered = [...active, ...exited].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1
    return b.investedAtQuarter - a.investedAtQuarter
  })

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={styles.panel}
        role="dialog"
        aria-label="Récapitulatif du portefeuille"
        // Un clic dans le panneau ne doit pas le refermer.
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow}>FONDS {fundLabel}</p>
            <h2 className={styles.title}>PORTEFEUILLE</h2>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </header>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>LIGNES ACTIVES</span>
            <span className={styles.summaryValue}>{active.length}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>SORTIES</span>
            <span className={styles.summaryValue}>{exited.length}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>DÉPLOYÉ</span>
            <span className={styles.summaryValue}>
              {formatCapital(deployedCapital)}
              <span className={styles.summaryTotal}> / {formatCapital(totalRaised)}</span>
            </span>
          </div>
        </div>

        {portfolio.length === 0 ? (
          <div className={styles.empty}>
            <Icon name="bar-chart" size={26} />
            <p className={styles.emptyTitle}>Aucune ligne pour l'instant</p>
            <p className={styles.emptyText}>
              Les startups dans lesquelles tu investis apparaîtront ici, avec les signaux que tu
              connaissais au moment de décider.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {ordered.map((line) => (
              <article key={line.id} className={styles.line} data-exited={!line.isActive || undefined}>
                <div className={styles.lineHead}>
                  <p className={styles.company}>{line.deal.companyName}</p>
                  {!line.isActive && (
                    <span className={styles.exitTag}>
                      {line.exitKind === 'shutdown' ? 'FERMÉE' : 'SORTIE'}
                    </span>
                  )}
                </div>
                <p className={styles.founder}>{line.deal.founderName}</p>
                <p className={styles.meta}>
                  {SECTOR_LABELS[line.deal.sector] ?? line.deal.sector} · {line.deal.stage.toUpperCase()} ·
                  ENTRÉE Q{line.investedAtQuarter}
                </p>

                <div className={styles.amountRow}>
                  <span className={styles.amountLabel}>Investi</span>
                  <span className={styles.amountValue}>{formatCapital(line.investedAmount)}</span>
                </div>
                <div className={styles.amountRow}>
                  <span className={styles.amountLabel}>
                    {line.isActive ? 'Valeur estimée' : 'Récupéré'}
                  </span>
                  <span className={styles.amountValue}>
                    {formatCapital(lineValue(line))} ·{' '}
                    {lineMultiple(line).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}×
                  </span>
                </div>

                <div className={styles.signals}>
                  <p className={styles.signalsLabel}>Signaux équipe connus</p>
                  {line.knownTeamSignals.length === 0 ? (
                    <p className={styles.signalsEmpty}>
                      Aucun — ligne prise sans due diligence approfondie.
                    </p>
                  ) : (
                    <div className={styles.signalList}>
                      {line.knownTeamSignals.map((signal) => (
                        <span key={signal.label} className={styles.signalTag}>
                          {signal.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </aside>
    </div>
  )
}
