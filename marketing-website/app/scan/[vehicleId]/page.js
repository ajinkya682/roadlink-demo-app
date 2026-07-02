import Link from 'next/link'
import { Phone, CheckCircle, AlertTriangle, Flame, ShieldAlert, Camera, MapPin, Navigation } from 'lucide-react'
import styles from './page.module.css'

export const metadata = {
  title: 'RoadLink — Vehicle Notification',
  description: 'This vehicle is registered on RoadLink. Report an issue to the owner instantly — no login required.',
}

// In production this would fetch from a DB by vehicleId.
// For the demo, we use a static mock vehicle.
const DEMO_VEHICLE = {
  displayName: 'Honda Activa',
  registrationNumber: 'MH 14 AB 1234',
  verified: true,
}

const categories = [
  { label: 'Wrong Parking', icon: '🅿️', alert: false },
  { label: 'Blocking Road', icon: '🚧', alert: false },
  { label: 'Hit & Run', icon: '💥', alert: false },
  { label: 'Vehicle Damage', icon: '🔨', alert: false },
  { label: 'Tow Alert', icon: '🚚', alert: false },
  { label: 'Headlights On', icon: '💡', alert: false },
  { label: 'Windows Open', icon: '🪟', alert: false },
  { label: 'Lost Vehicle', icon: '🔍', alert: false },
  { label: 'Abandoned', icon: '⚠️', alert: false },
  { label: 'Accident Alert', icon: '🚑', alert: false },
  { label: 'Vehicle Theft', icon: '🚨', alert: true },
  { label: 'Emergency', icon: '🆘', alert: true },
]

export default function ScanPage({ params }) {
  const vehicle = DEMO_VEHICLE

  return (
    <div className={styles.page}>
      {/* No top navbar — this is a single-purpose trust page */}

      {/* Plate Tag */}
      <div className={styles.plateSection}>
        <div className={styles.plate}>
          <div className={styles.plateHeader}>
            <span className={styles.ind}>IND</span>
            <div className={styles.rivet} />
          </div>
          <div className={styles.plateBody}>
            <span className={styles.plateNumber}>{vehicle.registrationNumber}</span>
          </div>
        </div>
        {vehicle.verified && (
          <div className={styles.verifiedBadge}>
            <CheckCircle size={14} />
            Vehicle Verified
          </div>
        )}
        <p className={styles.vehicleName}>{vehicle.displayName}</p>
      </div>

      {/* Prompt */}
      <div className={styles.prompt}>
        <p className={`${styles.promptText}`}>Why are you here?</p>
      </div>

      {/* Category Grid */}
      <div className={styles.catGrid}>
        {categories.map((cat, i) => (
          <button
            key={i}
            className={`${styles.catBtn} ${cat.alert ? styles.catAlert : styles.catNormal}`}
          >
            <span className={styles.catIcon}>{cat.icon}</span>
            <span className={styles.catLabel}>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.footerText}>
          This page never shows the owner's phone number.
        </p>
        <span className={styles.brand}>RoadLink</span>
      </div>
    </div>
  )
}
