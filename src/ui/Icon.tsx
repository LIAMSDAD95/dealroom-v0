// Icônes inline SVG — product-spec §7.6 (trait fin stroke-width 2-2.4, jamais < 14px).
// Set calé sur vc-techwear-lp_7.html (style Lucide/Feather : outline, coins arrondis).

import type { ReactNode } from 'react'

export type IconName = 'bar-chart' | 'zap' | 'users' | 'network' | 'alert-circle' | 'lock' | 'check'

interface IconProps {
  name: IconName
  size?: number
}

const commonProps = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
}

function paths(name: IconName): ReactNode {
  switch (name) {
    case 'bar-chart':
      return <path d="M12 20V10M18 20V4M6 20v-4" />
    case 'zap':
      return <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
    case 'users':
      return (
        <>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      )
    case 'network':
      return (
        <>
          <path d="M12 2 2 7l10 5 10-5-10-5Z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </>
      )
    case 'alert-circle':
      return (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 9v4M12 17h.01" />
        </>
      )
    case 'lock':
      return (
        <>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </>
      )
    case 'check':
      return <path d="M20 6 9 17l-5-5" />
  }
}

export function Icon({ name, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
      {paths(name)}
    </svg>
  )
}
