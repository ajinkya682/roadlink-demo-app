import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Shield, Bell, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Button from '../../components/Button';
import styles from './Splash.module.css';

const slides = [
  {
    icon: QrCode,
    iconColor: '#1B4B8F',
    title: 'One QR. One Identity.',
    sub: 'The secure digital identity for your vehicle, built for the Indian road.',
    visual: (
      <div className={styles.slideVisual}>
        <div className={styles.qrBox}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <rect x="5" y="5" width="40" height="40" rx="6" fill="#1A1A1A" />
            <rect x="13" y="13" width="24" height="24" rx="3" fill="#F7F8FA" />
            <rect x="19" y="19" width="12" height="12" fill="#1A1A1A" />
            <rect x="55" y="5" width="40" height="40" rx="6" fill="#1A1A1A" />
            <rect x="63" y="13" width="24" height="24" rx="3" fill="#F7F8FA" />
            <rect x="69" y="19" width="12" height="12" fill="#1A1A1A" />
            <rect x="5" y="55" width="40" height="40" rx="6" fill="#1A1A1A" />
            <rect x="13" y="63" width="24" height="24" rx="3" fill="#F7F8FA" />
            <rect x="19" y="69" width="12" height="12" fill="#1A1A1A" />
            <rect x="55" y="55" width="12" height="12" fill="#1A1A1A" rx="2" />
            <rect x="73" y="55" width="12" height="12" fill="#1A1A1A" rx="2" />
            <rect x="55" y="73" width="12" height="12" fill="#1A1A1A" rx="2" />
            <rect x="73" y="73" width="22" height="12" fill="#1A1A1A" rx="2" />
          </svg>
        </div>
        <div className={styles.qrLabel}>ROADLINK-MH14AB1234</div>
      </div>
    ),
  },
  {
    icon: Shield,
    iconColor: '#1E8E5A',
    title: 'We Never Show Your Number.',
    sub: 'Anyone can reach you through RoadLink. No one can ever see your phone number.',
    visual: (
      <div className={styles.slideVisual}>
        <div className={styles.privacyCard}>
          <div className={styles.privacyRow} style={{ color: 'var(--on-surface)', fontWeight: 600 }}>Honda Activa</div>
          <div className={styles.privacyRow} style={{ textDecoration: 'line-through', color: '#D93025', opacity: 0.55 }}>+91 98765 43210</div>
          <div className={styles.privacyBadge}>
            <Shield size={12} />
            Number Hidden
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Bell,
    iconColor: '#F5A623',
    title: 'Reported the Moment It Matters.',
    sub: 'From wrong parking to a real emergency — the right people know instantly.',
    visual: (
      <div className={styles.slideVisual}>
        <div className={styles.notifStack}>
          {[
            { type: 'Wrong Parking', time: 'Just now', color: '#F5A623' },
            { type: 'Vehicle Theft', time: '3 min ago', color: '#D93025' },
            { type: 'Resolved', time: '1 hr ago', color: '#1E8E5A' },
          ].map((n, i) => (
            <motion.div
              key={n.type}
              className={styles.notifCard}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 + 0.3 }}
            >
              <div className={styles.notifDot} style={{ background: n.color }} />
              <div>
                <div className={styles.notifType}>{n.type}</div>
                <div className={styles.notifTime}>{n.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function Splash() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) setCurrent(c => c + 1);
  };

  const isLast = current === slides.length - 1;
  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div className={styles.page}>
      {/* Skip */}
      {!isLast && (
        <button className={styles.skip} onClick={() => navigate('/login')}>Skip</button>
      )}

      {/* Card */}
      <div className={styles.cardWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className={styles.card}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Card header */}
            <div className={styles.cardTop}>
              <span className={styles.ind}>IND</span>
              <div className={styles.iconBadge} style={{ background: slide.iconColor }}>
                <Icon size={20} color="#fff" />
              </div>
            </div>

            {/* Visual */}
            {slide.visual}

            {/* Text */}
            <div className={styles.cardText}>
              <h2 className={styles.slideTitle}>{slide.title}</h2>
              <p className={styles.slideSub}>{slide.sub}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className={styles.bottom}>
        {/* Dots */}
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={styles.dot}
              animate={{ width: current === i ? 24 : 8, background: current === i ? 'var(--primary-container)' : '#dcd9d9' }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            />
          ))}
        </div>

        {isLast ? (
          <div className={styles.finalBtns}>
            <Button fullWidth onClick={() => navigate('/login')}>Get Started</Button>
            <Button variant="outline" fullWidth onClick={() => navigate('/guest-dashboard')}>
              Continue as Guest
            </Button>
          </div>
        ) : (
          <Button fullWidth onClick={next}>
            Next <ChevronRight size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}
