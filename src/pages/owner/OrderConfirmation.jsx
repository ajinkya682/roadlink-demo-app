import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import Button from '../../components/Button';
import styles from './OrderConfirmation.module.css';

function CheckmarkSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <motion.circle
        cx="40" cy="40" r="36"
        stroke="var(--primary-container)"
        strokeWidth="3"
        fill="rgba(27,75,143,0.08)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.path
        d="M24 41L35 52L56 30"
        stroke="var(--primary-container)"
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

export default function OrderConfirmation() {
  const navigate = useNavigate();

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
          <h1 className={styles.headline}>Order Placed Successfully</h1>
          <p className={styles.sub}>Order ID: #ORD-987654</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          className={styles.deliveryBlock}
        >
          <Truck size={24} color="var(--primary-container)" />
          <div>
            <div className={styles.deliveryTitle}>Estimated Delivery</div>
            <div className={styles.deliverySub}>3 - 5 Business Days</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className={styles.doneBtn}
      >
        <Button fullWidth onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
