import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PhoneFrame from '@/components/PhoneFrame'
import { QrCode, Download } from 'lucide-react'
import styles from './page.module.css'

export const metadata = {
  title: 'Download RoadLink — Vehicle Digital Identity',
  description: 'Download the RoadLink app on iOS and Android. Register your vehicle in 2 minutes and get your QR sticker.',
}

const screenshots = [
  {
    label: 'Dashboard',
    screen: (
      <div style={{ padding: 14, background: '#F7F8FA', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif', fontWeight: 700, fontSize: 14, color: '#1B4B8F' }}>RoadLink</div>
          <div style={{ display: 'flex', gap: 8 }}>🔔⚙️</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid rgba(26,26,26,0.10)', borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 8 }}>Honda Activa</div>
          <div style={{ background: '#fff', border: '2px solid #1A1A1A', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 600 }}>MH 14 AB 1234</div>
          </div>
        </div>
        <div style={{ background: '#feae2c', borderRadius: 10, padding: 10, textAlign: 'center', fontSize: 11, fontWeight: 700 }}>1 New Alert</div>
      </div>
    )
  },
  {
    label: 'Guest Scan',
    screen: (
      <div style={{ padding: 14, background: '#F7F8FA', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: '#fff', border: '2px solid #1A1A1A', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, fontWeight: 600 }}>Honda Activa</div>
          <div style={{ fontSize: 9, color: '#1E8E5A', fontWeight: 700, marginTop: 3 }}>✓ Vehicle Verified</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          {['Wrong Parking','Blocking Road','Headlights On','Windows Open'].map(c=>(
            <div key={c} style={{background:'#fff',border:'1px solid rgba(26,26,26,0.12)',borderRadius:6,padding:'7px 5px',textAlign:'center',fontSize:9,fontWeight:500}}>{c}</div>
          ))}
        </div>
      </div>
    )
  },
  {
    label: 'QR Code',
    screen: (
      <div style={{ padding: 14, background: '#F7F8FA', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{ background: '#fff', border: '2px solid #1A1A1A', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 100, height: 100, background: '#1A1A1A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28 }}>⊞</div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8, color: '#737782' }}>ROADLINK-MH14AB1234</div>
        </div>
        <div style={{ background: '#feae2c', borderRadius: 8, padding: '8px 20px', fontSize: 10, fontWeight: 700, color: '#1A1A1A' }}>Order Sticker</div>
      </div>
    )
  },
  {
    label: 'Notifications',
    screen: (
      <div style={{ padding: 14, background: '#F7F8FA', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 11, fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}>Notifications</div>
        {[{t:'Wrong Parking',c:'#F5A623'},{t:'Vehicle Verified',c:'#1E8E5A'},{t:'Insurance Expiry Soon',c:'#F5A623'}].map((n,i)=>(
          <div key={i} style={{background:'#fff',borderLeft:`3px solid ${n.c}`,borderRadius:6,padding:'8px 10px',fontSize:10}}>
            <div style={{fontWeight:600}}>{n.t}</div>
            <div style={{color:'#737782',fontSize:9,marginTop:2}}>{i===0?'2 min ago':i===1?'1 hr ago':'Yesterday'}</div>
          </div>
        ))}
      </div>
    )
  },
]

export default function DownloadPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <div className={styles.heroText}>
                <div className={`t-label-caps ${styles.badge}`}>Available now</div>
                <h1 className="t-display" style={{ marginBottom: 20 }}>Get RoadLink<br />on your phone.</h1>
                <p className="t-body-lg" style={{ color: 'rgba(255,255,255,0.80)', marginBottom: 40, maxWidth: 440 }}>
                  Register your vehicle in 2 minutes. Order your QR sticker. Never miss an alert again.
                </p>

                <div className={styles.badges}>
                  <a href="#" className={styles.storeBadge}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    <div>
                      <div className={styles.badgeSub}>Download on the</div>
                      <div className={styles.badgeMain}>App Store</div>
                    </div>
                  </a>
                  <a href="#" className={styles.storeBadge}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.33.18.72.19 1.08.03l12.23-6.8-2.61-2.61-10.7 9.38zm-1.57-19.4C1.23 4.8 1 5.28 1 5.89v12.22c0 .61.23 1.09.61 1.53l.08.07 6.85-6.85v-.16L1.61 4.36zm17.77 6.24L16.8 8l-3.2 3.19 3.2 3.2 2.6-1.45c.74-.41.74-1.09 0-1.5zM4.26.24c-.36-.16-.75-.15-1.08.03l10.7 9.41-2.61 2.61L4.26.24z"/></svg>
                    <div>
                      <div className={styles.badgeSub}>Get it on</div>
                      <div className={styles.badgeMain}>Google Play</div>
                    </div>
                  </a>
                </div>

                <div className={styles.qrDownload}>
                  <div className={styles.qrBox}>
                    <QrCode size={56} color="var(--asphalt)" />
                  </div>
                  <p className="t-body-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
                    Scan to open directly<br />on your phone
                  </p>
                </div>
              </div>

              <div className={styles.heroPhones}>
                <PhoneFrame className={styles.phone1}>
                  {screenshots[0].screen}
                </PhoneFrame>
                <PhoneFrame className={styles.phone2}>
                  {screenshots[1].screen}
                </PhoneFrame>
              </div>
            </div>
          </div>
        </section>

        {/* Screenshots carousel */}
        <section className={styles.screenshotsSection}>
          <div className="container">
            <h2 className="t-headline-lg text-center" style={{ marginBottom: 48 }}>See it in action</h2>
            <div className={styles.screenshotsRow}>
              {screenshots.map((s, i) => (
                <div key={i} className={styles.screenshotItem}>
                  <div className={`t-label-caps ${styles.screenshotLabel}`}>{s.label}</div>
                  <PhoneFrame className={styles.screenshotPhone}>
                    {s.screen}
                  </PhoneFrame>
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
