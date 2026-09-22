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

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'thesis' })
  const [offers, setOffers] = useState<LpOffer[]>(fundIOffers)

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

  return <DealFlowScreen deals={screen.deals} offers={offers} quarter={screen.quarter} />
}

export default App
