import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Bell, Settings, QrCode, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PlateTag from '../../components/PlateTag';
import BottomTabBar from '../../components/BottomTabBar';
import styles from './Dashboard.module.css';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 200 } },
};

const vehicles = [
  { name: 'Honda Activa', plate: 'MH 14 AB 1234', alert: 1, added: 'Jun 2025' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.logo}>RoadLink</h1>
          <p className={styles.greeting}>Good morning</p>
        </div>
        <div className={styles.headerRight}>
          <motion.button
            className={styles.iconBtn}
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate('/notifications')}
          >
            <Bell size={22} strokeWidth={1.75} />
            <motion.div
              className={styles.notifBadge}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
            />
          </motion.button>
          <motion.button
            className={styles.iconBtn}
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate('/settings')}
          >
            <Settings size={22} strokeWidth={1.75} />
          </motion.button>
        </div>
      </div>

      <motion.div
        className={styles.list}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Vehicle cards */}
        {vehicles.map((v) => (
          <motion.div
            key={v.plate}
            variants={fadeUp}
            className={styles.vehicleCard}
            onClick={() => navigate('/vehicle-detail')}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.cardTop}>
              <div>
                <h2 className={styles.vehicleName}>{v.name}</h2>
                <span className={styles.vehicleAdded}>Added {v.added}</span>
              </div>
              <motion.button
                className={styles.qrBtn}
                whileTap={{ scale: 0.88 }}
                onClick={e => { e.stopPropagation(); navigate('/qr-detail'); }}
              >
                <QrCode size={20} />
                {v.alert > 0 && <div className={styles.qrBadge} />}
              </motion.button>
            </div>
            <PlateTag plateNumber={v.plate} size="md" />
            {v.alert > 0 && (
              <div className={styles.alertBanner}>
                <span className={styles.alertDot} />
                {v.alert} new notification — tap to view
              </div>
            )}
          </motion.div>
        ))}

        {/* Add vehicle */}
        <motion.div
          variants={fadeUp}
          className={styles.addCard}
          onClick={() => navigate('/add-vehicle')}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={22} color="var(--primary-container)" />
          <span className={styles.addText}>Add another vehicle</span>
          <ChevronRight size={18} color="var(--on-surface-variant)" />
        </motion.div>
      </motion.div>

      <BottomTabBar />
    </div>
  );
}
