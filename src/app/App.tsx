import { useEffect, useRef, useState, type ReactNode } from 'react'
import '../ui/tokens.css'
import '../ui/fonts.css'
import '../ui/global.css'
import { fundIOffers } from '../game-loop/lp-pool.data'
import { formatFundNumber } from '../game-loop/fund'
import { generateQuarterDeals } from '../game-loop/deal-generator'
import type { Crisis } from '../game-loop/crisis'
import { maybeTriggerCrisis } from '../game-loop/crisis'
import type { Deal } from '../game-loop/deal'
import type { LpOffer } from '../game-loop/lp-pool'
import { withReturningLps } from '../game-loop/lp-pool'
import type { LpReport } from '../game-loop/lp-report'
import { buildLpReport, returningLpsFrom } from '../game-loop/lp-report'
import type { CrisisRecord, MetaProgress, RunGains } from '../game-loop/meta'
import {
  computeRunGains,
  hasPerk,
  nextMeta,
  PREMIER_FONDS_CONFIDENCE_BONUS,
  unlockedAngles,
} from '../game-loop/meta'
import type { ClosingMetrics, LineOutcome } from '../game-loop/run-closing'
import { closingMetrics, resolveRunClose } from '../game-loop/run-closing'
import { loadMeta, saveMeta } from '../persistence/meta-storage'
import type { PortfolioLine } from '../game-loop/portfolio'
import { activeLines, createPortfolioLine } from '../game-loop/portfolio'
import type { FollowOnOffer, QuarterEvolution } from '../game-loop/portfolio-evolution'
import {
  advancePortfolio,
  applyCrisisEffect,
  resolveFollowOn,
  reviewDueDiligence,
} from '../game-loop/portfolio-evolution'
import { STARTING_BANDWIDTH } from '../game-loop/resources'
import type { Thesis } from '../game-loop/thesis'
import { ThesisDeclaration } from '../ui/ThesisDeclaration'
import { FundraisingScreen } from '../ui/FundraisingScreen'
import { DealFlowScreen } from '../ui/DealFlowScreen'
import { CrisisScene } from '../ui/CrisisScene'
import { PortfolioPanel } from '../ui/PortfolioPanel'
import { PortfolioScreen } from '../ui/PortfolioScreen'
import { RunClosingScreen } from '../ui/RunClosingScreen'
import { DesktopOnlyScreen } from '../ui/DesktopOnlyScreen'
import { OnboardingProvider } from '../ui/onboarding/OnboardingProvider'
import { useIsDesktop } from './useIsDesktop'

type Screen =
  | { name: 'thesis' }
  | { name: 'fundraising'; thesis: Thesis }
  // Rapport de portefeuille en ouverture de trimestre (§3.2.1) : évolutions silencieuses +
  // follow-on, avant la crise éventuelle et le deal flow. Absent tant que le portefeuille
  // est vide (voir decisions.md, 2026-09-27).
  | {
      name: 'portfolio-report'
      thesis: Thesis
      deals: Deal[]
      quarter: number
      evolutions: QuarterEvolution[]
      followOns: FollowOnOffer[]
    }
  | { name: 'deal-flow'; thesis: Thesis; deals: Deal[]; quarter: number }
  // La crise s'intercale AVANT le deal flow du trimestre : le joueur traite le choc de
  // portefeuille, puis continue vers les nouvelles opportunités (§3.6).
  | { name: 'crisis'; thesis: Thesis; deals: Deal[]; quarter: number; crisis: Crisis }
  // Clôture (§3.8) : tout est calculé une seule fois à la transition, jamais pendant un render.
  | {
      name: 'run-closed'
      outcomes: LineOutcome[]
      metrics: ClosingMetrics
      lpReports: LpReport[]
      gains: RunGains
      next: MetaProgress
    }

interface RunProps {
  meta: MetaProgress
  /** Passe au fonds suivant avec la méta-progression gagnée (déjà sauvegardée). */
  onStartNextFund: (next: MetaProgress) => void
}

/**
 * Un run = un fonds. Monté avec `key={meta.fundNumber}` : lancer le fonds suivant remonte
 * une instance neuve, donc tout l'état du run repart à zéro sans réinitialisation manuelle.
 */
