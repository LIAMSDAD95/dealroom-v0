import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Product-spec §7.1 — polices hébergées en local via @fontsource (pas de dépendance réseau au chargement)
// Note : pas d'extension .css dans le chemin — le mapping "exports" du package l'ajoute lui-même.
import '@fontsource/big-shoulders-display/700'
import '@fontsource/big-shoulders-display/800'
import '@fontsource/big-shoulders-display/900'
import '@fontsource/press-start-2p/400'
import '@fontsource/ibm-plex-mono/400'
import '@fontsource/ibm-plex-mono/500'
import '@fontsource/ibm-plex-mono/600'
import '@fontsource/ibm-plex-mono/700'

import App from './app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
