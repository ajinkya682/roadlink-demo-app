import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './PlateTag.module.css';

export default function PlateTag({
  plateNumber,
  displayName,
  isVerified = false,
  size = 'md',      // sm | md | lg | hero
  variant = 'default', // default | verified | alert
  animate = false,
  liveTyping = false,
  className = '',
}) {
  const text = plateNumber || displayName || 'MH 00 AA 0000';

  const inner = (
    <div className={`${styles.plate} ${styles[size]} ${styles[variant]} ${className}`}>
      <div className={styles.header}>
        <span className={styles.ind}>IND</span>
        <div className={styles.rivet} />
      </div>
      <div className={styles.body}>
        <span className={styles.number}>{text}</span>
        {isVerified && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            className={styles.verifiedIcon}
          >
            <CheckCircle size={size === 'lg' || size === 'hero' ? 22 : 16} />
          </motion.span>
        )}
      </div>
      {isVerified && <div className={styles.verifiedLabel}>Vehicle Verified</div>}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 120 }}
        style={{ perspective: 800 }}
      >
        {inner}
      </motion.div>
    );
  }

  return inner;
}
