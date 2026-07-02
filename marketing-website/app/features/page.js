import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PhoneFrame from '@/components/PhoneFrame'
import { Shield, Bell, FileText, Phone, MapPin, QrCode, CheckCircle, AlertTriangle } from 'lucide-react'
import styles from './page.module.css'

export const metadata = {
  title: 'Features — RoadLink',
  description: 'Explore every feature RoadLink offers: guest reporting, privacy shield, document vault, emergency contacts, and more.',
}

const deepDives = [
  {
    icon: QrCode,
    tag: 'Guest Reporting',
    headline: 'Any bystander can report in 3 taps. No app needed.',
    body: 'When someone spots your vehicle in trouble, they scan the QR on your windshield and land directly on a reporting page — no login, no download, no friction. They pick a category, optionally add a note or photo, and tap Send. You get the alert in seconds.',
    phone: (
      <div style={{ padding: 14, background: '#F7F8FA', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: '#fff', border: '2px solid #1A1A1A', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Honda Activa</div>
          <div style={{ fontSize: 10, color: '#1E8E5A', fontWeight: 700 }}>✓ Vehicle Verified</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {['Wrong Parking','Blocking Road','Hit & Run','Tow Alert','Headlights On','Windows Open'].map(c=>(
            <div key={c} style={{background:'#fff',border:'1px solid rgba(26,26,26,0.12)',borderRadius:6,padding:'8px 6px',textAlign:'center',fontSize:9.5,fontWeight:500}}>{c}</div>
          ))}
          <div style={{background:'#fff',border:'1px solid #D93025',borderRadius:6,padding:'8px 6px',textAlign:'center',fontSize:9.5,fontWeight:700,color:'#D93025',gridColumn:'1/-1'}}>Vehicle Theft / Emergency</div>
        </div>
      </div>
    ),
    imageRight: false,
  },
  {
    icon: Shield,
    tag: 'Privacy Layer',
    headline: 'Your identity stays yours. Always.',
    body: 'When a stranger scans your QR, they see your vehicle model and a Verified badge — nothing else. Your name, phone number, home address are never in the QR, never on the scan page, never sent to the reporter. Privacy is the architecture, not a checkbox.',
    phone: (
      <div style={{ padding: 14, background: '#F7F8FA', height: '100%', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: '#737782', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What a stranger sees</div>
          <div style={{ background: '#fff', border: '2px solid #1A1A1A', borderRadius: 8, padding: '10px 20px' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>Honda Activa</div>
            <div style={{ fontSize: 10, color: '#1E8E5A', fontWeight: 700, marginTop: 4 }}>✓ Vehicle Verified</div>
          </div>
        </div>
        <div style={{ width: '80%', height: 1, background: 'rgba(26,26,26,0.08)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: '#737782', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>What stays hidden</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            {['+91 98••••••10','Ajinkya S.','Mumbai, MH'].map((h,i)=>(
              <div key={i} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#D93025', textDecoration: 'line-through', opacity: 0.5 }}>{h}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    imageRight: true,
  },
  {
    icon: FileText,
    tag: 'Document Vault',
    headline: 'RC, Insurance, PUC in one secure place.',
    body: 'Upload your vehicle documents once. RoadLink tracks expiry dates and sends you alerts before they lapse — so you're never caught off guard during a traffic stop. All documents are encrypted at rest.',
    phone: (
      <div style={{ padding: 14, background: '#F7F8FA', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 11, fontFamily: 'IBM Plex Sans Condensed, sans-serif', color: '#1A1A1A' }}>Document Vault</div>
        {[{name:'RC Book',status:'Valid',color:'#1E8E5A'},{name:'Insurance',status:'Expires in 12 days',color:'#F5A623'},{name:'PUC',status:'Expired',color:'#D93025'}].map((d,i)=>(
          <div key={i} style={{ background: '#fff', border: `1px solid rgba(26,26,26,0.10)`, borderLeft: `3px solid ${d.color}`, borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontWeight: 600, fontSize: 11 }}>{d.name}</div>
            <div style={{ fontSize: 10, color: d.color, fontWeight: 600, marginTop: 2 }}>{d.status}</div>
          </div>
        ))}
      </div>
    ),
    imageRight: false,
  },
]

const reportCategories = [
  { label: 'Wrong Parking', icon: '🅿️', alert: false },
  { label: 'Blocking Road', icon: '🚧', alert: false },
  { label: 'Hit & Run', icon: '💥', alert: false },
  { label: 'Vehicle Damage', icon: '🔨', alert: false },
  { label: 'Fire', icon: '🔥', alert: true },
  { label: 'Vehicle Theft', icon: '🚨', alert: true },
  { label: 'Tow Alert', icon: '🚚', alert: false },
  { label: 'Headlights On', icon: '💡', alert: false },
  { label: 'Windows Open', icon: '🪟', alert: false },
  { label: 'Emergency', icon: '🆘', alert: true },
  { label: 'Lost Vehicle', icon: '🔍', alert: false },
  { label: 'Abandoned', icon: '⚠️', alert: false },
]

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container text-center">
            <div className={`t-label-caps ${styles.badge}`}>Platform Features</div>
            <h1 className="t-display" style={{ marginBottom: 20 }}>Built for every moment on the road</h1>
            <p className="t-body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: 540, margin: '0 auto' }}>
              From the moment a stranger spots your vehicle to the day your insurance expires — RoadLink has you covered.
            </p>
          </div>
        </section>

        {/* Deep dives */}
        {deepDives.map((d, i) => {
          const Icon = d.icon
          return (
            <section key={i} className={styles.deepSection} style={{ background: i % 2 === 1 ? 'var(--surface-container-low)' : 'var(--fog)' }}>
              <div className={`container ${styles.deepInner}`} style={{ flexDirection: d.imageRight ? 'row-reverse' : 'row' }}>
                <div className={styles.deepText}>
                  <div className={styles.deepTag}>
                    <Icon size={14} />
                    {d.tag}
                  </div>
                  <h2 className="t-headline-lg" style={{ marginBottom: 16 }}>{d.headline}</h2>
                  <p className="t-body-lg" style={{ color: 'var(--on-surface-variant)', lineHeight: 1.65 }}>{d.body}</p>
                </div>
                <PhoneFrame className={styles.deepPhone}>
                  {d.phone}
                </PhoneFrame>
              </div>
            </section>
          )
        })}

        {/* 12 categories grid */}
        <section className={styles.catSection}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 48 }}>
              <div className={`t-label-caps ${styles.badge}`}>Report Categories</div>
              <h2 className="t-headline-lg">12 ways to notify an owner</h2>
              <p className="t-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: 12 }}>Emergency and Theft categories alert the owner across all channels simultaneously.</p>
            </div>
            <div className={styles.catGrid}>
              {reportCategories.map((c, i) => (
                <div key={i} className={`${styles.catCard} ${c.alert ? styles.catAlert : ''}`}>
                  <span className={styles.catIcon}>{c.icon}</span>
                  <span className="t-body-sm" style={{ fontWeight: 600 }}>{c.label}</span>
                  {c.alert && <AlertTriangle size={12} color="var(--alert-red)" style={{ marginLeft: 'auto' }} />}
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
