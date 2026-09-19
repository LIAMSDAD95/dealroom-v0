import { useState } from 'react'
import '../ui/tokens.css'
import '../ui/fonts.css'
import '../ui/global.css'
import { fundIOffers } from '../game-loop/lp-pool.data'
import type { LpOffer } from '../game-loop/lp-pool'
import type { Thesis } from '../game-loop/thesis'
import { ThesisDeclaration } from '../ui/ThesisDeclaration'
import { FundraisingScreen } from '../ui/FundraisingScreen'
import { QuarterOneScreen } from '../ui/QuarterOneScreen'

type Screen =
  | { name: 'thesis' }
  | { name: 'fundraising'; thesis: Thesis }
  | { name: 'quarter-one'; thesis: Thesis }

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
        onProceedToQuarterOne={() => setScreen({ name: 'quarter-one', thesis: screen.thesis })}
      />
    )
  }

  return <QuarterOneScreen thesis={screen.thesis} offers={offers} />
}

export default App
