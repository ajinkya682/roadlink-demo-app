import styles from './PhoneFrame.module.css'

export default function PhoneFrame({ children, className = '' }) {
  return (
    <div className={`${styles.frame} ${className}`}>
      <div className={styles.notch} />
      <div className={styles.screen}>
        {children}
      </div>
      <div className={styles.homeBar} />
    </div>
  )
}
