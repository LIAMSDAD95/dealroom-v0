import type { IconName } from './Icon'
import { Icon } from './Icon'
import styles from './SectionLabel.module.css'

interface SectionLabelProps {
  icon: IconName
  children: string
}

export function SectionLabel({ icon, children }: SectionLabelProps) {
  return (
    <div className={styles.row}>
      <span className={styles.icon}>
        <Icon name={icon} size={19} />
      </span>
      <p className={styles.label}>{children}</p>
    </div>
  )
}
