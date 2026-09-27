import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const here = (file: string) => fileURLToPath(new URL(file, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Le projet vit dans un dossier synchronisé par iCloud, qui remet régulièrement à
      // jour la date de modification des fichiers sans en changer le contenu. Vite le lit
      // comme une modification de sa config et redémarre le serveur en plein test (voir
      // Claude/memory/learnings.md, 2026-09-24).
      //
      // Sur ce dossier iCloud, macOS n'émet pas d'événements de fichier exploitables : sans
      // polling, aucune modification n'est détectée et le HMR ne part jamais. On force donc
      // le polling, en excluant node_modules pour que le démarrage reste rapide.
      usePolling: true,
      interval: 400,
      // Seuls les fichiers de config sont exclus en plus, et par chemin absolu : un motif
      // large comme '**/tsconfig*.json' neutralise le watcher entier et casse le HMR.
      // Contrepartie assumée : un vrai changement de config demande un redémarrage manuel.
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        here('./vite.config.ts'),
        here('./tsconfig.json'),
        here('./tsconfig.app.json'),
        here('./tsconfig.node.json'),
      ],
    },
  },
})
