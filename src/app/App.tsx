import '../ui/tokens.css'
import '../ui/fonts.css'
import '../ui/global.css'
import { ThesisDeclaration } from '../ui/ThesisDeclaration'
import type { Thesis } from '../game-loop/thesis'

function App() {
  function handleThesisConfirm(thesis: Thesis) {
    // Game Loop pas encore branché — log temporaire en attendant la state machine de run.
    console.log('Thèse validée', thesis)
  }

  return <ThesisDeclaration onConfirm={handleThesisConfirm} />
}

export default App
