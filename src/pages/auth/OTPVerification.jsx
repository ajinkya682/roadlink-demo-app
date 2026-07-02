import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import styles from './OTPVerification.module.css';

export default function OTPVerification() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleDigit = useCallback((index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits]);

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = digits.join('');
    if (code.length < 6) return;
    setLoading(true);

    // Demo: 123456 is correct; anything else shakes
    setTimeout(() => {
      if (code === '123456') {
        navigate('/add-vehicle');
      } else {
        setLoading(false);
        setShake(true);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setTimeout(() => setShake(false), 600);
      }
    }, 900);
  };

  const allFilled = digits.every(d => d !== '');

  return (
    <div className={styles.page}>
      <AppHeader title="Verify Phone" />

      <div className={styles.content}>
        <div className={styles.head}>
          <h1 className={styles.headline}>Enter the 6-digit code</h1>
          <p className={styles.sub}>Sent to +91 98•••••210</p>
        </div>

        <motion.div
          className={styles.boxes}
          animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {digits.map((d, i) => (
            <motion.div
              key={i}
              className={`${styles.boxWrap} ${d ? styles.boxFilled : ''}`}
              animate={d ? { scale: [1, 1.12, 1] } : {}}
              transition={{ type: 'spring', damping: 12, stiffness: 300 }}
            >
              <input
                ref={el => inputRefs.current[i] = el}
                className={styles.box}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            </motion.div>
          ))}
        </motion.div>

        <p className={styles.hint}>Try 1 2 3 4 5 6 to verify</p>

        <Button fullWidth onClick={handleVerify} disabled={!allFilled} isLoading={loading}>
          Verify
        </Button>

        <div className={styles.resend}>
          <span className={styles.resendText}>Resend code in </span>
          <span className={styles.resendTimer}>0:59</span>
        </div>
      </div>
    </div>
  );
}
