import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import AppHeader from '../../components/AppHeader';
import PlateTag from '../../components/PlateTag';
import Button from '../../components/Button';
import styles from './NotificationDetail.module.css';

export default function NotificationDetail() {
  const navigate = useNavigate();
  const [resolved, setResolved] = useState(false);

  const handleResolve = () => {
    setResolved(true);
    setTimeout(() => navigate(-1), 1000);
  };

  return (
    <div className={styles.page}>
      <AppHeader title="Alert Detail" transparent />

      <div className={styles.mapBg}>
        {/* Mock Map Background */}
        <motion.div
          className={styles.mapImage}
          initial={{ filter: 'blur(10px)', scale: 1.1 }}
          animate={{ filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        <div className={styles.mapPin}>
          <div className={styles.pinPulse} />
          <MapPin size={24} color="#D93025" fill="#fff" />
        </div>
      </div>

      <motion.div
        className={styles.sheet}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className={styles.sheetHandle} />
        
        <div className={styles.headerRow}>
          <div>
            <div className={styles.type}>Wrong Parking</div>
            <div className={styles.time}>10 mins ago</div>
          </div>
          <PlateTag plateNumber="MH 14 AB 1234" size="sm" />
        </div>

        <div className={styles.notesBox}>
          "Blocking the main gate entrance, please move immediately."
        </div>

        <div className={styles.locationMeta}>
          <div className={styles.metaIcon}><MapPin size={16} /></div>
          <div>
            <div className={styles.metaTitle}>Kalyani Nagar, Pune</div>
            <div className={styles.metaSub}>Location shared by reporter</div>
          </div>
          <button className={styles.navBtn}><Navigation size={18} /></button>
        </div>

        <div className={styles.actions}>
          <motion.div animate={resolved ? { scale: 0.95, opacity: 0.8 } : {}}>
            <Button
              fullWidth
              onClick={handleResolve}
              style={{
                background: resolved ? 'var(--verified-green)' : 'transparent',
                borderColor: resolved ? 'var(--verified-green)' : 'var(--outline-variant)',
                color: resolved ? '#fff' : 'var(--on-surface)',
                borderWidth: '1.5px',
                borderStyle: 'solid'
              }}
            >
              {resolved ? <><Check size={18} /> Resolved</> : 'Mark as Resolved'}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
