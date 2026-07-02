'use client'
import Link from 'next/link'
import { QrCode, Shield, Bell, FileText, Phone, MapPin, Star, ChevronRight, Download, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PlateTag from '@/components/PlateTag'
import PhoneFrame from '@/components/PhoneFrame'
import styles from './page.module.css'

const features = [
  { icon: Shield, title: 'Privacy Shield', desc: 'Zero phone numbers stored publicly. Your identity stays invisible.', color: '#1E8E5A' },
  { icon: Bell, title: 'Instant Notifications', desc: 'Push, WhatsApp, SMS, Email — you choose how alerts reach you.', color: '#1B4B8F' },
  { icon: FileText, title: 'Document Vault', desc: 'RC, Insurance, PUC with expiry tracking in one encrypted vault.', color: '#835500' },
  { icon: Phone, title: 'Emergency Contacts', desc: 'Define who we call in an emergency — even if you cannot.', color: '#D93025' },
  { icon: MapPin, title: '12 Report Categories', desc: 'From wrong parking to theft — bystanders can notify you in 3 taps.', color: '#F5A623' },
  { icon: Star, title: 'QR Sticker Delivery', desc: 'Premium reflective sticker delivered to your door — stick once, done.', color: '#325ea3' },
]

const steps = [
  {
    num: '01',
    title: 'Register your vehicle',
    desc: 'Add your vehicle, get a unique QR. Takes under 2 minutes.',
    screen: (
      <div style={{ padding: 14, background: '#F7F8FA', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: '#fff', border: '2px solid #1A1A1A', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.1em', color: '#737782', marginBottom: 4 }}>IND</div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 16, letterSpacing: '0.05em', color: '#1A1A1A' }}>MH 14 AB 1234</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: 12, fontSize: 11, color: '#434751' }}>
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6, fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}>Honda Activa</div>
          <div style={{ color: '#737782' }}>Added Jul 2025</div>
        </div>
        <div style={{ background: '#1B4B8F', borderRadius: 10, padding: 12, textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>Save Vehicle →</div>
      </div>
    )
  },
  {
    num: '02',
    title: 'Stick your QR',
    desc: 'Order the premium reflective sticker, delivered in 3–5 days.',
    screen: (
      <div style={{ padding: 14, background: '#F7F8FA', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{ background: '#fff', border: '2px solid #1A1A1A', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 120, height: 120, background: '#1A1A1A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <rect x="0" y="0" width="32" height="32" fill="#fff" rx="4"/>
              <rect x="8" y="8" width="16" height="16" fill="#1A1A1A"/>
              <rect x="48" y="0" width="32" height="32" fill="#fff" rx="4"/>
              <rect x="56" y="8" width="16" height="16" fill="#1A1A1A"/>
              <rect x="0" y="48" width="32" height="32" fill="#fff" rx="4"/>
              <rect x="8" y="56" width="16" height="16" fill="#1A1A1A"/>
              <rect x="48" y="48" width="8" height="8" fill="#fff"/>
              <rect x="60" y="48" width="8" height="8" fill="#fff"/>
              <rect x="48" y="60" width="8" height="8" fill="#fff"/>
              <rect x="60" y="64" width="12" height="8" fill="#fff"/>
            </svg>
          </div>
          <div style={{ fontSize: 10, color: '#737782', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.05em' }}>ROADLINK-MH14AB1234</div>
        </div>
        <div style={{ background: '#feae2c', borderRadius: 10, padding: '10px 24px', fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>Order Sticker</div>
      </div>
    )
  },
  {
    num: '03',
    title: 'Get notified instantly',
    desc: 'Any bystander scans your QR — you get an alert in seconds.',
    screen: (
      <div style={{ padding: 14, background: '#F7F8FA', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'IBM Plex Sans Condensed, sans-serif', color: '#1A1A1A', marginBottom: 4 }}>Notifications</div>
        {[
          { type: 'Wrong Parking', time: '2 min ago', color: '#F5A623' },
          { type: 'Headlights On', time: '1 hr ago', color: '#F5A623' },
          { type: 'Vehicle Verified', time: '2 days ago', color: '#1E8E5A' },
        ].map((n, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 36, borderRadius: 2, background: n.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 11 }}>{n.type}</div>
              <div style={{ fontSize: 10, color: '#737782' }}>{n.time}</div>
            </div>
            {i === 0 && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1B4B8F' }} />}
          </div>
        ))}
      </div>
    )
  },
]

const trustStats = [
  { value: '0', label: 'Phone numbers exposed' },
  { value: '12', label: 'Report categories' },
  { value: '< 3s', label: 'Alert delivery' },
  { value: '100%', label: 'Privacy-first' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroText}>
              <div className={`t-label-caps ${styles.heroBadge}`}>
                <CheckCircle size={12} /> Privacy-first vehicle identity
              </div>
              <h1 className={`t-display ${styles.heroHeadline}`}>
                Your Vehicle.<br />
                One QR.<br />
                <span style={{ color: 'var(--secondary-container)', WebkitTextStroke: '0' }}>Total Privacy.</span>
              </h1>
              <p className={`t-body-lg ${styles.heroSub}`}>
                RoadLink gives every vehicle in India a secure digital identity — so anyone can reach the owner, without knowing their number.
              </p>

              <div className={styles.heroCtas}>
                <Link href="/download" className={styles.primaryCta}>
                  <Download size={18} />
                  Download the App
                </Link>
                <Link href="/scan/demo-vehicle" className={styles.secondaryCta}>
                  <QrCode size={18} />
                  Try a Demo Scan
                </Link>
              </div>

              <p className={`t-body-sm ${styles.heroNote}`}>
                No account needed to report a vehicle. Ever.
              </p>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.heroGlow} />
              <PhoneFrame className={styles.heroPhone}>
                {/* Guest Scan Landing preview */}
                <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
                  <div style={{ background: '#fff', border: '2px solid #1A1A1A', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, letterSpacing: '0.1em', color: '#737782' }}>IND · VERIFIED</div>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 15, color: '#1A1A1A', marginTop: 2 }}>Honda Activa</div>
                    <div style={{ fontSize: 10, color: '#1E8E5A', fontWeight: 700, marginTop: 4 }}>✓ Vehicle Verified</div>
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737782', marginTop: 4 }}>Why are you here?</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {['Wrong Parking', 'Blocking Road', 'Headlights On', 'Windows Open'].map(c => (
                      <div key={c} style={{ background: '#fff', border: '1px solid rgba(26,26,26,0.12)', borderRadius: 8, padding: '8px 6px', textAlign: 'center', fontSize: 10, fontWeight: 500 }}>{c}</div>
                    ))}
                    <div style={{ background: '#fff', border: '1px solid #D93025', borderRadius: 8, padding: '8px 6px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#D93025' }}>Vehicle Theft</div>
                    <div style={{ background: '#fff', border: '1px solid #D93025', borderRadius: 8, padding: '8px 6px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#D93025' }}>Emergency</div>
                  </div>
                  <div style={{ marginTop: 'auto', fontSize: 9, color: '#737782', textAlign: 'center', borderTop: '1px solid rgba(26,26,26,0.06)', paddingTop: 8 }}>
                    This page never shows the owner's phone number · RoadLink
                  </div>
                </div>
              </PhoneFrame>
            </div>
          </div>
        </section>

        {/* ── Trust Bar ── */}
        <section className={styles.trustBar}>
          <div className="container">
            <div className={styles.trustGrid}>
              {trustStats.map((s, i) => (
                <div key={i} className={styles.trustItem}>
                  <span className={`t-mono ${styles.trustVal}`}>{s.value}</span>
                  <span className={`t-label-caps ${styles.trustLabel}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className={styles.section}>
          <div className="container">
            <div className={`text-center ${styles.sectionHead}`}>
              <div className={`t-label-caps ${styles.sectionBadge}`}>How It Works</div>
              <h2 className="t-headline-lg">From registration to real-time alerts</h2>
              <p className={`t-body-lg ${styles.sectionSub}`}>Three steps. One-time setup. Lifetime coverage.</p>
            </div>

            <div className={styles.stepsGrid}>
              {steps.map((step, i) => (
                <div key={i} className={styles.stepCard}>
                  <span className={`t-mono ${styles.stepNum}`}>{step.num}</span>
                  <PhoneFrame className={styles.stepPhone}>
                    {step.screen}
                  </PhoneFrame>
                  <h3 className={`t-headline-sm ${styles.stepTitle}`}>{step.title}</h3>
                  <p className={`t-body-md ${styles.stepDesc}`}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section className={`${styles.section} ${styles.featuresSection}`}>
          <div className="container">
            <div className={`text-center ${styles.sectionHead}`}>
              <div className={`t-label-caps ${styles.sectionBadge}`}>Platform Features</div>
              <h2 className="t-headline-lg">Built for every moment on the road</h2>
            </div>

            <div className={styles.featuresGrid}>
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <div key={i} className={styles.featureCard}>
                    <div className={styles.featureIcon} style={{ backgroundColor: `${f.color}15`, color: f.color }}>
                      <Icon size={24} />
                    </div>
                    <h3 className={`t-headline-sm ${styles.featureTitle}`}>{f.title}</h3>
                    <p className={`t-body-md ${styles.featureDesc}`}>{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Plate Tag Callout ── */}
        <section className={styles.plateSection}>
          <div className="container">
            <div className={styles.plateInner}>
              <div className={styles.plateLeft}>
                <div className={`t-label-caps ${styles.sectionBadge}`} style={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.15)' }}>The Signature Device</div>
                <h2 className={`t-headline-lg ${styles.plateHeadline}`}>
                  The QR on your windshield is a shield, not a target.
                </h2>
                <p className={`t-body-lg ${styles.plateSub}`}>
                  Every vehicle gets a unique, encrypted QR linked to a privacy proxy. When scanned, we connect the reporter to you — without ever revealing your identity.
                </p>
                <div className={styles.platePoints}>
                  {['No phone number in the QR', 'Owner identity always protected', 'Report travels to you, not through you'].map((p, i) => (
                    <div key={i} className={styles.platePoint}>
                      <CheckCircle size={16} color="var(--secondary-container)" />
                      <span className="t-body-md">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.plateRight}>
                <PlateTag value="DL 01 AA 1234" variant="hero" verified size="xl" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Privacy Promise ── */}
        <section className={styles.section}>
          <div className="container">
            <div className={`text-center ${styles.sectionHead}`}>
              <div className={`t-label-caps ${styles.sectionBadge}`}>Privacy Promise</div>
              <h2 className="t-headline-lg">Privacy is not a feature. It&apos;s the architecture.</h2>
            </div>
            <div className={styles.privacyGrid}>
              {[
                { icon: '🔒', title: 'Never stored publicly', desc: 'Your phone number lives on our secure servers, encrypted — never in a QR, never on a web page, never in a notification to a stranger.' },
                { icon: '🔐', title: 'Your documents, encrypted', desc: 'Every document in your vault is encrypted at rest and in transit. We cannot read them either.' },
                { icon: '🎛️', title: 'You control every channel', desc: 'Choose exactly how you get notified: push, SMS, WhatsApp, email. Emergency alerts always fire regardless.' },
              ].map((p, i) => (
                <div key={i} className={styles.privacyCard}>
                  <span className={styles.privacyEmoji}>{p.icon}</span>
                  <h3 className={`t-headline-sm ${styles.privacyTitle}`}>{p.title}</h3>
                  <p className={`t-body-md ${styles.privacyDesc}`}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Download CTA ── */}
        <section className={styles.downloadSection}>
          <div className="container">
            <div className={`text-center ${styles.downloadInner}`}>
              <PlateTag value="GET.STARTED" size="lg" />
              <h2 className={`t-headline-lg ${styles.downloadHeadline}`}>Register your vehicle today.</h2>
              <p className={`t-body-lg ${styles.downloadSub}`}>
                Free to register. Takes 2 minutes. The sticker arrives in days.
              </p>
              <div className={styles.downloadBtns}>
                <Link href="/download" className={styles.appBadge}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div><div style={{ fontSize: 10, opacity: 0.7 }}>Download on the</div><div style={{ fontSize: 15, fontWeight: 700 }}>App Store</div></div>
                </Link>
                <Link href="/download" className={styles.appBadge}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.33.18.72.19 1.08.03l12.23-6.8-2.61-2.61-10.7 9.38zm-1.57-19.4C1.23 4.8 1 5.28 1 5.89v12.22c0 .61.23 1.09.61 1.53l.08.07 6.85-6.85v-.16L1.61 4.36zm17.77 6.24L16.8 8l-3.2 3.19 3.2 3.2 2.6-1.45c.74-.41.74-1.09 0-1.5zM4.26.24c-.36-.16-.75-.15-1.08.03l10.7 9.41-2.61 2.61L4.26.24z"/></svg>
                  <div><div style={{ fontSize: 10, opacity: 0.7 }}>Get it on</div><div style={{ fontSize: 15, fontWeight: 700 }}>Google Play</div></div>
                </Link>
              </div>
              <div className={styles.downloadQr}>
                <div className={styles.qrBox}>
                  <QrCode size={64} color="var(--asphalt)" />
                </div>
                <p className="t-body-sm" style={{ color: 'var(--on-surface-variant)' }}>Scan to open on your phone</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
