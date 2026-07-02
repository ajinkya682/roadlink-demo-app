import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Globe, Smartphone, QrCode } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import AnimatedCounter from '../components/AnimatedCounter';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        
        <FadeIn direction="up" delay={0.1} className={styles.heroContent}>
          <div className={styles.badge}>
            <ShieldCheck size={16} /> Privacy-First Identity
          </div>
          <h1 className={styles.title}>
            The Digital Identity for <br/>
            <span className={styles.highlight}>Your Vehicle.</span>
          </h1>
          <p className={styles.subtitle}>
            RoadLink connects your vehicle to the digital world using a secure, privacy-preserving QR code. Never miss critical alerts about your parked vehicle again.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/download" className={styles.primaryCta}>
              Get the App <ArrowRight size={20} />
            </Link>
            <Link href="/how-it-works" className={styles.secondaryCta}>
              See How It Works
            </Link>
          </div>
        </FadeIn>

        {/* Floating App Mockups */}
        <FadeIn direction="up" delay={0.4} className={styles.mockupContainer}>
          <div className={styles.phoneMockup}>
            <div className={styles.phoneScreen}>
              <div className={styles.appHeader}>
                <div className={styles.appLogo}>RoadLink</div>
                <div className={styles.notifBadge} />
              </div>
              <div className={styles.plateTag}>MH 14 AB 1234</div>
              <div className={styles.alertCard}>
                <div className={styles.alertDot} />
                <div>
                  <div style={{fontSize:14, fontWeight:600}}>Wrong Parking</div>
                  <div style={{fontSize:11, color:'#737782'}}>Just now</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.stickerMockup}>
            <QrCode size={48} color="#003470" />
            <div className={styles.stickerText}>SCAN TO NOTIFY</div>
          </div>
        </FadeIn>
      </section>

      {/* Trust Bar */}
      <section className={styles.trustBar}>
        <FadeIn direction="up" delay={0.1}>
          <div className={styles.trustMetric}>
            <div className={styles.trustNumber}><AnimatedCounter value={500} suffix="K+" /></div>
            <div className={styles.trustLabel}>Vehicles Secured</div>
          </div>
        </FadeIn>
        <div className={styles.trustDivider} />
        <FadeIn direction="up" delay={0.2}>
          <div className={styles.trustMetric}>
            <div className={styles.trustNumber}><AnimatedCounter value={2} suffix="M+" /></div>
            <div className={styles.trustLabel}>Alerts Delivered</div>
          </div>
        </FadeIn>
        <div className={styles.trustDivider} />
        <FadeIn direction="up" delay={0.3}>
          <div className={styles.trustMetric}>
            <div className={styles.trustNumber}><AnimatedCounter value={100} suffix="%" /></div>
            <div className={styles.trustLabel}>Privacy Preserved</div>
          </div>
        </FadeIn>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <FadeIn direction="up" className={styles.sectionHeader}>
          <h2>Why Choose RoadLink?</h2>
          <p>We built this from the ground up for the chaos of Indian roads.</p>
        </FadeIn>

        <div className={styles.grid}>
          <FadeIn direction="up" delay={0.1} className={styles.card}>
            <div className={styles.cardIcon}><ShieldCheck size={28} /></div>
            <h3>Total Privacy</h3>
            <p>Anyone can contact you, but no one ever sees your phone number. It stays strictly confidential.</p>
          </FadeIn>

          <FadeIn direction="up" delay={0.2} className={styles.card}>
            <div className={styles.cardIcon}><Zap size={28} /></div>
            <h3>Instant Alerts</h3>
            <p>From wrong parking to a serious emergency, you'll be notified instantly via push and WhatsApp.</p>
          </FadeIn>

          <FadeIn direction="up" delay={0.3} className={styles.card}>
            <div className={styles.cardIcon}><Globe size={28} /></div>
            <h3>No App Required to Scan</h3>
            <p>Anyone with a smartphone camera can scan your sticker and send an alert via their browser.</p>
          </FadeIn>

          <FadeIn direction="up" delay={0.4} className={styles.card}>
            <div className={styles.cardIcon}><Smartphone size={28} /></div>
            <h3>All Vehicles. One Place.</h3>
            <p>Manage your car, bike, and scooter from a single dashboard. Keep their documents in the vault.</p>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
