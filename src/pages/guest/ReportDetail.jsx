import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import styles from './ReportDetail.module.css';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 200 } } };

export default function ReportDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const cat = location.state?.category || { label: 'Wrong Parking', icon: '🅿️', alert: false };

  const [notes, setNotes] = useState('');
  const [locationShare, setLocationShare] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmergency = cat.alert;

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => navigate('/report-confirmation', { state: { category: cat } }), 1200);
  };

  return (
    <div className={styles.page}>
      <AppHeader title="Report" />

      <div className={styles.content}>
        {/* Category chip */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
          <div className={`${styles.chip} ${cat.alert ? styles.chipAlert : ''}`}>
            <span>{cat.icon}</span>
            <span className={styles.chipLabel}>{cat.label}</span>
          </div>
        </motion.div>

        {isEmergency ? (
          <motion.div variants={stagger} initial="hidden" animate="show" className={styles.emergencyBox}>
            <motion.p variants={fadeUp} className={styles.emergencyText}>
              This alerts the owner immediately across all channels.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button variant="alert" fullWidth onClick={handleSend} isLoading={loading}>
                Send Emergency Alert
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className={styles.form}>
            <motion.div variants={fadeUp}>
              <Input
                label="Notes (optional)"
                placeholder="e.g. blocking the gate entrance"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                maxLength={300}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className={styles.photoZone}>
                <Camera size={28} color="var(--on-surface-variant)" />
                <span className={styles.photoText}>Attach photo or video</span>
                <span className={styles.photoSub}>Optional — helps the owner understand the situation</span>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className={styles.locationRow}>
              <div>
                <div className={styles.locationLabel}>
                  <MapPin size={14} /> Share my location?
                </div>
                <div className={styles.locationSub}>Off by default — helps the owner find the vehicle faster</div>
              </div>
              <div
                className={`${styles.toggle} ${locationShare ? styles.toggleOn : ''}`}
                onClick={() => setLocationShare(v => !v)}
              >
                <div className={styles.toggleThumb} />
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button fullWidth onClick={handleSend} isLoading={loading}>
                Send Notification
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
