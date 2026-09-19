import styles from './LpBadge.module.css'

interface LpBadgeProps {
  name: string
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Badge LP engagé dans le header — cohérent avec la maquette ("FO Family Office R."). */
export function LpBadge({ name }: LpBadgeProps) {
  return (
    <span className={styles.badge}>
      <span className={styles.initials}>{initials(name)}</span>
      {name}
    </span>
  )
}
