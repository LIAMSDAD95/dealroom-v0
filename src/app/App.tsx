import { useState } from 'react'
import '../ui/tokens.css'
import '../ui/fonts.css'
import '../ui/global.css'
import { fundIOffers } from '../game-loop/lp-pool.data'
import { generateQuarterDeals } from '../game-loop/deal-generator'
import type { Deal } from '../game-loop/deal'
import type { LpOffer } from '../game-loop/lp-pool'
import type { Thesis } from '../game-loop/thesis'
import { ThesisDeclaration } from '../ui/ThesisDeclaration'
import { FundraisingScreen } from '../ui/FundraisingScreen'
import { DealFlowScreen } from '../ui/DealFlowScreen'

type Screen =
  | { name: 'thesis' }
  | { name: 'fundraising'; thesis: Thesis }
  | { name: 'deal-flow'; thesis: Thesis; deals: Deal[]; quarter: number }
  | { name: 'run-closed'; thesis: Thesis }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'thesis' })
  const [offers, setOffers] = useState<LpOffer[]>(fundIOffers)
  // Cumulé sur tout le run : les investissements des trimestres précédents restent
  // déployés (voir Claude/memory/decisions.md, 2026-09-22).
  const [deployedCapital, setDeployedCapital] = useState(0)

  if (screen.name === 'thesis') {
    return (
      <ThesisDeclaration onConfirm={(thesis) => setScreen({ name: 'fundraising', thesis })} />
    )
  }

  if (screen.name === 'fundraising') {
    return (
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
          const deals = generateQuarterDeals(screen.thesis, 1)
          setScreen({ name: 'deal-flow', thesis: screen.thesis, deals, quarter: 1 })
        }}
      />
    )
  }

  if (screen.name === 'run-closed') {
    // Placeholder : l'écran de clôture de run (product-spec §3.8) est à construire une
    // fois les maquettes reçues.
    return (
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
  }

  return (
    <DealFlowScreen
      // key : nouveau trimestre = écran neuf (statuts de cartes, bande passante,
      // signaux révélés repartent à zéro) sans avoir à réinitialiser chaque state.
      key={screen.quarter}
      deals={screen.deals}
      offers={offers}
      quarter={screen.quarter}
      deployedCapital={deployedCapital}
      onCapitalDeployed={(amount) => setDeployedCapital((c) => c + amount)}
      onAdvanceQuarter={() => {
        const nextQuarter = screen.quarter + 1
        const deals = generateQuarterDeals(screen.thesis, nextQuarter)
        setScreen({ name: 'deal-flow', thesis: screen.thesis, deals, quarter: nextQuarter })
      }}
      onCloseFund={() => setScreen({ name: 'run-closed', thesis: screen.thesis })}
    />
  )
}

export default App
