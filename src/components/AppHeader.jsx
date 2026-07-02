import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './AppHeader.module.css';

export default function AppHeader({ title, rightSlot, onBack, transparent = false }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <motion.header
      className={`${styles.header} ${transparent ? styles.transparent : ''}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <motion.button
        className={styles.backBtn}
        onClick={handleBack}
        whileTap={{ scale: 0.88 }}
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </motion.button>

      {title && (
        <h1 className={styles.title}>{title}</h1>
      )}

      <div className={styles.right}>
        {rightSlot || null}
      </div>
    </motion.header>
  );
}
