import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export const metadata = {
  title: 'How It Works — RoadLink',
  description: 'See how RoadLink works for vehicle owners and bystanders. Step-by-step guide with FAQ.',
}

const ownerSteps = [
  { n: '01', title: 'Download the app', desc: 'Available on iOS and Android. Takes 30 seconds to install.' },
  { n: '02', title: 'Register your vehicle', desc: 'Enter your registration number. Add make, model, and an optional nickname.' },
  { n: '03', title: 'Get your QR code', desc: 'Instantly generated. Download it or order the premium reflective sticker.' },
  { n: '04', title: 'Stick it on your windshield', desc: 'Sticker delivered in 3–5 days. One-time setup, permanent coverage.' },
  { n: '05', title: 'Receive your first report', desc: 'When someone scans your QR, you get notified via push, WhatsApp, SMS, or email — your choice.' },
  { n: '06', title: 'Mark it resolved', desc: 'View the report detail, see any photo/location shared, mark it resolved with one tap.' },
  { n: '07', title: 'Manage your vault', desc: 'Upload RC, Insurance, PUC. Get expiry alerts before they lapse.' },
]

const guestSteps = [
  { n: '01', title: 'Spot the vehicle', desc: 'You see a vehicle that needs attention — wrong parking, lights left on, or worse.' },
  { n: '02', title: 'Scan the QR sticker', desc: 'Open your phone camera and scan the RoadLink sticker on the windshield. No app needed.' },
  { n: '03', title: 'Pick a report category', desc: 'From 12 options. Emergency and Theft are visually distinct — reserved for urgent situations.' },
  { n: '04', title: 'Owner is notified instantly', desc: 'Your report is delivered across all the owner\'s configured channels within seconds. Done.' },
]

const faqs = [
  { q: 'Do I need an account to report a vehicle?', a: 'No. Guest reporting requires zero account, zero app download. You scan the QR, pick a category, and tap Send. That\'s it.' },
  { q: 'Can anyone see my phone number?', a: 'Never. Your phone number is stored encrypted on our servers and is never embedded in a QR code, never shown on the scan page, and never sent to the person reporting your vehicle.' },
  { q: 'What happens when I tap "Emergency"?', a: 'The owner is alerted immediately across all their notification channels — regardless of any quiet-hour settings. The reporter also sees the local emergency number (112/108) prominently on the confirmation screen.' },
  { q: 'Is this free?', a: 'Registering a vehicle and the full reporting/notification system is free. The premium reflective QR sticker (₹149) is optional — you can download the QR and print it yourself for free.' },
  { q: 'What if my QR is stolen or damaged?', a: 'You can regenerate your QR at any time from the app. The old QR immediately stops working. Order a new sticker in seconds.' },
  { q: 'How secure are my uploaded documents?', a: 'All documents are encrypted at rest using AES-256 and in transit over TLS. We cannot read them; only you can access them from your authenticated account.' },
]

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className="container text-center">
            <div className={`t-label-caps ${styles.badge}`}>How It Works</div>
            <h1 className="t-display">Two journeys. One platform.</h1>
            <p className="t-body-lg" style={{ color: 'var(--on-surface-variant)', marginTop: 16, maxWidth: 520, margin: '16px auto 0' }}>
              Whether you own the vehicle or spotted one — RoadLink makes the right thing to do also the easiest thing to do.
            </p>
          </div>
        </section>

        <section className={styles.journeySection}>
          <div className="container">
            <div className={styles.journeyGrid}>
              {/* Owner */}
              <div>
                <div className={styles.journeyHead}>
                  <div className={styles.journeyBadge} style={{ background: 'rgba(27,75,143,0.08)', borderColor: 'rgba(27,75,143,0.2)', color: 'var(--primary-container)' }}>
                    🚗 I own a vehicle
                  </div>
                  <h2 className="t-headline-md">Owner Journey</h2>
                  <p className="t-body-md" style={{ color: 'var(--on-surface-variant)' }}>One-time setup. Lifetime coverage.</p>
                </div>
                <div className={styles.timeline}>
                  {ownerSteps.map((s, i) => (
                    <div key={i} className={styles.timelineItem}>
                      <div className={styles.timelineLeft}>
                        <div className={styles.timelineDot} style={{ background: 'var(--primary-container)' }} />
                        {i < ownerSteps.length - 1 && <div className={styles.timelineLine} style={{ background: 'rgba(27,75,143,0.15)' }} />}
                      </div>
                      <div className={styles.timelineContent}>
                        <span className={`t-mono ${styles.stepNum}`}>{s.n}</span>
                        <h3 className="t-headline-sm" style={{ margin: '4px 0 6px' }}>{s.title}</h3>
                        <p className="t-body-md" style={{ color: 'var(--on-surface-variant)' }}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest */}
              <div>
                <div className={styles.journeyHead}>
                  <div className={styles.journeyBadge} style={{ background: 'rgba(254,174,44,0.12)', borderColor: 'rgba(254,174,44,0.3)', color: '#835500' }}>
                    👁️ I spotted a vehicle
                  </div>
                  <h2 className="t-headline-md">Guest Journey</h2>
                  <p className="t-body-md" style={{ color: 'var(--on-surface-variant)' }}>No account. No app. Just scan.</p>
                </div>
                <div className={styles.timeline}>
                  {guestSteps.map((s, i) => (
                    <div key={i} className={styles.timelineItem}>
                      <div className={styles.timelineLeft}>
                        <div className={styles.timelineDot} style={{ background: 'var(--secondary-container)' }} />
                        {i < guestSteps.length - 1 && <div className={styles.timelineLine} style={{ background: 'rgba(254,174,44,0.25)' }} />}
                      </div>
                      <div className={styles.timelineContent}>
                        <span className={`t-mono ${styles.stepNum}`}>{s.n}</span>
                        <h3 className="t-headline-sm" style={{ margin: '4px 0 6px' }}>{s.title}</h3>
                        <p className="t-body-md" style={{ color: 'var(--on-surface-variant)' }}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.faqSection}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 48 }}>
              <div className={`t-label-caps ${styles.badge}`}>FAQ</div>
              <h2 className="t-headline-lg">Common questions</h2>
            </div>
            <div className={styles.faqGrid}>
              {faqs.map((f, i) => (
                <div key={i} className={styles.faqCard}>
                  <h3 className="t-headline-sm" style={{ marginBottom: 10 }}>{f.q}</h3>
                  <p className="t-body-md" style={{ color: 'var(--on-surface-variant)', lineHeight: 1.65 }}>{f.a}</p>
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
