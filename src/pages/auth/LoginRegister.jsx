import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button';
import Input from '../../components/Input';
import styles from './LoginRegister.module.css';

export default function LoginRegister() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setTimeout(() => navigate('/otp'), 800);
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerArea}>
        <div className={styles.headerBg} />
        <h1 className={styles.logo}>RoadLink</h1>
        <p className={styles.tagline}>Every Vehicle. One Identity.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.tabBar}>
            <button
              className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
              onClick={() => setTab('login')}
            >
              Log In
              {tab === 'login' && <motion.div layoutId="auth-line" className={styles.tabLine} />}
            </button>
            <button
              className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
              onClick={() => setTab('register')}
            >
              Sign Up
              {tab === 'register' && <motion.div layoutId="auth-line" className={styles.tabLine} />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <AnimatePresence mode="wait">
              {tab === 'register' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Phone Number"
              prefix="+91"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              maxLength={10}
              autoFocus
            />

            <div className={styles.actions}>
              <Button fullWidth type="submit" disabled={!phone || (tab === 'register' && !name)} isLoading={loading}>
                Get OTP
              </Button>
            </div>
          </form>

          <p className={styles.privacyNote}>
            By continuing, you agree to our Terms of Service. Your number is never shown publicly.
          </p>
        </div>
      </div>
    </div>
  );
}
