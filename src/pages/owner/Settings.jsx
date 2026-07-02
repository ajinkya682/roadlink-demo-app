import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Shield, Phone, FileText, User, ChevronRight } from 'lucide-react';
import AppHeader from '../../components/AppHeader';
import BottomTabBar from '../../components/BottomTabBar';
import styles from './Settings.module.css';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

function SettingToggle({ label, sub, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className={styles.row}>
      <div className={styles.rowText}>
        <div className={styles.rowTitle}>{label}</div>
        {sub && <div className={styles.rowSub}>{sub}</div>}
      </div>
      <div className={`${styles.toggle} ${on ? styles.toggleOn : ''}`} onClick={() => setOn(!on)}>
        <motion.div
          className={styles.toggleThumb}
          animate={{ x: on ? 20 : 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      </div>
    </div>
  );
}

function SettingLink({ icon: Icon, label, onClick, danger }) {
  return (
    <motion.div
      className={`${styles.row} ${styles.linkRow} ${danger ? styles.dangerRow : ''}`}
      onClick={onClick}
      whileTap={{ backgroundColor: danger ? 'rgba(217,48,37,0.08)' : 'rgba(26,26,26,0.04)' }}
    >
      <div className={styles.rowLeft}>
        {Icon && <Icon size={20} color={danger ? 'var(--alert-red)' : 'var(--on-surface-variant)'} />}
        <span className={danger ? styles.dangerText : styles.rowTitle}>{label}</span>
      </div>
      {!danger && <ChevronRight size={18} color="var(--outline-variant)" />}
    </motion.div>
  );
}

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <AppHeader title="Settings" />

      <div className={styles.content}>
        <motion.div variants={stagger} initial="hidden" animate="show" className={styles.sectionStack}>
          
          <motion.div variants={fadeUp} className={styles.section}>
            <div className={styles.sectionHeader}>Notifications</div>
            <div className={styles.card}>
              <SettingToggle label="Push Notifications" defaultOn />
              <div className={styles.divider} />
              <SettingToggle label="WhatsApp Alerts" sub="Instant messages from guests" defaultOn />
              <div className={styles.divider} />
              <SettingToggle label="SMS Fallback" sub="If WhatsApp is unreachable" defaultOn />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className={styles.section}>
            <div className={styles.sectionHeader}>Account & Privacy</div>
            <div className={styles.card}>
              <SettingLink icon={User} label="My Profile" />
              <div className={styles.divider} />
              <SettingLink icon={Phone} label="Emergency Contacts" onClick={() => navigate('/emergency-contacts')} />
              <div className={styles.divider} />
              <SettingLink icon={Shield} label="Privacy Controls" />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className={styles.section}>
            <div className={styles.sectionHeader}>Support</div>
            <div className={styles.card}>
              <SettingLink icon={FileText} label="Terms & Privacy Policy" />
              <div className={styles.divider} />
              <SettingLink icon={null} label="Log Out" />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className={styles.section}>
            <div className={styles.card}>
              <SettingLink icon={null} label="Delete Account" danger />
            </div>
          </motion.div>

        </motion.div>
      </div>

      <BottomTabBar />
    </div>
  );
}
