import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>RoadLink</span>
          <p className={`t-body-sm ${styles.tagline}`}>
            Made for Indian roads. Built with privacy.
          </p>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <div className={`t-label-caps ${styles.colHead}`}>Product</div>
            <Link href="/features">Features</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/download">Download</Link>
          </div>
          <div className={styles.col}>
            <div className={`t-label-caps ${styles.colHead}`}>Legal</div>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© 2025 RoadLink. All rights reserved.</span>
        <span>0 phone numbers ever exposed.</span>
      </div>
    </footer>
  )
}
