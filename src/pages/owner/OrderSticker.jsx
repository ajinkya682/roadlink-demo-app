import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, ShieldCheck } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import styles from './OrderSticker.module.css';

export default function OrderSticker() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1) setStep(2);
    else {
      setLoading(true);
      setTimeout(() => navigate('/order-confirmation'), 1500);
    }
  };

  return (
    <div className={styles.page}>
      <AppHeader title="Order Sticker" />

      <div className={styles.content}>
        {/* Progress indicator */}
        <div className={styles.progress}>
          <div className={styles.dotLine} />
          <div className={`${styles.dot} ${step >= 1 ? styles.dotActive : ''}`} />
          <div className={`${styles.dot} ${step >= 2 ? styles.dotActive : ''}`} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={styles.stepBlock}
            >
              <div className={styles.productCard}>
                <div className={styles.productVisual}>
                  <div className={styles.stickerMock}>
                    ⊞<br/><span style={{fontSize: 8, letterSpacing: '0.1em'}}>ROADLINK</span>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productTitle}>Reflective Smart Sticker</div>
                  <div className={styles.productSub}>High visibility at night, weatherproof</div>
                  <div className={styles.price}>₹149</div>
                </div>
              </div>

              <div className={styles.features}>
                <div className={styles.feat}><Package size={16} /> Premium 3M material</div>
                <div className={styles.feat}><Truck size={16} /> Free shipping pan-India</div>
                <div className={styles.feat}><ShieldCheck size={16} /> 1-year replacement</div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={styles.stepBlock}
            >
              <h2 className={styles.sectionTitle}>Shipping Details</h2>
              <Input label="Full Name" placeholder="e.g. Rahul Sharma" autoFocus />
              <Input label="Address" placeholder="House/Flat No., Street" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input label="City" placeholder="Pune" />
                <Input label="PIN Code" type="tel" maxLength={6} placeholder="411014" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.bottom}>
        <Button fullWidth onClick={handleNext} isLoading={loading}>
          {step === 1 ? 'Continue to Shipping' : 'Pay ₹149 via Razorpay'}
        </Button>
      </div>
    </div>
  );
}
