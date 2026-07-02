import { BellRing, Shield, FileText, Share2, MapPin, Search } from 'lucide-react';
import FadeIn from '../../components/FadeIn';
import styles from './page.module.css';

const features = [
  {
    icon: BellRing,
    title: 'Instant Notifications',
    desc: 'Receive alerts via Push Notification and WhatsApp the moment someone scans your vehicle.',
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.1)'
  },
  {
    icon: Shield,
    title: 'Zero Phone Number Sharing',
    desc: 'Your privacy is non-negotiable. The scanner communicates with you through our secure relay without ever seeing your number.',
    color: '#1E8E5A',
    bg: 'rgba(30,142,90,0.1)'
  },
  {
    icon: FileText,
    title: 'Digital Document Vault',
    desc: 'Store your RC, Insurance, and PUC in one encrypted vault. Get reminded 30 days before they expire.',
    color: '#1B4B8F',
    bg: 'rgba(27,75,143,0.1)'
  },
  {
    icon: Share2,
    title: 'Emergency Contacts',
    desc: 'In case of an accident or severe emergency alert, we automatically notify your configured family members.',
    color: '#D93025',
    bg: 'rgba(217,48,37,0.1)'
  },
  {
    icon: MapPin,
    title: 'Location Context',
    desc: 'The reporter can optionally share their GPS location so you know exactly where the issue is happening.',
    color: '#003470',
    bg: 'rgba(0,52,112,0.1)'
  },
  {
    icon: Search,
    title: 'Number Plate Search',
    desc: 'No QR code? The reporter can simply type your vehicle number into our web portal to send you a secure alert.',
    color: '#737782',
    bg: 'rgba(115,119,130,0.1)'
  }
];

export default function Features() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <FadeIn direction="up">
          <h1 className={styles.title}>Engineered for <br/>Peace of Mind.</h1>
          <p className={styles.subtitle}>
            A comprehensive suite of tools protecting your vehicle and your privacy on every journey.
          </p>
        </FadeIn>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.grid}>
          {features.map((f, i) => (
            <FadeIn key={i} direction="up" delay={i * 0.1} className={styles.card}>
              <div className={styles.iconBox} style={{ background: f.bg, color: f.color }}>
                <f.icon size={28} />
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  );
}
