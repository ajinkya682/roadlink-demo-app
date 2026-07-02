import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/Button';
import styles from './ReportConfirmation.module.css';

// Animated SVG checkmark
function CheckmarkSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <motion.circle
        cx="40" cy="40" r="36"
        stroke="var(--verified-green)"
        strokeWidth="3"
        fill="rgba(30,142,90,0.08)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.path
        d="M24 41L35 52L56 30"
        stroke="var(--verified-green)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
      />
    </svg>
  );
}

export default function ReportConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const cat = location.state?.category || {};
  const isEmergency = cat.alert;

  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <CheckmarkSVG />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className={styles.textBlock}
        >
          <h1 className={styles.headline}>Notification sent.</h1>
          <p className={styles.sub}>The owner has been notified. No further action needed.</p>
        </motion.div>

        {isEmergency && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className={styles.emergencyBlock}
          >
            <p className={styles.emergencyNote}>If this is a genuine emergency, call immediately:</p>
            <motion.a
              href="tel:112"
              className={styles.callBtn}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.4 }}
            >
              <Phone size={18} />
              Call 112 — Emergency
            </motion.a>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className={styles.doneBtn}
      >
        <Button variant="outline" fullWidth onClick={() => navigate('/guest-dashboard')}>
          Done
        </Button>
      </motion.div>
    </div>
  );
}
