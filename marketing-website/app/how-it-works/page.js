import { Smartphone, QrCode, BellRing, CheckCircle } from 'lucide-react';
import FadeIn from '../../components/FadeIn';
import styles from './page.module.css';

const steps = [
  {
    icon: Smartphone,
    title: '1. Register Your Vehicle',
    desc: 'Download the RoadLink app, enter your vehicle number, and verify your phone number. Your data is encrypted and stored securely.'
  },
  {
    icon: QrCode,
    title: '2. Get Your Smart Sticker',
    desc: 'Order the reflective RoadLink QR sticker directly from the app. Stick it on your windshield or bike visor.'
  },
  {
    icon: BellRing,
    title: '3. Anyone Can Scan',
    desc: 'If you are parked wrong, or there is an emergency, anyone can scan the sticker using their phone camera. No app required for them.'
  },
  {
    icon: CheckCircle,
    title: '4. You Get Notified',
    desc: 'You instantly receive an alert on your phone (Push Notification + WhatsApp). Your number remains 100% hidden from the person who scanned.'
  }
];

export default function HowItWorks() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <FadeIn direction="up">
          <h1 className={styles.title}>Simple. Secure. <br/>Seamless.</h1>
          <p className={styles.subtitle}>
            Getting started with RoadLink takes less than 2 minutes.
          </p>
        </FadeIn>
      </section>

      <section className={styles.timelineSection}>
        <div className={styles.timeline}>
          {steps.map((step, i) => (
            <div key={i} className={styles.stepBlock}>
              <div className={styles.line} />
              
              <FadeIn direction="right" delay={i * 0.15} className={styles.stepVisual}>
                <div className={styles.iconNode}>
                  <step.icon size={24} />
                </div>
              </FadeIn>
              
              <FadeIn direction="left" delay={i * 0.15} className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </FadeIn>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
