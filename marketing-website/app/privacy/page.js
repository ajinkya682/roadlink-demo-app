import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export const metadata = {
  title: 'Privacy Policy — RoadLink',
  description: 'RoadLink is privacy-first by architecture. Learn exactly what we collect, what we never collect, and how you control your data.',
}

const collected = [
  { col: '✓', label: 'Your phone number (for OTP verification and alerts only)' },
  { col: '✓', label: 'Vehicle registration number (encrypted, used for QR generation)' },
  { col: '✓', label: 'Documents you upload (RC, Insurance, PUC — encrypted at rest)' },
  { col: '✓', label: 'Notification preferences you set' },
  { col: '✓', label: 'Emergency contacts you add' },
]

const notCollected = [
  { col: '✗', label: 'Your phone number is never embedded in any QR code' },
  { col: '✗', label: 'Your home address is never stored or requested' },
  { col: '✗', label: 'Reporter identity is never shared with vehicle owners' },
  { col: '✗', label: 'We never sell your data to third parties — ever' },
  { col: '✗', label: 'Your documents are never used for advertising or profiling' },
]

const controls = [
  { icon: '🗑️', title: 'Delete your account', desc: 'All personal data, documents, and vehicle records are permanently erased within 30 days of account deletion. No backups retained.' },
  { icon: '🔕', title: 'Mute notification channels', desc: 'Turn off any channel (push, SMS, WhatsApp, email) at any time. Emergency alerts always fire regardless — that\'s non-negotiable for safety.' },
  { icon: '🚗', title: 'Remove a vehicle', desc: 'Removing a vehicle from your account immediately invalidates its QR code. Anyone scanning it will see "This vehicle is not registered."' },
  { icon: '📤', title: 'Export your data', desc: 'You can request a full export of your personal data at any time from Settings → Account → Export Data.' },
]

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <div className={`t-label-caps ${styles.badge}`}>Privacy Policy</div>
            <h1 className="t-display" style={{ maxWidth: 700, marginBottom: 24 }}>
              Privacy is not a feature.<br />It&apos;s the architecture.
            </h1>
            <p className="t-body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: 580 }}>
              RoadLink was designed from day one with one constraint: a stranger who scans your QR must never learn who you are. Everything else is built around that constraint.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className={styles.principlesSection}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 56 }}>
              <h2 className="t-headline-lg">Three Core Principles</h2>
            </div>
            <div className={styles.principlesGrid}>
              {[
                { num: '01', title: 'Anonymity for bystanders', body: 'Anyone can report a vehicle issue without creating an account or revealing their identity. The owner sees the report category, timestamp, and optional photo — never the reporter\'s name or phone.' },
                { num: '02', title: 'Proxy, not exposure', body: 'The QR code on your windshield is a cryptographic proxy. It points to our servers, not to you. Scanning it initiates a secure relay — your identity never travels in the payload.' },
                { num: '03', title: 'Minimum data, maximum trust', body: 'We only collect what is strictly necessary. No behavioral tracking, no ad targeting, no data brokering. Your vehicle\'s digital identity is yours — we are just the trusted infrastructure.' },
              ].map((p, i) => (
                <div key={i} className={styles.principleCard}>
                  <span className={`t-mono ${styles.principleNum}`}>{p.num}</span>
                  <h3 className="t-headline-sm" style={{ margin: '8px 0 12px' }}>{p.title}</h3>
                  <p className="t-body-md" style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7 }}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data table */}
        <section className={styles.dataSection}>
          <div className="container">
            <h2 className="t-headline-lg" style={{ marginBottom: 40, textAlign: 'center' }}>What we collect — and what we don&apos;t</h2>
            <div className={styles.dataGrid}>
              <div>
                <div className={`t-label-caps ${styles.colHead}`} style={{ color: 'var(--verified-green)' }}>✓ We collect</div>
                {collected.map((r, i) => (
                  <div key={i} className={`${styles.dataRow} ${styles.dataRowGreen}`}>
                    <span style={{ color: 'var(--verified-green)', fontWeight: 700, flexShrink: 0 }}>{r.col}</span>
                    <span className="t-body-md">{r.label}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className={`t-label-caps ${styles.colHead}`} style={{ color: 'var(--alert-red)' }}>✗ We never collect</div>
                {notCollected.map((r, i) => (
                  <div key={i} className={`${styles.dataRow} ${styles.dataRowRed}`}>
                    <span style={{ color: 'var(--alert-red)', fontWeight: 700, flexShrink: 0 }}>{r.col}</span>
                    <span className="t-body-md">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className={styles.controlsSection}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 48 }}>
              <h2 className="t-headline-lg">Your controls</h2>
              <p className="t-body-lg" style={{ color: 'var(--on-surface-variant)', marginTop: 12 }}>You are always in charge of your data.</p>
            </div>
            <div className={styles.controlsGrid}>
              {controls.map((c, i) => (
                <div key={i} className={styles.controlCard}>
                  <span className={styles.controlEmoji}>{c.icon}</span>
                  <h3 className="t-headline-sm" style={{ marginBottom: 8 }}>{c.title}</h3>
                  <p className="t-body-md" style={{ color: 'var(--on-surface-variant)', lineHeight: 1.65 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
