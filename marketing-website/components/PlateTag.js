import styles from './PlateTag.module.css'

export default function PlateTag({ value, variant = 'default', verified = false, size = 'md' }) {
  return (
    <div className={`${styles.plate} ${styles[size]} ${styles[variant]}`}>
      <div className={styles.header}>
        <span className={styles.ind}>IND</span>
        <div className={styles.rivet} />
      </div>
      <div className={styles.body}>
        <span className={`t-mono ${styles.number}`}>{value}</span>
        {verified && (
          <span className={styles.badge}>✓ Verified</span>
        )}
      </div>
    </div>
  )
}
