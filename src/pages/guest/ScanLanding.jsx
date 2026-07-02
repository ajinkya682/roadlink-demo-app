import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PlateTag from '../../components/PlateTag';
import styles from './ScanLanding.module.css';

const categories = [
  { label: 'Wrong Parking', icon: '🅿️', alert: false },
  { label: 'Blocking Road', icon: '🚧', alert: false },
  { label: 'Hit & Run', icon: '💥', alert: false },
  { label: 'Vehicle Damage', icon: '🔨', alert: false },
  { label: 'Tow Alert', icon: '🚚', alert: false },
  { label: 'Headlights On', icon: '💡', alert: false },
  { label: 'Windows Open', icon: '🪟', alert: false },
  { label: 'Lost Vehicle', icon: '🔍', alert: false },
  { label: 'Abandoned', icon: '⚠️', alert: false },
  { label: 'Accident Alert', icon: '🚑', alert: false },
  { label: 'Vehicle Theft', icon: '🚨', alert: true },
  { label: 'Emergency', icon: '🆘', alert: true },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 200 } },
};

export default function ScanLanding() {
  const navigate = useNavigate();

  const handleCategory = (cat) => {
    navigate('/report-detail', { state: { category: cat } });
  };

  return (
    <div className={styles.page}>
      {/* Plate Tag Hero */}
      <div className={styles.plateSection}>
        <PlateTag displayName="Honda Activa" isVerified animate size="lg" />
      </div>

      {/* Prompt */}
      <p className={styles.prompt}>Why are you here?</p>

      {/* Category Grid */}
      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.label}
            variants={itemVariants}
            className={`${styles.catBtn} ${cat.alert ? styles.catAlert : styles.catNormal}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategory(cat)}
          >
            <span className={styles.catIcon}>{cat.icon}</span>
            <span className={styles.catLabel}>{cat.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          This page never shows the owner's phone number.
        </p>
        <span className={styles.brand}>RoadLink</span>
      </footer>
    </div>
  );
}