function Run({ meta, onStartNextFund }: RunProps) {
  const fundLabel = formatFundNumber(meta.fundNumber)
  const [screen, setScreen] = useState<Screen>({ name: 'thesis' })
  // Les LPs qui ont reconduit au fonds précédent sont engagés d'office (§3.8).
  const [offers, setOffers] = useState<LpOffer[]>(() =>
    withReturningLps(fundIOffers, meta.returningLps),
  )
  // Cumulé sur tout le run : les investissements des trimestres précédents restent
  // déployés (voir Claude/memory/decisions.md, 2026-09-22).
  const [deployedCapital, setDeployedCapital] = useState(0)
  // Lignes investies sur tout le run — c'est la cible des crises macro (§3.6).
  const [portfolio, setPortfolio] = useState<PortfolioLine[]>([])
  // Bande passante déjà consommée avant le deal flow du trimestre en cours (« Revoir DD »
  // sur un follow-on, « Mobiliser son réseau » en crise) : le joueur entre dans le deal
  // flow avec moins de points.
  const [quarterBandwidthSpent, setQuarterBandwidthSpent] = useState(0)
  // Startups déjà croisées dans ce run — le générateur est stateless (ADR-002), c'est
  // donc ici qu'on tient la mémoire pour éviter qu'une même startup revienne d'un
  // trimestre à l'autre (retour utilisateur 2026-09-24).
  const seenCompanyNames = useRef<Set<string>>(new Set())
  // Même principe pour les pitchs d'ouverture des fondateurs : un pitch déjà entendu ne
  // revient pas tant que la banque de l'archétype n'est pas épuisée (retour 2026-09-27).
  const heardOpenings = useRef<Set<string>>(new Set())
  // Idem pour les alertes trimestrielles : une crise déjà vécue ne revient pas (2026-09-29).
  const seenCrisisIds = useRef<Set<string>>(new Set())
  // Faits du run relus seulement à la clôture (leçons §3.7, engagements LP §3.8) : jamais
  // affichés en cours de partie, d'où des refs plutôt que du state.
  const crisisLog = useRef<CrisisRecord[]>([])
  const followedLineIds = useRef<Set<string>>(new Set())
  // Panneau de récap consultable à tout moment (voir decisions.md, 2026-09-24).
  const [portfolioOpen, setPortfolioOpen] = useState(false)

  // Raccourci « P » : ouvre/ferme le récap sans quitter la souris des cartes de deal.
  // Ignoré si le joueur tape dans un champ, pour ne pas voler la frappe.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'p' && event.key !== 'P') return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select, [contenteditable]')) return
      // Même règle que le bouton : rien à consulter avant le premier trimestre.
      if (screen.name === 'thesis' || screen.name === 'fundraising') return
      setPortfolioOpen((open) => !open)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [screen.name])

  const totalRaised = offers
    .filter((o) => o.status === 'committed')
    .reduce((sum, o) => sum + (o.committedAmount ?? 0), 0)

  /**
   * Avance d'un trimestre : rapport de portefeuille s'il y a des lignes actives, puis
   * scène de crise si elle se déclenche, puis deal flow. Les tirages se font ici, une
   * seule fois par transition — jamais pendant un render.
   */
  function enterQuarter(thesis: Thesis, quarter: number, currentPortfolio: PortfolioLine[]) {
    const deals = generateQuarterDeals(thesis, quarter, seenCompanyNames.current)
    for (const deal of deals) seenCompanyNames.current.add(deal.companyName)
    setQuarterBandwidthSpent(0)

    if (activeLines(currentPortfolio).length > 0) {
      const report = advancePortfolio(currentPortfolio, quarter)
      setPortfolio(report.portfolio)
      setScreen({
        name: 'portfolio-report',
        thesis,
        deals,
        quarter,
        evolutions: report.evolutions,
        followOns: report.followOns,
      })
      return
    }
    enterCrisisOrDealFlow(thesis, deals, quarter, currentPortfolio)
  }

  function enterCrisisOrDealFlow(
    thesis: Thesis,
    deals: Deal[],
    quarter: number,
    currentPortfolio: PortfolioLine[],
  ) {
    const crisis = maybeTriggerCrisis(currentPortfolio, quarter, seenCrisisIds.current)
    if (crisis) seenCrisisIds.current.add(crisis.event.id)
    setScreen(
      crisis
        ? { name: 'crisis', thesis, deals, quarter, crisis }
        : { name: 'deal-flow', thesis, deals, quarter },
    )
  }

  /**
   * Clôture du fonds (§3.8) : dénouement accéléré, rapport aux LPs, gains de méta-progression.
   * La méta-progression est sauvegardée tout de suite, pour qu'un rechargement de page sur
   * l'écran de clôture ne fasse pas perdre les gains du run.
   */
  function closeFund() {
    const outcomes = resolveRunClose(portfolio)
    const metrics = closingMetrics(outcomes)
    const facts = { portfolio, metrics, crises: crisisLog.current, totalRaised }
    const lpReports = offers
      .filter((o) => o.status === 'committed')
      .map((offer) => buildLpReport(offer, facts))
    const returningLps = returningLpsFrom(lpReports)
    const gains = computeRunGains(meta, {
      outcomes,
      metrics,
      crises: crisisLog.current,
      followedLineIds: [...followedLineIds.current],
      followingLpCount: returningLps.length,
    })
    const next = nextMeta(meta, gains, returningLps)
    saveMeta(next)
    setPortfolioOpen(false)
    setScreen({ name: 'run-closed', outcomes, metrics, lpReports, gains, next })
  }

  // Le récap de portefeuille doit pouvoir s'ouvrir par-dessus n'importe quel écran : on
  // compose donc l'écran courant dans une variable plutôt que de sortir par des `return`
  // successifs, et le panneau est monté une seule fois, au-dessus de tout.
  const portfolioProps = {
    portfolioCount: portfolio.filter((l) => l.isActive).length,
    onOpenPortfolio: () => setPortfolioOpen(true),
  }

  let currentScreen: ReactNode

  if (screen.name === 'thesis') {
    // Avant la levée de fonds, rien à consulter : pas de bouton portefeuille.
    currentScreen = (
      <ThesisDeclaration
        fundLabel={fundLabel}
        onConfirm={(thesis) => setScreen({ name: 'fundraising', thesis })}
      />
    )
  } else if (screen.name === 'fundraising') {
    currentScreen = (
      <FundraisingScreen
        thesis={screen.thesis}
        offers={offers}
        fundLabel={fundLabel}
        unlockedAngles={unlockedAngles(meta.reputation)}
        confidenceBonus={hasPerk(meta, 'premier-fonds') ? PREMIER_FONDS_CONFIDENCE_BONUS : 0}
        onOfferCommitted={(offerId, amount, record) => {
          setOffers((current) =>
            current.map((offer) =>
              offer.id === offerId
                ? { ...offer, status: 'committed', committedAmount: amount, pitchRecord: record }
                : offer,
            ),
          )
        }}
        onProceedToQuarterOne={() => {
          // Deals générés une seule fois à l'entrée du trimestre (ADR-002), pas à chaque render.
          enterQuarter(screen.thesis, 1, portfolio)
        }}
      />
    )
  } else if (screen.name === 'portfolio-report') {
    currentScreen = (
      <PortfolioScreen
        key={screen.quarter}
        quarter={screen.quarter}
        portfolio={portfolio}
        evolutions={screen.evolutions}
        followOns={screen.followOns}
        offers={offers}
        deployedCapital={deployedCapital}
        bandwidth={STARTING_BANDWIDTH - quarterBandwidthSpent}
        {...portfolioProps}
        reviewCostsBandwidth={!hasPerk(meta, 'discipline-reserve')}
        onReviewDd={(lineId) => {
          // Perk « Discipline de réserve » (§3.7) : revoir la DD devient gratuit.
          if (!hasPerk(meta, 'discipline-reserve')) setQuarterBandwidthSpent((b) => b + 1)
          setPortfolio((lines) =>
            lines.map((line) => (line.id === lineId ? reviewDueDiligence(line) : line)),
          )
        }}
        onFollowOnDecided={(offer, decision) => {
          if (decision === 'follow') {
            setDeployedCapital((c) => c + offer.ticket)
            followedLineIds.current.add(offer.lineId)
          }
          setPortfolio((lines) =>
            lines.map((line) =>
              line.id === offer.lineId ? resolveFollowOn(line, offer, decision) : line,
            ),
          )
        }}
        onContinue={() => {
          // `portfolio` est à jour ici : les décisions follow-on ont été committées avant ce clic.
          enterCrisisOrDealFlow(screen.thesis, screen.deals, screen.quarter, portfolio)
        }}
      />
    )
  } else if (screen.name === 'crisis') {
    currentScreen = (
      <CrisisScene
        key={`${screen.quarter}-${screen.crisis.line.id}`}
        crisis={screen.crisis}
        quarter={screen.quarter}
        remainingCapital={totalRaised - deployedCapital}
        bandwidth={STARTING_BANDWIDTH - quarterBandwidthSpent}
        {...portfolioProps}
        predictionBonus={hasPerk(meta, 'sang-froid') ? 1 : 0}
        onResolved={(decision, outcome) => {
          crisisLog.current.push({ decision, lineEffect: outcome.lineEffect })
          // Un coût de crise consomme du capital levé au même titre qu'un ticket ;
          // une récupération (atterrissage doux) le rend disponible à nouveau.
          if (outcome.capitalDelta !== 0) {
            setDeployedCapital((c) => c - outcome.capitalDelta)
          }
          if (outcome.bandwidthCost > 0) {
            setQuarterBandwidthSpent((b) => b + outcome.bandwidthCost)
          }
          setPortfolio((lines) =>
            lines.map((line) => {
              if (line.id !== screen.crisis.line.id) return line
              if (outcome.closesLine) {
                // Atterrissage en douceur : le capital récupéré est un retour réalisé (DPI).
                return {
                  ...line,
                  isActive: false,
                  exitKind: 'soft-landing',
                  realizedValue: Math.max(0, outcome.capitalDelta),
                }
              }
              // Un bridge est du capital investi dans la ligne : il entre dans son multiple.
              const bridged =
                outcome.capitalDelta < 0
                  ? { ...line, investedAmount: line.investedAmount - outcome.capitalDelta }
                  : line
              return applyCrisisEffect(bridged, outcome.lineEffect)
            }),
          )
          setScreen({
            name: 'deal-flow',
            thesis: screen.thesis,
            deals: screen.deals,
            quarter: screen.quarter,
          })
        }}
      />
    )
  } else if (screen.name === 'run-closed') {
    currentScreen = (
      <RunClosingScreen
        fundNumber={meta.fundNumber}
        outcomes={screen.outcomes}
        metrics={screen.metrics}
        lpReports={screen.lpReports}
        gains={screen.gains}
        totalRaised={totalRaised}
        onStartNextFund={() => onStartNextFund(screen.next)}
      />
    )
  } else {
    currentScreen = (
      <DealFlowScreen
        // key : nouveau trimestre = écran neuf (statuts de cartes, bande passante,
        // signaux révélés repartent à zéro) sans avoir à réinitialiser chaque state.
        // La bande passante consommée avant le deal flow (follow-on, crise) fait partie de
        // la key : sinon, revenir de la scène de crise au deal flow du MÊME trimestre
        // réutiliserait l'instance existante et le coût ne serait jamais appliqué.
        key={`${screen.quarter}-${quarterBandwidthSpent}`}
        deals={screen.deals}
        offers={offers}
        quarter={screen.quarter}
        deployedCapital={deployedCapital}
        bandwidthSpent={quarterBandwidthSpent}
        {...portfolioProps}
        onCapitalDeployed={(deal, signalsRevealed, amount) => {
          setDeployedCapital((c) => c + amount)
          setPortfolio((lines) => [
            ...lines,
            createPortfolioLine(deal, amount, screen.quarter, signalsRevealed),
          ])
        }}
        onAdvanceQuarter={() => {
          // `portfolio` est à jour ici : les setState d'investissement du trimestre ont
          // déjà été committés avant ce clic.
          enterQuarter(screen.thesis, screen.quarter + 1, portfolio)
        }}
        onCloseFund={closeFund}
        heardOpenings={heardOpenings.current}
        freeTeamSignal={hasPerk(meta, 'instinct-chasseur')}
      />
    )
  }

  return (
    <>
      {currentScreen}
      {portfolioOpen && (
        <PortfolioPanel
          portfolio={portfolio}
          totalRaised={totalRaised}
          deployedCapital={deployedCapital}
          fundLabel={fundLabel}
          onClose={() => setPortfolioOpen(false)}
        />
      )}
    </>
  )
}

function App() {
  // Méta-progression relue une fois au démarrage (Persistence, §8.3).
  const [meta, setMeta] = useState<MetaProgress>(loadMeta)
  const isDesktop = useIsDesktop()
  return (
    <OnboardingProvider>
      <Run key={meta.fundNumber} meta={meta} onStartNextFund={setMeta} />
      {/* Recouvre sans démonter : la partie reprend intacte si la fenêtre est agrandie (§8.1). */}
      {!isDesktop && <DesktopOnlyScreen />}
    </OnboardingProvider>
  )
}

export default App
