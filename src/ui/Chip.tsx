import styles from './Chip.module.css'

interface ChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={styles.chip}
      data-selected={selected}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
