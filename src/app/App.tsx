import { useEffect, useRef, useState, type ReactNode } from 'react'
import '../ui/tokens.css'
import '../ui/fonts.css'
import '../ui/global.css'
import { fundIOffers } from '../game-loop/lp-pool.data'
import { generateQuarterDeals } from '../game-loop/deal-generator'
import type { Crisis } from '../game-loop/crisis'
import { maybeTriggerCrisis } from '../game-loop/crisis'
import type { Deal } from '../game-loop/deal'
import type { LpOffer } from '../game-loop/lp-pool'
import type { PortfolioLine } from '../game-loop/portfolio'
import { createPortfolioLine } from '../game-loop/portfolio'
import { STARTING_BANDWIDTH } from '../game-loop/resources'
import type { Thesis } from '../game-loop/thesis'
import { ThesisDeclaration } from '../ui/ThesisDeclaration'
import { FundraisingScreen } from '../ui/FundraisingScreen'
import { DealFlowScreen } from '../ui/DealFlowScreen'
import { CrisisScene } from '../ui/CrisisScene'
import { PortfolioPanel } from '../ui/PortfolioPanel'

type Screen =
  | { name: 'thesis' }
  | { name: 'fundraising'; thesis: Thesis }
  | { name: 'deal-flow'; thesis: Thesis; deals: Deal[]; quarter: number }
  // La crise s'intercale AVANT le deal flow du trimestre : le joueur traite le choc de
  // portefeuille, puis continue vers les nouvelles opportunités (§3.6).
  | { name: 'crisis'; thesis: Thesis; deals: Deal[]; quarter: number; crisis: Crisis }
  | { name: 'run-closed'; thesis: Thesis }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'thesis' })
  const [offers, setOffers] = useState<LpOffer[]>(fundIOffers)
  // Cumulé sur tout le run : les investissements des trimestres précédents restent
  // déployés (voir Claude/memory/decisions.md, 2026-09-22).
  const [deployedCapital, setDeployedCapital] = useState(0)
  // Lignes investies sur tout le run — c'est la cible des crises macro (§3.6).
  const [portfolio, setPortfolio] = useState<PortfolioLine[]>([])
  // Bande passante déjà consommée par la crise du trimestre en cours : elle est dépensée
  // avant le deal flow, donc le joueur entre le trimestre avec moins de points.
  const [crisisBandwidthSpent, setCrisisBandwidthSpent] = useState(0)
  // Startups déjà croisées dans ce run — le générateur est stateless (ADR-002), c'est
  // donc ici qu'on tient la mémoire pour éviter qu'une même startup revienne d'un
  // trimestre à l'autre (retour utilisateur 2026-09-24).
  const seenCompanyNames = useRef<Set<string>>(new Set())
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
   * Avance d'un trimestre en passant par la scène de crise si elle se déclenche.
   * Le tirage se fait ici, une seule fois par transition — jamais pendant un render.
   */
  function enterQuarter(thesis: Thesis, quarter: number, currentPortfolio: PortfolioLine[]) {
    const deals = generateQuarterDeals(thesis, quarter, seenCompanyNames.current)
    for (const deal of deals) seenCompanyNames.current.add(deal.companyName)
    const crisis = maybeTriggerCrisis(currentPortfolio, quarter)
    setCrisisBandwidthSpent(0)
    setScreen(
      crisis
        ? { name: 'crisis', thesis, deals, quarter, crisis }
        : { name: 'deal-flow', thesis, deals, quarter },
    )
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
      <ThesisDeclaration onConfirm={(thesis) => setScreen({ name: 'fundraising', thesis })} />
    )
  } else if (screen.name === 'fundraising') {
    currentScreen = (
      <FundraisingScreen
        thesis={screen.thesis}
        offers={offers}
        onOfferCommitted={(offerId, amount) => {
          setOffers((current) =>
            current.map((offer) =>
              offer.id === offerId
                ? { ...offer, status: 'committed', committedAmount: amount }
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
  } else if (screen.name === 'crisis') {
    currentScreen = (
      <CrisisScene
        key={`${screen.quarter}-${screen.crisis.line.id}`}
        crisis={screen.crisis}
        quarter={screen.quarter}
        remainingCapital={totalRaised - deployedCapital}
        bandwidth={STARTING_BANDWIDTH - crisisBandwidthSpent}
        {...portfolioProps}
        onResolved={(_decision, outcome) => {
          // Un coût de crise consomme du capital levé au même titre qu'un ticket ;
          // une récupération (atterrissage doux) le rend disponible à nouveau.
          if (outcome.capitalDelta !== 0) {
            setDeployedCapital((c) => c - outcome.capitalDelta)
          }
          if (outcome.bandwidthCost > 0) {
            setCrisisBandwidthSpent((b) => b + outcome.bandwidthCost)
          }
          if (outcome.closesLine) {
            setPortfolio((lines) =>
              lines.map((line) =>
                line.id === screen.crisis.line.id ? { ...line, isActive: false } : line,
              ),
            )
          }
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
    // Placeholder : l'écran de clôture de run (product-spec §3.8) est à construire une
    // fois les maquettes reçues.
    currentScreen = (
      <main style={{ minHeight: '100vh', padding: '4rem 2rem', color: 'var(--cream)' }}>
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: 'var(--mustard)' }}>
          FIN DU RUN
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '3rem',
            textTransform: 'uppercase',
            margin: '0.5rem 0 1rem',
          }}
        >
          Fonds clôturé
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--stone)' }}>
          Écran de clôture à construire — maquettes en attente.
        </p>
      </main>
    )
  } else {
    currentScreen = (
      <DealFlowScreen
        // key : nouveau trimestre = écran neuf (statuts de cartes, bande passante,
        // signaux révélés repartent à zéro) sans avoir à réinitialiser chaque state.
        // La bande passante consommée en crise fait partie de la key : sinon, revenir de la
        // scène de crise au deal flow du MÊME trimestre réutiliserait l'instance existante
        // et le coût ne serait jamais appliqué.
        key={`${screen.quarter}-${crisisBandwidthSpent}`}
        deals={screen.deals}
        offers={offers}
        quarter={screen.quarter}
        deployedCapital={deployedCapital}
        bandwidthSpent={crisisBandwidthSpent}
        {...portfolioProps}
        onCapitalDeployed={(deal, signalsRevealed) => {
          setDeployedCapital((c) => c + deal.askAmount)
          setPortfolio((lines) => [
            ...lines,
            createPortfolioLine(deal, deal.askAmount, screen.quarter, signalsRevealed),
          ])
        }}
        onAdvanceQuarter={() => {
          // `portfolio` est à jour ici : les setState d'investissement du trimestre ont
          // déjà été committés avant ce clic.
          enterQuarter(screen.thesis, screen.quarter + 1, portfolio)
        }}
        onCloseFund={() => setScreen({ name: 'run-closed', thesis: screen.thesis })}
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
          onClose={() => setPortfolioOpen(false)}
        />
      )}
    </>
  )
}

export default App
