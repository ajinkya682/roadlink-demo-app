'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>RoadLink</Link>

        <div className={styles.links}>
          <Link href="/features">Features</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/privacy">Privacy</Link>
        </div>

        <Link href="/download" className={styles.cta}>
          Get the App
        </Link>

        <button className={styles.hamburger} onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className={styles.mobile}>
          <Link href="/features" onClick={() => setOpen(false)}>Features</Link>
          <Link href="/how-it-works" onClick={() => setOpen(false)}>How It Works</Link>
          <Link href="/privacy" onClick={() => setOpen(false)}>Privacy</Link>
          <Link href="/download" onClick={() => setOpen(false)} className={styles.mobileCta}>Get the App</Link>
        </div>
      )}
    </nav>
  )
}
